import firebaseFunctionsTest from 'firebase-functions-test';

const testEnv = firebaseFunctionsTest(
  {
    projectId: 'your-project-id',
    databaseURL: 'https://your-database-name.firebaseio.com',
    storageBucket: 'your-project-id.appspot.com',
  },
  'path/to/serviceAccountKey.json'
);

export default testEnv;
