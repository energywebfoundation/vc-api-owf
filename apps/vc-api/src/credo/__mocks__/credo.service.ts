export const mockCredoService = {
  wallet: {
    withSession: jest.fn()
  },
  agent: {
    wallet: {
      createKey: jest.fn()
    },
    w3cCredentials: {
      signCredential: jest.fn(),
      verifyCredential: jest.fn(),
      signPresentation: jest.fn(),
      verifyPresentation: jest.fn()
    }
  }
};
