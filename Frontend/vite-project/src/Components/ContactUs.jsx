import React from "react";
import { motion } from "framer-motion";
import { FaWhatsapp } from "react-icons/fa";
import { toast } from "react-hot-toast"; 
import Navbar from "./Navbar";

export default function ContactUs() {
  const whatsappNumber = "918756754080";
  const currentTimestamp = new Date().toISOString();

  const [contactformData, setContactFormData] = React.useState({
    name: "",
    email: "",
    message: "",
  });

  const [isSubmitting, setIsSubmitting] = React.useState(false); // new state for loading

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate inputs first
    if (!contactformData.name || !contactformData.email || !contactformData.message) {
      toast.error("Please fill out all fields.");
      return;
    }

    setIsSubmitting(true); // button disabled + show spinner

    try {
      const response = await fetch('https://booksoul-a-cozy-place-for-focused-study.onrender.com/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: contactformData.name,
          email: contactformData.email,
          message: contactformData.message,
          timestamp: currentTimestamp,
        }),
      });
    
      if (!response.ok) {
        throw new Error("Failed to send message.");
      }
    
    toast.success("Message sent successfully! 🚀");
    setContactFormData({ name: "", email: "", message: "" }); // reset form
    } catch (error) {
    console.error("Error submitting contact form:", error);
    toast.error("Failed to send message. Try again.");
    }
  };
    

  const handleWhatsAppClick = () => {
    window.open(`https://wa.me/${whatsappNumber}`, "_blank");
  };

  return (
    <>
    <Navbar />
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 p-8 text-white relative overflow-hidden">
      <h1 className="text-4xl font-bold text-center mb-10">📬 Contact Us</h1>

      <div className="grid md:grid-cols-2 gap-12 items-start max-w-5xl mx-auto">
        {/* Contact Form */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="bg-white/10 backdrop-blur-md p-6 rounded-xl shadow-xl w-full"
        >
          <h2 className="text-2xl font-semibold mb-4">📨 Send us a Message</h2>
          <form className="space-y-4" onSubmit={handleSubmit}>
            <input
              value={contactformData.name}
              onChange={(e) =>
                setContactFormData({ ...contactformData, name: e.target.value })
              }
              type="text"
              placeholder="Your Name"
              className="w-full px-4 py-2 bg-white/20 rounded placeholder-gray-300 text-white"
            />
            <input
              value={contactformData.email}
              onChange={(e) =>
                setContactFormData({ ...contactformData, email: e.target.value })
              }
              type="email"
              placeholder="Your Email"
              className="w-full px-4 py-2 bg-white/20 rounded placeholder-gray-300 text-white"
            />
            <textarea
              value={contactformData.message}
              onChange={(e) =>
                setContactFormData({ ...contactformData, message: e.target.value })
              }
              rows="4"
              placeholder="Your Message"
              className="w-full px-4 py-2 bg-white/20 rounded placeholder-gray-300 text-white"
            />

            <button
              type="submit"
              disabled={isSubmitting}
              className={`flex items-center justify-center gap-2 bg-blue-500 hover:bg-blue-600 transition px-6 py-2 rounded ${
                isSubmitting ? "opacity-50 cursor-not-allowed" : ""
              }`}
            >
              {isSubmitting ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                "🚀 Send"
              )}
            </button>
          </form>
        </motion.div>

        {/* WhatsApp Box */}
        <motion.div
          whileHover={{ scale: 1.05 }}
          animate={{ y: [0, -10, 0] }}
          transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }}
          className="bg-green-500/10 border border-green-400 backdrop-blur-lg p-6 rounded-xl shadow-xl cursor-pointer text-center"
          onClick={handleWhatsAppClick}
        >
          <FaWhatsapp className="text-5xl mx-auto mb-4 text-green-400 animate-pulse" />
          <h3 className="text-xl font-semibold mb-2">Chat on WhatsApp</h3>
          <p className="text-green-200">Click here to message us directly</p>
        </motion.div>
      </div>

      {/* Glowing Animation Behind */}
      <div className="absolute top-1/3 left-1/2 w-[700px] h-[700px] bg-purple-500 opacity-20 blur-3xl rounded-full -z-10 animate-pulse-slow" />
    </div>
    </>
  );
}
