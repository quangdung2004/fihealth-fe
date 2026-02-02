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
  IconButton,
  Alert,
  CircularProgress,
} from "@mui/material";
import { FitnessCenter, AutoAwesome, Add, ArrowForward } from "@mui/icons-material";

import axiosClient from "../api/axiosClient"; // ✅ chỉnh đúng path theo dự án bạn

function safeDateLabel(iso) {
  if (!iso) return "—";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "—";
  return d.toLocaleString("vi-VN", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function enumLabel(v) {
  return v ? String(v).replaceAll("_", " ") : "—";
}

export default function MyAssessmentsListPage() {
  const navigate = useNavigate();

  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errMsg, setErrMsg] = useState("");

  const token = useMemo(() => localStorage.getItem("accessToken"), []);


  useEffect(() => {
    let alive = true;

    async function load() {
      setLoading(true);
      setErrMsg("");

      try {
        // controller của bạn bắt buộc me=true
        const res = await axiosClient.get("/assessments", { params: { me: true } });
        if (!alive) return;

        // ApiResponse.ok(data) => { success, data, message? }
        const payload = res?.data?.data;

        if (!Array.isArray(payload)) {
          setItems([]);
          setErrMsg("Dữ liệu trả về không đúng định dạng (data không phải mảng).");
          return;
        }

        setItems(payload);
      } catch (e) {
        if (!alive) return;

        const status = e?.response?.status;
        const serverMsg = e?.response?.data?.message || e?.response?.data?.error || e?.message;

        if (status === 401) {
          setErrMsg("Bạn chưa đăng nhập hoặc token hết hạn. Hãy đăng nhập lại.");
        } else if (status === 400) {
          // nếu quên me=true thì controller ném IllegalArgumentException
          setErrMsg(serverMsg || "Yêu cầu không hợp lệ (cần me=true).");
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

  // Map đúng DTO NutritionAssessmentResponse (KHÔNG hiển thị metrics)
  const mappedItems = useMemo(() => {
    return (items || []).map((x) => {
      const id = x?.id;

      return {
        id,
        createdAtLabel: safeDateLabel(x?.createdAt),
        updatedAtLabel: safeDateLabel(x?.updatedAt),

        sex: enumLabel(x?.sex),
        goal: enumLabel(x?.goal),
        activityLevel: enumLabel(x?.activityLevel),

        weightKg: x?.weightKg ?? "—",
        heightCm: x?.heightCm ?? "—",
        age: x?.age ?? "—",

        raw: x,
      };
    });
  }, [items]);

  const goCreate = () => {
    if (!localStorage.getItem("accessToken")) {
  navigate("/");
  return;
}

    // trang tính / tạo assessment
    navigate("/assessments/new");
  };

  return (
    <Box sx={{ position: "fixed", inset: 0, display: "flex", bgcolor: "#fff" }}>
      {/* LEFT */}
      <Box sx={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", px: 2 }}>
        <Paper elevation={3} sx={{ p: 4, width: "100%", maxWidth: 720 }}>
          {/* Header */}
          <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1 }}>
            <FitnessCenter color="success" fontSize="large" />
            <Box sx={{ flex: 1 }}>
              <Typography variant="h4" fontWeight={800}>
                FiHealth
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Danh sách đánh giá dinh dưỡng của bạn
              </Typography>
            </Box>

            <Button variant="contained" color="success" startIcon={<Add />} onClick={goCreate}>
              Tạo mới
            </Button>
          </Box>

          <Typography color="text.secondary" mb={2}>
            Xem lại thông tin đánh giá dinh dưỡng theo từng lần đánh giá.
          </Typography>

          {/* AI Highlight */}
          <Paper
            variant="outlined"
            sx={{ p: 2, mb: 3, bgcolor: "#f1fdf9", borderColor: "#cceee5" }}
          >
            <Box sx={{ display: "flex", gap: 1 }}>
              <AutoAwesome color="success" />
              <Box>
                <Typography fontWeight={700}>Theo dõi tiến trình</Typography>
                <Typography variant="body2" color="text.secondary">
                  Mỗi assessment lưu lại thông tin cơ bản (giới tính, tuổi, chiều cao, cân nặng, mức hoạt động, mục tiêu).
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
              <Card key={x.id || Math.random()} variant="outlined">
                <CardContent sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                  <Box sx={{ flex: 1 }}>
                    <Typography fontWeight={800}>
                      Assessment • {x.createdAtLabel}
                    </Typography>

                    <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                      {x.sex} • {x.age} tuổi • {x.heightCm} cm • {x.weightKg} kg
                    </Typography>

                    <Typography variant="body2" color="text.secondary" sx={{ mt: 0.25 }}>
                      Hoạt động: {x.activityLevel} • Mục tiêu: {x.goal}
                      {x.updatedAtLabel !== "—" ? ` • Cập nhật: ${x.updatedAtLabel}` : ""}
                    </Typography>

                    <Typography
                      variant="caption"
                      color="text.secondary"
                      sx={{ display: "block", mt: 1 }}
                    >
                      ID: {x.id || "—"}
                    </Typography>
                  </Box>

                  <IconButton
                    color="success"
                    onClick={() => navigate(`/assessments/${x.id}`)}
                    disabled={!x.id}
                    aria-label="Xem chi tiết"
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
          backgroundImage: "url(https://images.unsplash.com/photo-1554288246-9b10b5e0fcae?w=1600&q=80)",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      />
    </Box>
  );
}
