import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Paper,
  Typography,
  Button,
  Divider,
  Stack,
  Card,
  CardContent,
  Chip,
  IconButton,
  Alert,
  CircularProgress,
} from "@mui/material";
import { FitnessCenter, AutoAwesome, Add, ArrowForward } from "@mui/icons-material";

import axiosClient from "../api/axiosClient"; // ✅ sửa đúng relative path

export default function MyAssessmentsListPage() {
  const navigate = useNavigate();

  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errMsg, setErrMsg] = useState("");

  const token = useMemo(() => localStorage.getItem("token"), []);

  useEffect(() => {
    let alive = true;

    async function load() {
      setLoading(true);
      setErrMsg("");

      try {
        // Backend của bạn yêu cầu me=true
        const res = await axiosClient.get("/assessments", { params: { me: true } });
        if (!alive) return;

        // res.data có thể là:
        // - List<NutritionAssessment> (mảng)
        // - hoặc ApiResponse { success, data }
        const payload = Array.isArray(res.data) ? res.data : res.data?.data;

        if (!Array.isArray(payload)) {
          setItems([]);
          setErrMsg("Dữ liệu trả về không đúng định dạng (không phải mảng).");
          return;
        }

        setItems(payload);
      } catch (e) {
        if (!alive) return;

        const status = e?.response?.status;
        const serverMsg = e?.response?.data?.message || e?.response?.data?.error;

        if (status === 401) {
          setErrMsg("Bạn chưa đăng nhập hoặc token hết hạn. Hãy đăng nhập lại.");
        } else {
          setErrMsg(serverMsg || "Không tải được danh sách assessments. Vui lòng thử lại.");
        }
        setItems([]);
      } finally {
        if (alive) setLoading(false);
      }
    }

    load();
    return () => {
      alive = false;
    };
  }, [token]);

  // Map data từ backend sang UI label
  const mappedItems = useMemo(() => {
    // Tuỳ cấu trúc NutritionAssessment của bạn, mình cố gắng “chịu lỗi”:
    return items.map((x) => {
      // id thường là UUID
      const id = x.id || x.assessmentId || x.uuid;

      // createdAt: có thể là ISO string hoặc timestamp
      const createdAtRaw = x.createdAt || x.createdDate || x.created_time || x.created;
      const createdAt = createdAtRaw
        ? new Date(createdAtRaw).toLocaleDateString("vi-VN")
        : "—";

      // bmi: có thể nằm ở field bmi hoặc tính từ weight/height
      let bmi = x.bmi;
      if (bmi == null) {
        const h = Number(x.heightCm || x.height || 0) / 100;
        const w = Number(x.weightKg || x.weight || 0);
        if (h > 0 && w > 0) bmi = w / (h * h);
      }
      const bmiText = bmi != null && Number.isFinite(Number(bmi)) ? Number(bmi).toFixed(1) : "—";

      const goal = x.goal || x.goalType || "—";

      return { id, createdAt, bmiText, goal, raw: x };
    });
  }, [items]);

  const goCreate = () => {
    // Nếu chưa login, bạn có thể điều hướng về login trước
    if (!localStorage.getItem("token")) {
      navigate("/");
      return;
    }
    navigate("/assessments/new");
  };

  return (
    <Box
      sx={{
        position: "fixed",
        inset: 0,
        display: "flex",
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
        <Paper elevation={3} sx={{ p: 4, width: "100%", maxWidth: 680 }}>
          {/* Header */}
          <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1 }}>
            <FitnessCenter color="success" fontSize="large" />
            <Box sx={{ flex: 1 }}>
              <Typography variant="h4" fontWeight={800}>
                FiHealth
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Danh sách đánh giá dinh dưỡng
              </Typography>
            </Box>

            <Button variant="contained" color="success" startIcon={<Add />} onClick={goCreate}>
              Tạo mới
            </Button>
          </Box>

          <Typography color="text.secondary" mb={2}>
            Lịch sử các lần đánh giá dinh dưỡng của bạn.
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
                <Typography fontWeight={700}>Theo dõi tiến trình sức khỏe</Typography>
                <Typography variant="body2" color="text.secondary">
                  So sánh BMI và mục tiêu qua từng lần đánh giá.
                </Typography>
              </Box>
            </Box>
          </Paper>

          {loading && (
            <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 2 }}>
              <CircularProgress size={20} />
              <Typography variant="body2" color="text.secondary">
                Đang tải dữ liệu...
              </Typography>
            </Box>
          )}

          {!!errMsg && (
            <Alert severity="warning" sx={{ mb: 2 }}>
              {errMsg}
            </Alert>
          )}

          {!loading && !errMsg && mappedItems.length === 0 && (
            <Alert severity="info" sx={{ mb: 2 }}>
              Chưa có assessment nào. Nhấn “Tạo mới” để bắt đầu.
            </Alert>
          )}

          {/* LIST */}
          <Stack spacing={2}>
            {mappedItems.map((x) => (
              <Card key={x.id} variant="outlined">
                <CardContent sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                  <Box sx={{ flex: 1 }}>
                    <Typography fontWeight={700}>Assessment {x.createdAt}</Typography>
                    <Typography variant="body2" color="text.secondary">
                      ID: {x.id}
                    </Typography>

                    <Box sx={{ mt: 1, display: "flex", gap: 1 }}>
                      <Chip label={`BMI: ${x.bmiText}`} color="success" />
                      <Chip label={`Mục tiêu: ${x.goal}`} variant="outlined" />
                    </Box>
                  </Box>

                  <IconButton
                    color="success"
                    onClick={() => navigate(`/assessments/${x.id}`)}
                    disabled={!x.id}
                  >
                    <ArrowForward />
                  </IconButton>
                </CardContent>
              </Card>
            ))}
          </Stack>

          <Divider sx={{ my: 3 }} />

          <Button variant="text" onClick={() => navigate("/")} sx={{ textTransform: "none" }}>
            ← Về trang chủ
          </Button>
        </Paper>
      </Box>

      {/* RIGHT */}
      <Box
        sx={{
          flex: 1,
          display: { xs: "none", md: "block" },
          backgroundImage:
            "url(https://images.unsplash.com/photo-1554288246-9b10b5e0fcae?w=1600&q=80)",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      />
    </Box>
  );
}
