import { Trash2 } from "lucide-react";
import { useState } from "react";
import AddAssignmentForm from "./AddAssignmentForm";
import "./styles/assignmentRoster.css";

export default function AssignmentRoster({
    assignments = [],
    handleDeleteAssignment,
    selectedStudent = null,
    onGradeChange = null,
    onAddAssignment = null,
}) {
    const [editingGrades, setEditingGrades] = useState({});
    const [showAddForm, setShowAddForm] = useState(false);
    const hasAssignments = assignments.length > 0;

    const handleGradeInputChange = (assignmentId, value) => {
        setEditingGrades((prev) => ({
            ...prev,
            [assignmentId]: value,
        }));
    };

    const handleGradeBlur = (assignmentId, assignment) => {
        const value = editingGrades[assignmentId];
        if (value !== undefined && onGradeChange) {
            const numValue = value === "" ? null : Math.min(Number(value), assignment.max_score || Infinity);
            onGradeChange(assignmentId, selectedStudent.id, numValue);
        }
        setEditingGrades((prev) => {
            const newState = { ...prev };
            delete newState[assignmentId];
            return newState;
        });
    };

    const handleFormSubmit = (formData) => {
        setShowAddForm(false);
        if (onAddAssignment) {
            onAddAssignment(formData.name, formData.category, formData.maxScore);
        }
    };

    const getStudentGrade = (assignment) => {
        if (!selectedStudent || !assignment.scores) return "—";
        return assignment.scores[selectedStudent.id] ?? "—";
    };

    return (
        <>
            <div className="assignment-header">
                <h2>
                    Assignments {selectedStudent && `for ${selectedStudent.first_name} ${selectedStudent.last_name}`} ({assignments.length})
                </h2>
                <button
                    className="add-assignment-btn"
                    onClick={() => setShowAddForm(true)}
                >
                    + Add Assignment
                </button>
            </div>
            {showAddForm && (
                <AddAssignmentForm
                    onSubmit={handleFormSubmit}
                    onCancel={() => setShowAddForm(false)}
                />
            )}
            <div className="assignment-roster" role="table">
                <div className="roster-row roster-header-row" role="row">
                    <div
                        className="roster-cell roster-cell-empty"
                        role="columnheader"
                    ></div>
                    <div className="roster-cell roster-header" role="columnheader">
                        Assignment Name
                    </div>
                    {!selectedStudent ? (
                        <>
                            <div className="roster-cell roster-header" role="columnheader">
                                Max Score
                            </div>
                            <div className="roster-cell roster-header" role="columnheader">
                                Category
                            </div>
                        </>
                    ) : (
                        <>
                            <div className="roster-cell roster-header" role="columnheader">
                                Points
                            </div>
                            <div className="roster-cell roster-header" role="columnheader">
                                Grade
                            </div>
                        </>
                    )}
                </div>

                {hasAssignments ? (
                    assignments.map((assignment) => (
                        <div className="roster-row" role="row" key={assignment.id}>
                            <div className="roster-cell roster-icon-cell" role="cell">
                                <Trash2
                                    className="trash-icon"
                                    size={16}
                                    onClick={() => handleDeleteAssignment(assignment.id)}
                                />
                            </div>
                            <div className="roster-cell roster-name-cell" role="cell">
                                {assignment.name || "—"}
                            </div>
                            {!selectedStudent ? (
                                <>
                                    <div className="roster-cell roster-score-cell" role="cell">
                                        {assignment.max_score || "—"}
                                    </div>
                                    <div className="roster-cell roster-category-cell" role="cell">
                                        {assignment.category ? assignment.category.charAt(0).toUpperCase() + assignment.category.slice(1) : "—"}
                                    </div>
                                </>
                            ) : (
                                <>
                                    <div className="roster-cell roster-grade-cell" role="cell">
                                        <input
                                            type="number"
                                            className="grade-input"
                                            value={
                                                editingGrades[assignment.id] !== undefined
                                                    ? editingGrades[assignment.id]
                                                    : getStudentGrade(assignment)
                                            }
                                            onKeyDown={(e) => {
                                                if (e.key === "Enter") handleGradeBlur(assignment.id, assignment);
                                            }}
                                            onChange={(e) =>
                                                handleGradeInputChange(assignment.id, e.target.value)
                                            }
                                            onBlur={() => handleGradeBlur(assignment.id, assignment)}
                                            max={assignment.max_score}
                                            min="0"
                                        /> <span className="grade-max">/ {assignment.max_score ?? "—"}</span>
                                    </div>

                                    <div className="roster-cell grade-max" role="cell">
                                        {assignment.max_score && getStudentGrade(assignment) !== "—"
                                            ? `${Math.round((getStudentGrade(assignment) / assignment.max_score) * 100)}%`
                                            : "—"}
                                    </div>
                                </>
                            )}
                        </div>
                    ))
                ) : (
                    <div className="roster-empty-state" role="row">
                        No assignments in this class yet.
                    </div>
                )}
            </div>
        </>
    );
}
