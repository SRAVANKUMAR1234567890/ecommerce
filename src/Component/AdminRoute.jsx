// Component/AdminRoute.jsx
import { Navigate } from "react-router-dom";

function AdminRoute({ children }) {
  const userEmail = localStorage.getItem("userEmail");
  const user = JSON.parse(localStorage.getItem("user") || "null");

  // fallback admin check (safe)
  const isAdmin =
    user?.role === "ADMIN" ||
    userEmail === "admin@gmail.com"; // optional fallback

  console.log("ADMIN CHECK:", user, userEmail);

  if (isAdmin) {
    return children;
  }

  return <Navigate to="/" />;
}

export default AdminRoute;