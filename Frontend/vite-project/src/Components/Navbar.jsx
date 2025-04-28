import React, { useEffect, useState } from 'react';
import { motion, useAnimation } from 'framer-motion';
import { Home, Info, Phone, User } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';

import AccountModal from './AccountModal';

function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [user, setUser] = useState(null);
  const controls = useAnimation();
  const navigate = useNavigate();
  const [showAccountModal, setShowAccountModal] = useState(false);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 30);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    controls.start({
      height: isScrolled ? '9vh' : '13vh',
      paddingTop: isScrolled ? '0.5rem' : '1rem',
      paddingBottom: isScrolled ? '0.5rem' : '1rem',
      transition: { duration: 0.3, ease: 'easeInOut' },
    });
  }, [isScrolled, controls]);

  const handleLogout = () => {
    localStorage.removeItem('user');
    setUser(null);
    toast.success('Logged out successfully!'); // 🎯 show toast
    navigate('/login');
  };
  
  return (
    <>
      {/* 🌟 Navbar */}
      <motion.nav
        animate={controls}
        className="sticky top-0 z-50 backdrop-blur-xl bg-gradient-to-r from-indigo-700 via-purple-700 to-violet-700/90 shadow-md px-8 flex justify-between items-center border-b border-white/10"
      >
        {/* Logo and Title */}
        <div className="flex items-center gap-6">
          <motion.img
            src="/logo (4).png"
            alt="Logo"
            className="h-[8vh] w-[5vw] object-contain"
            whileHover={{ rotate: 8 }}
            transition={{ type: 'spring', stiffness: 100 }}
          />
          <motion.h1
            className={`text-white font-bold ${
              isScrolled ? 'text-[1.8vw]' : 'text-[2.2vw]'
            } tracking-wider transition-all duration-300`}
          >
            BOOKSOUL
          </motion.h1>
        </div>

        {/* Navigation Links */}
        <div className="flex gap-10 items-center">
          <AnimatedLink to="/" icon={<Home size={18} />} label="Home" delay={0.1} />
          <AnimatedLink to="/about" icon={<Info size={18} />} label="About" delay={0.2} />
          <AnimatedLink to="/contact" icon={<Phone size={18} />} label="Contact" delay={0.3} />


          {user ? (
            <button
              onClick={() => setShowAccountModal(true)}
              className="flex items-center gap-2 text-green-400 font-bold animate-pulse text-[1.2vw] hover:text-green-300 transition duration-300"
            >
              <User size={20} />
              Account
            </button>
          ) : (
           
              <AnimatedLink to="/login" icon={<User size={18} />} label="Account" delay={0.4} />
            
          )}
        </div>
      </motion.nav>

      {/* 🌟 Account Modal */}
      {showAccountModal && (
        <AccountModal
          user={user}
          onClose={() => setShowAccountModal(false)}
          onLogout={handleLogout}
        />
      )}
    </>
  );
}

// Animated link component
function AnimatedLink({ to, icon, label, delay, onClick }) {
  return (
    <Link to={to} onClick={onClick}>
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay, duration: 0.5, ease: 'easeOut' }}
        whileHover={{
          scale: 1.1,
          color: '#facc15',
        }}
        className="flex items-center gap-2 text-white text-[1.15vw] font-medium relative group"
      >
        {icon}
        <span className="relative z-10">{label}</span>
        <motion.span
          className="absolute left-0 -bottom-1 h-[2px] bg-yellow-400 w-0 group-hover:w-full origin-left transition-all duration-300"
        />
      </motion.div>
    </Link>
  );
}


export default Navbar;
