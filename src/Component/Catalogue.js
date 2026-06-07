import React from "react";
import Products from "./products";

// 🔥 RECEIVE searchText from App
function Catalogue({ searchText }) {
  return (
    <div>

      {/* PAGE TITLE */}
      <h1 style={{ textAlign: "center", margin: "20px 0" }}>
     
      </h1>

      {/* PRODUCTS (Search + Category Filter works here) */}
      <Products searchText={searchText} />

    </div>
  );
}

export default Catalogue;