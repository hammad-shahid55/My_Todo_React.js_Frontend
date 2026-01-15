import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { request } from "../api";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./style/Auth.css";

const Login = () => {
  const navigate = useNavigate();

  const [form, setForm] = useState({ email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleLogin = async (e) => {
    e.preventDefault();

    if (!form.email || !form.password) {
      return toast.error("All fields are required");
    }

    setLoading(true);

    try {
      // Call login API
      const data = await request("/login", {
        method: "POST",
        body: {
          email: form.email,
          password: form.password,
        },
      });

      // Save token & user info
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

        <input
          type="email"
          name="email"
          placeholder="Email"
          value={form.email}
          onChange={handleChange}
          required
        />

        <div className="password-box">
          <input
            type={showPassword ? "text" : "password"}
            name="password"
            placeholder="Password"
            value={form.password}
            onChange={handleChange}
            required
          />
          <span onClick={() => setShowPassword(!showPassword)}>
            {showPassword ? <FaEyeSlash /> : <FaEye />}
          </span>
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
