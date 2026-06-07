import { useState, useEffect } from "react";
import axios from "axios";
import { useLocation, useNavigate } from "react-router-dom";
import "./AdminAddProduct.css";

function AdminAddProduct() {
  const [loading, setLoading] = useState(false);

  const location = useLocation();
  const navigate = useNavigate();

  const editProduct = location.state?.product;

  const [product, setProduct] = useState({
    name: "",
    category: "",
    subCategory: "",
    price: "",
    description: "",
    imageUrl: "",
    videoUrl: "",
  });

  useEffect(() => {
    if (editProduct) {
      setProduct(editProduct);
    }
  }, [editProduct]);

  const handleChange = (e) => {
    setProduct({ ...product, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!product.name || !product.price) {
      alert("Name & Price required ❗");
      return;
    }

    setLoading(true);

    try {
      if (editProduct) {
        await axios.put(
          `http://localhost:8080/api/products/${editProduct.id}`,
          { ...product, price: Number(product.price) }
        );
        alert("Product Updated ✅");
      } else {
        await axios.post("http://localhost:8080/api/products", {
          ...product,
          price: Number(product.price),
        });
        alert("Product Added ✅");
      }

      navigate("/admin/products");
    } catch (err) {
      console.log(err);
      alert("Error ❌");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="glass-page">

      <div className="glass-card">

        <h2>
          {editProduct ? "✏ Edit Product" : "➕ Add Product"}
        </h2>

        <p className="subtext">Fill product details carefully</p>

        <form onSubmit={handleSubmit} className="glass-form">

          <input name="name" placeholder="Product Name" value={product.name} onChange={handleChange} />

          <div className="row">
            <input name="category" placeholder="Category" value={product.category} onChange={handleChange} />
            <input name="subCategory" placeholder="Sub Category" value={product.subCategory} onChange={handleChange} />
          </div>

          <input name="price" type="number" placeholder="Price" value={product.price} onChange={handleChange} />

          <textarea name="description" placeholder="Description" value={product.description} onChange={handleChange} />

          <input name="imageUrl" placeholder="Image URL" value={product.imageUrl} onChange={handleChange} />

          <input name="videoUrl" placeholder="Video URL" value={product.videoUrl} onChange={handleChange} />

          <button type="submit" disabled={loading}>
            {loading ? "Processing..." : editProduct ? "Update Product" : "Add Product"}
          </button>

        </form>

      </div>

    </div>
  );
}

export default AdminAddProduct;