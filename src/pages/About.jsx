import React from 'react';
import { motion } from 'framer-motion';
import NavBar from '../components/Navbar';
import Footer from '../components/Footer';

function About() {
  return (
    <div className='h-screen w-screen bg-gradient-to-r from-purple-800 via-black to-blue-900 text-white'>
      <NavBar />
      <motion.main
        className='flex flex-col items-center justify-center p-10'
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
      >
        <h2 className='text-4xl font-bold text-purple-300 mb-10'>About AI Study Assistant</h2>
        <motion.div
          className='bg-white/10 p-6 rounded-lg shadow-lg max-w-3xl'
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <p className='text-lg text-gray-300'>
            AI Study Assistant is a revolutionary platform designed to enhance the learning experience for students.
            Our mission is to provide AI-driven tools that simplify and personalize the process of studying,
            making it easier to achieve academic success. With features like quiz generation, progress tracking,
            and study planning, AI Study Assistant empowers students to learn smarter, not harder.
          </p>
        </motion.div>
      </motion.main>
      <Footer />
    </div>
  );
}

export default About;
