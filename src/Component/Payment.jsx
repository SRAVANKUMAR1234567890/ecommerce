import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";

function Payment() {
  const { state } = useLocation();
  const navigate = useNavigate();

  const items = state?.items || [];
  const total = state?.total || 0;

  const user = JSON.parse(localStorage.getItem("user"));
  const userId = user?.id;

  const handlePayment = async () => {
    const paymentId = "PAY_" + Date.now();

    try {
      for (let item of items) {

        // ✅ DEBUG (VERY IMPORTANT)
        console.log("ORDER ITEM:", item);

        // ✅ SAFE QUANTITY FIX
        const qty = item.quantity && item.quantity > 0 ? item.quantity : 1;

        await axios.post("http://localhost:8080/orders", {
          userId,
          productId: item.productId,
          quantity: qty,   // ✅ FIXED
          paymentId,
          paymentStatus: "PAID",
        });
      }

      // ✅ CLEAR CART AFTER SUCCESS
      await axios.delete(`http://localhost:8080/cart/clear/${userId}`);

      // ✅ UPDATE NAVBAR CART COUNT
      window.dispatchEvent(new Event("cartUpdated"));

      // ✅ GO TO SUCCESS PAGE
      navigate("/order-success");

    } catch (err) {
      console.log("PAYMENT ERROR:", err);
      alert("Payment Failed ❌");
    }
  };

  return (
    <div style={{ textAlign: "center", padding: "50px" }}>
      <h2>💳 Payment</h2>

      {/* ✅ SHOW ITEMS WITH QUANTITY */}
      {items.length === 0 ? (
        <p>No items found</p>
      ) : (
        items.map((item, i) => (
          <div key={i} style={{ marginBottom: "10px" }}>
            <p>
              {item.productName}  
              <br />
              ₹ {item.price} × {item.quantity || 1}
            </p>
          </div>
        ))
      )}

      <h3>Total: ₹ {total}</h3>

      <button
        onClick={handlePayment}
        style={{
          padding: "10px 20px",
          background: "green",
          color: "white",
          border: "none",
          cursor: "pointer",
          borderRadius: "5px"
        }}
      >
        PAY NOW
      </button>
    </div>
  );
}

export default Payment;