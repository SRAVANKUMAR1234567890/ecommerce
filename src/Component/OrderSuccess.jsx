import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";

function OrderSuccess() {
  const navigate = useNavigate();

  useEffect(() => {
    setTimeout(() => {
      navigate("/orders");
    }, 1500);
  }, [navigate]);

  return (
    <div style={{ textAlign: "center", padding: "100px" }}>
      <h1>🎉 Order Placed Successfully!</h1>
      <p>Thank you for shopping with SravanLexi</p>
      <p>Redirecting to your orders...</p>
    </div>
  );
}

export default OrderSuccess;