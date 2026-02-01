import React, { useEffect, useState } from "react";
import axios from "axios";
import OrderTracking from "../../components/OrderTracking/OrderTracking";
import "./History.css";
import { foodItems } from "../../utils/Utils"
import DeliveryMap from "../../components/Map/DeliveryMap";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";

const History = () => {
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [feedbackSubmitting, setFeedbackSubmitting] = useState({});
  const [successMessage, setSuccessMessage] = useState(null);

  useEffect(() => {
    const fetchdata = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await axios.get(`${import.meta.env.VITE_BASE_URL}/orders`);
        setOrders(response.data || []);
      } catch (error) {
        console.error("Error fetching orders:", error);
        setError("Failed to load your orders. Please try again later.");
        setOrders([]);
      } finally {
        setLoading(false);
      }
    };
    fetchdata();
  }, []);

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
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 12,
      },
    },
  };

  return (
    <motion.div 
      className="history-container"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <motion.div
        className="back-btn"
        onClick={() => navigate("/home")}
        whileHover={{ x: -5 }}
        whileTap={{ scale: 0.95 }}
      >
        <i className="fa-solid fa-arrow-left back-arrow"></i> 
        <span>Back to Home</span>
      </motion.div>
      
      <motion.div 
        className="page-header"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.5 }}
      >
        <i className="fa-solid fa-clock-rotate-left header-icon"></i>
        <h1 className="page-title">Your Orders</h1>
        <p className="page-subtitle">Track and manage your orders</p>
      </motion.div>

      {loading && (
        <motion.div 
          className="loading-state"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
        >
          <i className="fa-solid fa-spinner fa-spin loading-spinner"></i>
          <p>Loading your orders...</p>
        </motion.div>
      )}

      {error && (
        <motion.div 
          className="error-state"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <i className="fa-solid fa-triangle-exclamation error-icon"></i>
          <h3>Oops! Something went wrong</h3>
          <p>{error}</p>
          <motion.button
            className="retry-btn"
            onClick={() => window.location.reload()}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <i className="fa-solid fa-rotate-right"></i> Try Again
          </motion.button>
        </motion.div>
      )}

      {!loading && !error && orders.length === 0 && !loading && !error ? (
        <motion.div 
          className="no-orders"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          <i className="fa-solid fa-box-open empty-icon"></i>
          <h3>No orders yet</h3>
          <p>Start ordering delicious food!</p>
          <motion.button
            className="browse-menu-btn"
            onClick={() => navigate("/home")}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <i className="fa-solid fa-utensils"></i> Browse Menu
          </motion.button>
        </motion.div>
      ) : (
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
        {orders.filter(ele => ele.orderStatus !== "Delivered").map((order, index) => (
          <motion.div 
            className="order-card" 
            key={order.id}
            variants={itemVariants}
            whileHover={{ y: -4, boxShadow: "0 12px 30px rgba(255, 102, 0, 0.15)" }}
          >
            <div className="order-header">
              <div className="order-id-section">
                <div className="order-id-badge">
                  <i className="fa-solid fa-receipt"></i>
                  <span>#{order.id.slice(-6).toUpperCase()}</span>
                </div>
                <p className="date">
                  <i className="fa-solid fa-calendar-days"></i>
                  {new Date(order.orderDate).toLocaleString("en-IN", {
                    day: "2-digit",
                    month: "short",
                    year: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </p>
              </div>
              <div className="order-amount">
                <span className="amount-label">Total</span>
                <span className="amount-value">
                  <i className="fa-solid fa-indian-rupee-sign"></i>
                  {order.amount}
                </span>
              </div>
            </div>

            <div className="tracking-section">
              <OrderTracking
                status={
                  order.orderStatus === "Order-Placed"
                    ? "PLACED"
                    : order.orderStatus === "Shipped"
                      ? "SHIPPED"
                      : "DELIVERED"
                }
              />
            </div>

            <div className="order-details">
              <div className="detail-row">
                <i className="fa-solid fa-credit-card detail-icon"></i>
                <div>
                  <span className="detail-label">Payment</span>
                  <span className="detail-value">{order.paymentMethod} ({order.paymentStatus})</span>
                </div>
              </div>
              <div className="detail-row">
                <i className="fa-solid fa-location-dot detail-icon"></i>
                <div>
                  <span className="detail-label">Delivery Address</span>
                  <span className="detail-value">{order.address}</span>
                </div>
              </div>

              <div className="order-items">
                <div className="items-header">
                  <i className="fa-solid fa-bag-shopping"></i>
                  <h4>Order Items</h4>
                  <span className="items-count">{order.items?.length || 0} item{order.items?.length !== 1 ? 's' : ''}</span>
                </div>
                {order.items && order.items.length > 0 ? (
                  <div>
                    <div className="items-table-header">
                      <div className="col-item">Item</div>
                      <div className="col-qty">Qty</div>
                    </div>
                    {order.items?.map((item, index) => (
                      <motion.div 
                        key={index} 
                        className="items-table-row"
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.08 }}
                      >
                        <div className="col-item">
                          <span className="item-dot">•</span>
                          <span className="item-name">
                            {foodItems.find(ele => ele.id == item.productId)?.name || "Unknown Item"}
                          </span>
                        </div>
                        <div className="col-qty">
                          <span className="qty-badge">× {item.quantity || 1}</span>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                ) : (
                  <div className="items-empty">
                    <p>No items in this order</p>
                  </div>
                )}
              </div>
            </div>

            {/* Feedback, Helpline, and Delivery Info Section */}
            <div className="feedback-section">
              <div className="feedback-header">
                <i className="fa-solid fa-star-half-stroke"></i>
                <h4>Rate Your Experience</h4>
              </div>

              {/*  Star Rating */}
              <div className="star-rating">
                {[1, 2, 3, 4, 5].map((star) => (
                  <motion.span
                    key={star}
                    className={`star ${order.rating >= star ? "filled" : ""}`}
                    whileHover={{ scale: 1.2, rotate: 15 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => {
                      setOrders((prev) =>
                        prev.map((o) =>
                          o.id === order.id ? { ...o, rating: star } : o
                        )
                      );
                    }}
                  >
                    ★
                  </motion.span>
                ))}
              </div>

              {/*  Feedback comment */}
              <textarea
                placeholder="Write your feedback..."
                value={order.comment || ""}
                onChange={(e) => {
                  const value = e.target.value;
                  setOrders((prev) =>
                    prev.map((o) =>
                      o.id === order.id ? { ...o, comment: value } : o
                    )
                  );
                }}
                className="feedback-input"
              />

              {/* Helpline and Delivery Contact */}
              <div className="support-info">
                <motion.div 
                  className="info-card"
                  whileHover={{ scale: 1.02 }}
                >
                  <div className="info-card-header">
                    <i className="fa-solid fa-headset"></i>
                    <h5>Customer Support</h5>
                  </div>
                  <p><i className="fa-solid fa-phone"></i> 1800-123-4567</p>
                  <p><i className="fa-solid fa-envelope"></i> support@foodhub.com</p>
                </motion.div>
                <motion.div 
                  className="info-card"
                  whileHover={{ scale: 1.02 }}
                >
                  <div className="info-card-header">
                    <i className="fa-solid fa-motorcycle"></i>
                    <h5>Delivery Partner</h5>
                  </div>
                  <p><i className="fa-solid fa-user"></i> {order.deliveryBoyName || "Ramesh Kumar"}</p>
                  <p><i className="fa-solid fa-mobile-screen"></i> {order.deliveryBoyPhone || "+91 98765 43210"}</p>
                </motion.div>
              </div>

              {/*  Submit Feedback */}
              <motion.button
                className="submit-feedback"
                whileHover={{ scale: 1.02, boxShadow: "0 8px 20px rgba(255, 102, 0, 0.3)" }}
                whileTap={{ scale: 0.98 }}
                disabled={!order.rating || feedbackSubmitting[order.id]}
                onClick={async () => {
                  // Validate rating
                  if (!order.rating || order.rating === 0) {
                    setSuccessMessage({id: order.id, text: 'Please select a rating', type: 'error', show: true});
                    setTimeout(() => setSuccessMessage(null), 3000);
                    return;
                  }

                  try {
                    setFeedbackSubmitting(prev => ({...prev, [order.id]: true}));
                    await axios.post(`${import.meta.env.VITE_BASE_URL}/orders/${order.id}/feedback`, {
                      rating: order.rating || 0,
                      comment: order.comment || "",
                    });
                    setSuccessMessage({id: order.id, text: 'Thank you for your feedback!', type: 'success', show: true});
                    // Clear feedback after success
                    setTimeout(() => {
                      setOrders((prev) =>
                        prev.map((o) =>
                          o.id === order.id ? { ...o, rating: 0, comment: "" } : o
                        )
                      );
                      setSuccessMessage(null);
                    }, 2000);
                  } catch (err) {
                    console.error(err);
                    setSuccessMessage({id: order.id, text: 'Error submitting feedback. Please try again.', type: 'error', show: true});
                    setTimeout(() => setSuccessMessage(null), 3000);
                  } finally {
                    setFeedbackSubmitting(prev => ({...prev, [order.id]: false}));
                  }
                }}
              >
                {feedbackSubmitting[order.id] ? (
                  <>
                    <i className="fa-solid fa-spinner fa-spin"></i> Submitting...
                  </>
                ) : (
                  <>
                    <i className="fa-solid fa-paper-plane"></i> Submit Feedback
                  </>
                )}
              </motion.button>
              
              {/* Feedback Status Message */}
              <AnimatePresence>
                {successMessage?.id === order.id && successMessage?.show && (
                  <motion.div 
                    className={`feedback-message feedback-${successMessage.type}`}
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.3 }}
                  >
                    <i className={`fa-solid fa-${
                      successMessage.type === 'success' ? 'circle-check' : 'circle-xmark'
                    }`}></i>
                    <span>{successMessage.text}</span>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>


            {/* End here Feed back */}

            <DeliveryMap
              orderId={order.id}
              onDelivered={() => {
                setOrders((prev) =>
                  prev.map((o) =>
                    o.id === order.id
                      ? { ...o, orderStatus: "Delivered" }
                      : o
                  )
                );
              }}
            />
            

          </motion.div>
        ))}
        </motion.div>
      )}
      {/*================================================================================================  */}
      {orders.filter((o) => o.orderStatus === "Delivered").length > 0 && (
        <motion.div 
          className="order-history"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <div className="history-header">
            <i className="fa-solid fa-clock-rotate-left"></i>
            <h2>Completed Orders</h2>
          </div>
          {orders
            .filter((o) => o.orderStatus === "Delivered")
            .map((order, index) => (
              <motion.div 
                className="history-card" 
                key={order.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ x: 4, boxShadow: "0 6px 15px rgba(16, 185, 129, 0.15)" }}
              >
                <div className="history-card-left">
                  <div className="history-order-id">
                    <i className="fa-solid fa-circle-check delivered-icon"></i>
                    <span>#{order.id.slice(-6).toUpperCase()}</span>
                  </div>
                  <p className="history-amount">
                    <i className="fa-solid fa-indian-rupee-sign"></i>
                    {order.amount}
                  </p>
                </div>
                <p className="history-date">
                  <i className="fa-solid fa-calendar-check"></i>
                  {new Date(order.orderDate).toLocaleDateString("en-IN", {
                    day: '2-digit',
                    month: 'short',
                    year: 'numeric'
                  })}
                </p>
              </motion.div>
            ))}
        </motion.div>
      )}
    </motion.div>
  );
};

export default History;
