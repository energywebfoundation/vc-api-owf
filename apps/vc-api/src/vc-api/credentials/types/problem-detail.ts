/*
 * Copyright 2021 - 2023 Energy Web Foundation
 * SPDX-License-Identifier: Apache-2.0
 */

export interface ProblemDetail {
  /**
   * Title
   */
  title: string;

  /**
   * Type
   */
  type?: string;

  /**
   * Status
   */
  status?: string;

  /**
   * Detail
   */
  detail?: string;

  /**
   * Instance
   */
  instance?: any;
}
