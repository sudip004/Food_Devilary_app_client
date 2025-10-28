import React from 'react'
import './Footer.css'
const Footer = () => {
  return (
    <div className='footer-wrapper'>
        <div className='footer-left'>
            <h3>Foodie!.</h3>
            <p>We will fill Your Tummy dilicious food</p>
        </div>
        <div className='footer-right'>
            <h3>Our Menu</h3>
            <ul>
                <li>Spacial</li>
                <li>Spycie</li>
                <li>non-veg</li>
                <li>veg</li>
                <li> Cold-drink</li>
            </ul>
        </div>
        <div className='footer-right'>
            <h3>Support</h3>
            <ul>
                <li>Account</li>
                <li>Customar</li>
                <li>Feedback</li>
                <li>Contact US</li>
               
            </ul>
        </div>
        <p>
            &#169; 2025 Sudip Basak Foodie! All Rights Reserved.
        </p>
        
    </div>
  )
}

export default Footer