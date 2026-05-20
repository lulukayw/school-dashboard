import { collection, getDocs, addDoc, deleteDoc, updateDoc, doc, Timestamp } from "firebase/firestore";

import { db } from "/firebase.js";

export const fetchAllEvents = async () => {
  const snapshot = await getDocs(collection(db, "events"));
  return snapshot.docs.map((d) => {
    const data = d.data();
    return {
      id: d.id,
      name: data.name,
      location: data.location,
      // normalize to JS Date
      start: data.start?.toDate?.(),
      end: data.end?.toDate?.(),
    };
  });
};

export const addEvent = async (name, location, start, end) => {
  const docRef = await addDoc(collection(db, "events"), {
    name,
    location,
    start: Timestamp.fromDate(start), // JS Date → Firestore Timestamp
    end: Timestamp.fromDate(end), // JS Date → Firestore Timestamp
  });

  return docRef.id;
};

export const deleteEvent = async (id) => {
  await deleteDoc(doc(db, "events", id));
};

export const updateEvent = async (id, updatedFields) => {
  await updateDoc(doc(db, "events", id), {
    ...updatedFields,
    start: updatedFields.start
      ? Timestamp.fromDate(updatedFields.start)
      : undefined,
    end: updatedFields.end
      ? Timestamp.fromDate(updatedFields.end)
      : undefined,
  });
};

export const eventFromId = async (id) => {
  const eventDoc = await getDoc(doc(db, "events", id));
  if (!eventDoc.exists()) return null;

  const data = eventDoc.data();
  return {
    id: eventDoc.id,
    name: data.name,
    location: data.location,
    start: (data.start_time || data.start)?.toDate?.() || null,
    end: (data.end_time || data.end)?.toDate?.() || null,
  };
};

export function parseDateTime(date, time) {
  const [y, m, d] = date.split("-").map(Number);
  const [h, min] = time.split(":").map(Number);
  return new Date(y, m - 1, d, h, min);
}

export function getLocalDateString(date) {
  const offset = date.getTimezoneOffset();
  const localDate = new Date(date.getTime() - (offset * 60 * 1000));
  return localDate.toISOString().split('T')[0];
}
