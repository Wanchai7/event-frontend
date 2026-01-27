// pages/ServiceDetail.jsx
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { showSuccess, showError, showLoading, closeAlert } from "../utils/alert";
import BookingForm from "../components/BookingForm";
import Card from "../components/Card";

const ServiceDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { auth } = useAuth();
  const [service, setService] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [booking, setBooking] = useState(false);
  const token = auth.token;

  useEffect(() => {
    fetchService();
  }, [id]);

  const fetchService = async () => {
    try {
      setLoading(true);
      const response = await fetch(
        `http://localhost:5000/api/v1/services/${id}`
      );
      if (!response.ok) {
        throw new Error("Failed to fetch service");
      }
      const data = await response.json();
      setService(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };
  const handleBooking = async (formData) => {
    if (!token) {
      navigate("/login");
      return;
    }

    try {
      showLoading("กำลังสร้างการจอง...");
      const response = await fetch(
        "http://localhost:5000/api/v1/bookings",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            serviceId: id,
            ...formData,
          }),
        }
      );

      if (!response.ok) {
        closeAlert();
        throw new Error("Failed to create booking");
      }

      closeAlert();
      showSuccess("สร้างการจองสำเร็จ!", "กรุณารอการอนุมัติจากเจ้าของบริการ");
      setTimeout(() => navigate("/my-bookings"), 1500);
    } catch (err) {
      showError("สร้างการจองล้มเหลว", err.message);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-2xl font-bold text-blue-600">Loading...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-2xl text-red-600">Error: {error}</div>
      </div>
    );
  }

  if (!service) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-2xl text-gray-600">Service not found</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 py-8">
      <div className="max-w-6xl mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Service Details */}
          <div className="lg:col-span-2">
            <Card>
              <img
                src={service.image}
                alt={service.name}
                className="w-full h-96 object-cover rounded-lg mb-6"
              />

              <h1 className="text-4xl font-bold mb-4">{service.name}</h1>

              <div className="grid grid-cols-2 gap-4 mb-6">
                <div>
                  <p className="text-gray-600 text-sm">Category</p>
                  <p className="text-xl font-semibold">{service.category}</p>
                </div>
                <div>
                  <p className="text-gray-600 text-sm">Available Units</p>
                  <p className="text-xl font-semibold">{service.quantity}</p>
                </div>
              </div>

              <div className="mb-6 p-4 bg-blue-50 rounded-lg">
                <p className="text-gray-600 text-sm">Price per Day</p>
                <p className="text-3xl font-bold text-blue-600">
                  ฿{service.price}
                </p>
              </div>

              <div>
                <h3 className="text-2xl font-bold mb-4">Description</h3>
                <p className="text-gray-700 leading-relaxed">
                  {service.description}
                </p>
              </div>

              {service.owner && (
                <div className="mt-8 p-4 bg-gray-50 rounded-lg">
                  <p className="text-gray-600 text-sm">Owner</p>
                  <p className="text-lg font-semibold">
                    {service.owner.username}
                  </p>
                </div>
              )}
            </Card>
          </div>

          {/* Booking Form */}
          <div>
            <BookingForm service={service} onSubmit={handleBooking} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ServiceDetail;
