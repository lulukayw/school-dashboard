import { useState, useEffect } from "react";
import { db } from "../../firebase";
import {
  fetchAllStudents,
  studentFromId,
  addStudent,
  deleteStudent,
  updateStudent,
} from "../util/StudentServices.js";
import "../App.css";
import "../styles/students.css";
import { collection, getDocs } from "firebase/firestore";

export default function Students() {
  const [students, setStudents] = useState([]);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [editFirstName, setEditFirstName] = useState("");
  const [editLastName, setEditLastName] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const fetchResponses = async () => {
    const querySnapshot = await getDocs(collection(db, "students"));
    const data = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    setStudents(data);
  };

  useEffect(() => {
    fetchResponses();
  }, []);

  const handleAddStudent = async () => {
    await addStudent(firstName, lastName);
    setFirstName("");
    setLastName("");
    fetchResponses();
  };

  const handleDeleteStudents = async (id) => {
    await deleteStudent(id);
    fetchResponses();
  };

  const handleEdit = (student) => {
    setEditingId(student.id);
    setEditFirstName(student.first_name);
    setEditLastName(student.last_name);
  };

  const handleUpdateStudents = async (id) => {
    await updateStudent(id, {
      first_name: editFirstName,
      last_name: editLastName,
    });
    setEditingId(null);
    fetchResponses();
  };

  const filteredStudents = students.filter((student) => {
    const fullName = `${student.first_name} ${student.last_name}`.toLowerCase();
    return fullName.includes(searchQuery.toLowerCase());
  });
  return (
    <div className="students-container">
      <div className="search-bar">
        <input
          type="text"
          placeholder="Search by name"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>
      <ul className="student-list">
        {filteredStudents.map((student) => (
          <li key={student.id} className="student-row">
            <span className="student-icon">👤</span>

            {editingId === student.id ? (
              <div className="edit-inputs">
                <input
                  type="text"
                  value={editFirstName}
                  onChange={(e) => setEditFirstName(e.target.value)}
                />
                <input
                  type="text"
                  value={editLastName}
                  onChange={(e) => setEditLastName(e.target.value)}
                />
                <button
                  className="btn btn-save"
                  onClick={() => handleUpdateStudents(student.id)}
                >
                  Save
                </button>
              </div>
            ) : (
              <>
                <span className="student-name">
                  {student.first_name} {student.last_name}
                </span>
                <div className="student-actions">
                  <button
                    className="btn btn-edit"
                    onClick={() => handleEdit(student)}
                  >
                    ✏️
                  </button>
                  <button
                    className="btn btn-delete"
                    onClick={() => handleDeleteStudents(student.id)}
                  >
                    🗑️
                  </button>
                </div>
              </>
            )}
          </li>
        ))}
      </ul>
      <div className="add-student-form">
        <input
          type="text"
          placeholder="First Name"
          value={firstName}
          onChange={(e) => setFirstName(e.target.value)}
        />
        <input
          type="text"
          placeholder="Last Name"
          value={lastName}
          onChange={(e) => setLastName(e.target.value)}
        />
        <button className="btn btn-add" onClick={handleAddStudent}>
          Add Student
        </button>
      </div>
    </div>
  );
}
