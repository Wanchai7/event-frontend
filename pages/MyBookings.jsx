// pages/MyBookings.jsx
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { showSuccess, showError, showDeleteConfirm } from "../utils/alert";
import BookingCard from "../components/BookingCard";

const MyBookings = () => {
  const navigate = useNavigate();
  const { auth } = useAuth();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const userId = auth.userId;
  const token = auth.token;

  useEffect(() => {
    if (!token) {
      navigate("/login");
      return;
    }
    fetchBookings();
  }, [token, navigate]);

  const fetchBookings = async () => {
    try {
      setLoading(true);
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/v1/bookings/user/${userId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to fetch bookings");
      }

      const data = await response.json();
      setBookings(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleCancelBooking = async (bookingId) => {
    const result = await showDeleteConfirm("การจองนี้");
    
    if (!result.isConfirmed) {
      return;
    }

    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/v1/bookings/${bookingId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to cancel booking");
      }

      showSuccess("ยกเลิกการจองสำเร็จ!", "การจองของคุณได้ถูกยกเลิก");
      setBookings(bookings.filter((b) => b._id !== bookingId));
    } catch (err) {
      showError("ยกเลิกล้มเหลว", err.message);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-2xl font-bold text-blue-600">กำลังโหลด...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <h1 className="text-4xl font-bold mb-8">การจองของฉัน</h1>

        {error && (
          <div className="bg-red-100 text-red-700 p-4 rounded-lg mb-8">
            {error}
          </div>
        )}

        {bookings.length === 0 ? (
          <div className="bg-white rounded-lg shadow-lg p-8 text-center">
            <p className="text-xl text-gray-600">
              ไม่พบการจอง
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            {bookings.map((booking) => (
              <BookingCard
                key={booking._id}
                booking={booking}
                onCancel={handleCancelBooking}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyBookings;
