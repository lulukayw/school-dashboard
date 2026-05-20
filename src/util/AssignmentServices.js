import { collection, getDocs, addDoc, updateDoc, getDoc, doc, deleteDoc } from "firebase/firestore";
import { db } from "../../firebase.js";

const fetchAssignments = async (classId) => {
    const snapshot = await getDocs(
        collection(db, "classes", classId, "assignments")
    );

    return snapshot.docs.map((d) => ({ id: d.id, ...d.data() }));
};

const assignmentFromId = async (classId, assignmentId) => {
    const ref = doc(db, "classes", classId, "assignments", assignmentId);
    const snap = await getDoc(ref);

    return snap.exists() ? { id: snap.id, ...snap.data() } : null;
};

const addAssignment = async (classId, name, category, max_score) => {
    const ref = await addDoc(collection(db, "classes", classId, "assignments"), {
        name,
        category,
        max_score,
        scores: {}
    }
    );

    return ref.id;
};

const updateScore = async (classId, assignmentId, studentId, score) => {
    const ref = doc(db, "classes", classId, "assignments", assignmentId);
    const snap = await getDoc(ref);
    if (!snap.exists()) return;

    const data = snap.data();

    if (score > data.max_score || score < 0) return;

    await updateDoc(ref, {
        [`scores.${studentId}`]: score
    });
};

const deleteAssignment = async (classId, assignmentId) => {
    await deleteDoc(
        doc(db, "classes", classId, "assignments", assignmentId)
    );
};

export {
    fetchAssignments,
    assignmentFromId,
    addAssignment,
    updateScore,
    deleteAssignment
};