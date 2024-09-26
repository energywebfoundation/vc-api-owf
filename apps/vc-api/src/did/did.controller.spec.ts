/*
 * Copyright 2021 - 2023 Energy Web Foundation
 * SPDX-License-Identifier: Apache-2.0
 */

import { Test, TestingModule } from '@nestjs/testing';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TypeOrmSQLiteModule } from '../db-config';
import { KeyModule } from '../key/key.module';
import { DIDController } from './did.controller';
import { DIDService } from './did.service';
import { DIDDocumentEntity } from './entities/did-document.entity';
import { VerificationMethodEntity } from './entities/verification-method.entity';
import { CredoModule } from '../credo/credo.module';

describe('DidController', () => {
  let controller: DIDController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        KeyModule,
        CredoModule,
        TypeOrmSQLiteModule(true),
        TypeOrmModule.forFeature([DIDDocumentEntity, VerificationMethodEntity])
      ],
      controllers: [DIDController],
      providers: [DIDService]
    }).compile();

    controller = module.get<DIDController>(DIDController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  // describe('create', () => {
  //   it('should create an ethr DID', async () => {
  //     await controller.create({ method: DidMethod.ethr });
  //   });
  // });
});
