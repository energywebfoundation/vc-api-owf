/*
 * Copyright 2021 - 2023 Energy Web Foundation
 * SPDX-License-Identifier: Apache-2.0
 */

import { Column, Entity } from 'typeorm';
import { v4 as uuidv4 } from 'uuid';
import { WorkflowStepDefinitionDto } from '../dtos/workflow-step-definition.dto';
import { VpRequestDto } from '../dtos/vp-request.dto';
import { ExchangeState } from '../types/exchange-status';
import { VerifiablePresentation } from '../types/verifiable-presentation';
import { SubmissionVerifier } from '../../exchanges/types/submission-verifier';
import { QueryExchangeStep } from '../types/query-exchange-step';
import { IssuanceExchangeStep } from '../types/issuance-exchange-step';
import { ExchangeResponseDto } from '../dtos/exchange-response.dto';
import { CallbackConfiguration } from '../types/callback-configuration';
import { VerificationResultDto } from '../../credentials/dtos/verification-result.dto';
import { plainToInstance } from 'class-transformer';

/**
 * NEW exchange entity (for workflows)
 */
@Entity()
export class WfExchangeEntity {
  constructor(
    workflowId: string,
    initialStepDefinition: WorkflowStepDefinitionDto,
    initialStepId: string,
    baseUrl: string
  ) {
    this.exchangeId = uuidv4();
    this.workflowId = workflowId;
    this.steps = [];
    this.state = ExchangeState.pending;
    if (initialStepDefinition) {
      const initialStep = this.hydrateExchangeStep(initialStepDefinition, initialStepId, baseUrl);
      this.steps.push(initialStep);
    }
  }

  @Column('text', { primary: true })
  exchangeId: string;

  @Column('text')
  workflowId: string;

  @Column('simple-json')
  steps: Array<QueryExchangeStep | IssuanceExchangeStep>;

  @Column('text')
  state: ExchangeState;

  public async participateInExchange(
    presentation: VerifiablePresentation,
    verifier: SubmissionVerifier,
    nextStep: WorkflowStepDefinitionDto,
    nextStepId: string,
    baseUrl: string
  ): Promise<{
    response: ExchangeResponseDto;
    errors: string[];
    callback: CallbackConfiguration[];
    verificationResult: VerificationResultDto;
  }> {
    // set the state to active
    this.state = ExchangeState.active;
    // Get current step
    const currentStep = this.getCurrentStep();
    // Pass presentation to current step to process
    const { errors, verificationResult } = await currentStep.processPresentation(presentation, verifier);
    this.updateCurrentStep(currentStep);
    // If step processing has errors, return errors
    if (errors.length > 0) {
      return {
        response: {},
        errors,
        callback: currentStep.callback,
        verificationResult
      };
    }

    if (currentStep.isComplete) {
      if (nextStep) {
        // As current step is complete, advance step
        const hydratedNextStep = this.hydrateExchangeStep(nextStep, nextStepId, baseUrl);
        this.steps.push(hydratedNextStep);
      } else {
        // if there are no next steps, complete exchange
        this.state = ExchangeState.completed;
      }
    }

    return {
      response: this.getExchangeResponse(),
      errors: [],
      callback: currentStep.callback,
      verificationResult
    };
  }

  /**
   *
   */
  public getExchangeResponse(): ExchangeResponseDto {
    const currentStep = this.getCurrentStep();
    return currentStep.getStepResponse();
  }

  public getCurrentStep(): QueryExchangeStep | IssuanceExchangeStep {
    const currentStep = this.steps.at(-1);
    const vpRequestProperty: keyof QueryExchangeStep = 'vpRequest';
    if (vpRequestProperty in currentStep) {
      return plainToInstance(QueryExchangeStep, currentStep);
    } else {
      return plainToInstance(IssuanceExchangeStep, currentStep);
    }
  }

  private updateCurrentStep(step: QueryExchangeStep | IssuanceExchangeStep): void {
    this.steps[this.steps.length - 1] = step;
  }

  /**
   * Convert from a workflow step definition to an instantiated step for an exchange
   * @param baseUrl
   * @param step
   * @returns
   */
  private hydrateExchangeStep(
    step: WorkflowStepDefinitionDto,
    stepId: string,
    baseUrl: string
  ): QueryExchangeStep | IssuanceExchangeStep {
    const serviceEndpoint = `${baseUrl}/workflows/${this.workflowId}/exchanges/${this.exchangeId}`;
    // Assuming that if step has a VPR, then it is query step
    if (step.verifiablePresentationRequest) {
      const interactServices = step.verifiablePresentationRequest.interactServices.map((serviceDef) => {
        return {
          type: serviceDef.type,
          serviceEndpoint
        };
      });
      const challenge = uuidv4();
      const vpRequest: VpRequestDto = {
        challenge,
        query: step.verifiablePresentationRequest.query,
        interact: {
          service: interactServices
        },
        domain: baseUrl
      };
      return new QueryExchangeStep(stepId, vpRequest, step.callback);
    }
    // If the step doesn't have a VPR, then it must be for issuance
    else {
      return new IssuanceExchangeStep(stepId, step.callback, serviceEndpoint);
    }
  }

  public getStep(stepId: string): QueryExchangeStep | IssuanceExchangeStep {
    const step = this.steps.find((step) => step.stepId === stepId);
    const vpRequestProperty: keyof QueryExchangeStep = 'vpRequest';
    if (vpRequestProperty in step) {
      return plainToInstance(QueryExchangeStep, step);
    } else {
      return plainToInstance(IssuanceExchangeStep, step);
    }
  }
}
