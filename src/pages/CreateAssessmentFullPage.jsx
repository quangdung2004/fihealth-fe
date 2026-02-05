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
  Card,
  CardContent,
  MenuItem,
  CircularProgress,
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
  CalendarMonth,
  Send,
  PhotoCamera,
} from "@mui/icons-material";

export default function CreateAssessmentFullPage() {
  const navigate = useNavigate();

  const [showNotes, setShowNotes] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  // Step 1 loading
  const [loading, setLoading] = useState(false);
  const [createError, setCreateError] = useState("");

  // Step 2 states
  const [createdAssessmentId, setCreatedAssessmentId] = useState(null);
  const [period, setPeriod] = useState("WEEK");
  const [loadingMealPlan, setLoadingMealPlan] = useState(false);
  const [mealPlanError, setMealPlanError] = useState("");
  const [mealPlanResult, setMealPlanResult] = useState(null);

  // Form data (tối giản)
  const [form, setForm] = useState({
    weightKg: "",
    goal: "FAT_LOSS",
    activityLevel: "MODERATE",
    targetKgPerWeek: "",
    mealsPerDay: "3",
    budgetPerDayVnd: "",
    notes: "",
  });

  const onChange = (key) => (e) => {
    setForm((prev) => ({ ...prev, [key]: e.target.value }));
  };

  // BMI: bạn nói backend tính từ UserProfile, nên FE hiển thị placeholder
  const bmi = useMemo(() => "", []);

  const buildPayload = () => {
    const payload = {
      weightKg: form.weightKg === "" ? null : Number(form.weightKg),
      activityLevel: form.activityLevel,
      goal: form.goal,
      targetKgPerWeek:
        form.targetKgPerWeek === "" ? null : Number(form.targetKgPerWeek),
      mealsPerDay: form.mealsPerDay === "" ? null : Number(form.mealsPerDay),
      budgetPerDayVnd:
        form.budgetPerDayVnd === "" ? null : Number(form.budgetPerDayVnd),
      notes: form.notes?.trim() || null,
    };

    // remove nulls
    Object.keys(payload).forEach((k) => payload[k] === null && delete payload[k]);
    return payload;
  };

  const formatVnd = (amount) => {
    if (amount == null) return "0 ₫";
    return new Intl.NumberFormat("vi-VN").format(amount) + " ₫";
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitted(true);
    setCreateError("");

    setLoading(true);
    try {
      const payload = buildPayload();

      // POST /api/assessments/full
      const res = await axiosClient.post("/assessments/full", payload);

      // ApiResponse<NutritionAssessmentResponse>
      const newId = res?.data?.data?.id;
      if (!newId) throw new Error("Không lấy được assessmentId từ response");

      setCreatedAssessmentId(newId);

      // reset step 2 states
      setMealPlanResult(null);
      setMealPlanError("");
      setPeriod("WEEK");
    } catch (err) {
      console.error("❌ Create assessment failed:", err);
      setCreateError(
        err?.response?.data?.message || err.message || "Create assessment failed"
      );
    } finally {
      setLoading(false);
    }
  };

  const handleGenerateMealPlan = async () => {
    if (!createdAssessmentId) {
      setMealPlanError("Assessment ID không tồn tại");
      return;
    }

    setMealPlanError("");
    setMealPlanResult(null);
    setLoadingMealPlan(true);

    try {
      const res = await axiosClient.post("/meal-plans/generate", null, {
        params: {
          assessmentId: createdAssessmentId,
          period,
        },
        timeout: 60000, // 60s để tránh timeout 10s
      });

      if (res?.data?.success === false) {
        throw new Error(res?.data?.message || "Generate meal plan failed");
      }

      setMealPlanResult(res?.data?.data);
    } catch (err) {
      console.error("❌ Generate meal plan error:", err);

      const isTimeout =
        err?.code === "ECONNABORTED" || String(err?.message || "").includes("timeout");

      if (isTimeout) {
        setMealPlanError(
          "⏰ Hệ thống đang xử lý lâu, vui lòng đợi thêm hoặc thử period DAY."
        );
      } else {
        setMealPlanError(
          err?.response?.data?.message || err.message || "Tạo meal plan thất bại"
        );
      }
    } finally {
      setLoadingMealPlan(false);
    }
  };

  const reset = () => {
    setForm({
      weightKg: "",
      goal: "FAT_LOSS",
      activityLevel: "MODERATE",
      targetKgPerWeek: "",
      mealsPerDay: "3",
      budgetPerDayVnd: "",
      notes: "",
    });
    setSubmitted(false);

    setLoading(false);
    setCreateError("");

    setCreatedAssessmentId(null);
    setPeriod("WEEK");
    setLoadingMealPlan(false);
    setMealPlanResult(null);
    setMealPlanError("");
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
        {/* Header */}
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

        {/* AI Highlight */}
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

        {submitted && (
          <Alert severity="info" sx={{ mb: 2 }}>
            {loading ? "Đang gửi request..." : "Đã submit."}
          </Alert>
        )}

        {createError && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {createError}
          </Alert>
        )}

        {/* ===== STEP 1: Create Assessment ===== */}
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
            disabled={!!createdAssessmentId} // đã tạo rồi thì khóa form
          />

          <Box
            sx={{
              mt: 2,
              display: "flex",
              gap: 1,
              alignItems: "center",
              flexWrap: "wrap",
            }}
          >
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
              value={form.goal}
              onChange={onChange("goal")}
              disabled={!!createdAssessmentId}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <TrackChanges />
                  </InputAdornment>
                ),
              }}
            >
              <MenuItem value="FAT_LOSS">Giảm mỡ (FAT_LOSS)</MenuItem>
              <MenuItem value="MAINTENANCE">Duy trì (MAINTENANCE)</MenuItem>
              <MenuItem value="MUSCLE_GAIN">Tăng cơ (MUSCLE_GAIN)</MenuItem>
            </TextField>

            <TextField
              label="Mức vận động (ActivityLevel)"
              select
              fullWidth
              value={form.activityLevel}
              onChange={onChange("activityLevel")}
              disabled={!!createdAssessmentId}
            >
              <MenuItem value="SEDENTARY">Ít vận động (SEDENTARY)</MenuItem>
              <MenuItem value="LIGHT">Nhẹ (LIGHT)</MenuItem>
              <MenuItem value="MODERATE">Vừa (MODERATE)</MenuItem>
              <MenuItem value="ACTIVE">Nhiều (ACTIVE)</MenuItem>
              <MenuItem value="VERY_ACTIVE">Rất nhiều (VERY_ACTIVE)</MenuItem>
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
              disabled={!!createdAssessmentId}
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
              disabled={!!createdAssessmentId}
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
            disabled={!!createdAssessmentId}
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
            disabled={!!createdAssessmentId}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Notes />
                </InputAdornment>
              ),
              endAdornment: (
                <IconButton
                  onClick={() => setShowNotes(!showNotes)}
                  edge="end"
                  disabled={!!createdAssessmentId}
                >
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
              disabled={loading || !!createdAssessmentId}
            >
              {loading ? "Đang gửi..." : "Tạo Assessment"}
            </Button>

            <Button
              variant="outlined"
              color="success"
              onClick={reset}
              startIcon={<RestartAlt />}
              sx={{ minWidth: 140 }}
              disabled={loading || loadingMealPlan}
            >
              Reset
            </Button>
          </Stack>
        </Box>

        {/* ===== STEP 2 ===== */}
        {createdAssessmentId && (
          <Card variant="outlined" sx={{ mt: 3 }}>
            <CardContent>
              <Typography variant="h6" fontWeight={800} gutterBottom>
                Tạo Meal Plan từ Assessment vừa tạo
              </Typography>

              <Alert severity="success" sx={{ mb: 2 }}>
                Assessment ID: <b>{createdAssessmentId}</b>
              </Alert>

              {mealPlanError && (
                <Alert severity="error" sx={{ mb: 2 }}>
                  {mealPlanError}
                </Alert>
              )}

              <TextField
                label="Period"
                select
                fullWidth
                value={period}
                onChange={(e) => setPeriod(e.target.value)}
                sx={{ mb: 2 }}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <CalendarMonth />
                    </InputAdornment>
                  ),
                }}
              >
                <MenuItem value="DAY">DAY</MenuItem>
                <MenuItem value="WEEK">WEEK</MenuItem>
                <MenuItem value="MONTH">MONTH</MenuItem>
              </TextField>

              <Stack direction={{ xs: "column", sm: "row" }} spacing={1.5}>
                <Button
                  variant="contained"
                  color="success"
                  onClick={handleGenerateMealPlan}
                  disabled={loadingMealPlan}
                  startIcon={
                    loadingMealPlan ? <CircularProgress size={18} /> : <Send />
                  }
                >
                  {loadingMealPlan ? "Đang tạo..." : "TẠO MEAL PLAN"}
                </Button>

                <Button
                  variant="outlined"
                  color="success"
                  startIcon={<PhotoCamera />}
                  onClick={() =>
                    navigate(`/assessments/${createdAssessmentId}/body-analysis`)
                  }
                >
                  Phân tích Body Image
                </Button>
              </Stack>

              {mealPlanResult && (
                <Paper variant="outlined" sx={{ p: 2, mt: 2 }}>
                  <Typography fontWeight={800} mb={1}>
                    Kết quả generate
                  </Typography>
                  <Typography>
                    MealPlan ID: <b>{mealPlanResult.mealPlanId}</b>
                  </Typography>
                  <Typography>Total days: {mealPlanResult.totalDays}</Typography>
                  <Typography>
                    Estimated cost:{" "}
                    {formatVnd(mealPlanResult.estimatedTotalCostVnd)}
                  </Typography>

                  <Button
                    sx={{ mt: 1, textTransform: "none" }}
                    onClick={() =>
                      navigate(`/meal-plans/${mealPlanResult.mealPlanId}`)
                    }
                  >
                    Xem chi tiết →
                  </Button>
                </Paper>
              )}
            </CardContent>
          </Card>
        )}

        <Divider sx={{ my: 3 }} />

        <Button
          variant="text"
          onClick={() => navigate("/user/current-plan")}
          sx={{ textTransform: "none" }}
        >
          ← Về Dashboard
        </Button>
      </Paper>
    </Box>
  );
}
