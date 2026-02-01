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

function MealPlanToggleFavoritePage() {
  const navigate = useNavigate();

  const [showPreview, setShowPreview] = useState(true);
  const [mealPlanId, setMealPlanId] = useState("");
  const [confirm, setConfirm] = useState(true);

  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errMsg, setErrMsg] = useState("");
  const [okMsg, setOkMsg] = useState("");
  const [result, setResult] = useState(null);

  const payload = useMemo(
    () => ({
      method: "POST",
      url: `/api/meal-plans/${mealPlanId || "{id}"}/favorite`,
      pathParams: { id: mealPlanId || null },
      note: "FE calls backend via axiosClient (baseURL=/api).",
    }),
    [mealPlanId]
  );

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitted(true);
    setErrMsg("");
    setOkMsg("");
    setResult(null);

    if (!confirm) {
      setErrMsg("Bạn chưa tick xác nhận toggle favorite.");
      return;
    }

    const id = mealPlanId.trim();
    if (!id) {
      setErrMsg("MealPlan ID không được để trống.");
      return;
    }

    setLoading(true);
    try {
      // POST /api/meal-plans/{id}/favorite
      // thường không cần body, gửi {} cho an toàn
      const res = await axiosClient.post(`/meal-plans/${id}/favorite`, {});

      // res.data có thể là object trực tiếp hoặc ApiResponse { data: ... }
      const data = res.data?.data ?? res.data;

      setResult(data);
      setOkMsg("Toggle favorite thành công.");
      console.log("Toggle favorite OK:", data);
    } catch (e2) {
      const status = e2?.response?.status;
      const serverMsg = e2?.response?.data?.message || e2?.response?.data?.error;

      if (status === 401) {
        setErrMsg("Bạn chưa đăng nhập hoặc token hết hạn. Hãy đăng nhập lại.");
      } else if (status === 404) {
        setErrMsg("Không tìm thấy Meal Plan với ID này.");
      } else if (status === 400) {
        setErrMsg(serverMsg || "Request không hợp lệ (400). Kiểm tra UUID.");
      } else {
        setErrMsg(serverMsg || "Gọi API thất bại. Vui lòng thử lại.");
      }

      console.log("Toggle favorite ERR:", status, e2?.response?.data || e2);
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
            Toggle “yêu thích” cho Meal Plan theo ID (đã kết nối backend).
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
                  Cá nhân hóa gợi ý và theo dõi meal plan yêu thích
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
              label="MealPlan ID (UUID)"
              fullWidth
              margin="normal"
              value={mealPlanId}
              onChange={(e) => setMealPlanId(e.target.value)}
              required
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
                label="Xác nhận toggle favorite"
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
              Toggle Favorite
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

          <Typography textAlign="center" variant="body2" color="text.secondary" mt={1}>
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
        {/* overlay */}
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
export default MealPlanToggleFavoritePage;
export { MealPlanToggleFavoritePage };
