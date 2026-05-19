// Header.jsx — Shared app header
// Usage: import Header from "../features/dashboard/components/Header";
// Place <Header /> at the top of your page layout.
//
// TODO (Firebase Auth): pass in the real user object once auth is set up
// Replace the displayName prop with: getAuth().currentUser?.displayName

import "./styles/header.css";
export default function Header({ displayName = "Admin", onLogout }) {
  return (
    <header className="dashboard-header">
      <h1>Thomas Jefferson Elementary School</h1>
      <div className="header-right">
        <span className="header-username">{displayName.toUpperCase()}</span>
        <button className="btn-logout" onClick={onLogout}>
          Log Out
        </button>
      </div>
    </header>
  );
}
