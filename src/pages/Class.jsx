import { useSearchParams } from "react-router-dom";
import { useEffect, useState } from "react";
import {
  classFromId,
  addStudentToClass,
  removeStudentFromClass,
  studentsFromClass,
} from "../util/ClassServices";
import { fetchAllStudents } from "../util/StudentServices";
import { teacherFromId } from "../util/TeacherServices";
import StudentRoster from "../components/StudentRoster";
import StudentSearch from "../components/StudentSearch";

import "../styles/class.css";

export default function Class() {
  const [clas, setClas] = useState(null);
  const [teacher, setTeacher] = useState(null);
  const [students, setStudents] = useState([]);
  const [allStudents, setAllStudents] = useState([]);
  const [studentSearch, setStudentSearch] = useState("");
  const [isLoadingStudents, setIsLoadingStudents] = useState(false);
  const [showStudentSearch, setShowStudentSearch] = useState(false);

  const [searchParams, setSearchParams] = useSearchParams();
  const query = searchParams.get("class");

  const studentIdsInClass = new Set(students.map((student) => student.id));

  const filteredStudents = allStudents.filter((student) => {
    const fullName = `${student.first_name ?? ""} ${student.last_name ?? ""}`
      .trim()
      .toLowerCase();

    return fullName.includes(studentSearch.trim().toLowerCase());
  });

  const handleDeleteStudentFromRoster = async (studentId) => {
    try {
      await removeStudentFromClass(clas.id, studentId);

      setStudents((students) => students.filter((s) => s.id !== studentId));
    } catch (e) {
      console.error(
        "Error removing student from class: ",
        e.message || "No error message found",
      );
    }
  };

  const handleAddStudentToRoster = async (studentId) => {
    try {
      await addStudentToClass(clas.id, studentId);

      const addedStudent = allStudents.find(
        (student) => student.id === studentId,
      );
      if (!addedStudent) return;

      setStudents((currentStudents) => {
        if (currentStudents.some((student) => student.id === studentId)) {
          return currentStudents;
        }

        return [...currentStudents, addedStudent];
      });
    } catch (e) {
      console.error(
        "Error adding student to class: ",
        e.message || "No error message found",
      );
    }
  };

  useEffect(() => {
    const loadClassInfo = async () => {
      try {
        setIsLoadingStudents(true);
        const classData = await classFromId(query);

        if (!classData) return;

        console.log("Class data: ", classData);

        setClas({
          id: classData.id,
          name: classData.name,
          room: classData.room,
          teacher_id: classData.teacher_id,
        });

        const teacherData = await teacherFromId(classData.teacher_id);
        console.log("Teacher data is: ", teacherData);
        if (!teacherData) return;

        const teacherName =
          `${teacherData.first_name} ${teacherData.last_name}`.trim();

        setTeacher({
          id: teacherData.id,
          name: teacherName,
        });

        const studentData = await studentsFromClass(classData.id);
        const studentsArray = studentData.map((s) => ({
          id: s.id,
          first_name: s.first_name,
          last_name: s.last_name,
          grade: s.grade,
        }));
        setStudents(studentData);
        console.log("Student data: ", studentData);

        const allStudentData = await fetchAllStudents();
        setAllStudents(allStudentData);
      } catch (e) {
        console.error("Error fetching data: ", e.message ?? "No error message");
      } finally {
        setIsLoadingStudents(false);
      }
    };

    loadClassInfo();
  }, [query]);

  if (!clas || !teacher) {
    return <div>Loading class details...</div>;
  }

  return (
    <div>
      <h1 className="class-name">{clas.name}</h1>
      <div className="class-subinfo">
        <h2 className="teacher-name">Assigned Teacher: {teacher.name}</h2>
        <h2 className="room-number">Room {clas.room}</h2>
      </div>
      <StudentRoster
        students={students}
        handleDeleteStudentFromRoster={handleDeleteStudentFromRoster}
      />
      {!showStudentSearch && (
        <button
          className="show-search-btn"
          onClick={() => setShowStudentSearch(true)}
        >
          Add student
        </button>
      )}

      {showStudentSearch && (
        <StudentSearch
          studentSearch={studentSearch}
          setStudentSearch={setStudentSearch}
          filteredStudents={filteredStudents}
          isLoadingStudents={isLoadingStudents}
          handleAddStudentToRoster={handleAddStudentToRoster}
          studentIdsInClass={studentIdsInClass}
          onClose={() => setShowStudentSearch(false)}
        />
      )}
    </div>
  );
}
