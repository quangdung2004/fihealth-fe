import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Button,
  TextField,
  Typography,
  Divider,
  Paper,
} from "@mui/material";
import { FitnessCenter, AutoAwesome } from "@mui/icons-material";

export function MealPlanCreateFromTemplatePage() {
  const navigate = useNavigate();

  const [assessmentId, setAssessmentId] = useState("");
  const [period, setPeriod] = useState("WEEK");
  const [reqJson, setReqJson] = useState(""); // optional body
  const [submitted, setSubmitted] = useState(false);

  const buildPreview = () => {
    const t = (reqJson || "").trim();
    let body = null;

    if (t) {
      try {
        body = JSON.parse(t);
      } catch {
        // Không throw để tránh trắng UI
        body = { __error: "Invalid JSON", raw: t };
      }
    }

    return {
      method: "POST",
      url: `/api/meal-plans/from-template?assessmentId=${assessmentId || "{assessmentId}"}&period=${
        period || "{period}"
      }`,
      query: {
        assessmentId: assessmentId || null,
        period: period || null,
      },
      body,
      note: "FE demo only (no backend call).",
    };
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
    console.log("CreateFromTemplate (demo):", buildPreview());
  };

  const reset = () => {
    setAssessmentId("");
    setPeriod("WEEK");
    setReqJson("");
    setSubmitted(false);
  };

  const preview = buildPreview();

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
        <Paper
          elevation={3}
          sx={{
            p: 4,
            width: "100%",
            maxWidth: 420, // giống LoginPage
          }}
        >
          {/* Header */}
          <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 2 }}>
            <FitnessCenter color="success" fontSize="large" />
            <Typography variant="h4" fontWeight={700}>
              FiHealth
            </Typography>
          </Box>

          <Typography color="text.secondary" mb={3}>
            Tạo Meal Plan từ template (UI demo, chưa gọi API).
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
                <Typography fontWeight={600}>Được hỗ trợ bởi AI</Typography>
                <Typography variant="body2" color="text.secondary">
                  Tạo meal plan dựa trên assessment và period
                </Typography>
              </Box>
            </Box>
          </Paper>

          {submitted && (
            <Typography
              sx={{
                mb: 2,
                p: 1.25,
                borderRadius: 1,
                bgcolor: "#f1fdf9",
                border: "1px solid #cceee5",
              }}
              variant="body2"
            >
              Đã submit (demo). Mở console để xem payload.
            </Typography>
          )}

          {/* Form */}
          <Box component="form" onSubmit={handleSubmit}>
            <TextField
              label="assessmentId (UUID)"
              fullWidth
              margin="normal"
              value={assessmentId}
              onChange={(e) => setAssessmentId(e.target.value)}
              required
            />

            <TextField
              label="period (PlanPeriod)"
              fullWidth
              margin="normal"
              value={period}
              onChange={(e) => setPeriod(e.target.value)}
              helperText="Nhập đúng enum backend (vd: DAY/WEEK/MONTH...)."
              required
            />

            <TextField
              label="Request body JSON (optional)"
              fullWidth
              margin="normal"
              value={reqJson}
              onChange={(e) => setReqJson(e.target.value)}
              multiline
              rows={3}
              placeholder={`Ví dụ:\n{\n  "startDate": "2026-02-01"\n}`}
            />

            <Button
              type="submit"
              variant="contained"
              color="success"
              fullWidth
              sx={{ py: 1.2, mt: 1 }}
            >
              Tạo Meal Plan
            </Button>

            <Button
              variant="outlined"
              fullWidth
              sx={{ py: 1.1, mt: 1 }}
              onClick={reset}
            >
              Reset
            </Button>
          </Box>

          <Divider sx={{ my: 3 }}>preview</Divider>

          <Paper
            variant="outlined"
            sx={{
              p: 1.5,
              bgcolor: "#fafafa",
              borderColor: "#eee",
              maxHeight: 180,
              overflow: "auto",
            }}
          >
            <pre style={{ margin: 0, fontSize: 12, whiteSpace: "pre-wrap" }}>
              {JSON.stringify(preview, null, 2)}
            </pre>
          </Paper>

          <Typography
            textAlign="center"
            variant="body2"
            color="text.secondary"
            mt={2}
          >
            <Button size="small" onClick={() => navigate("/")}>
              ← Về trang chủ
            </Button>
          </Typography>
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
        <Box
          sx={{
            position: "absolute",
            inset: 0,
            bgcolor: "rgba(255,255,255,0.75)",
          }}
        />
      </Box>
    </Box>
  );
}
