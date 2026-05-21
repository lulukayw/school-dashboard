import { useSearchParams } from "react-router-dom";
import { useEffect, useState } from "react";
import {
  classFromId,
  addStudentToClass,
  removeStudentFromClass,
  updateClass,
  studentsFromClass,
} from "../util/ClassServices";
import { fetchAllStudents } from "../util/StudentServices";
import { fetchAssignments, updateScore, addAssignment, deleteAssignment, updateAssignment } from "../util/AssignmentServices";
import { fetchAllTeachers, teacherFromId } from "../util/TeacherServices";
import StudentRoster from "../components/StudentRoster";
import AssignmentRoster from "../components/AssignmentRoster";
import GradeDisplay from "../components/GradeDisplay";
import StudentSearch from "../components/StudentSearch";
import { FilePenLine } from "lucide-react";
import "../styles/class.css";

export default function Class() {
  const [clas, setClas] = useState(null);
  const [teacher, setTeacher] = useState(null);
  const [teachers, setTeachers] = useState([]);
  const [students, setStudents] = useState([]);
  const [assignments, setAssignments] = useState([]);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [allStudents, setAllStudents] = useState([]);
  const [studentSearch, setStudentSearch] = useState("");
  const [isLoadingStudents, setIsLoadingStudents] = useState(false);
  const [showStudentSearch, setShowStudentSearch] = useState(false);
  const [isEditingClass, setIsEditingClass] = useState(false);
  const [classDraft, setClassDraft] = useState({
    name: "",
    room: "",
    teacher_id: "",
  });

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
    if (
      !students ||
      students.length === 0 ||
      !assignments ||
      assignments.length === 0
    ) {
      return null;
    }

    const studentGrades = students
      .map((student) => calculateStudentGrade(student))
      .filter((grade) => grade !== null);

    if (studentGrades.length === 0) return null;

    const average =
      studentGrades.reduce((sum, grade) => sum + grade, 0) /
      studentGrades.length;
    return average;
  };
  const studentIdsInClass = new Set(students.map((student) => student.id));

  const filteredStudents = allStudents.filter((student) => {
    const fullName = `${student.first_name ?? ""} ${student.last_name ?? ""}`
      .trim()
      .toLowerCase();

    return fullName.includes(studentSearch.trim().toLowerCase());
  });

  const startEditingClass = () => {
    setClassDraft({
      name: clas.name ?? "",
      room: clas.room ?? "",
      teacher_id: clas.teacher_id ?? "",
    });
    setIsEditingClass(true);
  };

  const cancelEditingClass = () => {
    setIsEditingClass(false);
  };

  const saveClassEdits = async (event) => {
    event.preventDefault();

    console.log("Class draft is: ", classDraft);

    try {
      await updateClass(clas.id, {
        name: classDraft.name.trim(),
        room: classDraft.room,
        teacher_id: classDraft.teacher_id,
      });

      const nextTeacher = teachers.find(
        (currentTeacher) => currentTeacher.id === classDraft.teacher_id,
      );

      setClas((currentClas) => ({
        ...currentClas,
        name: classDraft.name.trim(),
        room: classDraft.room.trim(),
        teacher_id: classDraft.teacher_id,
      }));

      setTeacher(
        nextTeacher
          ? {
            id: nextTeacher.id,
            name: `${nextTeacher.first_name} ${nextTeacher.last_name}`.trim(),
          }
          : null,
      );

      setIsEditingClass(false);
    } catch (e) {
      console.error("Error updating class: ", e.message ?? "No error message");
    }
  };

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

  const handleGradeChange = async (assignmentId, studentId, score) => {
    setAssignments((prev) =>
      prev.map((a) =>
        a.id === assignmentId
          ? { ...a, scores: { ...a.scores, [studentId]: score } }
          : a
      )
    );
    try {
      await updateScore(clas.id, assignmentId, studentId, score);
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

  const handleEditAssignment = async (assignmentId, updates) => {
    try {
      await updateAssignment(clas.id, assignmentId, updates);
      const updated = await fetchAssignments(clas.id);
      setAssignments(updated);
    } catch (e) {
      console.error("Error updating assignment:", e.message);
      alert("Failed to update assignment");
    }
  }

  const handleDeleteAssignment = async (assignmentId) => {
    try {
      await deleteAssignment(clas.id, assignmentId);
      const updated = await fetchAssignments(clas.id);
      setAssignments(updated)
    } catch (e) {
      console.error("Error deleting assignment:", e.message);
      alert("Failed to delete assignment");
    }
  }

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

        const allTeacherData = await fetchAllTeachers();
        setTeachers(allTeacherData);

        const studentData = await studentsFromClass(classData.id);
        const studentsArray = studentData.map((s) => ({
          id: s.id,
          first_name: s.first_name,
          last_name: s.last_name,
          grade: s.grade,
        }));
        setStudents(studentData);
        console.log("Student data: ", studentData);

        const assignmentData = await fetchAssignments(classData.id);
        setAssignments(assignmentData);
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
      <form className="class-info-form" onSubmit={saveClassEdits}>
        <div className="class-info-header">
          {isEditingClass ? (
            <input
              className="class-name-input"
              type="text"
              value={classDraft.name}
              onChange={(event) =>
                setClassDraft((currentDraft) => ({
                  ...currentDraft,
                  name: event.target.value,
                }))
              }
            />
          ) : (
            <h1 className="class-name">{clas.name}</h1>
          )}

          <FilePenLine
            className="edit-class-btn"
            onClick={isEditingClass ? undefined : startEditingClass}
          />
        </div>
        <div className="class-subinfo">
          <div className="class-subinfo-field">
            <h2
              className={
                isEditingClass ? "class-subinfo-label" : "class-subinfo-heading"
              }
            >
              Assigned Teacher
            </h2>
            {isEditingClass ? (
              <select
                className="class-input"
                value={classDraft.teacher_id}
                onChange={(event) =>
                  setClassDraft((currentDraft) => ({
                    ...currentDraft,
                    teacher_id: event.target.value,
                  }))
                }
              >
                <option value="">Select a teacher</option>
                {teachers.map((currentTeacher) => (
                  <option key={currentTeacher.id} value={currentTeacher.id}>
                    {`${currentTeacher.first_name} ${currentTeacher.last_name}`.trim()}
                  </option>
                ))}
              </select>
            ) : (
              <h3 className="teacher-name">{teacher.name}</h3>
            )}
          </div>
          <div className="class-subinfo-field">
            <h2
              className={
                isEditingClass ? "class-subinfo-label" : "class-subinfo-heading"
              }
            >
              Room Number
            </h2>
            {isEditingClass ? (
              <input
                className="class-input"
                type="number"
                value={classDraft.room}
                onChange={(event) =>
                  setClassDraft((currentDraft) => ({
                    ...currentDraft,
                    room: event.target.value,
                  }))
                }
              />
            ) : (
              <h3 className="room-number">Room {clas.room}</h3>
            )}
          </div>
          <GradeDisplay classGrade={calculateClassGrade()} />
        </div>
        {isEditingClass && (
          <div className="class-edit-actions">
            <button type="submit" className="class-edit-save-btn">
              Save
            </button>
            <button
              type="button"
              className="class-edit-cancel-btn"
              onClick={cancelEditingClass}
            >
              Cancel
            </button>
          </div>
        )}
      </form>
      <StudentRoster
        students={students}
        handleDeleteStudentFromRoster={handleDeleteStudentFromRoster}
        onStudentClick={setSelectedStudent}
        selectedStudent={selectedStudent}
        calculateStudentGrade={calculateStudentGrade}
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

      <div className="assignment-section">
        <AssignmentRoster
          assignments={assignments}
          handleDeleteAssignment={handleDeleteAssignment}
          selectedStudent={selectedStudent}
          onGradeChange={handleGradeChange}
          onAddAssignment={handleAddAssignment}
          onEditAssignment={handleEditAssignment}
        />
      </div>
    </div>
  );
}
