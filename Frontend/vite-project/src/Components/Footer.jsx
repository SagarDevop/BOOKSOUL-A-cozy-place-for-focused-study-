import { motion } from "framer-motion";
import { FaInstagram, FaFacebookF, FaTwitter, FaGithub, FaLinkedin } from "react-icons/fa";

const socialIcons = [
  { icon: <FaInstagram />, link: "https://instagram.com" },
  { icon: <FaFacebookF />, link: "https://facebook.com" },
  { icon: <FaTwitter />, link: "https://twitter.com" },
 
];

export default function Footer() {
  return (
    <footer className="relative w-full py-16 px-6 md:px-20 bg-gradient-to-br from-white-100 via-indigo-900 to-purple-800 text-black overflow-hidden">
      
      {/* Glowing Pulse Orb */}
      <motion.div
        className="absolute top-1/2 left-1/2 w-[500px] h-[500px] rounded-full bg-purple-900 opacity-30 blur-3xl -translate-x-1/2 -translate-y-1/2 -z-10 text-black"
        animate={{ scale: [1, 1.2, 1] }}
        transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
      />

      {/* Animated Background Swirl */}
      <div className="absolute inset-0 -z-10 bg-[conic-gradient(at_top_left,_#9333ea,_#1e40af,_#9333ea)] animate-spin-slow opacity-20 blur-2xl" />

      <div className="flex flex-col items-center justify-center space-y-6">
        <h2 className="text-3xl font-bold tracking-wide">🌟 Stay Connected</h2>
        <p className="text-center max-w-xl text-black-300">
          Follow us on social media to get the latest updates, new features, and inspiring content for your study journey.
        </p>

        <div className="flex space-x-6 text-2xl">
          {socialIcons.map((item, index) => (
            <motion.a
              key={index}
              href={item.link}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-pink-400 transition"
              whileHover={{ scale: 1.3 }}
              whileTap={{ scale: 0.9 }}
            >
              {item.icon}
            </motion.a>
          ))}
        </div>

        <p className="text-sm text-gray-900 pt-6">
          &copy; {new Date().getFullYear()} BOOKSOUL. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
