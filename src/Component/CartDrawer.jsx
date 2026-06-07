import React, { useEffect, useState, useCallback } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./CartDrawer.css";

function CartDrawer({ isOpen, onClose, refresh }) {
  const [cartItems, setCartItems] = useState([]);
  const navigate = useNavigate();

  const userId = JSON.parse(localStorage.getItem("user"))?.id;

  // ✅ FETCH CART (FIXED WITH useCallback)
  const fetchCart = useCallback(async () => {
    try {
      if (!userId) return;

      const res = await axios.get(
        `http://localhost:8080/cart/user/${userId}`
      );

      setCartItems(res.data);
    } catch (err) {
      console.error("Cart fetch error:", err);
    }
  }, [userId]);

  // ✅ useEffect FIXED
  useEffect(() => {
    if (isOpen) {
      fetchCart();
    }
  }, [isOpen, refresh, fetchCart]);

  // ✅ REMOVE ITEM
  const handleRemove = async (id) => {
    try {
      await axios.delete(`http://localhost:8080/cart/${id}`);
      fetchCart();
    } catch (err) {
      console.error("Remove error:", err);
    }
  };

  // ✅ UPDATE QUANTITY
  const handleUpdateQty = async (id, currentQty, delta) => {
    const newQty = currentQty + delta;
    if (newQty < 1) return;

    try {
      await axios.put(`http://localhost:8080/cart/update/${id}`, {
        quantity: newQty,
      });

      fetchCart();
    } catch (err) {
      console.error("Update error:", err);
    }
  };

  // ✅ SUBTOTAL
  const subtotal = cartItems.reduce(
    (acc, item) => acc + (item.price || 0) * (item.quantity || 0),
    0
  );

  // ✅ CHECKOUT
  const handleCheckout = () => {
    navigate("/checkout", {
      state: {
        items: cartItems,
        total: subtotal,
      },
    });
  };

  return (
    <>
      {/* OVERLAY */}
      <div
        className={`cart-overlay ${isOpen ? "active" : ""}`}
        onClick={onClose}
      ></div>

      {/* DRAWER */}
      <div className={`cart-drawer ${isOpen ? "open" : ""}`}>

        {/* HEADER */}
        <div className="cart-header">
          <h2>Your Cart</h2>
          <button className="close-x" onClick={onClose}>
            &times;
          </button>
        </div>

        {/* CONTENT */}
        <div className="cart-content">
          {cartItems.length === 0 ? (
            <p className="empty-cart">Cart is empty</p>
          ) : (
            cartItems.map((item) => (
              <div className="cart-item-card" key={item.id}>

                {/* IMAGE */}
                <div className="cart-item-img">
                  <img
                    src={item.productImage || "https://picsum.photos/80"}
                    alt={item.productName}
                  />
                </div>

                {/* INFO */}
                <div className="cart-item-info">

                  <div className="item-title-row">
                    <h4>{item.productName}</h4>
                    <span>₹ {item.price}</span>
                  </div>

                  <div className="item-controls-row">

                    {/* QTY */}
                    <div className="qty-mini-selector">
                      <button
                        onClick={() =>
                          handleUpdateQty(item.id, item.quantity, -1)
                        }
                      >
                        −
                      </button>

                      <span>{item.quantity}</span>

                      <button
                        onClick={() =>
                          handleUpdateQty(item.id, item.quantity, 1)
                        }
                      >
                        +
                      </button>
                    </div>

                    {/* REMOVE */}
                    <button
                      className="remove-link"
                      onClick={() => handleRemove(item.id)}
                    >
                      Remove
                    </button>

                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* FOOTER */}
        <div className="cart-footer">
          <div className="subtotal-row">
            <span>Subtotal</span>
            <span>₹ {subtotal}</span>
          </div>

          <button className="checkout-btn" onClick={handleCheckout}>
            CHECKOUT
          </button>
        </div>

      </div>
    </>
  );
}

export default CartDrawer;