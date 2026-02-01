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
  Cake,
  Male,
  Female,
  Person,
  Straighten, // ✅ thay cho Height (icon có thật)
} from "@mui/icons-material";

export default function CreateAssessmentFullPage() {
  const navigate = useNavigate();

  const [showNote, setShowNote] = useState(false);
  const [form, setForm] = useState({
    fullName: "",
    gender: "MALE",
    age: "",
    heightCm: "",
    weightKg: "",
    goal: "LOSE_WEIGHT",
    activityLevel: "MODERATE",
    note: "",
  });
  

  const [submitted, setSubmitted] = useState(false);

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

  const handleSubmit = async (e) => {
  e.preventDefault();
  setSubmitted(true);

  try {
    const payload = {
      fullName: form.fullName,
      gender: form.gender,
      age: Number(form.age),
      heightCm: Number(form.heightCm),
      weightKg: Number(form.weightKg),
      goal: form.goal,
      activityLevel: form.activityLevel,
      note: form.note,
    };

    const res = await axiosClient.post("/assessments/full", payload);
    console.log("Created assessment:", res.data);

    // Ví dụ: chuyển sang trang danh sách assessments
    navigate("/assessments");
  } catch (err) {
    console.error(err);
    alert(err?.response?.data?.message || "Create assessment failed");
  }
};

  const reset = () => {
    setForm({
      fullName: "",
      gender: "MALE",
      age: "",
      heightCm: "",
      weightKg: "",
      goal: "LOSE_WEIGHT",
      activityLevel: "MODERATE",
      note: "",
    });
    setSubmitted(false);
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
          alignItems: "center",
          justifyContent: "center",
          px: 2,
        }}
      >
        <Paper elevation={3} sx={{ p: 4, width: "100%", maxWidth: 520 }}>
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
            Điền thông tin cơ bản để tạo hồ sơ đánh giá ban đầu (UI demo, chưa gọi API).
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
                  Gợi ý định hướng dinh dưỡng và theo dõi BMI
                </Typography>
              </Box>
            </Box>
          </Paper>

          {submitted && (
            <Alert severity="success" sx={{ mb: 2 }}>
              Đã submit form (demo). Mở console để xem payload.
            </Alert>
          )}

          {/* Form */}
          <Box component="form" onSubmit={handleSubmit}>
            <TextField
              label="Họ và tên"
              fullWidth
              margin="normal"
              value={form.fullName}
              onChange={onChange("fullName")}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Person />
                  </InputAdornment>
                ),
              }}
              required
            />

            <Stack direction={{ xs: "column", sm: "row" }} spacing={2} mt={1}>
              <TextField
                label="Giới tính"
                select
                fullWidth
                SelectProps={{ native: true }}
                value={form.gender}
                onChange={onChange("gender")}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      {form.gender === "MALE" ? (
                        <Male />
                      ) : form.gender === "FEMALE" ? (
                        <Female />
                      ) : (
                        <Person />
                      )}
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
              <TextField
                label="Mục tiêu"
                select
                fullWidth
                SelectProps={{ native: true }}
                value={form.goal}
                onChange={onChange("goal")}
              >
                <option value="LOSE_WEIGHT">Giảm cân</option>
                <option value="MAINTAIN">Duy trì</option>
                <option value="GAIN_MUSCLE">Tăng cơ</option>
              </TextField>

              <TextField
                label="Mức vận động"
                select
                fullWidth
                SelectProps={{ native: true }}
                value={form.activityLevel}
                onChange={onChange("activityLevel")}
              >
                <option value="LOW">Thấp</option>
                <option value="MODERATE">Vừa</option>
                <option value="HIGH">Cao</option>
              </TextField>
            </Stack>

            <TextField
              label="Ghi chú (tuỳ chọn)"
              fullWidth
              margin="normal"
              value={form.note}
              onChange={onChange("note")}
              multiline
              rows={3}
              type={showNote ? "text" : "password"}
              InputProps={{
                endAdornment: (
                  <IconButton onClick={() => setShowNote(!showNote)} edge="end">
                    {showNote ? <VisibilityOff /> : <Visibility />}
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
              >
                Tạo Assessment
              </Button>
              <Button
                variant="outlined"
                color="success"
                onClick={reset}
                startIcon={<RestartAlt />}
                sx={{ minWidth: 140 }}
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
