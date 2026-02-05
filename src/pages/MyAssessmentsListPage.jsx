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
import axiosClient from "../api/axiosClient";

// ================= Utils =================
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

// ================= Page =================
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
        const res = await axiosClient.get("/assessments", { params: { me: true } });
        if (!alive) return;

        const payload = res?.data?.data;
        if (!Array.isArray(payload)) {
          setItems([]);
          setErrMsg("Dữ liệu trả về không đúng định dạng.");
          return;
        }
        setItems(payload);
      } catch (e) {
        if (!alive) return;

        const status = e?.response?.status;
        const serverMsg = e?.response?.data?.message || e?.response?.data?.error || e?.message;

        if (status === 401) setErrMsg("Bạn chưa đăng nhập hoặc token hết hạn.");
        else setErrMsg(serverMsg || "Không tải được dữ liệu.");

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

  const mappedItems = useMemo(() => {
    return (items || []).map((x) => ({
      id: x?.id,
      createdAtLabel: safeDateLabel(x?.createdAt),
      updatedAtLabel: safeDateLabel(x?.updatedAt),
      sex: enumLabel(x?.sex),
      goal: enumLabel(x?.goal),
      activityLevel: enumLabel(x?.activityLevel),
      weightKg: x?.weightKg ?? "—",
      heightCm: x?.heightCm ?? "—",
      age: x?.age ?? "—",
    }));
  }, [items]);

  const goCreate = () => {
    if (!localStorage.getItem("accessToken")) return navigate("/");
    navigate("/assessments/new");
  };

  // ✅ IMPORTANT: Không dùng position: fixed / inset:0 nữa
  // ✅ Trang sẽ nằm trong Main layout, tự scroll bình thường và ra giữa.
  return (
    <Box
      sx={{
        width: "100%",
        minHeight: "100%",
        px: { xs: 2, md: 3 },
        py: { xs: 2, md: 3 },
        display: "flex",
        justifyContent: "center",
      }}
    >
      <Box
        sx={{
          width: "100%",
          maxWidth: 1100, // ✅ khung giữa
          display: "flex",
          gap: 3,
          flexDirection: { xs: "column", md: "row" }, // ✅ mobile xếp dọc
          alignItems: "stretch",
        }}
      >
        {/* LEFT CONTENT */}
        <Paper
          elevation={0}
          sx={{
            flex: 1,
            p: { xs: 2.5, md: 3.5 },
            borderRadius: 3,
            border: "1px solid",
            borderColor: "divider",
            boxShadow: "0 14px 50px rgba(0,0,0,0.08)",
          }}
        >
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

          {/* Highlight */}
          <Paper
            variant="outlined"
            sx={{
              p: 2,
              mb: 3,
              borderRadius: 2.5,
              bgcolor: "rgba(46, 125, 50, 0.06)",
              borderColor: "rgba(46, 125, 50, 0.18)",
            }}
          >
            <Box sx={{ display: "flex", gap: 1.2 }}>
              <AutoAwesome color="success" />
              <Box>
                <Typography fontWeight={700}>Theo dõi tiến trình</Typography>
                <Typography variant="body2" color="text.secondary">
                  Mỗi assessment lưu lại thông tin cơ bản (giới tính, tuổi, chiều cao, cân nặng,
                  mức hoạt động, mục tiêu).
                </Typography>
              </Box>
            </Box>
          </Paper>

          {/* Loading */}
          {loading && (
            <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 2 }}>
              <CircularProgress size={20} />
              <Typography variant="body2" color="text.secondary">
                Đang tải dữ liệu...
              </Typography>
            </Box>
          )}

          {/* Error */}
          {!!errMsg && (
            <Alert severity="warning" sx={{ mb: 2 }}>
              {errMsg}
            </Alert>
          )}

          {/* Empty */}
          {!loading && !errMsg && mappedItems.length === 0 && (
            <Alert severity="info" sx={{ mb: 2 }}>
              Chưa có assessment nào. Nhấn “Tạo mới” để bắt đầu.
            </Alert>
          )}

          {/* LIST */}
          <Stack spacing={2}>
            {mappedItems.map((x) => (
              <Card key={x.id} variant="outlined" sx={{ borderRadius: 2 }}>
                <CardContent sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                  <Box sx={{ flex: 1 }}>
                    <Typography fontWeight={800}>Assessment • {x.createdAtLabel}</Typography>

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
                      ID: {x.id}
                    </Typography>
                  </Box>

                  <IconButton
                    color="success"
                    onClick={() => navigate(`/assessments/${x.id}`)}
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

        {/* RIGHT IMAGE (không làm tràn layout nữa) */}
        <Box
          sx={{
            flex: 1,
            display: { xs: "none", md: "block" },
            borderRadius: 3,
            overflow: "hidden",
            minHeight: 520,
            position: "relative",
            backgroundImage:
              "url(https://images.unsplash.com/photo-1554288246-9b10b5e0fcae?w=1600&q=80)",
            backgroundSize: "cover",
            backgroundPosition: "center",
            border: "1px solid",
            borderColor: "divider",
          }}
        >
          <Box sx={{ position: "absolute", inset: 0, bgcolor: "rgba(255,255,255,0.72)" }} />
          <Box sx={{ position: "absolute", left: 24, right: 24, bottom: 24 }}>
            <Typography sx={{ fontSize: 28, fontWeight: 900, lineHeight: 1.1 }}>
              Your plan. Your progress.
            </Typography>
            <Typography sx={{ mt: 1, color: "text.secondary" }}>
              Xem lịch sử đánh giá rõ ràng, không bị vướng layout.
            </Typography>
          </Box>
        </Box>
      </Box>
    </Box>
  );
}
