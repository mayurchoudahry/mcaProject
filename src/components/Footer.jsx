import React from 'react';
import { motion } from 'framer-motion';

function Footer() {
  return (
    <motion.footer
      initial={{ y: 100 }}
      animate={{ y: 0 }}
      transition={{ type: 'spring', stiffness: 50 }}
      className='w-full h-12 bg-black/40 flex items-center justify-center mt-auto fixed bottom-0 left-0 z-0'
    >
      <p>© 2024 AI Study Assistant. All rights reserved.</p>
    </motion.footer>
  );
}

export default Footer;
