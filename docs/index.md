# OWF VC API Implementation

## Introduction
The [VC API implementation project](https://github.com/openwallet-foundation-labs/vc-api) provides a NestJs implementation of the [W3C Credentials Community Group](https://w3c-ccg.github.io/) [VC API Specification](https://w3c-ccg.github.io/vc-api).

This is project is a Labs project under the [Open Wallet Foundation](https://openwallet.foundation/).

## What is the VC API?
Verifiable Credentials (VCs) are [a W3C standard](https://www.w3.org/TR/vc-data-model/) for expressing credentials which are machine readable and whose authenticity can be verified.
The VC API is a shared interface for Verifiable Credential lifecycle management.
This means that VC API can be used by an organization or user to issue and verify VCs as well as exchange VCs with other organizations or users.

## Why use VC API?
- **Interoperability**: VC API provides a specified interface for VC lifecycle management. This means that if you design your system to use VC API, you can reduce the changes and knowledge required to switch to a different implementation. A list of some implementations of VC API can be found at [canivc.com](https://canivc.com) (this project can be found under "EWF"). 
- **Modularity**: VC API's modularity means that you can use only the pieces that you need. For example, you can issue and verify VCs with VC API while using a different approach for exchanging VCs.
- **Simplicity**: VC API keeps the API simple and removes unnecessary optionality from clients. For instance, VC API suggests using pre-configured instances rather than requiring clients to have knowledge of desired options.
- **Composability**: VC API provides primitives which can be composed to create more complex operations. For example, the "workflow" primitive can be used to create a sequence of operations or be combined with other protocols such as OID4VP.
- **Extensibility**: VC API is designed to be extensible. For example, OAuth2 is specified as an authorization mechanism but other mechanisms can be also be used.

## How to use VC API in your architecture

The VC API architecture defines [coordinator](https://w3c-ccg.github.io/vc-api/#coordinators) and [service](https://w3c-ccg.github.io/vc-api/#services) components.
The VC API endpoints are on the service components and are called by coordinators, by other services, or by clients directly.
The expected callers of the VC API endpoints are listed in the specification [component overview](https://w3c-ccg.github.io/vc-api/#api-component-overview).
The relationship between the components is shown in the diagram below.

![VC API Components](https://w3c-ccg.github.io/vc-api/diagrams/components.svg)

As the project is an implementation of the VC API specification, the project provides the service components and is flexible in how the coordinator components are implemented.
The coordinator executes the business rules and policies and is therefore specific to the use cases of an organization.
*A first step to integrate the VC API implementation into your architecture could therefore be to decide how you want to define the business logic to coordinate VC API calls for your use case.*

## Why use this implementation?
- **Open Source**: This implementation is open source and free to use, under an Apache 2.0 license.
- **Integration with OWF**: This implementation is part of the Open Wallet Foundation ecosystem and strives to be compatible with other OWF projects. In particular, this implementation uses the [OWF Credo project](https://github.com/openwallet-foundation/credo-ts) as the underlying project for credential operations.