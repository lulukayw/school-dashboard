import { X } from "lucide-react";
import React from "react";

export default function StudentSearch({
  studentSearch,
  setStudentSearch,
  filteredStudents,
  isLoadingStudents,
  handleAddStudentToRoster,
  studentIdsInClass,
  onClose,
}) {
  return (
    <section className="student-search-panel">
      <div className="student-search-header">
        <label className="student-search-label" htmlFor="student-search-input">
          Search students
        </label>
        <X className="search-exit-btn" onClick={onClose} />
      </div>
      <input
        id="student-search-input"
        className="student-search-input"
        type="search"
        value={studentSearch}
        onChange={(event) => setStudentSearch(event.target.value)}
        placeholder="Search by first or last name"
      />

      <div className="student-search-results" role="table">
        <div className="student-search-row student-search-header-row" role="row">
          <div className="student-search-cell student-search-name-header" role="columnheader">
            Student Name
          </div>
          <div className="student-search-cell student-search-action-header" role="columnheader">
            Action
          </div>
        </div>

        {isLoadingStudents ? (
          <div className="student-search-empty" role="row">Loading students...</div>
        ) : filteredStudents.length > 0 ? (
          filteredStudents.map((student) => {
            const isAlreadyInClass = studentIdsInClass.has(student.id);

            return (
              <div className="student-search-row" role="row" key={student.id}>
                <div className="student-search-cell student-search-name" role="cell">
                  {`${student.first_name ?? ""} ${student.last_name ?? ""}`.trim()}
                </div>
                <div className="student-search-cell student-search-action" role="cell">
                  <button
                    type="button"
                    className="student-search-add-button"
                    onClick={() => handleAddStudentToRoster(student.id)}
                    disabled={isAlreadyInClass}
                  >
                    {isAlreadyInClass ? "Added" : "Add"}
                  </button>
                </div>
              </div>
            );
          })
        ) : (
          <div className="student-search-empty" role="row">No matching students found.</div>
        )}
      </div>
    </section>
  );
}
