Workflow definition requiring any or some credential from a list of credentials.

To create a `presentation-definition` that accepts any or some of the Verifiable Credentials from a list, we use `group` to categorise the credentials to choose from.

The `submission_requirements` property of `presentation-definition` specifies the number of credentials that need to be presented against the definition within a group. Refer to the [Submission Requirements](https://identity.foundation/presentation-exchange/#submission-requirements) documentation for more information.

Use case:

1. The Holder is required to present any one of the credentials from the list of credentials (Group A).

* The below `presentation-definition` requires the holder to either present a PermanentResidentCard` or `ConsentCredential` for a successful verification.

* Both of the required credentials are part of the group : ["A"]` and the `submission_requirements` specifies the min` property to be `1`, which states that any one credential is required.

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
                        "min": 1,
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

2. The Holder is required to present one credential mandatorily and any one out of two credentials.

* The below `presentation-definition` requires the holder to present at least 2 Verifiable Credentials of the 3 mentioned Verifiable Credentials.

* The required credentials are categorised into two groups: `group : ["A"]` contains validation for `PermanentResidentCard` and `ConsentCredential`, while `group : ["B"]` validates `DrivingLicense`.

* The `submission_requirements` specifies two requirements; one is for `group : ["A"]`, which has `min` set to `1`. This indicates that only one credential needs to be presented out of `PermanentResidentCard` and `ConsentCredential`. The other is for `group : ["B"]` which also has `min` set to `1`, but since the `group` lists only one credential, it becomes mandatory to present it, which is the `DrivingLicense`.

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
                        "name": "Consent or Resident-card Exchange",
                        "rule": "pick",
                        "min": 1,
                        "from": "A"
                      },
                      {
                        "name": "DrivingLicense Exchange",
                        "rule": "pick",
                        "min": 1,
                        "from": "B"
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
                      },
                      {
                        "id": "DrivingLicense",
                        "name": "DrivingLicense",
                        "purpose": "DrivingLicense",
                        "group": [
                          "B"
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
                                  "const": "DrivingLicense"
                                }
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

