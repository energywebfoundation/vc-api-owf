export const mockCredoService = {
  wallet: {
    withSession: jest.fn()
  },
  agent: {
    wallet: {
        createKey: jest.fn()
    }
  }
};