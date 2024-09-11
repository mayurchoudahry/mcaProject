import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { NavLink } from 'react-router-dom';
import { HiOutlineMenu, HiX } from 'react-icons/hi';

function NavBar() {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => setIsOpen(!isOpen);

  return (
    <motion.header
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ type: 'spring', stiffness: 50 }}
      className='w-full h-20 bg-black/30 backdrop-blur-lg flex items-center justify-between px-10'
    >
      {/* Logo */}
      <motion.h1
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        className='text-2xl font-bold text-purple-300'
      >
        AI Study Assistant
      </motion.h1>

      {/* Menu Icon for Mobile View */}
      <div className='lg:hidden'>
        <button onClick={toggleMenu} className='text-purple-300 text-3xl focus:outline-none'>
          {isOpen ? <HiX /> : <HiOutlineMenu />}
        </button>
      </div>

      {/* Links for Larger Screens */}
      <nav className='hidden lg:flex'>
        <ul className='flex space-x-6'>
          {['Home', 'Features', 'Contact', 'About'].map((link, idx) => (
            <motion.li
              key={idx}
              whileHover={{ scale: 1.1 }}
              className='hover:text-purple-300 transition-all'
            >
              <NavLink
                to={`/${link.toLowerCase()}`}
                className={({ isActive }) =>
                  isActive ? 'text-purple-300' : 'text-white'
                }
              >
                {link}
              </NavLink>
            </motion.li>
          ))}
        </ul>
      </nav>

      {/* Dropdown Menu for Mobile */}
      {isOpen && (
        <motion.nav
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className='lg:hidden absolute top-20 left-0 w-full bg-black/80 p-6 backdrop-blur-lg'
        >
          <ul className='flex flex-col items-center space-y-4'>
            {['Home', 'Features', 'Contact', 'About'].map((link, idx) => (
              <motion.li
                key={idx}
                whileHover={{ scale: 1.1 }}
                className='hover:text-purple-300 transition-all'
              >
                <NavLink
                  to={`/${link.toLowerCase()}`}
                  onClick={toggleMenu}
                  className={({ isActive }) =>
                    isActive ? 'text-purple-300' : 'text-white'
                  }
                >
                  {link}
                </NavLink>
              </motion.li>
            ))}
          </ul>
        </motion.nav>
      )}
    </motion.header>
  );
}

export default NavBar;
