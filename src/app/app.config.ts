import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';
import { initializeApp } from 'firebase/app';

import { routes } from './app.routes';
import { firebaseConfig } from './firebase.config';
import { environment } from '../environments/environment';

const useEmulators = environment.useEmulators;

// Initialize Firebase app
const app = initializeApp(firebaseConfig);

// Initialize Firebase services
// const auth = getAuth(app);
// const firestore = getFirestore(app);
// const storage = getStorage(app);
// const analytics = getAnalytics(app);
// const functions = getFunctions(app);

// Connect to emulators if in development mode
// if (useEmulators) {
//   connectAuthEmulator(auth, 'http://localhost:9099');
//   connectFirestoreEmulator(firestore, 'localhost', 8080);
//   connectStorageEmulator(storage, 'localhost', 9199);
//   connectFunctionsEmulator(functions, 'localhost', 5001);
// }

export const appConfig: ApplicationConfig = {
  providers: [provideRouter(routes)]
};
