import React from 'react'
import './App.css'
import Home from './Components/Home'
import AboutSection from './Components/AboutSection'
import Navbar from './Components/Navbar'
import HomeContent from './Components/HomeContent' 
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'; 
import ContactUs from './Components/ContactUs'
import AuthForm from './Components/AuthForm'
import { Toaster } from 'react-hot-toast';
import { motion } from 'framer-motion';

function App() {
  

  return (
    <>
      
      <Toaster
        position="top-center"
        reverseOrder={false}
        toastOptions={{
          duration: 4000, // how long toast stays
          style: {
            background: 'rgba(17, 24, 39, 0.8)', // more darker glassy
            color: '#f9fafb', // almost white
            backdropFilter: 'blur(12px)',
            border: '1px solid rgba(255,255,255,0.2)',
            boxShadow: '0 8px 32px rgba(0,0,0,0.4)',
            borderRadius: '16px',
            padding: '16px 24px',
          },
          success: {
            style: {
              background: 'rgba(34, 197, 94, 0.8)', // green glass for success
              color: 'white',
            },
            iconTheme: {
              primary: '#22c55e',
              secondary: '#166534',
            },
          },
          error: {
            style: {
              background: 'rgba(239, 68, 68, 0.8)', // red glass for error
              color: 'white',
            },
            iconTheme: {
              primary: '#ef4444',
              secondary: '#7f1d1d',
            },
          },
        }}
      />
      <Router>
      <Routes>
        <Route path="/" element={<Home/>} />
        <Route path="/about" element={<AboutSection />} />
        <Route path="/contact" element={<ContactUs />} />
        <Route path="/login" element={<AuthForm/>} />
        
        
      </Routes>
    </Router>
    </>
  )
}

export default App
