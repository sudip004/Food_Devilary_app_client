import React, { useEffect, useState } from "react";
import "./Admin.css";
import axios from "axios";

const API = import.meta.env.VITE_BASE_URL;

const Admin = () => {
  const [orders, setOrders] = useState([]);
  const [openOrderId, setOpenOrderId] = useState(null);
  const [deliveryBoys, setDeliveryBoys] = useState([]);

  /* ======================
     FETCH ORDERS
     ====================== */
  const fetchOrders = async () => {
    try {
      const res = await axios.get(`${API}/orders`, {
        withCredentials: true,
      });

      const filtered = res.data.filter(
        (o) =>
          o.orderStatus !== "Delivered" &&
          o.orderStatus !== "Canceled"
      );

      setOrders(filtered);
    } catch (err) {
      console.error("Error fetching orders", err);
    }
  };

  /* ======================
     FETCH DELIVERY BOYS
     ====================== */
  const fetchDeliveryBoys = async () => {
    try {
      const res = await axios.get(`${API}/getalldeliveryboys`, {
        withCredentials: true,
      });
      setDeliveryBoys(res.data);
    } catch (err) {
      console.error("Error fetching delivery boys", err);
    }
  };

  /* ======================
     AUTO REFRESH (POLLING)
     ====================== */
  useEffect(() => {
    fetchOrders();
    fetchDeliveryBoys();

    // 🔁 auto refresh orders every 10 sec
    const interval = setInterval(fetchOrders,1*60* 1000);

    return () => clearInterval(interval);
  }, []);

  /* ======================
     UPDATE ORDER STATUS
     ====================== */
  const handleStatusChange = async (orderId, newStatus) => {
    const prevOrders = [...orders];

    // Optimistic update
    setOrders((prev) =>
      prev.map((o) =>
        o.id === orderId ? { ...o, orderStatus: newStatus } : o
      )
    );

    try {
      await axios.patch(
        `${API}/orders/${orderId}/status`,
        { orderStatus: newStatus },
        { withCredentials: true }
      );
    } catch (err) {
      console.error(err);
      setOrders(prevOrders); // rollback on failure
    }
  };

  /* ======================
     ASSIGN DELIVERY BOY
     ====================== */
  const handleDeliveryAssign = async (orderId, deliveryBoyId) => {
    const prevOrders = [...orders];

    setOrders((prev) =>
      prev.map((o) =>
        o.id === orderId ? { ...o, deliveryBoyId } : o
      )
    );

    try {
      await axios.patch(
        `${API}/assignorder`,
        { orderId, deliveryBoyId },
        { withCredentials: true }
      );
    } catch (err) {
      console.error(err);
      setOrders(prevOrders); // rollback
    }
  };

  const toggleOrder = (orderId) => {
    setOpenOrderId((prev) => (prev === orderId ? null : orderId));
  };

  return (
    <div className="admin-container">
      <aside className="sidebar">
        <h2 className="logo">Admin</h2>
        <ul>
          <li className="active">Home</li>
        </ul>
      </aside>

      <main className="main-content">
        <h1 className="title">Live Orders</h1>

        <div className="table-wrapper">
          <table className="order-table">
            <thead>
              <tr>
                <th>Order ID</th>
                <th>Status</th>
                <th>Delivery Boy</th>
                <th>Date</th>
                <th>Items</th>
                <th>Payment</th>
                <th>Amount</th>
              </tr>
            </thead>

            <tbody>
              {orders.map((order) => (
                <React.Fragment key={order.id}>
                  <tr
                    className="order-row"
                    onClick={() => toggleOrder(order.id)}
                  >
                    <td>{order.id.slice(-6)}</td>

                    <td>
                      <select
                        value={order.orderStatus}
                        onClick={(e) => e.stopPropagation()}
                        onChange={(e) =>
                          handleStatusChange(order.id, e.target.value)
                        }
                      >
                        <option value="Order-Placed">Order-Placed</option>
                        <option value="Cooking">Cooking</option>
                        <option value="OutForDelivery">OutForDelivery</option>
                        <option value="Delivered">Delivered</option>
                      </select>
                    </td>

                    <td>
                      <select
                        value={order.deliveryBoyId || ""}
                        onClick={(e) => e.stopPropagation()}
                        onChange={(e) =>
                          handleDeliveryAssign(order.id, e.target.value)
                        }
                      >
                        <option value="">Assign</option>
                        {deliveryBoys.map((boy) => (
                          <option key={boy.id} value={boy.id}>
                            {boy.name}
                          </option>
                        ))}
                      </select>
                    </td>

                    <td>
                      {new Date(order.orderDate).toLocaleDateString()}
                    </td>

                    <td>{order.items.length}</td>

                    <td
                      className={
                        order.paymentStatus === "Paid"
                          ? "paid"
                          : "pending"
                      }
                    >
                      {order.paymentStatus}
                    </td>

                    <td>₹{order.amount}</td>
                  </tr>

                  {openOrderId === order.id && (
                    <tr className="items-row">
                      <td colSpan="7">
                        <ul>
                          {order.items.map((item, i) => (
                            <li key={i}>
                              {item.productId} × {item.quantity}
                            </li>
                          ))}
                        </ul>
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              ))}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
};

export default Admin;
