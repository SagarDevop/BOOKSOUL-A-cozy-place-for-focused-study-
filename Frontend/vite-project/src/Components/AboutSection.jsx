import React from 'react';
import { motion } from 'framer-motion';
import FeaturesWithHoverImage from './FeaturesWithHoverImage';



const features = [
  {
    icon: '📚',
    title: 'Quiet & Focused Environment',
    text: 'Our space is designed to reduce distractions and maximize productivity.',
  },
  {
    icon: '⚡',
    title: 'Fast Wi-Fi & Amenities',
    text: 'Seamless internet, clean washrooms, AC, and snack options.',
  },
  {
    icon: '🌟',
    title: 'Community & Vibes',
    text: 'Be surrounded by like-minded learners and build lasting friendships.',
  },
];

const steps = [
  {
    icon: '📝',
    title: '1. Choose Your Plan',
    text: 'Select hourly, daily, or monthly access that fits your schedule.',
  },
  {
    icon: '📍',
    title: '2. Reserve Your Spot',
    text: 'Book online or drop in. No hassle, no waiting.',
  },
  {
    icon: '💺',
    title: '3. Study Comfortably',
    text: 'Show up and focus — everything’s ready for your productivity.',
  },
];

const AboutSection = () => {
  return (
    
    <>
    
    <section
      id="about"
      className="bg-white text-gray-800 py-24 px-6 md:px-12 relative overflow-hidden"
    >
      {/* Ambient Glow Behind Title */}
      <div className="absolute top-0 left-1/2 w-96 h-96 bg-yellow-300 opacity-20 blur-3xl rounded-full -translate-x-1/2 -translate-y-1/2 pointer-events-none z-0" />

      <div className="relative z-10 max-w-6xl mx-auto text-center">
        {/* Section Heading */}
        <motion.h2
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          viewport={{ once: true }}
          className="text-4xl md:text-5xl font-extrabold mb-16"
        >
          Why Choose <span className="text-yellow-500">BOOKSOUL</span>?
        </motion.h2>

        {/* Feature Cards */}
        <div className="grid md:grid-cols-3 gap-10 mb-20">
          {features.map((item, i) => (
            <motion.div
              key={i}
              className="bg-gray-100 p-8 rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: i * 0.2 }}
              viewport={{ once: true }}
            >
              <div className="text-5xl mb-4">{item.icon}</div>
              <h3 className="text-xl font-semibold mb-3">{item.title}</h3>
              <p className="text-gray-600">{item.text}</p>
            </motion.div>
          ))}
        </div>

        <FeaturesWithHoverImage/>

        {/* How It Works Section */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="mb-20 mt-4"
        >
          <h3 className="text-3xl font-bold mb-10">
            How It Works
          </h3>
          <div className="grid md:grid-cols-3 gap-8 text-left">
            {steps.map((step, i) => (
              <motion.div
                key={i}
                className="bg-yellow-50 p-6 rounded-xl shadow hover:shadow-md transition"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: i * 0.2 }}
                viewport={{ once: true }}
              >
                <div className="text-4xl mb-3">{step.icon}</div>
                <h4 className="text-lg font-semibold mb-2">{step.title}</h4>
                <p className="text-gray-700">{step.text}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Testimonial */}
        <motion.div
          className="bg-gray-100 p-10 rounded-2xl shadow-lg max-w-3xl mx-auto"
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <p className="text-lg italic text-gray-700 mb-4">
            “BOOKSOUL is my go-to spot during exams. Super calm, good coffee, and great Wi-Fi. I actually look forward to studying now.”
          </p>
          <p className="text-right text-gray-600 font-semibold">—Shiv , Engineering Student</p>
        </motion.div>
      </div>
    </section>
    
    
    </>
  );
};

export default AboutSection;
