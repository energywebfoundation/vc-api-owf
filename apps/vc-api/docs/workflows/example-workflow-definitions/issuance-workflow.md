Sample Workflow Definition for Issuance.

Use case: The Holder is required to prove control over DID, thus query of type `DIDAuth` is used.

```json
{
  "config": {
    "id": "workflowId",
    "steps": {
      "didAuth": {
        "verifiablePresentationRequest": {
          "query": [
            {
              "type": "DIDAuth",
              "credentialQuery": []
            }
          ],
          "interactServices": [
            {
              "type": "UnmediatedPresentation"
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
    "initialStep": "didAuth"
  }
}
```