import PropTypes from "prop-types";
import { createContext, useContext, useEffect, useMemo, useState } from "react";
import axiosClient from "../../api/axiosClient"; // ✅ đúng theo ảnh: AuthContext nằm trong src/components/common

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [me, setMe] = useState(null);
  const [loadingMe, setLoadingMe] = useState(true);

  const fetchMe = async () => {
    try {
      const res = await axiosClient.get("/users/me");
      const data = res?.data?.data ?? null; // ApiResponse.success(data)
      setMe(data);
      return data;
    } catch (err) {
      // ✅ xử lý exception cho Sonar
      console.error("fetchMe(/users/me) failed:", err?.response?.data || err);
      setMe(null);
      return null;
    } finally {
      setLoadingMe(false);
    }
  };

  // Auto fetch /me nếu đã có token (refresh trang vẫn giữ info trên layout)
  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    if (!token) {
      setLoadingMe(false);
      return;
    }
    fetchMe();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const logout = () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("role");
    setMe(null);
  };

  const value = useMemo(
    () => ({ me, setMe, loadingMe, fetchMe, logout }),
    [me, loadingMe]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

AuthProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
