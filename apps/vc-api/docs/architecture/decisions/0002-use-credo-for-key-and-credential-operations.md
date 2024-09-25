# 2. Use Credo for key and credential operations

Date: 2024-09-25

## Status

Accepted

## Context

Prior to this decision, Spruce's DIDKit was used for DID generation and credential issuance & verification.
The rational for DIDKit's use is that it:
- Is written in Rust and so suitable for use in any mobile app development framework
- Supports JSON-LD and JWT credential issuance and verification
- Supports did:key, did:ethr, did:web
- DIDKit (and its libraries) are open-source

However, a significant limitation of DIDKit is that only inline JSON-LD contexts are supported 
(see [this discussion on the Spruce Discord server](https://discord.com/channels/862419652286218251/1021707856401141760/1021709845931495444)), 
which limits the usability of the VC API application.

[GitHub Issue #20](https://github.com/openwallet-foundation-labs/vc-api/issues/20) proposed using Credo
to address the JSON-LD context limitation and provide other benefits.

## Decision

Credo (formerly Aries Framework Javascript) is an alternative library for key and credential operations.
We have decided to replace DIDKit with Credo.

## Consequences

Expected benefits from using Credo are:
- The ability to provide additional JSON-LD context documents to a document loader
- Synergy with another Open Wallet Foundation project
- Improved typing, bug patching and debugging due to Credo also being written in Typescript

A possible risk is that Credo encapsulates the database access
and so the project will have less control over the database schema used for key storage.
