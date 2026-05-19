// Sidebar.jsx — Shared navigation sidebar
// Usage: import Sidebar from "../components/Sidebar";
// Then place <Sidebar /> inside your page's layout div alongside your content.
//
// To add a new route to the nav:
//   1. Add the route in src/main.jsx
//   2. Add a <NavLink> here with the matching path

import { NavLink } from "react-router-dom";
import "../../../styles/dashboard.css";

export default function Sidebar() {
  return (
    <nav className="dashboard-sidebar">
      <NavLink
        to="/"
        end
        className={({ isActive }) => "sidebar-link" + (isActive ? " active" : "")}
      >
        Dashboard
      </NavLink>
      <NavLink
        to="/calendar"
        className={({ isActive }) => "sidebar-link" + (isActive ? " active" : "")}
      >
        Calendar
      </NavLink>
      <NavLink
        to="/classes"
        className={({ isActive }) => "sidebar-link" + (isActive ? " active" : "")}
      >
        Classes
      </NavLink>
      {/* TODO: add Departments NavLink when that route is created in main.jsx */}
      <span className="sidebar-link" style={{ color: "#999", cursor: "default" }}>
        Departments
      </span>
      <NavLink
        to="/students"
        className={({ isActive }) => "sidebar-link" + (isActive ? " active" : "")}
      >
        Student Directory
      </NavLink>
      <NavLink
        to="/teachers"
        className={({ isActive }) => "sidebar-link" + (isActive ? " active" : "")}
      >
        Teacher Directory
      </NavLink>
    </nav>
  );
}