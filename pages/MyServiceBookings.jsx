// pages/MyServiceBookings.jsx
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { showSuccess, showError, showApproveConfirm, showRejectConfirm, closeAlert } from "../utils/alert";
import Card from "../components/Card";
import Button from "../components/Button";

const MyServiceBookings = () => {
  const navigate = useNavigate();
  const { auth } = useAuth();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const token = auth.token;
  const userId = auth.userId;

  useEffect(() => {
    if (!token) {
      navigate("/login");
      return;
    }
    fetchMyServiceBookings();
  }, [token, navigate]);

  const fetchMyServiceBookings = async () => {
    try {
      setLoading(true);
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/v1/bookings/my-services`,
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
      showError("โหลดข้อมูลล้มเหลว", err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleApproveBooking = async (bookingId, username) => {
    const result = await showApproveConfirm(`การจองของ ${username}`);
    
    if (!result.isConfirmed) {
      return;
    }

    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/v1/bookings/${bookingId}/approve`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to approve booking");
      }

      showSuccess("อนุมัติการจองสำเร็จ!", "การจองได้รับการอนุมัติแล้ว");
      fetchMyServiceBookings();
    } catch (err) {
      showError("อนุมัติล้มเหลว", err.message);
    }
  };

  const handleRejectBooking = async (bookingId, username) => {
    const result = await showRejectConfirm(`การจองของ ${username}`);
    
    if (!result.isConfirmed) {
      return;
    }

    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/v1/bookings/${bookingId}/reject`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to reject booking");
      }

      showSuccess("ปฏิเสธการจองสำเร็จ!", "การจองได้ถูกปฏิเสธแล้ว");
      fetchMyServiceBookings();
    } catch (err) {
      showError("ปฏิเสธล้มเหลว", err.message);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "confirmed":
        return "bg-green-100 text-green-800";
      case "rejected":
        return "bg-red-100 text-red-800";
      case "cancelled":
        return "bg-gray-100 text-gray-800";
      default:
        return "bg-blue-100 text-blue-800";
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case "pending":
        return "รอการอนุมัติ";
      case "confirmed":
        return "อนุมัติแล้ว";
      case "rejected":
        return "ปฏิเสธแล้ว";
      case "cancelled":
        return "ยกเลิกแล้ว";
      default:
        return status;
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("th-TH", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <div className="min-h-screen bg-gray-100 py-8">
      <div className="max-w-6xl mx-auto px-4">
        <h1 className="text-4xl font-bold mb-8">การจองบริการของฉัน</h1>

        {error && (
          <div className="bg-red-100 text-red-700 p-4 rounded-lg mb-6">
            {error}
          </div>
        )}

        {loading ? (
          <div className="text-center py-12">
            <p className="text-lg text-blue-600">กำลังโหลดข้อมูล...</p>
          </div>
        ) : bookings.length === 0 ? (
          <Card>
            <div className="text-center py-12">
              <p className="text-xl text-gray-600 mb-4">ยังไม่มีการจองบริการของคุณ</p>
              <Button onClick={() => navigate("/my-services")}>
                กลับไปดูบริการของฉัน
              </Button>
            </div>
          </Card>
        ) : (
          <div className="space-y-6">
            {bookings.map((booking) => (
              <Card key={booking._id}>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {/* รูปบริการ */}
                  <div className="md:col-span-1">
                    <img
                      src={booking.serviceId?.image || "https://via.placeholder.com/300"}
                      alt={booking.serviceId?.name}
                      className="w-full h-48 object-cover rounded-lg"
                    />
                  </div>

                  {/* ข้อมูลการจอง */}
                  <div className="md:col-span-2">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h2 className="text-2xl font-bold mb-2">
                          {booking.serviceId?.name}
                        </h2>
                        <p className="text-gray-600 mb-4">
                          {booking.serviceId?.description}
                        </p>
                      </div>
                      <span
                        className={`px-4 py-2 rounded-full text-sm font-semibold ${getStatusColor(
                          booking.status
                        )}`}
                      >
                        {getStatusText(booking.status)}
                      </span>
                    </div>

                    <div className="grid grid-cols-2 gap-4 mb-6 bg-gray-50 p-4 rounded-lg">
                      <div>
                        <p className="text-sm text-gray-600">ผู้จอง</p>
                        <p className="font-semibold text-lg">
                          {booking.user?.username || "ไม่ระบุ"}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">จำนวน</p>
                        <p className="font-semibold text-lg">
                          {booking.quantity} {booking.serviceId?.category}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">วันที่จอง</p>
                        <p className="font-semibold">
                          {formatDate(booking.createdAt)}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">ราคา</p>
                        <p className="font-semibold text-lg text-blue-600">
                          ฿{(booking.totalPrice || 0).toLocaleString("th-TH")}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">วันที่ต้องการใช้</p>
                        <p className="font-semibold">
                          {formatDate(booking.startDate)} - {formatDate(booking.endDate)}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">จำนวนวัน</p>
                        <p className="font-semibold">
                          {Math.ceil(
                            (new Date(booking.endDate) - new Date(booking.startDate)) /
                              (1000 * 60 * 60 * 24)
                          )}{" "}
                          วัน
                        </p>
                      </div>
                    </div>

                    {/* Actions */}
                    {booking.status === "pending" && (
                      <div className="flex gap-4">
                        <Button
                          onClick={() => handleApproveBooking(booking._id, booking.user?.username)}
                          className="bg-green-600 hover:bg-green-700"
                        >
                          ✓ อนุมัติ
                        </Button>
                        <Button
                          onClick={() => handleRejectBooking(booking._id, booking.user?.username)}
                          className="bg-red-600 hover:bg-red-700"
                        >
                          ✕ ปฏิเสธ
                        </Button>
                        <Button
                          onClick={() => handleRejectBooking(booking._id)}
                          className="bg-red-600 hover:bg-red-700"
                        >
                          ✕ ปฏิเสธ
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyServiceBookings;
