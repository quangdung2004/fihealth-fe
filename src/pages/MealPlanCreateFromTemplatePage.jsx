import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Button,
  TextField,
  Typography,
  Divider,
  Paper,
  Alert,
  CircularProgress,
} from "@mui/material";
import { FitnessCenter, AutoAwesome } from "@mui/icons-material";

import axiosClient from "../api/axiosClient"; // ✅ chỉnh đúng path nếu khác

export function MealPlanCreateFromTemplatePage() {
  const navigate = useNavigate();

  const [assessmentId, setAssessmentId] = useState("");
  const [period, setPeriod] = useState("WEEK");
  const [reqJson, setReqJson] = useState(""); // optional body

  const [loading, setLoading] = useState(false);
  const [errMsg, setErrMsg] = useState("");
  const [okMsg, setOkMsg] = useState("");
  const [result, setResult] = useState(null);

  // parse JSON an toàn (không làm trắng UI)
  const parsedBody = useMemo(() => {
    const t = (reqJson || "").trim();
    if (!t) return null;
    try {
      return JSON.parse(t);
    } catch {
      return { __error: "Invalid JSON", raw: t };
    }
  }, [reqJson]);

  const preview = useMemo(() => {
    return {
      method: "POST",
      url: `/api/meal-plans/from-template?assessmentId=${assessmentId || "{assessmentId}"}&period=${
        period || "{period}"
      }`,
      query: {
        assessmentId: assessmentId || null,
        period: period || null,
      },
      body: parsedBody,
      note: "FE will call backend via axiosClient (baseURL=/api).",
    };
  }, [assessmentId, period, parsedBody]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrMsg("");
    setOkMsg("");
    setResult(null);

    if (!assessmentId.trim()) {
      setErrMsg("assessmentId không được để trống.");
      return;
    }
    if (!period.trim()) {
      setErrMsg("period không được để trống.");
      return;
    }
    if (parsedBody?.__error) {
      setErrMsg("Request body JSON không hợp lệ. Hãy sửa JSON trước khi submit.");
      return;
    }

    setLoading(true);
    try {
      // body optional: nếu không nhập thì gửi {} (tùy backend bạn, an toàn hơn là {})
      const bodyToSend = parsedBody ?? {};

      const res = await axiosClient.post("/meal-plans/from-template", bodyToSend, {
        params: { assessmentId, period },
      });

      // res.data có thể là object trực tiếp hoặc ApiResponse { data: ... }
      const payload = res.data?.data ?? res.data;

      setResult(payload);
      setOkMsg("Tạo Meal Plan thành công.");
      console.log("Create meal plan OK:", payload);
    } catch (e2) {
      const status = e2?.response?.status;
      const serverMsg = e2?.response?.data?.message || e2?.response?.data?.error;

      if (status === 401) {
        setErrMsg("Bạn chưa đăng nhập hoặc token hết hạn. Hãy đăng nhập lại.");
      } else if (status === 400) {
        setErrMsg(serverMsg || "Request không hợp lệ (400). Kiểm tra assessmentId/period/body.");
      } else {
        setErrMsg(serverMsg || "Gọi API thất bại. Vui lòng thử lại.");
      }
      console.log("Create meal plan ERR:", status, e2?.response?.data || e2);
    } finally {
      setLoading(false);
    }
  };

  const reset = () => {
    setAssessmentId("");
    setPeriod("WEEK");
    setReqJson("");
    setErrMsg("");
    setOkMsg("");
    setResult(null);
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
        <Paper elevation={3} sx={{ p: 4, width: "100%", maxWidth: 420 }}>
          {/* Header */}
          <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 2 }}>
            <FitnessCenter color="success" fontSize="large" />
            <Typography variant="h4" fontWeight={700}>
              FiHealth
            </Typography>
          </Box>

          <Typography color="text.secondary" mb={3}>
            Tạo Meal Plan từ template (đã kết nối backend).
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

          {loading && (
            <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 2 }}>
              <CircularProgress size={20} />
              <Typography variant="body2" color="text.secondary">
                Đang gọi API...
              </Typography>
            </Box>
          )}

          {!!errMsg && (
            <Alert severity="warning" sx={{ mb: 2 }}>
              {errMsg}
            </Alert>
          )}

          {!!okMsg && (
            <Alert severity="success" sx={{ mb: 2 }}>
              {okMsg}
            </Alert>
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
              error={!!parsedBody?.__error}
              helperText={parsedBody?.__error ? "JSON không hợp lệ." : "Để trống nếu backend không cần body."}
            />

            <Button
              type="submit"
              variant="contained"
              color="success"
              fullWidth
              sx={{ py: 1.2, mt: 1 }}
              disabled={loading}
            >
              Tạo Meal Plan
            </Button>

            <Button
              variant="outlined"
              fullWidth
              sx={{ py: 1.1, mt: 1 }}
              onClick={reset}
              disabled={loading}
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

          {!!result && (
            <>
              <Divider sx={{ my: 3 }}>response</Divider>
              <Paper
                variant="outlined"
                sx={{
                  p: 1.5,
                  bgcolor: "#fafafa",
                  borderColor: "#eee",
                  maxHeight: 220,
                  overflow: "auto",
                }}
              >
                <pre style={{ margin: 0, fontSize: 12, whiteSpace: "pre-wrap" }}>
                  {JSON.stringify(result, null, 2)}
                </pre>
              </Paper>
            </>
          )}

          <Typography textAlign="center" variant="body2" color="text.secondary" mt={2}>
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
        <Box sx={{ position: "absolute", inset: 0, bgcolor: "rgba(255,255,255,0.75)" }} />
      </Box>
    </Box>
  );
}
