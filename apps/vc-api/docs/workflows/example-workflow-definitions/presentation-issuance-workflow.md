Sample Workflow Definition for a presentation and issuance.

Use case: The Holder is required to present an issued VC (PermanentResidentCard) to the Issuer to obtain another VC.

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
                    "input_descriptors": [
                      {
                        "id": "permanent_resident_card",
                        "name": "Permanent Resident Card",
                        "purpose": "We can only allow permanent residents into the application",
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
        ],
        "nextStep": "residentCardIssuance"
      },
      "residentCardIssuance": {
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