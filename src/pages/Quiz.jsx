import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
import NavBar from '../components/Navbar';
import Footer from '../components/Footer';

function QuizGenerator() {
  const [topic, setTopic] = useState('');
  const [questionType, setQuestionType] = useState('');
  const [quiz, setQuiz] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [timeLeft, setTimeLeft] = useState(60);
  const [error, setError] = useState(null);

  const parseQuizData = (data) => {
    const lines = data.split('\n');
    const questions = [];
    let currentQuestion = null;
    
    lines.forEach(line => {
      if (line.startsWith('**')) {
        // New question
        if (currentQuestion) {
          questions.push(currentQuestion);
        }
        currentQuestion = { question: line.replace(/\*\*|[\d]+\. /g, '').trim(), options: [] };
      } else if (line.startsWith('```python')) {
        // Skip code blocks
        while (!line.endsWith('```')) {
          line = lines.shift();
        }
      } else if (line.startsWith('a)') || line.startsWith('b)') || line.startsWith('c)') || line.startsWith('d)')) {
        // Option
        currentQuestion.options.push(line);
      } else if (line.startsWith('**Answer Key:**')) {
        // End of questions
        if (currentQuestion) {
          questions.push(currentQuestion);
        }
      }
    });
    
    return questions;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post('http://localhost:3000/generate-quiz', {
        topic,
        questionType,
      });

      console.log('API response:', response.data);

      const questions = parseQuizData(response.data.questions.join('\n'));
      setQuiz(questions);
      setCurrentQuestionIndex(0);
      setTimeLeft(60); // Start the timer for the first question
      setError(null);
    } catch (err) {
      console.error('Error generating quiz:', err);
      setError('An error occurred while generating the quiz.');
    }
  };

  useEffect(() => {
    let timer;
    if (timeLeft > 0 && quiz.length > 0) {
      timer = setInterval(() => setTimeLeft(t => t - 1), 1000);
    } else if (timeLeft === 0 && quiz.length > 0) {
      // Move to the next question when the time is up
      setCurrentQuestionIndex(prevIndex => (prevIndex + 1) % quiz.length);
      setTimeLeft(60); // Reset timer for the next question
    }

    return () => clearInterval(timer);
  }, [timeLeft, quiz]);

  const currentQuestion = quiz[currentQuestionIndex];

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
          <button
            type='submit'
            className='w-full p-2 bg-purple-600 hover:bg-purple-700 rounded text-white font-bold'
          >
            Generate Quiz
          </button>
        </form>

        {error && <p className='text-red-500 mt-4'>{error}</p>}

        {quiz.length > 0 && currentQuestion && (
          <div className='mt-10'>
            <h3 className='text-2xl font-bold text-purple-300'>
              Question {currentQuestionIndex + 1} / {quiz.length}
            </h3>
            <div className='bg-gray-800 p-4 rounded text-white'>
              <p className='text-xl'>{currentQuestion.question}</p>
              <ul className='list-disc pl-5 mt-2'>
                {currentQuestion.options.map((option, index) => (
                  <li key={index} className='text-lg'>{option}</li>
                ))}
              </ul>
              {/* Optionally show the correct answer */}
              {/* <p className='mt-2 text-lg text-green-300'>Correct Answer: {currentQuestion.correctAnswer}</p> */}
            </div>
            <p className='mt-4 text-lg'>Time left: {timeLeft}s</p>
          </div>
        )}
      </motion.main>
      <Footer />
    </div>
  );
}

export default QuizGenerator;
