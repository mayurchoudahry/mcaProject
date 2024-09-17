import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { motion } from 'framer-motion';
import NavBar from '../components/Navbar';
import Footer from '../components/Footer';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:3000/api/login', { email, password });
      if (response.data.success) {
        // Handle successful login (e.g., save token, redirect)
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('userEmail', response.data.user.email);
        navigate('/');
      } else {
        setError('Invalid email or password');
      }
    } catch (err) {
      setError('An error occurred during login');
    }
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
        <h2 className='text-4xl font-bold text-purple-300 mb-10'>Login</h2>
        <motion.form
          className='bg-white/10 p-6 rounded-lg shadow-lg w-full max-w-md'
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          onSubmit={handleLogin}
        >
          <div className='mb-4'>
            <label className='block text-lg text-gray-300 mb-2'>Email</label>
            <input
              type='email'
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className='w-full p-2 rounded-lg bg-gray-800 text-white'
              placeholder='Your email'
              required
            />
          </div>
          <div className='mb-4'>
            <label className='block text-lg text-gray-300 mb-2'>Password</label>
            <input
              type='password'
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className='w-full p-2 rounded-lg bg-gray-800 text-white'
              placeholder='Your password'
              required
            />
          </div>
          {error && <p className='text-red-500'>{error}</p>}
          <button
            type='submit'
            className='bg-purple-600 text-white py-2 px-4 rounded-lg'
          >
            Login
          </button>
          <p className='mt-4'>
            Don't have an account? <a href='/register' className='text-purple-300'>Register</a>
          </p>
        </motion.form>
      </motion.main>
      <Footer />
    </div>
  );
}

export default Login;
