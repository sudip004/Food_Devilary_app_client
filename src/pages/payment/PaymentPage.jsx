import React, { useState, useEffect, useMemo,useRef } from "react";
import "./payment.css";
import UserStore from "../../store/UserStore";
import axios from "axios";
import { foodItems as products } from "../../utils/Utils";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";

const PaymentPage = () => {
  const navigate = useNavigate();
  const [paymentMethod, setPaymentMethod] = useState("Netbanking");
  const [cart, setCart] = useState([]);
  const { user, totaluserStoreTotal } = UserStore();
  const [showbtn, setShowbtn] = useState(true);
  const location = useRef({ latitude: null, longitude: null });
  const [adrress, setAddress] = useState({
    houseNo: "",
    street: "",
    city: "",
    state: "",
    pincode: "",
  });
  const [fullAddress, setFullAddress] = useState("");
  const [doneAddress, setDoneAddress] = useState(false);
  
  // Professional features
  const [isProcessing, setIsProcessing] = useState(false);
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [notification, setNotification] = useState({ show: false, message: "", type: "" });
  const [sessionTimer, setSessionTimer] = useState(600); // 10 minutes
  const [locationError, setLocationError] = useState(false);

  // Validation function
  const validateField = (name, value) => {
    switch (name) {
      case "houseNo":
        return value.trim() ? "" : "House/Building number is required";
      case "street":
        return value.trim() ? "" : "Street/Area is required";
      case "city":
        return value.trim().length >= 2 ? "" : "Please enter a valid city";
      case "state":
        return value.trim().length >= 2 ? "" : "Please enter a valid state";
      case "pincode":
        return /^[0-9]{6}$/.test(value) ? "" : "Pincode must be 6 digits";
      default:
        return "";
    }
  };

  // Validate all fields
  const validateAllFields = () => {
    const newErrors = {};
    Object.keys(adrress).forEach(key => {
      const error = validateField(key, adrress[key]);
      if (error) newErrors[key] = error;
    });
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Show notification
  const showNotification = (message, type = "success") => {
    setNotification({ show: true, message, type });
    setTimeout(() => {
      setNotification({ show: false, message: "", type: "" });
    }, 3000);
  };

  const handeladdress = () => {
    // Validate all fields
    if (!validateAllFields()) {
      showNotification("Please fill all fields correctly", "error");
      return;
    }

    const fullAddress = `${adrress.houseNo}, ${adrress.street}, ${adrress.city}, ${adrress.state} - ${adrress.pincode}`;
    setFullAddress(fullAddress);
    setDoneAddress(true);
    showNotification("Address confirmed successfully!", "success");
  };


  // Session timer
  useEffect(() => {
    if (sessionTimer <= 0) {
      showNotification("Session expired. Redirecting to cart...", "warning");
      setTimeout(() => navigate("/cart"), 2000);
      return;
    }

    const timer = setInterval(() => {
      setSessionTimer(prev => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [sessionTimer, navigate]);

  // Format timer display
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  // ==========================Location Update======================

  useEffect(() => {
    if (!navigator.geolocation) {
      setLocationError(true);
      showNotification("Geolocation not supported", "warning");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { latitude, longitude } = pos.coords;

        location.current = {
          latitude,
          longitude
        };

        setLocationError(false);
        console.log("Location stored in ref:", location.current);
      },
      (err) => {
        setLocationError(true);
        showNotification("Unable to get your location. Please enable location services.", "warning");
        console.error("Geolocation error:", err.message);
      },
      {
        enableHighAccuracy: true,
        timeout: 30000,
        maximumAge: 10000
      }
    );
  }, []);


  useEffect(() => {
    const fetchCartItems = async () => {
      try {
        const response = await axios.post(
          `${import.meta.env.VITE_BASE_URL}/cart-items`, { userId: user.id },
          { withCredentials: true }
        );
        const cartData = response.data;
        console.log("Cart data from server:", cartData);
        const detailedCartItems = cartData.map((item) => {
          const product = products.find((p) => p.id === item.productId);
          return {
            ...product,
            quantity: item.quantity,
          };
        });
        setCart(detailedCartItems);
      } catch (error) {
        console.error("Error fetching cart items:", error);
      }
    };

    if (user?.id) fetchCartItems();
  }, [user]);

  const { subtotal, gst, total } = useMemo(() => {
    const subtotal = cart.reduce(
      (acc, item) => acc + item.price * item.quantity,
      0
    );
    const gst = subtotal * 0.18;
    const total = subtotal + gst;
    return { subtotal, gst, total };
  }, [cart]);

  // Handle input change with validation
  const handleInputChange = (field, value) => {
    // Auto-format pincode
    if (field === "pincode") {
      value = value.replace(/\D/g, '').slice(0, 6);
    }

    setAddress(prev => ({ ...prev, [field]: value }));
    
    // Validate on change if field was touched
    if (touched[field]) {
      const error = validateField(field, value);
      setErrors(prev => ({ ...prev, [field]: error }));
    }
  };

  // Handle input blur
  const handleInputBlur = (field) => {
    setTouched(prev => ({ ...prev, [field]: true }));
    const error = validateField(field, adrress[field]);
    setErrors(prev => ({ ...prev, [field]: error }));
  };

  const handlePayment = async () => {
    // Validation checks
    if (!doneAddress) {
      showNotification("Please confirm your delivery address first", "error");
      return;
    }

    if (cart.length === 0) {
      showNotification("Your cart is empty", "error");
      return;
    }

    if (locationError) {
      showNotification("Location access is required for delivery", "warning");
    }

    setIsProcessing(true);

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BASE_URL}/create-order`,
        { amount: total },
        { withCredentials: true }
      );

      const { orderId, amount, currency } = response.data;
      var success = false;
      const options = {
        key: "rzp_test_RXJG1b108YPqAs", // same as backend key id
        amount: amount,
        currency: currency,
        name: "Food Delivery App",
        description: "Payment for your order",
        order_id: orderId,
        handler: async function (response) {
          // After successful payment
          setIsProcessing(true);
          showNotification("Processing your payment...", "info");
          console.log("Payment Details:", response);
          try {
            await axios.post(
              `${import.meta.env.VITE_BASE_URL}/order-set`,
              {
                userId: user.id,
                address: fullAddress,
                amount: total,
                items: cart.map(item => ({
                  productId: item.id,     // map "id" → "productId"
                  quantity: item.quantity // only send required fields
                })),
                paymentMethod: paymentMethod,
                paymentStatus: "Paid",
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_order_id: response.razorpay_order_id,
                razorpay_signature: response.razorpay_signature,
                customerLocation:location.current,
                restaurantLocation:{ latitude: 22.963, longitude: 88.437 },
                deliveryBoyLocation:{latitude: null, longitude: null}
              },
              { withCredentials: true }
            );
            console.log("Order saved successfully!");
            showNotification("Payment Successful! Order placed.", "success");
            setShowbtn(false);
            setIsProcessing(false);
            
            // Redirect to order tracking after 3 seconds
            setTimeout(() => {
              navigate("/history");
            }, 3000);
          } catch (err) {
            console.error("Error saving order:", err);
            showNotification("Payment successful but order save failed. Contact support.", "error");
            setIsProcessing(false);
          }
          // Optionally send to backend for signature verification
        },
        prefill: {
          name: user.username,
          email: user.email,
        },
        theme: {
          color: "#3399cc",
        },
      };

      const rzp = new window.Razorpay(options);
      
      rzp.on('payment.failed', function (response) {
        showNotification("Payment failed. Please try again.", "error");
        setIsProcessing(false);
        console.error('Payment failed:', response.error);
      });

      rzp.open();
      setIsProcessing(false);

    } catch (err) {
      console.error("Payment failed", err);
      showNotification("Payment initialization failed. Please try again.", "error");
      setIsProcessing(false);
    }
  };


  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 12,
      },
    },
  };

  return (
    <div className="payment-page">
      {/* Toast Notification */}
      <AnimatePresence>
        {notification.show && (
          <motion.div 
            className={`toast-notification toast-${notification.type}`}
            initial={{ opacity: 0, y: -50, x: '-50%' }}
            animate={{ opacity: 1, y: 20 }}
            exit={{ opacity: 0, y: -50 }}
            transition={{ duration: 0.3 }}
          >
            <i className={`fa-solid fa-${
              notification.type === 'success' ? 'circle-check' :
              notification.type === 'error' ? 'circle-xmark' :
              notification.type === 'warning' ? 'triangle-exclamation' :
              'circle-info'
            }`}></i>
            <span>{notification.message}</span>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.div 
        className="payment-card"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, ease: [0.23, 1, 0.320, 1] }}
      >
        {/* Session Timer */}
        <motion.div 
          className="session-timer"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          <i className="fa-solid fa-clock"></i>
          <span>Session expires in: <strong className={sessionTimer < 60 ? 'timer-warning' : ''}>{formatTime(sessionTimer)}</strong></span>
        </motion.div>
        <motion.div
          className="back-btn"
          onClick={() => navigate("/cart")}
          whileHover={{ x: -5 }}
          whileTap={{ scale: 0.95 }}
        >
          <i className="fa-solid fa-arrow-left back-arrow"></i> 
          <span>Back</span>
        </motion.div>
        
        <motion.div 
          className="payment-header"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.5 }}
        >
          <i className="fa-solid fa-shield-halved security-icon"></i>
          <h2>Secure Payment</h2>
          <p className="payment-subtitle">Your payment is safe and secure</p>
        </motion.div>

        {/* Order Summary */}
        <motion.div 
          className="order-summary"
          variants={itemVariants}
          initial="hidden"
          animate="visible"
        >
          <div className="section-header">
            <i className="fa-solid fa-receipt"></i>
            <h3>Order Summary</h3>
          </div>
          <div className="order-items-list">
            {cart.map((item, index) => (
              <motion.div 
                key={item.id} 
                className="order-item"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 + index * 0.1 }}
              >
                <div className="item-info">
                  <span className="item-name">{item.name}</span>
                  <span className="item-qty">× {item.quantity}</span>
                </div>
                <span className="item-price">₹{item.price * item.quantity}</span>
              </motion.div>
            ))}
          </div>
          <div className="summary-divider"></div>
          <div className="order-total">
            <div className="total-row">
              <span>Subtotal</span>
              <span>₹{subtotal.toFixed(2)}</span>
            </div>
            <div className="total-row">
              <span>GST (18%)</span>
              <span>₹{gst.toFixed(2)}</span>
            </div>
            <div className="total-row grand-total">
              <span>Total Amount</span>
              <span className="total-amount">₹{total.toFixed(2)}</span>
            </div>
          </div>
        </motion.div>

        {/* Payment Method */}
        <motion.div 
          className="payment-method"
          variants={itemVariants}
          initial="hidden"
          animate="visible"
        >
          <div className="section-header">
            <i className="fa-solid fa-credit-card"></i>
            <h3>Payment Method</h3>
          </div>
          <div className="payment-options">
            <motion.label
              className={`payment-option ${paymentMethod === "cod" ? "selected" : ""}`}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <input
                type="radio"
                value="cod"
                checked={paymentMethod === "cod"}
                onChange={(e) => setPaymentMethod(e.target.value)}
              />
              <div className="option-content">
                <i className="fa-solid fa-truck-fast option-icon"></i>
                <span>Cash on Delivery</span>
              </div>
              <i className="fa-solid fa-circle-check check-icon"></i>
            </motion.label>
            
            <motion.label
              className={`payment-option ${paymentMethod === "Netbanking" ? "selected" : ""}`}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <input
                type="radio"
                value="Netbanking"
                checked={paymentMethod === "Netbanking"}
                onChange={(e) => setPaymentMethod(e.target.value)}
              />
              <div className="option-content">
                <i className="fa-solid fa-building-columns option-icon"></i>
                <span>Online Payment</span>
              </div>
              <i className="fa-solid fa-circle-check check-icon"></i>
            </motion.label>
          </div>
        </motion.div>

        <AnimatePresence mode="wait">
          {!doneAddress && (
            <motion.div 
              className="address-form"
              variants={itemVariants}
              initial="hidden"
              animate="visible"
              exit={{ opacity: 0, y: -20 }}
            >
              <div className="section-header">
                <i className="fa-solid fa-location-dot"></i>
                <h3>Delivery Address</h3>
              </div>
              <div className="address-inputs">
                <div className={`input-group ${errors.houseNo && touched.houseNo ? 'has-error' : ''} ${!errors.houseNo && touched.houseNo && adrress.houseNo ? 'has-success' : ''}`}>
                  <i className="fa-solid fa-house input-icon"></i>
                  <input 
                    type="text" 
                    placeholder="House No., Building Name"
                    value={adrress.houseNo}
                    onChange={(e) => handleInputChange('houseNo', e.target.value)}
                    onBlur={() => handleInputBlur('houseNo')}
                  />
                  {errors.houseNo && touched.houseNo && <i className="fa-solid fa-circle-xmark error-icon"></i>}
                  {!errors.houseNo && touched.houseNo && adrress.houseNo && <i className="fa-solid fa-circle-check success-icon"></i>}
                  {errors.houseNo && touched.houseNo && <span className="error-message">{errors.houseNo}</span>}
                </div>
                <div className={`input-group ${errors.street && touched.street ? 'has-error' : ''} ${!errors.street && touched.street && adrress.street ? 'has-success' : ''}`}>
                  <i className="fa-solid fa-road input-icon"></i>
                  <input 
                    type="text" 
                    placeholder="Street, Area"
                    value={adrress.street}
                    onChange={(e) => handleInputChange('street', e.target.value)}
                    onBlur={() => handleInputBlur('street')}
                  />
                  {errors.street && touched.street && <i className="fa-solid fa-circle-xmark error-icon"></i>}
                  {!errors.street && touched.street && adrress.street && <i className="fa-solid fa-circle-check success-icon"></i>}
                  {errors.street && touched.street && <span className="error-message">{errors.street}</span>}
                </div>
                <div className={`input-group ${errors.city && touched.city ? 'has-error' : ''} ${!errors.city && touched.city && adrress.city ? 'has-success' : ''}`}>
                  <i className="fa-solid fa-city input-icon"></i>
                  <input 
                    type="text" 
                    placeholder="City"
                    value={adrress.city}
                    onChange={(e) => handleInputChange('city', e.target.value)}
                    onBlur={() => handleInputBlur('city')}
                  />
                  {errors.city && touched.city && <i className="fa-solid fa-circle-xmark error-icon"></i>}
                  {!errors.city && touched.city && adrress.city && <i className="fa-solid fa-circle-check success-icon"></i>}
                  {errors.city && touched.city && <span className="error-message">{errors.city}</span>}
                </div>
                <div className={`input-group ${errors.state && touched.state ? 'has-error' : ''} ${!errors.state && touched.state && adrress.state ? 'has-success' : ''}`}>
                  <i className="fa-solid fa-map input-icon"></i>
                  <input 
                    type="text" 
                    placeholder="State"
                    value={adrress.state}
                    onChange={(e) => handleInputChange('state', e.target.value)}
                    onBlur={() => handleInputBlur('state')}
                  />
                  {errors.state && touched.state && <i className="fa-solid fa-circle-xmark error-icon"></i>}
                  {!errors.state && touched.state && adrress.state && <i className="fa-solid fa-circle-check success-icon"></i>}
                  {errors.state && touched.state && <span className="error-message">{errors.state}</span>}
                </div>
                <div className={`input-group ${errors.pincode && touched.pincode ? 'has-error' : ''} ${!errors.pincode && touched.pincode && adrress.pincode ? 'has-success' : ''}`}>
                  <i className="fa-solid fa-location-crosshairs input-icon"></i>
                  <input 
                    type="text" 
                    placeholder="Pincode (6 digits)"
                    value={adrress.pincode}
                    onChange={(e) => handleInputChange('pincode', e.target.value)}
                    onBlur={() => handleInputBlur('pincode')}
                    maxLength="6"
                  />
                  {errors.pincode && touched.pincode && <i className="fa-solid fa-circle-xmark error-icon"></i>}
                  {!errors.pincode && touched.pincode && adrress.pincode && <i className="fa-solid fa-circle-check success-icon"></i>}
                  {errors.pincode && touched.pincode && <span className="error-message">{errors.pincode}</span>}
                </div>
              </div>

              <motion.button 
                className="done-btn" 
                onClick={handeladdress}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                disabled={isProcessing}
              >
                {isProcessing ? (
                  <>
                    <i className="fa-solid fa-spinner fa-spin"></i> Processing...
                  </>
                ) : (
                  <>
                    <i className="fa-solid fa-circle-check"></i> Confirm Address
                  </>
                )}
              </motion.button>
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence mode="wait">
          {doneAddress && (
            <motion.div 
              className="confirmed-address"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
            >
              <div className="address-display">
                <i className="fa-solid fa-circle-check address-check"></i>
                <div className="address-text">
                  <span className="address-label">Delivering to:</span>
                  <p className="address-value">{fullAddress}</p>
                </div>
                <motion.button
                  className="edit-address-btn"
                  onClick={() => setDoneAddress(false)}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <i className="fa-solid fa-pen"></i>
                </motion.button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Pay Button */}
        <AnimatePresence mode="wait">
          {showbtn ? (
            doneAddress && (
              <motion.button 
                className="pay-btn" 
                onClick={handlePayment}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9 }}
                whileHover={{ scale: isProcessing ? 1 : 1.02, boxShadow: isProcessing ? "" : "0 12px 35px rgba(255, 102, 0, 0.4)" }}
                whileTap={{ scale: isProcessing ? 1 : 0.98 }}
                disabled={isProcessing || !doneAddress}
              >
                {isProcessing ? (
                  <>
                    <i className="fa-solid fa-spinner fa-spin"></i> 
                    Processing Payment...
                  </>
                ) : (
                  <>
                    <i className="fa-solid fa-lock"></i> 
                    Pay ₹{total.toFixed(2)}
                  </>
                )}
              </motion.button>
            )
          ) : (
            <motion.div 
              className="success-message"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, ease: [0.23, 1, 0.320, 1] }}
            >
              <i className="fa-solid fa-circle-check success-icon"></i>
              <h3>Payment Successful!</h3>
              <p>Thank you for your order. We'll deliver it soon!</p>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
};

export default PaymentPage;
