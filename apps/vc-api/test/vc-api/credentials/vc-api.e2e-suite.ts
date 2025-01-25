/*
 * Copyright 2021 - 2023 Energy Web Foundation
 * SPDX-License-Identifier: Apache-2.0
 */

import * as nock from 'nock';
import * as request from 'supertest';
import { CredentialDto } from '../../../src/vc-api/credentials/dtos/credential.dto';
import { IssueOptionsDto } from '../../../src/vc-api/credentials/dtos/issue-options.dto';
import { app, walletClient } from '../../app.e2e-spec';
import { API_DEFAULT_VERSION_PREFIX } from '../../../src/setup';
import { VerifyCredentialDto } from '../../../src/vc-api/credentials/dtos/verify-credential.dto';

export const vcApiSuite = () => {
  it('should issue simple credential using a generated did:key', async () => {
    const didDoc = await walletClient.createDID('key');
    const credential: CredentialDto = {
      '@context': ['https://www.w3.org/2018/credentials/v1'],
      id: 'http://example.org/credentials/3731',
      type: ['VerifiableCredential'],
      issuer: didDoc.id,
      issuanceDate: '2020-08-19T21:41:50Z',
      credentialSubject: {
        id: 'did:example:d23dd687a7dc6787646f2eb98d0'
      }
    };
    const options: IssueOptionsDto = {};
    const postResponse = await request(app.getHttpServer())
      .post(`${API_DEFAULT_VERSION_PREFIX}/vc-api/credentials/issue`)
      .send({ credential, options })
      .expect(201);
    expect(postResponse.body).toBeDefined();
  });

  it('should issue credential with remote context using a generated did:key', async () => {
    const didDoc = await walletClient.createDID('key');
    const remoteContextBase = 'https://example.com';
    const remoteContextPath = '/remote-ld-context';
    const remoteContext = {
      '@context': {
        '@version': 1.1,
        '@protected': true,
        examplebase: `${remoteContextBase}${remoteContextPath}#`,
        consent: 'examplebase:consent',
        ConsentCredential: 'examplebase:ConsentCredential'
      }
    };
    const contextLoadScope = nock(remoteContextBase)
      .persist()
      .get(remoteContextPath)
      .reply(200, remoteContext);

    const credential: CredentialDto = {
      '@context': ['https://www.w3.org/2018/credentials/v1', `${remoteContextBase}${remoteContextPath}`],
      id: 'urn:uuid:49f69fb8-f256-4b2e-b15d-c7ebec3a507e',
      type: ['VerifiableCredential', 'ConsentCredential'],
      credentialSubject: {
        consent: 'I consent to such and such',
        id: 'did:key:z6MkfGg96cNEL2Ne4z9HD3BSQhhD2neZKTzyE1y5wUu9KM4h'
      },
      issuer: didDoc.id,
      issuanceDate: '2022-10-03T12:19:52Z'
    };
    const issueOptions: IssueOptionsDto = {};
    const issueResponse = await request(app.getHttpServer())
      .post(`${API_DEFAULT_VERSION_PREFIX}/vc-api/credentials/issue`)
      .send({ credential, options: issueOptions })
      .expect(201);
    expect(issueResponse.body).toBeDefined();
    contextLoadScope.done();

    const verifiableCredential = issueResponse.body;
    const verifyRequestBody: VerifyCredentialDto = { verifiableCredential };
    await request(app.getHttpServer())
      .post(`${API_DEFAULT_VERSION_PREFIX}/vc-api/credentials/verify`)
      .send(verifyRequestBody)
      .expect(200);
  });
};
