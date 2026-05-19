import { NavLink, Outlet } from "react-router-dom";
import "./App.css";

function App() {
  return (
    <div>
      <nav>
        <NavLink to="/">Home</NavLink>
        <NavLink to="/calendar">Calendar</NavLink>
        <NavLink to="/class">Class</NavLink>
        <NavLink to="/classes">Classes</NavLink>
        <NavLink to="/students">Students</NavLink>
        <NavLink to="/teachers">Teachers</NavLink>
      </nav>
      <Outlet />
    </div>
  );
}

export default App;
