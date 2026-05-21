import { Trash2, FilePenLine } from "lucide-react";
import { useState } from "react";
import AddAssignmentForm from "./AddAssignmentForm";
import "./styles/assignmentRoster.css";

export default function AssignmentRoster({
    assignments = [],
    handleDeleteAssignment,
    selectedStudent = null,
    onGradeChange = null,
    onAddAssignment = null,
    onEditAssignment = null,
}) {
    const [editingGrades, setEditingGrades] = useState({});
    const [showAddForm, setShowAddForm] = useState(false);
    const [editingAssignment, setEditingAssignment] = useState(null);
    const [assignmentDraft, setAssignmentDraft] = useState({});
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

    const startEditingAssignment = (assignment) => {
        setEditingAssignment(assignment.id);
        setAssignmentDraft({
            name: assignment.name ?? "",
            category: assignment.category ?? "",
            max_score: assignment.max_score ?? "",
        });
    };

    const cancelEditingAssignment = () => {
        setEditingAssignment(null);
        setAssignmentDraft({});
    };

    const saveAssignmentEdit = async (assignmentId) => {
        if (onEditAssignment) {
            await onEditAssignment(assignmentId, {
                name: assignmentDraft.name.trim(),
                category: assignmentDraft.category,
                max_score: assignmentDraft.max_score === "" ? null : Number(assignmentDraft.max_score),
            });
        }
        setEditingAssignment(null);
        setAssignmentDraft({});
    };

    const getStudentGrade = (assignment) => {
        if (!selectedStudent || !assignment.scores) return "—";
        return assignment.scores[selectedStudent.id] ?? "—";
    };

    const CATEGORIES = ["quiz", "test", "project", "participation"];

    return (
        <>
            <div className="assignment-header">
                <h2>
                    Assignments {selectedStudent && `for ${selectedStudent.first_name} ${selectedStudent.last_name}`} ({assignments.length})
                </h2>
                <button className="add-assignment-btn" onClick={() => setShowAddForm(true)}>
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
                <div className="assignment-roster-row assignment-roster-header-row" role="row">
                    <div className="assignment-roster-cell assignment-roster-cell-empty" role="columnheader"></div>
                    <div className="assignment-roster-cell assignment-roster-cell-empty" role="columnheader"></div>
                    <div className="assignment-roster-cell assignment-roster-header" role="columnheader">Assignment Name</div>
                    {!selectedStudent ? (
                        <>
                            <div className="assignment-roster-cell assignment-roster-header" role="columnheader">Max Score</div>
                            <div className="assignment-roster-cell assignment-roster-header" role="columnheader">Category</div>
                        </>
                    ) : (
                        <>
                            <div className="assignment-roster-cell assignment-roster-header" role="columnheader">Points</div>
                            <div className="assignment-roster-cell assignment-roster-header" role="columnheader">Grade</div>
                        </>
                    )}
                    <div className="assignment-roster-cell assignment-roster-cell-empty" role="columnheader"></div>
                </div>

                {hasAssignments ? (
                    assignments.sort((a, b) => a.timestamp - b.timestamp).map((assignment) => {
                        const isEditing = editingAssignment === assignment.id;
                        return (
                            <div className="assignment-roster-row" role="row" key={assignment.id}>
                                {/* Delete */}
                                <div className="assignment-roster-cell assignment-roster-icon-cell" role="cell">
                                    {!isEditing && (
                                        <Trash2
                                            className="trash-icon"
                                            size={16}
                                            onClick={() => handleDeleteAssignment(assignment.id)}
                                        />
                                    )}
                                </div>

                                {/* Edit pencil */}
                                <div className="assignment-roster-cell assignment-roster-icon-cell" role="cell">
                                    {!isEditing && (
                                        <FilePenLine
                                            className="edit-icon"
                                            size={16}
                                            onClick={() => startEditingAssignment(assignment)}
                                        />
                                    )}
                                </div>

                                {/* Name */}
                                <div className="assignment-roster-cell assignment-roster-name-cell" role="cell">
                                    {isEditing ? (
                                        <input
                                            className="assignment-edit-input"
                                            type="text"
                                            value={assignmentDraft.name}
                                            onChange={(e) =>
                                                setAssignmentDraft((d) => ({ ...d, name: e.target.value }))
                                            }
                                        />
                                    ) : (
                                        assignment.name || "—"
                                    )}
                                </div>

                                {!selectedStudent ? (
                                    <>
                                        {/* Max Score */}
                                        <div className="assignment-roster-cell assignment-roster-score-cell" role="cell">
                                            {isEditing ? (
                                                <input
                                                    className="assignment-edit-input assignment-edit-input--short"
                                                    type="number"
                                                    min="0"
                                                    value={assignmentDraft.max_score}
                                                    onChange={(e) =>
                                                        setAssignmentDraft((d) => ({ ...d, max_score: e.target.value }))
                                                    }
                                                />
                                            ) : (
                                                assignment.max_score || "—"
                                            )}
                                        </div>

                                        {/* Category */}
                                        <div className="assignment-roster-cell assignment-roster-category-cell" role="cell">
                                            {isEditing ? (
                                                <select
                                                    className="assignment-edit-input"
                                                    value={assignmentDraft.category}
                                                    onChange={(e) =>
                                                        setAssignmentDraft((d) => ({ ...d, category: e.target.value }))
                                                    }
                                                >
                                                    {CATEGORIES.map((cat) => (
                                                        <option key={cat} value={cat}>
                                                            {cat.charAt(0).toUpperCase() + cat.slice(1)}
                                                        </option>
                                                    ))}
                                                </select>
                                            ) : (
                                                assignment.category
                                                    ? assignment.category.charAt(0).toUpperCase() + assignment.category.slice(1)
                                                    : "—"
                                            )}
                                        </div>
                                    </>
                                ) : (
                                    <>
                                        {/* Grade input (student selected view — unchanged) */}
                                        <div className="assignment-roster-cell assignment-roster-grade-cell" role="cell">
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
                                                onChange={(e) => handleGradeInputChange(assignment.id, e.target.value)}
                                                onBlur={() => handleGradeBlur(assignment.id, assignment)}
                                                max={assignment.max_score}
                                                min="0"
                                            />
                                            <span className="grade-max">/ {assignment.max_score ?? "—"}</span>
                                        </div>
                                        <div className="assignment-roster-cell grade-max" role="cell">
                                            {assignment.max_score && getStudentGrade(assignment) !== "—"
                                                ? `${Math.round((getStudentGrade(assignment) / assignment.max_score) * 100)}%`
                                                : "—"}
                                        </div>
                                    </>
                                )}

                                {/* Save / Cancel actions */}
                                <div className="assignment-roster-cell assignment-roster-edit-actions" role="cell">
                                    {isEditing && (
                                        <>
                                            <button
                                                className="assignment-save-btn"
                                                onClick={() => saveAssignmentEdit(assignment.id)}
                                            >
                                                Save
                                            </button>
                                            <button
                                                className="assignment-cancel-btn"
                                                onClick={cancelEditingAssignment}
                                            >
                                                Cancel
                                            </button>
                                        </>
                                    )}
                                </div>
                            </div>
                        );
                    })
                ) : (
                    <div className="roster-empty-state" role="row">
                        No assignments in this class yet.
                    </div>
                )}
            </div>
        </>
    );
}
