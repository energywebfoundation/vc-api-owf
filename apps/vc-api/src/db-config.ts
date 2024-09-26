/*
 * Copyright 2021 - 2023 Energy Web Foundation
 * SPDX-License-Identifier: Apache-2.0
 */

import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';

/**
 * Inspired by https://dev.to/webeleon/unit-testing-nestjs-with-typeorm-in-memory-l6m
 * @param inMemory // default set to false; set to true for unit testing
 */
export const TypeOrmSQLiteModule = (inMemory = false) =>
  TypeOrmModule.forRootAsync({
    imports: [ConfigModule],
    useFactory: async (configService: ConfigService) => ({
      type: 'sqlite',
      database: !inMemory ? `${configService.get<string>('DB_BASE_PATH')}/exchanges.db` : ':memory:',
      // dropSchema: true, // disabling this option to avoid dropping askar tables
      autoLoadEntities: true, // https://docs.nestjs.com/techniques/database#auto-load-entities
      synchronize: true,
      keepConnectionAlive: true // https://github.com/nestjs/typeorm/issues/61
    }),
    inject: [ConfigService]
  });
