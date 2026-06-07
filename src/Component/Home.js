import React from "react";
import Carousel from "./Carousel";
import Products from "./products";
import "./Home.css";

function Home({ searchText }) {
  return (
    <div className="home-page">

      {/* HERO SECTION */}
      <div id="home" className="hero-section">
        <Carousel />
      </div>

      {/* PRODUCTS SECTION */}
      <div id="products">
        <Products searchText={searchText} />
      </div>

    </div>
  );
}

export default Home;