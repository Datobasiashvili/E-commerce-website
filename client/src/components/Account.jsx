import { useContext, useEffect } from "react";
import { UserContext } from "./App";
import "../styles/account.css";
import { useNavigate } from "react-router-dom";
import Header from "./Header";

export default function Account() {
  const navigate = useNavigate();
  const { user, setUser, isAuthenticated, setIsAuthenticated } =
    useContext(UserContext);

<<<<<<< HEAD
  const API_URL = import.meta.env.VITE_API_URL;

=======
>>>>>>> ddd6f5e2493fe3f07c819747f4d2599ccaa64c16
  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/home");
    }
  }, [isAuthenticated, navigate]);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const day = date.getDate();
    const month = date.toLocaleString("default", { month: "short" });
    const year = date.getFullYear();

    return `${month} ${day}, ${year}`;
  };

  const handleLogout = () => {
    setUser({});
    setIsAuthenticated(false);

<<<<<<< HEAD
    fetch(`${API_URL}/logout`,
      {
        method: "POST",
        credentials: "include",
      })
=======
    fetch("https://e-commerce-website-47sr.onrender.com/api/logout", {
      method: "POST",
      credentials: "include",
    })
>>>>>>> ddd6f5e2493fe3f07c819747f4d2599ccaa64c16
      .then(() => console.log("Logged out successfully!"))
      .catch((err) => console.error(`Error: ${err}`));

    navigate("/home");
  };

  if (!user || !user._id) {
    return <p>Loading user information...</p>;
  }

  return (
    <>
      <Header />
      <div className="account-container">
        <div className="account-card">
          <div className="account-header">
            <h1 className="account-title">Hello {user.name}!</h1>
            <p className="account-subtitle">
              Welcome to your account dashboard
            </p>
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
              <span className="info-value">{formatDate(user.lastLogin)}</span>
            </div>
            <div className="info-item">
              <span className="info-label">Member Since:</span>
              <span className="info-value">{formatDate(user.createdAt)}</span>
            </div>
          </div>

          <button className="logout-btn" onClick={handleLogout}>
            Logout
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
              <polyline points="16 17 21 12 16 7"></polyline>
              <line x1="21" y1="12" x2="9" y2="12"></line>
            </svg>
          </button>

          <button className="add-product-btn" onClick={() => navigate('/product/add')}>Add a product</button>

        </div>
      </div>
    </>
  );
}
