/*
 * Copyright 2021 - 2023 Energy Web Foundation
 * SPDX-License-Identifier: Apache-2.0
 */

import { Test, TestingModule } from '@nestjs/testing';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JWK } from 'jose';
import { TypeOrmSQLiteModule } from '../db-config';
import { KeyPair } from './key-pair.entity';
import { KeyService } from './key.service';
import { CredoModule } from '../credo/credo.module';
import { CredoService } from '../credo/credo.service';
import { mockCredoService } from '../credo/__mocks__/credo.service';
import { Base64ToBase58 } from '../utils/crypto.utils';
import { keyEntryObject, createdKey } from '../../test/key/key.service.spec.data';
import { keyType } from './key-types';

describe('KeyService', () => {
  let service: KeyService;
  let newPublicKey: JWK;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [TypeOrmSQLiteModule(true), TypeOrmModule.forFeature([KeyPair]), CredoModule],
      providers: [
        KeyService,
        {
          provide: CredoService,
          useValue: mockCredoService
        }
      ]
    }).compile();

    service = module.get<KeyService>(KeyService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should return undefined if asked for privateKey that it does not have', async () => {
    jest.spyOn(mockCredoService.wallet, 'withSession').mockImplementation(async (callback) => {
      return await callback({
        fetchKey: jest.fn().mockResolvedValue(null)
      });
    });
    const result = await service.getPublicKeyFromKeyId('thumbprint-of-not-available-key');
    expect(result).toBeUndefined();
  });

  describe('Ed25519', () => {
    beforeEach(async () => {
      jest.spyOn(mockCredoService.agent.wallet, 'createKey').mockResolvedValue(createdKey);
      jest.spyOn(mockCredoService.wallet, 'withSession').mockImplementation(async (callback) => {
        return await callback({
          fetchKey: jest.fn().mockResolvedValue(keyEntryObject)
        });
      });
      const keyDescription = await service.generateKey({ type: keyType.ed25519 });
      newPublicKey = await service.getPublicKeyFromKeyId(keyDescription.keyId);
    });
    keyGenerationTest();
  });

  // describe('Secp256k1', () => {
  //   beforeEach(async () => {
  //     const keyDescription = await service.generateKey({ type: keyType.secp256k1 });
  //     newPublicKey = await service.getPublicKeyFromKeyId(keyDescription.keyId);
  //   });
  //   keyGenerationTest();
  // });

  function keyGenerationTest() {
    /**
     * From https://www.w3.org/TR/did-core/#verification-material :
     * "It is RECOMMENDED that JWK kid values are set to the public key fingerprint [RFC7638]."
     */
    // it('kid of generated key should be thumbprint', async () => {
    //   const thumbprint = await calculateJwkThumbprint(newPublicKey, 'sha256');
    //   expect(newPublicKey.kid).toEqual(thumbprint);
    // });

    it('should generate and retrieve a key', async () => {
      const kid = Base64ToBase58(newPublicKey.x);
      const storedPublicKey = await service.getPublicKeyFromKeyId(kid);
      expect(storedPublicKey).toBeDefined();
      expect(storedPublicKey).toMatchObject(newPublicKey);
    });
  }
});
