import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import womenBanner from "./women1.jpg";
import "./products.css";

import "./WomenWedding.css";

function WomenWedding() {
  const [products, setProducts] = useState([]);
  const navigate = useNavigate();





  useEffect(() => {
    axios.get("http://localhost:8080/api/products")
      .then((res) => {
        const filtered = res.data.filter(
          (p) =>
            p.category?.toUpperCase() === "WEDDING" &&
            p.subCategory?.toLowerCase() === "womens"
        );

        setProducts(filtered);
      })
      .catch((err) => console.log(err));
  }, []);








  

  return (
    <div>
      <img src={womenBanner} alt="Women Wedding Banner" style={{ width: "100%" }} />

      <div className="product-grid">
        {products.map((item) => (
          <div key={item.id} onClick={() => navigate("/product", { state: item })}>
            <img src={item.imageUrl} alt={item.name} />
            <h3>{item.name}</h3>
            <p>₹{item.price}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default WomenWedding;