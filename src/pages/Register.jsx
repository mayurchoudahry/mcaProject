import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { motion } from 'framer-motion';
import NavBar from '../components/Navbar';
import Footer from '../components/Footer';

function Register() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    console.log({ email, password }); // Log data being sent
    try {
      const response = await axios.post('http://localhost:3000/api/register', { email, password });
      console.log('Backend Response:', response.data); // Log the full response
      
      if (response.data.success) {
        navigate('/login');
      } else {
        setError(response.data.message || 'Registration failed');
      }
    } catch (err) {
      console.error('Error during registration:', err.response?.data || err.message);
      setError(err.response?.data?.message || 'An error occurred during registration');
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
        <h2 className='text-4xl font-bold text-purple-300 mb-10'>Register</h2>
        <motion.form
          className='bg-white/10 p-6 rounded-lg shadow-lg w-full max-w-md'
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          onSubmit={handleRegister}
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
            Register
          </button>
          <p className='mt-4'>
            Already have an account? <a href='/login' className='text-purple-300'>Login</a>
          </p>
        </motion.form>
      </motion.main>
      <Footer />
    </div>
  );
}

export default Register;
