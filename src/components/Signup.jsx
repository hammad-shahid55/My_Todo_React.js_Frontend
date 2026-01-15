import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { request } from "../api";
import { FaEye, FaEyeSlash } from "react-icons/fa";
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
  const [strength, setStrength] = useState("");
  const [loading, setLoading] = useState(false);

  const checkStrength = (password) => {
    if (password.length < 6) return "weak";
    if (/[A-Z]/.test(password) && /[0-9]/.test(password) && /[^A-Za-z0-9]/.test(password)) return "strong";
    return "medium";
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });

    if (name === "password") {
      setStrength(checkStrength(value));
    }
  };

  const handleSignup = async (e) => {
    e.preventDefault();

    if (!form.fullName || !form.email || !form.password)
      return toast.error("All fields are required");

    if (form.password !== form.confirmPassword)
      return toast.error("Passwords do not match");

    setLoading(true);

    try {
      const data = await request("/signup", {
        method: "POST",
        body: {
          fullName: form.fullName,
          email: form.email,
          password: form.password,
        },
      });

      toast.success("Account created successfully!");
      localStorage.setItem("token", data.token);
      localStorage.setItem("userId", data.userId);
      localStorage.setItem("fullName", data.fullName);

      setTimeout(() => navigate("/login"), 1500);
    } catch (err) {
      toast.error(err.message || "Signup failed");
    } finally {
      setLoading(false);
    }
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

        <input
          type="text"
          name="fullName"
          placeholder="Full Name"
          value={form.fullName}
          onChange={handleChange}
        />

        <input
          type="email"
          name="email"
          placeholder="Email Address"
          value={form.email}
          onChange={handleChange}
        />

        <div className="password-box">
          <input
            type={showPassword ? "text" : "password"}
            name="password"
            placeholder="Password"
            value={form.password}
            onChange={handleChange}
          />
          <span onClick={() => setShowPassword(!showPassword)}>
            {showPassword ? <FaEyeSlash /> : <FaEye />}
          </span>
        </div>

        {form.password && (
          <div className={`strength ${strength}`}>
            <span></span><span></span><span></span>
          </div>
        )}

        <input
          type="password"
          name="confirmPassword"
          placeholder="Confirm Password"
          value={form.confirmPassword}
          onChange={handleChange}
        />

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
