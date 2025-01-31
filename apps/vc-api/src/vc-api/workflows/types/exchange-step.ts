/*
 * Copyright 2021 - 2023 Energy Web Foundation
 * SPDX-License-Identifier: Apache-2.0
 */

import { ExchangeResponseDto } from '../dtos/exchange-response.dto';
import { CallbackConfiguration } from './callback-configuration';
import { VerifiablePresentation } from '../types/verifiable-presentation';
import { SubmissionVerifier } from './submission-verifier';
import { VerificationResultDto } from '../../credentials/dtos/verification-result.dto';

export const EXCHANGE_STEP_STATES = {
  IN_PROGRESS: 'in-progress',
  COMPLETE: 'complete'
} as const;

export type ExchangeStepState = (typeof EXCHANGE_STEP_STATES)[keyof typeof EXCHANGE_STEP_STATES];

export abstract class ExchangeStep {
  constructor(stepId: string, callback: CallbackConfiguration[], type: string) {
    this.stepId = stepId;
    this.callback = callback;
    this.type = type;
    this._state = EXCHANGE_STEP_STATES.IN_PROGRESS;
  }

  stepId: string;
  private _state: ExchangeStepState;
  callback: CallbackConfiguration[];
  type: string;

  public abstract processPresentation(
    presentation: VerifiablePresentation,
    verifier: SubmissionVerifier
  ): Promise<{ errors: string[]; verificationResult: VerificationResultDto }>;

  public abstract getStepResponse(): ExchangeResponseDto;

  public get isComplete(): boolean {
    return this._state == EXCHANGE_STEP_STATES.COMPLETE;
  }

  protected markComplete(): void {
    this._state = EXCHANGE_STEP_STATES.COMPLETE;
  }
}
