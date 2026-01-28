import { useState } from "react";
import {
  Box,
  Button,
  TextField,
  Typography,
  Paper,
  Divider,
  IconButton,
} from "@mui/material";
import {
  Visibility,
  VisibilityOff,
  FitnessCenter,
} from "@mui/icons-material";
import { useNavigate } from "react-router-dom";

export function RegisterPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [form, setForm] = useState({
    fullName: "",
    email: "",
    password: "",
  });

  const navigate = useNavigate();
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Register:", form);
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
        <Paper sx={{ p: 4, width: "100%", maxWidth: 420 }} elevation={3}>
          {/* Header */}
          <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 2 }}>
            <FitnessCenter color="success" fontSize="large" />
            <Typography variant="h4" fontWeight={700}>
              FiHealth
            </Typography>
          </Box>

          <Typography color="text.secondary" mb={3}>
            Tạo tài khoản mới để bắt đầu hành trình sức khỏe của bạn.
          </Typography>

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
              sx={{ py: 1.2, mt: 2 }}
            >
              Tạo tài khoản
            </Button>
          </Box>

          <Divider sx={{ my: 3 }} />

          <Typography textAlign="center" variant="body2">
            Đã có tài khoản?{" "}
            <Button size="small" onClick={() => navigate("/")}>Đăng nhập</Button>
          </Typography>
        </Paper>
      </Box>

      {/* RIGHT */}
      <Box
        sx={{
          flex: 1,
          display: { xs: "none", md: "block" },
          backgroundImage:
            "url(https://images.unsplash.com/photo-1546483875-ad9014c88eba?w=1600&q=80)",
          backgroundSize: "cover",
          backgroundPosition: "center",
          position: "relative",
        }}
      >
        <Box
          sx={{
            position: "absolute",
            inset: 0,
            bgcolor: "rgba(255,255,255,0.75)",
          }}
        />
      </Box>
    </Box>
  );
}
