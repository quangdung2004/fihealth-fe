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

export function OtpVerificationPage() {
  const [otp, setOtp] = useState("");
  const navigate = useNavigate();
  const location = useLocation();
  const email = location.state?.email || "email của bạn";

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Verify OTP:", otp, "for", email);
    // Add verification logic here later
    // For now, assume success and go to login or reset password page (if there was one)
    // Or maybe go to a "Reset Password" page where they actually enter the new password.
    // For this task, User just asked for the OTP page for the link sent.
    // Usually "Link sent" means they click the link in email to go to ResetPasswordPage.
    // But sometimes it's "Enter OTP sent to email". 
    // The user said "trang nhập mã OTP khi mà gửi link đặt lại mật khẩu". 
    // It's a bit ambiguous if it's Link OR OTP. 
    // But "nhập mã OTP" implies manual entry.
    // Let's assume after OTP is correct, we might go to a ResetPasswordPage (which doesn't exist yet, or maybe just back to login for now).
    alert("Xác thực thành công (Demo)"); 
    navigate("/"); 
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
