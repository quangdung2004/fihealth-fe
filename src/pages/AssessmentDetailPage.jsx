import { useMemo, useState } from "react";
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
  Chip,
} from "@mui/material";
import { FitnessCenter, Calculate } from "@mui/icons-material";

// ===== Helpers =====
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
  if (a.includes("ACTIVE")) return 1.725;
  if (a.includes("VERY")) return 1.9;
  return 1.55;
}

function numOrNull(v) {
  if (v === "" || v == null) return null;
  const n = Number(v);
  return Number.isFinite(n) ? n : null;
}

export default function CreateAssessmentFullPage() {
  const navigate = useNavigate();

  // ✅ chỉ nhập 3 field
  const [age, setAge] = useState("");
  const [heightCm, setHeightCm] = useState("");
  const [weightKg, setWeightKg] = useState("");

  const [submitted, setSubmitted] = useState(false);
  const [errMsg, setErrMsg] = useState("");

  // ✅ default (ẩn) để ra đúng preview như ảnh
  const sex = "MALE";
  const activityLevel = "MODERATE";
  const goal = "MAINTAIN";

  const preview = useMemo(() => {
    const a = numOrNull(age);
    const h = numOrNull(heightCm);
    const w = numOrNull(weightKg);
    if (!a || !h || !w) return null;

    const hm = h / 100.0;
    if (hm <= 0) return null;

    const bmi = w / (hm * hm);
    const bmr = calcBmr(sex, w, h, a);
    if (bmr == null) return null;

    const tdee = bmr * activityFactor(activityLevel);

    // ✅ goal=MAINTAIN => Cal Target = TDEE
    const calorieTarget = tdee;

    // ✅ macro giống logic cũ của bạn
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
      sex,
      activityLevel,
      goal,
    };
  }, [age, heightCm, weightKg]); // sex/activity/goal cố định

  const validate = () => {
    const a = numOrNull(age);
    const h = numOrNull(heightCm);
    const w = numOrNull(weightKg);
    if (!a || a <= 0) return "Tuổi không hợp lệ.";
    if (!h || h <= 0) return "Chiều cao không hợp lệ.";
    if (!w || w <= 0) return "Cân nặng không hợp lệ.";
    return "";
  };

  const handleCalc = (e) => {
    e.preventDefault();
    setSubmitted(true);
    setErrMsg(validate());
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
      <Box
        sx={{
          width: "100%",
          maxWidth: 980,
          display: "flex",
          gap: 3,
          flexDirection: { xs: "column", md: "row" },
          alignItems: "stretch",
        }}
      >
        {/* FORM */}
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
          <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1 }}>
            <FitnessCenter color="success" fontSize="large" />
            <Box sx={{ flex: 1 }}>
              <Typography variant="h4" fontWeight={800}>
                FiHealth
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Tính nhanh BMI / BMR / TDEE / Macro
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
            Chỉ cần nhập <b>tuổi</b>, <b>chiều cao</b>, <b>cân nặng</b> rồi nhấn <b>Tính</b>.
          </Typography>

          {submitted && !!errMsg && (
            <Alert severity="warning" sx={{ mb: 2 }}>
              {errMsg}
            </Alert>
          )}

          <Box component="form" onSubmit={handleCalc}>
            <Stack spacing={2}>
              <TextField
                label="Tuổi"
                value={age}
                onChange={(e) => {
                  setAge(e.target.value);
                  if (submitted) setErrMsg("");
                }}
                type="number"
                fullWidth
                inputProps={{ min: 1, max: 120 }}
              />

              <TextField
                label="Chiều cao (cm)"
                value={heightCm}
                onChange={(e) => {
                  setHeightCm(e.target.value);
                  if (submitted) setErrMsg("");
                }}
                type="number"
                fullWidth
                inputProps={{ min: 50, max: 250 }}
              />

              <TextField
                label="Cân nặng (kg)"
                value={weightKg}
                onChange={(e) => {
                  setWeightKg(e.target.value);
                  if (submitted) setErrMsg("");
                }}
                type="number"
                fullWidth
                inputProps={{ min: 10, max: 400, step: "0.1" }}
              />

              <Button
                type="submit"
                variant="contained"
                color="success"
                size="large"
                startIcon={<Calculate />}
                sx={{ py: 1.2 }}
              >
                Tính
              </Button>

              <Typography variant="caption" color="text.secondary">
                * Dùng mặc định: MALE • MODERATE • MAINTAIN (ẩn để form gọn).
              </Typography>
            </Stack>
          </Box>
        </Paper>

        {/* PREVIEW */}
        <Paper
          elevation={0}
          sx={{
            width: { xs: "100%", md: 360 },
            p: { xs: 2.5, md: 3 },
            borderRadius: 3,
            border: "1px solid",
            borderColor: "divider",
            boxShadow: "0 14px 50px rgba(0,0,0,0.08)",
          }}
        >
          <Typography fontWeight={900} mb={1}>
            Preview kết quả
          </Typography>
          <Divider sx={{ mb: 2 }} />

          {!submitted ? (
            <Alert severity="info">Nhập thông tin và nhấn “Tính”.</Alert>
          ) : !!errMsg ? (
            <Alert severity="warning">Vui lòng sửa lỗi để xem kết quả.</Alert>
          ) : !preview ? (
            <Alert severity="info">Chưa đủ dữ liệu.</Alert>
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
                {preview.sex} • {preview.activityLevel} • {preview.goal}
              </Typography>
            </>
          )}
        </Paper>
      </Box>
    </Box>
  );
}
