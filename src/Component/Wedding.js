import React from "react";
import { useNavigate } from "react-router-dom";
import womenBanner from "./women1.jpg";
import menBanner from "./mens.jpg";
import "./Wedding.css";

function Wedding() {

  const navigate = useNavigate();

  return (
    <div className="wedding-page">

      {/* 💎 HERO TITLE */}
      <div className="wedding-header">
        <h1>Wedding Collection</h1>
        <p>Elegance crafted for your special day</p>
      </div>

      {/* 👑 CATEGORY CARDS */}
      <div className="category-section">

        {/* WOMEN */}
        <div
          className="category-card"
          onClick={() => navigate("/wedding/womens")}
        >
          <img src={womenBanner} alt="Women" />

          <div className="overlay">
            <h2>Women</h2>
          </div>
        </div>

        {/* MEN */}
        <div
          className="category-card"
          onClick={() => navigate("/wedding/mens")}
        >
          <img src={menBanner} alt="Men" />

          <div className="overlay">
            <h2>Men</h2>
          </div>
        </div>

      </div>

    </div>
  );
}

export default Wedding;