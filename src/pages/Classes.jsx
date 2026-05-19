import { useState, useEffect } from "react";
import { fetchAllClasses, studentsFromClass } from "../util/ClassServices";
import { fetchAllTeachers } from "../util/TeacherServices";
import ClassRow from "../features/dashboard/components/ClassRow";
import { useNavigate } from "react-router-dom";

import "../styles/classes.css";

export default function Classes() {
  const navigate = useNavigate();
  const [classes, setClasses] = useState([]);
  const [teacherMap, setTeacherMap] = useState({});

  useEffect(() => {
    const loadClassesAndTeachers = async () => {
      try {
        const classData = await fetchAllClasses();
        const teacherData = await fetchAllTeachers();

        const teachers = {};
        teacherData.forEach((teacher) => {
          teachers[teacher.id] = `${teacher.first_name} ${teacher.last_name}`;
        });

        setClasses(classData);
        setTeacherMap(teachers);
      } catch (e) {
        console.error("Error fetching data: ", e.message ?? "No error message");
      }
    };
    loadClassesAndTeachers();
  }, []);

  return (
    <div className="class-list">
      {classes.map((c) => (
        <ClassRow
          key={c.id}
          cls={c}
          teacher={{ id: c.teacher_id, name: teacherMap[c.teacher_id] }}
          onSelect={() =>
            navigate({ pathname: "/class", search: `?class=${c.id}` })
          }
        />
      ))}
    </div>
  );
}
