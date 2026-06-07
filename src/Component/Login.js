import { useState, useEffect } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { FaEye, FaEyeSlash, FaSyncAlt } from "react-icons/fa";

import "./Login.css";

function Login() {
  const navigate = useNavigate();

  const [user, setUser] = useState({ email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);

  const [captcha, setCaptcha] = useState("");
  const [captchaInput, setCaptchaInput] = useState("");

  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  // CAPTCHA
  const generateCaptcha = () => {
    const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
    let code = "";
    for (let i = 0; i < 5; i++) {
      code += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setCaptcha(code);
  };

  useEffect(() => {
    generateCaptcha();
  }, []);

  const handleChange = (e) => {
    setUser({ ...user, [e.target.name]: e.target.value });
  };

  // LOGIN
  const handleLogin = async () => {
    if (loading) return;

    // CAPTCHA CHECK
    if (captchaInput.toUpperCase() !== captcha) {
      setError(true);
      generateCaptcha();
      setCaptchaInput("");
      setTimeout(() => setError(false), 500);
      return;
    }

    try {
      setLoading(true);

      const res = await axios.post(
        "http://localhost:8080/users/login",
        user
      );

      if (res.data?.message === "Login Success") {
        const loggedUser = res.data.user;

        // 🔥 FIXED PART (IMPORTANT)
        const fixedUser = {
          ...loggedUser,
          role:
            loggedUser.email === "admin@gmail.com"
              ? "ADMIN"
              : "USER"
        };

        // save user
        localStorage.setItem("user", JSON.stringify(fixedUser));
        localStorage.setItem("userEmail", loggedUser.email);

        // update navbar
        window.dispatchEvent(new Event("storage"));

        setSuccess(true);

        setTimeout(() => {
          navigate("/");
        }, 800);

      } else {
        alert(res.data?.message || "Invalid Credentials");
        generateCaptcha();
        setCaptchaInput("");
      }

    } catch (err) {
      console.log(err);
      alert("Server error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      <div className="login-wrapper">

        <div className="login-visual">
          <div className="visual-overlay">
            <h2>SravanLexi</h2>
            <p>Elegance is not being noticed, it's being remembered.</p>
          </div>
        </div>

        <div className="login-content">

          <div className="form-header">
            <h2>Welcome Back</h2>
            <p>Please enter your details to sign in</p>
          </div>

          {/* EMAIL */}
          <div className="input-group">
            <input
              type="email"
              name="email"
              placeholder="Email Address"
              onChange={handleChange}
            />
          </div>

          {/* PASSWORD */}
          <div className="input-group password-group">
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              placeholder="Password"
              onChange={handleChange}
            />

            <span onClick={() => setShowPassword(!showPassword)}>
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </span>
          </div>

          {/* CAPTCHA */}
          <div className="captcha-section">

            <div className="captcha-display">
              <span className="captcha-code">{captcha}</span>

              <button onClick={generateCaptcha} type="button">
                <FaSyncAlt />
              </button>
            </div>

            <input
              type="text"
              placeholder="Verify Captcha"
              value={captchaInput}
              onChange={(e) => setCaptchaInput(e.target.value)}
              className={error ? "input-error" : ""}
            />
          </div>

          {/* BUTTON */}
          <button
            className="main-login-btn"
            onClick={handleLogin}
            disabled={loading}
          >
            {loading
              ? "PLEASE WAIT..."
              : success
              ? "SUCCESS..."
              : "SIGN IN"}
          </button>

          <p className="footer-text">
            New to SravanLexi?{" "}
            <Link to="/sign">Create Account</Link>
          </p>

        </div>
      </div>
    </div>
  );
}

export default Login;