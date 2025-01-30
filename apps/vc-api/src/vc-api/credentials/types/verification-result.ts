/*
 * Copyright 2021 - 2023 Energy Web Foundation
 * SPDX-License-Identifier: Apache-2.0
 */

import { ProblemDetail } from './problem-detail';

/**
 * A response object from verification of a credential or a presentation.
 * https://w3c-ccg.github.io/vc-api/verifier.html
 */
export interface VerificationResult {
  /**
   * Warnings
   * Deprecated: replaced by problem details
   */
  warnings?: ProblemDetail[];

  /**
   * Errors
   * Deprecated: replaced by problem details
   */
  errors?: ProblemDetail[];

  /**
   * Problem details
   */
  problemDetails: ProblemDetail[];

  /**
   * Verification status
   */
  verified: boolean;
}
