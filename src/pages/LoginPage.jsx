import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Alert,
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
import { useAuth } from "../components/common/AuthContext";

// ===== role helpers =====
function extractRoleFromPayload(payload) {
  if (payload?.role) return payload.role;
  const roleKey = Object.keys(payload || {}).find((k) => k.toLowerCase().includes("role"));
  if (roleKey) return payload[roleKey];
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

// ===== FE validation =====
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function validateLogin({ email, password }) {
  const errors = { email: "", password: "" };

  const e = String(email || "").trim();
  const p = String(password || "");

  if (!e) errors.email = "Email là bắt buộc.";
  else if (!emailRegex.test(e)) errors.email = "Email không đúng định dạng (vd: name@gmail.com).";

  if (!p) errors.password = "Mật khẩu là bắt buộc.";
  else if (p.length < 6) errors.password = "Mật khẩu phải từ 6 ký tự trở lên.";

  const ok = !errors.email && !errors.password;
  return { ok, errors, normalized: { email: e, password: p } };
}

function getFriendlyLoginError(err) {
  const status = err?.response?.status;
  const apiMsg =
    err?.response?.data?.message ||
    err?.response?.data?.error ||
    err?.message ||
    "";

  if (status === 401 || status === 400) {
    return apiMsg?.trim() || "Email hoặc mật khẩu không đúng. Vui lòng thử lại.";
  }
  if (status >= 500) return "Hệ thống đang bận. Vui lòng thử lại sau.";
  return apiMsg?.trim() || "Đăng nhập thất bại. Vui lòng thử lại.";
}

export function LoginPage() {
  const navigate = useNavigate();
  const { fetchMe } = useAuth();

  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [submitting, setSubmitting] = useState(false);

  // lỗi hiển thị UI
  const [errorText, setErrorText] = useState("");
  const [fieldError, setFieldError] = useState({ email: "", password: "" });

  const clearGlobalError = () => {
    if (errorText) setErrorText("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (submitting) return;

    // ✅ validate FE trước khi call API
    const v = validateLogin({ email, password });
    setFieldError(v.errors);
    setErrorText(""); // clear lỗi global

    if (!v.ok) return;

    try {
      setSubmitting(true);

      const response = await axiosClient.post("/auth/login", v.normalized);
      const { accessToken, refreshToken } = response.data.data;

      localStorage.setItem("accessToken", accessToken);
      localStorage.setItem("refreshToken", refreshToken);

      const payload = jwtDecode(accessToken);
      const roleRaw = extractRoleFromPayload(payload);
      const role = normalizeRole(roleRaw);

      if (!role) {
        setErrorText("Không đọc được role từ accessToken. Vui lòng liên hệ admin.");
        return;
      }
      localStorage.setItem("role", role);

      // gọi /users/me sau login
      const me = await fetchMe();

      if (role === "ADMIN") {
        navigate("/admin/foods", { replace: true });
        return;
      }

      // USER: chưa có profile -> onboarding
      if (me && me.hasProfile === false) {
        navigate("/user/onboarding", { replace: true });
      } else {
        navigate("/user/current-plan", { replace: true });
      }
    } catch (error) {
      console.error("Login failed:", error?.response?.data || error);
      setErrorText(getFriendlyLoginError(error));

      // nếu sai credentials -> highlight field
      const status = error?.response?.status;
      if (status === 401 || status === 400) {
        setFieldError({
          email: "Kiểm tra lại email",
          password: "Kiểm tra lại mật khẩu",
        });
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Box sx={{ position: "fixed", inset: 0, display: "flex", overflow: "hidden", bgcolor: "#fff" }}>
      <Box sx={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", px: 2 }}>
        <Paper
          elevation={0}
          sx={{
            p: 4,
            width: "100%",
            maxWidth: 440,
            borderRadius: 3,
            border: "1px solid",
            borderColor: "divider",
            boxShadow: "0 14px 50px rgba(0,0,0,0.10)",
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1 }}>
            <FitnessCenter color="success" fontSize="large" />
            <Typography variant="h4" fontWeight={900}>FiHealth</Typography>
          </Box>

          <Typography color="text.secondary" mb={2.5}>
            Đăng nhập để tiếp tục kế hoạch dinh dưỡng & luyện tập của bạn.
          </Typography>

          <Paper
            variant="outlined"
            sx={{
              p: 2,
              mb: 2.2,
              borderRadius: 2.5,
              bgcolor: "rgba(46, 125, 50, 0.06)",
              borderColor: "rgba(46, 125, 50, 0.18)",
            }}
          >
            <Box sx={{ display: "flex", gap: 1.2 }}>
              <AutoAwesome color="success" />
              <Box>
                <Typography fontWeight={800}>AI Coach</Typography>
                <Typography variant="body2" color="text.secondary">
                  Thực đơn + workout cá nhân hoá theo mục tiêu.
                </Typography>
              </Box>
            </Box>
          </Paper>

          {/* lỗi global (sai tài khoản/mật khẩu, server lỗi...) */}
          {errorText && (
            <Alert severity="error" sx={{ mb: 2, borderRadius: 2 }} onClose={() => setErrorText("")}>
              {errorText}
            </Alert>
          )}

          <Box component="form" onSubmit={handleSubmit}>
            <TextField
              label="Email"
              fullWidth
              margin="normal"
              value={email}
              onChange={(e2) => {
                setEmail(e2.target.value);
                clearGlobalError();
                if (fieldError.email) setFieldError((p) => ({ ...p, email: "" }));
              }}
              required
              error={Boolean(fieldError.email)}
              helperText={fieldError.email || " "}
            />

            <TextField
              label="Mật khẩu"
              type={showPassword ? "text" : "password"}
              fullWidth
              margin="normal"
              value={password}
              onChange={(e2) => {
                setPassword(e2.target.value);
                clearGlobalError();
                if (fieldError.password) setFieldError((p) => ({ ...p, password: "" }));
              }}
              required
              error={Boolean(fieldError.password)}
              helperText={fieldError.password || " "}
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
              <Button size="small" onClick={() => navigate("/forgot-password")}>
                Quên mật khẩu?
              </Button>
            </Box>

            <Button
              type="submit"
              variant="contained"
              color="success"
              fullWidth
              disabled={submitting}
              sx={{ py: 1.2, mt: 1, borderRadius: 2 }}
            >
              {submitting ? "Đang đăng nhập..." : "Đăng nhập"}
            </Button>
          </Box>
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
        <Box sx={{ position: "absolute", inset: 0, bgcolor: "rgba(255,255,255,0.78)" }} />
        <Box sx={{ position: "absolute", left: 40, bottom: 40, right: 40 }}>
          <Typography sx={{ fontSize: 34, fontWeight: 900, lineHeight: 1.1 }}>
            Your plan. Your progress.
          </Typography>
          <Typography sx={{ mt: 1.2, color: "text.secondary", maxWidth: 520 }}>
            Theo dõi lịch sử và kế hoạch một cách rõ ràng, dễ dùng.
          </Typography>
        </Box>
      </Box>
    </Box>
  );
}
