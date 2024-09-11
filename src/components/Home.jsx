import React from 'react';
import { motion } from 'framer-motion';

function Home() {
  return (
    <div className='h-screen w-screen bg-gradient-to-r from-purple-800 via-black to-blue-900 text-white'>
      {/* Animated Header */}
      <motion.header
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ type: 'spring', stiffness: 50 }}
        className='w-full h-20 bg-black/30 backdrop-blur-lg flex items-center justify-between px-10'
      >
        <motion.h1
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className='text-2xl font-bold text-purple-300'
        >
          AI Study Assistant
        </motion.h1>
        <nav>
          <ul className='flex space-x-4'>
            <li className='hover:text-purple-300 transition-all'>Home</li>
            <li className='hover:text-purple-300 transition-all'>Features</li>
            <li className='hover:text-purple-300 transition-all'>Contact</li>
            <li className='hover:text-purple-300 transition-all'>About</li>
          </ul>
        </nav>
      </motion.header>

      {/* Main Section */}
      <motion.main
        className='flex flex-col items-center justify-center mt-10'
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
      >
        {/* Section with Image/Phone Display */}
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
              className='mt-6 px-6 py-2 bg-purple-600 rounded-full shadow-lg text-white hover:bg-purple-500'
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
            {/* Adding a glowing effect around the phone */}
            <motion.div
              className="absolute -inset-1 bg-gradient-to-r from-purple-600 to-blue-400 rounded-xl blur-lg opacity-50"
              animate={{ rotate: [0, 360] }}
              transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
            />
          </motion.div>
        </div>

        {/* Features Cards with Animations */}
        <motion.div
          className='grid grid-cols-3 gap-6 mt-12'
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          <motion.div
            whileHover={{ scale: 1.05, boxShadow: "0px 0px 8px rgb(0,0,255)" }}
            className='bg-white/10 p-6 rounded-lg shadow-lg hover:bg-white/20 transition-all'
          >
            <h3 className='text-xl'>Quiz Generator</h3>
            <p className='mt-2'>Create personalized quizzes for better retention.</p>
          </motion.div>
          <motion.div
            whileHover={{ scale: 1.05, boxShadow: "0px 0px 8px rgb(0,0,255)" }}
            className='bg-white/10 p-6 rounded-lg shadow-lg hover:bg-white/20 transition-all'
          >
            <h3 className='text-xl'>Study Plans</h3>
            <p className='mt-2'>Generate study plans tailored to your needs.</p>
          </motion.div>
          <motion.div
            whileHover={{ scale: 1.05, boxShadow: "0px 0px 8px rgb(0,0,255)" }}
            className='bg-white/10 p-6 rounded-lg shadow-lg hover:bg-white/20 transition-all'
          >
            <h3 className='text-xl'>Progress Tracker</h3>
            <p className='mt-2'>Track your study progress and performance.</p>
          </motion.div>
        </motion.div>
      </motion.main>

      {/* Footer */}
      <motion.footer
        initial={{ y: 100 }}
        animate={{ y: 0 }}
        transition={{ type: 'spring', stiffness: 50 }}
        className='w-full h-20 bg-black/30 flex items-center justify-center mt-auto'
      >
        <p>© 2024 AI Study Assistant. All rights reserved.</p>
      </motion.footer>
    </div>
  );
}

export default Home;
