import { useState } from "react";
import "./styles/addAssignmentForm.css";

export default function AddAssignmentForm({ onSubmit, onCancel }) {
    const [formData, setFormData] = useState({
        name: "",
        maxScore: "100",
        category: "quiz",
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        if (!formData.name.trim()) {
            alert("Assignment name is required");
            return;
        }

        const maxScore = Number(formData.maxScore);
        if (isNaN(maxScore) || maxScore < 0) {
            alert("Max score must be a valid number");
            return;
        }

        onSubmit({
            name: formData.name.trim(),
            maxScore,
            category: formData.category,
        });
    };

    return (
        <div className="modal-overlay" onClick={onCancel}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                <h2>Add New Assignment</h2>
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label htmlFor="name">Assignment Name *</label>
                        <input
                            type="text"
                            id="name"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            placeholder="e.g., Chapter 5 Quiz"
                            autoFocus
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="maxScore">Max Score</label>
                        <input
                            type="number"
                            id="maxScore"
                            name="maxScore"
                            value={formData.maxScore}
                            onChange={handleChange}
                            min="0"
                            step="1"
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="category">Category</label>
                        <select
                            id="category"
                            name="category"
                            value={formData.category}
                            onChange={handleChange}
                        >
                            <option value="quiz">Quiz</option>
                            <option value="test">Test</option>
                            <option value="project">Project</option>
                            <option value="participation">Participation</option>
                        </select>
                    </div>

                    <div className="form-actions">
                        <button type="button" className="cancel-btn" onClick={onCancel}>
                            Cancel
                        </button>
                        <button type="submit" className="submit-btn">
                            Add Assignment
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}