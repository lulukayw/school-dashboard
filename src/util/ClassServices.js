import { collection, getDocs, addDoc, updateDoc, getDoc, doc, deleteDoc } from "firebase/firestore";

import { db } from "../../firebase.js";
import { studentFromId } from "./StudentServices.js";

const fetchAllClasses = async () => {
  const snapshot = await getDocs(collection(db, "classes"));
  return snapshot.docs.map((d) => ({ id: d.id, ...d.data() }));
};

const classFromId = async (id) => {
  const clas = await getDoc(doc(db, "classes", id));
  return clas.exists() ? { id: clas.id, ...clas.data() } : null;
};

const addClass = async (name, room, teacher_id) => {
  const docRef = await addDoc(collection(db, "classes"), {
    name,
    room,
    teacher_id,
    students: []
  });

  return docRef.id;
};

const addStudentToClass = async (classId, studentId) => {
  const clas = await getDoc(doc(db, "classes", classId));
  const student = await studentFromId(studentId);

  if (!clas.exists() || !student) return;

  const classData = clas.data();
  if (classData.students.some((s) => s.id === student.id)) return;

  const updatedStudents = [
    ...classData.students,
    { id: student.id }
  ];

  await updateDoc(doc(db, "classes", classId), {
    students: updatedStudents
  });
};

const removeStudentFromClass = async (classId, studentId) => {
  const clas = await getDoc(doc(db, "classes", classId));
  if (!clas.exists()) return;

  const updatedStudents = clas.data().students.filter(
    (s) => s.id !== studentId
  );

  await updateDoc(doc(db, "classes", classId), {
    students: updatedStudents
  });
};

const deleteClass = async (classId) => {
  await deleteDoc(doc(db, "classes", classId));
};

const studentsFromClass = async (classId) => {
  const clas = await getDoc(doc(db, "classes", classId));
  if (!clas.exists()) return [];

  const students = clas.data().students;

  const results = await Promise.all(
    students.map(async (s) => {
      const student = await studentFromId(s.id);
      if (!student) return null;

      return {
        id: s.id,
        first_name: student.first_name,
        last_name: student.last_name
      };
    })
  );

  return results.filter(Boolean);
};

const updateClass = async (classId, updatedFields) => {
  await updateDoc(doc(db, "classes", classId), updatedFields);
};

export {
  fetchAllClasses,
  classFromId,
  addClass,
  addStudentToClass,
  removeStudentFromClass,
  deleteClass,
  studentsFromClass,
  updateClass,
};