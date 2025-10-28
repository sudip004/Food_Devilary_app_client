import React from 'react'
import { Routes, Route } from 'react-router-dom'

import { Toaster } from 'react-hot-toast'
import "./App.css";
import Home from './pages/Home/Home';
import CartPage from './pages/Cart/Cart';
import PaymentPage from './pages/payment/PaymentPage';
import Signup from './pages/cradintials/Signup';
import History from './pages/History/History';
import Homee from './components/Demo';

const App = () => {
  return (
    <div className='main-app-wrapper'>
      <Toaster
        toastOptions={{
          // Default style for all toasts
          style: {
            border: '1px solid #ddd',
            padding: '12px 16px',
            color: '#333',
          },
          success: {
            style: {
              border: '1px solid #22c55e',
              background: '#dcfce7',
              color: '#166534',
            },
            iconTheme: {
              primary: '#22c55e',
              secondary: '#ffffff',
            },
          },
          error: {
            style: {
              border: '1px solid #f87171',
              background: '#fee2e2',
              color: '#7f1d1d',
            },
            iconTheme: {
              primary: '#ef4444',
              secondary: '#ffffff',
            },
          },
        }}
      />
      <Routes>
        <Route path='/' element={<Home/>} />
        <Route path='/cart' element={<CartPage/>} />
        <Route path='/payment' element={<PaymentPage/>} />
        <Route path='/login' element={<Signup/>} />
        <Route path='/history' element={<History/>} />
        <Route path='/demo' element={<Homee/>} />
      </Routes>
    </div>
  )
}

export default App