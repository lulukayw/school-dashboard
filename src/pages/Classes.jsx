import { useState, useEffect } from "react";
import { deleteClass, fetchAllClasses } from "../util/ClassServices";
import { fetchAllTeachers } from "../util/TeacherServices";
import ClassList from "../components/ClassList";
import { useNavigate } from "react-router-dom";
import CreateClassForm from "../components/CreateClassForm";
import { addClass } from "../util/ClassServices";

import "../styles/classes.css";

export default function Classes() {
  const navigate = useNavigate();
  const [classes, setClasses] = useState([]);
  const [teachers, setTeachers] = useState([]);
  const [showForm, setShowForm] = useState(false);

  const handleDeleteClass = async (classId) => {
    const previousClasses = classes;

    setClasses((currentClasses) =>
      currentClasses.filter((currentClass) => currentClass.id !== classId),
    );

    try {
      await deleteClass(classId);
    } catch (e) {
      setClasses(previousClasses);
      console.error(
        "Error deleting class from database: " + (e.message ?? "Unknown error"),
      );
    }
  };

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
        setClasses(classData);

        const teacherData = await fetchAllTeachers();
        setTeachers(teacherData);

        console.log("teacher data is (classes): ", teacherData);
      } catch (e) {
        console.error("Error fetching data: ", e.message ?? "No error message");
      }
    };
    loadClassesAndTeachers();
  }, []);

  return (
    <>
      <ClassList
        classes={classes}
        teachers={teachers}
        handleDeleteClass={handleDeleteClass}
      />
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
