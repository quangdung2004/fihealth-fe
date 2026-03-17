import React from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";

export default function RequireRole({ allow = [] }) {
  const location = useLocation();

  const token = localStorage.getItem("accessToken");
  const role = localStorage.getItem("role"); // ✅ đúng key

  // Chưa đăng nhập => về login + nhớ trang đang định vào
  if (!token || !role) {
    sessionStorage.setItem("redirectAfterLogin", location.pathname + location.search);
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  // Đủ role => cho vào
  if (allow.includes(role)) return <Outlet />;

  // Không đủ quyền => chuyển 403 + nhớ trang bị chặn (from)
  return <Navigate to="/403" replace state={{ from: location }} />;
}
