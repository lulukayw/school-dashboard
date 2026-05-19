
import { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import StatCard from "../features/dashboard/components/StatCard";
import ClassRow from "../features/dashboard/components/ClassRow";
import "../styles/dashboard.css";


// Mock data — replace with Firebase/Firestore fetches later
// Search "TODO (Firebase)" in this file for every integration point
import {
  MOCK_STUDENTS,
  MOCK_TEACHERS,
  MOCK_CLASSES,
  MOCK_EVENTS,
  MOCK_USER,
} from "../constants/mockData";


export default function Home() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCard, setSelectedCard] = useState(null);
  // ---- Data — swap these for Firebase hook calls when ready ----
  // TODO (Firebase): replace with useStudents(), useTeachers(), useClasses(), useEvents()
  const students = MOCK_STUDENTS;
  const teachers = MOCK_TEACHERS;
  const classes = MOCK_CLASSES;
  const events = MOCK_EVENTS;
  const currentUser = MOCK_USER;
  // Helper: find a teacher by their ID to display their name in ClassRow
  const getTeacher = (teacherId) => teachers.find((t) => t.id === teacherId);
  // Filters classes by name or subject based on the search input
  const filteredClasses = classes.filter(
    (cls) =>
      cls.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      cls.subject.toLowerCase().includes(searchQuery.toLowerCase())
  );
  // TODO (Firebase Auth): replace with signOut(auth) from firebase/auth
  const handleLogout = () => {
    alert("Logout coming soon — connect Firebase Auth.");
  };
  // Quick action handlers — navigate to the relevant page
  // TODO: update these to open a modal/form once those are built by teammates
  const handleAddStudent = () => navigate("/students");
  const handleAddTeacher = () => navigate("/teachers");
  const handleCreateClass = () => navigate("/classes");
  const handleCreateEvent = () => navigate("/calendar");
  return (
    <div className="dashboard-shell">
      {/* ===== HEADER ===== */}
      <header className="dashboard-header">
        <h1>Thomas Jefferson Elementary School</h1>
        <div className="header-right">
          {/* TODO (Firebase Auth): replace with currentUser.displayName from auth */}
          <span className="header-username">{currentUser.displayName.toUpperCase()}</span>
          <button className="btn-logout" onClick={handleLogout}>Log Out</button>
        </div>
      </header>
      {/* ===== BODY ===== */}
      <div className="dashboard-body">
        {/* --- Sidebar --- */}
        <nav className="dashboard-sidebar">
          <NavLink to="/" end className={({ isActive }) => "sidebar-link" + (isActive ? " active" : "")}>
            Dashboard
          </NavLink>
          <NavLink to="/calendar" className={({ isActive }) => "sidebar-link" + (isActive ? " active" : "")}>
            Calendar
          </NavLink>
          <NavLink to="/classes" className={({ isActive }) => "sidebar-link" + (isActive ? " active" : "")}>
            Classes
          </NavLink>
          {/* TODO: add route for Departments when teammate builds that page */}
          <span className="sidebar-link" style={{ color: "#999", cursor: "default" }}>
            Departments
          </span>
          <NavLink to="/students" className={({ isActive }) => "sidebar-link" + (isActive ? " active" : "")}>
            Student Directory
          </NavLink>
          <NavLink to="/teachers" className={({ isActive }) => "sidebar-link" + (isActive ? " active" : "")}>
            Teacher Directory
          </NavLink>
        </nav>
        {/* --- Main Content --- */}
        <main className="dashboard-main">
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
          {/* Stat Cards */}
          {/* TODO (Firebase): replace students/teachers/events arrays with Firestore data */}
          <div className="stat-cards-row">
            <StatCard
              title="Students"
              items={students.map((s) => s.name)}
              linkLabel="View student directory"
              onLinkClick={() => navigate("/students")}
              selected={selectedCard === "students"}
              onSelect={() => setSelectedCard("students")}
            />
            <StatCard
              title="Teachers"
              items={teachers.map((t) => t.name)}
              linkLabel="View teacher directory"
              onLinkClick={() => navigate("/teachers")}
              selected={selectedCard === "teachers"}
              onSelect={() => setSelectedCard("teachers")}
            />
            <StatCard
              title="Upcoming Events"
              items={events.map((e) => `${e.title} — ${new Date(e.date).toLocaleDateString()}`)}
              linkLabel="View calendar"
              onLinkClick={() => navigate("/calendar")}
              selected={selectedCard === "events"}
              onSelect={() => setSelectedCard("events")}
            />
          </div>
          {/* Class List */}
          {/* TODO (Firebase): filteredClasses will come from Firestore "classes" collection */}
          <div className="class-list">
            {filteredClasses.map((cls) => (
              <ClassRow
                key={cls.id}
                cls={cls}
                teacher={getTeacher(cls.teacherId)}
                onSelect={() => navigate("/class")}
              />
            ))}
            {filteredClasses.length === 0 && (
              <p style={{ color: "#888", fontSize: "0.9rem" }}>No classes match your search.</p>
            )}
          </div>
        </main>
      </div>
      {/* ===== QUICK ACTIONS BAR ===== */}
      {/* TODO: connect buttons to modals/forms when teammates build those */}
      <div className="quick-actions-bar">
        <div className="quick-actions-title">Quick Actions</div>
        <div className="quick-actions-buttons">
          <button className="btn-action" onClick={handleAddStudent}>Add Students</button>
          <button className="btn-action" onClick={handleAddTeacher}>Add Teachers</button>
          <button className="btn-action" onClick={handleCreateClass}>Create Classes</button>
          <button className="btn-action" onClick={handleCreateEvent}>Create Events</button>
        </div>
      </div>
    </div>
  );
}
