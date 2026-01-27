// pages/MyServices.jsx
import React, { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { showSuccess, showError, showDeleteConfirm, closeAlert } from "../utils/alert";
import Card from "../components/Card";
import Button from "../components/Button";

const MyServices = () => {
  const navigate = useNavigate();
  const { auth } = useAuth();
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const userId = auth.userId;
  const token = auth.token;

  useEffect(() => {
    if (!token) {
      navigate("/login");
      return;
    }
    fetchServices();
  }, [token, navigate]);

  const fetchServices = async () => {
    try {
      setLoading(true);
      const response = await fetch(
        `http://localhost:5000/api/v1/services/owner/${userId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to fetch services");
      }

      const data = await response.json();
      setServices(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteService = async (serviceId, serviceName) => {
    const result = await showDeleteConfirm(serviceName);
    
    if (!result.isConfirmed) {
      return;
    }

    try {
      const response = await fetch(
        `http://localhost:5000/api/v1/services/${serviceId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to delete service");
      }

      showSuccess("ลบบริการสำเร็จ!", "บริการของคุณได้ถูกลบออก");
      setServices(services.filter((s) => s._id !== serviceId));
    } catch (err) {
      showError("ลบบริการล้มเหลว", err.message);
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
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold">บริการของฉัน</h1>
          <Link to="/create-service">
            <Button variant="success" size="lg">
              เพิ่มบริการใหม่
            </Button>
          </Link>
        </div>

        {error && (
          <div className="bg-red-100 text-red-700 p-4 rounded-lg mb-8">
            {error}
          </div>
        )}

        {services.length === 0 ? (
          <div className="bg-white rounded-lg shadow-lg p-8 text-center">
            <p className="text-xl text-gray-600 mb-4">
              ไม่พบบริการ
            </p>
            <Link to="/create-service">
              <Button variant="primary">สร้างบริการแรกของคุณ</Button>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {services.map((service) => (
              <Card key={service._id}>
                <img
                  src={service.image}
                  alt={service.name}
                  className="w-full h-48 object-cover rounded-lg mb-4"
                />
                <h3 className="text-xl font-bold mb-2">{service.name}</h3>
                <p className="text-gray-600 mb-2 line-clamp-2">
                  {service.description}
                </p>
                <p className="text-2xl font-bold text-blue-600 mb-4">
                  ฿{service.price}/วัน
                </p>
                <div className="flex gap-2">
                  <Link to={`/edit-service/${service._id}`} className="flex-1">
                    <Button variant="primary" className="w-full">
                      แก้ไข
                    </Button>
                  </Link>
                  <Button
                    variant="danger"
                    className="flex-1"
                    onClick={() => handleDeleteService(service._id, service.name)}
                  >
                    ลบ
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyServices;
