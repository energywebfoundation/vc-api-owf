/*
 * Copyright 2021 - 2023 Energy Web Foundation
 * SPDX-License-Identifier: Apache-2.0
 */

import { VerificationResult } from '../../credentials/types/verification-result';
// TODO: move to a common place (can probably be in the credentials module)
import { VerifiablePresentation } from '../../exchanges/types/verifiable-presentation';

export class PresentationSubmission {
  constructor(vp: VerifiablePresentation, verificationResult: VerificationResult) {
    this.verifiablePresentation = vp;
    this.verificationResult = verificationResult;
  }
  /**
   * The result of the verification of the submitted VP
   */
  verificationResult: VerificationResult;

  verifiablePresentation: VerifiablePresentation;
}
