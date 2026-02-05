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
  Cake,
  Male,
  Female,
  Person,
  Straighten,
  LocalDining,
  AttachMoney,
  WarningAmber,
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
  const [loading, setLoading] = useState(false);

  // 🔹 STEP 2: Meal Plan Generation State
  const [createdAssessmentId, setCreatedAssessmentId] = useState(null);
  const [period, setPeriod] = useState("WEEK");
  const [loadingMealPlan, setLoadingMealPlan] = useState(false);
  const [mealPlanResult, setMealPlanResult] = useState(null);
  const [mealPlanError, setMealPlanError] = useState("");

  // ✅ MATCH BE DTO + ENUM
  const [form, setForm] = useState({
    sex: "MALE", // Sex enum BE (MALE/FEMALE/OTHER) - nếu BE khác thì sửa lại
    age: "",
    heightCm: "",
    weightKg: "",
    goal: "FAT_LOSS", // ✅ Goal: FAT_LOSS, MUSCLE_GAIN, MAINTENANCE
    activityLevel: "MODERATE", // ✅ ActivityLevel: SEDENTARY, LIGHT, MODERATE, ACTIVE, VERY_ACTIVE

    targetKgPerWeek: "",
    mealsPerDay: "",
    budgetPerDayVnd: "",
    allergies: "",
    notes: "",
  });

  const bmi = useMemo(() => {
    const h = Number(form.heightCm) / 100;
    const w = Number(form.weightKg);
    if (!h || !w) return "";
    const value = w / (h * h);
    return Number.isFinite(value) ? value.toFixed(1) : "";
  }, [form.heightCm, form.weightKg]);

  const onChange = (key) => (e) => {
    setForm((prev) => ({ ...prev, [key]: e.target.value }));
  };

  const buildPayload = () => {
    // ✅ chỉ gửi đúng field BE cần, parse số cho đúng kiểu
    const payload = {
      sex: form.sex,
      age: form.age === "" ? null : Number(form.age),
      heightCm: form.heightCm === "" ? null : Number(form.heightCm),
      weightKg: form.weightKg === "" ? null : Number(form.weightKg),
      activityLevel: form.activityLevel,
      goal: form.goal,

      targetKgPerWeek: form.targetKgPerWeek === "" ? null : Number(form.targetKgPerWeek),
      mealsPerDay: form.mealsPerDay === "" ? null : Number(form.mealsPerDay),
      budgetPerDayVnd: form.budgetPerDayVnd === "" ? null : Number(form.budgetPerDayVnd),

      allergies: form.allergies?.trim() || null,
      notes: form.notes?.trim() || null,
    };

    // Optional: remove nulls để payload gọn hơn (BE vẫn nhận được nếu null)
    Object.keys(payload).forEach((k) => payload[k] === null && delete payload[k]);

    return payload;
  };

  // 🔹 STEP 1: Create Assessment
  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitted(true);
    setLoading(true);

    try {
      const payload = buildPayload();

      // ✅ gọi BE: POST /api/assessments/full
      const res = await axiosClient.post("/assessments/full", payload);

      console.log("✅ Created assessment:", res.data);

      // 🔹 Parse ApiResponse and get assessment ID
      const assessmentId = res.data?.data?.id;

      if (!assessmentId) {
        throw new Error("Assessment ID không có trong response");
      }

      // 🔹 Save assessment ID for step 2
      setCreatedAssessmentId(assessmentId);

    } catch (err) {
      console.error("❌ Create assessment failed:", err);
      alert(err?.response?.data?.message || "Create assessment failed");
    } finally {
      setLoading(false);
    }
  };

  // 🔹 STEP 2: Generate Meal Plan
  const handleGenerateMealPlan = async () => {
    if (!createdAssessmentId) {
      setMealPlanError("Assessment ID không tồn tại");
      return;
    }

    setMealPlanError("");
    setMealPlanResult(null);
    setLoadingMealPlan(true);

    try {
      // ⏰ Call generate API with 60s timeout
      const res = await axiosClient.post("/meal-plans/generate", null, {
        params: {
          assessmentId: createdAssessmentId,
          period
        },
        timeout: 60000, // 60 seconds to avoid default 10s timeout
      });

      // Parse ApiResponse wrapper
      if (res.data && res.data.success === false) {
        throw new Error(res.data.message || "Generate meal plan failed");
      }

      // Save result
      setMealPlanResult(res.data.data);

    } catch (err) {
      console.error("❌ Generate meal plan error:", err);

      // Handle timeout error specifically
      if (err.code === 'ECONNABORTED' || err.message?.includes('timeout')) {
        setMealPlanError(
          "⏰ Hệ thống đang xử lý lâu, vui lòng đợi thêm hoặc thử period DAY."
        );
      } else {
        setMealPlanError(err?.response?.data?.message || err.message || "Tạo meal plan thất bại");
      }
    } finally {
      setLoadingMealPlan(false);
    }
  };

  const reset = () => {
    setForm({
      sex: "MALE",
      age: "",
      heightCm: "",
      weightKg: "",
      goal: "FAT_LOSS",
      activityLevel: "MODERATE",
      targetKgPerWeek: "",
      mealsPerDay: "",
      budgetPerDayVnd: "",
      allergies: "",
      notes: "",
    });
    setSubmitted(false);
    setLoading(false);
    setCreatedAssessmentId(null);
    setMealPlanResult(null);
    setMealPlanError("");
  };

  // Helper function to format VND
  const formatVnd = (amount) => {
    if (amount == null) return "0 ₫";
    return new Intl.NumberFormat("vi-VN").format(amount) + " ₫";
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
          alignItems: "flex-start",
          justifyContent: "center",
          px: 2,
          py: 2,
          overflowY: "auto",
        }}
      >
        <Paper elevation={3} sx={{ p: 4, width: "100%", maxWidth: 560, my: 2 }}>
          {/* Header */}
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
            Nhập dữ liệu theo DTO backend và gửi lên API.
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
                <Typography fontWeight={700}>Được hỗ trợ bởi AI</Typography>
                <Typography variant="body2" color="text.secondary">
                  Theo dõi BMI và gợi ý mục tiêu theo vận động
                </Typography>
              </Box>
            </Box>
          </Paper>

          {submitted && !createdAssessmentId && (
            <Alert severity="info" sx={{ mb: 2 }}>
              {loading ? "Đang gửi request..." : "Đã submit. Mở console để xem response."}
            </Alert>
          )}

          {/* Form - Disabled after assessment created */}
          <Box component="form" onSubmit={handleSubmit} sx={{ opacity: createdAssessmentId ? 0.6 : 1 }}>
            <Stack direction={{ xs: "column", sm: "row" }} spacing={2} mt={1}>
              <TextField
                label="Giới tính"
                select
                fullWidth
                SelectProps={{ native: true }}
                value={form.sex}
                onChange={onChange("sex")}
                disabled={!!createdAssessmentId}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      {form.sex === "MALE" ? <Male /> : form.sex === "FEMALE" ? <Female /> : <Person />}
                    </InputAdornment>
                  ),
                }}
              >
                <option value="MALE">Nam</option>
                <option value="FEMALE">Nữ</option>
                <option value="OTHER">Khác</option>
              </TextField>

              <TextField
                label="Tuổi"
                fullWidth
                value={form.age}
                onChange={onChange("age")}
                type="number"
                inputProps={{ min: 1, max: 120 }}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Cake />
                    </InputAdornment>
                  ),
                }}
                required
              />
            </Stack>

            <Stack direction={{ xs: "column", sm: "row" }} spacing={2} mt={2}>
              <TextField
                label="Chiều cao (cm)"
                fullWidth
                value={form.heightCm}
                onChange={onChange("heightCm")}
                type="number"
                inputProps={{ min: 1 }}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Straighten />
                    </InputAdornment>
                  ),
                }}
                required
              />
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
              />
            </Stack>

            <Box sx={{ mt: 2, display: "flex", gap: 1, alignItems: "center" }}>
              <Chip
                label={bmi ? `BMI: ${bmi}` : "BMI: —"}
                color={bmi ? "success" : "default"}
                variant={bmi ? "filled" : "outlined"}
                sx={{ fontWeight: 700 }}
              />
              <Typography variant="body2" color="text.secondary">
                (Tự tính từ chiều cao/cân nặng)
              </Typography>
            </Box>

            <Stack direction={{ xs: "column", sm: "row" }} spacing={2} mt={2}>
              {/* ✅ Goal đúng enum */}
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

              {/* ✅ ActivityLevel đúng enum */}
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
              label="Allergies (optional)"
              fullWidth
              margin="normal"
              value={form.allergies}
              onChange={onChange("allergies")}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <WarningAmber />
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
                disabled={loading || !!createdAssessmentId}
              >
                {loading ? "Đang gửi..." : createdAssessmentId ? "✅ Đã tạo" : "Tạo Assessment"}
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

          {/* 🔹 STEP 2: Generate Meal Plan (Only show after assessment created) */}
          {createdAssessmentId && (
            <>
              <Divider sx={{ my: 3 }}>
                <Chip label="BƯỚC 2: TẠO MEAL PLAN" color="primary" />
              </Divider>

              <Alert severity="success" sx={{ mb: 2 }}>
                ✅ Assessment đã tạo thành công!
                <Typography variant="body2" sx={{ mt: 0.5, fontFamily: "monospace", fontSize: "0.85rem" }}>
                  ID: {createdAssessmentId}
                </Typography>
              </Alert>

              {/* Quick Action: Navigate to Body Analysis */}
              <Button
                variant="outlined"
                color="info"
                fullWidth
                startIcon={<PhotoCamera />}
                onClick={() => navigate(`/assessments/${createdAssessmentId}/body-analysis`)}
                disabled={!createdAssessmentId || loading || loadingMealPlan}
                sx={{ mb: 2, py: 1 }}
              >
                📸 Phân tích Body Image
              </Button>

              <Paper
                variant="outlined"
                sx={{
                  p: 2,
                  mb: 2,
                  bgcolor: "#fff9f0",
                  borderColor: "#ffe0b2",
                }}
              >
                <Box sx={{ display: "flex", gap: 1 }}>
                  <AutoAwesome color="warning" />
                  <Box>
                    <Typography fontWeight={700}>Tạo Meal Plan tự động</Typography>
                    <Typography variant="body2" color="text.secondary">
                      Chọn period và nhấn Generate để tạo meal plan từ assessment vừa tạo.
                    </Typography>
                  </Box>
                </Box>
              </Paper>

              {/* Loading info for meal plan */}
              {loadingMealPlan && (
                <Alert severity="info" sx={{ mb: 2 }}>
                  ⏳ Đang tạo meal plan bằng AI, có thể mất 20-60 giây. Vui lòng đợi...
                </Alert>
              )}

              {/* Error Alert */}
              {mealPlanError && (
                <Alert severity="error" sx={{ mb: 2 }}>
                  {mealPlanError}
                </Alert>
              )}

              {/* Meal Plan Form */}
              {!mealPlanResult && (
                <Box>
                  <TextField
                    select
                    fullWidth
                    label="Period *"
                    value={period}
                    onChange={(e) => setPeriod(e.target.value)}
                    disabled={loadingMealPlan}
                    sx={{ mb: 2 }}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <CalendarMonth />
                        </InputAdornment>
                      ),
                    }}
                  >
                    <MenuItem value="DAY">1 ngày (DAY)</MenuItem>
                    <MenuItem value="WEEK">7 ngày (WEEK)</MenuItem>
                    <MenuItem value="MONTH">30 ngày (MONTH)</MenuItem>
                  </TextField>

                  <Button
                    variant="contained"
                    color="primary"
                    fullWidth
                    startIcon={loadingMealPlan ? <CircularProgress size={20} /> : <Send />}
                    onClick={handleGenerateMealPlan}
                    disabled={loadingMealPlan}
                    sx={{ py: 1.2 }}
                  >
                    {loadingMealPlan ? "⏳ Đang tạo... (20-60s)" : "TẠO MEAL PLAN"}
                  </Button>
                </Box>
              )}

              {/* Meal Plan Result */}
              {mealPlanResult && (
                <>
                  <Alert severity="success" sx={{ mb: 2 }}>
                    🎉 Tạo meal plan thành công!
                  </Alert>

                  <Card variant="outlined" sx={{ bgcolor: "#f9fafb" }}>
                    <CardContent>
                      <Typography variant="h6" fontWeight={700} mb={2}>
                        Meal Plan Summary
                      </Typography>

                      <Stack spacing={1.5}>
                        <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                          <Typography color="text.secondary">Meal Plan ID:</Typography>
                          <Typography
                            fontWeight={600}
                            sx={{
                              fontFamily: "monospace",
                              fontSize: "0.85rem",
                              wordBreak: "break-all",
                            }}
                          >
                            {mealPlanResult.mealPlanId}
                          </Typography>
                        </Box>

                        <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                          <Typography color="text.secondary">
                            <CalendarMonth fontSize="small" sx={{ verticalAlign: "middle", mr: 0.5 }} />
                            Tổng số ngày:
                          </Typography>
                          <Typography fontWeight={700} color="success.main">
                            {mealPlanResult.totalDays} ngày
                          </Typography>
                        </Box>

                        <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                          <Typography color="text.secondary">
                            <AttachMoney fontSize="small" sx={{ verticalAlign: "middle", mr: 0.5 }} />
                            Chi phí ước tính:
                          </Typography>
                          <Typography fontWeight={700} color="primary.main">
                            {formatVnd(mealPlanResult.estimatedTotalCostVnd)}
                          </Typography>
                        </Box>
                      </Stack>

                      <Button
                        variant="contained"
                        color="primary"
                        fullWidth
                        startIcon={<Visibility />}
                        onClick={() => navigate(`/meal-plans/${mealPlanResult.mealPlanId}`)}
                        sx={{ mt: 3 }}
                      >
                        Xem chi tiết Meal Plan
                      </Button>
                    </CardContent>
                  </Card>
                </>
              )}
            </>
          )}

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
