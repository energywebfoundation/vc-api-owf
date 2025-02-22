<!--
 Copyright 2021 - 2023 Energy Web Foundation
 
 This program is free software: you can redistribute it and/or modify
 it under the terms of the GNU General Public License as published by
 the Free Software Foundation, either version 3 of the License, or
 (at your option) any later version.
 
 This program is distributed in the hope that it will be useful,
 but WITHOUT ANY WARRANTY; without even the implied warranty of
 MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 GNU General Public License for more details.
 
 You should have received a copy of the GNU General Public License
 along with this program.  If not, see <http://www.gnu.org/licenses/>.
-->

# Tutorial

## Business overview
The business objective of this tutorial is to demonstrate how to issue a Verifiable Credential (VC) to a known user connected to a portal that we will call "authority portal".
In the example below, we will issue a permanent residency card to a user we will call "resident". We use the context "https://w3id.org/residentship/v1" which describes the data of a VC of type "PermanentResidentCard".

Here is an extract of the context:

        ...
        "id": "@id",
        "type": "@type",

        "ctzn": "https://w3id.org/residentship#",
        "schema": "http://schema.org/",
        "xsd": "http://www.w3.org/2001/XMLSchema#",

        "birthCountry": "ctzn:birthCountry",
        "birthDate": {"@id": "schema:birthDate", "@type": "xsd:dateTime"},
        "commuterClassification": "ctzn:commuterClassification",
        "familyName": "schema:familyName",
        "gender": "schema:gender",
        "givenName": "schema:givenName",
        "lprCategory": "ctzn:lprCategory",
        "lprNumber": "ctzn:lprNumber",
        "residentSince": {"@id": "ctzn:residentSince", "@type": "xsd:dateTime"}
        ...

To get the definition of the field "gender" which points to the definition "schema:gender", use the URI of "schema" which points to "http://schema.org/", so we will have a definition available at "http://schema.org/gender".
Regarding the aliasing of `id` to `@id` and `type` to `@type`, see the [VC specification](https://www.w3.org/TR/vc-data-model/#syntactic-sugar).

We therefore assume that the resident is connected to the authority portal and that the information contained in the context about the resident is available in the authority portal database.

### Business workflows

#### Issuance Business workflow
1. The authority portal authenticates the current user as a known resident.
1. The resident requests a "PermanentResidentCard" credential on the authority portal.
1. The authority portal displays a QR code for the citizen to scan with his mobile wallet.
1. The citizen's mobile wallet provides the authority portal with a presentation to prove control over a DID.
1. The authority portal reviews the presentation and issues a "PermanentResidentCard" credential containing the resident's information.
1. The citizen's mobile wallet contacts the authority portal again to receive the "PermanentResidentCard".

#### Presentation Business workflow
1. The authority portal displays a QR code requesting a presentation containing the "PermanentResidentCard" credential
1. The resident scans the QR code with their mobile wallet and prompts the user for permission to present the "PermanentResidentCard" credential
1. The resident confirms and the presentation is submitted to the authority portal who can then authorize the resident

## Technical overview
From a technical point of view, in this tutorial, we have access to the server API but no mobile wallet is available. So we will use the server API for both roles of the portal and the resident's mobile wallet.

### Technical workflows

#### 1. Issuance workflow
The technical issuance workflow is as follows:
- [1.0  [Authority portal] Configure the credential issuance workflow](#10-authority-portal-configure-the-credential-issuance-workflow)
- [1.1  [Authority portal] Create the credential issuance exchange](#11-authority-portal-create-the-credential-issuance-exchange)
- [1.2  [Authority portal] Provide an exchange invitation to the citizen](#12-authority-portal-provide-an-exchange-invitation-to-the-citizen)
- [1.2  [Authority portal] Provide an exchange invitation to the citizen](#12-authority-portal-provide-an-exchange-invitation-to-the-citizen)
- [1.3  [Resident] Initiate issuance exchange using the request URL](#13-resident-initiate-issuance-exchange-using-the-request-url)
- [1.4  [Resident] Create a DID](#14-resident-create-a-did)
- [1.5  [Resident] Create a DID authentication proof](#15-resident-create-a-did-authentication-proof)
- [1.6  [Resident] Continue exchange by submitting the DID Auth proof](#16-resident-continue-exchange-by-submitting-the-did-auth-proof)
- [1.7  [Authority portal] Check for notification of submitted presentation](#17-authority-portal-check-for-notification-of-submitted-presentation)
- [1.8  [Authority portal] Create issuer DID](#18-authority-portal-create-issuer-did)
- [1.9  [Authority portal] Issue "resident card" credential](#19-authority-portal-issue-resident-card-credential)
- [1.10 [Authority portal] Wrap the issued VC in a VP](#110-authority-portal-wrap-the-issued-vc-in-a-vp)
- [1.11 [Authority portal] Add a review to the exchange](#111-authority-portal-add-a-review-to-the-exchange)
- [1.12 [Resident] Continue the exchange and obtain the credentials](#112-resident-continue-the-exchange-and-obtain-the-credentials)

#### 2. Presentation workflow
- [2.0  [Verifier] Configure Credential Workflow](#21-verifier-configure-credential-workflow)
- [2.1  [Verifier] Create Credential Presentation Exchange](#21-verifier-create-credential-presentation-exchange)
- [2.2  [Verifier] Provide an exchange invitation to the resident](#22-verifier-provide-an-exchange-invitation-to-the-resident)
- [2.3  [Resident] Initiate the presentation exchange](#23-resident-initiate-the-presentation-exchange)
- [2.4  [Resident] Create the required presentation](#24-resident-create-the-required-presentation)
- [2.5  [Resident] Continue the exchange](#25-resident-continue-the-exchange)
- [2.6 [Verifier] Act on Submitted Presentation](#26-verifier-act-on-submitted-presentation)

## Overview and Objective

The objective of this tutorial is walk through a simple credential issuance and presentation flow.
A diagram of this flow is available in the [Workflows Documentation](../workflows.md).

## Steps
### 0. Setup the Postman Collection

First, download and install [Postman](https://www.postman.com/downloads/).

Then, from the Postman app, import [the open-api json](../openapi.json) and [the environment](../vc-api.postman_environment.json) for VC-API. Instructions on how to import into Postman can be found [here](https://learning.postman.com/docs/getting-started/importing-and-exporting-data/#importing-data-into-postman).

### 1. Permanent Resident Card issuance

#### 1.0 [Authority portal] Configure the credential issuance workflow

The authority portal needs to configure the parameters of the permanent resident card issuance workflow by sending an [Workflow Definition](../workflows.md#workflow-definitions).
To do this, navigate to the `Vc Api Controller create Workflow` under `vc-api/workflows` and send the request described below.

**Request URL**

`{VC API base url}/v1/vc-api/workflows`

**HTTP Verb**

`POST`

**Request Body**

Fill in the `workflowId` with a unique id, such as a [UUID](https://en.wikipedia.org/wiki/Universally_unique_identifier).

In order to test the notification functionality, you can use the "[webhook.site](https://webhook.site/)".
This is a free website which allows you to view and debug callback/webhook HTTP POST requests.
With this service, requests are saved to a dedicated location for later review.
Please only use this service for this tutorial (or other non-production applications).

To use the webhook.site service with this tutorial, use a dedicated endpoint url generated for you after entering
the site. It should look similar to `https://webhook.site/efb19fb8-2579-4e1b-8614-d5a03edaaa7a`
Copy this URL, including the domain, into the workflow definition below.

```json
{
  "config": {
    "id":  "<FILL WITH SOME UNIQUE ID>",
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
              "type": "UnmediatedHttpPresentationService2021"
            }
          ]
        },
        "callback": [
          {
            "url": "FILL YOUR CALLBACK URL, for example 'https://webhook.site/efb19fb8-2579-4e1b-8614-d5a03edaaa7a'"
          }
        ],
        "nextStep": "residentCardIssuance"
      },
      "residentCardIssuance": {
        "callback": [
          {
            "url": "FILL YOUR CALLBACK URL, for example 'https://webhook.site/efb19fb8-2579-4e1b-8614-d5a03edaaa7a'"
          }
        ]
      }
    },
    "initialStep": "didAuth"
  }
}
```

**Expected Response HTTP Status Code**

`201 Created`

#### 1.1 [Authority portal] Create the credential issuance exchnage

The authority portal needs to create a permanent resident card issuance exchnage from the workflow definition. 
To do this, navigate to the `Vc Api Controller create Exchange from Workflow` under `vc-api/workflows` and send the request described below.

**Request URL**

`{VC API base url}/v1/vc-api/workflows/{localWorkflowId}/exchanges`

**HTTP Verb**

`POST`

**Request Body**

The request body can be empty.

```json
{
}
```

**Sample Expected Response Body**
```json
{
    "exchangeId": "http://localhost:3000/v1/vc-api/workflows/wf1/exchanges/a0f44aa7-75a2-4b65-880e-181792fdd0ff",
    "step": "didAuth",
    "state": "pending"
}
```

**Expected Response HTTP Status Code**

`201 Created`

#### 1.2 [Authority portal] Provide an workflow invitation to the citizen

The authority portal can communicate to the citizen that they can initiate request for a "PermanentResidentCard" credential by
filling the `workflow id` and the `exchange id` in the json template below and transmitting the json to the citizen.
They can do this transmission by encoding the json in a QR code and displaying to the citizen for example.

```json
{
    "outOfBandInvitation": { 
        "type": "https://energyweb.org/out-of-band-invitation/vc-api-workflow",
        "body": { 
            "credentialTypeAvailable": "PermanentResidentCard",
            "url": "{VC API base url}/v1/vc-api/workflows/{THE WORKFLOW ID}/exchanges/{THE EXCHANGE ID}" 
        }
    }
} 
```

#### 1.3 [Resident] Initiate issuance exchange using the request URL

Initiate a request for a PermanentResidentCard by POSTing to the `url` directly in Postman or by navigating to the `Vc Api Controller participate in Workflow Exchange` request in the collection.

Send the request as described below.

**Request URL**

If using the collection request, fill in the `exchangeid` param to be the exchange ID used in the first step.
`{VC API base url}/v1/vc-api/workflows/{workflowId}/exchanges/{exchangeId}`

**HTTP Verb**

`POST`

**Request Body**

*empty*

**Sample Expected Response Body**

The response contains a VP Request, which is a specification defined here: https://w3c-ccg.github.io/vp-request-spec/.
You can see that the VP Request's `query` section contains a `DIDAuth` query.
This means that we must authenticate as our chosen DID in order to obtain the credential that we requested.

The `challenge` value and the final fragment of the `serviceEndpoint`, which is the `transaction id`, should be different from the sample below.

Also note the `service` in the `interact` section of the VP Request.
This is providing the location at which we can continue the credential exchange once we have met the `query` requirements.

```json
{
    "verifiablePresentationRequest": {
        "challenge": "6508cd40-06c2-4cba-9cf5-12ee1cfd6b74",
        "query": [
            {
                "type": "DIDAuth",
                "credentialQuery": []
            }
        ],
        "interact": {
            "service": [
                {
                    "type": "UnmediatedHttpPresentationService2021",
                    "serviceEndpoint": "http://localhost:3000/v1/vc-api/workflows/wf1/exchanges/a0f44aa7-75a2-4b65-880e-181792fdd0ff"
                }
            ]
        },
        "domain": "http://localhost:3000/v1/vc-api"
    }
}
```

**Expected Response HTTP Status Code**

`201 Created`

#### 1.4 [Resident] Create a DID

Let's create a new DID for which the citizen can prove control.
This DID will be the Subject identifier of the Resident Card credential.

Navigate to the `DID Controller create` request under the `did` folder.

Send the request as described below.

**Request URL**

`{VC API base url}/v1/did`

**HTTP Verb**

`POST`

**Request Body**

```json
{
    "method": "key"
}
```

**Sample Expected Response Body**

Response body should be similar to the one below but with a different `did`.
```json
{
    "context": [
        "https://w3id.org/did/v1",
        "https://w3id.org/security/suites/ed25519-2018/v1",
        "https://w3id.org/security/suites/x25519-2019/v1"
    ],
    "id": "did:key:z6Mktm1WzjW7fFRubnDggt92o9dfyNvr4BbNyw7n3wxLvS6X",
    "verificationMethod": [
        {
            "id": "did:key:z6Mktm1WzjW7fFRubnDggt92o9dfyNvr4BbNyw7n3wxLvS6X#z6Mktm1WzjW7fFRubnDggt92o9dfyNvr4BbNyw7n3wxLvS6X",
            "type": "Ed25519VerificationKey2018",
            "controller": "did:key:z6Mktm1WzjW7fFRubnDggt92o9dfyNvr4BbNyw7n3wxLvS6X",
            "publicKeyBase58": "FJkUQVFgKhwSVHNz1KBBx45g9oezeJM2HvCrDfzL1DK9"
        }
    ],
    "authentication": [
        "did:key:z6Mktm1WzjW7fFRubnDggt92o9dfyNvr4BbNyw7n3wxLvS6X#z6Mktm1WzjW7fFRubnDggt92o9dfyNvr4BbNyw7n3wxLvS6X"
    ],
    "assertionMethod": [
        "did:key:z6Mktm1WzjW7fFRubnDggt92o9dfyNvr4BbNyw7n3wxLvS6X#z6Mktm1WzjW7fFRubnDggt92o9dfyNvr4BbNyw7n3wxLvS6X"
    ],
    "keyAgreement": [
        {
            "id": "did:key:z6Mktm1WzjW7fFRubnDggt92o9dfyNvr4BbNyw7n3wxLvS6X#z6LSjnvAZUpTB2pDcBsUtJ8CdmSokfo7fsRSqkyY8D5oa1Y4",
            "type": "X25519KeyAgreementKey2019",
            "controller": "did:key:z6Mktm1WzjW7fFRubnDggt92o9dfyNvr4BbNyw7n3wxLvS6X",
            "publicKeyBase58": "97k13B1b5a6UWoViMecFKBEKuXFzyGFHxnFrdkSGrdmJ"
        }
    ],
    "capabilityInvocation": [
        "did:key:z6Mktm1WzjW7fFRubnDggt92o9dfyNvr4BbNyw7n3wxLvS6X#z6Mktm1WzjW7fFRubnDggt92o9dfyNvr4BbNyw7n3wxLvS6X"
    ],
    "capabilityDelegation": [
        "did:key:z6Mktm1WzjW7fFRubnDggt92o9dfyNvr4BbNyw7n3wxLvS6X#z6Mktm1WzjW7fFRubnDggt92o9dfyNvr4BbNyw7n3wxLvS6X"
    ]
}
```

**Expected Response HTTP Status Code**

`201 Created`

#### 1.5 [Resident] Create a DID authentication proof

In order to prove control over the DID created in the previous step, create a DID Authentication proof.

Open the `Vc Api Controller prove Authentication Presentation` request under the `vc-api` folder.

Send the request as described below.

**Request URL**

`{VC API base url}/v1/vc-api/presentations/prove/authentication`

**HTTP Verb**

`POST`

**Request Body**

Fill the json below with your own values.
The `challenge` should be value received from the VP Request in the previous step.

```json
{
    "did": "FILL YOUR DID HERE",
    "options": {
        "verificationMethod": "FILL YOUR VERIFICATION METHOD HERE",
        "proofPurpose": "authentication",
        "challenge": "FILL YOUR CHALLENGE HERE"
    }
}
```

An example filed body is shown below.
```json
{
  "did": "did:key:z6Mktm1WzjW7fFRubnDggt92o9dfyNvr4BbNyw7n3wxLvS6X",
  "options": {
    "verificationMethod": "did:key:z6Mktm1WzjW7fFRubnDggt92o9dfyNvr4BbNyw7n3wxLvS6X#z6Mktm1WzjW7fFRubnDggt92o9dfyNvr4BbNyw7n3wxLvS6X",
    "proofPurpose": "authentication",
    "challenge": "6508cd40-06c2-4cba-9cf5-12ee1cfd6b74"
  }
}
```

**Sample Expected Response Body**

The response should be a verifiable presentation, similar to the one below.
```json
{
    "@context": [
        "https://www.w3.org/2018/credentials/v1"
    ],
    "type": [
        "VerifiablePresentation"
    ],
    "holder": "did:key:z6Mktm1WzjW7fFRubnDggt92o9dfyNvr4BbNyw7n3wxLvS6X",
    "proof": {
        "verificationMethod": "did:key:z6Mktm1WzjW7fFRubnDggt92o9dfyNvr4BbNyw7n3wxLvS6X#z6Mktm1WzjW7fFRubnDggt92o9dfyNvr4BbNyw7n3wxLvS6X",
        "type": "Ed25519Signature2018",
        "created": "2025-02-03T03:50:07Z",
        "proofPurpose": "authentication",
        "challenge": "6508cd40-06c2-4cba-9cf5-12ee1cfd6b74",
        "jws": "eyJhbGciOiJFZERTQSIsImI2NCI6ZmFsc2UsImNyaXQiOlsiYjY0Il19..U-Xzk_WP8_s8yWnRKitQsah-0Vemrieh_n8qk64KzyV8QBX5nG7yGPjg3UrxJBqfBoQQse3igMS3EFBUrkfGAA"
    }
}
```

**Expected Response HTTP Status Code**

`201 Created`

#### 1.6 [Resident] Continue exchange by submitting the DID Auth proof

Continue the exchange using the DIDAuth presentation.
To do this, return to the `Vc Api Controller participate in Workflow Exchange` request in the `v1/vc-api/workflows/{workflow id}/exchanges{exchange id}` folder.

Send the request as described below.

**Request URL**

In the request params, use the url from the `serviceEndpoint` in the VP Request.

**HTTP Verb**

`POST`

**Request Body**

In the request body, copy the VP that was obtained from the previous step into the JSON below.

```json
{ "verifiablePresentation": COPY THE VP HERE }
```

**Sample Expected Response Body**

The response should be similar to as shown below.
This response indicates that the client attempt to continue the exchange again (after some interval), using the service endpoint.
```json
{
    "redirectUrl": "http://localhost:3000/v1/vc-api/workflows/wf1/exchanges/73210d06-9bac-40e1-aa11-ebde6e1a5a94"
}
```

**Expected Response HTTP Status Code**

`202 Accepted`

#### 1.7 [Authority portal] Check for notification of submitted presentation

Check the request bucket configured as the callback when configuring the exchange definition.
There should be a notification of a submitted presentation for the authority portal to review.

The authority portal can rely on VC-API's verification of the credential proofs and conformance to the credential query.
The authority portal can then proceed with reviewing the presentation and issuing the "resident card" credential.

An example of the expected POST body received in the request bucket is:

```json
{
  "stepId": "didAuth",
  "vpRequest": {
    "challenge": "a44fdfeb-1a58-488e-a78a-6dba87ba82c4",
    "query": [
      {
        "type": "DIDAuth",
        "credentialQuery": []
      }
    ],
    "interact": {
      "service": [
        {
          "type": "UnmediatedHttpPresentationService2021",
          "serviceEndpoint": "http://localhost:3000/v1/vc-api/workflows/wf2/exchanges/73210d06-9bac-40e1-aa11-ebde6e1a5a94"
        }
      ]
    },
    "domain": "http://localhost:3000/v1/vc-api"
  },
  "presentationSubmission": {
    "verifiablePresentation": {
      "@context": [
        "https://www.w3.org/2018/credentials/v1"
      ],
      "type": [
        "VerifiablePresentation"
      ],
      "holder": "did:key:z6Mktm1WzjW7fFRubnDggt92o9dfyNvr4BbNyw7n3wxLvS6X",
      "proof": {
        "verificationMethod": "did:key:z6Mktm1WzjW7fFRubnDggt92o9dfyNvr4BbNyw7n3wxLvS6X#z6Mktm1WzjW7fFRubnDggt92o9dfyNvr4BbNyw7n3wxLvS6X",
        "type": "Ed25519Signature2018",
        "created": "2025-02-03T04:15:53Z",
        "proofPurpose": "authentication",
        "challenge": "a44fdfeb-1a58-488e-a78a-6dba87ba82c4",
        "jws": "eyJhbGciOiJFZERTQSIsImI2NCI6ZmFsc2UsImNyaXQiOlsiYjY0Il19..bfkLzD93w4SDSEu8vqpC9PhINh7YYzDyytSAY3ok4oNuuAyYjCuxzIFHGlwg6ZwZbSF5OeZ6f-3lQiOLTZtpBA"
      }
    },
    "verificationResult": {
      "errors": [],
      "warnings": [],
      "problemDetails": []
    }
  },
  "exchangeId": "http://localhost:3000/v1/vc-api/workflows/wf2/exchanges/73210d06-9bac-40e1-aa11-ebde6e1a5a94"
}
```

#### 1.8 [Authority portal] Create issuer DID
The authority portal needs a DID from which they can issue a credential.
Again, navigate to the `DID Controller create` request under the `did` folder.
Send the request as described below.

**Request URL**

`{VC API base url}/v1/did`

**HTTP Verb**

`POST`

**Request Body**

```json
{
    "method": "key"
}
```

**Sample Expected Response Body**

This should give a response similar to this one, with a different `did`.
Note down the `id` property. This is the authority portals's DID.

```json
{
    "context": [
        "https://w3id.org/did/v1",
        "https://w3id.org/security/suites/ed25519-2018/v1",
        "https://w3id.org/security/suites/x25519-2019/v1"
    ],
    "id": "did:key:z6MkgTU8dW4rhiHPJhNyuBj3udVQWvpxvxpAP4m8KP3YUjke",
    "verificationMethod": [
        {
            "id": "did:key:z6MkgTU8dW4rhiHPJhNyuBj3udVQWvpxvxpAP4m8KP3YUjke#z6MkgTU8dW4rhiHPJhNyuBj3udVQWvpxvxpAP4m8KP3YUjke",
            "type": "Ed25519VerificationKey2018",
            "controller": "did:key:z6MkgTU8dW4rhiHPJhNyuBj3udVQWvpxvxpAP4m8KP3YUjke",
            "publicKeyBase58": "31D63FpRNAnvCCYHDcmD4XwQhMZ7X5Zoh3rCV75XZWyG"
        }
    ],
    "authentication": [
        "did:key:z6MkgTU8dW4rhiHPJhNyuBj3udVQWvpxvxpAP4m8KP3YUjke#z6MkgTU8dW4rhiHPJhNyuBj3udVQWvpxvxpAP4m8KP3YUjke"
    ],
    "assertionMethod": [
        "did:key:z6MkgTU8dW4rhiHPJhNyuBj3udVQWvpxvxpAP4m8KP3YUjke#z6MkgTU8dW4rhiHPJhNyuBj3udVQWvpxvxpAP4m8KP3YUjke"
    ],
    "keyAgreement": [
        {
            "id": "did:key:z6MkgTU8dW4rhiHPJhNyuBj3udVQWvpxvxpAP4m8KP3YUjke#z6LSmZgztaytJ9Rs4qbd1LNHWienYb8A3dm2oPzLcsNtEFuV",
            "type": "X25519KeyAgreementKey2019",
            "controller": "did:key:z6MkgTU8dW4rhiHPJhNyuBj3udVQWvpxvxpAP4m8KP3YUjke",
            "publicKeyBase58": "AtWqNHB2Cgi7yTDrUgrLC8SJhSb3M2asvRGf8QjMWt8j"
        }
    ],
    "capabilityInvocation": [
        "did:key:z6MkgTU8dW4rhiHPJhNyuBj3udVQWvpxvxpAP4m8KP3YUjke#z6MkgTU8dW4rhiHPJhNyuBj3udVQWvpxvxpAP4m8KP3YUjke"
    ],
    "capabilityDelegation": [
        "did:key:z6MkgTU8dW4rhiHPJhNyuBj3udVQWvpxvxpAP4m8KP3YUjke#z6MkgTU8dW4rhiHPJhNyuBj3udVQWvpxvxpAP4m8KP3YUjke"
    ]
}
```

**Expected Response HTTP Status Code**

`201 Created`

#### 1.9 [Authority portal] Issue "resident card" credential

After having created a new DID, the authority portal can then issue a credential to the resident DID that was previously created.
Navigate to the `Vc Api Controller issue Credential` request under the `vc-api` folder.

Send the request as described below.

**Request URL**

`{VC API base url}/v1/credentials/issue`

**HTTP Verb**

`POST`

**Request Body**

Fill in, in the json below, the resident DID as the `subject` id and the authority portal DID as the `issuer` from the DIDs that were generated in previous steps.

```json
{
  "credential": {
      "@context":[
          "https://www.w3.org/2018/credentials/v1",
          "https://w3id.org/citizenship/v1"
      ],
      "id":"https://issuer.oidp.uscis.gov/credentials/83627465",
      "type":[
          "VerifiableCredential",
          "PermanentResidentCard"
      ],
      "issuer":"<FILL AUTHORITY DID>",
      "issuanceDate":"2019-12-03T12:19:52Z",
      "expirationDate":"2029-12-03T12:19:52Z",
      "credentialSubject":{
          "id":"<FILL RESIDENT DID>",
          "type":[
            "PermanentResident",
            "Person"
          ],
          "givenName":"JOHN",
          "familyName":"SMITH",
          "gender":"Male",
          "image":"data:image/png;base64,iVBORw0KGgo...kJggg==",
          "residentSince":"2015-01-01",
          "lprCategory":"C09",
          "lprNumber":"999-999-999",
          "commuterClassification":"C1",
          "birthCountry":"Bahamas",
          "birthDate":"1958-07-17"
      }
    },
    "options": {
    }
}
```

**Sample Expected Response Body**

The response is an issued Verifiable Credential, similar to the one shown below.

```json
{
    "@context": [
        "https://www.w3.org/2018/credentials/v1",
        "https://w3id.org/citizenship/v1"
    ],
    "id": "https://issuer.oidp.uscis.gov/credentials/83627465",
    "type": [
        "VerifiableCredential",
        "PermanentResidentCard"
    ],
    "issuer": "did:key:z6MkgTU8dW4rhiHPJhNyuBj3udVQWvpxvxpAP4m8KP3YUjke",
    "issuanceDate": "2019-12-03T12:19:52Z",
    "expirationDate": "2029-12-03T12:19:52Z",
    "credentialSubject": {
        "type": [
            "PermanentResident",
            "Person"
        ],
        "givenName": "JOHN",
        "familyName": "SMITH",
        "gender": "Male",
        "image": "data:image/png;base64,iVBORw0KGgo...kJggg==",
        "residentSince": "2015-01-01",
        "lprCategory": "C09",
        "lprNumber": "999-999-999",
        "commuterClassification": "C1",
        "birthCountry": "Bahamas",
        "birthDate": "1958-07-17",
        "id": "did:key:z6Mktm1WzjW7fFRubnDggt92o9dfyNvr4BbNyw7n3wxLvS6X"
    },
    "proof": {
        "verificationMethod": "did:key:z6MkgTU8dW4rhiHPJhNyuBj3udVQWvpxvxpAP4m8KP3YUjke#z6MkgTU8dW4rhiHPJhNyuBj3udVQWvpxvxpAP4m8KP3YUjke",
        "type": "Ed25519Signature2018",
        "created": "2025-02-03T04:25:09Z",
        "proofPurpose": "assertionMethod",
        "jws": "eyJhbGciOiJFZERTQSIsImI2NCI6ZmFsc2UsImNyaXQiOlsiYjY0Il19..nB9amOFOLJzGTfK7L7edXgs6D9y5OWWwcPttw3dIo4D_ekVHRNMP9EhELDOWMc2L5IcHIYIHADRXjoYJdqYuBg"
    }
}
```

#### 1.10 [Authority portal] Wrap the issued VC in a VP

The authority portal should then prove a presentation in order to present the credential to the resident.
Open the `Vc Api Controller prove Presentation` request under the `vc-api` folder.

Send the request as described below.

**Request URL**

`{VC API base url}/v1/vc-api/presentations/prove`

**HTTP Verb**

`POST`

**Request Body**

Fill the body with json below, replacing the "FILL" values appropriately.

```json
{
    "presentation": {
        "@context": ["https://www.w3.org/2018/credentials/v1"],
        "type": ["VerifiablePresentation"],
        "verifiableCredential": ["<FILL WITH THE ISSUED CREDENTIAL>"]
    },
    "options": {
        "verificationMethod": "<FILL WITH VERIFICATION METHOD ID OF AUTHORITY PORTAL>",
        "challenge": "self-issued"
    }
}
```

For example, the body with the filled values would look like:
```json
{
    "presentation": {
        "@context": [
            "https://www.w3.org/2018/credentials/v1"
        ],
        "type": [
            "VerifiablePresentation"
        ],
        "verifiableCredential": [
            {
                "@context": [
                    "https://www.w3.org/2018/credentials/v1",
                    "https://w3id.org/citizenship/v1"
                ],
                "id": "https://issuer.oidp.uscis.gov/credentials/83627465",
                "type": [
                    "VerifiableCredential",
                    "PermanentResidentCard"
                ],
                "issuer": "did:key:z6MkgTU8dW4rhiHPJhNyuBj3udVQWvpxvxpAP4m8KP3YUjke",
                "issuanceDate": "2019-12-03T12:19:52Z",
                "expirationDate": "2029-12-03T12:19:52Z",
                "credentialSubject": {
                    "type": [
                        "PermanentResident",
                        "Person"
                    ],
                    "givenName": "JOHN",
                    "familyName": "SMITH",
                    "gender": "Male",
                    "image": "data:image/png;base64,iVBORw0KGgo...kJggg==",
                    "residentSince": "2015-01-01",
                    "lprCategory": "C09",
                    "lprNumber": "999-999-999",
                    "commuterClassification": "C1",
                    "birthCountry": "Bahamas",
                    "birthDate": "1958-07-17",
                    "id": "did:key:z6Mktm1WzjW7fFRubnDggt92o9dfyNvr4BbNyw7n3wxLvS6X"
                },
                "proof": {
                    "verificationMethod": "did:key:z6MkgTU8dW4rhiHPJhNyuBj3udVQWvpxvxpAP4m8KP3YUjke#z6MkgTU8dW4rhiHPJhNyuBj3udVQWvpxvxpAP4m8KP3YUjke",
                    "type": "Ed25519Signature2018",
                    "created": "2025-02-03T04:25:09Z",
                    "proofPurpose": "assertionMethod",
                    "jws": "eyJhbGciOiJFZERTQSIsImI2NCI6ZmFsc2UsImNyaXQiOlsiYjY0Il19..nB9amOFOLJzGTfK7L7edXgs6D9y5OWWwcPttw3dIo4D_ekVHRNMP9EhELDOWMc2L5IcHIYIHADRXjoYJdqYuBg"
                }
            }
        ]
    },
    "options": {
        "verificationMethod": "{{issuerVerificationMethod}}",
        "challenge": "self-issued"
    }
}
```

**Expected Response HTTP Status Code**

`201 Created`

#### 1.11 [Authority portal] Add a review to the exchange

With a verifiable presentation in hand, the authority portal can add a review to the in-progress exchange.
Open the `Vc Api Controller add Workflow Step Review` request under the `/vc-api/workflows/{localWorkflowId}/exchanges/{localExchangeId}/steps/{localStepId}/review` folder.

Send the request as described below.

**Request URL**

Use the same `exchangeId` and `transactionId` as the path variables as in the "Particiapte in Exchange" step.
Use "residentCardIssuance" as the `localStepId`.

`{VC API base url}/v1/vc-api/workflows/:localWorkflowId/exchanges/:localExchangeId/steps/:localStepId/review`

**HTTP Verb**

`POST`

**Request Body**

Fill the json below appropriately and send as the body:
```json
{
    "result": "approved",
    "vp": "<COPY VP FROM PREVIOUS STEP HERE>"
}
```

```json
{
    "result": "approved",
    "vp": {
        "@context": [
            "https://www.w3.org/2018/credentials/v1"
        ],
        "type": [
            "VerifiablePresentation"
        ],
        "verifiableCredential": [
            {
                "@context": [
                    "https://www.w3.org/2018/credentials/v1",
                    "https://w3id.org/citizenship/v1"
                ],
                "id": "https://issuer.oidp.uscis.gov/credentials/83627465",
                "type": [
                    "VerifiableCredential",
                    "PermanentResidentCard"
                ],
                "issuer": "did:key:z6MkgTU8dW4rhiHPJhNyuBj3udVQWvpxvxpAP4m8KP3YUjke",
                "issuanceDate": "2019-12-03T12:19:52Z",
                "expirationDate": "2029-12-03T12:19:52Z",
                "credentialSubject": {
                    "type": [
                        "PermanentResident",
                        "Person"
                    ],
                    "givenName": "JOHN",
                    "familyName": "SMITH",
                    "gender": "Male",
                    "image": "data:image/png;base64,iVBORw0KGgo...kJggg==",
                    "residentSince": "2015-01-01",
                    "lprCategory": "C09",
                    "lprNumber": "999-999-999",
                    "commuterClassification": "C1",
                    "birthCountry": "Bahamas",
                    "birthDate": "1958-07-17",
                    "id": "did:key:z6Mktm1WzjW7fFRubnDggt92o9dfyNvr4BbNyw7n3wxLvS6X"
                },
                "proof": {
                    "verificationMethod": "did:key:z6MkgTU8dW4rhiHPJhNyuBj3udVQWvpxvxpAP4m8KP3YUjke#z6MkgTU8dW4rhiHPJhNyuBj3udVQWvpxvxpAP4m8KP3YUjke",
                    "type": "Ed25519Signature2018",
                    "created": "2025-02-03T04:25:09Z",
                    "proofPurpose": "assertionMethod",
                    "jws": "eyJhbGciOiJFZERTQSIsImI2NCI6ZmFsc2UsImNyaXQiOlsiYjY0Il19..nB9amOFOLJzGTfK7L7edXgs6D9y5OWWwcPttw3dIo4D_ekVHRNMP9EhELDOWMc2L5IcHIYIHADRXjoYJdqYuBg"
                }
            }
        ],
        "proof": {
            "verificationMethod": "did:key:z6MkgTU8dW4rhiHPJhNyuBj3udVQWvpxvxpAP4m8KP3YUjke#z6MkgTU8dW4rhiHPJhNyuBj3udVQWvpxvxpAP4m8KP3YUjke",
            "type": "Ed25519Signature2018",
            "created": "2025-02-03T04:34:01Z",
            "proofPurpose": "authentication",
            "challenge": "self-issued",
            "jws": "eyJhbGciOiJFZERTQSIsImI2NCI6ZmFsc2UsImNyaXQiOlsiYjY0Il19..eIvHVAIvRx7hUzLi53MLy-DLLlFPKng7CNtNRpEguWOhq9kBat0fg1fjq8HSEnmMCzxudHBUNAN27HPcCCoQCg"
        }
    }
}
```

**Expected Response HTTP Status Code**

`201 Created`

#### 1.12 [Resident] Continue the exchange and obtain the credentials

As the review is submitted, the resident can continue the exchange to receive the credential.

To do this, return to the `Vc Api Controller participate in Workflow Exchange` request.
Resend the request.

**Request URL**

Use the same `workflowId` and `exchangeId` as used in step [1.6  [Resident] Continue exchange by submitting the DID Auth proof](#16-resident-continue-exchange-by-submitting-the-did-auth-proof)

`{VC API base url}/v1/vc-api/workflows/{local workflow id}/exchanges/{local exchange id}`

**HTTP Verb**

`POST`

**Request Body**

Can be left empty.

**Sample Expected Response Body**
The response should be similar to the following, where the `verifiablePresentation` contains the issued credential.

```json
{
    "verifiablePresentation": {
        "@context": [
            "https://www.w3.org/2018/credentials/v1"
        ],
        "type": [
            "VerifiablePresentation"
        ],
        "verifiableCredential": [
            {
                "@context": [
                    "https://www.w3.org/2018/credentials/v1",
                    "https://w3id.org/citizenship/v1"
                ],
                "id": "https://issuer.oidp.uscis.gov/credentials/83627465",
                "type": [
                    "VerifiableCredential",
                    "PermanentResidentCard"
                ],
                "issuer": "did:key:z6MkgTU8dW4rhiHPJhNyuBj3udVQWvpxvxpAP4m8KP3YUjke",
                "issuanceDate": "2019-12-03T12:19:52Z",
                "expirationDate": "2029-12-03T12:19:52Z",
                "credentialSubject": {
                    "type": [
                        "PermanentResident",
                        "Person"
                    ],
                    "givenName": "JOHN",
                    "familyName": "SMITH",
                    "gender": "Male",
                    "image": "data:image/png;base64,iVBORw0KGgo...kJggg==",
                    "residentSince": "2015-01-01",
                    "lprCategory": "C09",
                    "lprNumber": "999-999-999",
                    "commuterClassification": "C1",
                    "birthCountry": "Bahamas",
                    "birthDate": "1958-07-17",
                    "id": "did:key:z6Mktm1WzjW7fFRubnDggt92o9dfyNvr4BbNyw7n3wxLvS6X"
                },
                "proof": {
                    "verificationMethod": "did:key:z6MkgTU8dW4rhiHPJhNyuBj3udVQWvpxvxpAP4m8KP3YUjke#z6MkgTU8dW4rhiHPJhNyuBj3udVQWvpxvxpAP4m8KP3YUjke",
                    "type": "Ed25519Signature2018",
                    "created": "2025-02-03T04:25:09Z",
                    "proofPurpose": "assertionMethod",
                    "jws": "eyJhbGciOiJFZERTQSIsImI2NCI6ZmFsc2UsImNyaXQiOlsiYjY0Il19..nB9amOFOLJzGTfK7L7edXgs6D9y5OWWwcPttw3dIo4D_ekVHRNMP9EhELDOWMc2L5IcHIYIHADRXjoYJdqYuBg"
                }
            }
        ],
        "proof": {
            "verificationMethod": "did:key:z6MkgTU8dW4rhiHPJhNyuBj3udVQWvpxvxpAP4m8KP3YUjke#z6MkgTU8dW4rhiHPJhNyuBj3udVQWvpxvxpAP4m8KP3YUjke",
            "type": "Ed25519Signature2018",
            "created": "2025-02-03T04:34:01Z",
            "proofPurpose": "authentication",
            "challenge": "self-issued",
            "jws": "eyJhbGciOiJFZERTQSIsImI2NCI6ZmFsc2UsImNyaXQiOlsiYjY0Il19..eIvHVAIvRx7hUzLi53MLy-DLLlFPKng7CNtNRpEguWOhq9kBat0fg1fjq8HSEnmMCzxudHBUNAN27HPcCCoQCg"
        }
    }
}
```

**Expected Response HTTP Status Code**

`200 OK`

### 2. Permanent Resident Card verification

#### 2.0 [Verifier] Configure Credential Workflow

The Verifier needs to configure the parameters of the credential exchange by sending a [Workflow Definition](../README.md#workflow-definitions).
To do this, navigate to the `Vc Api Controller create Workflow` under `vc-api/workflows` and send with the json below.

Send the request as described below.

**Request URL**

`{VC API base url}/v1/vc-api/workflows`

**HTTP Verb**

`POST`

**Request Body**

Fill `workflowId` in the json below.
`workflow` should be an id unique to this exchange, for example a UUID.

Note the constraint on the `$.type` path of the credential.
This is used to require that the presented credential be of type "PermanentResidentCard".
For further documentation regarding the `presentationDefinition`, can be seen [here](../exchanges.md#presentation-definition-queries)

In order to test the notification functionality, you can use the "[webhook.site](https://webhook.site/)".
This is a free website which allows you to view and debug callback/webhook HTTP POST requests.
With this service, requests are saved to a dedicated location for later review.
Please only use this service for this tutorial (or other non-production applications).

To use the webhook.site service with this tutorial, use a dedicated endpoint url generated for you after entering
the site. It should look similar to `https://webhook.site/efb19fb8-2579-4e1b-8614-d5a03edaaa7a`
Copy this URL, including the domain, into the exchange definition below.

```json
{
  "config": {
    "id":"<SOME UNIQUE ID>",
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
            "url": "FILL YOUR CALLBACK URL, for example 'https://webhook.site/efb19fb8-2579-4e1b-8614-d5a03edaaa7a'"
          }
        ]
      }
    },
    "initialStep": "presentation"
  }
}
```

**Expected Response HTTP Status Code**

`201 Created`

#### 2.1 [Verifier] Create credential presentation exchnage

The authority portal needs to create a permanent resident card issuance exchnage from the workflow definition. 
To do this, navigate to the `Vc Api Controller create Exchange from Workflow` under `vc-api/workflows` and send the request described below.

**Request URL**

`{VC API base url}/v1/vc-api/workflows/{localWorkflowId}/exchanges`

**HTTP Verb**

`POST`

**Request Body**

The request body can be empty.

```json
{
}
```

**Sample Expected Response Body**
```json
{
    "exchangeId": "http://localhost:3000/v1/vc-api/workflows/wf3/exchanges/849a2cc8-3c65-48a3-98dc-f69247ad226c",
    "step": "presentation",
    "state": "pending"
}
```

**Expected Response HTTP Status Code**

`201 Created`

#### 2.2 [Verifier] Provide an exchange invitation to the resident

Having configured the exchange, the Verifier must then ask the resident to present the required credentials.

```json
{
  "outOfBandInvitation": {
    "type": "https://example.com/out-of-band/vc-api-exchange",
    "body": {
      "url": "{VC API base url}/v1/vc-api/workflows/<FILL WITH YOUR WORKFLOW ID>/exchanges/<FILL WITH YOUR EXCHANGE ID>"
    }
  }
}
```

#### 2.3 [Resident] Initiate the presentation exchange

Initiate the credential exchange by POSTing to the `url` directly in Postman or by navigating to the `Vc Api Controller initiate Exchange` request in the collection.
Send the request as described below.

**Request URL**

Use the exchange id URL from the previous step response.

`{VC API base url}/v1/vc-api/workflows/{localWorkflowId}/exchanges/{localExchangeId}`

**HTTP Verb**

`POST`

**Request Body**

*empty*

**Sample Expected Response Body**

A similar json should be returned in the response body:
```json
{
    "verifiablePresentationRequest": {
        "challenge": "a57c5bb4-560f-43d5-9668-aebeaad9dc7f",
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
        "interact": {
            "service": [
                {
                    "type": "UnmediatedHttpPresentationService2021",
                    "serviceEndpoint": "http://localhost:3000/v1/vc-api/workflows/wf3/exchanges/849a2cc8-3c65-48a3-98dc-f69247ad226c"
                }
            ]
        },
        "domain": "http://localhost:3000/v1/vc-api"
    }
}
```
The `challenge` value and the final fragment of the `serviceEndpoint`, which is the `transaction id`, should be different.

The response contains a VP Request, which is a specification defined here: https://w3c-ccg.github.io/vp-request-spec/.
You can see that the VP Request's `query` section contains a `PresentationDefinition` query.
This means that the holder must provide credentials which satisfy the `presentationDefinition`.

Also note the `service` in the `interact` section of the VP Request.
This is providing the location at which we can continue the credential request flow once we have met the `query` requirements.

**Expected Response HTTP Status Code**

`201 Created`
      
#### 2.4 [Resident] Create the required presentation

Open the `Vc Api Controller prove Presentation` request under the `vc-api/presentations/prove` folder.

Send the request as described below.

**Request URL**

`{VC API base url}/v1/vc-api/presentations/prove`

**HTTP Verb**

`POST`

**Request Body**

In the request body, use the following json, filled with your own values.
The `challenge` should be value received from the VP Request in the previous step.

```json
{
    "presentation": {
        "@context":[
            "https://www.w3.org/2018/credentials/v1",
            "https://www.w3.org/2018/credentials/examples/v1"
        ],
        "type":[
            "VerifiablePresentation"
        ],
        "verifiableCredential":[
            "<FILL WITH VC RECEIVED FROM AUTHORITY>"
        ],
        "holder": "<FILL WITH RESIDENT DID>"
    },
    "options": {
        "verificationMethod": "<FILL WITH RESIDENT DID VERIFICATION METHOD",
        "proofPurpose": "authentication",
        "challenge": "<FILL WITH CHALLENGE FROM VP REQUEST>"
    }
}
```

For example, your filled json would look like:

```json
{
    "presentation": {
        "@context": [
            "https://www.w3.org/2018/credentials/v1"
        ],
        "type": [
            "VerifiablePresentation"
        ],
        "verifiableCredential": [
            {
                "@context": [
                    "https://www.w3.org/2018/credentials/v1",
                    "https://w3id.org/citizenship/v1"
                ],
                "id": "https://issuer.oidp.uscis.gov/credentials/83627465",
                "type": [
                    "VerifiableCredential",
                    "PermanentResidentCard"
                ],
                "issuer": "did:key:z6MkgTU8dW4rhiHPJhNyuBj3udVQWvpxvxpAP4m8KP3YUjke",
                "issuanceDate": "2019-12-03T12:19:52Z",
                "expirationDate": "2029-12-03T12:19:52Z",
                "credentialSubject": {
                    "type": [
                        "PermanentResident",
                        "Person"
                    ],
                    "givenName": "JOHN",
                    "familyName": "SMITH",
                    "gender": "Male",
                    "image": "data:image/png;base64,iVBORw0KGgo...kJggg==",
                    "residentSince": "2015-01-01",
                    "lprCategory": "C09",
                    "lprNumber": "999-999-999",
                    "commuterClassification": "C1",
                    "birthCountry": "Bahamas",
                    "birthDate": "1958-07-17",
                    "id": "did:key:z6Mktm1WzjW7fFRubnDggt92o9dfyNvr4BbNyw7n3wxLvS6X"
                },
                "proof": {
                    "verificationMethod": "did:key:z6MkgTU8dW4rhiHPJhNyuBj3udVQWvpxvxpAP4m8KP3YUjke#z6MkgTU8dW4rhiHPJhNyuBj3udVQWvpxvxpAP4m8KP3YUjke",
                    "type": "Ed25519Signature2018",
                    "created": "2025-02-03T04:25:09Z",
                    "proofPurpose": "assertionMethod",
                    "jws": "eyJhbGciOiJFZERTQSIsImI2NCI6ZmFsc2UsImNyaXQiOlsiYjY0Il19..nB9amOFOLJzGTfK7L7edXgs6D9y5OWWwcPttw3dIo4D_ekVHRNMP9EhELDOWMc2L5IcHIYIHADRXjoYJdqYuBg"
                }
            }
        ]
    },
    "options": {
        "verificationMethod": "did:key:z6Mktm1WzjW7fFRubnDggt92o9dfyNvr4BbNyw7n3wxLvS6X#z6Mktm1WzjW7fFRubnDggt92o9dfyNvr4BbNyw7n3wxLvS6X",
        "proofPurpose": "authentication",
        "challenge": "a57c5bb4-560f-43d5-9668-aebeaad9dc7f"
    }
}
```

**Sample Expected Response Body**

The response should be a verifiable presentation, similar to the one below.
```json
{
    "@context": [
        "https://www.w3.org/2018/credentials/v1"
    ],
    "type": [
        "VerifiablePresentation"
    ],
    "verifiableCredential": [
        {
            "@context": [
                "https://www.w3.org/2018/credentials/v1",
                "https://w3id.org/citizenship/v1"
            ],
            "id": "https://issuer.oidp.uscis.gov/credentials/83627465",
            "type": [
                "VerifiableCredential",
                "PermanentResidentCard"
            ],
            "issuer": "did:key:z6MkgTU8dW4rhiHPJhNyuBj3udVQWvpxvxpAP4m8KP3YUjke",
            "issuanceDate": "2019-12-03T12:19:52Z",
            "expirationDate": "2029-12-03T12:19:52Z",
            "credentialSubject": {
                "type": [
                    "PermanentResident",
                    "Person"
                ],
                "givenName": "JOHN",
                "familyName": "SMITH",
                "gender": "Male",
                "image": "data:image/png;base64,iVBORw0KGgo...kJggg==",
                "residentSince": "2015-01-01",
                "lprCategory": "C09",
                "lprNumber": "999-999-999",
                "commuterClassification": "C1",
                "birthCountry": "Bahamas",
                "birthDate": "1958-07-17",
                "id": "did:key:z6Mktm1WzjW7fFRubnDggt92o9dfyNvr4BbNyw7n3wxLvS6X"
            },
            "proof": {
                "verificationMethod": "did:key:z6MkgTU8dW4rhiHPJhNyuBj3udVQWvpxvxpAP4m8KP3YUjke#z6MkgTU8dW4rhiHPJhNyuBj3udVQWvpxvxpAP4m8KP3YUjke",
                "type": "Ed25519Signature2018",
                "created": "2025-02-03T04:25:09Z",
                "proofPurpose": "assertionMethod",
                "jws": "eyJhbGciOiJFZERTQSIsImI2NCI6ZmFsc2UsImNyaXQiOlsiYjY0Il19..nB9amOFOLJzGTfK7L7edXgs6D9y5OWWwcPttw3dIo4D_ekVHRNMP9EhELDOWMc2L5IcHIYIHADRXjoYJdqYuBg"
            }
        }
    ],
    "proof": {
        "verificationMethod": "did:key:z6Mktm1WzjW7fFRubnDggt92o9dfyNvr4BbNyw7n3wxLvS6X#z6Mktm1WzjW7fFRubnDggt92o9dfyNvr4BbNyw7n3wxLvS6X",
        "type": "Ed25519Signature2018",
        "created": "2025-02-04T04:05:07Z",
        "proofPurpose": "authentication",
        "challenge": "a57c5bb4-560f-43d5-9668-aebeaad9dc7f",
        "jws": "eyJhbGciOiJFZERTQSIsImI2NCI6ZmFsc2UsImNyaXQiOlsiYjY0Il19..EWEs9EeKySQhQq5zvUIxSIEP3py6WoEILXi5siHUsT8jRARJIWbnkXHTVgrvcm7vmqn_OAvlduTSlfyAqMjcCA"
    }
}
```

**Expected Response HTTP Status Code**

`201 Created`

#### 2.5 [Resident] Continue the exchange

Continue the exchange by sending the VP in response to the VP Request that was previously received.
Open the `Vc Api Controller participate in Workflow Exchange` request in the `vc-api/workflows/{workflow Id}/exchanges/{exchange Id}` folder.

Send the request as described below.

**Request URL**

In the request params, use the `workflowId` and `exchangeId` from the `serviceEndpoint` in the VP Request.

`{VC API base url}/v1/vc-api/workflowId/{workflowId}/exchanges/{exchangeId}`

**HTTP Verb**

`POST`

**Request Body**

In the request body, copy the verifiable presentation that was obtained from the previous step in the json below.

```json
{
    "verifiablePresentation": "<COPY VP FROM PREVIOUS STEP HERE>"
}
```

**Expected Response HTTP Status Code**

`200 OK`

#### 2.6 [Verifier] Act on Submitted Presentation

For reference, the callback notification that would have been received in a configured callback for this presentation would be:

```json
{
  "stepId": "presentation",
  "vpRequest": {
    "challenge": "a57c5bb4-560f-43d5-9668-aebeaad9dc7f",
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
    "interact": {
      "service": [
        {
          "type": "UnmediatedHttpPresentationService2021",
          "serviceEndpoint": "http://localhost:3000/v1/vc-api/workflows/wf3/exchanges/849a2cc8-3c65-48a3-98dc-f69247ad226c"
        }
      ]
    },
    "domain": "http://localhost:3000/v1/vc-api"
  },
  "presentationSubmission": {
    "verifiablePresentation": {
      "@context": [
        "https://www.w3.org/2018/credentials/v1"
      ],
      "type": [
        "VerifiablePresentation"
      ],
      "verifiableCredential": [
        {
          "@context": [
            "https://www.w3.org/2018/credentials/v1",
            "https://w3id.org/citizenship/v1"
          ],
          "id": "https://issuer.oidp.uscis.gov/credentials/83627465",
          "type": [
            "VerifiableCredential",
            "PermanentResidentCard"
          ],
          "issuer": "did:key:z6MkgTU8dW4rhiHPJhNyuBj3udVQWvpxvxpAP4m8KP3YUjke",
          "issuanceDate": "2019-12-03T12:19:52Z",
          "expirationDate": "2029-12-03T12:19:52Z",
          "credentialSubject": {
            "type": [
              "PermanentResident",
              "Person"
            ],
            "givenName": "JOHN",
            "familyName": "SMITH",
            "gender": "Male",
            "image": "data:image/png;base64,iVBORw0KGgo...kJggg==",
            "residentSince": "2015-01-01",
            "lprCategory": "C09",
            "lprNumber": "999-999-999",
            "commuterClassification": "C1",
            "birthCountry": "Bahamas",
            "birthDate": "1958-07-17",
            "id": "did:key:z6Mktm1WzjW7fFRubnDggt92o9dfyNvr4BbNyw7n3wxLvS6X"
          },
          "proof": {
            "verificationMethod": "did:key:z6MkgTU8dW4rhiHPJhNyuBj3udVQWvpxvxpAP4m8KP3YUjke#z6MkgTU8dW4rhiHPJhNyuBj3udVQWvpxvxpAP4m8KP3YUjke",
            "type": "Ed25519Signature2018",
            "created": "2025-02-03T04:25:09Z",
            "proofPurpose": "assertionMethod",
            "jws": "eyJhbGciOiJFZERTQSIsImI2NCI6ZmFsc2UsImNyaXQiOlsiYjY0Il19..nB9amOFOLJzGTfK7L7edXgs6D9y5OWWwcPttw3dIo4D_ekVHRNMP9EhELDOWMc2L5IcHIYIHADRXjoYJdqYuBg"
          }
        }
      ],
      "proof": {
        "verificationMethod": "did:key:z6Mktm1WzjW7fFRubnDggt92o9dfyNvr4BbNyw7n3wxLvS6X#z6Mktm1WzjW7fFRubnDggt92o9dfyNvr4BbNyw7n3wxLvS6X",
        "type": "Ed25519Signature2018",
        "created": "2025-02-04T04:05:07Z",
        "proofPurpose": "authentication",
        "challenge": "a57c5bb4-560f-43d5-9668-aebeaad9dc7f",
        "jws": "eyJhbGciOiJFZERTQSIsImI2NCI6ZmFsc2UsImNyaXQiOlsiYjY0Il19..EWEs9EeKySQhQq5zvUIxSIEP3py6WoEILXi5siHUsT8jRARJIWbnkXHTVgrvcm7vmqn_OAvlduTSlfyAqMjcCA"
      }
    },
    "verificationResult": {
      "errors": [],
      "warnings": [],
      "problemDetails": []
    }
  },
  "exchangeId": "http://localhost:3000/v1/vc-api/workflows/wf3/exchanges/849a2cc8-3c65-48a3-98dc-f69247ad226c"
}
```
