import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./AdminProducts.css";

function AdminProducts() {
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("all");
  const [loading, setLoading] = useState(false);

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  const navigate = useNavigate();

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const res = await axios.get("http://localhost:8080/api/products");
      setProducts(res.data || []);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this product?")) return;

    try {
      await axios.delete(`http://localhost:8080/api/products/${id}`);
      fetchProducts();
    } catch (err) {
      alert("Delete failed ❌");
    }
  };

  const handleEdit = (product) => {
    navigate("/admin/add-product", { state: { product } });
  };

  const filteredProducts = products
    .filter((p) =>
      p.name.toLowerCase().includes(search.toLowerCase())
    )
    .filter((p) =>
      category === "all" ? true : p.category === category
    );

  const indexOfLast = currentPage * itemsPerPage;
  const indexOfFirst = indexOfLast - itemsPerPage;
  const currentItems = filteredProducts.slice(indexOfFirst, indexOfLast);

  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);

  return (
    <div className="admin-products">

      {/* HEADER */}
      <div className="product-header">
        <h2>📦 Product Management</h2>

        <div className="filters">

          <input
            type="text"
            placeholder="Search products..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />

          <select onChange={(e) => setCategory(e.target.value)}>
            <option value="all">All Categories</option>
            
          </select>

        </div>
      </div>

      {/* LOADING */}
      {loading ? (
        <p>Loading products...</p>
      ) : currentItems.length === 0 ? (
        <p>No products found 😔</p>
      ) : (
        <div className="product-grid">

          {currentItems.map((p) => (
            <div className="product-card" key={p.id}>

              <img src={p.imageUrl} alt={p.name} />

              <h3>{p.name}</h3>
              <p className="price">₹ {p.price}</p>

              <div className="btn-group">

                <button
                  className="edit-btn"
                  onClick={() => handleEdit(p)}
                >
                  Edit
                </button>

                <button
                  className="delete-btn"
                  onClick={() => handleDelete(p.id)}
                >
                  Delete
                </button>

              </div>

            </div>
          ))}

        </div>
      )}

      {/* PAGINATION */}
      <div className="pagination">

        {Array.from({ length: totalPages }, (_, i) => (
          <button
            key={i}
            className={currentPage === i + 1 ? "active-page" : ""}
            onClick={() => setCurrentPage(i + 1)}
          >
            {i + 1}
          </button>
        ))}

      </div>

    </div>
  );
}

export default AdminProducts;