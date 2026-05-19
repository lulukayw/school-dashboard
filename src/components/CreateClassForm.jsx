import { useState } from "react";
import { X } from "lucide-react";

export default function CreateClassForm({
  handleSubmit,
  handleExit,
  teacherMap,
}) {
  const [className, setClassName] = useState("");
  const [roomNumber, setRoomNumber] = useState("");
  const [selectedTeacherId, setSelectedTeacherId] = useState("");

  return (
    <form onSubmit={handleSubmit} className="form-container">
      <div className="form-header">
        <h3>Create a new class</h3>
        <X className="form-exit-button" onClick={handleExit} />
      </div>

      <div className="form-group">
        <label>
          Class name
          <input
            name="class-name"
            type="text"
            value={className}
            onChange={(e) => setClassName(e.target.value)}
          ></input>
        </label>
      </div>
      <div className="form-group">
        <label>
          Room Number
          <input
            name="room-number"
            type="text"
            value={roomNumber}
            onChange={(e) => setRoomNumber(e.target.value)}
          />
        </label>
      </div>
      <div className="form-group">
        <label>
          Assign teacher
          <select
            value={selectedTeacherId}
            onChange={(e) => setSelectedTeacherId(e.target.value)}
            name="teacher-id"
          >
            <option value="">Select a teacher</option>
            {Object.entries(teacherMap).map(([teacherId, teacherName]) => (
              <option key={teacherId} value={teacherId}>
                {teacherName}
              </option>
            ))}
          </select>
        </label>
      </div>
      <button type="submit">Create</button>
    </form>
  );
}
