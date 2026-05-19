import { useState, useEffect } from "react";
import { fetchAllClasses, studentsFromClass } from "../util/ClassServices";
import { fetchAllTeachers } from "../util/TeacherServices";
import ClassPreview from "../components/ClassPreview";

export default function Classes() {
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
    <div>
      {classes.map((c) => (
        <ClassPreview
          key={c.id}
          name={c.name || "Unknown"}
          room={c.room || "Unknown"}
          students={c.students}
          teacher_name={teacherMap[c.teacher_id] || "Unknown"}
        />
      ))}
    </div>
  );
}
