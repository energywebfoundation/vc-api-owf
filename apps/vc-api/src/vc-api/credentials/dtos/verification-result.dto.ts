/*
 * Copyright 2021 - 2023 Energy Web Foundation
 * SPDX-License-Identifier: Apache-2.0
 */

import { IsArray } from 'class-validator';
import { VerificationResult } from '../types/verification-result';
import { ApiProperty } from '@nestjs/swagger';
import { ProblemDetail } from '../types/problem-detail';

/**
 * A response object from verification of a credential or a presentation.
 * https://w3c-ccg.github.io/vc-api/verifier.html
 */
export class VerificationResultDto implements VerificationResult {
  @IsArray()
  @ApiProperty({ description: 'Warnings', deprecated: true })
  warnings?: ProblemDetail[];

  @IsArray()
  @ApiProperty({ description: 'Errors', deprecated: true })
  errors?: ProblemDetail[];

  @IsArray()
  @ApiProperty({ description: 'Problem Details', deprecated: true })
  problemDetails: ProblemDetail[];

  @ApiProperty({
    description: `Overall verification assertion of the VerifiableCredential. 
    This is set to True if no errors were detected during the verification process; otherwise, False.`
  })
  verified: boolean;
}
