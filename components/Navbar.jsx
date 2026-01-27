// components/Navbar.jsx
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { clearAllCookies } from "../utils/cookies";

const Navbar = () => {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const { auth, logout } = useAuth();

  const handleLogout = () => {
    clearAllCookies();
    logout();
    navigate("/login");
  };

  const token = auth.token;

  return (
    <nav className="bg-blue-600 text-white shadow-lg">
      <div className="max-w-6xl mx-auto px-4 py-4">
        <div className="flex justify-between items-center">
          <Link to="/" className="text-2xl font-bold">
            🎉 ระบบเช่าอุปกรณ์
          </Link>

          {/* Mobile menu button */}
          <button
            className="md:hidden"
            onClick={() => setIsOpen(!isOpen)}
          >
            ☰
          </button>

          {/* Desktop menu */}
          <div className="hidden md:flex gap-6">
            <Link
              to="/"
              className="hover:bg-blue-700 px-3 py-2 rounded"
            >
              บริการ
            </Link>

            {token ? (
              <>
                <Link
                  to="/my-bookings"
                  className="hover:bg-blue-700 px-3 py-2 rounded"
                >
                  การจองของฉัน
                </Link>
                <Link
                  to="/my-services"
                  className="hover:bg-blue-700 px-3 py-2 rounded"
                >
                  บริการของฉัน
                </Link>
                <Link
                  to="/my-service-bookings"
                  className="hover:bg-blue-700 px-3 py-2 rounded"
                >
                  ผู้จองบริการ
                </Link>
                <button
                  onClick={handleLogout}
                  className="bg-red-500 hover:bg-red-600 px-4 py-2 rounded"
                >
                  ออกจากระบบ
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="hover:bg-blue-700 px-3 py-2 rounded"
                >
                  เข้าสู่ระบบ
                </Link>
                <Link
                  to="/register"
                  className="bg-green-500 hover:bg-green-600 px-4 py-2 rounded"
                >
                  สมัครสมาชิก
                </Link>
              </>
            )}
          </div>
        </div>

        {/* Mobile menu */}
        {isOpen && (
          <div className="md:hidden mt-4 flex flex-col gap-2">
            <Link to="/" className="block hover:bg-blue-700 px-3 py-2 rounded">
              บริการ
            </Link>
            {token ? (
              <>
                <Link
                  to="/my-bookings"
                  className="block hover:bg-blue-700 px-3 py-2 rounded"
                >
                  การจองของฉัน
                </Link>
                <Link
                  to="/my-services"
                  className="block hover:bg-blue-700 px-3 py-2 rounded"
                >
                  บริการของฉัน
                </Link>
                <Link
                  to="/my-service-bookings"
                  className="block hover:bg-blue-700 px-3 py-2 rounded"
                >
                  ผู้จองบริการ
                </Link>
                <button
                  onClick={handleLogout}
                  className="block bg-red-500 hover:bg-red-600 px-4 py-2 rounded w-full text-left"
                >
                  ออกจากระบบ
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="block hover:bg-blue-700 px-3 py-2 rounded"
                >
                  เข้าสู่ระบบ
                </Link>
                <Link
                  to="/register"
                  className="block bg-green-500 hover:bg-green-600 px-4 py-2 rounded"
                >
                  สมัครสมาชิก
                </Link>
              </>
            )}
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
