/*
 * Copyright 2021 - 2023 Energy Web Foundation
 * SPDX-License-Identifier: Apache-2.0
 */

import { VerifiablePresentation } from '../types/verifiable-presentation';
import { CallbackConfiguration } from './callback-configuration';
import { ExchangeStep } from './exchange-step';
import { ExchangeResponseDto } from '../dtos/exchange-response.dto';
import { VerificationResultDto } from '../../credentials/dtos/verification-result.dto';

export class IssuanceExchangeStep extends ExchangeStep {
  constructor(stepId: string, callback: CallbackConfiguration[], holderRedirectUrl: string) {
    super(stepId, callback, 'IssuanceExchangeStep');
    this.holderRedirectUrl = holderRedirectUrl;
  }

  holderRedirectUrl: string;

  issuedVP?: VerifiablePresentation;

  public addVP(issuanceVp: VerifiablePresentation): void {
    this.issuedVP = issuanceVp;
    this.markComplete();
  }

  /**
   * An issuance exchange can process a presentation, but it won't take any action.
   * It is essentially a "no op".
   */
  public processPresentation(): Promise<{
    errors: string[];
    verificationResult: VerificationResultDto;
  }> {
    return Promise.resolve({
      errors: [],
      verificationResult: null
    });
  }

  public getStepResponse(): ExchangeResponseDto {
    if (this.issuedVP) {
      return {
        verifiablePresentation: this.issuedVP
      };
    }
    // As the issuer hasn't provided VP yet, holder needs to poll until response updates
    else {
      return {
        redirectUrl: this.holderRedirectUrl
      };
    }
  }
}
