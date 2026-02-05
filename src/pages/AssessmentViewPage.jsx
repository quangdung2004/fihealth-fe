import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  Box,
  Paper,
  Typography,
  Button,
  Divider,
  Alert,
  CircularProgress,
  Chip,
  Stack,
} from "@mui/material";
import { ArrowBack } from "@mui/icons-material";
import axiosClient from "../api/axiosClient";

// ===== utils =====
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
function unwrap(res) {
  return res?.data?.data ?? res?.data ?? null;
}
function formatVnd(v) {
  if (v === null || v === undefined || v === "") return "—";
  const n = Number(v);
  if (Number.isNaN(n)) return String(v);
  return n.toLocaleString("vi-VN") + " VND";
}
function pretty(v) {
  if (v === null || v === undefined || v === "") return "—";
  return String(v);
}
function FieldRow({ label, value }) {
  return (
    <Box sx={{ display: "flex", justifyContent: "space-between", py: 1, gap: 2 }}>
      <Typography color="text.secondary">{label}</Typography>
      <Typography fontWeight={700} sx={{ textAlign: "right" }}>
        {value ?? "—"}
      </Typography>
    </Box>
  );
}

export default function AssessmentViewPage() {
  const { id } = useParams(); // assessmentId
  const navigate = useNavigate();

  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [errMsg, setErrMsg] = useState("");

  // ✅ thêm state cho mealPlanId để đi route /meal-plans/:id
  const [mealPlanId, setMealPlanId] = useState(null);
  const [mealPlanLoading, setMealPlanLoading] = useState(false);
  const [mealPlanErr, setMealPlanErr] = useState("");

  useEffect(() => {
    let alive = true;

    async function loadAssessment() {
      setLoading(true);
      setErrMsg("");
      setData(null);

      if (!id || id === ":id") {
        setErrMsg("ID assessment không hợp lệ. Hãy vào từ danh sách assessments.");
        setLoading(false);
        return;
      }

      try {
        const res = await axiosClient.get(`/assessments/${encodeURIComponent(id)}`);
        if (!alive) return;

        const payload = unwrap(res);
        if (!payload) {
          setErrMsg("Không tìm thấy dữ liệu assessment.");
          return;
        }
        setData(payload);
      } catch (e) {
        if (!alive) return;
        const status = e?.response?.status;
        const msg =
          e?.response?.data?.message ||
          e?.response?.data?.error ||
          e?.message ||
          "Không tải được assessment.";

        if (status === 401) setErrMsg("Bạn chưa đăng nhập hoặc token hết hạn.");
        else if (status === 404) setErrMsg("Assessment không tồn tại.");
        else setErrMsg(msg);
      } finally {
        if (alive) setLoading(false);
      }
    }

    loadAssessment();
    return () => {
      alive = false;
    };
  }, [id]);

  // ✅ tự lấy mealPlanId theo assessmentId
  useEffect(() => {
    let alive = true;

    async function loadMealPlanId() {
      setMealPlanId(null);
      setMealPlanErr("");
      if (!id || id === ":id") return;

      setMealPlanLoading(true);
      try {
        // 🔁 Nếu backend bạn đặt endpoint khác, đổi đúng dòng này:
        const res = await axiosClient.get(`/meal-plans/by-assessment/${encodeURIComponent(id)}`);

        const payload = unwrap(res);
        if (!alive) return;

        // payload có thể là { id: "..."} hoặc { data: { id: "..." } } tùy backend
        const mpId = payload?.id ?? payload?.mealPlanId ?? null;
        if (!mpId) {
          setMealPlanErr("Chưa có meal plan cho assessment này.");
        } else {
          setMealPlanId(mpId);
        }
      } catch (e) {
        if (!alive) return;
        // nếu API không tồn tại / 404 => chưa có mealplan
        if (e?.response?.status === 404) setMealPlanErr("Chưa có meal plan cho assessment này.");
        else setMealPlanErr("Không lấy được meal plan.");
      } finally {
        if (alive) setMealPlanLoading(false);
      }
    }

    loadMealPlanId();
    return () => {
      alive = false;
    };
  }, [id]);

  const view = data
    ? {
        id: data?.id ?? id,
        createdAt: safeDateLabel(data?.createdAt ?? data?.created_at),
        updatedAt: safeDateLabel(data?.updatedAt ?? data?.updated_at),

        sex: enumLabel(data?.sex),
        age: data?.age ?? "—",
        heightCm: data?.heightCm ?? data?.height_cm ?? "—",
        weightKg: data?.weightKg ?? data?.weight_kg ?? "—",
        activityLevel: enumLabel(data?.activityLevel ?? data?.activity_level),
        goal: enumLabel(data?.goal),

        mealsPerDay: data?.mealsPerDay ?? data?.meals_per_day ?? "—",
        budgetPerDayVnd: data?.budgetPerDayVnd ?? data?.budget_per_day_vnd,
        targetKgPerWeek: data?.targetKgPerWeek ?? data?.target_kg_per_week,
        allergies: data?.allergies,
        notes: data?.notes,
      }
    : null;

  return (
    <Box
      sx={{
        px: { xs: 2, md: 3 },
        py: { xs: 2, md: 3 },
        display: "flex",
        justifyContent: "center",
      }}
    >
      <Paper
        sx={{
          width: "100%",
          maxWidth: 900,
          p: { xs: 2, md: 3 },
          borderRadius: 3,
          border: "1px solid",
          borderColor: "divider",
        }}
      >
        <Button
          startIcon={<ArrowBack />}
          onClick={() => navigate(-1)}
          sx={{ mb: 2, textTransform: "none" }}
        >
          Quay lại
        </Button>

        <Typography variant="h5" fontWeight={900} mb={1}>
          Chi tiết Assessment
        </Typography>
        <Typography color="text.secondary" mb={2}>
          Thông tin đánh giá dinh dưỡng
        </Typography>

        <Divider sx={{ mb: 2 }} />

        {loading && (
          <Box sx={{ display: "flex", gap: 1, alignItems: "center" }}>
            <CircularProgress size={20} />
            <Typography>Đang tải dữ liệu…</Typography>
          </Box>
        )}

        {!!errMsg && (
          <Alert severity="warning" sx={{ mt: 1 }}>
            {errMsg}
          </Alert>
        )}

        {!loading && !errMsg && view && (
          <>
            <Stack direction="row" spacing={1} mb={2} flexWrap="wrap">
              <Chip label={`ID: ${view.id}`} />
              <Chip label={`Tạo: ${view.createdAt}`} />
              <Chip label={`Cập nhật: ${view.updatedAt}`} />
            </Stack>

            {/* ===== Thông tin cơ bản ===== */}
            <Paper variant="outlined" sx={{ p: 2, borderRadius: 2, mb: 2 }}>
              <Typography fontWeight={800} mb={1}>
                Thông tin cơ bản
              </Typography>

              <FieldRow label="Giới tính" value={view.sex} />
              <Divider />
              <FieldRow label="Tuổi" value={pretty(view.age)} />
              <Divider />
              <FieldRow label="Chiều cao" value={view.heightCm !== "—" ? `${view.heightCm} cm` : "—"} />
              <Divider />
              <FieldRow label="Cân nặng" value={view.weightKg !== "—" ? `${view.weightKg} kg` : "—"} />
              <Divider />
              <FieldRow label="Hoạt động" value={view.activityLevel} />
              <Divider />
              <FieldRow label="Mục tiêu" value={view.goal} />
              <Divider />
              <FieldRow label="Bữa/ngày" value={pretty(view.mealsPerDay)} />
              <Divider />
              <FieldRow label="Budget/ngày" value={formatVnd(view.budgetPerDayVnd)} />
              <Divider />
              <FieldRow
                label="Target kg/tuần"
                value={view.targetKgPerWeek != null ? `${view.targetKgPerWeek} kg/tuần` : "—"}
              />
            </Paper>

            {/* ===== Dị ứng + Ghi chú ===== */}
            <Paper variant="outlined" sx={{ p: 2, borderRadius: 2 }}>
              <Typography fontWeight={800} mb={1}>
                Ghi chú & Dị ứng
              </Typography>

              <FieldRow
                label="Allergies"
                value={
                  Array.isArray(view.allergies)
                    ? view.allergies.length
                      ? view.allergies.join(", ")
                      : "—"
                    : pretty(view.allergies)
                }
              />
              <Divider />
              <FieldRow label="Notes" value={pretty(view.notes)} />
            </Paper>
            
          </>
        )}
      </Paper>
    </Box>
  );
}
  