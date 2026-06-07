import { useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { GoogleLogin } from "@react-oauth/google";
import { jwtDecode } from "jwt-decode";
import { FaUser, FaEnvelope, FaLock } from "react-icons/fa";

import "./SignUp.css";

function SignUp() {
  const navigate = useNavigate();

  const [user, setUser] = useState({
    name: "",
    email: "",
    password: ""
  });

  const [loading, setLoading] = useState(false);

  // 🔴 ERROR STATES (NEW)
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    setUser({ ...user, [e.target.name]: e.target.value });

    // remove error while typing
    setErrors({ ...errors, [e.target.name]: "" });
  };

  // ✅ VALIDATION FUNCTION
  const validate = () => {
    let newErrors = {};

    if (!user.name.trim()) {
      newErrors.name = "Name is required";
    }

    if (!user.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(user.email)) {
      newErrors.email = "Invalid email format";
    }

    if (!user.password.trim()) {
      newErrors.password = "Password is required";
    } else if (user.password.length < 6) {
      newErrors.password = "Minimum 6 characters required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // ✅ SIGNUP
  const handleSignup = async () => {
    if (!validate()) return;

    setLoading(true);
    try {
      const res = await axios.post(
        "http://localhost:8080/users/signup",
        user
      );

      // If backend returns the saved user object (which has an ID)
      if (res.data && res.data.id) {
        alert("Signup Successful 🎉");
        navigate("/login");
      }

    } catch (error) {
      // ✅ Handle "Email already exists" or Server Error
      const errorMessage = error.response?.data?.message || "Signup failed";
      alert(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  // ✅ GOOGLE SIGNUP
  const handleGoogleSuccess = async (credentialResponse) => {
    try {
      const decoded = jwtDecode(credentialResponse.credential);

      await axios.post(
        "http://localhost:8080/auth/google",
        credentialResponse.credential,
        {
          headers: { "Content-Type": "application/json" }
        }
      );

      localStorage.setItem("userEmail", decoded.email);
      localStorage.setItem("userName", decoded.name);

      alert("Google Signup Success");
      navigate("/");
    } catch (error) {
      console.log(error);
      alert("Google signup failed");
    }
  };

  return (
    <div className="signup-page">
      <div className="signup-wrapper">

        {/* LEFT */}
        <div className="signup-visual">
          <div className="visual-overlay">
            <h2>Join SravanLexi</h2>
            <p>Luxury fashion starts with you</p>
          </div>
        </div>

        {/* RIGHT */}
        <div className="signup-content">

          <div className="form-header">
            <h2>Create Account</h2>
            <p>Start your fashion journey</p>
          </div>

          {/* NAME */}
          <div className="input-field">
            <FaUser className="input-icon" />
            <input
              type="text"
              name="name"
              placeholder="Full Name"
              value={user.name}
              onChange={handleChange}
            />
          </div>
          {errors.name && <p className="error-text">{errors.name}</p>}

          {/* EMAIL */}
          <div className="input-field">
            <FaEnvelope className="input-icon" />
            <input
              type="email"
              name="email"
              placeholder="Email"
              value={user.email}
              onChange={handleChange}
            />
          </div>
          {errors.email && <p className="error-text">{errors.email}</p>}

          {/* PASSWORD */}
          <div className="input-field">
            <FaLock className="input-icon" />
            <input
              type="password"
              name="password"
              placeholder="Password"
              value={user.password}
              onChange={handleChange}
            />
          </div>
          {errors.password && <p className="error-text">{errors.password}</p>}

          {/* BUTTON */}
          <button
            className="main-signup-btn"
            onClick={handleSignup}
            disabled={loading}
          >
            {loading ? "Creating..." : "SIGN UP"}
          </button>

          <div className="divider"><span>OR</span></div>

          <div className="google-wrapper">
            <GoogleLogin
              onSuccess={handleGoogleSuccess}
              onError={() => alert("Google Signup Failed")}
            />
          </div>

          <p className="footer-text">
            Already have account? <Link to="/login">Login</Link>
          </p>

        </div>
      </div>
    </div>
  );
}

export default SignUp;