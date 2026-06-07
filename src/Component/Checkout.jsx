
import { useState, useEffect, useCallback } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import Address from "./Address";
import "./Checkout.css";

function Checkout() {
  const { state } = useLocation();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [addresses, setAddresses] = useState([]);
  const [selectedAddress, setSelectedAddress] = useState(null);

  const [showForm, setShowForm] = useState(false);
  const [editAddress, setEditAddress] = useState(null);

  const user = JSON.parse(localStorage.getItem("user"));
  const userId = user?.id;
  const userEmail = user?.email;

  // ================= ITEMS =================
  const items = state?.items || [
    {
      productId: state?.id,
      productName: state?.name,
      price: state?.price,
      quantity: state?.qty || state?.quantity || 1,
      productImage: state?.image || state?.imageUrl,
    },
  ];

  // ================= FETCH ADDRESSES =================
  const fetchAddresses = useCallback(() => {
    if (!userEmail) return;

    axios
      .get(`http://localhost:8080/address/${userEmail}`)
      .then((res) => {
        setAddresses(res.data);

        // auto select first address
        if (res.data.length > 0) {
          setSelectedAddress(res.data[0]);
        } else {
          setSelectedAddress(null);
        }
      })
      .catch((err) => console.log(err));
  }, [userEmail]);

  useEffect(() => {
    fetchAddresses();
  }, [fetchAddresses]);

  // ================= DELETE ADDRESS =================
  const handleDeleteAddress = async (id) => {
    if (!window.confirm("Delete this address?")) return;

    try {
      await axios.delete(`http://localhost:8080/address/${id}`);

      // refresh list
      fetchAddresses();

      // reset selection if deleted one was selected
      if (selectedAddress?.id === id) {
        setSelectedAddress(null);
      }

    } catch (err) {
      console.log(err);
      alert("Delete failed ❌");
    }
  };

  // ================= PLACE ORDER =================
  const handlePlaceOrder = async () => {
    if (!selectedAddress) {
      alert("Please select an address ❗");
      return;
    }

    setLoading(true);

    try {
      for (let item of items) {
        await axios.post("http://localhost:8080/orders", {
          userId,
          productId: item.productId,
          quantity: item.quantity,
          paymentStatus: "PENDING",
          addressId: selectedAddress.id,
        });
      }

      navigate("/payment", {
        state: {
          items,
          address: selectedAddress,
          total: items.reduce(
            (sum, i) => sum + Number(i.price) * Number(i.quantity),
            0
          ),
        },
      });

    } catch (err) {
      console.log(err);
      alert("Order Failed ❌");
    } finally {
      setLoading(false);
    }
  };

  if (!items || items.length === 0) {
    return <h2 style={{ textAlign: "center" }}>No Items Found</h2>;
  }

  const totalPrice = items.reduce(
    (sum, i) => sum + Number(i.price) * Number(i.quantity),
    0
  );

  return (
    <div className="checkout-container">

      {/* ================= LEFT ================= */}
      <div className="checkout-left">

        <div className="section-header">
          <h2>Select Address</h2>

          <button
            className="add-new-btn"
            onClick={() => {
              setEditAddress(null);
              setShowForm(true);
            }}
          >
            + Add New
          </button>
        </div>

        {/* ADDRESS FORM MODAL */}
        {showForm && (
          <Address
            editData={editAddress}
            userEmail={userEmail}
            onClose={() => {
              setShowForm(false);
              fetchAddresses();
            }}
          />
        )}

        {/* EMPTY STATE */}
        {addresses.length === 0 && (
          <p>No address found. Add one.</p>
        )}

        {/* ADDRESS LIST */}
        {addresses.map((addr) => (
          <div
            key={addr.id}
            className={`address-card ${selectedAddress?.id === addr.id ? "active" : ""
              }`}
            onClick={() => setSelectedAddress(addr)}
          >

            <div className="card-main">

              <input
                type="radio"
                checked={selectedAddress?.id === addr.id}
                readOnly
              />

              <div className="details">
                <h4>{addr.fullName}</h4>
                <p>{addr.mobile}</p>
                <p>{addr.addressLine}</p>
                <p>
                  {addr.city}, {addr.state} - {addr.pincode}
                </p>
              </div>
            </div>

            {/* EDIT + DELETE */}
            <div className="card-footer">

              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setEditAddress(addr);
                  setShowForm(true);
                }}
              >
                Edit
              </button>

              <button
                className="delete-btn"
                onClick={(e) => {
                  e.stopPropagation();
                  handleDeleteAddress(addr.id);
                }}
              >
                Delete
              </button>

            </div>

          </div>
        ))}

      </div>

      {/* ================= RIGHT ================= */}
      <div className="checkout-right">

        <h2>Order Summary</h2>

        {items.map((item, i) => (
          <div key={i} className="product-summary">

            <img
              src={item.productImage || "https://picsum.photos/80"}
              alt=""
            />

            <div className="prod-info">
              <p>{item.productName}</p>
              <p>₹ {item.price}</p>
              <p>Qty: {item.quantity}</p>
            </div>

          </div>
        ))}

        <hr />

        <div className="total-row">
          <span>Total</span>
          <span>₹ {totalPrice}</span>
        </div>

        <button
          className="order-submit-btn"
          onClick={handlePlaceOrder}
          disabled={loading}
        >
          {loading ? "Processing..." : "Place Order"}
        </button>

      </div>

    </div>
  );
}

export default Checkout;
