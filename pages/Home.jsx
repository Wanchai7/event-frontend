// pages/Home.jsx
import React, { useEffect, useState } from "react";
import ServiceCard from "../components/ServiceCard";
import Button from "../components/Button";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { showWarning } from "../utils/alert";

const Home = () => {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filteredServices, setFilteredServices] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");

  const { auth } = useAuth();
  const navigate = useNavigate();

  const categories = [
    "all",
    "กล้อง",
    "โปรเจคเตอร์",
    "อุปกรณ์แคมป์",
    "เสียง",
    "ไฟ",
  ];

  useEffect(() => {
    fetchServices();
  }, []);

  const fetchServices = async () => {
    try {
      setLoading(true);
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/v1/services`
      );
      if (!response.ok) {
        throw new Error("ไม่สามารถโหลดบริการได้");
      }
      const data = await response.json();
      setServices(data);
      setFilteredServices(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleGetStarted = () => {
    if (!auth.token) {
      showWarning("กรุณาเข้าสู่ระบบ", "คุณจำเป็นต้องเข้าสู่ระบบเพื่อเริ่มใช้งาน");
      setTimeout(() => navigate("/login"), 1500);
    } else {
      // ถ้าเข้าสู่ระบบแล้ว ให้เลื่อนลงไปดูรายการบริการ
      const element = document.getElementById("services-section");
      if (element) {
        element.scrollIntoView({ behavior: "smooth" });
      }
    }
  };

  useEffect(() => {
    let filtered = services;

    if (selectedCategory !== "all") {
      filtered = filtered.filter((s) => s.category === selectedCategory);
    }

    if (searchTerm) {
      filtered = filtered.filter(
        (s) =>
          s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          s.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setFilteredServices(filtered);
  }, [searchTerm, selectedCategory, services]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-2xl font-bold text-blue-600">กำลังโหลด...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Hero Section */}
      <div className="bg-blue-600 text-white py-16">
        <div className="max-w-6xl mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            ระบบเช่าอุปกรณ์งานอีเวนต์
          </h1>
          <p className="text-xl mb-8">
            เช่าอุปกรณ์ที่ดีที่สุดสำหรับงานอีเวนต์ของคุณ
          </p>
          <Button variant="success" size="lg" onClick={handleGetStarted}>
            เริ่มต้นเลย
          </Button>
        </div>
      </div>

      {/* Search and Filter */}
      <div id="services-section" className="max-w-6xl mx-auto px-4 py-8">
        <div className="mb-8">
          <input
            type="text"
            placeholder="ค้นหาบริการ..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Category Filter */}
        <div className="mb-8 flex flex-wrap gap-2">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-2 rounded-lg font-semibold transition ${selectedCategory === cat
                ? "bg-blue-600 text-white"
                : "bg-white text-blue-600 border-2 border-blue-600 hover:bg-blue-50"
                }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {error && (
          <div className="bg-red-100 text-red-700 p-4 rounded-lg mb-8">
            {error}
          </div>
        )}

        {/* Services Grid */}
        {filteredServices.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-2xl text-gray-600">ไม่พบบริการ</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredServices.map((service) => (
              <ServiceCard key={service._id} service={service} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;
