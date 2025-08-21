import { useContext } from "react";
import { UserContext } from "./App";
import "../styles/account.css";
import { useNavigate } from "react-router-dom";

export default function Account() {
  const navigate = useNavigate();
  const { user, setUser, setIsAuthenticated } = useContext(UserContext);

  if (!user || !user._id) {
    return <p className="loading">Loading user information...</p>;
  }

  const handleLogout = () => {
    setUser({});
    setIsAuthenticated(false);

    fetch("http://localhost:5000/api/logout", { credentials: "include" })
      .then(() => console.log("Logged out successfully!"))
      .catch((err) => console.error(`Error: ${err}`));

    navigate("/home")
  };

  return (
    <div className="account-container">
      <div className="account-card">
        <div className="account-header">
          <h1 className="account-title">Hello {user.name}!</h1>
          <p className="account-subtitle">Welcome to your account dashboard</p>
        </div>
        
        <div className="account-info">
          <div className="info-item">
            <span className="info-label">Name:</span>
            <span className="info-value">{user.name}</span>
          </div>
          <div className="info-item">
            <span className="info-label">Email:</span>
            <span className="info-value">{user.email}</span>
          </div>
          <div className="info-item">
            <span className="info-label">Last Login:</span>
            <span className="info-value">{new Date(user.lastLogin).toLocaleString()}</span>
          </div>
          <div className="info-item">
            <span className="info-label">Member Since:</span>
            <span className="info-value">{new Date(user.createdAt).toLocaleString()}</span>
          </div>
        </div>
        
        <button className="logout-btn" onClick={handleLogout}>
          Logout
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
            <polyline points="16 17 21 12 16 7"></polyline>
            <line x1="21" y1="12" x2="9" y2="12"></line>
          </svg>
        </button>
      </div>
    </div>
  );
}