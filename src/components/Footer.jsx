import React from 'react';
import { motion } from 'framer-motion';

function Footer() {
  return (
    <motion.footer
      initial={{ y: 100 }}
      animate={{ y: 0 }}
      transition={{ type: 'spring', stiffness: 50 }}
      className='w-full h-20 bg-black/30 flex items-center justify-center mt-auto'
    >
      <p>© 2024 AI Study Assistant. All rights reserved.</p>
    </motion.footer>
  );
}

export default Footer;
