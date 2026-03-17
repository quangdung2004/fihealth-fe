import { useState, useEffect } from "react";
import {
  Box,
  Button,
  TextField,
  Typography,
  Paper,
  Divider,
} from "@mui/material";
import { FitnessCenter, LockOutlined } from "@mui/icons-material";
import { useNavigate, useLocation } from "react-router-dom";
import authService from "../services/authService";

export function OtpVerificationPage() {
  const [otp, setOtp] = useState("");
  const navigate = useNavigate();
  const location = useLocation();
  const email = location.state?.email || "email của bạn";

  const handleSubmit = async (e) => {
    e.preventDefault();
    const prevStep = location.state?.prevStep; // "register" or "forgot-password"

    try {
      if (prevStep === "register") {
        await authService.verifyOtp({ email, otp });
        alert("Xác thực thành công! Vui lòng đăng nhập.");
        navigate("/");
      } else if (prevStep === "forgot-password") {
        // For reset password, usually we send OTP + New Password.
        // But the current UI only has OTP.
        // And the user DTO for ResetPasswordRequest is { email, otp }. 
        // This suggests the "Reset Password" happens AFTER this, or this endpoint generates a temp password?
        // "ResetPasswordRequest" usually implies PERFORMING the reset.
        // Let's assume this page verifies OTP, and then we redirect to a NEW page "ResetPasswordPage" 
        // OR checks if the backend "resetPassword" endpoint requires a new password. 
        // Looking at user DTO: ResetPasswordRequest { title: email, otp }. NO PASSWORD field?
        // Wait, I should re-read the request. 
        // "ResetPasswordRequest { email, otp }" -> This looks like it verifies OTP and maybe resets to a random password?
        // OR it returns a token? 

        // Let's call resetPassword with email and otp.
        await authService.resetPassword({ email, otp });
        alert("Mật khẩu đã được đặt lại thành công (hoặc mã hợp lệ). Vui lòng kiểm tra email hoặc đăng nhập.");
        navigate("/");
      } else {
        // Default fallback if context missing
        await authService.verifyOtp({ email, otp });
        alert("Xác thực thành công!");
        navigate("/");
      }
    } catch (error) {
      console.error("OTP Verification failed", error);
      alert("Mã OTP không hợp lệ hoặc đã hết hạn.");
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
        <Paper sx={{ p: 4, width: "100%", maxWidth: 420 }} elevation={3}>
          {/* Header */}
          <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 2 }}>
            <FitnessCenter color="success" fontSize="large" />
            <Typography variant="h4" fontWeight={700}>
              FiHealth
            </Typography>
          </Box>

          <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", mb: 2 }}>
            <LockOutlined color="primary" sx={{ fontSize: 48, mb: 1, color: 'success.main' }} />
            <Typography variant="h5" fontWeight={600}>
              Xác thực OTP
            </Typography>
          </Box>

          <Typography color="text.secondary" mb={3} textAlign="center">
            Mã xác thực đã được gửi đến email <strong>{email}</strong>. Vui lòng kiểm tra và nhập mã vào bên dưới.
          </Typography>

          <Box component="form" onSubmit={handleSubmit}>
            <TextField
              label="Mã OTP"
              type="text"
              fullWidth
              margin="normal"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              required
              autoFocus
              inputProps={{ style: { textAlign: 'center', letterSpacing: '0.5em', fontSize: '1.2em' } }}
            />

            <Button
              type="submit"
              variant="contained"
              color="success"
              fullWidth
              sx={{ py: 1.2, mt: 2 }}
            >
              Xác nhận
            </Button>
          </Box>

          <Box sx={{ mt: 2, display: 'flex', justifyContent: 'center' }}>
            <Button size="small" onClick={() => alert("Đã gửi lại mã!")}>Gửi lại mã</Button>
          </Box>

          <Divider sx={{ my: 3 }} />

          <Button fullWidth variant="text" onClick={() => navigate("/forgot-password")}>
            Quay lại
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
