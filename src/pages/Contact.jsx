import React from 'react';
import { motion } from 'framer-motion';
import NavBar from '../components/Navbar';
import Footer from '../components/Footer';

function Contact() {
  return (
    <div className='h-screen w-screen bg-gradient-to-r from-purple-800 via-black to-blue-900 text-white'>
      <NavBar />
      <motion.main
        className='flex flex-col items-center justify-center p-10'
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
      >
        <h2 className='text-4xl font-bold text-purple-300 mb-10'>Contact Us</h2>
        <motion.form
          className='bg-white/10 p-6 rounded-lg shadow-lg w-full max-w-md'
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <div className='mb-4'>
            <label className='block text-lg text-gray-300 mb-2'>Name</label>
            <input
              type='text'
              className='w-full p-2 rounded-lg bg-gray-800 text-white'
              placeholder='Your name'
            />
          </div>
          <div className='mb-4'>
            <label className='block text-lg text-gray-300 mb-2'>Email</label>
            <input
              type='email'
              className='w-full p-2 rounded-lg bg-gray-800 text-white'
              placeholder='Your email'
            />
          </div>
          <div className='mb-4'>
            <label className='block text-lg text-gray-300 mb-2'>Message</label>
            <textarea
              className='w-full p-2 rounded-lg bg-gray-800 text-white'
              placeholder='Your message'
              rows={4}
            ></textarea>
          </div>
          <motion.button
            whileHover={{ scale: 1.05 }}
            className='bg-purple-600 text-white py-2 px-4 rounded-lg'
          >
            Send Message
          </motion.button>
        </motion.form>
      </motion.main>
      <Footer />
    </div>
  );
}

export default Contact;
