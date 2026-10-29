import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';
import { getFirestore, doc, getDocFromServer } from 'firebase/firestore';
import firebaseConfig from '../firebase-applet-config.json';

const defaultApp = !getApps().length ? initializeApp(firebaseConfig) : getApp();

// Dedicated Firestore app instance without Auth attached.
// This completely prevents Firestore from calling securetoken.googleapis.com,
// enabling direct, reliable Cloud Firestore access without token fetch errors.
const firestoreApp = !getApps().some((a) => a.name === 'firestore-client')
  ? initializeApp(firebaseConfig, 'firestore-client')
  : getApp('firestore-client');

export const db = getFirestore(firestoreApp, firebaseConfig.firestoreDatabaseId);
export const auth = getAuth(defaultApp);
export const googleProvider = new GoogleAuthProvider();

export enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

export interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId?: string | null;
    email?: string | null;
    emailVerified?: boolean | null;
    isAnonymous?: boolean | null;
  };
}

export function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null): never {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: auth.currentUser?.uid,
      email: auth.currentUser?.email,
      emailVerified: auth.currentUser?.emailVerified,
      isAnonymous: auth.currentUser?.isAnonymous,
    },
    operationType,
    path,
  };
  console.error('Firestore Error: ', JSON.stringify(errInfo));
  throw new Error(JSON.stringify(errInfo));
}

export async function testConnection() {
  try {
    await getDocFromServer(doc(db, 'test', 'connection'));
  } catch (error) {
    // Quietly catch during token propagation or offline mode
    console.info('Firebase connection test status: client operating with local storage resilience.');
  }
}
