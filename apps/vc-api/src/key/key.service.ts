/*
 * Copyright 2021 - 2023 Energy Web Foundation
 * SPDX-License-Identifier: Apache-2.0
 */

import { BadRequestException, Injectable } from '@nestjs/common';
import { IGenerateKey, IGenerateKeyOptions, IKeyDescription } from '@energyweb/w3c-ccg-webkms';
import { KeyType, WalletCreateKeyOptions, Buffer } from '@credo-ts/core';
import { Jwk, Key, KeyEntryObject } from "@hyperledger/aries-askar-shared";
import { generateKeyPair, exportJWK, GenerateKeyPairResult, JWK, importJWK } from 'jose';
import { InjectRepository } from '@nestjs/typeorm';
import { KeyPair } from './key-pair.entity';
import { Repository } from 'typeorm';
import { keyType } from './key-types';
import { KeyPairDto } from './dtos/key-pair.dto';
import { KeyDescriptionDto } from './dtos/key-description.dto';
import { CredoService } from '../credo/credo.service';
import { Base64ToBase58 } from '../utils/crypto.utils';

// picked 'EdDSA' as 'alg' based on:
// - https://stackoverflow.com/a/66894047
// - https://github.com/panva/jose/issues/210
const ED25519_ALG = 'EdDSA';

/**
 * "jose" package is recommended by OpenID developer: https://openid.net/developers/jwt/
 */
@Injectable()
export class KeyService implements IGenerateKey {
  constructor(
    private readonly credoService: CredoService,
    @InjectRepository(KeyPair)
    private keyRepository: Repository<KeyPair>
  ) {}

  public async generateKey(options: IGenerateKeyOptions): Promise<IKeyDescription> {
    if (options.type === keyType.secp256k1) {
      return await this.generateSecp256k1();
    }
    if (options.type === keyType.ed25519) {
      return await this.generateEd25119();
    }
    throw new Error(`requested key type ${options.type} not supported`);
  }

  /**
   * Get public key for an assymetric key pair.
   *
   * It is probably reasonable that KMS would support returning the public JWK:
   * - E.g. Azure Key Vault `GetKey` returns a `KeyVaultKey` which has a `Key` property which is a JWK
   *   https://docs.microsoft.com/en-us/dotnet/api/azure.security.keyvault.keys.keyvaultkey.key?view=azure-dotnet#Azure_Security_KeyVault_Keys_KeyVaultKey_Key
   *
   * @param keyId Id of the key
   * @returns public JWK corresponding to keyId
   *
   */
  public async getPublicKeyFromKeyId(keyId: string): Promise<JWK> {
    const keyPair = await this.fetchKey(keyId)
    return keyPair ? {
      ...keyPair?.key.jwkPublic
    } : undefined;
  }

  /**
   * Get private key for an asymmetric key pair.
   *
   * It is probably NOT reasonable to expect that KMS would support
   *
   * @param keyId Id of the public key of the key pair
   * @returns private JWK of the key pair
   */
  public async getPrivateKeyFromKeyId(keyId: string): Promise<JWK> {
    const keyPair = await this.fetchKey(keyId)
    return keyPair ? {
      ...keyPair?.key.jwkSecret
    } : undefined;
  }

  /**
   * Import a key pair
   *
   * Currently only works for Ed25519 key as alg is hardcoded
   * @param key
   * @returns
   */
  public async importKey(key: KeyPairDto): Promise<IKeyDescription> {
    if (key.privateKey.crv !== 'Ed25519' || key.publicKey.crv !== 'Ed25519') {
      throw new BadRequestException('Only Ed25519 keys are supported');
    }

    const privateKey = await importJWK(key.privateKey, ED25519_ALG);
    const publicKey = await importJWK(key.publicKey, ED25519_ALG);
    if ('type' in privateKey && 'type' in publicKey) {
      const publicKeyBase58 = Base64ToBase58(key.publicKey.x);
      const keyExists = await this.fetchKey(publicKeyBase58);

      // if key already exists in the wallet
      // returns keyId i.e. publicKeyBase58
      if(keyExists != null) {
        return {
          keyId: publicKeyBase58,
        };
      }

      return await this.saveNewKey({ privateKey, publicKey });
    }
    throw new Error(`importJWK produced incorrect type. public key: ${publicKey}`);
  }

  public async exportKey(keyDescription: KeyDescriptionDto): Promise<KeyPairDto> {
    const key = await this.fetchKey(keyDescription.keyId);
    if (key) {
      return {
        publicKey: {
          ...key.key.jwkPublic,
          kid: keyDescription.keyId,
        },
        privateKey:
        {
          ...key.key.jwkSecret
        }
      }
    }
    return null;
  }

  private async saveNewKey(keyGenResult: GenerateKeyPairResult): Promise<IKeyDescription> {

    const publicKeyJWK = await exportJWK(keyGenResult.publicKey);
    const privateKeyJWK = await exportJWK(keyGenResult.privateKey);

    // Need to check that the properties required by Askar JWK are there
    if (!privateKeyJWK.crv || !privateKeyJWK.x) {
      throw new Error("Missing required properties from private JWK");
    }
    const jwkProps = { ...privateKeyJWK, kty: 'OKP', crv: privateKeyJWK.crv, x: privateKeyJWK.x };
    const privateAskarJwk = Jwk.fromJson(jwkProps);
    
    const key = Key.fromJwk({ jwk: privateAskarJwk });

    if (key.jwkPublic.x !== publicKeyJWK.x) {
      throw new Error(`key pair mismatch. public key: ${publicKeyJWK.x}`);
    }

    const walletKeyCreate: WalletCreateKeyOptions = {
      keyType: KeyType.Ed25519,
      privateKey: Buffer.from(key.secretBytes),
    };
  
    // create key in the Askar Wallet
    const insertedKey = await this.credoService.agent.wallet.createKey(walletKeyCreate);
    
     if (insertedKey) {
      return {
        keyId: insertedKey?.publicKeyBase58,
      };
     }

     throw new Error(`key creation failed`);
  }

  
  public async fetchKey(publicKeyBase58: string): Promise<KeyEntryObject> {
    return (await this.credoService.wallet.withSession(async (session) => 
      (await session.fetchKey({ name: publicKeyBase58 }))
    ));
  }

  private async generateSecp256k1(): Promise<IKeyDescription> {
    const keyGenResult = await generateKeyPair('ES256K');
    return await this.saveNewKey(keyGenResult);
  }

  private async generateEd25119(): Promise<IKeyDescription> {
    const keyGenResult = await generateKeyPair(ED25519_ALG);
    return await this.saveNewKey(keyGenResult);
  }
}
