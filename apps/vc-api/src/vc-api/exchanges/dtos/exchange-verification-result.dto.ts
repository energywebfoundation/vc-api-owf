/*
 * Copyright 2021 - 2023 Energy Web Foundation
 * SPDX-License-Identifier: Apache-2.0
 */

import { IsArray, IsString } from 'class-validator';
import { ExchangeVerificationResult } from '../types/exchange-verification-result';
import { ApiProperty } from '@nestjs/swagger';

/**
 * A response object from verification of a credential or a presentation.
 * https://w3c-ccg.github.io/vc-api/verifier.html
 */
export class ExchangeVerificationResultDto implements ExchangeVerificationResult {
  @IsArray()
  @IsString({ each: true })
  @ApiProperty({ description: 'Warnings' })
  warnings: string[];

  @IsArray()
  @IsString({ each: true })
  @ApiProperty({ description: 'Errors' })
  errors: string[];

  @ApiProperty({ description: 'Is the credential valid' })
  verified: boolean;
}
