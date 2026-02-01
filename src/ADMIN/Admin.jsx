import React, { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import "./Admin.css";
import axios from "axios";

const API = import.meta.env.VITE_BASE_URL;

const Admin = () => {
  const [orders, setOrders] = useState([]);
  const [openOrderId, setOpenOrderId] = useState(null);
  const [deliveryBoys, setDeliveryBoys] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [paymentFilter, setPaymentFilter] = useState("All");
  const [refreshing, setRefreshing] = useState(false);
  const [lastUpdated, setLastUpdated] = useState(null);

  /* ======================
     FETCH ORDERS
     ====================== */
  const fetchOrders = async () => {
    try {
      setError(null);
      const res = await axios.get(`${API}/orders`, {
        withCredentials: true,
      });

      const filtered = res.data.filter(
        (o) =>
          o.orderStatus !== "Delivered" &&
          o.orderStatus !== "Canceled"
      );

      setOrders(filtered);
      setLastUpdated(new Date());
    } catch (err) {
      setError("Failed to load orders. Please try again.");
      console.error("Error fetching orders", err);
    } finally {
      setLoading(false);
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
    setLoading(true);
    fetchOrders();
    fetchDeliveryBoys();

    // 🔁 auto refresh orders every 10 sec
    const interval = setInterval(fetchOrders, 1 * 60 * 1000);

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

  const handleRefresh = async () => {
    setRefreshing(true);
    await Promise.all([fetchOrders(), fetchDeliveryBoys()]);
    setRefreshing(false);
  };

  const deliveryBoyMap = useMemo(() => {
    return deliveryBoys.reduce((acc, boy) => {
      acc[boy.id] = boy.name;
      return acc;
    }, {});
  }, [deliveryBoys]);

  const filteredOrders = useMemo(() => {
    return orders.filter((order) => {
      const matchesQuery = query
        ? order.id?.toLowerCase().includes(query.toLowerCase())
        : true;
      const matchesStatus = statusFilter === "All" ? true : order.orderStatus === statusFilter;
      const matchesPayment = paymentFilter === "All" ? true : order.paymentStatus === paymentFilter;
      return matchesQuery && matchesStatus && matchesPayment;
    });
  }, [orders, query, statusFilter, paymentFilter]);

  const sortedOrders = useMemo(() => {
    return [...filteredOrders].sort((a, b) => {
      const da = new Date(a.orderDate || 0).getTime();
      const db = new Date(b.orderDate || 0).getTime();
      return db - da;
    });
  }, [filteredOrders]);

  const stats = useMemo(() => {
    const total = orders.length;
    const placed = orders.filter((o) => o.orderStatus === "Order-Placed").length;
    const cooking = orders.filter((o) => o.orderStatus === "Cooking").length;
    const out = orders.filter((o) => o.orderStatus === "OutForDelivery").length;
    const revenue = orders.reduce((sum, o) => sum + (o.amount || 0), 0);
    return { total, placed, cooking, out, revenue };
  }, [orders]);

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
        <div className="page-header">
          <div>
            <h1 className="title">Live Orders</h1>
            <p className="subtitle">Track and manage active orders in real time</p>
            {lastUpdated && (
              <span className="last-updated">
                Last updated: {lastUpdated.toLocaleTimeString()}
              </span>
            )}
          </div>
          <button className="refresh-btn" onClick={handleRefresh} disabled={refreshing}>
            {refreshing ? "Refreshing..." : "Refresh"}
          </button>
        </div>

        <section className="stats-grid">
          <motion.div
            className="stat-card"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0 }}
          >
            <p>Total Orders</p>
            <h3>{stats.total}</h3>
          </motion.div>
          <motion.div
            className="stat-card"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <p>Order-Placed</p>
            <h3>{stats.placed}</h3>
          </motion.div>
          <motion.div
            className="stat-card"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <p>Cooking</p>
            <h3>{stats.cooking}</h3>
          </motion.div>
          <motion.div
            className="stat-card"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <p>Out For Delivery</p>
            <h3>{stats.out}</h3>
          </motion.div>
          <motion.div
            className="stat-card"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <p>Total Revenue</p>
            <h3>₹{stats.revenue}</h3>
          </motion.div>
        </section>

        <div className="filters-bar">
          <input
            className="search-input"
            type="text"
            placeholder="Search by Order ID"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
            <option value="All">All Status</option>
            <option value="Order-Placed">Order-Placed</option>
            <option value="Cooking">Cooking</option>
            <option value="OutForDelivery">OutForDelivery</option>
            <option value="Delivered">Delivered</option>
          </select>
          <select value={paymentFilter} onChange={(e) => setPaymentFilter(e.target.value)}>
            <option value="All">All Payments</option>
            <option value="Paid">Paid</option>
            <option value="Pending">Pending</option>
          </select>
        </div>

        <div className="table-wrapper">
          {loading ? (
            <div className="state-box">Loading orders...</div>
          ) : error ? (
            <div className="state-box error">{error}</div>
          ) : filteredOrders.length === 0 ? (
            <div className="state-box">No orders found</div>
          ) : (
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
              <AnimatePresence>
                {sortedOrders.map((order, index) => (
                  <React.Fragment key={order.id}>
                    <motion.tr
                      className="order-row"
                      onClick={() => toggleOrder(order.id)}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ delay: index * 0.02 }}
                    >
                      <td>
                        <span className="order-id">#{order.id.slice(-6)}</span>
                      </td>

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
                      <span className={`status-badge ${order.orderStatus}`}>{order.orderStatus}</span>
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
                      <div className="delivery-name">
                        {order.deliveryBoyId ? (deliveryBoyMap[order.deliveryBoyId] || "Assigned") : "Unassigned"}
                      </div>
                    </td>

                    <td>
                      {new Date(order.orderDate).toLocaleDateString()}
                    </td>

                    <td>
                      <span className="items-count">{order.items?.length || 0}</span>
                    </td>

                    <td className="payment-cell">
                      <span className={`payment-badge ${order.paymentStatus}`}>{order.paymentStatus}</span>
                    </td>

                    <td className="amount">₹{order.amount}</td>
                    </motion.tr>

                    {openOrderId === order.id && (
                      <motion.tr className="items-row">
                        <td colSpan="7">
                          <div className="items-box">
                            <h4>Order Items</h4>
                            <ul>
                              {order.items?.map((item, i) => (
                                <li key={i}>
                                  <span>{item.productId}</span>
                                  <span>× {item.quantity}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        </td>
                      </motion.tr>
                    )}
                </React.Fragment>
              ))}
              </AnimatePresence>
            </tbody>
          </table>
          )}
        </div>
      </main>
    </div>
  );
};

export default Admin;
