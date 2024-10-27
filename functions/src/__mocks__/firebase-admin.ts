// __mocks__/firebase-admin.ts
const mockFirestore = {
  collection: jest.fn(() => mockCollection),
};

const mockCollection = {
  doc: jest.fn(() => mockDoc),
  get: jest.fn(),
};

const mockDoc = {
  id: 'taskId',
  data: jest.fn(),
  set: jest.fn(),
  get: jest.fn(),
  update: jest.fn(),
  delete: jest.fn(),
};

const admin = {
  firestore: jest.fn(() => mockFirestore),
};

export default admin;
export { mockFirestore, mockCollection, mockDoc };
