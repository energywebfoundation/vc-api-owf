Sample Workflow Definition for presentation and self-signed Verifiable Credential. 

Use case: The Holder is required to present a self-signed consent VC and a PermanentResidentCard VC (Issued by Authority) to Verifier.

```json
{
  "config": {
    "id": "workflowId",
    "steps": {
      "presentation": {
        "verifiablePresentationRequest": {
          "query": [
            {
              "type": "PresentationDefinition",
              "credentialQuery": [
                {
                  "presentationDefinition": {
                    "id": "286bc1e0-f1bd-488a-a873-8d71be3c690e",
                    "submission_requirements": [
                      {
                        "name": "Consent and Resident-card Exchange",
                        "rule": "pick",
                        "min": 2,
                        "from": "A"
                      }
                    ],
                    "input_descriptors": [
                      {
                        "id": "PermanentResidentCard",
                        "name": "PermanentResidentCard",
                        "purpose": "PermanentResidentCard",
                        "group": [
                          "A"
                        ],
                        "constraints": {
                          "fields": [
                            {
                              "path": [
                                "$.type"
                              ],
                              "filter": {
                                "type": "array",
                                "contains": {
                                  "type": "string",
                                  "const": "PermanentResidentCard"
                                }
                              }
                            }
                          ]
                        }
                      },
                      {
                        "id": "ConsentCredential",
                        "name": "ConsentCredential",
                        "purpose": "One consent credential is required for this presentation",
                        "group": [
                          "A"
                        ],
                        "constraints": {
                          "subject_is_issuer": "required",
                          "fields": [
                            {
                              "path": [
                                "$.id"
                              ],
                              "filter": {
                                "const": "urn:uuid:49f69fb8-f256-4b2e-b15d-c7ebec3a507e"
                              }
                            },
                            {
                              "path": [
                                "$.@context"
                              ],
                              "filter": {
                                "$schema": "http://json-schema.org/draft-07/schema#",
                                "type": "array",
                                "items": [
                                  {
                                    "const": "https://www.w3.org/2018/credentials/v1"
                                  },
                                  {
                                    "$ref": "#/definitions/eliaGroupContext"
                                  }
                                ],
                                "additionalItems": false,
                                "minItems": 2,
                                "maxItems": 2,
                                "definitions": {
                                  "eliaGroupContext": {
                                    "type": "object",
                                    "properties": {
                                      "elia": {
                                        "const": "https://www.eliagroup.eu/ld-context-2022#"
                                      },
                                      "consent": {
                                        "const": "elia:consent"
                                      },
                                      "ConsentCredential": {
                                        "const": "elia:ConsentCredential"
                                      }
                                    },
                                    "additionalProperties": false,
                                    "required": [
                                      "elia",
                                      "consent"
                                    ]
                                  }
                                }
                              }
                            },
                            {
                              "path": [
                                "$.credentialSubject"
                              ],
                              "filter": {
                                "type": "object",
                                "properties": {
                                  "consent": {
                                    "const": "I consent to such and such"
                                  }
                                },
                                "additionalProperties": true
                              }
                            },
                            {
                              "path": [
                                "$.type"
                              ],
                              "filter": {
                                "type": "array",
                                "items": [
                                  {
                                    "const": "VerifiableCredential"
                                  },
                                  {
                                    "const": "ConsentCredential"
                                  }
                                ]
                              }
                            }
                          ]
                        }
                      }
                    ]
                  }
                }
              ]
            }
          ],
          "interactServices": [
            {
              "type": "UnmediatedHttpPresentationService2021"
            }
          ]
        },
        "callback": [
          {
            "url": "callbackUrl"
          }
        ]
      }
    },
    "initialStep": "presentation"
  }
}
```