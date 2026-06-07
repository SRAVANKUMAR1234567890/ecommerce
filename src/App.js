import './App.css';
import { useState } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { GoogleOAuthProvider } from '@react-oauth/google';

// Components
import Navbar from './Component/Navbar';
import Home from './Component/Home';
import GIFITING from './Component/GIFITING';
import Brands from './Component/Brands';
import Catalogue from './Component/Catalogue';
import Wedding from './Component/Wedding';
import Corporate from './Component/Corporate';
import Login from './Component/Login';
import SignUp from './Component/SignUp';
import Profile from './Component/Profile';
import Address from './Component/Address';
import Orders from './Component/Orders';
import Wishlist from './Component/Wishlist';
import ProductDetails from './Component/ProductDetails';
import CartDrawer from './Component/CartDrawer';
import WomenWedding from './Component/WomenWedding';
import MenWedding from './Component/MenWedding';
import Footer from './Component/Footer';
import Checkout from './Component/Checkout';
import Payment from './Component/Payment';
import OrderSuccess from './Component/OrderSuccess';

// ✅ ADMIN
import AdminRoute from "./Component/AdminRoute";
import AdminProducts from "./Component/AdminProducts";
import AdminAddProduct from "./Component/AdminAddProduct";
import AdminDashboard from "./Component/AdminDashboard";

// 🔒 Private Route
const PrivateRoute = ({ children }) => {
  const user = localStorage.getItem("userEmail");
  return user ? children : <Navigate to="/login" />;
};

function App() {
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [cartRefresh, setCartRefresh] = useState(false);
  const [searchText, setSearchText] = useState("");

  const openCart = () => setIsCartOpen(true);
  const closeCart = () => setIsCartOpen(false);

  const triggerCartRefresh = () => {
    setCartRefresh(prev => !prev);
  };

  return (
    <GoogleOAuthProvider clientId="843743080195-mvflmtag5gkumcln5aq7p7ich3jet080.apps.googleusercontent.com">
      <div className="app-container">

        {/* NAVBAR */}
        <Navbar
          onCartClick={openCart}
          setSearchText={setSearchText}
          cartRefresh={cartRefresh}
        />

        {/* CART */}
        <CartDrawer
          isOpen={isCartOpen}
          onClose={closeCart}
          refresh={cartRefresh}
        />

        {/* ROUTES */}
        <Routes>

          {/* PUBLIC */}
          <Route path="/" element={<Home searchText={searchText} />} />
          <Route path="/gifting" element={<GIFITING />} />
          <Route path="/brands" element={<Brands />} />
          <Route path="/catalogue" element={<Catalogue searchText={searchText} />} />

          {/* WEDDING */}
          <Route path="/wedding" element={<Wedding />} />
          <Route path="/wedding/womens" element={<WomenWedding />} />
          <Route path="/wedding/mens" element={<MenWedding />} />

          {/* CHECKOUT FLOW */}
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/payment" element={<Payment />} />
          <Route path="/order-success" element={<OrderSuccess />} />

          {/* AUTH */}
          <Route path="/corporate" element={<Corporate />} />
          <Route path="/login" element={<Login />} />
          <Route path="/sign" element={<SignUp />} />

          {/* PRODUCT */}
          <Route
            path="/product/:id"
            element={
              <ProductDetails
                openCart={openCart}
                refreshCart={triggerCartRefresh}
              />
            }
          />

          {/* ================= ADMIN (FIXED) ================= */}

          {/* ✅ Dashboard (MAIN ADMIN PAGE) */}
          <Route
            path="/admin"
            element={
              <AdminRoute>
                <AdminDashboard />
              </AdminRoute>
            }
          />

          {/* ✅ Products */}
          <Route
            path="/admin/products"
            element={
              <AdminRoute>
                <AdminProducts />
              </AdminRoute>
            }
          />

          {/* ✅ Add Product */}
          <Route
            path="/admin/add-product"
            element={
              <AdminRoute>
                <AdminAddProduct />
              </AdminRoute>
            }
          />

          {/* 🔒 PRIVATE */}
          <Route path="/profile" element={<PrivateRoute><Profile /></PrivateRoute>} />
          <Route path="/address" element={<PrivateRoute><Address /></PrivateRoute>} />
          <Route path="/orders" element={<PrivateRoute><Orders /></PrivateRoute>} />
          <Route path="/wishlist" element={<PrivateRoute><Wishlist /></PrivateRoute>} />

        </Routes>

        {/* FOOTER */}
        <Footer />

      </div>
    </GoogleOAuthProvider>
  );
}

export default App;