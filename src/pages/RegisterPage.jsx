import { useState } from "react";
import {
  Box,
  Button,
  TextField,
  Typography,
  Paper,
  Divider,
  IconButton,
  Alert,
} from "@mui/material";
import {
  Visibility,
  VisibilityOff,
  FitnessCenter,
} from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import authService from "../services/authService";

export function RegisterPage() {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [form, setForm] = useState({
    fullName: "",
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError(""); // Clear error on input change
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Basic validation
    if (form.password.length < 6) {
      setError("Mật khẩu phải có ít nhất 6 ký tự");
      return;
    }

    setSubmitting(true);
    setError("");
    setSuccess("");

    try {
      await authService.register(form);
      setSuccess("Đăng ký thành công! Vui lòng kiểm tra email để lấy mã OTP.");
      // Navigate after showing success message
      setTimeout(() => {
        navigate("/verify-otp", { state: { email: form.email, prevStep: "register" } });
      }, 1500);
    } catch (err) {
      console.error("Register failed", err);
      const errorMsg = err.response?.data?.message || "Đăng ký thất bại. Vui lòng thử lại.";
      setError(errorMsg);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Box
      sx={{
        position: "fixed",
        inset: 0,
        display: "flex",
        overflow: "hidden",
        bgcolor: "#fff",
      }}
    >
      {/* LEFT */}
      <Box
        sx={{
          flex: 1,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          px: 2,
        }}
      >
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
          {/* Header */}
          <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1 }}>
            <FitnessCenter color="success" fontSize="large" />
            <Typography variant="h4" fontWeight={900}>
              FiHealth
            </Typography>
          </Box>

          <Typography color="text.secondary" mb={2.5}>
            Tạo tài khoản mới để bắt đầu hành trình sức khỏe của bạn.
          </Typography>

          {success && (
            <Alert severity="success" sx={{ mb: 2, borderRadius: 2 }} onClose={() => setSuccess("")}>
              {success}
            </Alert>
          )}

          {error && (
            <Alert severity="error" sx={{ mb: 2, borderRadius: 2 }} onClose={() => setError("")}>
              {error}
            </Alert>
          )}

          <Box component="form" onSubmit={handleSubmit}>
            <TextField
              label="Họ và tên"
              name="fullName"
              fullWidth
              margin="normal"
              value={form.fullName}
              onChange={handleChange}
              required
            />

            <TextField
              label="Email"
              name="email"
              type="email"
              fullWidth
              margin="normal"
              value={form.email}
              onChange={handleChange}
              required
            />

            <TextField
              label="Mật khẩu"
              name="password"
              type={showPassword ? "text" : "password"}
              fullWidth
              margin="normal"
              value={form.password}
              onChange={handleChange}
              required
              helperText="Tối thiểu 6 ký tự"
              InputProps={{
                endAdornment: (
                  <IconButton
                    onClick={() => setShowPassword(!showPassword)}
                    edge="end"
                  >
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                ),
              }}
            />

            <Button
              type="submit"
              variant="contained"
              color="success"
              fullWidth
              disabled={submitting}
              sx={{ py: 1.2, mt: 2, borderRadius: 2 }}
            >
              {submitting ? "Đang tạo tài khoản..." : "Tạo tài khoản"}
            </Button>
          </Box>

          <Divider sx={{ my: 2.5 }}>hoặc</Divider>

          <Typography textAlign="center" variant="body2">
            Đã có tài khoản?{" "}
            <Button size="small" onClick={() => navigate("/login")}>Đăng nhập</Button>
          </Typography>
        </Paper>
      </Box>

      {/* RIGHT */}
      <Box
        sx={{
          flex: 1,
          display: { xs: "none", md: "block" },
          position: "relative",
          backgroundImage:
            "url(https://images.unsplash.com/photo-1546483875-ad9014c88eba?w=1600&q=80)",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <Box sx={{ position: "absolute", inset: 0, bgcolor: "rgba(255,255,255,0.78)" }} />
        <Box sx={{ position: "absolute", left: 40, bottom: 40, right: 40 }}>
          <Typography sx={{ fontSize: 34, fontWeight: 900, lineHeight: 1.1 }}>
            Start your journey.
          </Typography>
          <Typography sx={{ mt: 1.2, color: "text.secondary", maxWidth: 520 }}>
            Tạo tài khoản để nhận kế hoạch dinh dưỡng và luyện tập cá nhân hóa.
          </Typography>
        </Box>
      </Box>
    </Box>
  );
}
