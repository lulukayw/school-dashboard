import {
  collection,
  getDocs,
  addDoc,
  updateDoc,
  getDoc,
  doc,
  deleteDoc,
} from "firebase/firestore";
import { db } from "../../firebase.js";

const fetchAllTeachers = async () => {
  const snapshot = await getDocs(collection(db, "teachers"));
  return snapshot.docs.map((d) => ({ id: d.id, ...d.data() }));
};

const teacherFromId = async (id) => {
  const teacher = await getDoc(doc(db, "teachers", id));
  return teacher.exists() ? { id: teacher.id, ...teacher.data() } : null;
};

const addTeacher = async (first_name, last_name) => {
  await addDoc(collection(db, "teachers"), {
    first_name: first_name,
    last_name: last_name,
  });
};

const deleteTeacher = async (teacherId) => {
  await deleteDoc(doc(db, "teachers", teacherId));
};

const updateTeacher = async (teacherId, updatedFields) => {
  await updateDoc(doc(db, "teachers", teacherId), updatedFields);
};

export { fetchAllTeachers, teacherFromId, addTeacher, deleteTeacher };
