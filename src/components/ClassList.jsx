import React from "react";
import { useNavigate } from "react-router-dom";
import ClassRow from "../features/dashboard/components/ClassRow";

export default function ClassList({ classes, teachers }) {
  const navigate = useNavigate();
  const getTeacher = (teacher_id) => teachers.find((t) => t.id === teacher_id);
  console.log("Classes are: ", classes);

  if (classes.length > 0) {
    return (
      <div className="class-list">
        {classes.map((c) => (
          <ClassRow
            key={c.id}
            cls={c}
            teacher={getTeacher(c.teacher_id)}
            onSelect={() =>
              navigate({ pathname: "/class", search: `?class=${c.id}` })
            }
          />
        ))}
      </div>
    );
  } else {
    return (
      <p style={{ color: "#888", fontSize: "0.9rem" }}>No classes found.</p>
    );
  }
}
