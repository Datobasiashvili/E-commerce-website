import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "../styles/signup.css";
import signupImg from "../images/signup-image.jpg";

export default function Signup() {
  const [user, setUser] = useState({});
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    const userData = {
      name,
      email,
      password,
    };

    if (password !== confirmPassword) {
      setError("Passwords don't match");
      return;
    }

    try {
      const response = await axios.post(
        "http://localhost:5000/api/register",
        userData,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (response.status === 201) {
        console.log("Registered Successfully");
        setEmail("");
        setPassword("");
        setConfirmPassword("");
        setUser(response.data.user);
        setIsAuthenticated(true);
        setError(null);
        navigate("/home");
      }

      setEmail("");
      setPassword("");
      setConfirmPassword("");
    } catch (err) {
      console.error("[Register Route] Error while creating user:", err.message);
      if (err.response) {
        setError(err.response.data.msg || "Registration failed.");
      } else {
        setError("An error occurred registration. Please try again.");
      }
    }
  };

  return (
    <div className="signup-page">
      <div className="signup-box">
        {/* Left side - Form */}
        <div className="signup-form-container">
          <div className="signup-header">
            <h1 className="signup-title">Create Account</h1>
            <p className="signup-subtitle">Join us today!</p>
          </div>

          {error && <div className="signup-error">{error}</div>}

          <form className="signup-form" onSubmit={handleSubmit}>
            <div className="form-group">
              <input
                type="text"
                placeholder="Full Name"
                value={name}
                autoComplete="off"
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>
            <div className="form-group">
              <input
                type="email"
                placeholder="Email"
                value={email}
                autoComplete="off"
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="form-group">
              <input
                type="password"
                placeholder="Password"
                value={password}
                autoComplete="off"
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <div className="form-group">
              <input
                type="password"
                placeholder="Confirm Password"
                value={confirmPassword}
                autoComplete="off"
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
            </div>
            <button type="submit" className="signup-button">
              Sign Up
            </button>
          </form>

          <div className="signup-footer">
            <p>
              Already have an account?{" "}
              <a href="/login" className="login-link">
                Log in
              </a>
            </p>
          </div>
        </div>

        {/* Right side - Image */}
        <div className="signup-image-container">
          <div className="image-overlay">
            <h2>Welcome to Our Community</h2>
            <p>Join thousands of happy users today</p>
          </div>
          <img src={signupImg} alt="Signup Illustration" />
        </div>
      </div>
    </div>
  );
}
