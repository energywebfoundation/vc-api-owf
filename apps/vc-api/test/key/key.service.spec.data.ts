import { KeyEntryObject } from '@hyperledger/aries-askar-shared';
import { Key } from '@credo-ts/core';

export const createdKey: Key = {
  keyType: 'ed25519',
  publicKeyBase58: '6qZag5woSLKdVtKW37hBPNZGrJFzR4HiXvsADAZY1seC'
} as any;

export const keyEntryObject: KeyEntryObject = {
  key: {
    get jwkPublic() {
      return {
        kty: 'OKP',
        crv: 'Ed25519',
        x: 'VrsnBw1-JP3R4xuaQqDQI9pXM2YP1Per79Unm2UkCaU',
        kid: '6qZag5woSLKdVtKW37hBPNZGrJFzR4HiXvsADAZY1seC'
      };
    }
  } as any
} as any;
