import { useState, useEffect } from "react";
import { fetchAllClasses } from "../util/ClassServices";
import { fetchAllTeachers } from "../util/TeacherServices";
import ClassRow from "../features/dashboard/components/ClassRow";
import { useNavigate } from "react-router-dom";
import CreateClassForm from "../components/CreateClassForm";
import { addClass } from "../util/ClassServices";

import "../styles/classes.css";

export default function Classes() {
  const navigate = useNavigate();
  const [classes, setClasses] = useState([]);
  const [teacherMap, setTeacherMap] = useState({});
  const [showForm, setShowForm] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData(e.currentTarget);
    const className = (formData.get("class-name") || "").trim();
    const roomNumber = (formData.get("room-number") || "").trim();
    const teacherId = formData.get("teacher-id") || "";

    try {
      if (!className || !roomNumber || !teacherId) return;

      const newClassId = await addClass(className, roomNumber, teacherId);
      setClasses((prev) => [
        ...prev,
        {
          id: newClassId,
          name: className,
          room: roomNumber,
          teacher_id: teacherId,
          average_grade: 0,
          students: [],
        },
      ]);
      setShowForm(false);
    } catch (e) {
      console.error(
        "Error adding class to database: " + e.message ?? "Unknown error",
      );
    }
  };

  const handleExit = () => {
    setShowForm(false);
  };

  useEffect(() => {
    const loadClassesAndTeachers = async () => {
      try {
        const classData = await fetchAllClasses();
        const teacherData = await fetchAllTeachers();

        const teachers = {};
        teacherData.forEach((teacher) => {
          teachers[teacher.id] = `${teacher.first_name} ${teacher.last_name}`;
        });

        setClasses(classData);
        setTeacherMap(teachers);
      } catch (e) {
        console.error("Error fetching data: ", e.message ?? "No error message");
      }
    };
    loadClassesAndTeachers();
  }, []);

  return (
    <>
      <div className="class-list">
        {classes.map((c) => (
          <ClassRow
            key={c.id}
            cls={c}
            teacher={{ id: c.teacher_id, name: teacherMap[c.teacher_id] }}
            onSelect={() =>
              navigate({ pathname: "/class", search: `?class=${c.id}` })
            }
          />
        ))}
      </div>
      {!showForm && (
        <button className="show-form-btn" onClick={() => setShowForm(true)}>
          Create new class
        </button>
      )}
      {showForm && (
        <CreateClassForm
          handleSubmit={handleSubmit}
          handleExit={handleExit}
          teacherMap={teacherMap}
        />
      )}
    </>
  );
}
