import { useState } from "react";
import {
  Box,
  Button,
  TextField,
  Typography,
  Paper,
  Divider,
} from "@mui/material";
import { FitnessCenter, MailOutline } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";


export function ForgotPasswordPage() {
  const [email, setEmail] = useState("");

  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Reset password for:", email);
    // Simulate sending email
    setTimeout(() => {
      navigate("/verify-otp", { state: { email } });
    }, 500);
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
            Nhập email của bạn để nhận liên kết đặt lại mật khẩu.
          </Typography>

          <Box component="form" onSubmit={handleSubmit}>
            <TextField
              label="Email"
              type="email"
              fullWidth
              margin="normal"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              InputProps={{
                startAdornment: <MailOutline sx={{ mr: 1 }} />,
              }}
            />

            <Button
              type="submit"
              variant="contained"
              color="success"
              fullWidth
              sx={{ py: 1.2, mt: 2 }}
            >
              Gửi link đặt lại mật khẩu
            </Button>
          </Box>

          <Divider sx={{ my: 3 }} />

          <Button fullWidth variant="text" onClick={() => navigate("/")}>
            Quay lại đăng nhập
          </Button>
        </Paper>
      </Box>

      {/* RIGHT */}
      <Box
        sx={{
          flex: 1,
          display: { xs: "none", md: "block" },
          backgroundImage:
            "url(https://images.unsplash.com/photo-1558611848-73f7eb4001a1?w=1600&q=80)",
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
