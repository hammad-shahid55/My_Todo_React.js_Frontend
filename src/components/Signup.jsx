import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { request } from "../api";
import { FaEye, FaEyeSlash, FaUser, FaEnvelope, FaLock, FaCheckCircle } from "react-icons/fa";
import { toast } from "react-toastify";
import { motion } from "framer-motion";
import "react-toastify/dist/ReactToastify.css";
import "./style/Auth.css";

const Signup = () => {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [strength, setStrength] = useState("");
  const [loading, setLoading] = useState(false);
  const [touched, setTouched] = useState({});

  const checkStrength = (password) => {
    if (password.length < 6) return "weak";
    if (/[A-Z]/.test(password) && /[0-9]/.test(password) && /[^A-Za-z0-9]/.test(password)) return "strong";
    return "medium";
  };

  const validateEmail = (email) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const getValidationError = (field) => {
    if (!touched[field]) return null;
    
    switch (field) {
      case "fullName":
        if (!form.fullName) return "Full name is required";
        if (form.fullName.length < 2) return "Name must be at least 2 characters";
        return null;
      case "email":
        if (!form.email) return "Email is required";
        if (!validateEmail(form.email)) return "Please enter a valid email";
        return null;
      case "password":
        if (!form.password) return "Password is required";
        if (form.password.length < 6) return "Password must be at least 6 characters";
        return null;
      case "confirmPassword":
        if (!form.confirmPassword) return "Please confirm your password";
        if (form.password !== form.confirmPassword) return "Passwords do not match";
        return null;
      default:
        return null;
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });

    if (name === "password") {
      setStrength(checkStrength(value));
    }
  };

  const handleBlur = (e) => {
    setTouched({ ...touched, [e.target.name]: true });
  };

  const handleSignup = async (e) => {
    e.preventDefault();

    setTouched({
      fullName: true,
      email: true,
      password: true,
      confirmPassword: true,
    });

    if (!form.fullName || !form.email || !form.password)
      return toast.error("All fields are required");

    if (!validateEmail(form.email))
      return toast.error("Please enter a valid email");

    if (form.password.length < 6)
      return toast.error("Password must be at least 6 characters");

    if (form.password !== form.confirmPassword)
      return toast.error("Passwords do not match");

    setLoading(true);

    try {
        await request("/signup", {
          method: "POST",
          body: {
            fullName: form.fullName,
            email: form.email,
            password: form.password,
          },
        });

        toast.success("OTP sent to your email!");
        setTimeout(() => navigate("/verify-otp", { state: { email: form.email } }), 1000);
      } catch (err) {
        toast.error(err.message || "Signup failed");
      } finally {
        setLoading(false);
      }
  };

  const getStrengthLabel = () => {
    if (!form.password) return "";
    if (strength === "weak") return "Weak - Add uppercase, numbers & symbols";
    if (strength === "medium") return "Medium - Add more variety";
    return "Strong password!";
  };

  return (
    <div className="auth-container">
      <motion.form
        className="auth-form"
        onSubmit={handleSignup}
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <h2 className="auth-heading">Create Account</h2>
        <p className="auth-subtext">Join us to manage your tasks efficiently</p>

        <div className="input-group">
          <div className="input-wrapper">
            <FaUser className="input-icon" />
            <input
              type="text"
              name="fullName"
              placeholder="Full Name"
              value={form.fullName}
              onChange={handleChange}
              onBlur={handleBlur}
              className={getValidationError("fullName") ? "input-error" : ""}
            />
          </div>
          {getValidationError("fullName") && (
            <span className="validation-hint error">{getValidationError("fullName")}</span>
          )}
          <span className="field-hint">Enter your full name as it appears on documents</span>
        </div>

        <div className="input-group">
          <div className="input-wrapper">
            <FaEnvelope className="input-icon" />
            <input
              type="email"
              name="email"
              placeholder="Email Address"
              value={form.email}
              onChange={handleChange}
              onBlur={handleBlur}
              className={getValidationError("email") ? "input-error" : ""}
            />
          </div>
          {getValidationError("email") && (
            <span className="validation-hint error">{getValidationError("email")}</span>
          )}
          <span className="field-hint">We'll never share your email with anyone</span>
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
          {form.password && (
            <>
              <div className={`strength ${strength}`}>
                <span></span><span></span><span></span>
              </div>
              <span className={`validation-hint ${strength}`}>{getStrengthLabel()}</span>
            </>
          )}
          <span className="field-hint">Use 6+ characters with uppercase, numbers & symbols</span>
        </div>

        <div className="input-group">
          <div className="input-wrapper password-box">
            <FaCheckCircle className="input-icon" />
            <input
              type={showConfirmPassword ? "text" : "password"}
              name="confirmPassword"
              placeholder="Confirm Password"
              value={form.confirmPassword}
              onChange={handleChange}
              onBlur={handleBlur}
              className={getValidationError("confirmPassword") ? "input-error" : ""}
            />
            <span className="eye-icon" onClick={() => setShowConfirmPassword(!showConfirmPassword)}>
              {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
            </span>
          </div>
          {getValidationError("confirmPassword") && (
            <span className="validation-hint error">{getValidationError("confirmPassword")}</span>
          )}
          {form.confirmPassword && form.password === form.confirmPassword && (
            <span className="validation-hint success">Passwords match!</span>
          )}
        </div>

        <button disabled={loading} className="auth-button">
          {loading ? "Creating account..." : "Sign Up"}
        </button>

        <p className="auth-text">
          Already have an account? <Link to="/login">Login</Link>
        </p>
      </motion.form>
    </div>
  );
};

export default Signup;
