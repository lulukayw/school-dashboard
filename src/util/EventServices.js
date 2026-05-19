import { collection, getDocs, addDoc, updateDoc, getDoc, doc, deleteDoc } from "firebase/firestore";
import { db } from "../../firebase.js";

const fetchAllEvents = async () => {
    const snapshot = await getDocs(collection(db, "events"));
    return snapshot.docs.map((d) => ({ id: d.id, ...d.data() }));
};

const eventFromId = async (id) => {
    const event = await getDoc(doc(db, "events", id));
    return event.exists() ? { id: event.id, ...event.data() } : null;
};

/*
MAKE SURE WHEN USING THIS FUNCTION!!!!!!!
have proper timestamps!!! ex:
await addEvent(
  "Back to School Night",
  "Auditorium",
  Timestamp.fromDate(new Date("2026-09-01T18:00:00")),
  Timestamp.fromDate(new Date("2026-09-01T20:00:00"))
);

probably best to have a restricted way when entering time/date
*/

const addEvent = async (name, location, start_time, end_time) => {
    const ref = await addDoc(collection(db, "events"), {
        name: name,
        location: location,
        start_time: start_time,
        end_time: end_time
    });
};

const updateEvent = async (eventId, updatedFields) => {
    await updateDoc(doc(db, "events", eventId), updatedFields);
};

const deleteEvent = async (eventId) => {
    await deleteDoc(doc(db, "events", eventId));
};

export {
    fetchAllEvents,
    eventFromId,
    addEvent,
    updateEvent,
    deleteEvent
};