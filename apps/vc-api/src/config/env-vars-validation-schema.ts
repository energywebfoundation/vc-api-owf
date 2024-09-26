/*
 * Copyright 2021 - 2023 Energy Web Foundation
 * SPDX-License-Identifier: Apache-2.0
 */

import * as Joi from 'joi';
import { homedir } from 'os';

export const envVarsValidationSchema = Joi.object({
  NODE_ENV: Joi.string().valid('development', 'production', 'test').default('development'),
  PORT: Joi.number().integer().positive().default(3000),
  BASE_URL: Joi.string().uri().default('http://localhost:3000'),
  CREDO_LABEL: Joi.string().default('vc-api-agent'),
  CREDO_WALLET_ID: Joi.string().default('vc-api-wallet'),
  CREDO_WALLET_KEY: Joi.string().default('vc-api-wallet-key-0001'),
  CREDO_WALLET_DB_TYPE: Joi.string().default('sqlite'),
  DB_BASE_PATH: Joi.string().default(`${homedir}/.vc-api`)
});
