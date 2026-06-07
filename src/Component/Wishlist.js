import { useEffect, useState, useCallback } from "react";
import axios from "axios";
import "./Wishlist.css";

function Wishlist() {

  const [items, setItems] = useState([]);

  const userEmail = localStorage.getItem("userEmail");

  // ✅ FIX: useCallback added
  const fetchWishlist = useCallback(async () => {
    if (!userEmail) return;

    try {
      const res = await axios.get(
        `http://localhost:8080/wishlist/${userEmail}`
      );
      setItems(res.data);
    } catch (err) {
      console.log(err);
    }
  }, [userEmail]);

  // ✅ FIX: dependency added
  useEffect(() => {
    fetchWishlist();
  }, [fetchWishlist]);

  // ✅ REMOVE ITEM
  const removeItem = async (id) => {
    try {
      await axios.delete(`http://localhost:8080/wishlist/${id}`);
      fetchWishlist();
    } catch (err) {
      console.log(err);
    }
  };

  // ✅ MOVE TO CART
  const moveToCart = async (item) => {
    try {
      await axios.post("http://localhost:8080/cart", {
        userId: 1,
        productId: item.productId,
        productName: item.productName,
        productImage: item.productImage,
        price: item.price,
        quantity: 1
      });

      await axios.delete(`http://localhost:8080/wishlist/${item.id}`);

      fetchWishlist();
      alert("Moved to cart ✅");

    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="wishlist-container">

      <h2>My Wishlist ❤️</h2>

      {!userEmail ? (
        <p className="empty-msg">Please login to see wishlist</p>
      ) : items.length === 0 ? (
        <p className="empty-msg">Your wishlist is empty</p>
      ) : (
        <div className="wishlist-grid">

          {items.map(item => (
            <div key={item.id} className="wishlist-card">

              <img src={item.productImage} alt={item.productName} />

              <h4>{item.productName}</h4>
              <p>₹ {item.price}</p>

              <div className="wishlist-actions">

                <button onClick={() => moveToCart(item)}>
                  Move to Cart
                </button>

                <button
                  className="remove-btn"
                  onClick={() => removeItem(item.id)}
                >
                  Remove
                </button>

              </div>

            </div>
          ))}

        </div>
      )}

    </div>
  );
}

export default Wishlist;