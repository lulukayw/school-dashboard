import { useState, useEffect } from "react";
import { db } from "../../firebase";

import "../App.css";
import {
  collection,
  getDocs,
  updateDoc,
  doc,
  increment,
  addDoc,
} from "firebase/firestore";
export default function Teachers() {
  const [teachers, setTeachers] = useState([]);
  const [newTeachers, setNewTeachers] = useState([]);
  const fetchResponses = async () => {
    const querySnapshot = await getDocs(collection(db, "teachers"));
    console.log("fetched docs:", querySnapshot.docs.length);
    const data = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    setTeachers(data);
  };

  useEffect(() => {
    fetchResponses();
  }, []);

  const handleNewTeachers = async () => {
    const docRef = await addDoc(collection(db, "teachers"), {
      Teacher: newTeacher,
    });
    setNewResponse("");
    fetchResponses();
  };

  const handleDeleteTeachers = async () => {
    const docRef = await addDoc(collection(db, "teachers"), {
      Teacher: 0,
    });
    setNewResponse("");
    fetchResponses();
  };
  return (
    <div className="Teachers">
      <header className="Teachers-header">Teachers:</header>
      <ul>
        {teachers.map((teachers) => (
          <li key={teachers.id}>
            {teachers.first_name} {teachers.last_name}
          </li>
        ))}
      </ul>
    </div>
  );
}
