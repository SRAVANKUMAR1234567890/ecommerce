import { useEffect, useState } from "react";
import axios from "axios";
import "./Address.css";

function Address({ editData, onClose, userEmail }) {

  const [form, setForm] = useState({
    fullName: "",
    mobile: "",
    pincode: "",
    city: "",
    state: "",
    addressLine: ""
  });

  // Populate edit data
  useEffect(() => {
    if (editData) {
      setForm(editData);
    }
  }, [editData]);

  // Handle input change
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // Save address
  const handleSave = async () => {

    if (
      !form.fullName ||
      !form.mobile ||
      !form.pincode ||
      !form.city ||
      !form.state ||
      !form.addressLine
    ) {
      alert("Please fill all fields ❗");
      return;
    }

    if (!/^[0-9]{10}$/.test(form.mobile)) {
      alert("Enter valid 10-digit mobile number 📱");
      return;
    }

    try {
      const data = { ...form, email: userEmail };

      if (editData?.id) {
        await axios.put(`http://localhost:8080/address/update/${editData.id}`, data);
        alert("Address Updated ✅");
      } else {
        await axios.post("http://localhost:8080/address/save", data);
        alert("Address Added ✅");
      }

      // CLOSE FORM
      onClose();

    } catch (err) {
      console.error(err);
      alert("Error saving address ❌");
    }
  };

  return (
    <div className="address-modal-overlay">

      <div className="address-form-card">

        <div className="form-header">
          <h3>{editData ? "Edit Address" : "Add Address"}</h3>

          <button className="close-x-btn" onClick={onClose}>
            &times;
          </button>
        </div>

        <div className="form-grid">

          <input
            name="fullName"
            placeholder="Full Name"
            value={form.fullName}
            onChange={handleChange}
          />

          <input
            name="mobile"
            placeholder="Mobile"
            value={form.mobile}
            onChange={handleChange}
          />

          <input
            name="pincode"
            placeholder="Pincode"
            value={form.pincode}
            onChange={handleChange}
          />

          <input
            name="city"
            placeholder="City"
            value={form.city}
            onChange={handleChange}
          />

          <select
            name="state"
            value={form.state}
            onChange={handleChange}
          >
            <option value="">Select State</option>
            <option>Andhra Pradesh</option>
            <option>Telangana</option>
            <option>Karnataka</option>
            <option>Tamil Nadu</option>
            <option>Maharashtra</option>
            <option>Delhi</option>
          </select>

          <textarea
            name="addressLine"
            placeholder="Full Address"
            value={form.addressLine}
            onChange={handleChange}
          />

        </div>

        <button className="save-address-btn" onClick={handleSave}>
          {editData ? "UPDATE ADDRESS" : "SAVE ADDRESS"}
        </button>

      </div>

    </div>
  );
}

export default Address;