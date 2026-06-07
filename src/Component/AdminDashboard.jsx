import React, { useEffect, useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  CartesianGrid,
} from "recharts";
import axios from "axios";
import "./AdminDashboard.css";

function AdminDashboard() {
  const [stats, setStats] = useState({
    orders: 0,
    revenue: 0,
    products: 0,
    users: 0,
  });

  const [salesData, setSalesData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {

        // ✅ FIXED API (IMPORTANT)
        const ordersRes = await axios.get("http://localhost:8080/orders/admin/orders");
        const productsRes = await axios.get("http://localhost:8080/api/products");

        const orders = Array.isArray(ordersRes.data)
          ? ordersRes.data
          : [];

        const products = Array.isArray(productsRes.data)
          ? productsRes.data
          : [];

        console.log("ORDERS DEBUG:", orders);

        // ==============================
        // ✅ CLEAN REVENUE CALCULATION
        // ==============================
        const revenue = orders.reduce((sum, order) => {
          const price = Number(order.price || 0);
          const qty = Number(order.quantity || 1);
          return sum + price * qty;
        }, 0);

        // ==============================
        // 👥 USERS COUNT
        // ==============================
        const users = new Set(
          orders.map(
            (o) => o.userId || o.user?.id || o.customerId || o.email
          )
        ).size;

        // ==============================
        // 📊 MONTHLY SALES
        // ==============================
        const monthlyMap = {};

        orders.forEach((order) => {
          // ✅ FIXED DATE FIELD
          const date = new Date(order.orderDate || Date.now());
          const month = date.toLocaleString("default", { month: "short" });

          const price = Number(order.price || 0);
          const qty = Number(order.quantity || 1);

          const amount = price * qty;

          monthlyMap[month] = (monthlyMap[month] || 0) + amount;
        });

        const chartData = Object.keys(monthlyMap).map((m) => ({
          month: m,
          sales: monthlyMap[m],
        }));

        setStats({
          orders: orders.length,
          products: products.length,
          revenue,
          users,
        });

        setSalesData(
          chartData.length
            ? chartData
            : [
                { month: "Jan", sales: 0 },
                { month: "Feb", sales: 0 },
              ]
        );

      } catch (err) {
        console.log("Dashboard error:", err);
      }
    };

    fetchData();
  }, []);



return (
  <div className="admin-dashboard">

    <div className="dashboard-header">
      <h1 className="title">📊 Admin Dashboard</h1>
      <p className="subtitle">Welcome back! Here is your store overview.</p>
    </div>

    <div className="stats-grid">

      <div className="card blue">
        <h2>{stats.orders}</h2>
        <p>Total Orders</p>
      </div>

      <div className="card green">
        <h2>₹ {stats.revenue}</h2>
        <p>Total Revenue</p>
      </div>

      <div className="card orange">
        <h2>{stats.products}</h2>
        <p>Total Products</p>
      </div>

      <div className="card purple">
        <h2>{stats.users}</h2>
        <p>Customers</p>
      </div>

    </div>

    <div className="charts-container">

      <div className="chart-box">
        <h3>📈 Sales Overview</h3>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={salesData}>
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip />
            <Line type="monotone" dataKey="sales" stroke="#6366f1" strokeWidth={3} />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div className="chart-box">
        <h3>📊 Monthly Revenue</h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={salesData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="sales" fill="#10b981" />
          </BarChart>
        </ResponsiveContainer>
      </div>

    </div>

  </div>
);



}

export default AdminDashboard;