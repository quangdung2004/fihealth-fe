import { useEffect, useRef, useState } from "react";
import {
  Box,
  Typography,
  Card,
  CardContent,
  Button,
  Grid,
  Container,
  Dialog,
  DialogContent,
  DialogTitle,
  IconButton,
  CircularProgress
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import WorkspacePremiumIcon from "@mui/icons-material/WorkspacePremium";
import axiosClient from "../../api/axiosClient";
import { useAuth } from "../../components/common/AuthContext";

export default function UserPlans() {
  const { fetchMe } = useAuth();

  const [plans, setPlans] = useState([]);
  const [open, setOpen] = useState(false);
  const [checkoutUrl, setCheckoutUrl] = useState("");
  const [orderCode, setOrderCode] = useState("");
  const [secondsLeft, setSecondsLeft] = useState(300);
  const [success, setSuccess] = useState(false);

  const pollingRef = useRef(null);
  const countdownRef = useRef(null);

  // ================== LOAD PLANS ==================
  useEffect(() => {
    axiosClient
      .get("/admin/subscription-plans")
      .then(res => setPlans(res.data?.data || []))
      .catch(() => setPlans([]));
  }, []);

  // ================== CREATE PAYMENT ==================
  const handleChoosePlan = async (planType) => {
    try {
      const res = await axiosClient.post("/payment/qr", { planType });

      const data = res.data.data;
      setCheckoutUrl(data.checkoutUrl);
      setOrderCode(data.orderCode);
      setSecondsLeft(300);
      setSuccess(false);
      setOpen(true);
    } catch (e) {
      console.error(e);
      alert("Không tạo được giao dịch");
    }
  };

  // ================== COUNTDOWN ==================
  useEffect(() => {
    if (!open) return;

    countdownRef.current = setInterval(() => {
      setSecondsLeft(prev => {
        if (prev <= 1) {
          clearInterval(countdownRef.current);
          handleClose();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(countdownRef.current);
  }, [open]);

  // ================== POLLING PAYMENT ==================
  useEffect(() => {
    if (!orderCode) return;

    pollingRef.current = setInterval(async () => {
      try {
        const res = await axiosClient.get(`/payment/status/${orderCode}`);

        if (res.data.data === "SUCCESS") {
          clearInterval(pollingRef.current);
          clearInterval(countdownRef.current);

          setSuccess(true);

          // ⏱ cho PayOS kết thúc UX
          setTimeout(async () => {
            await fetchMe();

            // 🔥 redirect TOP LEVEL (KHÔNG iframe)
            window.top.location.href = "/dashboard";
          }, 3000);
        }
      } catch (e) {
        console.error(e);
      }
    }, 2000);

    return () => clearInterval(pollingRef.current);
  }, [orderCode, fetchMe]);

  // ================== CLOSE MODAL ==================
  const handleClose = () => {
    setOpen(false);
    setCheckoutUrl("");
    setOrderCode("");
    setSuccess(false);
    clearInterval(pollingRef.current);
    clearInterval(countdownRef.current);
  };

  const formatTime = (s) =>
    `${Math.floor(s / 60)}:${String(s % 60).padStart(2, "0")}`;

  // ================== UI ==================
  return (
    <Container maxWidth="lg">
      <Box sx={{ mt: 6, mb: 6, textAlign: "center" }}>
        <Typography variant="h4" fontWeight={800}>
          Các gói Premium
        </Typography>
        <Typography mt={1} color="text.secondary">
          Nâng cấp để mở khóa toàn bộ tính năng cao cấp
        </Typography>
      </Box>

      <Grid container spacing={4} justifyContent="center">
        {plans.map(plan => (
          <Grid item key={plan.id}>
            <Card sx={{ width: 320, height: 380 }}>
              <CardContent>
                <Typography fontWeight={700}>{plan.name}</Typography>
                <Typography variant="h4" fontWeight={800} mt={2}>
                  {Number(plan.price).toLocaleString()} đ
                </Typography>
                <Typography mt={1}>
                  {plan.durationDays} ngày sử dụng
                </Typography>
              </CardContent>

              <Box px={3} pb={3}>
                <Button
                  fullWidth
                  variant="contained"
                  startIcon={<WorkspacePremiumIcon />}
                  onClick={() => handleChoosePlan(plan.planType)}
                >
                  CHỌN GÓI
                </Button>
              </Box>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* ================== PAYOS MODAL ================== */}
      <Dialog open={open} fullWidth maxWidth="lg">
        <DialogTitle>
          {success
            ? "Thanh toán thành công 🎉"
            : `Thanh toán (${formatTime(secondsLeft)})`}
          <IconButton
            onClick={handleClose}
            sx={{ position: "absolute", right: 8, top: 8 }}
            disabled={success}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>

        <DialogContent sx={{ p: 0 }}>
          {success ? (
            <Box
              height={400}
              display="flex"
              flexDirection="column"
              alignItems="center"
              justifyContent="center"
            >
              <CircularProgress />
              <Typography mt={2}>
                Đang cập nhật gói & chuyển hướng...
              </Typography>
            </Box>
          ) : (
            checkoutUrl && (
              <iframe
                src={checkoutUrl}
                title="PayOS"
                style={{
                  width: "100%",
                  height: "600px",
                  border: "none"
                }}
              />
            )
          )}
        </DialogContent>
      </Dialog>
    </Container>
  );
}
