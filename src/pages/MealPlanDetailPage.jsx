import { useEffect, useMemo, useState } from "react";
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

function unwrap(res) {
  return res?.data?.data ?? res?.data ?? res ?? null;
}

function safeDateLabel(iso) {
  if (!iso) return null;
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return String(iso);
  return d.toLocaleString("vi-VN", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function formatVnd(v) {
  if (v === null || v === undefined || v === "") return null;
  const n = Number(v);
  if (Number.isNaN(n)) return String(v);
  return n.toLocaleString("vi-VN") + " VND";
}

function enumLabel(v) {
  if (v === null || v === undefined || v === "") return null;
  return String(v).replaceAll("_", " ");
}

function FieldRow({ label, value }) {
  if (value === null || value === undefined || value === "") return null;
  return (
    <>
      <Box sx={{ display: "flex", justifyContent: "space-between", py: 1, gap: 2 }}>
        <Typography color="text.secondary">{label}</Typography>
        <Typography fontWeight={700} sx={{ textAlign: "right" }}>
          {value}
        </Typography>
      </Box>
      <Divider />
    </>
  );
}

export default function MealPlanDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [raw, setRaw] = useState(null);
  const [loading, setLoading] = useState(true);
  const [errMsg, setErrMsg] = useState("");

  useEffect(() => {
    let alive = true;

    async function load() {
      setLoading(true);
      setErrMsg("");
      setRaw(null);

      try {
        const res = await axiosClient.get(`/meal-plans/${encodeURIComponent(id)}/detail`);
        const payload = unwrap(res);
        if (!alive) return;

        if (!payload) {
          setErrMsg("Không tìm thấy meal plan.");
          return;
        }
        setRaw(payload);
      } catch (e) {
        if (!alive) return;
        setErrMsg(
          e?.response?.data?.message ||
            e?.response?.data?.error ||
            e?.message ||
            "Không tải được meal plan."
        );
      } finally {
        if (alive) setLoading(false);
      }
    }

    load();
    return () => {
      alive = false;
    };
  }, [id]);

  const view = useMemo(() => {
    if (!raw) return null;

    const period = raw.period ?? null;
    const totalDays = raw.totalDays ?? null;

    // ✅ goal backend trả về enum Goal (FAT_LOSS / MUSCLE_GAIN / MAINTENANCE)
    // Nếu backend đặt tên khác (assessmentGoal) thì vẫn support luôn
    const goalRaw = raw.goal ?? raw.assessmentGoal ?? null;

    return {
      id: raw.id ?? id,
      period,
      totalDays,
      startDate: raw.startDate ?? null,
      endDate: raw.endDate ?? null,
      favorite: !!raw.favorite,

      // ✅ money
      budgetText: formatVnd(raw.budgetPerDayVnd),
      estimatedText: formatVnd(raw.estimatedTotalCostVnd),

      // ✅ time
      createdAt: safeDateLabel(raw.createdAt),
      updatedAt: safeDateLabel(raw.updatedAt),

      // ✅ goal
      goalText: enumLabel(goalRaw),
    };
  }, [raw, id]);

  return (
    <Box sx={{ px: { xs: 2, md: 3 }, py: { xs: 2, md: 3 }, display: "flex", justifyContent: "center" }}>
      <Paper sx={{ width: "100%", maxWidth: 980, p: { xs: 2, md: 3 }, borderRadius: 3 }}>
        <Button startIcon={<ArrowBack />} onClick={() => navigate(-1)} sx={{ mb: 2, textTransform: "none" }}>
          Quay lại
        </Button>

        <Typography variant="h5" fontWeight={900} mb={0.5}>
          Chi tiết Meal Plan
        </Typography>
        <Typography color="text.secondary" mb={2}>
          Thông tin chi tiết meal plan
        </Typography>

        <Divider sx={{ mb: 2 }} />

        {loading && (
          <Box sx={{ display: "flex", gap: 1, alignItems: "center" }}>
            <CircularProgress size={20} />
            <Typography>Đang tải dữ liệu…</Typography>
          </Box>
        )}

        {!!errMsg && <Alert severity="warning">{errMsg}</Alert>}

        {!loading && view && (
          <>
            <Stack direction="row" spacing={1} flexWrap="wrap" mb={2}>
              <Chip label={`ID: ${view.id}`} />
              {view.period ? <Chip label={`Kỳ: ${view.period}`} /> : null}
              {view.totalDays != null ? <Chip label={`Số ngày: ${view.totalDays}`} /> : null}
              {view.startDate ? <Chip label={`Bắt đầu: ${view.startDate}`} /> : null}
              {view.endDate ? <Chip label={`Kết thúc: ${view.endDate}`} /> : null}
              <Chip color={view.favorite ? "success" : "default"} label={view.favorite ? "Đã lưu" : "Chưa lưu"} />
            </Stack>

            <Paper variant="outlined" sx={{ p: 2, borderRadius: 2 }}>
              <Typography fontWeight={800} mb={1}>
                Thông tin Meal Plan
              </Typography>

              {/* ✅ thêm vào bảng */}
              <FieldRow label="Kỳ (period)" value={view.period} />
              <FieldRow
                label="Tổng số ngày (totalDays)"
                value={view.totalDays != null ? String(view.totalDays) : null}
              />
              <FieldRow label="Mục tiêu (goal)" value={view.goalText} />

              <FieldRow label="Budget/ngày" value={view.budgetText} />
              <FieldRow label="Tổng chi phí ước tính" value={view.estimatedText} />
              <FieldRow label="Tạo lúc" value={view.createdAt} />
              <FieldRow label="Cập nhật lúc" value={view.updatedAt} />

              {/* nếu cuối cùng không có gì ngoài divider */}
              {!view.period &&
                view.totalDays == null &&
                !view.goalText &&
                !view.budgetText &&
                !view.estimatedText &&
                !view.createdAt &&
                !view.updatedAt && (
                  <Typography color="text.secondary">Không có thêm thuộc tính để hiển thị.</Typography>
                )}
            </Paper>
          </>
        )}
      </Paper>
    </Box>
  );
}
