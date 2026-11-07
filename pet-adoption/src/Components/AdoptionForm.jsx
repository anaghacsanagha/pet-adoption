
import React from "react";

function AdoptionForm({ pet, formData, setFormData, onSubmit }) {
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value
    });
  };

  return (
    <form className="adoption-form" onSubmit={onSubmit}>
      <h2>Adoption Application</h2>
      <p>Applying to adopt: <strong>{pet?.name}</strong></p>

      <div className="form-group">
        <label>Full Name</label>
        <input
          name="fullName"
          value={formData.fullName}
          onChange={handleChange}
          required
          placeholder="Enter your full name"
        />
      </div>

      <div className="form-group">
        <label>Email</label>
        <input
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          required
          placeholder="Enter your email"
        />
      </div>

      <div className="form-group">
        <label>Phone Number</label>
        <input
          name="phone"
          value={formData.phone}
          onChange={handleChange}
          required
          pattern="[0-9]{10}"
          title="Enter a valid 10 digit phone number"
          placeholder="10 digit phone number"
        />
      </div>

      <div className="form-group">
        <label>Address</label>
        <textarea
          name="address"
          value={formData.address}
          onChange={handleChange}
          required
          placeholder="Enter your address"
        />
      </div>

      <div className="form-group">
        <label>Living Situation</label>
        <select
          name="livingType"
          value={formData.livingType}
          onChange={handleChange}
          required
        >
          <option value="">Select one</option>
          <option value="House">Independent House</option>
          <option value="Apartment">Apartment</option>
          <option value="Other">Other</option>
        </select>
      </div>

      <div className="form-group">
        <label>Previous Pet Experience</label>
        <textarea
          name="experience"
          value={formData.experience}
          onChange={handleChange}
          placeholder="Tell us about your experience..."
        />
      </div>

      <div className="form-group">
        <label>Why do you want to adopt this pet?</label>
        <textarea
          name="reason"
          value={formData.reason}
          onChange={handleChange}
          required
          placeholder="Write your reason..."
        />
      </div>

      <label className="form-checkbox">
        <input
          type="checkbox"
          name="agree"
          checked={formData.agree}
          onChange={handleChange}
          required
        />
        I agree to the adoption terms and responsibilities.
      </label>

      <button type="submit" className="form-submit-btn">
        Submit Adoption Request
      </button>
    </form>
  );
}

export default AdoptionForm;
