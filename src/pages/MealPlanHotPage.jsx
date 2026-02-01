import { useMemo, useState } from "react";
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
  Alert,
  CircularProgress,
} from "@mui/material";
import {
  Visibility,
  VisibilityOff,
  FitnessCenter,
  AutoAwesome,
} from "@mui/icons-material";

import axiosClient from "../api/axiosClient"; // ✅ chỉnh đúng path nếu khác

function MealPlanHotPage() {
  const navigate = useNavigate();

  const [showPreview, setShowPreview] = useState(true);
  const [period, setPeriod] = useState("WEEK");
  const [limit, setLimit] = useState("10");
  const [confirm, setConfirm] = useState(true);

  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [errMsg, setErrMsg] = useState("");
  const [okMsg, setOkMsg] = useState("");
  const [result, setResult] = useState(null);

  const payload = useMemo(
    () => ({
      method: "GET",
      url: `/api/meal-plans/hot?period=${period || "{period}"}&limit=${limit || "{limit}"}`,
      query: { period: period || null, limit: limit || null },
      note: "FE calls backend via axiosClient (baseURL=/api).",
    }),
    [period, limit]
  );

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitted(true);
    setErrMsg("");
    setOkMsg("");
    setResult(null);

    if (!confirm) {
      setErrMsg("Bạn chưa tick xác nhận lấy danh sách hot.");
      return;
    }

    const p = (period || "").trim();
    const l = Number(limit);

    if (!p) {
      setErrMsg("period không được để trống.");
      return;
    }
    if (!Number.isFinite(l) || l <= 0) {
      setErrMsg("limit phải là số > 0.");
      return;
    }

    setLoading(true);
    try {
      const res = await axiosClient.get("/meal-plans/hot", {
        params: { period: p, limit: l },
      });

      // res.data có thể là mảng/object trực tiếp hoặc ApiResponse { data: ... }
      const data = res.data?.data ?? res.data;

      setResult(data);
      setOkMsg("Lấy danh sách hot thành công.");
      console.log("MealPlanHot OK:", data);
    } catch (e2) {
      const status = e2?.response?.status;
      const serverMsg = e2?.response?.data?.message || e2?.response?.data?.error;

      if (status === 401) {
        setErrMsg("Bạn chưa đăng nhập hoặc token hết hạn. Hãy đăng nhập lại.");
      } else if (status === 400) {
        setErrMsg(serverMsg || "Request không hợp lệ (400). Kiểm tra period/limit.");
      } else {
        setErrMsg(serverMsg || "Gọi API thất bại. Vui lòng thử lại.");
      }

      console.log("MealPlanHot ERR:", status, e2?.response?.data || e2);
    } finally {
      setLoading(false);
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
        <Paper elevation={3} sx={{ p: 4, width: "100%", maxWidth: 420 }}>
          {/* Header */}
          <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 2 }}>
            <FitnessCenter color="success" fontSize="large" />
            <Typography variant="h4" fontWeight={700}>
              FiHealth
            </Typography>
          </Box>

          <Typography color="text.secondary" mb={3}>
            Lấy danh sách Meal Plan “hot” theo period và limit (đã kết nối backend).
          </Typography>

          {/* AI Highlight */}
          <Paper
            variant="outlined"
            sx={{
              p: 2,
              mb: 3,
              bgcolor: "#f1fdf9",
              borderColor: "#cceee5",
            }}
          >
            <Box sx={{ display: "flex", gap: 1 }}>
              <AutoAwesome color="success" />
              <Box>
                <Typography fontWeight={600}>Được hỗ trợ bởi AI</Typography>
                <Typography variant="body2" color="text.secondary">
                  Ưu tiên gợi ý kế hoạch đang được quan tâm theo mục tiêu của bạn
                </Typography>
              </Box>
            </Box>
          </Paper>

          {loading && (
            <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 2 }}>
              <CircularProgress size={20} />
              <Typography variant="body2" color="text.secondary">
                Đang gọi API...
              </Typography>
            </Box>
          )}

          {!!errMsg && (
            <Alert severity="warning" sx={{ mb: 2 }}>
              {errMsg}
            </Alert>
          )}

          {!!okMsg && (
            <Alert severity="success" sx={{ mb: 2 }}>
              {okMsg}
            </Alert>
          )}

          {submitted && !loading && !errMsg && (
            <Typography
              variant="body2"
              sx={{
                mb: 2,
                p: 1.25,
                borderRadius: 1,
                bgcolor: "#f1fdf9",
                border: "1px solid #cceee5",
              }}
            >
              Đã submit. Xem response ở dưới hoặc mở console.
            </Typography>
          )}

          {/* Form */}
          <Box component="form" onSubmit={handleSubmit}>
            <TextField
              label="period (PlanPeriod)"
              fullWidth
              margin="normal"
              value={period}
              onChange={(e) => setPeriod(e.target.value)}
              required
              helperText="Nhập đúng enum backend (vd: DAY/WEEK/MONTH...)."
            />

            <TextField
              label="limit"
              type="number"
              fullWidth
              margin="normal"
              value={limit}
              onChange={(e) => setLimit(e.target.value)}
              required
              inputProps={{ min: 1 }}
            />

            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                my: 1,
              }}
            >
              <FormControlLabel
                control={
                  <Checkbox
                    checked={confirm}
                    onChange={(e) => setConfirm(e.target.checked)}
                  />
                }
                label="Xác nhận lấy danh sách hot"
              />

              <Button size="small" onClick={() => navigate("/")}>
                Về trang chủ
              </Button>
            </Box>

            <Button
              type="submit"
              variant="contained"
              color="success"
              fullWidth
              sx={{ py: 1.2, mt: 1 }}
              disabled={loading}
            >
              Get Hot Plans
            </Button>
          </Box>

          <Divider sx={{ my: 3 }}>preview</Divider>

          <TextField
            label="Xem payload (ẩn/hiện)"
            type={showPreview ? "text" : "password"}
            fullWidth
            margin="normal"
            value={JSON.stringify(payload, null, 2)}
            multiline
            rows={5}
            InputProps={{
              endAdornment: (
                <IconButton
                  onClick={() => setShowPreview(!showPreview)}
                  edge="end"
                >
                  {showPreview ? <VisibilityOff /> : <Visibility />}
                </IconButton>
              ),
              readOnly: true,
            }}
          />

          {result != null && (
            <>
              <Divider sx={{ my: 3 }}>response</Divider>
              <Paper
                variant="outlined"
                sx={{
                  p: 1.5,
                  bgcolor: "#fafafa",
                  borderColor: "#eee",
                  maxHeight: 220,
                  overflow: "auto",
                }}
              >
                <pre style={{ margin: 0, fontSize: 12, whiteSpace: "pre-wrap" }}>
                  {JSON.stringify(result, null, 2)}
                </pre>
              </Paper>
            </>
          )}

          <Typography
            textAlign="center"
            variant="body2"
            color="text.secondary"
            mt={1}
          >
            <Button size="small" onClick={() => navigate("/")}>
              ← Về trang chủ
            </Button>
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
            "url(https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=1600&q=80)",
          backgroundSize: "cover",
          backgroundPosition: "center",
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

/** ✅ Export BOTH để bạn import kiểu nào cũng không làm app crash */
export default MealPlanHotPage;
export { MealPlanHotPage };
