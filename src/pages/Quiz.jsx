import React, { useState } from 'react';
import { motion } from 'framer-motion';
import NavBar from '../components/Navbar';
import Footer from '../components/Footer';

function QuizGenerator() {
  const [topic, setTopic] = useState('');
  const [questionType, setQuestionType] = useState('');
  const [questionFormat, setQuestionFormat] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Quiz Settings:', { topic, questionType, questionFormat });
    // Logic to generate the quiz goes here
  };

  return (
    <div className='h-screen w-screen bg-gradient-to-r from-purple-800 via-black to-blue-900 text-white'>
      <NavBar />
      <motion.main
        className='flex flex-col items-center justify-center p-10'
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
      >
        <h2 className='text-4xl font-bold text-purple-300 mb-10'>Quiz Generator</h2>
        <form onSubmit={handleSubmit} className='bg-white/10 p-6 rounded-lg shadow-lg w-full max-w-md'>
          <div className='mb-4'>
            <label className='block text-lg text-purple-300 mb-2 '>Select a Topic</label>
            <input
              type='text'
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              className='w-full p-2 rounded bg-purple-300 text-black outline-none placeholder-black'
              placeholder='Enter the quiz topic'
              required
            />
          </div>
          <div className='mb-4'>
            <label className='block text-lg text-purple-300 mb-2'>Question Type</label>
            <select
              value={questionType}
              onChange={(e) => setQuestionType(e.target.value)}
              className='w-full p-2 rounded bg-purple-300 text-black outline-none'
              required
            >
              <option value='' disabled>Select question type</option>
              <option value='MCQ'>Multiple Choice Questions (MCQ)</option>
              <option value='Short'>Short Answer</option>
              <option value='OneWord'>One Word</option>
            </select>
          </div>
          <div className='mb-4'>
            <label className='block text-lg text-purple-300 mb-2'>Question Format</label>
            <select
              value={questionFormat}
              onChange={(e) => setQuestionFormat(e.target.value)}
              className='w-full p-2 rounded bg-purple-300 text-black outline-none'
              required
            >
              <option value='' disabled>Select question format</option>
              <option value='Text'>Text</option>
              <option value='Image'>Image</option>
              <option value='Audio'>Audio</option>
            </select>
          </div>
          <button
            type='submit'
            className='w-full p-2 bg-purple-600 hover:bg-purple-700 rounded text-white font-bold'
          >
            Generate Quiz
          </button>
        </form>
      </motion.main>
      <Footer />
    </div>
  );
}

export default QuizGenerator;
