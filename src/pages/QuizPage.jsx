import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import NavBar from '../components/Navbar';
import Footer from '../components/Footer';

function QuizPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const { quiz, correctAnswers } = location.state;
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState('');
  const [timeLeft, setTimeLeft] = useState(40);
  const [score, setScore] = useState(0);
  const [quizCompleted, setQuizCompleted] = useState(false);
  const [userAnswers, setUserAnswers] = useState(new Array(quiz.length).fill(null));

  useEffect(() => {
    let timer;
    if (timeLeft > 0 && !quizCompleted) {
      timer = setInterval(() => setTimeLeft(t => t - 1), 1000);
    } else if (timeLeft === 0) {
      handleQuestionSubmit();
    }

    return () => clearInterval(timer);
  }, [timeLeft, quizCompleted]);

  const handleQuestionSubmit = () => {
    if (selectedAnswer) {
      const updatedUserAnswers = [...userAnswers];
      updatedUserAnswers[currentQuestionIndex] = selectedAnswer;
      setUserAnswers(updatedUserAnswers);

      if (selectedAnswer.trim().toLowerCase() === correctAnswers[currentQuestionIndex].trim().toLowerCase()) {
        setScore(prevScore => prevScore + 1);
      }
    }

    if (currentQuestionIndex < quiz.length - 1) {
      setCurrentQuestionIndex(prevIndex => prevIndex + 1);
      setSelectedAnswer('');
      setTimeLeft(40);
    } else {
      setQuizCompleted(true);
    }
  };

  const handleBackToQuizGenerator = () => {
    navigate('/quiz-generator');
  };

  const currentQuestion = quiz[currentQuestionIndex];

  // Calculate the progress bar width as a percentage based on time left
  const progressBarWidth = (timeLeft / 40) * 100;

  return (
    <div className='min-h-screen w-screen bg-gradient-to-r from-purple-800 via-black to-blue-900 text-white flex flex-col'>
      <NavBar />
      <main className='flex flex-col items-center justify-center flex-grow p-10'>

        {/* Progress Bar at the Top */}
        <div className='w-full bg-gray-700 h-4 mb-6'>
          <motion.div
            initial={{ width: '100%' }}
            animate={{ width: `${progressBarWidth}%` }}
            transition={{ ease: 'linear', duration: 1 }} // Smooth transition
            className='h-full bg-green-500'
            style={{ width: `${progressBarWidth}%` }}
          />
        </div>

        {quizCompleted ? (
          <motion.div 
            initial={{ opacity: 0, scale: 0.8 }} 
            animate={{ opacity: 1, scale: 1 }} 
            transition={{ duration: 0.5 }} 
            className='text-center'
          >
            <h3 className='text-4xl font-bold'>Quiz Completed!</h3>
            <p className='text-2xl mt-4'>Your score: {score} / {quiz.length}</p>
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={handleBackToQuizGenerator}
              className='mt-6 p-3 bg-blue-600 rounded hover:bg-blue-500 transition-colors'
            >
              Back to Quiz Generator
            </motion.button>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0, x: -100 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className='max-w-xl w-full bg-gray-900 p-6 rounded-lg shadow-lg'
          >
            <h3 className='text-2xl font-bold mb-4'>Question {currentQuestionIndex + 1} / {quiz.length}</h3>
            <motion.div
              key={currentQuestionIndex}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.4 }}
              className='bg-gray-800 p-5 rounded-lg mb-6'
            >
              <p className='text-xl mb-4'>{currentQuestion.question}</p>
              {currentQuestion.options && currentQuestion.options.length > 0 ? (
                <motion.ul
                  initial="hidden"
                  animate="visible"
                  variants={{
                    hidden: { opacity: 0, x: -50 },
                    visible: { opacity: 1, x: 0, transition: { staggerChildren: 0.1 } }
                  }}
                >
                  {currentQuestion.options.map((option, index) => (
                    <motion.li
                      key={index}
                      whileHover={{ scale: 1.05, backgroundColor: '#4A5568' }}
                      whileTap={{ scale: 0.95 }}
                      className='mb-2 p-4 bg-gray-700 rounded cursor-pointer'
                      onClick={() => setSelectedAnswer(option)} // Make the entire option clickable
                    >
                      <label className='w-full h-full cursor-pointer flex items-center'>
                        <input
                          type='radio'
                          name={`question-${currentQuestionIndex}`}
                          onChange={() => setSelectedAnswer(option)}
                          checked={selectedAnswer === option}
                          className='mr-2'
                        />
                        {option}
                      </label>
                    </motion.li>
                  ))}
                </motion.ul>
              ) : (
                <p className="text-red-500">No options available for this question.</p>
              )}
            </motion.div>

            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={handleQuestionSubmit}
              className='mt-4 p-2 bg-purple-600 rounded hover:bg-purple-500 transition-colors'
            >
              Submit Answer
            </motion.button>
          </motion.div>
        )}
      </main>
      <Footer />
    </div>
  );
}

export default QuizPage;
