import React, { useEffect, useState } from "react";
import axios from "axios";
import OrderTracking from "../../components/OrderTracking/OrderTracking";
import "./History.css";
import { foodItems } from "../../utils/Utils"
import DeliveryMap from "../../components/Map/DeliveryMap";
import { useNavigate } from "react-router-dom";

const History = () => {
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    const fetchdata = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_BASE_URL}/orders`);
        setOrders(response.data);
      } catch (error) {
        console.error("Error fetching orders:", error);
      }
    };
    fetchdata();
  }, []);

  return (
    <div className="history-container">
       <div className="back-btn"
          onClick={() => navigate("/")}
        ><i class="fa-solid fa-left-long back-arrow"></i> Back</div>
      <h1 className="page-title">Your Orders</h1>

      {orders.length === 0 ? (
        <p className="no-orders">No orders found</p>
      ) : (
        orders.filter(ele => ele.orderStatus !== "Delivered").map((order) => (
          <div className="order-card" key={order.id}>
            <div className="order-header">
              <div>
                <h3>Order ID: {order.id.slice(-6).toUpperCase()}</h3>
                <p className="date">
                  Ordered on:{" "}
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
                <p>₹ {order.amount}</p>
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
              <p>
                <strong>Payment:</strong> {order.paymentMethod} (
                {order.paymentStatus})
              </p>
              <p>
                <strong>Address:</strong> {order.address}
              </p>

              <div className="order-items">
                <h4>Items:</h4>
                <ul>
                  {order.items?.map((item, index) => (
                    <li key={index}>
                      <span>
                        {foodItems.find(ele => ele.id == item.productId)?.name} × {item.quantity}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
            {/* Feed Back by Star Ratting and comment and show helpline number ui and Deleverry boy Number */}

            {/* Feedback, Helpline, and Delivery Info Section */}
            <div className="feedback-section">
              <h4>Rate Your Order Experience</h4>

              {/* ⭐ Star Rating */}
              <div className="star-rating">
                {[1, 2, 3, 4, 5].map((star) => (
                  <span
                    key={star}
                    className={`star ${order.rating >= star ? "filled" : ""}`}
                    onClick={() => {
                      setOrders((prev) =>
                        prev.map((o) =>
                          o.id === order.id ? { ...o, rating: star } : o
                        )
                      );
                    }}
                  >
                    ★
                  </span>
                ))}
              </div>

              {/* 💬 Feedback comment */}
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

              {/* ☎️ Helpline and Delivery Contact */}
              <div className="support-info">
                <div className="info-card">
                  <h5>📞 Helpline</h5>
                  <p>1800-123-4567 (Toll Free)</p>
                  <p>support@foodhub.com</p>
                </div>
                <div className="info-card">
                  <h5>🚚 Delivery Partner</h5>
                  <p><strong>Name:</strong> {order.deliveryBoyName || "Ramesh Kumar"}</p>
                  <p><strong>Contact:</strong> {order.deliveryBoyPhone || "+91 98765 43210"}</p>
                </div>
              </div>

              {/* ✅ Submit Feedback */}
              <button
                className="submit-feedback"
                onClick={async () => {
                  try {
                    await axios.post(`${import.meta.env.VITE_BASE_URL}/orders/${order.id}/feedback`, {
                      rating: order.rating || 0,
                      comment: order.comment || "",
                    });
                    alert("Thank you for your feedback!");
                  } catch (err) {
                    console.error(err);
                    alert("Error submitting feedback");
                  }
                }}
              >
                Submit Feedback
              </button>
            </div>


            {/* End here Feed back */}

            <DeliveryMap orderId={order.id} />
          </div>
        ))
      )}
    {/*================================================================================================  */}
      <div className="order-history">
        <h2>Order History</h2>
        {orders
          .filter((o) => o.orderStatus === "Delivered")
          .map((order) => (
            <div className="history-card" key={order.id}>
              <div>
                <h3>Order ID: {order.id.slice(-6).toUpperCase()}</h3>
                <p>₹{order.amount}</p>
              </div>
              <p className="date">
                Delivered on:{" "}
                {new Date(order.orderDate).toLocaleDateString("en-IN")}
              </p>
            </div>
          ))}
      </div>
    </div>
  );
};

export default History;
