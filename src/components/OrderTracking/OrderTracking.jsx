import React from "react";
import "./OrderTracking.css";

const OrderTracking = ({ status }) => {
  // Expected status: "PLACED" | "SHIPPED" | "DELIVERED"
  const steps = [
    { label: "Order Placed", value: "PLACED", img: <i className="fa-solid fa-bag-shopping"></i> },
    { label: "Shipped", value: "SHIPPED", img: <i className="fa-solid fa-truck-fast"></i> },
    { label: "Delivered", value: "DELIVERED", img: <i className="fa-solid fa-box-open"></i> },
  ];

  const getStepClass = (stepValue) => {
    const orderFlow = ["PLACED", "SHIPPED", "DELIVERED"];
    const currentIndex = orderFlow.indexOf(status);
    const stepIndex = orderFlow.indexOf(stepValue);

    if (stepIndex < currentIndex) return "done";
    if (stepIndex === currentIndex) return "active";
    return "pending";
  };

  return (
    <div className="order-tracking-container">
      <h2>Order Tracking</h2>
      <div className="order-steps">
        {steps.map((step, index) => (
          <div className="step" key={index}>
            <div className={`circle ${getStepClass(step.value)}`}>{step.img}</div>
            <p className={`label ${getStepClass(step.value)}`}>{step.label}</p>
            {index < steps.length - 1 && (
              <div
                className={`line ${getStepClass(step.value)} ${
                  getStepClass(steps[index + 1].value) !== "pending" ? "fill-animate" : ""
                }`}
              ></div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default OrderTracking;
