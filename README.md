
# OWF VC API Implementation

[![CI](https://github.com/energywebfoundation/ssi/actions/workflows/main.yml/badge.svg?event=push)](https://github.com/energywebfoundation/ssi/actions/workflows/main.yml)

## Introduction
This repository provides a NestJs  [VC API implementation](./apps/vc-api/) of the [W3C Credentials Community Group](https://w3c-ccg.github.io/) [VC API Specification](https://w3c-ccg.github.io/vc-api).

This is project is a Labs project under the [Open Wallet Foundation](https://openwallet.foundation/).

## Overview Documentation

For background on the VC API and how to use this project in your architecture, see the [overview documentation site](https://openwallet-foundation-labs.github.io/vc-api).

## Supporting Organizations
In addition to being supported by the Open Wallet Foundation, this project is supported by the Elia Group, the Energy Web Foundation and Impactility.

<p align="center">
  <a href="https://www.energyweb.org" target="blank"><img src="./EW.png" width="100" alt="Energy Web Foundation Logo" /></a>
  <a href="https://www.eliagroup.com/" target="blank"><img src="./EG.jpg" height="80" alt="Elia Group Logo" /></a>
  <a href="https://impactility.com/" target="blank"><img src="./IM.png" height="80" alt="Impactility Logo" /></a>
</p>

## Technology Decisions

Architecture Decision Records are used to track technology and architecture decsions
(see [ADR 01](./apps/vc-api/docs/architecture/decisions/0001-record-architecture-decisions.md)).

The Architecture Decisions Records can be found [here](apps/vc-api/docs/architecture/decisions).

The [ADR Tools command line tool](https://github.com/npryce/adr-tools) can be used to add new ADRs.

## App Development
This repository is a monorepo that uses [Rush](https://rushjs.io/) with the PNPM package manager.

PNPM is used for its speed and solution to NPM doppelgangers (as well as being the default option for rush).
See comparison of [NPM vs PNPM vs Yarn for Rush](https://rushjs.io/pages/maintainer/package_managers/).

### Requirements

PNPM is required. See installation instructions here: https://pnpm.js.org/installation/

Rush is required. See installation instructions here: https://rushjs.io/pages/intro/get_started/

### Install

Use rush to install dependencies (not the package manager directly).
In other words, do not run `npm install` or `pnpm install`.
This is because [Rush optimizes](https://rushjs.io/pages/developer/new_developer/) by installing all of the dependency packages in a central folder, and then uses symlinks to create the “node_modules” folder for each of the projects.

```sh
$ rush install
```

### Build

Use rush to build.

```sh
$ rush build
```

## Testing
To run tests across all apps and libraries in one command, a rush script has been added to `./common/config/rush/command-line.json` 
``` sh
$ rush test
```

## Docs Editing

To edit the documentation, you can run the following command to start the docs server:

```sh
docker run --rm -it -p 8000:8000 -v ${PWD}:/docs squidfunk/mkdocs-material
```

If it's not working, the [mkdocs-material documentation](https://squidfunk.github.io/mkdocs-material/creating-your-site/#previewing-as-you-write) could be helpful for troubleshooting.

### Docs Publishing

The docs website is published by merging into the `develop` branch (see ./github/workflows/docs.yml).

## Contributing Guidelines 
See [contributing.md](./contributing.md)

## Questions and Support
For questions and support please use the Github issues.

## License

This project is licensed under the Apache 2.0 license - see the [LICENSE](LICENSE) file for details

