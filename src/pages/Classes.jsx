import { useState, useEffect } from "react";
import { fetchAllClasses, studentsFromClass } from "../util/ClassServices";

export default function Classes() {
  const [classes, setClasses] = useState([]);

  useEffect(() => {
    const loadClasses = async () => {
      try {
        const data = await fetchAllClasses();
        setClasses(data);
      } catch (e) {
        console.error(
          "Error fetching classes: ",
          e.message ?? "No error message",
        );
      }
    };
    loadClasses();
  }, []);

  return (
    <div>
      {classes.map((c) => (
        <p>
          {c.average_grade} {c.name} {c.teacher_id}
        </p>
      ))}
    </div>
  );
}
