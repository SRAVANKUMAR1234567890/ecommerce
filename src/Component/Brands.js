import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Carousel } from "react-responsive-carousel"; // ✅ Import Carousel
import "react-responsive-carousel/lib/styles/carousel.min.css"; // ✅ Import Styles
import "./products.css"; 

// Import your local images
import h from "./h.jpg"; 

// import s2 from "./s6.jpg"; // You can add more for the slider!

function Brands() {
  const [products, setProducts] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetchBrandProducts();
  }, []);

  const fetchBrandProducts = async () => {
    try {
      const res = await axios.get("http://localhost:8080/products/category/BRANDS");
      setProducts(res.data);
    } catch (err) {
      console.error("Error fetching brand products:", err);
    }
  };

  return (
    <div className="brands-page">
      
      {/* --- CAROUSEL SECTION --- */}
      <div className="brands-carousel-wrapper">
        <Carousel 
          autoPlay 
          infiniteLoop 
          showStatus={false} 
          showThumbs={false} 
          interval={3000}
        >
          <div>
            <img src={h} alt="Banner 1" style={{ height: "450px", objectFit: "cover" }} />
          </div>
          {/* Add more <div><img></div> tags here for more slides */}
        </Carousel>
      </div>

      <div className="products-page">
        <h2 style={{ textAlign: "center", margin: "30px 0", fontWeight: "300", letterSpacing: "2px" }}>
          VERSACE & PREMIUM BRANDS
        </h2>

        <div className="product-grid">
          {products.length === 0 ? (
            <div style={{ textAlign: "center", width: "100%", padding: "50px" }}>
                <h3>No Branded Products Found</h3>
                <p>Post to: <code>/products/category/BRANDS</code> in Postman</p>
            </div>
          ) : (
            products.map((item) => (
              <div
                key={item.id}
                className="product-card"
                onClick={() => navigate("/product", { state: item })}
              >
                <div className="product-image-wrapper">
                  <img src={item.imageUrl} alt={item.name} />
                </div>
                <div className="product-info">
                  <h3>{item.name}</h3>
                  <p>₹ {item.price}</p>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

export default Brands;