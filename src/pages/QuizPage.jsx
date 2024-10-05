import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { motion } from 'framer-motion';
import NavBar from '../components/Navbar';
import Footer from '../components/Footer';
import { useAuth } from '../context/AuthContext'; // Import the Auth context

function QuizPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const { quiz, correctAnswers,topic } = location.state;
  const { isAuthenticated, userId } = useAuth(); // Use authentication context
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState('');
  const [timeLeft, setTimeLeft] = useState(40);
  const [score, setScore] = useState(0);
  const [quizCompleted, setQuizCompleted] = useState(false);
  const [userAnswers, setUserAnswers] = useState(new Array(quiz.length).fill(null));
  useEffect(() => {
    console.log('Component mounted or userId changed:', userId);
  }, [userId]);
 
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
    if (selectedAnswer.trim() === "") {
      console.log("Answer cannot be empty!");
      return; // Prevent submission of empty answers
    }
  
    const updatedUserAnswers = [...userAnswers];
    updatedUserAnswers[currentQuestionIndex] = selectedAnswer;
    setUserAnswers(updatedUserAnswers);
  
    // Existing logic for checking correct answers...
  
    if (currentQuestionIndex < quiz.length - 1) {
      setCurrentQuestionIndex(prevIndex => prevIndex + 1);
      setSelectedAnswer('');
      setTimeLeft(40);
    } else {
      setQuizCompleted(true);
      if (isAuthenticated) {
        submitResults(); // Only submit if authenticated
      }
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
          answers.push(currentQuestion.correctAnswer); // Ensure this is clean
        }
        currentQuestion = {
          question: line.replace(/^.*\.\s*/, '').replace(/\?$/, ''),
          options: [],
          correctAnswer: ''
        };
      } else if (line.startsWith('    ')) {
        const option = line.replace(/^ {4}/, '').replace(/^\d+\)\s*/, '');
        if (option.includes('Answer:')) {
          currentQuestion.correctAnswer = option.split('Answer: ')[1].trim().replace(/\*\*$/, ''); // Remove trailing asterisks
        } else {
          currentQuestion.options.push(option);
        }
      }
    });
  
    if (currentQuestion) {
      questions.push(currentQuestion);
      answers.push(currentQuestion.correctAnswer.replace(/\*\*$/, '')); // Clean the final answer as well
    }
  
    return { questions, answers };
  };
  
  const submitResults = async () => {
    if (!userId || !topic || !userAnswers.length) {
      console.error('Missing required data:', { userId, topic, userAnswers });
      return;
    }
  
    // Initialize score to zero
    let totalScore = 0;
  
    const results = {
      userId,
      topic,
      quizResults: userAnswers.map((answer, index) => {
        const correctAnswer = correctAnswers[index].replace(/\*\*$/, '').trim().toLowerCase(); // Clean and normalize the correct answer
        const userAnswer = answer ? answer.trim().toLowerCase() : ''; // Clean and normalize the user's answer
        
        const isCorrect = userAnswer === correctAnswer; // Compare the cleaned values
  
        if (isCorrect) {
          totalScore += 1; // Increment score if correct
        }
  
        return {
          question: quiz[index].question,
          userAnswer: answer || 'No Answer', // Provide default if no answer
          isCorrect,
        };
      }),
    };
  
    // Log the total score for debugging
    console.log('Total Score:', totalScore);
  
    // Set the final score before submitting the results
    setScore(totalScore); // <-- Update the state here
  
    console.log('Submitting results:', results);
  
    try {
      const response = await axios.post('http://localhost:3000/api/submit-results', results);
      console.log('Response from server:', response.data);
      if (response.status === 201) {
        console.log('Results saved successfully');
      } else {
        console.error('Failed to save results:', response.data);
      }
    } catch (error) {
      console.error('Error saving results:', error.response ? error.response.data : error.message);
    }
  };
  
  
  

  // const submitResults = async () => {
  //   if (!userId || !topic || !userAnswers.length) {
  //     console.error('Missing required data:', { userId, topic, userAnswers });
  //     return;
  //   }
  
  //   const results = {
  //     userId,
  //     topic,
  //     quizResults: userAnswers.map((answer, index) => ({
  //       question: quiz[index].question,
  //       userAnswer: answer,
  //       isCorrect: answer.trim().toLowerCase() === correctAnswers[index].replace(/\*\*$/, '').trim().toLowerCase(),
  //     })),
  //   };
  
  //   console.log('Submitting results:', results);
  
  //   try {
  //     const response = await axios.post('http://localhost:3000/api/submit-results', results);
  //     console.log('Response from server:', response.data);
  //     if (response.status === 201) {
  //       console.log('Results saved successfully');
  //     } else {
  //       console.error('Failed to save results:', response.data);
  //     }
  //   } catch (error) {
  //     console.error('Error saving results:', error.response ? error.response.data : error.message);
  //   }
  // };
  
  
    


  const handleBackToQuizGenerator = () => {
    navigate('/quiz-generator');
  };

  

  const currentQuestion = quiz[currentQuestionIndex];
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
            transition={{ ease: 'linear', duration: 1 }}
            className='h-full bg-green-500'
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
