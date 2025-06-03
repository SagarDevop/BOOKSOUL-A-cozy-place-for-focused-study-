import React, { useState } from "react";
import { Eye, EyeOff, LogIn, UserPlus, KeyRound, Send } from "lucide-react";
import { motion } from "framer-motion";
import Confetti from "react-confetti";
import Lottie from "lottie-react";
import { toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom";

import loadingAnimation from "../lottie/loading.json";

const AuthForm = () => {
  const [mode, setMode] = useState("login"); // login | signup | request-reset | verify-otp
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    otp: "",
    newPassword: "",
  });

  const navigate = useNavigate();

  const togglePassword = () => setShowPassword((prev) => !prev);

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const baseUrl = 'https://booksoul-a-cozy-place-for-focused-study.onrender.com';

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setSuccess(false);

    try {
      let url = "";
      let body = {};

      if (mode === "login") {
        url = `${baseUrl}/login`;
        body = { email: formData.email, password: formData.password };
      } else if (mode === "signup") {
        url = `${baseUrl}/signup`;
        body = formData;
      } else if (mode === "request-reset") {
        url = `${baseUrl}/request-reset`;
        body = { email: formData.email };
      } else if (mode === "verify-otp") {
        url = `${baseUrl}/verify-otp`;
        body = { email: formData.email, otp: formData.otp, newPassword: formData.newPassword };
      }

      const response = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      const data = await response.json();

      if (!response.ok || data.error) {
        toast.error(data.error || "Something went wrong!");
        return;
      }

      if (mode === "signup") {
        setSuccess(true);
      }

      if (mode === "verify-otp") {
        toast.success("Password reset successful!");
        setMode("login");
      }

      if (mode === "login" || mode === "signup") {
        localStorage.setItem("user", JSON.stringify({
          name: data.user?.name || formData.name,
          email: data.user?.email || formData.email,
        }));

        toast.success(data.message || "Success!");
        setTimeout(() => navigate("/"), 1500);
      }

      if (mode === "request-reset") {
        toast.success("OTP sent to your email!");
        setMode("verify-otp");
      }

    } catch (err) {
      console.error(err);
      toast.error("Unexpected error!",err);
    } finally {
      setLoading(false);
    }
  };

  const renderTitle = () => {
    if (mode === "login") return <> <LogIn size={24} /> Welcome Back! 👋</>;
    if (mode === "signup") return <> <UserPlus size={24} /> Join Us Today! 🚀</>;
    if (mode === "request-reset") return <> <Send size={24} /> Reset Your Password</>;
    if (mode === "verify-otp") return <> <KeyRound size={24} /> Verify OTP</>;
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-100 to-purple-200 px-4 overflow-hidden">
      {success && <Confetti width={window.innerWidth} height={window.innerHeight} />}
      <div className="absolute top-[-100px] right-[-100px] w-[300px] h-[300px] bg-purple-300 rounded-full mix-blend-multiply filter blur-3xl opacity-40 animate-blob"></div>
      <div className="absolute bottom-[-100px] left-[-100px] w-[300px] h-[300px] bg-blue-300 rounded-full mix-blend-multiply filter blur-3xl opacity-40 animate-blob animation-delay-2000"></div>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative z-10 bg-white p-8 rounded-2xl shadow-2xl w-full max-w-md backdrop-blur-lg border border-white/30"
      >
        <motion.h2
          key={mode}
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="text-2xl font-bold mb-6 text-center flex items-center justify-center gap-2 text-purple-700"
        >
          {renderTitle()}
        </motion.h2>

        {loading ? (
          <div className="flex justify-center items-center py-6">
            <Lottie animationData={loadingAnimation} style={{ height: 120 }} />
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-5">
            {mode === "signup" && (
              <div>
                <label className="block text-sm mb-1 text-gray-700">Name</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="w-full border border-gray-300 rounded-xl px-4 py-2"
                />
              </div>
            )}

            <div>
              <label className="block text-sm mb-1 text-gray-700">Email</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                className="w-full border border-gray-300 rounded-xl px-4 py-2"
              />
            </div>

            {(mode === "login" || mode === "signup") && (
              <div>
                <label className="block text-sm mb-1 text-gray-700">Password</label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    required
                    className="w-full border border-gray-300 rounded-xl px-4 py-2 pr-10"
                  />
                  <button
                    type="button"
                    onClick={togglePassword}
                    className="absolute right-3 top-2.5 text-gray-500"
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>
            )}

            {mode === "verify-otp" && (
              <>
                <div>
                  <label className="block text-sm mb-1 text-gray-700">OTP</label>
                  <input
                    type="text"
                    name="otp"
                    value={formData.otp}
                    onChange={handleChange}
                    required
                    className="w-full border border-gray-300 rounded-xl px-4 py-2"
                  />
                </div>
                <div>
                  <label className="block text-sm mb-1 text-gray-700">New Password</label>
                  <input
                    type="password"
                    name="newPassword"
                    value={formData.newPassword}
                    onChange={handleChange}
                    required
                    className="w-full border border-gray-300 rounded-xl px-4 py-2"
                  />
                </div>
              </>
            )}

            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              type="submit"
              className="w-full bg-purple-500 hover:bg-purple-600 text-white py-2 rounded-xl font-semibold"
            >
              {mode === "login" && "Login"}
              {mode === "signup" && "Sign Up"}
              {mode === "request-reset" && "Send OTP"}
              {mode === "verify-otp" && "Reset Password"}
            </motion.button>
          </form>
        )}

        <div className="text-sm text-center mt-4 text-gray-600">
          {mode === "login" && (
            <>
              Don't have an account?{" "}
              <button onClick={() => setMode("signup")} className="text-purple-600 font-semibold hover:underline">Sign Up</button>
              <br />
              <button onClick={() => setMode("request-reset")} className="mt-2 text-blue-500 hover:underline">Forgot Password?</button>
            </>
          )}
          {mode === "signup" && (
            <>
              Already have an account?{" "}
              <button onClick={() => setMode("login")} className="text-purple-600 font-semibold hover:underline">Login</button>
            </>
          )}
          {(mode === "request-reset" || mode === "verify-otp") && (
            <>
              <button onClick={() => setMode("login")} className="text-purple-600 hover:underline">← Back to Login</button>
            </>
          )}
        </div>
      </motion.div>

      <style>
        {`
          .animate-blob {
            animation: blob 8s infinite ease-in-out;
          }
          .animation-delay-2000 {
            animation-delay: 2s;
          }
          @keyframes blob {
            0%, 100% { transform: translate(0px, 0px) scale(1); }
            33% { transform: translate(30px, -50px) scale(1.1); }
            66% { transform: translate(-20px, 20px) scale(0.9); }
          }
        `}
      </style>
    </div>
  );
};

export default AuthForm;
