// pages/Login.jsx
import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { setTokenCookie, setUserCookie } from "../utils/cookies";
import { showSuccess, showError, showLoading, closeAlert } from "../utils/alert";
import Button from "../components/Button";
import Card from "../components/Card";

const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
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
    if (!formData.username.trim()) {
      newErrors.username = "กรุณากรอกชื่อผู้ใช้";
    }
    if (!formData.password) {
      newErrors.password = "กรุณากรอกรหัสผ่าน";
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

    try {
      setLoading(true);
      showLoading("กำลังเข้าสู่ระบบ...");
      const response = await fetch(
        "http://localhost:5000/api/v1/user/login",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        console.error("Login error response:", errorData);
        closeAlert();
        throw new Error(errorData.message || "ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง");
      }

      const data = await response.json();
      setTokenCookie(data.accessToken, 7);
      setUserCookie(data.id, data.username, 7);
      login(data.accessToken, data.id, data.username);
      closeAlert();
      showSuccess("เข้าสู่ระบบสำเร็จ!", `ยินดีต้อนรับ ${data.username}`);
      setTimeout(() => navigate("/"), 1500);
    } catch (err) {
      console.error("Login error:", err);
      showError("เข้าสู่ระบบล้มเหลว", err.message);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center py-12">
      <div className="w-full max-w-md">
        <Card>
          <h1 className="text-4xl font-bold mb-8 text-center">เข้าสู่ระบบ</h1>

          {error && (
            <div className="bg-red-100 text-red-700 p-4 rounded-lg mb-6">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="mb-6">
              <label className="block text-sm font-semibold mb-2">
                ชื่อผู้ใช้
              </label>
              <input
                type="text"
                name="username"
                value={formData.username}
                onChange={handleChange}
                className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.username ? "border-red-500" : "border-gray-300"
                }`}
                placeholder="กรอกชื่อผู้ใช้ของคุณ"
              />
              {errors.username && (
                <p className="text-red-500 text-sm mt-1">{errors.username}</p>
              )}
            </div>

            <div className="mb-8">
              <label className="block text-sm font-semibold mb-2">
                รหัสผ่าน
              </label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.password ? "border-red-500" : "border-gray-300"
                }`}
                placeholder="กรอกรหัสผ่านของคุณ"
              />
              {errors.password && (
                <p className="text-red-500 text-sm mt-1">{errors.password}</p>
              )}
            </div>

            <Button
              type="submit"
              variant="primary"
              size="lg"
              className="w-full"
              disabled={loading}
            >
              {loading ? "กำลังเข้าสู่ระบบ..." : "เข้าสู่ระบบ"}
            </Button>
          </form>

          <p className="mt-6 text-center text-gray-600">
            ยังไม่มีบัญชี?{" "}
            <Link
              to="/register"
              className="text-blue-600 hover:text-blue-700 font-semibold"
            >
              สมัครสมาชิกที่นี่
            </Link>
          </p>
        </Card>
      </div>
    </div>
  );
};

export default Login;
