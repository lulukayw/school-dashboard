import { Trash2 } from "lucide-react";
import "./styles/StudentRoster.css";

export default function StudentRoster({
  students = [],
  handleDeleteStudentFromRoster,
  onStudentClick = null,
  selectedStudent = null,
  calculateStudentGrade = null,
}) {
  const hasStudents = students.length > 0;

  const handleRowClick = (student) => {
    if (!onStudentClick) return;

    // Toggle selection: if clicking the same student, deselect them
    if (selectedStudent && selectedStudent.id === student.id) {
      onStudentClick(null);
    } else {
      onStudentClick(student);
    }
  };

  return (
    <>
      <h2>Students ({students.length})</h2>
      <div className="student-roster" role="table">
        <div className="roster-row roster-header-row" role="row">
          <div
            className="roster-cell roster-cell-empty"
            role="columnheader"
          ></div>
          <div className="roster-cell roster-header" role="columnheader">
            Student Name (First, Last)
          </div>
          <div className="roster-cell roster-header" role="columnheader">
            Grade
          </div>
        </div>

        {hasStudents ? (
          students.map((student) => (
            <div
              className={`roster-row ${selectedStudent && selectedStudent.id === student.id ? 'selected' : ''}`}
              role="row"
              key={student.id}
              onClick={() => handleRowClick(student)}
              style={{ cursor: onStudentClick ? "pointer" : "default" }}
            >
              <div className="roster-cell roster-icon-cell" role="cell">
                <Trash2
                  className="trash-icon"
                  size={16}
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDeleteStudentFromRoster(student.id);
                  }}
                />
              </div>
              <div className="roster-cell roster-name-cell" role="cell">
                {`${student.first_name} ${student.last_name}`.trim()}
              </div>
              <div className="roster-cell roster-grade-cell" role="cell">
                <span className="roster-grade-text">
                  {calculateStudentGrade
                    ? (() => {
                      const g = calculateStudentGrade(student);
                      return g !== null ? `${Math.round(g)}%` : "—";
                    })()
                    : "—"}
                </span>
              </div>
            </div>
          ))
        ) : (
          <div className="roster-empty-state" role="row">
            No students in this class yet.
          </div>
        )}
      </div>
    </>
  );
}
