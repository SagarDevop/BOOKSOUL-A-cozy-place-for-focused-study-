import React, { useState, useEffect } from "react";
import { Eye, EyeOff, LogIn, UserPlus } from "lucide-react";
import { motion } from "framer-motion";
import Confetti from "react-confetti";
import Lottie from "lottie-react";
import { toast } from "react-hot-toast"; // 👈 install it if not already
import { useNavigate } from "react-router-dom";

import loadingAnimation from "../lottie/loading.json";

const AuthForm = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });

  const navigate = useNavigate(); // 👈 For clean navigation

  const togglePassword = () => setShowPassword((prev) => !prev);
  const toggleMode = () => {
    setSuccess(false);
    setIsLogin((prev) => !prev);
  };

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setSuccess(false);

    try {
      const baseUrl = 'http://localhost:5000';
      const url = isLogin ? `${baseUrl}/login` : `${baseUrl}/signup`;
      const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok || data.error) {
        toast.error(data.error || "Something went wrong!");
        return;
      }

      // Login or Signup was successful
      if (!isLogin) {
        setSuccess(true); // 🎉 Confetti on signup only
      }

      // Save user data to localStorage
      localStorage.setItem('user', JSON.stringify({
        name: data.user?.name || formData.name,
        email: data.user?.email || formData.email,
      }));

      toast.success(data.message || "Success!");

      // Smooth delay then redirect
      setTimeout(() => {
        navigate('/');
      }, 1500);

    } catch (err) {
      console.error(err);
      toast.error("An unexpected error occurred!");
      console.log("Error:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-100 to-purple-200 px-4 overflow-hidden">
      {success && <Confetti width={window.innerWidth} height={window.innerHeight} />}

      {/* Background blobs */}
      <div className="absolute top-[-100px] right-[-100px] w-[300px] h-[300px] bg-purple-300 rounded-full mix-blend-multiply filter blur-3xl opacity-40 animate-blob"></div>
      <div className="absolute bottom-[-100px] left-[-100px] w-[300px] h-[300px] bg-blue-300 rounded-full mix-blend-multiply filter blur-3xl opacity-40 animate-blob animation-delay-2000"></div>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative z-10 bg-white p-8 rounded-2xl shadow-2xl w-full max-w-md backdrop-blur-lg border border-white/30"
      >
        <motion.h2
          key={isLogin ? "login" : "signup"}
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="text-2xl font-bold mb-6 text-center flex items-center justify-center gap-2 text-purple-700"
        >
          {isLogin ? <LogIn size={24} /> : <UserPlus size={24} />}
          {isLogin ? "Welcome Back! 👋" : "Join Us Today! 🚀"}
        </motion.h2>

        {loading ? (
          <div className="flex justify-center items-center py-6">
            <Lottie animationData={loadingAnimation} style={{ height: 120 }} />
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-5">
            {!isLogin && (
              <div>
                <label className="block text-sm font-medium mb-1 text-gray-700">
                  Name
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="w-full border border-gray-300 rounded-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-400 transition"
                />
              </div>
            )}

            <div>
              <label className="block text-sm font-medium mb-1 text-gray-700">
                Email
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                className="w-full border border-gray-300 rounded-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-400 transition"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1 text-gray-700">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  className="w-full border border-gray-300 rounded-xl px-4 py-2 pr-10 focus:outline-none focus:ring-2 focus:ring-purple-400 transition"
                />
                <button
                  type="button"
                  onClick={togglePassword}
                  className="absolute right-3 top-2.5 text-gray-500 hover:text-purple-500 transition"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              type="submit"
              className="w-full bg-purple-500 hover:bg-purple-600 text-white py-2 rounded-xl font-semibold transition duration-200 shadow-md"
            >
              {isLogin ? "Login" : "Sign Up"}
            </motion.button>
          </form>
        )}

        <p className="text-sm text-center mt-4 text-gray-600">
          {isLogin ? "Don't have an account?" : "Already have an account?"}{" "}
          <button
            onClick={toggleMode}
            className="text-purple-600 font-semibold hover:underline transition"
          >
            {isLogin ? "Sign Up" : "Login"}
          </button>
        </p>
      </motion.div>

      {/* Blob Animation Style */}
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
