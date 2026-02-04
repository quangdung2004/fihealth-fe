import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Button,
  TextField,
  Typography,
  Checkbox,
  FormControlLabel,
  Divider,
  IconButton,
  Paper,
} from "@mui/material";
import { Visibility, VisibilityOff, FitnessCenter, AutoAwesome } from "@mui/icons-material";
import axiosClient from "../api/axiosClient";
import { jwtDecode } from "jwt-decode";

// Tìm role trong payload theo nhiều khả năng
function extractRoleFromPayload(payload) {
  // 1) Case phổ biến nhất: claim "role"
  if (payload?.role) return payload.role;

  // 2) Nếu BE đặt key khác (SecurityConstant.CLAIM_ROLE), thử dò key có chữ "role"
  const roleKey = Object.keys(payload || {}).find((k) => k.toLowerCase().includes("role"));
  if (roleKey) return payload[roleKey];

  // 3) Các kiểu khác (nếu bạn có)
  if (Array.isArray(payload?.roles) && payload.roles.length) return payload.roles[0];
  if (Array.isArray(payload?.authorities) && payload.authorities.length) return payload.authorities[0];

  return null;
}

function normalizeRole(roleRaw) {
  const s = String(roleRaw || "").toUpperCase();
  if (s.includes("ADMIN")) return "ADMIN";
  if (s.includes("USER")) return "USER";
  return null;
}

export function LoginPage() {
  const navigate = useNavigate();

  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axiosClient.post("/auth/login", { email, password });
      const { accessToken, refreshToken } = response.data.data;

      localStorage.setItem("accessToken", accessToken);
      localStorage.setItem("refreshToken", refreshToken);

      const payload = jwtDecode(accessToken);
      console.log("JWT payload:", payload); // <= mở console để xem claim role

      const roleRaw = extractRoleFromPayload(payload);
      const role = normalizeRole(roleRaw);

      if (!role) {
        alert("Không đọc được role từ accessToken. Kiểm tra claim role trong JWT payload.");
        return;
      }

      localStorage.setItem("role", role);

      // ✅ chuyển trang theo role
      if (role === "ADMIN") {
        navigate("/admin/foods", { replace: true });
      } else {
        navigate("/user/current-plan", { replace: true });
      }
    } catch (error) {
      console.error("Login failed", error);
      alert("Đăng nhập thất bại. Vui lòng kiểm tra lại thông tin.");
    }
  };

  return (
    <Box sx={{ position: "fixed", inset: 0, display: "flex", overflow: "hidden", bgcolor: "#fff" }}>
      <Box sx={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", px: 2 }}>
        <Paper elevation={3} sx={{ p: 4, width: "100%", maxWidth: 420 }}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 2 }}>
            <FitnessCenter color="success" fontSize="large" />
            <Typography variant="h4" fontWeight={700}>FiHealth</Typography>
          </Box>

          <Typography color="text.secondary" mb={3}>
            Chào mừng trở lại! Đăng nhập để tiếp tục hành trình sức khỏe của bạn.
          </Typography>

          <Paper variant="outlined" sx={{ p: 2, mb: 3, bgcolor: "#f1fdf9", borderColor: "#cceee5" }}>
            <Box sx={{ display: "flex", gap: 1 }}>
              <AutoAwesome color="success" />
              <Box>
                <Typography fontWeight={600}>Được hỗ trợ bởi AI</Typography>
                <Typography variant="body2" color="text.secondary">
                  Tạo thực đơn và kế hoạch tập luyện cá nhân hóa
                </Typography>
              </Box>
            </Box>
          </Paper>

          <Box component="form" onSubmit={handleSubmit}>
            <TextField
              label="Email"
              fullWidth
              margin="normal"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />

            <TextField
              label="Mật khẩu"
              type={showPassword ? "text" : "password"}
              fullWidth
              margin="normal"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              InputProps={{
                endAdornment: (
                  <IconButton onClick={() => setShowPassword(!showPassword)} edge="end">
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                ),
              }}
            />

            <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", my: 1 }}>
              <FormControlLabel control={<Checkbox />} label="Ghi nhớ đăng nhập" />
              <Button size="small" onClick={() => navigate("/forgot-password")}>Quên mật khẩu?</Button>
            </Box>

            <Button type="submit" variant="contained" color="success" fullWidth sx={{ py: 1.2, mt: 1 }}>
              Đăng nhập
            </Button>
          </Box>

          <Divider sx={{ my: 3 }}>hoặc</Divider>

          <Button variant="outlined" fullWidth>Tiếp tục với Google</Button>
        </Paper>
      </Box>

      <Box
        sx={{
          flex: 1,
          display: { xs: "none", md: "block" },
          position: "relative",
          backgroundImage:
            "url(https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=1600&q=80)",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <Box sx={{ position: "absolute", inset: 0, bgcolor: "rgba(255,255,255,0.75)" }} />
      </Box>
    </Box>
  );
}
