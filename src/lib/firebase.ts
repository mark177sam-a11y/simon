import { initializeApp, getApps } from 'firebase/app';
import { 
  getFirestore, 
  collection, 
  doc, 
  setDoc, 
  deleteDoc, 
  onSnapshot, 
  query, 
  orderBy,
  getDocs
} from 'firebase/firestore';
import firebaseConfig from '../../firebase-applet-config.json';
import { BookingRecord } from '../types';
import { INITIAL_BOOKINGS } from '../data/mockData';

import { getDocFromServer } from 'firebase/firestore';

// Initialize Firebase App
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];

// CRITICAL: Initialize Firestore with specific databaseId as specified in firebase-applet-config
export const db = getFirestore(app, firebaseConfig.firestoreDatabaseId);

// Validate connection to Firestore on boot as required by skill guidelines
export async function testConnection() {
  try {
    await getDocFromServer(doc(db, 'test', 'connection'));
  } catch (error) {
    if (error instanceof Error && error.message.includes('the client is offline')) {
      console.error("Please check your Firebase configuration.");
    }
  }
}
testConnection();

export enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
}

export function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null) {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    operationType,
    path
  };
  console.error('Firestore Error: ', JSON.stringify(errInfo));
  throw new Error(JSON.stringify(errInfo));
}

const BOOKINGS_COLLECTION = 'bookings';

// Real-time synchronization for bookings
export function subscribeBookings(
  onSuccess: (bookings: BookingRecord[]) => void,
  onError?: (err: Error) => void
) {
  const q = query(collection(db, BOOKINGS_COLLECTION));

  return onSnapshot(
    q,
    async (snapshot) => {
      if (snapshot.empty) {
        // If Firestore is empty, auto-seed with INITIAL_BOOKINGS
        try {
          for (const b of INITIAL_BOOKINGS) {
            await setDoc(doc(db, BOOKINGS_COLLECTION, b.id), b);
          }
        } catch (e) {
          console.warn('Initial seeding fallback to memory:', e);
          onSuccess(INITIAL_BOOKINGS);
          return;
        }
      }

      const items: BookingRecord[] = [];
      snapshot.forEach((docSnap) => {
        const data = docSnap.data() as BookingRecord;
        items.push({
          ...data,
          id: docSnap.id
        });
      });

      // Sort newest first
      items.sort((a, b) => new Date(b.createdAt || '').getTime() - new Date(a.createdAt || '').getTime());
      onSuccess(items);
    },
    (error) => {
      console.warn('Firestore subscription error, using local fallback:', error);
      if (onError) onError(error);
    }
  );
}

// Create or update booking in Firestore
export async function saveBooking(booking: BookingRecord): Promise<void> {
  const path = `${BOOKINGS_COLLECTION}/${booking.id}`;
  try {
    await setDoc(doc(db, BOOKINGS_COLLECTION, booking.id), booking, { merge: true });
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
  }
}

// Delete booking from Firestore
export async function deleteBooking(bookingId: string): Promise<void> {
  const path = `${BOOKINGS_COLLECTION}/${bookingId}`;
  try {
    await deleteDoc(doc(db, BOOKINGS_COLLECTION, bookingId));
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, path);
  }
}
