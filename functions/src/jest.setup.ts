jest.mock('firebase-admin', () => {
  const originalModule = jest.requireActual('firebase-admin');
  return {
    ...originalModule,
    initializeApp: jest.fn(), // Mock `initializeApp` solo para los tests
    db: {
      collection: jest.fn(),
    },
  };
});
