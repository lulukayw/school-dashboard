import { useState, useEffect } from "react";
import { db } from "../../firebase";
import {
  fetchAllTeachers,
  teacherFromId,
  addTeacher,
  deleteTeacher,
  updateTeacher,
} from "../util/TeacherServices.js";
import "../App.css";
import "../styles/teachers.css"; // add this!
import { collection, getDocs } from "firebase/firestore";

export default function Teachers() {
  const [teachers, setTeachers] = useState([]);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [editFirstName, setEditFirstName] = useState("");
  const [editLastName, setEditLastName] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const fetchResponses = async () => {
    const querySnapshot = await getDocs(collection(db, "teachers"));
    const data = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    setTeachers(data.sort((a,b) => a.last_name.localeCompare(b.last_name)));
  };

  useEffect(() => {
    fetchResponses();
  }, []);

  const handleAddTeacher = async () => {
    await addTeacher(firstName, lastName);
    setFirstName("");
    setLastName("");
    fetchResponses();
  };

  const handleDeleteTeacher = async (id) => {
    await deleteTeacher(id);
    fetchResponses();
  };

  const handleEdit = (teacher) => {
    setEditingId(teacher.id);
    setEditFirstName(teacher.first_name);
    setEditLastName(teacher.last_name);
  };

  const handleUpdateTeacher = async (id) => {
    await updateTeacher(id, {
      first_name: editFirstName,
      last_name: editLastName,
    });
    setEditingId(null);
    fetchResponses();
  };

  const filteredTeachers = teachers.filter((teacher) => {
    const fullName = `${teacher.first_name} ${teacher.last_name}`.toLowerCase();
    return fullName.includes(searchQuery.toLowerCase());
  });
  return (
    <div className="teachers-container">
      <div className="search-bar">
        <input
          type="text"
          placeholder="Search by name"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>
      <ul className="teacher-list">
        {filteredTeachers.map((teacher) => (
          <li key={teacher.id} className="teacher-row">
            <span className="teacher-icon">👤</span>

            {editingId === teacher.id ? (
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
                  onClick={() => handleUpdateTeacher(teacher.id)}
                >
                  Save
                </button>
              </div>
            ) : (
              <>
                <span className="teacher-name">
                  {teacher.first_name} {teacher.last_name}
                </span>
                <div className="teacher-actions">
                  <button
                    className="btn btn-edit"
                    onClick={() => handleEdit(teacher)}
                  >
                    ✏️
                  </button>
                  <button
                    className="btn btn-delete"
                    onClick={() => handleDeleteTeacher(teacher.id)}
                  >
                    🗑️
                  </button>
                </div>
              </>
            )}
          </li>
        ))}
      </ul>
      <div className="add-teacher-form">
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
        <button className="btn btn-add" onClick={handleAddTeacher}>
          Add Teacher
        </button>
      </div>
    </div>
  );
}
