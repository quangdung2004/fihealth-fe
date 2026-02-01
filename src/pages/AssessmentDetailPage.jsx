import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  Box,
  Paper,
  Typography,
  Divider,
  Stack,
  Chip,
  Alert,
  CircularProgress,
  Button,
} from "@mui/material";

import axiosClient from "../api/axiosClient"; // ✅ đúng nếu file ở src/api/axiosClient.js

export default function AssessmentDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [detail, setDetail] = useState(null);
  const [loading, setLoading] = useState(true);
  const [errMsg, setErrMsg] = useState("");

  const token = useMemo(() => localStorage.getItem("token"), []);

  useEffect(() => {
    let alive = true;

    async function load() {
      setLoading(true);
      setErrMsg("");

      if (!id) {
        setErrMsg("Thiếu id trên URL.");
        setLoading(false);
        return;
      }

      try {
        const res = await axiosClient.get(`/assessments/${id}`);

        if (!alive) return;

        // res.data có thể là object trực tiếp hoặc ApiResponse { data: ... }
        const payload = res.data?.data ?? res.data;

        if (!payload || typeof payload !== "object") {
          setErrMsg("Dữ liệu trả về không hợp lệ.");
          setDetail(null);
          return;
        }

        setDetail(payload);
      } catch (e) {
        if (!alive) return;

        const status = e?.response?.status;
        const serverMsg = e?.response?.data?.message || e?.response?.data?.error;

        if (status === 401) {
          setErrMsg("Bạn chưa đăng nhập hoặc token hết hạn. Hãy đăng nhập lại.");
        } else if (status === 404) {
          setErrMsg("Không tìm thấy assessment với id này.");
        } else {
          setErrMsg(serverMsg || "Không tải được chi tiết assessment. Vui lòng thử lại.");
        }
        setDetail(null);
      } finally {
        if (alive) setLoading(false);
      }
    }

    load();
    return () => {
      alive = false;
    };
  }, [id, token]);

  // map mềm để hiển thị đẹp, không phụ thuộc field name
  const ui = useMemo(() => {
    if (!detail) return null;

    const createdAtRaw = detail.createdAt || detail.createdDate || detail.created || detail.created_time;
    const createdAt = createdAtRaw ? new Date(createdAtRaw).toLocaleString("vi-VN") : "—";

    const goal = detail.goal || detail.goalType || detail.target || "—";
    const activity = detail.activityLevel || detail.activity || "—";

    let bmi = detail.bmi;
    if (bmi == null) {
      const h = Number(detail.heightCm || detail.height || 0) / 100;
      const w = Number(detail.weightKg || detail.weight || 0);
      if (h > 0 && w > 0) bmi = w / (h * h);
    }
    const bmiText = bmi != null && Number.isFinite(Number(bmi)) ? Number(bmi).toFixed(1) : "—";

    return {
      id: detail.id || id,
      createdAt,
      bmiText,
      goal,
      activity,
    };
  }, [detail, id]);

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
          <Typography variant="h4" fontWeight={800}>
            FiHealth
          </Typography>

          <Typography color="text.secondary" mb={2}>
            Chi tiết đánh giá dinh dưỡng
          </Typography>

          <Divider sx={{ my: 2 }} />

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

          {!loading && !errMsg && ui && (
            <Stack spacing={1}>
              <Typography>ID: {ui.id}</Typography>
              <Typography>Ngày tạo: {ui.createdAt}</Typography>

              <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
                <Chip label={`BMI: ${ui.bmiText}`} color="success" />
                <Chip label={`Mục tiêu: ${ui.goal}`} variant="outlined" />
                <Chip label={`Vận động: ${ui.activity}`} variant="outlined" />
              </Stack>
            </Stack>
          )}

          <Divider sx={{ my: 3 }} />

          <Stack direction="row" spacing={1}>
            <Button variant="text" onClick={() => navigate("/assessments")} sx={{ textTransform: "none" }}>
              ← Danh sách
            </Button>

            <Button
              variant="outlined"
              color="success"
              onClick={() => navigate("/assessments/new")}
              sx={{ ml: "auto" }}
            >
              Tạo mới
            </Button>
          </Stack>
        </Paper>
      </Box>

      {/* RIGHT */}
      <Box
        sx={{
          flex: 1,
          display: { xs: "none", md: "block" },
          backgroundImage:
            "url(https://images.unsplash.com/photo-1594737625785-a6cbdabd333c?w=1600&q=80)",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      />
    </Box>
  );
}
