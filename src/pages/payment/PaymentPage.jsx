import React, { useState, useEffect, useMemo,useRef } from "react";
import "./payment.css";
import UserStore from "../../store/UserStore";
import axios from "axios";
import { foodItems as products } from "../../utils/Utils";
import { useNavigate } from "react-router-dom";

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

  console.log("cart", cart);
  console.log("fulladdress", fullAddress);
  console.log("doneaddr", doneAddress);

  const handeladdress = () => {
    const fullAddress = `${adrress.houseNo}, ${adrress.street}, ${adrress.city}, ${adrress.state} - ${adrress.pincode}`;
    console.log("Full Address:", fullAddress);
    setFullAddress(fullAddress);
    setDoneAddress(true);
  }


  // ==========================Location Update======================

  useEffect(() => {
    if (!navigator.geolocation) {
      console.error("Geolocation not supported");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { latitude, longitude } = pos.coords;

        location.current = {
          latitude,
          longitude
        };

        console.log("Location stored in ref:", location.current);
      },
      (err) => {
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


  const handlePayment = async () => {

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
          alert("Payment Successful!");
          setShowbtn(false);
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
          } catch (err) {
            console.error("Error saving order:", err);
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
      rzp.open();
      console.log("Success", success);


    } catch (err) {
      console.error("Payment failed", err);
    }
  };


  return (
    <div className="payment-page">
      <div className="payment-card">
        <div className="back-btn"
          onClick={() => navigate(-1)}
        ><i class="fa-solid fa-left-long back-arrow"></i> Back</div>
        <h2>💳 Secure Payment</h2>

        {/* Order Summary */}
        <div className="order-summary">
          <h3>Order Summary</h3>
          {cart.map((item) => (
            <div key={item.id} className="order-item">
              <span>{item.name} × {item.quantity}</span>
              <span>₹{item.price * item.quantity}</span>
            </div>
          ))}
          <hr />
          <div className="order-total">
            <p>Subtotal: ₹{subtotal.toFixed(2)}</p>
            <p>GST (18%): ₹{gst.toFixed(2)}</p>
            <h3>Total: ₹{total.toFixed(2)}</h3>
          </div>
        </div>

        {/* Payment Method */}
        <div className="payment-method">
          <h3>Choose Payment Method</h3>
          <div className="payment-options">

            <label>
              <input
                type="radio"
                value="cod"
                checked={paymentMethod === "cod"}
                onChange={(e) => setPaymentMethod(e.target.value)}
              />
              🚚 Cash on Delivery
            </label>
            <label>
              <input
                type="radio"
                value="Netbanking"
                checked={paymentMethod === "Netbanking"}
                onChange={(e) => setPaymentMethod(e.target.value)}
              />
              🏦 Netbanking
            </label>
          </div>
        </div>

        {
          !doneAddress &&
          <div className="address-from">
            <h3>Delivery Address</h3>
            <div className="address-inputs">
              <input type="text" placeholder="House No., Building Name"
                onChange={(e) => setAddress((pre) => ({ ...pre, houseNo: e.target.value }))}
              />
              <input type="text" placeholder="Street, Area"
                onChange={(e) => setAddress((pre) => ({ ...pre, street: e.target.value }))}
              />
              <input type="text" placeholder="City"
                onChange={(e) => setAddress((pre) => ({ ...pre, city: e.target.value }))}
              />
              <input type="text" placeholder="State"
                onChange={(e) => setAddress((pre) => ({ ...pre, state: e.target.value }))}
              />
              <input type="text" placeholder="Pincode"
                onChange={(e) => setAddress((pre) => ({ ...pre, pincode: e.target.value }))}
              />

            </div>

            <button className="done-btn" onClick={handeladdress}>Done</button>

          </div>
        }

        {
          doneAddress &&
          <input className="doneaddr" type="text" placeholder="Pincode"
            value={`Address : ${fullAddress}`} readOnly
          />
        }



        {/* Pay Button */}
        {
          showbtn ? doneAddress && <button className="pay-btn" onClick={handlePayment}>Pay ₹{total.toFixed(2)}</button>
            : <h3 style={{ color: "green" }}>Payment Successful ! Thank You For Visiting.</h3>
        }
      </div>
    </div>
  );
};

export default PaymentPage;
