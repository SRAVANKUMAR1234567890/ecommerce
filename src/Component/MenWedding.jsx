import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import menBanner from "./mens.jpg";
import "./products.css";
import "./MenWedding.css";

function MenWedding() {
  const [products, setProducts] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    axios.get("http://localhost:8080/api/products")
      .then((res) => {
        const filtered = res.data.filter(
          (p) =>
            p.category?.toUpperCase() === "WEDDING" &&
            p.subCategory?.toLowerCase() === "mens"
        );

        setProducts(filtered);
      })
      .catch((err) => console.log(err));
  }, []);

  return (
    <div>

      {/* ✅ Banner */}
      <img
        src={menBanner}
        alt="Men Wedding Banner"
        className="banner-img"
      />

      {/* ✅ Products */}
      <div className="product-grid">
        {products.map((item) => (
          <div
            key={item.id}
            className="product-card"
            onClick={() => navigate("/product", { state: item })}
          >

            {/* ✅ FIX: VIDEO OR IMAGE */}
            {item.videoUrl ? (
              <video
                src={item.videoUrl}
                controls
                className="product-media"
              />
            ) : (
              <img
                src={item.imageUrl}
                alt={item.name}
                className="product-media"
              />
            )}

            <h3>{item.name}</h3>
            <p>₹{item.price}</p>

          </div>
        ))}
      </div>

    </div>
  );
}

export default MenWedding;