<!--
 Copyright 2021 - 2024 Energy Web Foundation
 
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

# VC-API Workflows

## Overview of Workflows

This document defines workflows as a sequence of steps enabling interactions between parties (e.g., Holder, Issuer, Verifier) for Verifiable Credential (VC) issuance or verification processes. These workflows follow the guidelines established in [VC-API Workflows and Exchanges](https://w3c-ccg.github.io/vc-api/#workflows-and-exchanges).

Workflows allow developers to integrate and automate credential-related processes while maintaining compliance with standards like [DID](https://www.w3.org/TR/did-core/) and [VC Data Model](https://www.w3.org/TR/vc-data-model/).

---

## Credential Workflow Flows

### Workflow Configuration

```mermaid
sequenceDiagram
    actor Admin as Workflow Admin
    participant System as Workflow Management System
    actor Stakeholder as Stakeholder (Issuer/Verifier/Holder)
    
    Admin->>System: define the workflow template
    System->>Admin: confirm workflow configuration
    Admin->>Stakeholder: share workflow details
```

### Workflow Execution: Issuance/Verification
This sequence diagram illustrates the execution of a credential issuance or verification workflow. It includes all major interactions required for a successful VC operation.

```mermaid
sequenceDiagram
  actor Holder as Holder
  participant HolderUI as Holder User Interface
  participant Issuer as Issuer System
  participant Verifier as Verifier System
  participant Workflow as Workflow Service
  
  rect rgb(243, 255, 255)
  note right of Holder: Workflow initiation
    Holder->>HolderUI: initiate workflow
    HolderUI->>Workflow: submit workflow request
    Workflow->>Issuer: send workflow details for issuance
    Workflow->>Verifier: send workflow details for verification
  end

  rect rgb(255, 243, 255)
  note right of Workflow: Credential processing
    Issuer->>Workflow: process issuance data
    Workflow->>Verifier: share issued VC
    Verifier->>Workflow: process verification request
    Workflow-->>HolderUI: return workflow results
  end
```

## Workflow Definitions

To maintain a generic implementation for the VC-API, workflows are configured dynamically at runtime using Workflow Definitions. These definitions specify the steps, rules, and entities involved in the workflow.

### Workflow Definition Structure and Properties

#### Workflow Steps

The steps property of a Workflow Definition specifies the sequence of actions to be performed.

The supported step types are:

1. Query: An Issuer or a Verify requests data from a Holder.
2. Issuance: An Issuer provids one or more VCs to a Holder.

The step type is determined by whether or the step configuration includes a query for data.
If the step includes a query, the step is a Query step. Otherwise, it is an Issuance step.

#### Workflow Callbacks
Workflow Definitions can include callbacks to notify parties when specific events occur during the workflow. Callbacks consist of POST requests to the configured URLs.

A typical callback scenario is when another services needs to be notified when a presentation is made.

## Workflow Examples

### Data Issuance Workflow Example

A mediated issuance workflow involves interactions between the Holder, Workflow Service, and Issuer. The Workflow Service coordinates the collection of Holder data, submission to the Issuer, and issuance of the VC.

Example Workflow Steps:

- Holder initiates issuance request via UI.
- Workflow collects Holder details (e.g., DID, attributes).
- Issuer reviews the data and issues VC.
- Workflow returns the VC to the Holder for storage in their wallet.

### Data Query and Verification Workflow Example

An unmediated verification workflow involves direct submission of VC data to the Verifier.

Example Workflow Steps:

- Holder shares VC with Verifier.
- Workflow validates VC signatures and compliance.
- Workflow returns verification result to the Holder.
