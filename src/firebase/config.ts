import { initializeApp, getApps, getApp } from 'firebase/app';
import { 
  getAuth, 
  GoogleAuthProvider, 
  signInWithPopup, 
  signOut as fbSignOut, 
  onAuthStateChanged,
  type User as FirebaseUser
} from 'firebase/auth';
import { 
  getFirestore, 
  collection, 
  doc, 
  getDocs, 
  getDoc, 
  setDoc, 
  deleteDoc, 
  query, 
  orderBy, 
  serverTimestamp,
  Timestamp
} from 'firebase/firestore';
import type { JournalEntry, ReflectionInsight, ChatMessage, UserProfile } from '../types';
import appConfig from '../../firebase-applet-config.json';

const firebaseConfig = {
  apiKey: appConfig.apiKey,
  authDomain: appConfig.authDomain,
  projectId: appConfig.projectId,
  storageBucket: appConfig.storageBucket,
  messagingSenderId: appConfig.messagingSenderId,
  appId: appConfig.appId,
  firestoreDatabaseId: appConfig.firestoreDatabaseId
};

// Initialize Firebase App safely (singleton)
const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);

// Initialize Firebase Auth
export const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({ prompt: 'select_account' });

// Initialize Firestore
// Use specified database ID if available
export const db = appConfig.firestoreDatabaseId 
  ? getFirestore(app, appConfig.firestoreDatabaseId)
  : getFirestore(app);

// Authentication Helpers
export async function signInWithGoogle(): Promise<UserProfile> {
  const result = await signInWithPopup(auth, googleProvider);
  const user = result.user;
  return {
    uid: user.uid,
    email: user.email,
    displayName: user.displayName,
    photoURL: user.photoURL
  };
}

export async function signOut(): Promise<void> {
  await fbSignOut(auth);
}

export function subscribeToAuthState(callback: (user: UserProfile | null) => void) {
  return onAuthStateChanged(auth, (user: FirebaseUser | null) => {
    if (user) {
      callback({
        uid: user.uid,
        email: user.email,
        displayName: user.displayName,
        photoURL: user.photoURL
      });
    } else {
      callback(null);
    }
  });
}

// -------------------------------------------------------------
// FIRESTORE OPERATIONS (Strictly Isolated by User UID)
// -------------------------------------------------------------

function getUserJournalsRef(userId: string) {
  if (!userId) throw new Error('User ID is required for Firestore operation');
  return collection(db, 'users', userId, 'journal_entries');
}

/**
 * Fetch all journal entries for a specific authenticated user
 */
export async function fetchUserJournalEntries(userId: string): Promise<JournalEntry[]> {
  try {
    const colRef = getUserJournalsRef(userId);
    const q = query(colRef, orderBy('createdAt', 'desc'));
    const snapshot = await getDocs(q);
    
    const entries: JournalEntry[] = [];
    snapshot.forEach((docSnap) => {
      const data = docSnap.data();
      entries.push({
        id: docSnap.id,
        userId: data.userId || userId,
        title: data.title || 'Untitled Reflection',
        content: data.content || '',
        mode: data.mode || 'chat',
        promptTheme: data.promptTheme || '',
        moodTag: data.moodTag || 'Contemplative',
        keyThemes: Array.isArray(data.keyThemes) ? data.keyThemes : [],
        insights: data.insights || undefined,
        messages: Array.isArray(data.messages) ? data.messages : [],
        createdAt: data.createdAt instanceof Timestamp ? data.createdAt.toDate().toISOString() : (data.createdAt || new Date().toISOString()),
        updatedAt: data.updatedAt instanceof Timestamp ? data.updatedAt.toDate().toISOString() : (data.updatedAt || new Date().toISOString()),
        wordCount: data.wordCount || 0
      });
    });
    return entries;
  } catch (error) {
    console.error('Error fetching journal entries from Firestore:', error);
    throw error;
  }
}

// Helper to recursively remove undefined fields so Firestore setDoc does not throw
function removeUndefinedFields<T>(obj: T): T {
  if (obj === null || obj === undefined) {
    return obj;
  }
  if (Array.isArray(obj)) {
    return obj.map((item) => removeUndefinedFields(item)) as unknown as T;
  }
  if (typeof obj === 'object' && !(obj instanceof Date) && !(obj instanceof Timestamp)) {
    const cleaned: Record<string, any> = {};
    for (const [key, value] of Object.entries(obj)) {
      if (value !== undefined) {
        cleaned[key] = removeUndefinedFields(value);
      }
    }
    return cleaned as T;
  }
  return obj;
}

/**
 * Save or update a journal entry strictly in the user's isolated subcollection
 */
export async function saveUserJournalEntry(
  userId: string, 
  entry: Omit<JournalEntry, 'userId'> & { id?: string }
): Promise<string> {
  try {
    const entryId = entry.id || `entry_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
    const docRef = doc(db, 'users', userId, 'journal_entries', entryId);
    
    const rawPayload = {
      ...entry,
      id: entryId,
      userId,
      updatedAt: new Date().toISOString(),
      createdAt: entry.createdAt || new Date().toISOString()
    };

    const cleanPayload = removeUndefinedFields(rawPayload);
    
    await setDoc(docRef, cleanPayload, { merge: true });
    return entryId;
  } catch (error) {
    console.error('Error saving journal entry to Firestore:', error);
    throw error;
  }
}

/**
 * Delete a user's journal entry strictly isolated to their UID
 */
export async function deleteUserJournalEntry(userId: string, entryId: string): Promise<void> {
  try {
    const docRef = doc(db, 'users', userId, 'journal_entries', entryId);
    await deleteDoc(docRef);
  } catch (error) {
    console.error('Error deleting journal entry from Firestore:', error);
    throw error;
  }
}
