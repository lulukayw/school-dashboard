import { useSearchParams } from "react-router-dom";
import { useEffect, useState } from "react";
import {
  classFromId,
  removeStudentFromClass,
  studentsFromClass,
} from "../util/ClassServices";
import { teacherFromId } from "../util/TeacherServices";
import { fetchAssignments, updateScore, addAssignment } from "../util/AssignmentServices";
import StudentRoster from "../components/StudentRoster";
import AssignmentRoster from "../components/AssignmentRoster";
import GradeDisplay from "../components/GradeDisplay";

import "../styles/class.css";

export default function Class() {
  const [clas, setClas] = useState(null);
  const [teacher, setTeacher] = useState(null);
  const [students, setStudents] = useState([]);
  const [assignments, setAssignments] = useState([]);
  const [selectedStudent, setSelectedStudent] = useState(null);

  const [searchParams, setSearchParams] = useSearchParams();
  const query = searchParams.get("class");

  // Calculate a student's overall grade as a percentage
  const calculateStudentGrade = (student) => {
    if (!assignments || assignments.length === 0) return null;

    let totalPoints = 0;
    let maxPoints = 0;

    assignments.forEach((assignment) => {
      if (assignment.max_score && assignment.max_score > 0) {
        maxPoints += assignment.max_score;
        const studentScore = assignment.scores?.[student.id];
        if (studentScore !== undefined && studentScore !== null) {
          totalPoints += studentScore;
        }
      }
    });

    if (maxPoints === 0) return null;
    return (totalPoints / maxPoints) * 100;
  };

  // Calculate the class average grade as a percentage
  const calculateClassGrade = () => {
    if (!students || students.length === 0 || !assignments || assignments.length === 0) {
      return null;
    }

    const studentGrades = students
      .map((student) => calculateStudentGrade(student))
      .filter((grade) => grade !== null);

    if (studentGrades.length === 0) return null;

    const average = studentGrades.reduce((sum, grade) => sum + grade, 0) / studentGrades.length;
    return average;
  };

  const handleDeleteStudentFromRoster = async (studentId) => {
    try {
      await removeStudentFromClass(clas.id, studentId);

      setStudents(students.filter((s) => s.id !== studentId));
    } catch (e) {
      console.error(
        "Error removing student from class: ",
        e.message || "No error message found",
      );
    }
  };

  const handleGradeChange = async (assignmentId, studentId, score) => {
    try {
      await updateScore(clas.id, assignmentId, studentId, score);
      // Refresh assignments to show updated grades
      const updated = await fetchAssignments(clas.id);
      setAssignments(updated);
    } catch (e) {
      console.error("Error updating grade:", e.message);
    }
  };

  const handleAddAssignment = async (name, category, maxScore) => {
    try {
      await addAssignment(clas.id, name, category, maxScore);
      // Refresh assignments to show the new one
      const updated = await fetchAssignments(clas.id);
      setAssignments(updated);
    } catch (e) {
      console.error("Error adding assignment:", e.message);
      alert("Failed to add assignment");
    }
  };

  useEffect(() => {
    const loadClassInfo = async () => {
      try {
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
        setStudents(studentData);
        console.log("Student data: ", studentData);

        const assignmentData = await fetchAssignments(classData.id);
        setAssignments(assignmentData);
        console.log("Assignment data: ", assignmentData);
      } catch (e) {
        console.error("Error fetching data: ", e.message ?? "No error message");
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
        <h2 className="room-number">{clas.room}</h2>
        <GradeDisplay
          classGrade={calculateClassGrade()}
        />
      </div>
      <StudentRoster
        students={students}
        handleDeleteStudentFromRoster={handleDeleteStudentFromRoster}
        onStudentClick={setSelectedStudent}
        selectedStudent={selectedStudent}
        calculateStudentGrade={calculateStudentGrade}
      />
      <div className="assignment-section">
        <AssignmentRoster
          assignments={assignments}
          handleDeleteAssignment={() => { }}
          selectedStudent={selectedStudent}
          onGradeChange={handleGradeChange}
          onAddAssignment={handleAddAssignment}
        />
      </div>
    </div>
  );
}
