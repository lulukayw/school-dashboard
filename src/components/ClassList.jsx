import React from "react";
import { useNavigate } from "react-router-dom";
import ClassRow from "../features/dashboard/components/ClassRow";
import { Trash2 } from "lucide-react";

export default function ClassList({ classes, teachers, handleDeleteClass }) {
  const navigate = useNavigate();
  const getTeacher = (teacher_id) => teachers.find((t) => t.id === teacher_id);

  if (classes.length > 0) {
    return (
      <div className="class-list">
        {classes.map((c) => (
          <div className="class-row-container" key={c.id}>
            <ClassRow
              cls={c}
              teacher={getTeacher(c.teacher_id)}
              onSelect={() =>
                navigate({ pathname: "/class", search: `?class=${c.id}` })
              }
            />
            <button
              type="button"
              className="delete-class-btn"
              onClick={() => handleDeleteClass(c.id)}
              aria-label={`Delete ${c.name || "class"}`}
            >
              <Trash2 size={16} />
            </button>
          </div>
        ))}
      </div>
    );
  } else {
    return (
      <p style={{ color: "#888", fontSize: "0.9rem" }}>No classes found.</p>
    );
  }
}
