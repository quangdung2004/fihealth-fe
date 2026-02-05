import { useEffect, useState } from "react";
import {
  Box,
  Button,
  TextField,
  Typography,
  Divider,
  Paper,
  Alert,
  MenuItem,
  CircularProgress,
} from "@mui/material";
import axiosClient from "../api/axiosClient";

function formatAssessmentLabel(a) {
  const date = a?.createdAt ? new Date(a.createdAt).toLocaleString("vi-VN") : "—";
  const goal = a?.goal ? String(a.goal).replaceAll("_", " ") : "—";
  const act = a?.activityLevel ? String(a.activityLevel).replaceAll("_", " ") : "—";
  const wh = `${a?.heightCm ?? "—"}cm • ${a?.weightKg ?? "—"}kg`;
  const budget =
    a?.budgetPerDayVnd != null ? `${a.budgetPerDayVnd} VND/ngày` : "Chưa có budget";
  return `${date} • ${goal} • ${act} • ${wh} • ${budget}`;
}

function isValidYYYYMMDD(s) {
  if (!s) return true; // optional
  return /^\d{4}-\d{2}-\d{2}$/.test(s.trim());
}

export default function MealPlanCreateFromTemplatePage() {
  const [assessments, setAssessments] = useState([]);
  const [assessmentId, setAssessmentId] = useState(""); // UUID nhưng user không phải nhập
  const [period, setPeriod] = useState("WEEK");
  const [startDate, setStartDate] = useState(""); // optional

  const [loadingAssessments, setLoadingAssessments] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const [errMsg, setErrMsg] = useState("");
  const [okMsg, setOkMsg] = useState("");
  const [result, setResult] = useState(null);

  const PERIOD_OPTIONS = [
    { value: "DAY", label: "1 ngày (DAY)" },
    { value: "WEEK", label: "7 ngày (WEEK)" },
    { value: "MONTH", label: "30 ngày (MONTH)" },
  ];

  // Load assessments của user
  useEffect(() => {
    let alive = true;

    (async () => {
      setErrMsg("");
      setOkMsg("");
      setResult(null);
      setLoadingAssessments(true);

      try {
        const res = await axiosClient.get("/assessments", { params: { me: true } });
        const list = res?.data?.data; // ApiResponse.ok(data)

        if (!alive) return;

        if (!Array.isArray(list)) {
          setAssessments([]);
          setErrMsg("Không lấy được danh sách assessments (data không phải mảng).");
          return;
        }

        // sort mới nhất lên đầu theo createdAt
        const sorted = [...list].sort((a, b) => {
          const ta = a?.createdAt ? new Date(a.createdAt).getTime() : 0;
          const tb = b?.createdAt ? new Date(b.createdAt).getTime() : 0;
          return tb - ta;
        });

        setAssessments(sorted);

        // auto chọn assessment mới nhất
        if (sorted[0]?.id) setAssessmentId(sorted[0].id);
      } catch (e) {
        if (!alive) return;

        const status = e?.response?.status;
        const serverMsg = e?.response?.data?.message || e?.message;

        if (status === 401) {
          setErrMsg("Bạn chưa đăng nhập hoặc token hết hạn. Hãy đăng nhập lại.");
        } else {
          setErrMsg(serverMsg || "Không tải được assessments.");
        }
        setAssessments([]);
      } finally {
        if (alive) setLoadingAssessments(false);
      }
    })();

    return () => {
      alive = false;
    };
  }, []);

  async function handleSubmit(e) {
    e.preventDefault();
    setErrMsg("");
    setOkMsg("");
    setResult(null);

    if (!assessmentId) {
      setErrMsg("Bạn chưa có assessment nào. Hãy tạo assessment trước.");
      return;
    }

    if (!isValidYYYYMMDD(startDate)) {
      setErrMsg("startDate không đúng định dạng YYYY-MM-DD.");
      return;
    }

    setSubmitting(true);
    try {
      const body = startDate?.trim() ? { startDate: startDate.trim() } : {};

      const res = await axiosClient.post("/meal-plans/from-template", body, {
        params: { assessmentId, period },
      });

      const payload = res?.data?.data ?? res?.data; // tùy backend
      setResult(payload);
      setOkMsg("Tạo Meal Plan thành công!");
    } catch (e2) {
      const status = e2?.response?.status;
      const serverMsg = e2?.response?.data?.message || e2?.message;

      if (status === 401) setErrMsg("401: Bạn chưa đăng nhập hoặc token hết hạn.");
      else if (status === 400) setErrMsg(serverMsg || "400: Dữ liệu không hợp lệ.");
      else setErrMsg(serverMsg || "Tạo Meal Plan thất bại.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <Box sx={{ p: 3 }}>
      <Paper sx={{ p: 3, maxWidth: 560 }}>
        <Typography variant="h5" fontWeight={800}>
          Tạo Meal Plan
        </Typography>
        <Typography color="text.secondary" mb={2}>
          Chọn lần đánh giá dinh dưỡng (assessment) để tạo thực đơn.
        </Typography>

        {loadingAssessments && (
          <Alert severity="info" sx={{ mb: 2 }}>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <CircularProgress size={18} />
              Đang tải danh sách assessments…
            </Box>
          </Alert>
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

        <Box component="form" onSubmit={handleSubmit}>
          <TextField
            select
            fullWidth
            label="Chọn assessment"
            value={assessmentId}
            onChange={(e) => setAssessmentId(e.target.value)}
            sx={{ mb: 2 }}
            disabled={loadingAssessments || assessments.length === 0}
            helperText={
              assessments.length === 0
                ? "Bạn chưa có assessment nào."
                : "Mặc định chọn lần mới nhất."
            }
          >
            {assessments.map((a) => (
              <MenuItem
                key={a.id}
                value={a.id}
                sx={{ whiteSpace: "normal", lineHeight: 1.2 }}
              >
                {formatAssessmentLabel(a)}
              </MenuItem>
            ))}
          </TextField>

          <TextField
            select
            fullWidth
            label="Kỳ hạn (period)"
            value={period}
            onChange={(e) => setPeriod(e.target.value)}
            sx={{ mb: 2 }}
          >
            {PERIOD_OPTIONS.map((o) => (
              <MenuItem key={o.value} value={o.value}>
                {o.label}
              </MenuItem>
            ))}
          </TextField>

          <TextField
            fullWidth
            label="startDate (optional) - YYYY-MM-DD"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            placeholder="Để trống => backend dùng LocalDate.now()"
            sx={{ mb: 2 }}
            error={!!startDate && !isValidYYYYMMDD(startDate)}
            helperText={
              !!startDate && !isValidYYYYMMDD(startDate)
                ? "Sai định dạng. Ví dụ: 2026-02-01"
                : "Có thể để trống."
            }
          />

          <Button
            type="submit"
            variant="contained"
            fullWidth
            disabled={submitting || loadingAssessments}
          >
            {submitting ? "Đang tạo..." : "Tạo Meal Plan"}
          </Button>
        </Box>

        {!!result && (
          <>
            <Divider sx={{ my: 2 }} />
            <pre style={{ whiteSpace: "pre-wrap", margin: 0 }}>
              {JSON.stringify(result, null, 2)}
            </pre>
          </>
        )}
      </Paper>
    </Box>
  );
}
