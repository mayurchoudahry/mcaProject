import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import Home from './pages/Home';
import Features from './pages/Features';
import Contact from './pages/Contact';
import About from './pages/About';
import QuizGenerator from './pages/Quiz';
import Login from './pages/Login';
import Register from './pages/Register';
import QuizPage from './pages/QuizPage';
import ProgressTracker from './pages/ProgressTracker';

function App() {
  const { isAuthenticated,loading } = useAuth();
  if (loading) {
    return <div>Loading...</div>; // Render loading state until authentication is resolved
  }

  return (
    <Router>
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/features' element={<Features />} />
        <Route path='/contact' element={<Contact />} />
        <Route path='/about' element={<About />} />
        <Route 
          path="/quiz-generator" 
          element={isAuthenticated ? <QuizGenerator /> : <Navigate to="/login" />} 
        />
        <Route path="/login" element={<Login />} />
        <Route path="/progress" element={isAuthenticated ? <ProgressTracker /> : <Navigate to="/login" />} />
        <Route path="/register" element={<Register />} />
        <Route path="/quiz" element={<QuizPage />} />
      </Routes>
    </Router>
  );
}

export default App;
