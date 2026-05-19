import "./css/ClassPreview.css";

export default function ClassPreview({ name, room, teacher_name, students }) {
  return (
    <div className="class-preview">
      <div className="class-preview-left">
        <h3>{name}</h3>
        <h3>{room}</h3>
      </div>
      <div className="class-preview-right">
        <h3>Teacher: {teacher_name}</h3>
        <h3>Students Enrolled: {students.length}</h3>
      </div>
    </div>
  );
}
