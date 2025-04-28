import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const featuresWithImages = [
  {
    label: "Separate cabins with comfortable chair",
    image:
      "data:image/jpeg;base64,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",
  },
  { label: "Free unlimited WiFi", image: "https://cdn.pixabay.com/photo/2024/08/07/16/33/ai-generated-8952546_640.jpg" },
  { label: "Fully air-conditioned hall", image: "https://media.istockphoto.com/id/1217368803/vector/young-man-relaxing-at-couch-under-air-conditioner.jpg?s=612x612&w=0&k=20&c=YhdtVQrEhLT3H_AMc8-RHJWQk4_Sd-CZk3naMG327hI=" },
  { label: "CCTV surveillance", image: "https://plus.unsplash.com/premium_photo-1681487394066-fbc71a037573?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NXx8Y2N0dnxlbnwwfHwwfHx8MA%3D%3D" },
  { label: "Sterilized washroom", image: "https://images.unsplash.com/photo-1734714692048-795ad3b732e7?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTl8fFN0ZXJpbGl6ZWQlMjB3YXNocm9vbXxlbnwwfHwwfHx8MA%3D%3D" },
  { label: "Newspapers and magazines", image: "https://images.unsplash.com/photo-1570382160267-c233b329f78b?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8OHx8TmV3c3BhcGVycyUyMGFuZCUyMG1hZ2F6aW5lc3xlbnwwfHwwfHx8MA%3D%3D" },
  {
    label: "Fresh drinking water & common lunch area",
    image: "https://images.unsplash.com/photo-1727303600988-e5d1b5a2b705?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTR8fEZyZXNoJTIwZHJpbmtpbmclMjB3YXRlciUyMCUyNiUyMGNvbW1vbiUyMGx1bmNoJTIwYXJlYXxlbnwwfHwwfHx8MA%3D%3D",
  },
  { label: "Power backup", image: "https://media.istockphoto.com/id/489801842/photo/backup-generator-for-office-building-%D1%81onnected-to-the-control-panel.webp?a=1&b=1&s=612x612&w=0&k=20&c=2oFQfqMYjgwM3Ea4Nt_YnrKwAPHziNlcGRpjsUINvMU=" },
  { label: "All-day open", image: "https://images.unsplash.com/photo-1692897697062-f868fa2ea749?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Nnx8QWxsJTIwZGF5JTIwb3BlbnxlbnwwfHwwfHx8MA%3D%3D" },
  { label: "Vehicle parking", image: "https://plus.unsplash.com/premium_photo-1661884049104-9d79c968a64c?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8OXx8YmlrZSUyMHBhcmtpbmd8ZW58MHx8MHx8fDA%3D" },
  { label: "Timing: 6 AM to 10 PM", image: "https://images.unsplash.com/photo-1585255688309-22c8c70a27c9?q=80&w=1470&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" },
];

const FeaturesWithHoverImage = () => {
  const [hoveredIndex, setHoveredIndex] = useState(null);

  return (
    <section className="py-24 px-6 md:px-12 bg-gray-100 text-gray-800">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row gap-12 items-start">
        {/* Animated Text Side */}
        <div className="flex-1 space-y-6">
          <motion.h2
            className="text-4xl font-extrabold relative inline-block mb-8"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            Amenities &{" "}
            <span className="text-yellow-500 bg-gradient-to-r from-yellow-400 to-yellow-600 bg-clip-text text-transparent">
              Services
            </span>
            <motion.div
              layoutId="highlight"
              className="absolute left-0 -bottom-1 w-full h-1 bg-yellow-400 rounded-full"
            />
          </motion.h2>

          <motion.ul
            className="space-y-4"
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            variants={{
              hidden: {},
              show: {
                transition: {
                  staggerChildren: 0.1,
                },
              },
            }}
          >
            {featuresWithImages.map((feature, index) => (
              <motion.li
                key={index}
                variants={{
                  hidden: { opacity: 0, x: -30 },
                  show: { opacity: 1, x: 0 },
                }}
                onMouseEnter={() => setHoveredIndex(index)}
                onMouseLeave={() => setHoveredIndex(null)}
                whileHover={{ scale: 1.02 }}
                className={`group p-4 rounded-xl cursor-pointer transition border-2 
                  ${
                    hoveredIndex === index
                      ? "bg-gradient-to-r from-yellow-100 to-yellow-50 border-yellow-400 shadow-md"
                      : "bg-white border-gray-200"
                  }`}
              >
                <div className="flex items-start gap-3 text-lg font-medium text-gray-800">
                  <span className="text-2xl">✨</span>
                  <div className="relative w-full">
                    <span className="group-hover:text-yellow-700 transition duration-200">
                      {feature.label}
                    </span>
                    <div className="absolute left-0 bottom-0 w-0 h-0.5 bg-yellow-400 group-hover:w-full transition-all duration-300 ease-in-out" />
                  </div>
                </div>
              </motion.li>
            ))}
          </motion.ul>
        </div>

        {/* Hover Image Display */}
        <div className="flex-1 hidden md:flex items-center justify-center relative min-h-[300px] top-[40vh]">
          <AnimatePresence mode="wait">
            {hoveredIndex !== null && (
              <motion.img
                key={featuresWithImages[hoveredIndex].image}
                src={featuresWithImages[hoveredIndex].image}
                alt="Feature visual"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.4 }}
                className="w-full max-w-md rounded-xl shadow-2xl object-cover"
              />
            )}
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
};

export default FeaturesWithHoverImage;
