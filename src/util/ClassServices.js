import { collection, getDocs, addDoc, updateDoc, getDoc, doc, deleteDoc } from "firebase/firestore";
import { db } from "../../firebase.js";
import { studentFromId } from "./studentServices.js";

const fetchAllClasses = async () => {
    const snapshot = await getDocs(collection(db, "classes"));
    return snapshot.docs.map((d) => ({ id: d.id, ...d.data() }));
};

const classFromId = async (id) => {
    const clas = await getDoc(doc(db, "classes", id));
    return clas.exists() ? { id: clas.id, ...clas.data() } : null;
};

const addClass = async (name, room, teacher_id) => {
    await addDoc(collection(db, "classes"), {
        name: name,
        room: room,
        teacher_id: teacher_id,
        average_grade: 0,
        students: []
    });
};

const addStudentToClass = async (classId, studentId, grade) => {
    const clas = await getDoc(doc(db, "classes", classId));
    const student = await studentFromId(studentId);

    if (!clas.exists() || !student) return;

    const classData = clas.data();
    if (classData.students.some((s) => s.id === student.id)) return;

    const updatedStudents = [
        ...classData.students,
        {
            id: student.id,
            grade: grade
        }
    ];

    const total = updatedStudents.reduce((sum, s) => sum + (s.grade || 0), 0);
    const avg = updatedStudents.length
        ? Math.round(total / updatedStudents.length)
        : 0;

    await updateDoc(doc(db, "classes", classId), {
        students: updatedStudents,
        average_grade: avg
    });
};

const removeStudentFromClass = async (classId, studentId) => {
    const clas = await getDoc(doc(db, "classes", classId));

    if (!clas.exists()) return;

    const classData = clas.data();

    const updatedStudents = classData.students.filter(
        (s) => s.id !== studentId
    );

    const total = updatedStudents.reduce((sum, s) => sum + (s.grade || 0), 0);
    const avg = updatedStudents.length
        ? Math.round(total / updatedStudents.length)
        : 0;

    await updateDoc(doc(db, "classes", classId), {
        students: updatedStudents,
        average_grade: avg
    });
};

const updateGrade = async (classId, studentId, newGrade) => {
    const clas = await getDoc(doc(db, "classes", classId));

    if (!clas.exists()) return;

    const classData = clas.data();

    const updatedStudents = classData.students.map((s) =>
        s.id === studentId ? { ...s, grade: newGrade } : s
    );

    const total = updatedStudents.reduce((sum, s) => sum + (s.grade || 0), 0);
    const avg = updatedStudents.length
        ? Math.round(total / updatedStudents.length)
        : 0;

    await updateDoc(doc(db, "classes", classId), {
        students: updatedStudents,
        average_grade: avg
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
                first_name: student.first_name,
                last_name: student.last_name,
                grade: s.grade
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
    updateGrade,
    deleteClass,
    studentsFromClass,
    updateClass
};