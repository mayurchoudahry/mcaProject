import React from 'react';
import { motion } from 'framer-motion';

function FeatureCard({ title, description }) {
  return (
    <motion.div
      whileHover={{ scale: 1.05, boxShadow: "0px 0px 8px rgb(0,0,255)" }}
      className='bg-white/10 p-6 rounded-lg shadow-lg hover:bg-white/20 transition-all'
    >
      <h3 className='text-xl'>{title}</h3>
      <p className='mt-2'>{description}</p>
    </motion.div>
  );
}

export default FeatureCard;
