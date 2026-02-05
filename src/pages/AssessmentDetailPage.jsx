import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Paper,
  Typography,
  TextField,
  Button,
  Divider,
  Stack,
  Alert,
  CircularProgress,
  MenuItem,
  Chip,
  Card,
  CardContent,
} from "@mui/material";
import { FitnessCenter, AutoAwesome, ArrowForward } from "@mui/icons-material";
import axiosClient from "../api/axiosClient";

// ===== Helpers (bám sát service của bạn) =====
function round2(v) {
  return Math.round(v * 100) / 100;
}
function round0(v) {
  return Math.round(v);
}

function calcBmr(sex, weightKg, heightCm, age) {
  if (!sex || !weightKg || !heightCm || !age) return null;
  const s = String(sex).toUpperCase();
  const base = 10 * weightKg + 6.25 * heightCm - 5 * age;
  if (s.includes("FEMALE") || s.includes("WOMAN") || s.includes("NU")) return base - 161;
  return base + 5;
}

function activityFactor(activityLevel) {
  const a = String(activityLevel || "").toUpperCase();
  if (a.includes("SEDENTARY") || a.includes("LOW")) return 1.2;
  if (a.includes("LIGHT")) return 1.375;
  if (a.includes("MODERATE") || a.includes("MEDIUM")) return 1.55;
  if (a.includes("VERY")) return 1.9;
  if (a.includes("ACTIVE")) return 1.725;
  return 1.55;
}

function calcCalorieTarget(tdee, goal, targetKgPerWeek) {
  if (!tdee || !goal) return null;
  const g = String(goal).toUpperCase();

  if (targetKgPerWeek != null && targetKgPerWeek !== 0) {
    const dailyDelta = (targetKgPerWeek * 7700.0) / 7.0;
    if (g.includes("LOSE") || g.includes("CUT") || g.includes("GIAM")) return tdee - Math.abs(dailyDelta);
    if (g.includes("GAIN") || g.includes("BULK") || g.includes("TANG")) return tdee + Math.abs(dailyDelta);
  }

  if (g.includes("LOSE") || g.includes("CUT") || g.includes("GIAM")) return tdee - 400;
  if (g.includes("GAIN") || g.includes("BULK") || g.includes("TANG")) return tdee + 300;

  return tdee; // maintain
}

function enumLabel(v) {
  return v ? String(v).replaceAll("_", " ") : "—";
}

function numOrNull(v) {
  if (v === "" || v == null) return null;
  const n = Number(v);
  return Number.isFinite(n) ? n : null;
}

// ===== Enum options =====
const SEX_OPTIONS = [
  { value: "MALE", label: "Nam (MALE)" },
  { value: "FEMALE", label: "Nữ (FEMALE)" },
];

const ACTIVITY_OPTIONS = [
  { value: "SEDENTARY", label: "Ít vận động (SEDENTARY)" },
  { value: "LIGHT", label: "Vận động nhẹ (LIGHT)" },
  { value: "MODERATE", label: "Vừa phải (MODERATE)" },
  { value: "ACTIVE", label: "Năng động (ACTIVE)" },
  { value: "VERY_ACTIVE", label: "Rất năng động (VERY_ACTIVE)" },
];

const GOAL_OPTIONS = [
  { value: "LOSE", label: "Giảm cân (LOSE)" },
  { value: "MAINTAIN", label: "Giữ cân (MAINTAIN)" },
  { value: "GAIN", label: "Tăng cân (GAIN)" },
];

export default function CreateAssessmentFullPage() {
  const navigate = useNavigate();

  // Form fields đúng CreateAssessmentRequest
  const [sex, setSex] = useState("MALE");
  const [age, setAge] = useState("");
  const [heightCm, setHeightCm] = useState("");
  const [weightKg, setWeightKg] = useState("");
  const [activityLevel, setActivityLevel] = useState("MODERATE");
  const [goal, setGoal] = useState("MAINTAIN");
  const [targetKgPerWeek, setTargetKgPerWeek] = useState(""); // optional
  const [mealsPerDay, setMealsPerDay] = useState("3"); // optional (backend default 3 nếu null)
  const [budgetPerDayVnd, setBudgetPerDayVnd] = useState(""); // optional
  const [allergies, setAllergies] = useState("");
  const [notes, setNotes] = useState("");

  const [submitting, setSubmitting] = useState(false);
  const [errMsg, setErrMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  useEffect(() => {
    // ✅ guard token (đồng bộ axiosClient)
    const token = localStorage.getItem("accessToken");
    if (!token) navigate("/");
  }, [navigate]);

  // Preview calculations (bám sát service)
  const preview = useMemo(() => {
    const a = numOrNull(age);
    const h = numOrNull(heightCm);
    const w = numOrNull(weightKg);
    if (!a || !h || !w || !sex) return null;

    const heightM = h / 100.0;
    if (heightM <= 0) return null;

    const bmi = w / (heightM * heightM);
    const bmr = calcBmr(sex, w, h, a);
    if (bmr == null) return null;

    const tdee = bmr * activityFactor(activityLevel);
    const tgt = calcCalorieTarget(tdee, goal, numOrNull(targetKgPerWeek));

    const calorieTarget = tgt ?? tdee;

    const proteinG = 1.6 * w;
    const fatG = 0.8 * w;
    const remaining = calorieTarget - (proteinG * 4 + fatG * 9);
    const carbG = Math.max(0, remaining / 4);

    return {
      bmi: round2(bmi),
      bmr: round0(bmr),
      tdee: round0(tdee),
      calorieTarget: round0(calorieTarget),
      proteinG: round0(proteinG),
      fatG: round0(fatG),
      carbG: round0(carbG),
    };
  }, [sex, age, heightCm, weightKg, activityLevel, goal, targetKgPerWeek]);

  function validate() {
    const a = numOrNull(age);
    const h = numOrNull(heightCm);
    const w = numOrNull(weightKg);

    if (!sex) return "Vui lòng chọn giới tính (sex).";
    if (!a || a <= 0) return "Tuổi (age) không hợp lệ.";
    if (!h || h <= 0) return "Chiều cao (heightCm) không hợp lệ.";
    if (!w || w <= 0) return "Cân nặng (weightKg) không hợp lệ.";
    if (!activityLevel) return "Vui lòng chọn activityLevel.";
    if (!goal) return "Vui lòng chọn goal.";
    return "";
  }

  async function postCreate(body) {
    // Fallback endpoint để tránh mismatch route giữa backend & frontend
    try {
      return await axiosClient.post("/assessments", body);
    } catch (e) {
      const status = e?.response?.status;
      if (status === 404) {
        return await axiosClient.post("/assessments/full", body);
      }
      throw e;
    }
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setErrMsg("");
    setSuccessMsg("");

    const v = validate();
    if (v) {
      setErrMsg(v);
      return;
    }

    const body = {
      sex,
      age: Number(age),
      heightCm: Number(heightCm),
      weightKg: Number(weightKg),
      activityLevel,
      goal,

      targetKgPerWeek: numOrNull(targetKgPerWeek),
      mealsPerDay: numOrNull(mealsPerDay),
      budgetPerDayVnd: numOrNull(budgetPerDayVnd),

      allergies: allergies?.trim() || null,
      notes: notes?.trim() || null,
    };

    setSubmitting(true);
    try {
      const res = await postCreate(body);

      // ApiResponse.ok(data) => res.data.data
      const saved = res?.data?.data;
      if (!saved || !saved.id) {
        setSuccessMsg("Tạo assessment thành công, nhưng response thiếu id.");
        navigate("/assessments");
        return;
      }

      setSuccessMsg("Tạo assessment thành công!");
      navigate(`/assessments/${saved.id}`);
    } catch (e2) {
      const status = e2?.response?.status;
      const serverMsg = e2?.response?.data?.message || e2?.response?.data?.error || e2?.message;

      if (status === 401) setErrMsg("Bạn chưa đăng nhập hoặc token hết hạn. Hãy đăng nhập lại.");
      else setErrMsg(serverMsg || "Không tạo được assessment. Vui lòng thử lại.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <Box sx={{ position: "fixed", inset: 0, display: "flex", bgcolor: "#fff" }}>
      {/* LEFT */}
      <Box sx={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", px: 2 }}>
        <Paper elevation={3} sx={{ p: 4, width: "100%", maxWidth: 820 }}>
          {/* Header */}
          <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1 }}>
            <FitnessCenter color="success" fontSize="large" />
            <Box sx={{ flex: 1 }}>
              <Typography variant="h4" fontWeight={800}>
                FiHealth
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Tạo đánh giá dinh dưỡng (BMI / BMR / TDEE / Macro)
              </Typography>
            </Box>

            <Button
              variant="outlined"
              color="success"
              onClick={() => navigate("/assessments")} // ✅ sửa route
              sx={{ textTransform: "none" }}
            >
              ← Danh sách
            </Button>
          </Box>

          <Typography color="text.secondary" mb={2}>
            Nhập thông tin cơ bản và mục tiêu. Hệ thống sẽ tính calories và macro phù hợp.
          </Typography>

          {/* AI Highlight */}
          <Paper variant="outlined" sx={{ p: 2, mb: 3, bgcolor: "#f1fdf9", borderColor: "#cceee5" }}>
            <Box sx={{ display: "flex", gap: 1 }}>
              <AutoAwesome color="success" />
              <Box>
                <Typography fontWeight={700}>Preview tính toán theo thời gian thực</Typography>
                <Typography variant="body2" color="text.secondary">
                  Công thức preview bám sát service của bạn để người dùng xem trước kết quả.
                </Typography>
              </Box>
            </Box>
          </Paper>

          {!!errMsg && (
            <Alert severity="warning" sx={{ mb: 2 }}>
              {errMsg}
            </Alert>
          )}
          {!!successMsg && (
            <Alert severity="success" sx={{ mb: 2 }}>
              {successMsg}
            </Alert>
          )}

          <Box component="form" onSubmit={handleSubmit}>
            <Stack direction={{ xs: "column", md: "row" }} spacing={2}>
              <Stack spacing={2} sx={{ flex: 1 }}>
                <TextField select label="Giới tính (sex)" value={sex} onChange={(e) => setSex(e.target.value)} fullWidth>
                  {SEX_OPTIONS.map((o) => (
                    <MenuItem key={o.value} value={o.value}>
                      {o.label}
                    </MenuItem>
                  ))}
                </TextField>

                <Stack direction="row" spacing={2}>
                  <TextField label="Tuổi (age)" value={age} onChange={(e) => setAge(e.target.value)} type="number" fullWidth inputProps={{ min: 1 }} />
                  <TextField
                    label="Bữa/ngày (mealsPerDay)"
                    value={mealsPerDay}
                    onChange={(e) => setMealsPerDay(e.target.value)}
                    type="number"
                    fullWidth
                    inputProps={{ min: 1, max: 10 }}
                    helperText="Để trống sẽ mặc định 3 (backend)."
                  />
                </Stack>

                <Stack direction="row" spacing={2}>
                  <TextField label="Chiều cao (heightCm)" value={heightCm} onChange={(e) => setHeightCm(e.target.value)} type="number" fullWidth inputProps={{ min: 50, max: 250 }} />
                  <TextField label="Cân nặng (weightKg)" value={weightKg} onChange={(e) => setWeightKg(e.target.value)} type="number" fullWidth inputProps={{ min: 10, max: 400, step: "0.1" }} />
                </Stack>

                <TextField select label="Mức hoạt động (activityLevel)" value={activityLevel} onChange={(e) => setActivityLevel(e.target.value)} fullWidth>
                  {ACTIVITY_OPTIONS.map((o) => (
                    <MenuItem key={o.value} value={o.value}>
                      {o.label}
                    </MenuItem>
                  ))}
                </TextField>

                <TextField select label="Mục tiêu (goal)" value={goal} onChange={(e) => setGoal(e.target.value)} fullWidth>
                  {GOAL_OPTIONS.map((o) => (
                    <MenuItem key={o.value} value={o.value}>
                      {o.label}
                    </MenuItem>
                  ))}
                </TextField>

                <Stack direction="row" spacing={2}>
                  <TextField
                    label="Mục tiêu kg/tuần (targetKgPerWeek)"
                    value={targetKgPerWeek}
                    onChange={(e) => setTargetKgPerWeek(e.target.value)}
                    type="number"
                    fullWidth
                    inputProps={{ step: "0.1" }}
                    helperText="Optional. Backend sẽ ưu tiên nếu có."
                  />
                  <TextField
                    label="Ngân sách/ngày (VND)"
                    value={budgetPerDayVnd}
                    onChange={(e) => setBudgetPerDayVnd(e.target.value)}
                    type="number"
                    fullWidth
                    inputProps={{ min: 0, step: "1000" }}
                    helperText="Optional."
                  />
                </Stack>

                <TextField label="Dị ứng (allergies)" value={allergies} onChange={(e) => setAllergies(e.target.value)} fullWidth placeholder="Ví dụ: sữa, đậu phộng..." />
                <TextField label="Ghi chú (notes)" value={notes} onChange={(e) => setNotes(e.target.value)} fullWidth multiline minRows={3} placeholder="Ví dụ: muốn ăn dễ nấu, ít dầu mỡ..." />
              </Stack>

              {/* Preview */}
              <Stack spacing={2} sx={{ width: { xs: "100%", md: 340 } }}>
                <Card variant="outlined">
                  <CardContent>
                    <Typography fontWeight={800} mb={1}>
                      Preview kết quả
                    </Typography>

                    {!preview ? (
                      <Alert severity="info">Nhập đủ tuổi/chiều cao/cân nặng để xem preview.</Alert>
                    ) : (
                      <>
                        <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1, mb: 1 }}>
                          <Chip label={`BMI: ${preview.bmi}`} color="success" />
                          <Chip label={`BMR: ${preview.bmr} kcal`} variant="outlined" />
                          <Chip label={`TDEE: ${preview.tdee} kcal`} variant="outlined" />
                          <Chip label={`Cal Target: ${preview.calorieTarget} kcal`} variant="outlined" />
                        </Box>

                        <Divider sx={{ my: 1.5 }} />

                        <Typography fontWeight={700} mb={0.5}>
                          Macro gợi ý (g/ngày)
                        </Typography>
                        <Stack spacing={1}>
                          <Chip label={`Protein: ${preview.proteinG} g`} />
                          <Chip label={`Fat: ${preview.fatG} g`} />
                          <Chip label={`Carb: ${preview.carbG} g`} />
                        </Stack>

                        <Divider sx={{ my: 1.5 }} />

                        <Typography variant="body2" color="text.secondary">
                          {enumLabel(sex)} • {enumLabel(activityLevel)} • {enumLabel(goal)}
                        </Typography>
                      </>
                    )}
                  </CardContent>
                </Card>

                <Button
                  type="submit"
                  variant="contained"
                  color="success"
                  size="large"
                  disabled={submitting}
                  endIcon={submitting ? <CircularProgress size={18} color="inherit" /> : <ArrowForward />}
                >
                  {submitting ? "Đang tạo..." : "Tạo assessment"}
                </Button>

                <Typography variant="caption" color="text.secondary">
                  Gửi đúng DTO: CreateAssessmentRequest. Response: NutritionAssessmentResponse (kèm metrics).
                </Typography>
              </Stack>
            </Stack>
          </Box>
        </Paper>
      </Box>

      {/* RIGHT */}
      <Box
        sx={{
          flex: 1,
          display: { xs: "none", md: "block" },
          backgroundImage: "url(https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=1600&q=80)",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      />
    </Box>
  );
}
