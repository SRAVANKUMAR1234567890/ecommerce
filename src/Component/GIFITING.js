import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./products.css";
import "./GIFITING.css";

function GIFITING() {

  const [products, setProducts] = useState([]);
  const navigate = useNavigate();

useEffect(() => {
  axios
    .get("http://localhost:8080/api/products/category/GIFTING")
    .then((res) => {
      console.log("GIFTING DATA:", res.data); // 🔥 ADD THIS
      setProducts(res.data);
    })
    .catch((err) => console.log(err));
}, []);

  return (
    <div className="product-grid">

      {products.length === 0 ? (
        <h2 style={{ textAlign: "center" }}>No Products Found</h2>
      ) : (
        products.map((item) => (
          <div
            key={item.id}

            // ✅ FIX ROUTE
            onClick={() =>
              navigate(`/product/${item.id}`, { state: item })
            }
          >
            <img src={item.imageUrl} alt={item.name} />
            <h3>{item.name}</h3>
            <p>₹{item.price}</p>
          </div>
        ))
      )}

    </div>
  );
}

export default GIFITING;