// components/BookingForm.jsx
import React, { useState } from "react";
import Button from "./Button";

const BookingForm = ({ service, onSubmit }) => {
  const [formData, setFormData] = useState({
    userName: "",
    phoneNumber: "",
    rentalDate: "",
    returnDate: "",
    quantity: 1,
    notes: "",
  });

  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.userName.trim()) {
      newErrors.userName = "Name is required";
    }
    if (!formData.phoneNumber.trim()) {
      newErrors.phoneNumber = "Phone number is required";
    }
    if (!formData.rentalDate) {
      newErrors.rentalDate = "Rental date is required";
    }
    if (!formData.returnDate) {
      newErrors.returnDate = "Return date is required";
    }
    if (formData.quantity < 1) {
      newErrors.quantity = "Quantity must be at least 1";
    }
    if (formData.rentalDate && formData.returnDate) {
      if (new Date(formData.returnDate) <= new Date(formData.rentalDate)) {
        newErrors.returnDate = "Return date must be after rental date";
      }
    }
    return newErrors;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const newErrors = validateForm();
    if (Object.keys(newErrors).length === 0) {
      onSubmit(formData);
    } else {
      setErrors(newErrors);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-lg p-6">
      <h2 className="text-2xl font-bold mb-6">Book {service.name}</h2>

      <div className="mb-4">
        <label className="block text-sm font-semibold mb-2">Your Name</label>
        <input
          type="text"
          name="userName"
          value={formData.userName}
          onChange={handleChange}
          className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
            errors.userName ? "border-red-500" : "border-gray-300"
          }`}
          placeholder="Enter your name"
        />
        {errors.userName && (
          <p className="text-red-500 text-sm mt-1">{errors.userName}</p>
        )}
      </div>

      <div className="mb-4">
        <label className="block text-sm font-semibold mb-2">
          Phone Number
        </label>
        <input
          type="tel"
          name="phoneNumber"
          value={formData.phoneNumber}
          onChange={handleChange}
          className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
            errors.phoneNumber ? "border-red-500" : "border-gray-300"
          }`}
          placeholder="Enter your phone number"
        />
        {errors.phoneNumber && (
          <p className="text-red-500 text-sm mt-1">{errors.phoneNumber}</p>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <div>
          <label className="block text-sm font-semibold mb-2">
            Rental Date
          </label>
          <input
            type="date"
            name="rentalDate"
            value={formData.rentalDate}
            onChange={handleChange}
            className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              errors.rentalDate ? "border-red-500" : "border-gray-300"
            }`}
          />
          {errors.rentalDate && (
            <p className="text-red-500 text-sm mt-1">{errors.rentalDate}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-semibold mb-2">
            Return Date
          </label>
          <input
            type="date"
            name="returnDate"
            value={formData.returnDate}
            onChange={handleChange}
            className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              errors.returnDate ? "border-red-500" : "border-gray-300"
            }`}
          />
          {errors.returnDate && (
            <p className="text-red-500 text-sm mt-1">{errors.returnDate}</p>
          )}
        </div>
      </div>

      <div className="mb-4">
        <label className="block text-sm font-semibold mb-2">Quantity</label>
        <input
          type="number"
          name="quantity"
          min="1"
          max={service.quantity}
          value={formData.quantity}
          onChange={handleChange}
          className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
            errors.quantity ? "border-red-500" : "border-gray-300"
          }`}
        />
        {errors.quantity && (
          <p className="text-red-500 text-sm mt-1">{errors.quantity}</p>
        )}
      </div>

      <div className="mb-6">
        <label className="block text-sm font-semibold mb-2">Notes</label>
        <textarea
          name="notes"
          value={formData.notes}
          onChange={handleChange}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Any special requests?"
          rows="4"
        ></textarea>
      </div>

      <Button type="submit" variant="success" size="lg" className="w-full">
        Complete Booking
      </Button>
    </form>
  );
};

export default BookingForm;
