import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
import NavBar from '../components/Navbar';
import Footer from '../components/Footer';

function QuizGenerator() {
  const [topic, setTopic] = useState('');
  const [questionType, setQuestionType] = useState('');
  const [questionLevel, setQuestionLevel] = useState('');
  const [quiz, setQuiz] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [correctAnswers, setCorrectAnswers] = useState([]);
  const [timeLeft, setTimeLeft] = useState(60);
  const [error, setError] = useState(null);
  const [quizCompleted, setQuizCompleted] = useState(false);
  const [score, setScore] = useState(0);
  const [loading, setLoading] = useState(false); // Add loading state

  const parseQuizData = (data) => {
    const lines = data.split('\n');
    const questions = [];
    let currentQuestion = null;
    let answers = [];

    lines.forEach(line => {
      if (line.startsWith('**')) {
        if (currentQuestion) {
          questions.push(currentQuestion);
        }
        currentQuestion = { question: line.replace(/\*\*|[\d]+\. /g, '').trim(), options: [] };
      } else if (line.startsWith('a)') || line.startsWith('b)') || line.startsWith('c)') || line.startsWith('d)')) {
        currentQuestion.options.push(line);
      } else if (line.startsWith('**Answer Key:**')) {
        answers = line.replace('**Answer Key:**', '').trim().split(', ');
      }
    });

    if (currentQuestion) {
      questions.push(currentQuestion);
    }

    setCorrectAnswers(answers);  // Store the correct answers
    return questions;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true); // Set loading to true when starting quiz generation
    try {
      const response = await axios.post('http://localhost:3000/generate-quiz', { topic, questionType,questionLevel });
      const questions = parseQuizData(response.data.questions.join('\n'));
      setQuiz(questions);
      setCurrentQuestionIndex(0);
      setTimeLeft(60);
      setError(null);
      setQuizCompleted(false);  // Reset quiz completion state
    } catch (err) {
      setError('An error occurred while generating the quiz.');
    } finally {
      setLoading(false); // Set loading to false when quiz generation is done
    }
  };

  const handleAnswerSelection = (option) => {
    setSelectedAnswer(option); // Set the selected answer for the current question
  };

  const handleQuestionSubmit = () => {
    const correctAnswer = correctAnswers[currentQuestionIndex];
    if (selectedAnswer === correctAnswer) {
      setScore(prevScore => prevScore + 1);
    }

    // Move to the next question or complete the quiz
    if (currentQuestionIndex < quiz.length - 1) {
      setCurrentQuestionIndex(prevIndex => prevIndex + 1);
      setSelectedAnswer(null); // Reset the selected answer for the next question
      setTimeLeft(60); // Reset the timer for the next question
    } else {
      setQuizCompleted(true); // Mark quiz as completed
    }
  };

  const handleNextQuestion = () => {
    if (currentQuestionIndex < quiz.length - 1) {
      setCurrentQuestionIndex(prevIndex => prevIndex + 1);
      setTimeLeft(60);
    } else {
      setQuizCompleted(true);
    }
  };

  useEffect(() => {
    let timer;
    if (timeLeft > 0 && quiz.length > 0) {
      timer = setInterval(() => setTimeLeft(t => t - 1), 1000);
    } else if (timeLeft === 0 && quiz.length > 0) {
      handleQuestionSubmit(); // Automatically submit when time runs out
    }

    return () => clearInterval(timer);
  }, [timeLeft, quiz, selectedAnswer]);

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
        
        {loading ? ( // Show loader while loading
          <div className="flex items-center justify-center mt-4">
            <div className="w-12 h-12 border-4 border-purple-600 border-t-transparent rounded-full animate-spin"></div>
            <p className="ml-4 text-2xl text-purple-300">Generating quiz...</p>
          </div>
        ) : !quizCompleted && (
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

            
             {/* this is level of question */}
              <div className='mb-4'>
              <label className='block text-lg text-purple-300 mb-2'>Question Level</label>
              <select
                value={questionLevel}
                onChange={(e) => setQuestionLevel(e.target.value)}
                className='w-full p-2 rounded bg-purple-300 text-black outline-none'
                required
              >
                <option value='' disabled>Select question Level</option>
                <option value='beginner'>Beginner</option>
                <option value='intermediate'>Intermediate </option>
                <option value='advance'>Advance</option>
              </select>
            </div>  
            
            {/* this is end of level of qestion */}
            <button
              type='submit'
              className='w-full p-2 bg-purple-600 hover:bg-purple-700 rounded text-white font-bold'
            >
              Generate Quiz
            </button>
          </form>
        )}

        {quiz.length > 0 && currentQuestion && !quizCompleted && (
          <div className='mt-10'>
            <h3 className='text-2xl font-bold text-purple-300'>
              Question {currentQuestionIndex + 1} / {quiz.length}
            </h3>
            <div className='bg-gray-800 p-4 rounded text-white'>
              <p className='text-xl'>{currentQuestion.question}</p>
              <ul className='list-disc pl-5 mt-2'>
                {currentQuestion.options.map((option, index) => (
                  <li key={index} className='text-lg'>
                    <label>
                      <input
                        type='radio'
                        name={`question-${currentQuestionIndex}`}
                        onChange={() => handleAnswerSelection(option)}
                        checked={selectedAnswer === option} // Display the selected option
                        className='mr-2'
                      />
                      {option}
                    </label>
                  </li>
                ))}
              </ul>
            </div>
            <p className='mt-4 text-lg'>Time left: {timeLeft}s</p>
            <button
              onClick={handleQuestionSubmit}
              className='mt-4 p-2 bg-purple-600 hover:bg-purple-700 rounded text-white font-bold'
            >
              Submit Answer
            </button>
          </div>
        )}

        {quizCompleted && (
          <div className='mt-10'>
            <h3 className='text-3xl font-bold text-purple-300 mb-4'>Quiz Completed!</h3>
            <p className='text-2xl text-green-400'>Your Score: {score} / {quiz.length}</p>
          </div>
        )}
      </motion.main>
      <Footer />
    </div>
  );
}

export default QuizGenerator;
