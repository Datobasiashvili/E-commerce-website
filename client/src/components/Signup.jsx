import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useContext } from "react";
import { UserContext } from "./App";
import axios from "axios";
import "../styles/signup.css";
import signupImg from "../images/signup-image.jpg";

export default function Signup() {
  const { setIsAuthenticated, setUser } = useContext(UserContext);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const navigate = useNavigate();

  const handleRegister = async (e) => {
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
          withCredentials: true,
        }
      );

      if (response.status === 201) {
        setUser(response.data.user)
        setIsAuthenticated(true)
        console.log("Registered Successfully");
        setEmail("");
        setPassword("");
        setConfirmPassword("");
        setError(null);
        navigate("/home");
      }
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

          <form className="signup-form" onSubmit={handleRegister}>
            <div className="form-group">
              <input
                type="text"
                placeholder="Full Name"
                id='full-name'
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
                id="email"
                autoComplete="off"
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            {/* this className has styles in login.css file */}
            <div className="password-input-container">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                value={password}
                id="password"
                autoComplete="off"
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <button
                type="button"
                className="password-toggle" //this classname has styles in login.css file
                onClick={() => setShowPassword((prev) => !prev)}
              >
                {showPassword ? (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    height="24px"
                    viewBox="0 -960 960 960"
                    width="24px"
                    fill="#6c5ce7"
                  >
                    <path d="m644-428-58-58q9-47-27-88t-93-32l-58-58q17-8 34.5-12t37.5-4q75 0 127.5 52.5T660-500q0 20-4 37.5T644-428Zm128 126-58-56q38-29 67.5-63.5T832-500q-50-101-143.5-160.5T480-720q-29 0-57 4t-55 12l-62-62q41-17 84-25.5t90-8.5q151 0 269 83.5T920-500q-23 59-60.5 109.5T772-302Zm20 246L624-222q-35 11-70.5 16.5T480-200q-151 0-269-83.5T40-500q21-53 53-98.5t73-81.5L56-792l56-56 736 736-56 56ZM222-624q-29 26-53 57t-41 67q50 101 143.5 160.5T480-280q20 0 39-2.5t39-5.5l-36-38q-11 3-21 4.5t-21 1.5q-75 0-127.5-52.5T300-500q0-11 1.5-21t4.5-21l-84-82Zm319 93Zm-151 75Z" />
                  </svg>
                ) : (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    height="24px"
                    viewBox="0 -960 960 960"
                    width="24px"
                    fill="#6c5ce7"
                  >
                    <path d="M480-320q75 0 127.5-52.5T660-500q0-75-52.5-127.5T480-680q-75 0-127.5 52.5T300-500q0 75 52.5 127.5T480-320Zm0-72q-45 0-76.5-31.5T372-500q0-45 31.5-76.5T480-608q45 0 76.5 31.5T588-500q0 45-31.5 76.5T480-392Zm0 192q-146 0-266-81.5T40-500q54-137 174-218.5T480-800q146 0 266 81.5T920-500q-54 137-174 218.5T480-200Zm0-300Zm0 220q113 0 207.5-59.5T832-500q-50-101-144.5-160.5T480-720q-113 0-207.5 59.5T128-500q50 101 144.5 160.5T480-280Z" />
                  </svg>
                )}
              </button>
            </div>
            {/* this className has styles in login.css file */} 
            <div className="password-input-container">
              <input
                type={showConfirmPassword ? "text" : "password"}
                placeholder="Confirm Password"
                value={confirmPassword}
                id="confirm-password"
                autoComplete="off"
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
              <button
                type="button"
                className="password-toggle" //this classname has CSS styles in login.css file
                onClick={() => setShowConfirmPassword((prev) => !prev)}
              >
                {showConfirmPassword ? (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    height="24px"
                    viewBox="0 -960 960 960"
                    width="24px"
                    fill="#6c5ce7"
                  >
                    <path d="m644-428-58-58q9-47-27-88t-93-32l-58-58q17-8 34.5-12t37.5-4q75 0 127.5 52.5T660-500q0 20-4 37.5T644-428Zm128 126-58-56q38-29 67.5-63.5T832-500q-50-101-143.5-160.5T480-720q-29 0-57 4t-55 12l-62-62q41-17 84-25.5t90-8.5q151 0 269 83.5T920-500q-23 59-60.5 109.5T772-302Zm20 246L624-222q-35 11-70.5 16.5T480-200q-151 0-269-83.5T40-500q21-53 53-98.5t73-81.5L56-792l56-56 736 736-56 56ZM222-624q-29 26-53 57t-41 67q50 101 143.5 160.5T480-280q20 0 39-2.5t39-5.5l-36-38q-11 3-21 4.5t-21 1.5q-75 0-127.5-52.5T300-500q0-11 1.5-21t4.5-21l-84-82Zm319 93Zm-151 75Z" />
                  </svg>
                ) : (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    height="24px"
                    viewBox="0 -960 960 960"
                    width="24px"
                    fill="#6c5ce7"
                  >
                    <path d="M480-320q75 0 127.5-52.5T660-500q0-75-52.5-127.5T480-680q-75 0-127.5 52.5T300-500q0 75 52.5 127.5T480-320Zm0-72q-45 0-76.5-31.5T372-500q0-45 31.5-76.5T480-608q45 0 76.5 31.5T588-500q0 45-31.5 76.5T480-392Zm0 192q-146 0-266-81.5T40-500q54-137 174-218.5T480-800q146 0 266 81.5T920-500q-54 137-174 218.5T480-200Zm0-300Zm0 220q113 0 207.5-59.5T832-500q-50-101-144.5-160.5T480-720q-113 0-207.5 59.5T128-500q50 101 144.5 160.5T480-280Z" />
                  </svg>
                )}
              </button>
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
