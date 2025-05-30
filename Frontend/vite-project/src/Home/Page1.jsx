import React from 'react';
import { motion } from 'framer-motion';
import { FaLocationDot } from "react-icons/fa6";
import { Link } from 'react-router-dom';

const Page1 = () => {
  return (
    <section id="home" className="relative h-screen overflow-hidden">
      {/* Video Background */}
      <video
        autoPlay
        loop
        muted
        playsInline
        className="absolute inset-0 w-full h-full object-cover z-0"
      >
        <source src="https://cdn.pixabay.com/video/2023/10/15/185096-874643413_large.mp4" type="video/mp4" />
        Your browser does not support the video tag.
      </video>

      {/* Overlay */}
      <div className="absolute inset-0 bg-black/60 z-10" />

      {/* Content */}
      <div className="relative z-20 h-full flex items-center justify-center px-6 md:px-12">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center gap-12 text-white">

          {/* Text Content */}
          <motion.div
            className="flex-1 space-y-6 text-center md:text-left"
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <h1 className="text-4xl md:text-5xl font-extrabold leading-tight">
              Discover Your <span className="text-yellow-400">Ideal Study Spot</span>
            </h1>
            <p className="text-lg text-gray-300 max-w-xl mx-auto md:mx-0">
              Welcome to <span className="text-blue-400 font-semibold">BOOKSOUL</span> — a peaceful co-learning space
              where students thrive. Enjoy dedicated desks, high-speed Wi-Fi,
              fully air-conditioned comfort, and a positive learning vibe.
            </p>
            <h1 className='flex items-center gap-2 text-4xl md:text-5xl font-extrabold leading-tight'>
              <p>Location</p>
              <FaLocationDot />
            </h1>
            <p className='text-lg text-gray-300 max-w-xl mx-auto md:mx-0'>
              Ganga Vatika, Arogyadham <br />
              Main Road, Chitrakoot M.P. <br />
            </p>

            <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}>
              <Link
                to="/about"
                className="inline-block bg-yellow-500 hover:bg-yellow-600 text-black font-semibold py-3 px-6 rounded-xl transition duration-300"
              >
                Learn More
              </Link>
            </motion.div>
          </motion.div>

        </div>
      </div>
    </section>
  );
};

export default Page1;
