import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { request } from "../api";
import { FaEye, FaEyeSlash, FaEnvelope, FaLock } from "react-icons/fa";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./style/Auth.css";

const Login = () => {
  const navigate = useNavigate();

  const [form, setForm] = useState({ email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [touched, setTouched] = useState({});

  const validateEmail = (email) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const getValidationError = (field) => {
    if (!touched[field]) return null;
    
    switch (field) {
      case "email":
        if (!form.email) return "Email is required";
        if (!validateEmail(form.email)) return "Please enter a valid email";
        return null;
      case "password":
        if (!form.password) return "Password is required";
        return null;
      default:
        return null;
    }
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleBlur = (e) => {
    setTouched({ ...touched, [e.target.name]: true });
  };

  const handleLogin = async (e) => {
    e.preventDefault();

    setTouched({ email: true, password: true });

    if (!form.email || !form.password) {
      return toast.error("All fields are required");
    }

    if (!validateEmail(form.email)) {
      return toast.error("Please enter a valid email");
    }

    setLoading(true);

    try {
      const data = await request("/login", {
        method: "POST",
        body: {
          email: form.email,
          password: form.password,
        },
      });

      localStorage.setItem("token", data.token);
      localStorage.setItem("userId", data.userId);
      localStorage.setItem("fullName", data.fullName);

      toast.success("Login successful!");
      setTimeout(() => navigate("/tasks"), 1000);
    } catch (err) {
      toast.error(err.message || "Invalid credentials");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <motion.form
        className="auth-form"
        onSubmit={handleLogin}
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h2 className="auth-heading">Welcome Back</h2>
        <p className="auth-subtext">Log in to manage your tasks seamlessly.</p>

        <div className="input-group">
          <div className="input-wrapper">
            <FaEnvelope className="input-icon" />
            <input
              type="email"
              name="email"
              placeholder="Email"
              value={form.email}
              onChange={handleChange}
              onBlur={handleBlur}
              className={getValidationError("email") ? "input-error" : ""}
            />
          </div>
          {getValidationError("email") && (
            <span className="validation-hint error">{getValidationError("email")}</span>
          )}
          <span className="field-hint">Enter your registered email address</span>
        </div>

        <div className="input-group">
          <div className="input-wrapper password-box">
            <FaLock className="input-icon" />
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              placeholder="Password"
              value={form.password}
              onChange={handleChange}
              onBlur={handleBlur}
              className={getValidationError("password") ? "input-error" : ""}
            />
            <span className="eye-icon" onClick={() => setShowPassword(!showPassword)}>
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </span>
          </div>
          {getValidationError("password") && (
            <span className="validation-hint error">{getValidationError("password")}</span>
          )}
          <span className="field-hint">Enter your password to continue</span>
        </div>

        <button type="submit" className="auth-button" disabled={loading}>
          {loading ? "Logging in..." : "Login"}
        </button>

        <p className="auth-text">
          Don't have an account? <Link to="/signup">Sign Up</Link>
        </p>
      </motion.form>
    </div>
  );
};

export default Login;
