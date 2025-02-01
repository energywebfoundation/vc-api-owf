/*
 * Copyright 2021 - 2023 Energy Web Foundation
 * SPDX-License-Identifier: Apache-2.0
 */

import { VerificationResultDto } from '../../credentials/dtos/verification-result.dto';
import { VpRequestDto } from '../dtos/vp-request.dto';
// TODO: move to a common place (can probably be in the credentials module)
import { VerifiablePresentation } from '../../exchanges/types/verifiable-presentation';

/**
 * Intended to represent a verifier of a VP Request Submission.
 * TODO: Maybe shouldn't only be for VPR verification but allow for more generic types.
 */
export interface SubmissionVerifier {
  verifyVpRequestSubmission: (
    vp: VerifiablePresentation,
    vpRequest: VpRequestDto
  ) => Promise<VerificationResultDto>;
}
