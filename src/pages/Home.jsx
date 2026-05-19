import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import StatCard from "../features/dashboard/components/StatCard";
import ClassRow from "../features/dashboard/components/ClassRow";

import "../styles/dashboard.css";

// Firestore service functions built by teammate
import { fetchAllStudents } from "../util/StudentServices";
import { fetchAllTeachers } from "../util/TeacherServices";
import { fetchAllClasses } from "../util/ClassServices";

// NOTE: Events are not yet in the service layer — using empty array until EventServices is added
// TODO: import { fetchAllEvents } from "../util/EventServices" when teammate creates it

export default function Home() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCard, setSelectedCard] = useState(null);

  // --- Data state ---
  const [students, setStudents] = useState([]);
  const [teachers, setTeachers] = useState([]);
  const [classes, setClasses] = useState([]);
  const [events, setEvents] = useState([]);  // TODO: populate from EventServices
  const [loading, setLoading] = useState(true);

  // --- Fetch all data on page load ---
  useEffect(() => {
    async function loadData() {
      try {
        const [studentData, teacherData, classData] = await Promise.all([
          fetchAllStudents(),
          fetchAllTeachers(),
          fetchAllClasses(),
        ]);
        setStudents(studentData);
        setTeachers(teacherData);
        setClasses(classData);
      } catch (err) {
        console.error("Error loading dashboard data:", err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  // Helper: find a teacher by their Firestore ID
  const getTeacher = (teacher_id) => teachers.find((t) => t.id === teacher_id);

  // Filter classes by name or room based on search input
  const filteredClasses = classes.filter(
    (cls) =>
      cls.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      cls.room?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Quick action handlers
  // TODO: update to open modals/forms when teammates build those
  const handleAddStudent = () => navigate("/students");
  const handleAddTeacher = () => navigate("/teachers");
  const handleCreateClass = () => navigate("/classes");
  const handleCreateEvent = () => navigate("/calendar");

  return (
    <>
      {/* Search Bar */}
      <div className="search-container">
        <input
          className="search-input"
          type="text"
          placeholder="Global Search"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <button className="search-btn">&#128269;</button>
      </div>

      {loading ? (
        <p style={{ color: "#888" }}>Loading dashboard data...</p>
      ) : (
        <>
          {/* Stat Cards */}
          {/* Students and Teachers use first_name + last_name from Firestore */}
          <div className="stat-cards-row">
            <StatCard
              title="Students"
              items={students.map((s) => `${s.first_name} ${s.last_name}`)}
              linkLabel="View student directory"
              onLinkClick={() => navigate("/students")}
              selected={selectedCard === "students"}
              onSelect={() => setSelectedCard("students")}
            />
            <StatCard
              title="Teachers"
              items={teachers.map((t) => `${t.first_name} ${t.last_name}`)}
              linkLabel="View teacher directory"
              onLinkClick={() => navigate("/teachers")}
              selected={selectedCard === "teachers"}
              onSelect={() => setSelectedCard("teachers")}
            />
            <StatCard
              title="Upcoming Events"
              items={
                events.length > 0
                  ? events.map((e) => e.name)
                  : ["No events yet — check back soon"]
              }
              linkLabel="View calendar"
              onLinkClick={() => navigate("/calendar")}
              selected={selectedCard === "events"}
              onSelect={() => setSelectedCard("events")}
            />
          </div>

          {/* Class List */}
          {/* teacher_id matches Firestore field name in classes collection */}
          <div className="class-list">
            {filteredClasses.map((cls) => (
              <ClassRow
                key={cls.id}
                cls={cls}
                teacher={getTeacher(cls.teacher_id)}
                onSelect={() => navigate("/class")}
              />
            ))}
            {filteredClasses.length === 0 && (
              <p style={{ color: "#888", fontSize: "0.9rem" }}>
                No classes match your search.
              </p>
            )}
          </div>
        </>
      )}

      {/* ===== QUICK ACTIONS BAR ===== */}
      {/* TODO: connect to modals/forms when teammates build those */}
      <div className="quick-actions-bar">
        <div className="quick-actions-title">Quick Actions</div>
        <div className="quick-actions-buttons">
          <button className="btn-action" onClick={handleAddStudent}>Add Students</button>
          <button className="btn-action" onClick={handleAddTeacher}>Add Teachers</button>
          <button className="btn-action" onClick={handleCreateClass}>Create Classes</button>
          <button className="btn-action" onClick={handleCreateEvent}>Create Events</button>
        </div>
      </div>
    </>
  );
}
