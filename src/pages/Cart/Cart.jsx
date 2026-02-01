import React, { useState, useMemo, useEffect } from "react";
import "./cart.css";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import UserStore from "../../store/UserStore";
import { foodItems as products } from "../../utils/Utils";
import { motion } from "framer-motion";

const CartPage = () => {
  const navigate = useNavigate();
  const [cart, setCart] = useState([]);

  const { user, setUserStoreTotal } = UserStore();

  // ---------------- FETCH CART ITEMS ----------------
  useEffect(() => {
    if (!user?.id) return;

    const fetchCartItems = async () => {
      try {
        const response = await axios.post(
          `${import.meta.env.VITE_BASE_URL}/cart-items`,
          { userId: user.id },
          { withCredentials: true }
        );

        const cartData = response.data || [];

        const detailedCartItems = cartData
          .map((item) => {
            const product = products.find(
              (p) => p.id === item.productId
            );

            if (!product) return null;

            return {
              ...product,
              quantity: item.quantity,
            };
          })
          .filter(Boolean);

        setCart(detailedCartItems);
      } catch (error) {
        console.error("Error fetching cart items:", error);
      }
    };

    fetchCartItems();
  }, [user]);

  // ---------------- CART ACTIONS ----------------
  const handleIncrease = async (id) => {
    if (!user?.id) return;

    await axios.post(
      `${import.meta.env.VITE_BASE_URL}/increase-quantity`,
      { userId: user.id, productId: id },
      { withCredentials: true }
    );

    setCart((prev) =>
      prev.map((item) =>
        item.id === id
          ? { ...item, quantity: item.quantity + 1 }
          : item
      )
    );
  };

  const handleDecrease = async (id) => {
    if (!user?.id) return;

    const item = cart.find((i) => i.id === id);
    if (!item) return;

    if (item.quantity === 1) {
      await axios.post(
        `${import.meta.env.VITE_BASE_URL}/remove-from-cart`,
        { userId: user.id, productId: id },
        { withCredentials: true }
      );

      setCart((prev) => prev.filter((i) => i.id !== id));
    } else {
      await axios.post(
        `${import.meta.env.VITE_BASE_URL}/decrease-quantity`,
        { userId: user.id, productId: id },
        { withCredentials: true }
      );

      setCart((prev) =>
        prev.map((i) =>
          i.id === id
            ? { ...i, quantity: i.quantity - 1 }
            : i
        )
      );
    }
  };

  // ---------------- PRICE CALCULATION ----------------
  const { subtotal, gst, total } = useMemo(() => {
    const subtotal = cart.reduce(
      (acc, item) => acc + item.price * item.quantity,
      0
    );

    const gst = subtotal * 0.18;
    const total = subtotal + gst;

    return { subtotal, gst, total };
  }, [cart]);

  // ---------------- UPDATE STORE TOTAL ----------------
  useEffect(() => {
    setUserStoreTotal(total);
  }, [total, setUserStoreTotal]);

  // ---------------- UI ----------------
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
      className="cart-container"
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: [0.23, 1, 0.320, 1] }}
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
        className="cart-header"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.5 }}
      >
        <i className="fa-solid fa-cart-shopping cart-icon"></i>
        <h2 className="cart-title">Your Shopping Cart</h2>
        <p className="cart-subtitle">{cart.length} {cart.length === 1 ? 'item' : 'items'} in your cart</p>
      </motion.div>

      <motion.div 
        className="cart-items"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {cart.length === 0 ? (
          <motion.div 
            className="empty-cart"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
          >
            <i className="fa-solid fa-cart-shopping empty-cart-icon"></i>
            <h3>Your cart is empty</h3>
            <p>Add some delicious items to get started!</p>
            <motion.button
              className="browse-btn"
              onClick={() => navigate("/")}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <i className="fa-solid fa-utensils"></i> Browse Menu
            </motion.button>
          </motion.div>
        ) : (
          cart.map((item, index) => (
            <motion.div 
              className="cart-item" 
              key={item.id}
              variants={itemVariants}
              whileHover={{ y: -4, boxShadow: "0 12px 30px rgba(255, 102, 0, 0.15)" }}
            >
              <div className="cart-item-image-wrapper">
                <img
                  src={item.image}
                  alt={item.name}
                  className="cart-item-img"
                />
              </div>

              <div className="cart-item-details">
                <h4>{item.name}</h4>
                <p className="cart-item-price">
                  <i className="fa-solid fa-indian-rupee-sign"></i>
                  {item.price}
                </p>
              </div>

              <div className="cart-item-quantity">
                <motion.button 
                  onClick={() => handleDecrease(item.id)}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  className="qty-btn"
                >
                  <i className="fa-solid fa-minus"></i>
                </motion.button>
                <span className="qty-value">{item.quantity}</span>
                <motion.button 
                  onClick={() => handleIncrease(item.id)}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  className="qty-btn"
                >
                  <i className="fa-solid fa-plus"></i>
                </motion.button>
              </div>

              <div className="cart-item-total">
                <span className="total-label">Total</span>
                <span className="total-amount">
                  <i className="fa-solid fa-indian-rupee-sign"></i>
                  {(item.price * item.quantity).toFixed(2)}
                </span>
              </div>
            </motion.div>
          ))
        )}
      </motion.div>

      {cart.length > 0 && (
        <motion.div 
          className="cart-summary"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.5 }}
        >
          <div className="summary-content">
            <div className="summary-row">
              <span>Subtotal</span>
              <span>₹{subtotal.toFixed(2)}</span>
            </div>
            <div className="summary-row">
              <span>GST (18%)</span>
              <span>₹{gst.toFixed(2)}</span>
            </div>
            <div className="summary-divider"></div>
            <div className="summary-row total-row">
              <span>Total Amount</span>
              <span className="total-price">₹{total.toFixed(2)}</span>
            </div>

            <motion.button
              className="pay-now-btn"
              onClick={() => navigate("/payment")}
              whileHover={{ scale: 1.02, boxShadow: "0 8px 25px rgba(255, 102, 0, 0.4)" }}
              whileTap={{ scale: 0.98 }}
            >
              <i className="fa-solid fa-lock"></i> Proceed to Payment
            </motion.button>
          </div>
        </motion.div>
      )}
    </motion.div>
  );
};

export default CartPage;














































// import React, { useState, useMemo, useEffect } from "react";
// import "./cart.css";
// import { useNavigate } from "react-router-dom";
// import axios from "axios";
// import UserStore from "../../store/UserStore";
// import { foodItems as products } from "../../utils/Utils";

// const CartPage = () => {
//   const navigate = useNavigate();
//   const [cart, setCart] = useState([]);
//   const { user,setUserStoreTotal } = UserStore(); 

//   console.log("setCart",cart);
  
  
//   useEffect(() => {
//     const fetchCartItems = async () => {
//       try {
//         const response = await axios.post(
//           `${import.meta.env.VITE_BASE_URL}/cart-items`,{ userId: user.id } ,
//           { withCredentials: true }
//         );
//         const cartData = response.data;
//         console.log("Cart data from server:", cartData);
//         const detailedCartItems = cartData.map((item) => {
//           const product = products.find((p) => p.id === item.productId);
//           return {
//             ...product,
//             quantity: item.quantity,
//           };
//         });
//         setCart(detailedCartItems);
//       } catch (error) {
//         console.error("Error fetching cart items:", error);
//       }
//     };

//     if (user?.id) fetchCartItems();
//   }, [user]);

  
//   const handleIncrease = async(id) => {
//     await axios.post(`${import.meta.env.VITE_BASE_URL}/increase-quantity`, {userId: user.id, productId: id }, { withCredentials: true });
//     setCart((prev) =>
//       prev.map((item) =>
//         item.id === id ? { ...item, quantity: item.quantity + 1 } : item
//       )
//     );
//   };

//   const handleDecrease = async(id) => {
//     await axios.post(`${import.meta.env.VITE_BASE_URL}/decrease-quantity`, {userId: user.id, productId: id }, { withCredentials: true });
//     if(cart.find((item) => item.id === id).quantity === 1){
//       await axios.post(`${import.meta.env.VITE_BASE_URL}/remove-from-cart`, {userId: user.id, productId: id }, { withCredentials: true });
//       setCart((prev) => prev.filter((item) => item.id !== id));
//     }else{
//       setCart((prev) =>
//         prev.map((item) =>
//           item.id === id ? { ...item, quantity: item.quantity - 1 } : item
//         )
//       );
//     }
//   };

  
//   const { subtotal, gst, total } = useMemo(() => {
//     const subtotal = cart.reduce(
//       (acc, item) => acc + item.price * item.quantity,
//       0
//     );
//     const gst = subtotal * 0.18;
//     const total = subtotal + gst;
//     setUserStoreTotal(total);
//     return { subtotal, gst, total };
//   }, [cart]);

//   return (
//     <div className="cart-container">
//       <div className="back-btn"
//       onClick={()=>navigate("/")}
//       ><i class="fa-solid fa-left-long back-arrow"></i> Back</div>
//       <h2 className="cart-title">🛒 Your Cart</h2>

//       <div className="cart-items">
//         {cart.length === 0 ? (
//           <p>Your cart is empty.</p>
//         ) : (
//           cart.map((item) => (
//             <div className="cart-item" key={item.id}>
//               <img src={item.image} alt={item.name} className="cart-item-img" />
//               <div className="cart-item-details">
//                 <h4>{item.name}</h4>
//                 <p>₹{item.price}</p>
//               </div>
//               <div className="cart-item-quantity">
//                 <button onClick={() => handleDecrease(item.id)}>-</button>
//                 <span>{item.quantity}</span>
//                 <button onClick={() => handleIncrease(item.id)}>+</button>
//               </div>
//               <div className="cart-item-total">
//                 ₹{item.price * item.quantity}
//               </div>
//             </div>
//           ))
//         )}
//       </div>

//       <div className="cart-summary">
//         <p>Subtotal: ₹{subtotal.toFixed(2)}</p>
//         <p>GST (18%): ₹{gst.toFixed(2)}</p>
//         <h3>Total: ₹{total.toFixed(2)}</h3>
//         <button className="pay-now-btn" onClick={() => navigate("/payment")}>
//           Pay Now
//         </button>
//       </div>
//     </div>
//   );
// };

// export default CartPage;
