/*
 * Copyright 2021 - 2023 Energy Web Foundation
 * SPDX-License-Identifier: Apache-2.0
 */

import { Optionality, Rules } from '@sphereon/pex-models';
import { CredentialDto } from 'src/vc-api/credentials/dtos/credential.dto';
import { Presentation } from 'src/vc-api/exchanges/types/presentation';
import { VerifiableCredential } from 'src/vc-api/exchanges/types/verifiable-credential';
import { did } from './credential.service.spec.key';
import { AuthenticateDto } from 'src/vc-api/credentials/dtos/authenticate.dto';
import { VerifiablePresentationDto } from 'src/vc-api/credentials/dtos/verifiable-presentation.dto';
import { VerificationResultDto } from 'src/vc-api/credentials/dtos/verification-result.dto';

export const presentationDefinition = {
  id: '286bc1e0-f1bd-488a-a873-8d71be3c690e',
  submission_requirements: [
    {
      name: 'Energy supplier custom contract',
      purpose: 'An energy supplier contract is needed for Rebeam authorization',
      rule: Rules.All,
      from: 'A'
    },
    {
      name: 'Data needs to be signed by the user',
      purpose: 'Data needs to be signed by the user to end the charging',
      rule: Rules.All,
      from: 'B'
    }
  ],
  input_descriptors: [
    {
      id: 'energy_supplier_customer_contract',
      name: 'Energy Supplier Customer Contract',
      group: ['A'],
      purpose: 'An energy supplier contract is needed for Rebeam authorization',
      constraints: {
        fields: [
          {
            path: ['$.credentialSubject.role.namespace'],
            filter: {
              type: 'string',
              const: 'customer.roles.rebeam.apps.eliagroup.iam.ewc'
            }
          },
          {
            path: ['$.credentialSubject.issuerFields[*].key'],
            filter: {
              type: 'string',
              const: 'accountId'
            }
          }
        ]
      }
    },
    {
      id: 'charging_data',
      name: 'Data needs to be signed by the user',
      group: ['B'],
      purpose: 'Data needs to be signed by the user to end the charging',
      constraints: {
        subject_is_issuer: Optionality.Required,
        fields: [
          {
            path: ['$.credentialSubject.chargingData.contractDID'],
            filter: {
              type: 'string',
              const: 'did:ethr:blxm-local:0x429eCb49aAC34E076f19D5C91d7e8B956AEf9c08'
            }
          },
          {
            path: ['$.credentialSubject.chargingData.evseId'],
            filter: {
              type: 'string',
              const: '123'
            }
          },
          {
            path: ['$.credentialSubject.chargingData.timestamp'],
            filter: {
              type: 'string',
              const: '2022-04-05T15:45:35.346Z'
            }
          },
          {
            path: ['$.credentialSubject.chargingData.kwh'],
            filter: {
              type: 'string',
              const: '5'
            }
          }
        ]
      }
    }
  ]
};

export const energyContractCredential: CredentialDto = {
  '@context': [
    'https://www.w3.org/2018/credentials/v1',
    {
      value: 'ew:value',
      namespace: 'ew:namespace',
      ew: 'https://energyweb.org/ld-context-2022#',
      key: 'ew:key',
      role: { '@id': 'ew:role', '@type': 'ew:Role' },
      version: 'ew:version',
      EWFRole: 'ew:EWFRole',
      issuerFields: { '@id': 'ew:issuerFields', '@type': 'ew:IssuerFields' }
    }
  ],
  id: 'urn:uuid:7f94d397-3e70-4a43-945e-1a13069e636f',
  type: ['VerifiableCredential', 'EWFRole'],
  credentialSubject: {
    id: 'did:example:d23dd687a7dc6787646f2eb98d0',
    issuerFields: [{ key: 'accountId', value: 'energycustomerid1' }],
    role: {
      namespace: 'customer.roles.rebeam.apps.eliagroup.iam.ewc',
      version: '1'
    }
  },
  issuer: did,
  issuanceDate: '2022-03-18T08:57:32.477Z'
};

export const getChargingDataCredential: (issuerDid: string) => CredentialDto = (issuerDid) => {
  return {
    '@context': [
      'https://www.w3.org/2018/credentials/v1',
      {
        timestamp: 'ew:timestamp',
        kwh: 'ew:kwh',
        chargingData: { '@id': 'ew:chargingData', '@type': 'ew:chargingData' },
        ChargingData: 'ew:ChargingData',
        contractDID: 'ew:contractDID',
        evseId: 'ew:evseId',
        ew: 'https://energyweb.org/ld-context-2022#'
      }
    ],
    id: 'urn:uuid:a6032135-75d6-4019-b59d-420168c7cd85',
    type: ['VerifiableCredential', 'ChargingData'],
    credentialSubject: {
      id: issuerDid,
      chargingData: {
        contractDID: 'did:ethr:blxm-local:0x429eCb49aAC34E076f19D5C91d7e8B956AEf9c08',
        evseId: '123',
        kwh: '5',
        timestamp: '2022-04-05T15:45:35.346Z'
      }
    },
    issuer: issuerDid,
    issuanceDate: '2022-03-18T08:57:32.477Z'
  };
};

export const energyContractVerifiableCredential: VerifiableCredential = {
  ...energyContractCredential,
  proof: {
    verificationMethod:
      'did:key:z6MknVzMUmfDwYnWBcnTtVYknYcnP63SiQWTVnjfrGCQhRm9#z6MknVzMUmfDwYnWBcnTtVYknYcnP63SiQWTVnjfrGCQhRm9',
    type: 'Ed25519Signature2018',
    created: '2024-09-05T09:23:26Z',
    proofPurpose: 'assertionMethod',
    jws: 'eyJhbGciOiJFZERTQSIsImI2NCI6ZmFsc2UsImNyaXQiOlsiYjY0Il19..Ldfx8MwoKWt6WARPGPM02OYupP5V76FCsFXlgPCd36Ykqwm7lDAX3QPjplGE_yQtYHnTZsnjN868L-Ls6rREBw'
  }
};

export const chargingDataVerifiableCredential: VerifiableCredential = {
  ...getChargingDataCredential(did),
  proof: {
    type: 'Ed25519Signature2018',
    proofPurpose: 'assertionMethod',
    verificationMethod:
      'did:key:z6MkoB84PJkXzFpbqtfYV5WqBKHCSDf7A1SeepwzvE36QvCF#z6MkoB84PJkXzFpbqtfYV5WqBKHCSDf7A1SeepwzvE36QvCF',
    created: '2021-11-16T14:52:19.514Z',
    jws: 'eyJhbGciOiJFZERTQSIsImNyaXQiOlsiYjY0Il0sImI2NCI6ZmFsc2V9..jR_OEYZlIcsVBfBp-tDWXbnShFlHIEuRkLdocQrclbE-RrqaHER9QYUsIFsz-Xs269gASS0qX37AcjrcrIi3Cw'
  }
};

export const rebeamPresentation: Presentation = {
  '@context': [
    'https://www.w3.org/2018/credentials/v1',
    {
      PresentationSubmission: {
        '@id': 'https://identity.foundation/presentation-exchange/#presentation-submission',
        '@context': {
          '@version': '1.1',
          presentation_submission: {
            '@id': 'https://identity.foundation/presentation-exchange/#presentation-submission',
            '@type': '@json'
          }
        }
      }
    }
  ],
  type: ['VerifiablePresentation', 'PresentationSubmission'],
  holder: undefined,
  presentation_submission: {
    id: 'fNFNZOX44ASUEZFPaopjI',
    definition_id: '286bc1e0-f1bd-488a-a873-8d71be3c690e',
    descriptor_map: [
      {
        id: 'energy_supplier_customer_contract',
        format: 'ldp_vc',
        path: '$.verifiableCredential[0]'
      },
      {
        id: 'charging_data',
        format: 'ldp_vc',
        path: '$.verifiableCredential[1]'
      }
    ]
  },
  verifiableCredential: [energyContractVerifiableCredential, chargingDataVerifiableCredential]
} as Presentation;

export const rebeamVerifiablePresentation = {
  ...rebeamPresentation,
  proof: {
    verificationMethod:
      'did:key:z6Mkif6x1XFzFH67qiiXjQi96HzudWqdsqV76wLQa1vMVy4V#z6Mkif6x1XFzFH67qiiXjQi96HzudWqdsqV76wLQa1vMVy4V',
    type: 'Ed25519Signature2018',
    created: '2024-09-12T06:59:38Z',
    proofPurpose: 'assertionMethod',
    jws: 'eyJhbGciOiJFZERTQSIsImI2NCI6ZmFsc2UsImNyaXQiOlsiYjY0Il19..b6H2ufv0xPwBxAZhSSyOppipkzdpiIKhfZu8NHRZoy0AjL1RIE8XQzaaeumNXUtcRcDALAuawbOf1UxC3_64CQ'
  }
};

export const verifiablePresentation = {
  '@context': ['https://www.w3.org/2018/credentials/v1'],
  type: ['VerifiablePresentation', 'PresentationSubmission'],
  presentation_submission: {
    id: 'ysEtA_34FRA2_uHr3Lwmv',
    definition_id: '286bc1e0-f1bd-488a-a873-8d71be3c690e',
    descriptor_map: [
      {
        id: 'energy_supplier_customer_contract',
        format: 'ldp_vc',
        path: '$.verifiableCredential[0]'
      },
      {
        id: 'charging_data',
        format: 'ldp_vc',
        path: '$.verifiableCredential[1]'
      }
    ]
  },
  verifiableCredential: [
    {
      '@context': [
        'https://www.w3.org/2018/credentials/v1',
        {
          value: 'ew:value',
          namespace: 'ew:namespace',
          ew: 'https://energyweb.org/ld-context-2022#',
          key: 'ew:key',
          role: {
            '@id': 'ew:role',
            '@type': 'ew:Role'
          },
          version: 'ew:version',
          EWFRole: 'ew:EWFRole',
          issuerFields: {
            '@id': 'ew:issuerFields',
            '@type': 'ew:IssuerFields'
          }
        }
      ],
      id: 'urn:uuid:7f94d397-3e70-4a43-945e-1a13069e636f',
      type: ['VerifiableCredential', 'EWFRole'],
      credentialSubject: {
        issuerFields: [
          {
            key: 'accountId',
            value: 'energycustomerid1'
          }
        ],
        role: {
          namespace: 'customer.roles.rebeam.apps.eliagroup.iam.ewc',
          version: '1'
        },
        id: 'did:key:z6Mkif6x1XFzFH67qiiXjQi96HzudWqdsqV76wLQa1vMVy4V'
      },
      issuer: 'did:key:z6Mkif6x1XFzFH67qiiXjQi96HzudWqdsqV76wLQa1vMVy4V',
      issuanceDate: '2022-03-18T08:57:32.477Z',
      proof: {
        verificationMethod:
          'did:key:z6Mkif6x1XFzFH67qiiXjQi96HzudWqdsqV76wLQa1vMVy4V#z6Mkif6x1XFzFH67qiiXjQi96HzudWqdsqV76wLQa1vMVy4V',
        type: 'Ed25519Signature2018',
        created: '2024-09-12T06:59:38Z',
        proofPurpose: 'assertionMethod',
        jws: 'eyJhbGciOiJFZERTQSIsImI2NCI6ZmFsc2UsImNyaXQiOlsiYjY0Il19..b6H2ufv0xPwBxAZhSSyOppipkzdpiIKhfZu8NHRZoy0AjL1RIE8XQzaaeumNXUtcRcDALAuawbOf1UxC3_64CQ'
      }
    },
    {
      '@context': [
        'https://www.w3.org/2018/credentials/v1',
        {
          timestamp: 'ew:timestamp',
          kwh: 'ew:kwh',
          chargingData: {
            '@id': 'ew:chargingData',
            '@type': 'ew:chargingData'
          },
          ChargingData: 'ew:ChargingData',
          contractDID: 'ew:contractDID',
          evseId: 'ew:evseId',
          ew: 'https://energyweb.org/ld-context-2022#'
        }
      ],
      id: 'urn:uuid:a6032135-75d6-4019-b59d-420168c7cd85',
      type: ['VerifiableCredential', 'ChargingData'],
      credentialSubject: {
        chargingData: {
          contractDID: 'did:ethr:blxm-local:0x429eCb49aAC34E076f19D5C91d7e8B956AEf9c08',
          evseId: '123',
          kwh: '5',
          timestamp: '2022-04-05T15:45:35.346Z'
        },
        id: 'did:key:z6Mkif6x1XFzFH67qiiXjQi96HzudWqdsqV76wLQa1vMVy4V'
      },
      issuer: 'did:key:z6Mkif6x1XFzFH67qiiXjQi96HzudWqdsqV76wLQa1vMVy4V',
      issuanceDate: '2022-03-18T08:57:32.477Z',
      proof: {
        verificationMethod:
          'did:key:z6Mkif6x1XFzFH67qiiXjQi96HzudWqdsqV76wLQa1vMVy4V#z6Mkif6x1XFzFH67qiiXjQi96HzudWqdsqV76wLQa1vMVy4V',
        type: 'Ed25519Signature2018',
        created: '2024-09-12T07:01:01Z',
        proofPurpose: 'assertionMethod',
        jws: 'eyJhbGciOiJFZERTQSIsImI2NCI6ZmFsc2UsImNyaXQiOlsiYjY0Il19..fmm_D7phS_zROTFF_3Za6ifhDirktBPpXGSc3dm-JuDzpMeU7rTZND88uq6K0hEumzr5pyQeaMW1KP77nog7AQ'
      }
    }
  ],
  proof: {
    verificationMethod:
      'did:key:z6Mkif6x1XFzFH67qiiXjQi96HzudWqdsqV76wLQa1vMVy4V#z6Mkif6x1XFzFH67qiiXjQi96HzudWqdsqV76wLQa1vMVy4V',
    type: 'Ed25519Signature2018',
    created: '2024-09-12T11:09:21Z',
    proofPurpose: 'authentication',
    challenge: 'some-challenge-2',
    jws: 'eyJhbGciOiJFZERTQSIsImI2NCI6ZmFsc2UsImNyaXQiOlsiYjY0Il19..-Qa6tDkgtW1RoO3zZtC_cSEaBTYfJ4l0ypSGfbiLvKEeZ8xd1W-2Q51K2KJ-gSybVDw-0hZWaeDTW7IpFRZZDA'
  }
};

export const didAuth = {
  presentation: {
    did: 'did:key:z6MkoB84PJkXzFpbqtfYV5WqBKHCSDf7A1SeepwzvE36QvCF',
    options: {
      verificationMethod:
        'did:key:z6MkoB84PJkXzFpbqtfYV5WqBKHCSDf7A1SeepwzvE36QvCF#z6MkoB84PJkXzFpbqtfYV5WqBKHCSDf7A1SeepwzvE36QvCF',
      proofPurpose: 'authentication',
      challenge: 'some-challenge'
    }
  } as AuthenticateDto,
  signedPresentation: {
    '@context': ['https://www.w3.org/2018/credentials/v1'],
    type: ['VerifiablePresentation'],
    holder: 'did:key:z6MkoB84PJkXzFpbqtfYV5WqBKHCSDf7A1SeepwzvE36QvCF',
    proof: {
      verificationMethod:
        'did:key:z6MkoB84PJkXzFpbqtfYV5WqBKHCSDf7A1SeepwzvE36QvCF#z6MkoB84PJkXzFpbqtfYV5WqBKHCSDf7A1SeepwzvE36QvCF',
      type: 'Ed25519Signature2018',
      created: '2024-09-18T17:55:18Z',
      proofPurpose: 'authentication',
      challenge: 'some-challenge',
      jws: 'eyJhbGciOiJFZERTQSIsImI2NCI6ZmFsc2UsImNyaXQiOlsiYjY0Il19..22IJaDl9ALJ89CqBEnoVgEor0C-L-bERR6I1eHz7c_Ak3VeQgjuZG9aOa_1R_tr3ECI-hCL55G2JReEk-bi9DQ'
    }
  } as VerifiablePresentationDto,
  verifiedPresentationResult: {
    verified: true,
    errors: [],
    warnings: []
  } as VerificationResultDto
};
