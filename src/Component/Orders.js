import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom"; // ✅ NEW
import "./Orders.css";

function Orders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate(); // ✅ NEW

  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const userId = user?.id;

  useEffect(() => {
    if (!userId) {
      setLoading(false);
      return;
    }

    const fetchOrders = async () => {
      try {
        const res = await axios.get(
          `http://localhost:8080/orders/user/${userId}`
        );
        setOrders(res.data);
      } catch (err) {
        console.log("ORDER FETCH ERROR:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [userId]);

  // ✅ REMOVE DUPLICATES
  const uniqueOrders = Object.values(
    orders.reduce((acc, order) => {
      acc[order.productId] = order;
      return acc;
    }, {})
  );

  if (loading) {
    return (
      <div className="orders-page">
        <h2 className="orders-title">My Orders</h2>
        <p>Loading orders...</p>
      </div>
    );
  }

  return (
    <div className="orders-page">
      <h2 className="orders-title">My Orders</h2>

      {uniqueOrders.length === 0 ? (
        <p className="no-orders">No orders yet</p>
      ) : (
        <div className="orders-container">
          {uniqueOrders.map((order) => {
            const image =
              order.imageUrl || order.image || "https://picsum.photos/100";

            return (
              <div className="order-card" key={order.id}>
                
                {/* ✅ IMAGE */}
                <div className="order-img">
                  <img
                    src={image}
                    alt={order.productName}
                    onError={(e) => {
                      e.target.src = "https://picsum.photos/100";
                    }}
                  />
                </div>

                {/* ✅ INFO */}
                <div className="order-info">
                  <h3 className="product-name">{order.productName}</h3>

                  <p className="order-meta">Order ID: #{order.id}</p>
                  <p className="order-meta">Qty: {order.quantity}</p>

                  <p className="price">
                    ₹ {order.price * order.quantity}
                  </p>

                  <p className="order-meta">
                    Payment: {order.paymentStatus}
                  </p>

                  {/* ✅ VIEW PRODUCT BUTTON */}
                  <button
                    className="view-btn"
                    onClick={() => navigate(`/product/${order.productId}`)}
                  >
                    View Product
                  </button>
                </div>

                {/* ✅ STATUS */}
                <div className="order-status-box">
                  <span className="badge completed">
                    {order.orderStatus}
                  </span>
                </div>

              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default Orders;