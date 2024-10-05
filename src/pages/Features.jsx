import React from 'react';
import { motion } from 'framer-motion';
import NavBar from '../components/Navbar';
import Footer from '../components/Footer';
import { Link } from 'react-router-dom';

function Features() {
  return (
    <div className='h-screen w-screen bg-gradient-to-r from-purple-800 via-black to-blue-900 text-white'>
      <NavBar />
      <motion.main
        className='flex flex-col items-center justify-center p-10'
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
      >
        <h2 className='text-4xl font-bold text-purple-300 mb-10'>Features</h2>
        <motion.div
          className='grid grid-cols-2 gap-10'
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          <motion.div
            whileHover={{ scale: 1.05, boxShadow: "0px 0px 10px rgb(0,0,255)" }}
            className='bg-white/10 p-6 rounded-lg shadow-lg hover:bg-white/20 transition-all'
          >
            <Link to="/quiz-generator">
    <h3 className='text-2xl'>Quiz Generator</h3>
    <p className='mt-2 text-gray-300'>Generate AI-powered quizzes to enhance your learning experience.</p>
  </Link>
          </motion.div>
          <motion.div
            whileHover={{ scale: 1.05, boxShadow: "0px 0px 10px rgb(0,0,255)" }}
            className='bg-white/10 p-6 rounded-lg shadow-lg hover:bg-white/20 transition-all'
          >
            <h3 className='text-2xl'>Study Plan</h3>
            <p className='mt-2 text-gray-300'>Personalized study plans designed by AI to optimize your schedule.</p>
          </motion.div>
          <motion.div
            whileHover={{ scale: 1.05, boxShadow: "0px 0px 10px rgb(0,0,255)" }}
            className='bg-white/10 p-6 rounded-lg shadow-lg hover:bg-white/20 transition-all'
          >
            <h3 className='text-2xl'>Notes Summarizer</h3>
            <p className='mt-2 text-gray-300'>Automatically summarize lengthy notes for quick review.</p>
          </motion.div>
          <motion.div
            whileHover={{ scale: 1.05, boxShadow: "0px 0px 10px rgb(0,0,255)" }}
            className='bg-white/10 p-6 rounded-lg shadow-lg hover:bg-white/20 transition-all'
          >  <Link to="/progress">
            <h3 className='text-2xl'>Progress Tracker</h3>
            <p className='mt-2 text-gray-300'>Monitor and analyze your academic progress with insightful data.</p>
            </Link>
          </motion.div>
        </motion.div>
      </motion.main>
      <Footer />
    </div>
  );
}

export default Features;
