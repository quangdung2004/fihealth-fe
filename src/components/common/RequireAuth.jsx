import React from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";

export default function RequireAuth() {
  const location = useLocation();
  const token = localStorage.getItem("accessToken");

  if (!token) {
    // (Tuỳ chọn) lưu lại đường dẫn để LoginPage dùng được ngay cả khi không đọc state
    sessionStorage.setItem("redirectAfterLogin", location.pathname + location.search);

    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  return <Outlet />;
}
