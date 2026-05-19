import { useState } from "react";
import { Outlet } from "react-router-dom";
import Header from "./components/Header";
import Sidebar from "./components/Sidebar";
import "./App.css";
import "./styles/dashboard.css";

// Placeholder user — replace with Firebase Auth when ready
// TODO (Firebase Auth): import { getAuth } from "firebase/auth" and use getAuth().currentUser
const MOCK_USER = { displayName: "Admin User" };

function App() {
  // TODO (Firebase Auth): replace with signOut(auth) from firebase/auth
  const handleLogout = () => {
    alert("Logout coming soon — connect Firebase Auth.");
  };

  return (
    <div className="dashboard-shell">
      {/* HEADER */}
      <Header displayName={MOCK_USER.displayName} onLogout={handleLogout} />

      {/* BODY */}
      <div className="dashboard-body">
        <Sidebar />
        <main className="dashboard-main">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

export default App;
