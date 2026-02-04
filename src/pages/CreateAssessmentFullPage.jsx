import { useMemo, useState } from "react";
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

export default function CreateAssessmentFullPage() {
  const navigate = useNavigate();

  const [showNotes, setShowNotes] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  // ✅ chỉ còn các field cần gửi lên BE
  const [form, setForm] = useState({
    weightKg: "",
    goal: "FAT_LOSS",
    activityLevel: "MODERATE",
    targetKgPerWeek: "",
    mealsPerDay: "",
    budgetPerDayVnd: "",
    notes: "",
  });

  const onChange = (key) => (e) => {
    setForm((prev) => ({ ...prev, [key]: e.target.value }));
  };

  // ✅ BMI tạm tính theo weight-only (không có height => hiển thị —)
  const bmi = useMemo(() => {
    return ""; // không có chiều cao thì không tính BMI ở FE
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitted(true);
    setLoading(true);

    try {
      const payload = buildPayload();
      await axiosClient.post("/assessments/full", payload);
      navigate("/assessments");
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
      mealsPerDay: "",
      budgetPerDayVnd: "",
      notes: "",
    });
    setSubmitted(false);
    setLoading(false);
  };

  return (
    <Box sx={{ position: "fixed", inset: 0, display: "flex", overflow: "hidden", bgcolor: "#fff" }}>
      {/* LEFT */}
      <Box sx={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", px: 2 }}>
        <Paper elevation={3} sx={{ p: 4, width: "100%", maxWidth: 560 }}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1 }}>
            <FitnessCenter color="success" fontSize="large" />
            <Box>
              <Typography variant="h4" fontWeight={800}>
                FiHealth
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Tạo đánh giá dinh dưỡng (Full Assessment)
              </Typography>
            </Box>
          </Box>

          <Typography color="text.secondary" mb={2}>
            Giới tính / tuổi / chiều cao / dị ứng sẽ lấy tự động từ UserProfile.
          </Typography>

          <Paper
            variant="outlined"
            sx={{ p: 2, mb: 3, bgcolor: "#f1fdf9", borderColor: "#cceee5" }}
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

          {submitted && (
            <Alert severity="info" sx={{ mb: 2 }}>
              {loading ? "Đang gửi request..." : "Đã submit. Mở console để xem response."}
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
                label="Meals/day (optional)"
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
              label="Budget/day (VND) (optional)"
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
              label="Notes (optional)"
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
                disabled={loading}
              >
                {loading ? "Đang gửi..." : "Tạo Assessment"}
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
          position: "relative",
          backgroundImage:
            "url(https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=1600&q=80)",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <Box sx={{ position: "absolute", inset: 0, bgcolor: "rgba(255,255,255,0.75)" }} />
      </Box>
    </Box>
  );
}
