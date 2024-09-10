/*
 * Copyright 2021 - 2023 Energy Web Foundation
 * SPDX-License-Identifier: Apache-2.0
 */

import { Test, TestingModule } from '@nestjs/testing';
import { SeederService } from './seeder.service';
import { keyPairFixture } from './fixtures/key-pair.fixture';
import { DIDService } from '../did/did.service';
import { KeyService } from '../key/key.service';
import { CredoModule } from '../credo/credo.module';
import { Base64ToBase58 } from '../utils/crypto.utils';

describe('SeederService', () => {
  let service: SeederService;
  const mockKeyService = { importKey: jest.fn() };
  const mockDIDService = { registerKeyDID: jest.fn() };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [CredoModule],
      providers: [
        {
          provide: KeyService,
          useValue: mockKeyService
        },
        SeederService,
        {
          provide: DIDService,
          useValue: mockDIDService
        }
      ]
    }).compile();

    service = module.get<SeederService>(SeederService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('seed()', function () {
    it('should be defined', async function () {
      expect(service.seed).toBeDefined();
    });

    describe('when called', function () {
      let exception: Error;

      beforeEach(async function () {
        mockKeyService.importKey
          .mockReset()
          .mockResolvedValueOnce({ keyId: 'EMALqbXvBBETNa6wjhJbJMAHiLZotMJYT4KnicduGjii' })
          .mockResolvedValueOnce({ keyId: '5M7AxPh4tTF7kJH3yZoi7AUZSVVF8Xi7QWybrX9vNEPx' });
        mockDIDService.registerKeyDID.mockReset();
        try {
          await service.seed();
        } catch (err) {
          exception = err;
        }
      });

      it('should execute with no error thrown', async function () {
        expect(exception).not.toBeDefined();
      });

      it('should seed all key pairs', async function () {
        expect(mockKeyService.importKey).toHaveBeenCalledTimes(keyPairFixture.length);

        for (const keyPair of keyPairFixture) {
          expect(mockKeyService.importKey).toHaveBeenCalledWith(keyPair);
        }
      });

      it('should register DIDs', async function () {
        expect(mockDIDService.registerKeyDID).toHaveBeenCalledTimes(keyPairFixture.length);
        for (const keyPair of keyPairFixture) {
          const base58pubKey = Base64ToBase58(keyPair.publicKey.x);
          expect(mockDIDService.registerKeyDID).toHaveBeenCalledWith(base58pubKey);
        }
      });
    });
  });
});
