import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import NavBar from '../components/Navbar';
import Footer from '../components/Footer';

function QuizGenerator() {
  const [topic, setTopic] = useState('');
  const [questionType, setQuestionType] = useState('');
  const [questionLevel, setQuestionLevel] = useState(''); // New state for difficulty level
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!topic.trim() || !questionType || !questionLevel) {
      alert('Please provide topic, question type, and difficulty.');
      return;
    }

    setLoading(true);
    try {
      const response = await axios.post('http://localhost:3000/api/generate-quiz', { 
        topic: topic.trim(), 
        questionType,
        questionLevel 
      });

      if (response.data && response.data.questions) {
        const { questions, answers } = parseQuizData(response.data.questions);
        
        // Redirect to Quiz Page using navigate
        navigate('/quiz', { state: { quiz: questions, correctAnswers: answers } });
      } else {
        setError('Invalid API response.');
      }
    } catch (err) {
      console.error(err);
      setError('An error occurred while generating the quiz.');
    } finally {
      setLoading(false);
    }
  };

  const parseQuizData = (data) => {
    const questions = [];
    const answers = [];
    let currentQuestion = null;

    data.forEach(line => {
      if (line.startsWith('**')) {
        if (currentQuestion) {
          questions.push(currentQuestion);
          answers.push(currentQuestion.correctAnswer);
        }
        currentQuestion = {
          question: line.replace(/^.*\.\s*/, '').replace(/\?$/, ''),
          options: [],
          correctAnswer: ''
        };
      } else if (line.startsWith('    ')) {
        const option = line.replace(/^ {4}/, '').replace(/^\d+\)\s*/, '');
        if (option.includes('Answer:')) {
          currentQuestion.correctAnswer = option.split('Answer: ')[1].trim().replace(')', '');
        } else {
          currentQuestion.options.push(option);
        }
      }
    });

    if (currentQuestion) {
      questions.push(currentQuestion);
      answers.push(currentQuestion.correctAnswer);
    }

    return { questions, answers };
  };

  return (
    <div className='min-h-screen w-screen bg-gradient-to-r from-purple-800 via-black to-blue-900 text-white flex flex-col'>
      <NavBar />
      <motion.main
        className='flex flex-col items-center justify-center flex-grow p-10'
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
      >
        <h2 className='text-4xl font-bold text-purple-300 mb-10'>Quiz Generator</h2>

        {loading ? (
          <div className="flex items-center justify-center mt-4">
            <div className="w-12 h-12 border-4 border-purple-600 border-t-transparent rounded-full animate-spin"></div>
            <p className="ml-4 text-2xl text-purple-300">Generating quiz...</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className='bg-white/10 p-6 rounded-lg shadow-lg w-full max-w-md'>
            <div className='mb-4'>
              <label className='block text-lg text-purple-300 mb-2'>Select a Topic</label>
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
                <option value='Short Answer'>Short Answer</option>
                <option value='One Word'>One Word</option>
              </select>
            </div>

            <div className='mb-4'>
              <label className='block text-lg text-purple-300 mb-2'>Select Difficulty</label>
              <select
                value={questionLevel}
                onChange={(e) => setQuestionLevel(e.target.value)}
                className='w-full p-2 rounded bg-purple-300 text-black outline-none'
                required
              >
                <option value='' disabled>Select difficulty</option>
                <option value='easy'>Easy</option>
                <option value='medium'>Medium</option>
                <option value='hard'>Hard</option>
              </select>
            </div>

            <button
              type='submit'
              className='w-full p-2 bg-purple-600 hover:bg-purple-700 rounded text-white font-bold'
            >
              Generate Quiz
            </button>
          </form>
        )}

        {error && <p className='text-red-500 mt-4'>{error}</p>}
      </motion.main>
      <Footer />
    </div>
  );
}

export default QuizGenerator;
