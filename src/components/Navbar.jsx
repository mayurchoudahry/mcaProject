import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

function NavBar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // Retrieve user email from localStorage
  const userEmail = localStorage.getItem('userEmail');

  const handleMenuToggle = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userEmail');
    localStorage.removeItem('userId');
    window.location.href = '/login'; // Redirect to login page
  };

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ type: 'spring', stiffness: 50 }}
      className='bg-gray-900 text-white p-4'
    >
      <div className='flex items-center justify-between'>
        <Link to='/' className='text-2xl font-bold'>
          AI Study Assistant
        </Link>
        <div className='flex items-center space-x-4'>
          <Link to='/about' className='hover:text-purple-300'>About</Link>
          <Link to='/features' className='hover:text-purple-300'>Features</Link>
          <Link to='/contact' className='hover:text-purple-300'>Contact</Link>
          <Link to='/quiz-generator' className='hover:text-purple-300'>Quiz Generator</Link>
          <div className='relative'>
            <button
              onClick={handleMenuToggle}
              className='flex items-center'
            >
              <i className="fa-solid fa-user text-xl"></i>
            </button>
            {isMenuOpen && (
              <div className='absolute right-0 bg-gray-800 text-white mt-2 py-2 px-4 rounded shadow-lg'>
                {userEmail ? (
                  <div>
                    <p className='mb-2'>Logged in as: {userEmail}</p>
                    <button
                      onClick={handleLogout}
                      className='text-red-500'
                    >
                      Logout
                    </button>
                  </div>
                ) : (
                  <Link to='/login' className='block mb-2'>Login</Link>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </motion.nav>
  );
}

export default NavBar;
