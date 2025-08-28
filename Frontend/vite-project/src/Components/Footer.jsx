import { motion } from "framer-motion";
import { FaInstagram, FaFacebookF, FaTwitter, FaGithub, FaLinkedin } from "react-icons/fa";

const socialIcons = [
  
  { icon: <FaFacebookF />, link: "https://www.facebook.com/people/chitrakoot-digital-library/61579806216243/?rdid=nWeosuTr35hjRSxE&share_url=https%3A%2F%2Fwww.facebook.com%2Fshare%2F16D64nq1W7%2F" },
  { icon: <FaLinkedin />, link: "https://www.linkedin.com/in/sagar-singh-2b9953337/" },
  { icon: <FaGithub />, link: "https://github.com/SagarDevop"}
 
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
          &copy; {new Date().getFullYear()} Chitrakoot Digital Library. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
