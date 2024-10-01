import React from 'react';
import { motion } from 'framer-motion';
import FeatureCard from './FeatureCard';
import { Link } from 'react-router-dom';

function MainSection() {
  return (
    <motion.main
      className='flex flex-col items-center justify-center mt-10'
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1 }}
    >
      <div className='flex items-center space-x-10'>
        <motion.div
          initial={{ x: -100 }}
          animate={{ x: 0 }}
          transition={{ type: 'spring', stiffness: 60 }}
          className='text-center'
        >
          <h2 className='text-4xl mb-4 text-purple-300'>AI Study Assistant</h2>
          <p className='text-lg max-w-md text-gray-300'>
            Elevate your study experience with personalized AI-powered tools
          </p>
          <motion.button
            whileHover={{ scale: 1.1, boxShadow: "0px 0px 8px rgb(255,255,255)" }}
            className='mt-6 px-6 py-2 bg-purple-600 rounded-full shadow-md text-white hover:bg-black'
          >
            Get Started
          </motion.button>
        </motion.div>
        <motion.div
          initial={{ scale: 0.8 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.6 }}
          className='relative w-56 h-96 bg-blue-500 rounded-xl shadow-lg'
        >
          <motion.div
            className="absolute -inset-1 bg-gradient-to-r from-purple-600 to-blue-400 rounded-xl blur-lg opacity-50"
            animate={{ rotate: [0, 360] }}
            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          />
          {/* Animated digital text */}
          <div className="absolute inset-0 flex items-center justify-center">
            <motion.span
              className="text-2xl font-digital text-white"
              initial={{ opacity: 0 }}
              animate={{ opacity: [0, 1, 0] }}
              transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            >
              <span className="block">Loading...</span>
            </motion.span>
          </div>
        </motion.div>
      </div>

      <motion.div
        className='grid grid-cols-3 gap-6 mt-10'
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
      >
         <Link to="/quiz-generator">
        <FeatureCard title="Quiz Generator" description="Create personalized quizzes for better retention." />
        </Link>
        <FeatureCard title="Study Plans" description="Generate study plans tailored to your needs." />
        
        <FeatureCard title="Progress Tracker" description="Track your study progress and performance." />
      </motion.div>
    </motion.main>
  );
}

export default MainSection;
