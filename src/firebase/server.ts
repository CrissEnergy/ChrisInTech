// IMPORTANT: This file is for server-side Firebase initialization only.
// Do not import this file on the client.

import { getApps, getApp, initializeApp } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
import { firebaseConfig } from './config';

// Create a singleton for the Firebase Admin app instance
let firebaseAdminApp: ReturnType<typeof initializeApp>;

export async function initializeFirebaseAdmin() {
  if (!getApps().length) {
    try {
      // App Hosting provides service account credentials via env vars
      firebaseAdminApp = initializeApp();
    } catch (e) {
      console.warn(
        'Could not initialize Firebase Admin with environment variables. ' +
        'This is expected in a local development environment. ' +
        'Falling back to the client-side config for authentication with limited privileges.'
      );
      // For local dev, we might not have admin creds. We can use the client config,
      // but this will run with client-level (not admin) permissions.
      // This is a common pattern for local dev against a shared Firebase project.
       firebaseAdminApp = initializeApp({
          projectId: firebaseConfig.projectId,
       });
    }
  } else {
    firebaseAdminApp = getApp();
  }
  
  const firestore = getFirestore(firebaseAdminApp);

  return { firestore, firebaseAdminApp };
}
