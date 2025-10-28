import React, { useState, useMemo, useEffect } from "react";
import "./cart.css";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import UserStore from "../../store/UserStore";
import { foodItems as products } from "../../utils/Utils";

const CartPage = () => {
  const navigate = useNavigate();
  const [cart, setCart] = useState([]);
  const { user,setUserStoreTotal } = UserStore(); 

  console.log("setCart",cart);
  
  
  useEffect(() => {
    const fetchCartItems = async () => {
      try {
        const response = await axios.post(
          `${import.meta.env.VITE_BASE_URL}/cart-items`,{ userId: user.id } ,
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

  
  const handleIncrease = async(id) => {
    await axios.post(`${import.meta.env.VITE_BASE_URL}/increase-quantity`, {userId: user.id, productId: id }, { withCredentials: true });
    setCart((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, quantity: item.quantity + 1 } : item
      )
    );
  };

  const handleDecrease = async(id) => {
    await axios.post(`${import.meta.env.VITE_BASE_URL}/decrease-quantity`, {userId: user.id, productId: id }, { withCredentials: true });
    if(cart.find((item) => item.id === id).quantity === 1){
      await axios.post(`${import.meta.env.VITE_BASE_URL}/remove-from-cart`, {userId: user.id, productId: id }, { withCredentials: true });
      setCart((prev) => prev.filter((item) => item.id !== id));
    }else{
      setCart((prev) =>
        prev.map((item) =>
          item.id === id ? { ...item, quantity: item.quantity - 1 } : item
        )
      );
    }
  };

  
  const { subtotal, gst, total } = useMemo(() => {
    const subtotal = cart.reduce(
      (acc, item) => acc + item.price * item.quantity,
      0
    );
    const gst = subtotal * 0.18;
    const total = subtotal + gst;
    setUserStoreTotal(total);
    return { subtotal, gst, total };
  }, [cart]);

  return (
    <div className="cart-container">
      <div className="back-btn"
      onClick={()=>navigate("/")}
      ><i class="fa-solid fa-left-long back-arrow"></i> Back</div>
      <h2 className="cart-title">🛒 Your Cart</h2>

      <div className="cart-items">
        {cart.length === 0 ? (
          <p>Your cart is empty.</p>
        ) : (
          cart.map((item) => (
            <div className="cart-item" key={item.id}>
              <img src={item.image} alt={item.name} className="cart-item-img" />
              <div className="cart-item-details">
                <h4>{item.name}</h4>
                <p>₹{item.price}</p>
              </div>
              <div className="cart-item-quantity">
                <button onClick={() => handleDecrease(item.id)}>-</button>
                <span>{item.quantity}</span>
                <button onClick={() => handleIncrease(item.id)}>+</button>
              </div>
              <div className="cart-item-total">
                ₹{item.price * item.quantity}
              </div>
            </div>
          ))
        )}
      </div>

      <div className="cart-summary">
        <p>Subtotal: ₹{subtotal.toFixed(2)}</p>
        <p>GST (18%): ₹{gst.toFixed(2)}</p>
        <h3>Total: ₹{total.toFixed(2)}</h3>
        <button className="pay-now-btn" onClick={() => navigate("/payment")}>
          Pay Now
        </button>
      </div>
    </div>
  );
};

export default CartPage;
