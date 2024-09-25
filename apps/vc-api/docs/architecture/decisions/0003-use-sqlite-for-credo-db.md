# 3. Use SQLite for Credo DB

Date: 2024-09-30

## Status

Accepted

## Context

The issue motivating this decision, and any context that influences or constrains the decision.

[Credo requires a wallet and storage implement](https://credo.js.org/guides/getting-started/set-up#adding-a-wallet-and-storage-implementation).
At the time of writing, only Aries Askar is provided out of the box.

[Aries Askar](https://github.com/hyperledger/aries-askar) is a database abstract that supports several different underlying databases.
At the time of writing, in-memory (for testing), SQLite and PostgreSQL are supported.

## Decision

The change that we're proposing or have agreed to implement.

We have decided to use Aries Askar as the underlying storage for Credo.
No other known option was available.

We have decides to use SQLite 
The rationale is twofold:
1. SQLite is less effort than PostgreSQL for a developer to run the app locally.
2. SQLite is less effort for an initial integration with Credo.
This decision doesn't preclude the addition of PostgreSQL as an option in the future.

## Consequences

SQLite is superior for experimentation and proof-of-concept but may not be suitable for production usage
depending on scalability requirements.
Support for PostgreSQL as backing store for Credo can be supported in the future.