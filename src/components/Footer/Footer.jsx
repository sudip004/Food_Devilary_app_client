import React from 'react'
import './Footer.css'
import { motion } from 'framer-motion'

const Footer = () => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5 },
    },
  };

  return (
    <motion.div 
      className='footer-wrapper'
      variants={containerVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
    >
        <motion.div className='footer-left' variants={itemVariants}>
            <h3><i className="fa-solid fa-utensils"></i> Foodie!.</h3>
            <p>We will fill Your Tummy with delicious food</p>
            <motion.div className='footer-social'>
              <motion.a href="#" whileHover={{ scale: 1.2 }} whileTap={{ scale: 0.95 }}><i className="fa-brands fa-facebook"></i></motion.a>
              <motion.a href="#" whileHover={{ scale: 1.2 }} whileTap={{ scale: 0.95 }}><i className="fa-brands fa-twitter"></i></motion.a>
              <motion.a href="#" whileHover={{ scale: 1.2 }} whileTap={{ scale: 0.95 }}><i className="fa-brands fa-instagram"></i></motion.a>
              <motion.a href="#" whileHover={{ scale: 1.2 }} whileTap={{ scale: 0.95 }}><i className="fa-brands fa-linkedin"></i></motion.a>
            </motion.div>
        </motion.div>
        <motion.div className='footer-right' variants={itemVariants}>
            <h3><i className="fa-solid fa-list"></i> Our Menu</h3>
            <ul>
                <motion.li whileHover={{ x: 8 }}>Spacial</motion.li>
                <motion.li whileHover={{ x: 8 }}>Spycie</motion.li>
                <motion.li whileHover={{ x: 8 }}>Non-Veg</motion.li>
                <motion.li whileHover={{ x: 8 }}>Veg</motion.li>
                <motion.li whileHover={{ x: 8 }}> Cold-Drink</motion.li>
            </ul>
        </motion.div>
        <motion.div className='footer-right' variants={itemVariants}>
            <h3><i className="fa-solid fa-headset"></i> Support</h3>
            <ul>
                <motion.li whileHover={{ x: 8 }}>Account</motion.li>
                <motion.li whileHover={{ x: 8 }}>Customer</motion.li>
                <motion.li whileHover={{ x: 8 }}>Feedback</motion.li>
                <motion.li whileHover={{ x: 8 }}>Contact US</motion.li>
            </ul>
        </motion.div>
        <motion.div className='footer-bottom' variants={itemVariants}>
            <motion.p>
                &#169; 2025 Sudip Basak Foodie! All Rights Reserved.
            </motion.p>
            <motion.p className='footer-credit'>
                Crafted with <motion.span animate={{ scale: [1, 1.2, 1] }} transition={{ duration: 1, repeat: Infinity }}>❤️</motion.span> by Your Team
            </motion.p>
        </motion.div>
    </motion.div>
  )
}

export default Footer