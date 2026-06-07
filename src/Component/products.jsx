import "./products.css";
import { useNavigate } from "react-router-dom";
import { useState, useEffect, useMemo } from "react";
import axios from "axios";

// LOCAL IMAGES
import tshirt from "./tshirt.jpg";
import watch from "./watch.jpg";
import shoes from "./shoes.jpg";
import cap from "./cap.jpg";
import shirt from "./shirt.jpg";

function Products({ searchText = "" }) {
  const navigate = useNavigate();

  const [products, setProducts] = useState([]);
  const [category, setCategory] = useState("ALL");
  const [subCategory, setSubCategory] = useState("ALL");

  const API = "http://localhost:8080/api";

  // ================= FETCH PRODUCTS =================
  useEffect(() => {
    axios
      .get(`${API}/products`)
      .then((res) => {
        setProducts(res.data);
      })
      .catch((err) => {
        console.error("PRODUCT FETCH ERROR:", err);
      });
  }, []);

  // ================= IMAGE MAP =================
  const imageMap = {
    "Men T-Shirt": tshirt,
    Watch: watch,
    Shoes: shoes,
    Cap: cap,
    Shirt: shirt,
  };

  // ================= FILTER =================
  const filteredProducts = useMemo(() => {
    return products.filter((item) => {
      const matchSearch = item.name
        ?.toLowerCase()
        .includes(searchText.toLowerCase());

      const matchCategory =
        category === "ALL" ||
        item.category?.toUpperCase() === category;

      const matchSubCategory =
        subCategory === "ALL" ||
        item.subCategory?.toLowerCase() === subCategory;

      return matchSearch && matchCategory && matchSubCategory;
    });
  }, [products, searchText, category, subCategory]);

  return (
    <div className="products-page">

      {/* ================= SIDEBAR ================= */}
      <div className="sidebar">

        <div className="category-filter-bar">
          {["ALL", "CLOTHING", "ACCESSORIES", "FOOTWEAR"].map((cat) => (
            <button
              key={cat}
              className={`filter-btn ${category === cat ? "active" : ""}`}
              onClick={() => {
                setCategory(cat);
                setSubCategory("ALL");
              }}
            >
              {cat}
            </button>
          ))}
        </div>

        {category !== "ALL" && (
          <div className="type-filter-wrapper">
            <h3 className="type-title">Type</h3>

            <div className="type-chips">
              {["ALL", "mens", "womens"].map((sub) => (
                <button
                  key={sub}
                  className={`type-chip ${subCategory === sub ? "active" : ""}`}
                  onClick={() => setSubCategory(sub)}
                >
                  {sub.toUpperCase()}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* ================= PRODUCTS GRID ================= */}
      <div className="products-container">

        {filteredProducts.length === 0 ? (
          <h2 className="no-results">No products found</h2>
        ) : (
          <div className="product-grid">

            {filteredProducts.map((item) => {

              const finalImage =
                imageMap[item.name] ||
                (item.imageUrl && item.imageUrl.startsWith("http")
                  ? item.imageUrl
                  : null) ||
                "https://picsum.photos/300";

              return (
                <div
                  className="product-card"
                  key={item.id}
                  onClick={() => navigate(`/product/${item.id}`)}   // ✅ FIXED HERE
                >
                  <img src={finalImage} alt={item.name} />

                  <h3 className="product-name">{item.name}</h3>

                  <p className="product-price">
                    ₹ {item.price?.toLocaleString()}
                  </p>
                </div>
              );
            })}

          </div>
        )}
      </div>
    </div>
  );
}

export default Products;