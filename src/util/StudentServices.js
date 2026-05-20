import { collection, getDocs, addDoc, updateDoc, getDoc, doc, deleteDoc } from "firebase/firestore";
import { db } from "../../firebase.js";

const fetchAllStudents = async () => {
    const snapshot = await getDocs(collection(db, "students"));
    return snapshot.docs.map((d) => ({ id: d.id, ...d.data() }));
};

const studentFromId = async (id) => {
    const student = await getDoc(doc(db, "students", id));
    return student.exists() ? { id: student.id, ...student.data() } : null;
};

const addStudent = async (first_name, last_name) => {
    await addDoc(collection(db, "students"), {
        first_name: first_name,
        last_name: last_name
    });
};

const deleteStudent = async (studentId) => {
    await deleteDoc(doc(db, "students", studentId));
};

const updateStudent = async (studentId, updatedFields) => {
    await updateDoc(doc(db, "students", studentId), updatedFields);
};

export { fetchAllStudents, 
    studentFromId, 
    addStudent, 
    updateStudent,
    deleteStudent 
};