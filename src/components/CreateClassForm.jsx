import { useState } from "react";
import { X } from "lucide-react";
import "./styles/createclassform.css";

export default function CreateClassForm({
  handleSubmit,
  handleExit,
  teachers,
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
        <label htmlFor="class-name">Class name</label>
        <input
          id="class-name"
          name="class-name"
          type="text"
          value={className}
          onChange={(e) => setClassName(e.target.value)}
        />
      </div>

      <div className="form-group">
        <label htmlFor="room-number">Room number</label>
        <input
          id="room-number"
          name="room-number"
          type="text"
          value={roomNumber}
          onChange={(e) => setRoomNumber(e.target.value)}
        />
      </div>

      <div className="form-group">
        <label htmlFor="teacher-id">Assign teacher</label>
        <select
          id="teacher-id"
          name="teacher-id"
          value={selectedTeacherId}
          onChange={(e) => setSelectedTeacherId(e.target.value)}
        >
          <option value="">Select a teacher</option>
          {teachers.map((t) => (
            <option key={t.id} value={t.id}>
              {`${t.first_name} ${t.last_name}`.trim()}
            </option>
          ))}
        </select>
      </div>
      <button className="form-submit-btn" type="submit">
        Create
      </button>
    </form>
  );
}
