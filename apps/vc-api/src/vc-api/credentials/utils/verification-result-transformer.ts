/*
 * Copyright 2021 - 2023 Energy Web Foundation
 * SPDX-License-Identifier: Apache-2.0
 */

import { W3cVerifyCredentialResult, W3cVerifyPresentationResult } from '@credo-ts/core';
import { VerificationResultDto } from '../dtos/verification-result.dto';

/**
 * This function reduces repeatability of code when tranforming the verification result
 */
export function transformVerificationResult(
  verificationResult: W3cVerifyCredentialResult | W3cVerifyPresentationResult
): VerificationResultDto {
  const errors = verificationResult.isValid
    ? []
    : verificationResult.error['errors'].map((e) => {
        return { title: e.message };
      });
  const warnings = [];
  return {
    verified: verificationResult.isValid,
    errors,
    warnings,
    problemDetails: [...errors, ...warnings]
  };
}
