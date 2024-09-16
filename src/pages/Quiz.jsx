import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
import NavBar from '../components/Navbar';
import Footer from '../components/Footer';

function QuizGenerator() {
  const [topic, setTopic] = useState('');
  const [questionType, setQuestionType] = useState('');
  const [quiz, setQuiz] = useState([]); // Default to empty array
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState('');
  const [timeLeft, setTimeLeft] = useState(60);
  const [error, setError] = useState(null);
  const [quizCompleted, setQuizCompleted] = useState(false);
  const [score, setScore] = useState(0);
  const [loading, setLoading] = useState(false);
  const [correctAnswers, setCorrectAnswers] = useState([]);
  const [userAnswers, setUserAnswers] = useState([]);

  // Debug: Log API data to see the response
  const parseQuizData = (data) => {
    const questions = [];
    const answers = [];
    let currentQuestion = null;

    data.forEach(line => {
      if (line.startsWith('**')) {
        if (currentQuestion) {
          // Save the previous question
          questions.push(currentQuestion);
          answers.push(currentQuestion.correctAnswer);
        }
        // Start a new question
        currentQuestion = {
          question: line.replace(/^.*\.\s*/, '').replace(/\?$/, ''),
          options: [],
          correctAnswer: ''
        };
      } else if (line.startsWith('    ')) {
        // Option line
        const option = line.replace(/^ {4}/, '').replace(/^\d+\)\s*/, '');
        if (option.includes('Answer:')) {
          currentQuestion.correctAnswer = option.split('Answer: ')[1].trim().replace(')', '');
        } else {
          currentQuestion.options.push(option);
        }
      }
    });

    if (currentQuestion) {
      // Push the last question
      questions.push(currentQuestion);
      answers.push(currentQuestion.correctAnswer);
    }

    return { questions, answers };
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!topic.trim() || !questionType) {
      alert('Please provide both topic and question type.');
      return;
    }

    setLoading(true);
    try {
      const response = await axios.post('http://localhost:3000/generate-quiz', { 
        topic: topic.trim(), 
        questionType 
      });

      // Debug: Check if response structure is correct
      console.log('API response:', response.data);

      if (response.data && response.data.questions) {
        const { questions, answers } = parseQuizData(response.data.questions);
        setQuiz(questions);
        setCorrectAnswers(answers);  // Store correct answers
        setUserAnswers(new Array(questions.length).fill(null));  // Initialize answers array
        setCurrentQuestionIndex(0);
        setTimeLeft(60);
        setError(null);
        setQuizCompleted(false);
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

  const handleAnswerSelection = (option) => {
    setSelectedAnswer(option);
  };

  const handleQuestionSubmit = () => {
    if (!selectedAnswer) {
      alert('Please select an answer before submitting.');
      return;
    }

    const updatedUserAnswers = [...userAnswers];
    updatedUserAnswers[currentQuestionIndex] = selectedAnswer;
    setUserAnswers(updatedUserAnswers);

    if (selectedAnswer.trim().toLowerCase() === correctAnswers[currentQuestionIndex].trim().toLowerCase()) {
      setScore(prevScore => prevScore + 1);
    }
    

    if (currentQuestionIndex < quiz.length - 1) {
      setCurrentQuestionIndex(prevIndex => prevIndex + 1);
      setSelectedAnswer('');
      setTimeLeft(60);
    } else {
      setQuizCompleted(true);
    }
  };

  useEffect(() => {
    let timer;
    if (timeLeft > 0 && quiz.length > 0 && !quizCompleted) {
      timer = setInterval(() => setTimeLeft(t => t - 1), 1000);
    } else if (timeLeft === 0 && quiz.length > 0 && !quizCompleted) {
      handleQuestionSubmit();
    }

    return () => clearInterval(timer);
  }, [timeLeft, quiz, quizCompleted]);

  const currentQuestion = quiz[currentQuestionIndex];

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
            <button
              type='submit'
              className='w-full p-2 bg-purple-600 hover:bg-purple-700 rounded text-white font-bold'
            >
              Generate Quiz
            </button>
          </form>
        )}

        {quiz.length > 0 && currentQuestion && !quizCompleted && (
          <div className='mt-10 max-w-md w-full'>
            <h3 className='text-2xl font-bold text-purple-300'>
              Question {currentQuestionIndex + 1} / {quiz.length}
            </h3>
            <div className='bg-gray-800 p-4 rounded text-white'>
              <p className='text-xl whitespace-pre-wrap'>{currentQuestion.question}</p>
              <ul className='list-disc pl-5 mt-2'>
                {currentQuestion.options.length > 0 ? (
                  currentQuestion.options.map((option, index) => (
                    <li key={index} className='text-lg'>
                      <label>
                        <input
                          type='radio'
                          name={`question-${currentQuestionIndex}`}
                          onChange={() => handleAnswerSelection(option)}
                          checked={selectedAnswer === option}
                          className='mr-2'
                        />
                        {option}
                      </label>
                    </li>
                  ))
                ) : (
                  <p>No options available for this question.</p>
                )}
              </ul>
            </div>
            <p className='mt-4 text-lg'>Time left: {timeLeft}s</p>
            <button
              onClick={handleQuestionSubmit}
              className='mt-4 p-2 bg-purple-600 hover:bg-purple-700 rounded text-white font-bold w-full'
            >
              Submit Answer
            </button>
          </div>
        )}

        {/* Display the quiz results */}
        {quizCompleted && (
          <div className='mt-10'>
            <h3 className='text-3xl font-bold text-purple-300 mb-4'>Quiz Completed!</h3>
            <p className='text-2xl text-green-400'>Your Score: {score} / {quiz.length}</p>
            <div className='mt-8'>
              <h4 className='text-xl font-bold text-purple-300'>Correct Answers:</h4>
              <ul>
                {quiz.map((question, index) => (
                  <li key={index} className='mt-2 text-white'>
                    <strong>Q{index + 1}: </strong>{question.question}
                    <br />
                    <strong>Correct Answer: </strong>{correctAnswers[index]}
                    <br />
                    <strong>Your Answer: </strong>{userAnswers[index] || 'Not Answered'}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}

      </motion.main>
      <Footer />
    </div>
  );
}

export default QuizGenerator;
