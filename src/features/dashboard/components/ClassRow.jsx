//Displays Classrows on homepage
//Props
//   cls (object)      - { id, name, subject, room, teacherId, students }
//   teacher (object)  - { id, name } matched from teachers list by teacherId
//   onSelect (func)   - called when the row is clicked

export default function ClassRow({ cls, teacher, onSelect }) {
  const studentCount = (cls.students || []).length;
  return (
    <div className="class-row" onClick={onSelect} style={{ cursor: "pointer" }}>
      <div className="class-row-left">
        <div className="class-name">{cls.name || "Unknown Class"}</div>
        <ul>
          <li>{cls.room || "Unknown Room"}</li>
        </ul>
      </div>
      <div className="class-row-right">
        {/* TODO (Firebase): teacher name comes from teachers collection lookup by teacherId */}
        <div className="teacher-name">
          {teacher
            ? `${teacher.first_name} ${teacher.last_name}`.trim()
            : "No teacher assigned"}
        </div>
        <div>
          {studentCount} student{studentCount !== 1 ? "s" : ""}
        </div>
      </div>
    </div>
  );
}
