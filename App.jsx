// App.jsx
import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import ToastContainer from "./components/ToastContainer";
import { ToastProvider } from "./context/ToastContext";
import { AuthProvider } from "./context/AuthContext";
import Home from "./pages/Home";
import ServiceDetail from "./pages/ServiceDetail";
import MyBookings from "./pages/MyBookings";
import MyServices from "./pages/MyServices";
import MyServiceBookings from "./pages/MyServiceBookings";
import CreateService from "./pages/CreateService";
import Login from "./pages/Login";
import Register from "./pages/Register";

const App = () => {
  return (
    <ToastProvider>
      <AuthProvider>
        <BrowserRouter>
          <ToastContainer />
          <Navbar />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/service/:id" element={<ServiceDetail />} />
            <Route path="/my-bookings" element={<MyBookings />} />
            <Route path="/my-services" element={<MyServices />} />
            <Route path="/my-service-bookings" element={<MyServiceBookings />} />
            <Route path="/create-service" element={<CreateService />} />
            <Route path="/edit-service/:id" element={<CreateService />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </ToastProvider>
  );
};

export default App;
