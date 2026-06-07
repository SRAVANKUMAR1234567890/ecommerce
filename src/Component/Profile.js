import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import "./Profile.css";
import { FaEdit, FaMapMarkerAlt, FaBox, FaTrash } from "react-icons/fa";
import Address from "./Address";
import axios from "axios";

function Profile() {
  const navigate = useNavigate();
  const fileRef = useRef();

  const [user, setUser] = useState(null);
  const [image, setImage] = useState("/user.png");

  const [showModal, setShowModal] = useState(false);
  const [showAddress, setShowAddress] = useState(false);
  const [editAddress, setEditAddress] = useState(null);

  const [addresses, setAddresses] = useState([]);
  const [editData, setEditData] = useState({ name: "", mobile: "" });

  // ================= LOAD USER =================
  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user"));

    if (storedUser) {
      setUser(storedUser);

      setEditData({
        name: storedUser.name || "",
        mobile: storedUser.mobile || ""
      });

      if (storedUser.profileImage) {
        setImage(storedUser.profileImage);
      }

      if (storedUser.email) {
        fetchAddresses(storedUser.email);
      }
    }
  }, []);

  // ================= FETCH ADDRESSES =================
  const fetchAddresses = async (email) => {
    try {
      const res = await axios.get(
        `http://localhost:8080/address/${email}`
      );
      setAddresses(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  // ================= DELETE ADDRESS =================
  const deleteAddress = async (id) => {
    try {
      await axios.delete(
        `http://localhost:8080/address/delete/${id}`
      );
      fetchAddresses(user.email);
    } catch (err) {
      console.log(err);
    }
  };

  // ================= IMAGE UPLOAD (FIXED) =================
  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    if (!file || !user) return;

    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await axios.post(
        `http://localhost:8080/users/upload/${user.id}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data"
          }
        }
      );

      const updatedUser = res.data;

      setUser(updatedUser);
      setImage(updatedUser.profileImage);

      localStorage.setItem("user", JSON.stringify(updatedUser));

    } catch (err) {
      console.log("Image upload failed", err);
    }
  };

  // ================= PROFILE UPDATE =================
  const handleSave = () => {
    const updatedUser = { ...user, ...editData };

    setUser(updatedUser);
    localStorage.setItem("user", JSON.stringify(updatedUser));

    setShowModal(false);
  };

  // ================= LOGIN CHECK =================
  if (!user) {
    return (
      <div className="empty-box">
        <h2>Please login first</h2>
        <button onClick={() => navigate("/login")}>Login</button>
      </div>
    );
  }

  return (
    <div className="profile-container">

      {/* ================= SIDEBAR ================= */}
      <div className="profile-sidebar">

        <div className="avatar-box">
          <img
            src={image || "/user.png"}
            alt="profile"
            className="avatar-img"
          />

          <div
            className="edit-icon"
            onClick={() => fileRef.current.click()}
          >
            <FaEdit />
          </div>

          <input
            type="file"
            hidden
            ref={fileRef}
            onChange={handleImageChange}
          />
        </div>

        <h3>{user.name}</h3>
        <p>{user.email}</p>

        <button onClick={() => setShowModal(true)}>
          Edit Profile
        </button>

        <button onClick={() => navigate("/orders")}>
          My Orders
        </button>

        <button onClick={() => setShowAddress(true)}>
          My Address
        </button>

      </div>

      {/* ================= CONTENT ================= */}
      <div className="profile-content">

        {/* DASHBOARD */}
        <div className="dashboard-cards">

          <div className="dash-card" onClick={() => navigate("/orders")}>
            <FaBox />
            <h4>Orders</h4>
          </div>

          <div className="dash-card" onClick={() => setShowAddress(true)}>
            <FaMapMarkerAlt />
            <h4>Address</h4>
          </div>

          <div className="dash-card" onClick={() => setShowModal(true)}>
            <FaEdit />
            <h4>Edit</h4>
          </div>

        </div>

        {/* ACCOUNT DETAILS */}
        <div className="details-card glass">
          <h3>Account Details</h3>
          <p><b>Name:</b> {user.name}</p>
          <p><b>Email:</b> {user.email}</p>
          <p><b>Mobile:</b> {user.mobile || "Not added"}</p>
        </div>

        {/* ADDRESSES */}
        <div className="address-section glass">
          <h3>Saved Addresses</h3>

          {addresses.length === 0 ? (
            <p>No addresses found</p>
          ) : (
            addresses.map((a) => (
              <div className="address-card" key={a.id}>
                <p><b>{a.fullName}</b></p>
                <p>{a.mobile}</p>
                <p>{a.addressLine}, {a.city}</p>

                <div className="addr-actions">
                  <button onClick={() => {
                    setEditAddress(a);
                    setShowAddress(true);
                  }}>
                    Edit
                  </button>

                  <button onClick={() => deleteAddress(a.id)}>
                    <FaTrash />
                  </button>
                </div>
              </div>
            ))
          )}

          <button
            className="primary-btn"
            onClick={() => {
              setEditAddress(null);
              setShowAddress(true);
            }}
          >
            + Add New Address
          </button>

        </div>

      </div>

      {/* ================= ADDRESS DRAWER ================= */}
      {showAddress && (
        <div className="drawer-overlay">
          <div className="drawer">
            <Address
              userEmail={user.email}
              editData={editAddress}
              onClose={() => {
                setShowAddress(false);
                setEditAddress(null);
                fetchAddresses(user.email);
              }}
            />
          </div>
        </div>
      )}

      {/* ================= PROFILE MODAL ================= */}
      {showModal && (
        <div className="modal-backdrop">
          <div className="modal glass">

            <h3>Edit Profile</h3>

            <input
              value={editData.name}
              onChange={(e) =>
                setEditData({ ...editData, name: e.target.value })
              }
              placeholder="Name"
            />

            <input
              value={editData.mobile}
              onChange={(e) =>
                setEditData({ ...editData, mobile: e.target.value })
              }
              placeholder="Mobile"
            />

            <div className="modal-actions">
              <button onClick={handleSave}>Save</button>
              <button onClick={() => setShowModal(false)}>
                Cancel
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}

export default Profile;