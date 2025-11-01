import { useState } from "react";
const API = import.meta.env.VITE_API_URL || "http://localhost:4000";
const BookingForm = () => {
  const [formData, setFormData] = useState({
    name: "",
    mobile: "",
    service: "",
    stylist: "No Preference",
    date: "",
    time: "",
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  // ------------------ Date Range Setup ------------------
  const today = new Date();
  const twoWeeksLater = new Date();
  twoWeeksLater.setDate(today.getDate() + 14);

  const formatDate = (date) => date.toISOString().split("T")[0];
  const minDate = formatDate(today);
  const maxDate = formatDate(twoWeeksLater);

  // ------------------ Validation functions ------------------
  const validateName = (name) => {
    if (!name.trim()) return "Name is required";
    if (name.trim().length < 2) return "Name must be at least 2 characters";
    if (!/^[a-zA-Z\s]+$/.test(name.trim()))
      return "Name should only contain letters and spaces";
    return "";
  };

  const validateMobile = (mobile) => {
    if (!mobile) return "Mobile number is required";
    const cleaned = mobile.replace(/\D/g, "");
    if (cleaned.length !== 10) return "Mobile number must be exactly 10 digits";
    if (!/^[6-9]/.test(cleaned))
      return "Mobile number should start with 6, 7, 8, or 9";
    return "";
  };

  const validateDate = (date) => {
    if (!date) return "Date is required";
    const selected = new Date(date);
    const today = new Date();
    const limit = new Date();
    limit.setDate(today.getDate() + 14);

    today.setHours(0, 0, 0, 0);
    limit.setHours(0, 0, 0, 0);

    if (selected < today) return "Please select a future date";
    if (selected > limit) return "Date cannot be beyond two weeks from today";
    return "";
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    let processed = value;

    if (name === "mobile") {
      processed = value.replace(/\D/g, "").substring(0, 10);
    }

    setFormData((prev) => ({ ...prev, [name]: processed }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const validateForm = () => {
    const newErrors = {};
    const nameError = validateName(formData.name);
    if (nameError) newErrors.name = nameError;

    const mobileError = validateMobile(formData.mobile);
    if (mobileError) newErrors.mobile = mobileError;

    if (!formData.service) newErrors.service = "Please select a service";

    const dateError = validateDate(formData.date);
    if (dateError) newErrors.date = dateError;

    if (!formData.time) newErrors.time = "Please select a time slot";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // ------------------ Handle Submit ------------------
  const handleSubmit = async (e) => {
    e.preventDefault();
    setSuccessMessage("");
    setErrorMessage("");

    if (!validateForm()) return;

    setIsSubmitting(true);

    try {
      const response = await fetch(`${API}/api/book`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        setSuccessMessage(
          "🎉 Booking confirmed! Our team will contact you soon."
        );
        setFormData({
          name: "",
          mobile: "",
          service: "",
          stylist: "No Preference",
          date: "",
          time: "",
        });
      } else {
        setErrorMessage(
          data.message || "Failed to confirm booking. Please try again."
        );
      }
    } catch (err) {
      console.error("Booking error:", err);
      setErrorMessage(
        "Server error. Please check your connection and try again."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  // ------------------ JSX ------------------
  return (
    <section id="booking" className="section booking-section">
      <h2 className="section-title">Reserve Your Moment of Indulgence</h2>
      <p className="tagline-dark">
        A private experience with our master artists awaits you.
      </p>

      <form id="booking-form" className="booking-form" onSubmit={handleSubmit}>
        {/* Name */}
        <div className="form-field-wrapper">
          <input
            type="text"
            name="name"
            placeholder="Your Full Name"
            value={formData.name}
            onChange={handleChange}
            className={errors.name ? "error" : ""}
            required
          />
          {errors.name && <span className="error-message">{errors.name}</span>}
        </div>

        {/* Mobile */}
        <div className="form-field-wrapper">
          <input
            type="tel"
            name="mobile"
            placeholder="Mobile Number (10 digits)"
            value={formData.mobile}
            onChange={handleChange}
            className={errors.mobile ? "error" : ""}
            required
          />
          {errors.mobile && (
            <span className="error-message">{errors.mobile}</span>
          )}
        </div>

        {/* Service */}
        <div className="form-field-wrapper">
          <select
            name="service"
            value={formData.service}
            onChange={handleChange}
            className={errors.service ? "error" : ""}
            required
          >
            <option value="">Select a Primary Service</option>
            <option value="Hair">Hair Styling/Cut</option>
            <option value="Color">Hair Colouring</option>
            <option value="Makeup">Makeup Consultation (Bridal/Party)</option>
            <option value="Skin">Skincare/Facial</option>
          </select>
          {errors.service && (
            <span className="error-message">{errors.service}</span>
          )}
        </div>

        {/* Stylist */}
        <div className="form-field-wrapper">
          <select
            name="stylist"
            value={formData.stylist}
            onChange={handleChange}
          >
            <option value="No Preference">Select Stylist (Optional)</option>
            <option value="Rhea">Rhea (Master Hair Artist)</option>
            <option value="Vivek">Vivek (Senior Stylist)</option>
            <option value="Aisha">Aisha (Lead Esthetician)</option>
            <option value="Priya">Priya (Bridal Makeup Expert)</option>
          </select>
        </div>

        {/* Date — limited to current day → +14 days */}
        <div className="form-field-wrapper">
          <input
            type="date"
            name="date"
            value={formData.date}
            onChange={handleChange}
            className={errors.date ? "error" : ""}
            min={minDate}
            max={maxDate}
            required
          />
          {errors.date && <span className="error-message">{errors.date}</span>}
        </div>

        {/* Time */}
        <div className="form-field-wrapper">
          <select
            name="time"
            value={formData.time}
            onChange={handleChange}
            className={errors.time ? "error" : ""}
            required
          >
            <option value="">Select a Time Slot</option>
            {[
              "09:00",
              "09:30",
              "10:00",
              "10:30",
              "11:00",
              "11:30",
              "12:00",
              "12:30",
              "13:00",
              "13:30",
              "14:00",
              "14:30",
              "15:00",
              "15:30",
              "16:00",
              "16:30",
              "17:00",
              "17:30",
              "18:00",
              "18:30",
              "19:00",
              "19:30",
              "20:00",
              "20:30",
            ].map((slot) => (
              <option key={slot} value={slot}>
                {slot} {parseInt(slot) < 12 ? "AM" : "PM"}
              </option>
            ))}
          </select>
          {errors.time && <span className="error-message">{errors.time}</span>}
        </div>

        {/* Submit Button */}
        <button type="submit" className="cta-button" disabled={isSubmitting}>
          {isSubmitting ? "Booking..." : "Confirm Reservation"}
        </button>

        {successMessage && <p className="success-message">{successMessage}</p>}
        {errorMessage && <p className="error-message">{errorMessage}</p>}

        <p className="privacy-note">
          We respect your privacy. All bookings are confirmed via email.
        </p>
      </form>
    </section>
  );
};

export default BookingForm;
