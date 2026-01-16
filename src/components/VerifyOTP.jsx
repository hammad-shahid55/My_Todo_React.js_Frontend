import { useState, useRef, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import { request } from "../api";
import { toast } from "react-toastify";
import { FaEnvelope, FaRedo } from "react-icons/fa";
import "react-toastify/dist/ReactToastify.css";
import "./style/Auth.css";

const VerifyOTP = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const email = location.state?.email;

  const [otp, setOtp] = useState(["", "", "", ""]);
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);
  const [countdown, setCountdown] = useState(0);
  const inputRefs = [useRef(), useRef(), useRef(), useRef()];

  useEffect(() => {
    if (!email) {
      navigate("/signup");
    }
  }, [email, navigate]);

  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [countdown]);

  const handleChange = (index, value) => {
    if (!/^\d*$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value.slice(-1);
    setOtp(newOtp);

    if (value && index < 3) {
      inputRefs[index + 1].current.focus();
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs[index - 1].current.focus();
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData("text").slice(0, 4);
    if (!/^\d+$/.test(pastedData)) return;

    const newOtp = [...otp];
    pastedData.split("").forEach((char, i) => {
      if (i < 4) newOtp[i] = char;
    });
    setOtp(newOtp);

    const lastIndex = Math.min(pastedData.length - 1, 3);
    inputRefs[lastIndex].current.focus();
  };

  const handleVerify = async (e) => {
    e.preventDefault();

    const otpString = otp.join("");
    if (otpString.length !== 4) {
      return toast.error("Please enter the complete 4-digit OTP");
    }

    setLoading(true);

    try {
      const data = await request("/verify-otp", {
        method: "POST",
        body: { email, otp: otpString },
      });

      localStorage.setItem("token", data.token);
      localStorage.setItem("userId", data.userId);
      localStorage.setItem("fullName", data.fullName);

      toast.success("Account created successfully!");
      setTimeout(() => navigate("/tasks"), 1000);
    } catch (err) {
      toast.error(err.message || "Invalid OTP");
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    if (countdown > 0) return;

    setResending(true);

    try {
      await request("/resend-otp", {
        method: "POST",
        body: { email },
      });

        toast.info("Your OTP is: 2468");
        setOtp(["", "", "", ""]);
        setCountdown(60);
        inputRefs[0].current.focus();
    } catch (err) {
      toast.error(err.message || "Failed to resend OTP");
    } finally {
      setResending(false);
    }
  };

  if (!email) return null;

  return (
    <div className="auth-container">
      <motion.form
        className="auth-form"
        onSubmit={handleVerify}
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h2 className="auth-heading">Verify Your Email</h2>
          <p className="auth-subtext">
            Your OTP is: <strong>2468</strong>
          </p>

        <div className="email-display">
          <FaEnvelope className="email-icon" />
          <span>{email}</span>
        </div>

        <div className="otp-container">
          {otp.map((digit, index) => (
            <input
              key={index}
              ref={inputRefs[index]}
              type="text"
              inputMode="numeric"
              maxLength={1}
              value={digit}
              onChange={(e) => handleChange(index, e.target.value)}
              onKeyDown={(e) => handleKeyDown(index, e)}
              onPaste={handlePaste}
              className="otp-input"
              autoFocus={index === 0}
            />
          ))}
        </div>

        <button type="submit" className="auth-button" disabled={loading}>
          {loading ? "Verifying..." : "Verify OTP"}
        </button>

        <div className="resend-section">
          <p className="auth-text">
            Didn't receive the code?{" "}
            <button
              type="button"
              onClick={handleResend}
              disabled={resending || countdown > 0}
              className="resend-btn"
            >
              <FaRedo className={resending ? "spinning" : ""} />
              {countdown > 0 ? `Resend in ${countdown}s` : "Resend OTP"}
            </button>
          </p>
        </div>
      </motion.form>
    </div>
  );
};

export default VerifyOTP;