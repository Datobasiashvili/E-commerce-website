import "../styles/login.css";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export default function Login() {
  const [user, setUser] = useState({});
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      setError("Please fill in all the fields");
    }

    const userData = {
      email,
      password,
    };

    try {
      const response = await axios.post(
        "http://localhost:5000/api/login",
        userData,
        {
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true,
        }
      );

      if (response.status === 200) {
        console.log("Logged in successfully");
        setError(null);
        setEmail("");
        setPassword("");

        setUser(response.data.user);
        setIsAuthenticated(true);

        navigate("/home");
      }
    } catch (err) {
      console.error(`[Login Route] Error for email: ${email}`, err.message);
      if (err.response) {
        setError(err.response.data.msg || "Login failed.");
      } else {
        setError("An error occurred during log in. Please try again");
      }
    }
  };

  return (
    <div className="login-page">
      <div className="login-box">
        {/* Image container on the left */}
        <div className="login-image-container">
          <div className="image-overlay">
            <h2>Welcome to Our Community</h2>
            <p>Join thousands of happy users today</p>
          </div>
          {/* Replace with your actual image */}
          <img
            src="https://images.unsplash.com/photo-1633356122544-f134324a6cee?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80"
            alt="Login visual"
          />
        </div>

        {/* Form container on the right */}
        <div className="login-form-container">
          <div className="login-header">
            <h1 className="login-title">Welcome Back!</h1>
            <p className="login-subtitle">Log in to access your account</p>
          </div>

            
          <form className="login-form" onSubmit={handleSubmit}>

            {error && <div className="login-error">{error}</div>}
            
            <div className="form-group">
              <label htmlFor="email">Email</label>
              <input
                type="email"
                id="email"
                placeholder="Enter your email"
                value={email}
                autoComplete="off"
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="password">Password</label>
              <input
                type="password"
                id="password"
                placeholder="Enter your password"
                value={password}
                autoComplete="off"
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            <button type="submit" className="login-button">
              Log In
            </button>

            {/* Error display */}
            
          </form>

          <div className="login-footer">
            <p>
              Don't have an account?{" "}
              <a href="/signup" className="login-link">
                Sign up
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
