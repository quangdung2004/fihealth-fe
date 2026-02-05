import { useEffect, useMemo, useState } from "react";
import axiosClient from "../api/axiosClient";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Paper,
  Typography,
  TextField,
  Button,
  Divider,
  Chip,
  Stack,
  IconButton,
  InputAdornment,
  Alert,
} from "@mui/material";
import {
  Visibility,
  VisibilityOff,
  FitnessCenter,
  AutoAwesome,
  Save,
  RestartAlt,
  MonitorWeight,
  LocalDining,
  AttachMoney,
  Notes,
  TrackChanges,
} from "@mui/icons-material";

const WEEK_LIMIT_FREE = 3;
const WEEK_MS = 7 * 24 * 60 * 60 * 1000;

export default function CreateAssessmentFullPage() {
  const navigate = useNavigate();

  const [showNotes, setShowNotes] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  // ===== Membership & quota =====
  const [membership, setMembership] = useState("FREE"); // fallback FREE nếu BE không trả
  const [weeklyCount, setWeeklyCount] = useState(0);
  const [quotaLoading, setQuotaLoading] = useState(true);
  const [quotaErr, setQuotaErr] = useState("");

  // ✅ chỉ còn các field cần gửi lên BE
  const [form, setForm] = useState({
    weightKg: "",
    goal: "FAT_LOSS",
    activityLevel: "MODERATE",
    targetKgPerWeek: "",
    mealsPerDay: "3", // ✅ mặc định là 3
    budgetPerDayVnd: "",
    notes: "",
  });

  const onChange = (key) => (e) => {
    setForm((prev) => ({ ...prev, [key]: e.target.value }));
  };

  // ✅ BMI tạm tính theo weight-only (không có height => hiển thị —)
  const bmi = useMemo(() => {
    return "";
  }, []);

  const buildPayload = () => {
    const payload = {
      weightKg: form.weightKg === "" ? null : Number(form.weightKg),
      activityLevel: form.activityLevel,
      goal: form.goal,
      targetKgPerWeek: form.targetKgPerWeek === "" ? null : Number(form.targetKgPerWeek),
      mealsPerDay: form.mealsPerDay === "" ? null : Number(form.mealsPerDay),
      budgetPerDayVnd: form.budgetPerDayVnd === "" ? null : Number(form.budgetPerDayVnd),
      notes: form.notes?.trim() || null,
    };

    Object.keys(payload).forEach((k) => payload[k] === null && delete payload[k]);
    return payload;
  };

  // ===== Load membership + count assessments in last 7 days =====
  useEffect(() => {
    let alive = true;

    async function loadQuota() {
      setQuotaLoading(true);
      setQuotaErr("");

      try {
        const [meRes, assRes] = await Promise.allSettled([
          axiosClient.get("/users/me"),
          axiosClient.get("/assessments", { params: { me: true } }),
        ]);

        // 1) membership
        if (meRes.status === "fulfilled") {
          const me = meRes.value?.data?.data ?? meRes.value?.data;
          // BE bạn hiện tại có thể chưa trả membership => fallback FREE
          const m =
            me?.membership ||
            me?.user?.membership ||
            me?.data?.membership ||
            me?.profile?.membership;
          if (m) setMembership(String(m).toUpperCase());
        }

        // 2) weeklyCount
        if (assRes.status === "fulfilled") {
          const list = assRes.value?.data?.data ?? assRes.value?.data;
          const arr = Array.isArray(list) ? list : [];
          const now = Date.now();
          const from = now - WEEK_MS;

          const count7d = arr.filter((x) => {
            const t = x?.createdAt ? new Date(x.createdAt).getTime() : NaN;
            return Number.isFinite(t) && t >= from && t <= now;
          }).length;

          setWeeklyCount(count7d);
        }

        if (!alive) return;
      } catch (e) {
        if (!alive) return;
        setQuotaErr("Không kiểm tra được quota tuần (vẫn có thể tạo nếu không bị khóa).");
      } finally {
        if (alive) setQuotaLoading(false);
      }
    }

    loadQuota();
    return () => {
      alive = false;
    };
  }, []);

  const isFree = String(membership || "").toUpperCase() === "FREE";
  const limitReached = isFree && weeklyCount >= WEEK_LIMIT_FREE;
  const remaining = isFree ? Math.max(0, WEEK_LIMIT_FREE - weeklyCount) : null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitted(true);

    // ✅ chặn FREE nếu quá quota tuần
    if (limitReached) {
      return;
    }

    setLoading(true);

    try {
      const payload = buildPayload();
      await axiosClient.post("/assessments/full", payload);
      navigate("/user/assessments"); // ✅ đúng route trong UserLayout
    } catch (err) {
      console.error("❌ Create assessment failed:", err);
      alert(err?.response?.data?.message || "Create assessment failed");
    } finally {
      setLoading(false);
    }
  };

  const reset = () => {
    setForm({
      weightKg: "",
      goal: "FAT_LOSS",
      activityLevel: "MODERATE",
      targetKgPerWeek: "",
      mealsPerDay: "3", // ✅ reset về 3
      budgetPerDayVnd: "",
      notes: "",
    });
    setSubmitted(false);
    setLoading(false);
  };

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
      <Paper elevation={3} sx={{ p: 4, width: "100%", maxWidth: 760 }}>
        <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1 }}>
          <FitnessCenter color="success" fontSize="large" />
          <Box sx={{ flex: 1 }}>
            <Typography variant="h4" fontWeight={800}>
              FiHealth
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Tạo đánh giá dinh dưỡng (Full Assessment)
            </Typography>
          </Box>

          <Button
            variant="outlined"
            color="success"
            onClick={() => navigate("/user/assessments")}
            sx={{ textTransform: "none" }}
          >
            ← Danh sách
          </Button>
        </Box>

        <Typography color="text.secondary" mb={2}>
          Giới tính / tuổi / chiều cao / dị ứng sẽ lấy tự động từ UserProfile.
        </Typography>

        <Paper
          variant="outlined"
          sx={{ p: 2, mb: 2, bgcolor: "#f1fdf9", borderColor: "#cceee5" }}
        >
          <Box sx={{ display: "flex", gap: 1 }}>
            <AutoAwesome color="success" />
            <Box>
              <Typography fontWeight={700}>Được hỗ trợ bởi AI</Typography>
              <Typography variant="body2" color="text.secondary">
                Tính toán dựa trên profile + dữ liệu bạn nhập
              </Typography>
            </Box>
          </Box>
        </Paper>

        {/* ===== Quota banner ===== */}
        {quotaLoading ? (
          <Alert severity="info" sx={{ mb: 2 }}>
            Đang kiểm tra quota tuần...
          </Alert>
        ) : quotaErr ? (
          <Alert severity="warning" sx={{ mb: 2 }}>
            {quotaErr}
          </Alert>
        ) : isFree ? (
          limitReached ? (
            <Alert severity="error" sx={{ mb: 2 }}>
              Bạn đang ở gói <b>FREE</b>: đã tạo <b>{weeklyCount}</b>/<b>{WEEK_LIMIT_FREE}</b>{" "}
              assessment trong 7 ngày gần nhất. Vui lòng chờ sang tuần hoặc nâng cấp gói.
            </Alert>
          ) : (
            <Alert severity="success" sx={{ mb: 2 }}>
              Gói <b>FREE</b>: bạn còn <b>{remaining}</b> lượt tạo assessment trong 7 ngày gần nhất.
            </Alert>
          )
        ) : (
          <Alert severity="success" sx={{ mb: 2 }}>
            Membership: <b>{membership}</b> — không giới hạn theo tuần.
          </Alert>
        )}

        {submitted && (
          <Alert severity="info" sx={{ mb: 2 }}>
            {loading ? "Đang gửi request..." : "Đã submit."}
          </Alert>
        )}

        <Box component="form" onSubmit={handleSubmit}>
          <TextField
            label="Cân nặng (kg)"
            fullWidth
            value={form.weightKg}
            onChange={onChange("weightKg")}
            type="number"
            inputProps={{ min: 1, step: "0.1" }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <MonitorWeight />
                </InputAdornment>
              ),
            }}
            required
            sx={{ mt: 1 }}
          />

          <Box sx={{ mt: 2, display: "flex", gap: 1, alignItems: "center", flexWrap: "wrap" }}>
            <Chip
              label={bmi ? `BMI: ${bmi}` : "BMI: —"}
              color={bmi ? "success" : "default"}
              variant={bmi ? "filled" : "outlined"}
              sx={{ fontWeight: 700 }}
            />
            <Typography variant="body2" color="text.secondary">
              (BMI sẽ được tính ở backend từ UserProfile)
            </Typography>
          </Box>

          <Stack direction={{ xs: "column", sm: "row" }} spacing={2} mt={2}>
            <TextField
              label="Mục tiêu (Goal)"
              select
              fullWidth
              SelectProps={{ native: true }}
              value={form.goal}
              onChange={onChange("goal")}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <TrackChanges />
                  </InputAdornment>
                ),
              }}
            >
              <option value="FAT_LOSS">Giảm mỡ (FAT_LOSS)</option>
              <option value="MAINTENANCE">Duy trì (MAINTENANCE)</option>
              <option value="MUSCLE_GAIN">Tăng cơ (MUSCLE_GAIN)</option>
            </TextField>

            <TextField
              label="Mức vận động (ActivityLevel)"
              select
              fullWidth
              SelectProps={{ native: true }}
              value={form.activityLevel}
              onChange={onChange("activityLevel")}
            >
              <option value="SEDENTARY">Ít vận động (SEDENTARY)</option>
              <option value="LIGHT">Nhẹ (LIGHT)</option>
              <option value="MODERATE">Vừa (MODERATE)</option>
              <option value="ACTIVE">Nhiều (ACTIVE)</option>
              <option value="VERY_ACTIVE">Rất nhiều (VERY_ACTIVE)</option>
            </TextField>
          </Stack>

          <Stack direction={{ xs: "column", sm: "row" }} spacing={2} mt={2}>
            <TextField
              label="Target kg/tuần (optional)"
              fullWidth
              value={form.targetKgPerWeek}
              onChange={onChange("targetKgPerWeek")}
              type="number"
              inputProps={{ step: "0.1" }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <MonitorWeight />
                  </InputAdornment>
                ),
              }}
            />

            <TextField
              label="Bữa/ngày (optional)"
              fullWidth
              value={form.mealsPerDay}
              onChange={onChange("mealsPerDay")}
              type="number"
              inputProps={{ min: 1 }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <LocalDining />
                  </InputAdornment>
                ),
              }}
            />
          </Stack>

          <TextField
            label="Chi tiêu/day (VND) (optional)"
            fullWidth
            margin="normal"
            value={form.budgetPerDayVnd}
            onChange={onChange("budgetPerDayVnd")}
            type="number"
            inputProps={{ min: 0 }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <AttachMoney />
                </InputAdornment>
              ),
            }}
          />

          <TextField
            label="Ghi chú (optional)"
            fullWidth
            margin="normal"
            value={form.notes}
            onChange={onChange("notes")}
            multiline
            rows={3}
            type={showNotes ? "text" : "password"}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Notes />
                </InputAdornment>
              ),
              endAdornment: (
                <IconButton onClick={() => setShowNotes(!showNotes)} edge="end">
                  {showNotes ? <VisibilityOff /> : <Visibility />}
                </IconButton>
              ),
            }}
          />

          <Stack direction="row" spacing={1.5} mt={2}>
            <Button
              type="submit"
              variant="contained"
              color="success"
              fullWidth
              startIcon={<Save />}
              sx={{ py: 1.2 }}
              disabled={loading || limitReached}
            >
              {limitReached ? "Đã hết lượt tuần (FREE)" : loading ? "Đang gửi..." : "Tạo Assessment"}
            </Button>

            <Button
              variant="outlined"
              color="success"
              onClick={reset}
              startIcon={<RestartAlt />}
              sx={{ minWidth: 140 }}
              disabled={loading}
            >
              Reset
            </Button>
          </Stack>
        </Box>

        <Divider sx={{ my: 3 }} />

        <Button variant="text" onClick={() => navigate("/user/current-plan")} sx={{ textTransform: "none" }}>
          ← Về Dashboard
        </Button>
      </Paper>
    </Box>
  );
}
