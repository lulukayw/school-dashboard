import { useSearchParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { classFromId } from "../util/ClassServices";
import { teacherFromId } from "../util/TeacherServices";

export default function Class() {
  const [clas, setClas] = useState(null);
  const [teacher, setTeacher] = useState(null);

  const [searchParams, setSearchParams] = useSearchParams();
  const query = searchParams.get("class");

  useEffect(() => {
    const loadClassInfo = async () => {
      try {
        const classData = await classFromId(query);

        if (!classData) return;

        console.log("Class data: ", classData);

        setClas({
          id: classData.id,
          name: classData.name,
          room: classData.room,
          students: classData.students,
          teacher_id: classData.teacher_id,
        });

        const teacherData = await teacherFromId(classData.teacher_id);
        console.log("Teacher data is: ", teacherData);
        if (!teacherData) return;

        const teacherName =
          `${teacherData.first_name} ${teacherData.last_name}`.trim();

        setTeacher({
          id: teacherData.id,
          name: teacherName,
        });
      } catch (e) {
        console.error("Error fetching data: ", e.message ?? "No error message");
      }
    };
    loadClassInfo();
  }, [query]);

  if (!clas || !teacher) {
    return <div>Loading class details...</div>;
  }

  return (
    <div>
      <h1 className="class-name">{clas.name}</h1>
      <div className="class-subinfo">
        <h2 className="teacher-name">Assigned Teacher: {teacher.name}</h2>
        <h2 className="room-number">{clas.room}</h2>
      </div>
    </div>
  );
}
