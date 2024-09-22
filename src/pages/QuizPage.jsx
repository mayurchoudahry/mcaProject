import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import NavBar from '../components/Navbar';
import Footer from '../components/Footer';

function QuizPage() {
  const location = useLocation();
  const { quiz, correctAnswers } = location.state; // Get quiz and answers passed from QuizGenerator
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

  const currentQuestion = quiz[currentQuestionIndex];

  return (
    <div className='min-h-screen w-screen bg-gradient-to-r from-purple-800 via-black to-blue-900 text-white flex flex-col'>
      <NavBar />
      <main className='flex flex-col items-center justify-center flex-grow p-10'>
        {quizCompleted ? (
          <div className='text-center'>
            <h3 className='text-4xl font-bold'>Quiz Completed!</h3>
            <p className='text-2xl'>Your score: {score} / {quiz.length}</p>
          </div>
        ) : (
          <div className='max-w-md w-full'>
            <h3 className='text-2xl font-bold'>Question {currentQuestionIndex + 1} / {quiz.length}</h3>
            <div className='bg-gray-800 p-4 rounded'>
              <p className='text-xl'>{currentQuestion.question}</p>
              <ul>
                {currentQuestion.options.map((option, index) => (
                  <li key={index}>
                    <label>
                      <input
                        type='radio'
                        name={`question-${currentQuestionIndex}`}
                        onChange={() => setSelectedAnswer(option)}
                        checked={selectedAnswer === option}
                      />
                      {option}
                    </label>
                  </li>
                ))}
              </ul>
            </div>
            <p>Time left: {timeLeft}s</p>
            <button onClick={handleQuestionSubmit} className='mt-4 p-2 bg-purple-600'>Submit Answer</button>
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
}

export default QuizPage;
