import { Trash2 } from "lucide-react";
import "./styles/StudentRoster.css";

export default function StudentRoster({
  students = [],
  handleDeleteStudentFromRoster,
}) {
  const hasStudents = students.length > 0;

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
            <div className="roster-row" role="row" key={student.id}>
              <div className="roster-cell roster-icon-cell" role="cell">
                <Trash2
                  className="trash-icon"
                  size={16}
                  onClick={() => handleDeleteStudentFromRoster}
                />
              </div>
              <div className="roster-cell roster-name-cell" role="cell">
                {`${student.first_name} ${student.last_name}`.trim()}
              </div>
              <div className="roster-cell roster-grade-cell" role="cell">
                <span className="roster-grade-text">
                  {student.grade ?? "—"}
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
