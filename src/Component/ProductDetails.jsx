
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import axios from "axios";
import "./ProductDetails.css";

function ProductDetails({ openCart, refreshCart }) {
  const { state } = useLocation();
  const { id } = useParams();
  const navigate = useNavigate();

  const [product, setProduct] = useState(state || null);
  const [qty, setQty] = useState(1);
  const [adding, setAdding] = useState(false);
  const [zoomStyle, setZoomStyle] = useState({ display: "none" });

  // ✅ SAFE FETCH (ONLY if no state)
  useEffect(() => {
    if (!state && id) {
      axios
        .get(`http://localhost:8080/api/products/${id}`)  // ✅ IMPORTANT FIX
        .then((res) => setProduct(res.data))
        .catch((err) => console.log("PRODUCT FETCH ERROR:", err));
    }
  }, [id, state]);

  // ⛔ loading state
  if (!product) {
    return <h2 style={{ textAlign: "center" }}>Loading Product...</h2>;
  }

  const imageSrc =
    product.finalImage || product.imageUrl || product.image;

  const handleZoom = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    setZoomStyle({
      display: "block",
      backgroundImage: `url(${imageSrc})`,
      backgroundPosition: `${(x / rect.width) * 100}% ${(y / rect.height) * 100}%`,
      left: `${x - 80}px`,
      top: `${y - 80}px`,
    });
  };
  const handleAddToCart = async () => {
    setAdding(true);

    try {
      const userId = JSON.parse(localStorage.getItem("user"))?.id;

      if (!userId) {
        alert("Please login first");
        navigate("/login");
        return;
      }

      await axios.post("http://localhost:8080/cart/add", {
        userId,
        productId: product.id,
        productName: product.name,
        productImage: imageSrc,
        price: product.price,

        // ✅ FIX: ALWAYS SEND 1
        quantity: 1
      });

      window.dispatchEvent(new Event("cartUpdated"));
      refreshCart();
      openCart();

    } catch (err) {
      console.log(err);
    } finally {
      setAdding(false);
    }
  };




  const handleBuyNow = () => {
    const userId = JSON.parse(localStorage.getItem("user"))?.id;

    if (!userId) {
      alert("Please login first");
      navigate("/login");
      return;
    }

    navigate("/checkout", {
      state: {
        ...product,
        qty
      }
    });
  };



  return (
    <div className="product-page-container">
      <div className="product-wrapper">

        <div className="product-visual">
          <div
            className="image-frame"
            onMouseMove={handleZoom}
            onMouseLeave={() => setZoomStyle({ display: "none" })}
          >
            <img src={imageSrc} alt={product.name} />
            <div className="zoom-lens" style={zoomStyle}></div>
          </div>
        </div>

        <div className="product-content">
          <p className="sku-label">SKU: MZH-25844</p>

          <h1 className="product-title">{product.name}</h1>
          <p className="product-price">₹ {product.price}</p>

          <div className="purchase-stack">

            <div className="qty-group">
              <label>Quantity</label>
              <div className="qty-controls">
                <button onClick={() => qty > 1 && setQty(qty - 1)}>−</button>
                <input value={qty} readOnly />
                <button onClick={() => setQty(qty + 1)}>+</button>
              </div>
            </div>

            <button
              className={`btn-add-cart ${adding ? "loading" : ""}`}
              onClick={handleAddToCart}
              disabled={adding}
            >
              {adding ? "ADDING..." : "ADD TO CART"}
            </button>

            <button className="btn-buy-now" onClick={handleBuyNow}>
              BUY IT NOW
            </button>

          </div>

          <div className="feature-badges">
            <span>✨ Hand Crafted</span>
            <span>💵 COD Available</span>
            <span>🚚 Free Delivery</span>
          </div>

          <div className="desc-box">
            <hr />
            <p>{product.description}</p>
          </div>

        </div>
      </div>
    </div>
  );
}

export default ProductDetails;
