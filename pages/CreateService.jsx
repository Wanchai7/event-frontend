// pages/CreateService.jsx
import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { showSuccess, showError, showLoading, closeAlert } from "../utils/alert";
import Button from "../components/Button";
import Card from "../components/Card";

const CreateService = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const { auth } = useAuth();
  const token = auth.token;
  const isEditMode = !!id;

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    pricePerDay: "",
    discountPrice: "",
    category: "กล้อง",
    quantity: 1,
    availableFrom: "",
    availableTo: "",
  });
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(isEditMode);
  const [error, setError] = useState(null);
  const [errors, setErrors] = useState({});

  const categories = [
    "กล้อง",
    "โปรเจคเตอร์",
    "อุปกรณ์แคมป์",
    "เสียง",
    "ไฟ",
  ];

  // โหลดข้อมูลเก่าเมื่อเป็นโหมด Edit
  useEffect(() => {
    if (isEditMode) {
      fetchServiceData();
    }
  }, [id]);

  const fetchServiceData = async () => {
    try {
      setLoading(true);
      const response = await fetch(
        `http://localhost:5000/api/v1/services/${id}`
      );

      if (!response.ok) {
        throw new Error("ไม่สามารถโหลดข้อมูลบริการได้");
      }

      const data = await response.json();
      setFormData({
        name: data.name,
        description: data.description,
        pricePerDay: data.pricePerDay || data.price || "",
        discountPrice: data.discountPrice || "",
        category: data.category,
        quantity: data.quantity || 1,
        availableFrom: data.availableFrom ? data.availableFrom.split("T")[0] : "",
        availableTo: data.availableTo ? data.availableTo.split("T")[0] : "",
      });
    } catch (err) {
      showError("โหลดข้อมูลล้มเหลว", err.message);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

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

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.name.trim()) {
      newErrors.name = "กรุณากรอกชื่อบริการ";
    }
    if (!formData.description.trim()) {
      newErrors.description = "กรุณากรอกรายละเอียด";
    }
    if (!formData.pricePerDay || formData.pricePerDay <= 0) {
      newErrors.pricePerDay = "กรุณากรอกราคาต่อวัน";
    }
    if (!formData.availableFrom) {
      newErrors.availableFrom = "กรุณาเลือกวันที่เริ่มต้น";
    }
    if (!formData.availableTo) {
      newErrors.availableTo = "กรุณาเลือกวันที่สิ้นสุด";
    }
    if (formData.availableFrom && formData.availableTo && formData.availableFrom > formData.availableTo) {
      newErrors.availableTo = "วันที่สิ้นสุดต้องหลังจากวันที่เริ่มต้น";
    }
    // ถ้าไม่ใช่ edit mode ต้องมีรูป
    if (!isEditMode && !image) {
      newErrors.image = "กรุณาเลือกรูปภาพ";
    }
    if (formData.quantity < 1) {
      newErrors.quantity = "จำนวนต้องมากกว่า 0";
    }
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = validateForm();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    if (!token) {
      navigate("/login");
      return;
    }

    try {
      setLoading(true);
      setError(null);
      showLoading(isEditMode ? "กำลังแก้ไขบริการ..." : "กำลังสร้างบริการ...");

      const formDataToSend = new FormData();
      formDataToSend.append("name", formData.name);
      formDataToSend.append("description", formData.description);
      formDataToSend.append("pricePerDay", String(formData.pricePerDay));
      formDataToSend.append("discountPrice", String(formData.discountPrice || 0));
      formDataToSend.append("category", formData.category);
      formDataToSend.append("quantity", String(formData.quantity));
      formDataToSend.append("availableFrom", formData.availableFrom);
      formDataToSend.append("availableTo", formData.availableTo);
      
      // ถ้ามีรูปใหม่ให้เพิ่ม
      if (image) {
        formDataToSend.append("file", image);
      }

      const url = isEditMode
        ? `http://localhost:5000/api/v1/services/${id}`
        : "http://localhost:5000/api/v1/services";
      
      const method = isEditMode ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formDataToSend,
      });

      if (!response.ok) {
        const responseData = await response.json().catch(() => ({}));
        closeAlert();
        throw new Error(responseData.message || `HTTP Error ${response.status}`);
      }

      const successMessage = isEditMode
        ? "อัปเดตบริการสำเร็จ!"
        : "สร้างบริการสำเร็จ!";
      closeAlert();
      showSuccess(successMessage, isEditMode ? "บริการของคุณได้รับการแก้ไข" : "บริการใหม่ได้ถูกสร้าง");
      setTimeout(() => navigate("/my-services"), 1500);
    } catch (err) {
      console.error("Create/Update service error:", err);
      showError(isEditMode ? "แก้ไขบริการล้มเหลว" : "สร้างบริการล้มเหลว", err.message);
      setError(err.message || "Failed to create service");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 py-8">
      <div className="max-w-2xl mx-auto px-4">
        <Card>
          <h1 className="text-4xl font-bold mb-8">
            {isEditMode ? "แก้ไขบริการ" : "สร้างบริการใหม่"}
          </h1>

          {error && (
            <div className="bg-red-100 text-red-700 p-4 rounded-lg mb-8">
              {error}
            </div>
          )}

          {loading && isEditMode ? (
            <div className="text-center py-8">
              <p className="text-lg text-blue-600">กำลังโหลดข้อมูล...</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit}>
            <div className="mb-6">
              <label className="block text-sm font-semibold mb-2">
                ชื่อบริการ
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.name ? "border-red-500" : "border-gray-300"
                }`}
                placeholder="เช่น กล้องมืออาชีพ"
              />
              {errors.name && (
                <p className="text-red-500 text-sm mt-1">{errors.name}</p>
              )}
            </div>

            <div className="mb-6">
              <label className="block text-sm font-semibold mb-2">
                รายละเอียด
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.description ? "border-red-500" : "border-gray-300"
                }`}
                placeholder="อธิบายบริการของคุณโดยละเอียด"
                rows="4"
              ></textarea>
              {errors.description && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.description}
                </p>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                <label className="block text-sm font-semibold mb-2">
                  ราคาต่อวัน (บาท)
                </label>
                <input
                  type="number"
                  name="pricePerDay"
                  value={formData.pricePerDay}
                  onChange={handleChange}
                  className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    errors.pricePerDay ? "border-red-500" : "border-gray-300"
                  }`}
                  placeholder="0"
                  min="0"
                />
                {errors.pricePerDay && (
                  <p className="text-red-500 text-sm mt-1">{errors.pricePerDay}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-semibold mb-2">
                  ราคาลด (บาท) - ไม่บังคับ
                </label>
                <input
                  type="number"
                  name="discountPrice"
                  value={formData.discountPrice}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="0"
                  min="0"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                <label className="block text-sm font-semibold mb-2">
                  วันที่เริ่มต้น (วัน/เดือน/ปี)
                </label>
                <input
                  type="date"
                  name="availableFrom"
                  value={formData.availableFrom}
                  onChange={handleChange}
                  className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    errors.availableFrom ? "border-red-500" : "border-gray-300"
                  }`}
                />
                {errors.availableFrom && (
                  <p className="text-red-500 text-sm mt-1">{errors.availableFrom}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-semibold mb-2">
                  วันที่สิ้นสุด (วัน/เดือน/ปี)
                </label>
                <input
                  type="date"
                  name="availableTo"
                  value={formData.availableTo}
                  onChange={handleChange}
                  className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    errors.availableTo ? "border-red-500" : "border-gray-300"
                  }`}
                />
                {errors.availableTo && (
                  <p className="text-red-500 text-sm mt-1">{errors.availableTo}</p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                <label className="block text-sm font-semibold mb-2">
                  หมวดหมู่
                </label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {categories.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold mb-2">
                  จำนวน
                </label>
                <input
                  type="number"
                  name="quantity"
                  value={formData.quantity}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="1"
                  min="1"
                />
              </div>
            </div>

            <div className="mb-8">
              <label className="block text-sm font-semibold mb-2">
                ภาพ
              </label>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center cursor-pointer hover:border-blue-500 transition">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="hidden"
                  id="image-input"
                />
                <label htmlFor="image-input" className="cursor-pointer">
                  <p className="text-gray-600">
                    {image
                      ? `เลือก: ${image.name}`
                      : "คลิกเพื่อเลือกรูปภาพ"}
                  </p>
                </label>
              </div>
              {errors.image && (
                <p className="text-red-500 text-sm mt-1">{errors.image}</p>
              )}
            </div>

            <Button
              type="submit"
              variant="primary"
              size="lg"
              className="w-full"
              disabled={loading}
            >
              {loading
                ? isEditMode
                  ? "กำลังอัปเดต..."
                  : "กำลังสร้าง..."
                : isEditMode
                ? "อัปเดตบริการ"
                : "สร้างบริการ"}
            </Button>
            </form>
          )}
        </Card>
      </div>
    </div>
  );
};

export default CreateService;
