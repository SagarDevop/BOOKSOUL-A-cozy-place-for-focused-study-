import React from 'react';
import { motion } from 'framer-motion';
import {
  BookOpenIcon,
  ClockIcon,
  ArrowTrendingUpIcon,
} from '@heroicons/react/24/outline';

const features = [
  {
    icon: <BookOpenIcon className="w-10 h-10 text-purple-500 group-hover:animate-bounce" />,
    title: 'Study Resources',
    desc: 'Access curated notes, guides, and flashcards.',
    delay: 0,
  },
  {
    icon: <ClockIcon className="w-10 h-10 text-pink-500 group-hover:animate-bounce" />,
    title: 'Smart Timers',
    desc: 'Use Pomodoro and deep focus tools to stay on track.',
    delay: 0.2,
  },
  {
    icon: <ArrowTrendingUpIcon className="w-10 h-10 text-blue-500 group-hover:animate-bounce" />,
    title: 'Progress Stats',
    desc: 'Visualize your learning streak and milestones.',
    delay: 0.4,
  },
];

function Page2() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-200 via-pink-100 to-blue-200 flex flex-col items-center justify-center p-10">
      <motion.h1
        initial={{ opacity: 0, y: -30 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, ease: 'easeOut' }}
        viewport={{ once: true }}
        className="text-5xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-pink-600 drop-shadow-lg mb-14"
      >
        Welcome to Your Chitrakoot Digital Library
      </motion.h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl w-full">
        {features.map((feature, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: feature.delay, duration: 0.8, ease: 'easeOut' }}
            viewport={{ once: true }}
            whileHover={{ scale: 1.05 }}
            className="group bg-white/30 backdrop-blur-xl p-6 rounded-3xl shadow-lg hover:shadow-pink-400/40 transition-all duration-300 border border-white/40 hover:border-pink-300"
          >
            <div className="mb-4">{feature.icon}</div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2 group-hover:text-pink-600 transition-colors duration-300">
              {feature.title}
            </h2>
            <p className="text-gray-600">{feature.desc}</p>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

export default Page2;
