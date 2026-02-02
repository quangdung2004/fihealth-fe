import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import MealPlanPretty from "../components/MealPlanPretty";
import {
  Box,
  Button,
  TextField,
  Typography,
  Divider,
  IconButton,
  Paper,
  Alert,
  CircularProgress,
  MenuItem,
  Chip,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Tooltip,
} from "@mui/material";
import {
  Visibility,
  VisibilityOff,
  FitnessCenter,
  AutoAwesome,
} from "@mui/icons-material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";

import axiosClient from "../api/axiosClient"; // ⚠️ chỉnh path nếu cần

function unwrap(res) {
  return res?.data?.data ?? res?.data;
}

const PERIOD_OPTIONS = [
  { value: "DAY", label: "1 ngày (DAY)" },
  { value: "WEEK", label: "7 ngày (WEEK)" },
  { value: "MONTH", label: "30 ngày (MONTH)" },
];

async function copyText(text) {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    return false;
  }
}

function PlanCard({ p, onGoDetail }) {
  const totalDays = Array.isArray(p?.days) ? p.days.length : 0;

  const displayName =
    (p?.name && String(p.name).trim()) ||
    (p?.title && String(p.title).trim()) ||
    (p?.period ? `Thực đơn ${p.period.toLowerCase()}` : "Thực đơn");

  const shortId = p?.id ? String(p.id).slice(0, 8) : "";

  return (
    <Paper variant="outlined" sx={{ p: 1.5, mb: 1.5, borderColor: "#eee", bgcolor: "#fff" }}>
      <Typography fontWeight={800} sx={{ mb: 0.5 }}>
        {displayName} {shortId ? `• #${shortId}` : ""}
      </Typography>

      <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap", mb: 1 }}>
        <Chip size="small" label={`Kỳ: ${p?.period ?? "—"}`} />
        <Chip size="small" label={`Bắt đầu: ${p?.startDate ?? "—"}`} />
        <Chip size="small" label={`Kết thúc: ${p?.endDate ?? "—"}`} />
        <Chip size="small" label={`Số ngày: ${totalDays}`} />
        <Chip size="small" color={p?.favorite ? "success" : "default"} label={p?.favorite ? "Đã lưu" : "Chưa lưu"} />
      </Box>

      <Button size="small" onClick={() => onGoDetail(p?.id)} disabled={!p?.id}>
        Xem chi tiết
      </Button>
    </Paper>
  );
}

function MealPlanHotPage() {
  const navigate = useNavigate();

  const [period, setPeriod] = useState("WEEK");
  const [limit, setLimit] = useState(10);

  const [loading, setLoading] = useState(false);
  const [errMsg, setErrMsg] = useState("");
  const [okMsg, setOkMsg] = useState("");
  const [result, setResult] = useState(null);

  // DEV-only: ẩn/hiện JSON payload trong accordion
  const [showDevJson, setShowDevJson] = useState(false);

  const payload = useMemo(
    () => ({
      method: "GET",
      url: `/api/meal-plans/hot?period=${period}&limit=${limit}`,
      query: { period, limit },
      note: "return List<MealPlanDto>",
    }),
    [period, limit]
  );

  const periodLabel =
    PERIOD_OPTIONS.find((x) => x.value === period)?.label || period;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrMsg("");
    setOkMsg("");
    setResult(null);

    if (!period) return setErrMsg("period không được để trống.");
    if (!Number.isFinite(Number(limit)) || Number(limit) <= 0)
      return setErrMsg("limit phải là số > 0.");

    setLoading(true);
    try {
      const res = await axiosClient.get("/meal-plans/hot", {
        params: { period, limit: Number(limit) },
      });

      const data = unwrap(res); // List<MealPlanDto>
      if (!Array.isArray(data)) {
        setErrMsg("Backend trả về không phải mảng (List<MealPlanDto>).");
        return;
      }

      setResult(data);
      setOkMsg("Lấy danh sách hot thành công.");
    } catch (e2) {
      const status = e2?.response?.status;
      const serverMsg = e2?.response?.data?.message || e2?.response?.data?.error;

      if (status === 401) setErrMsg("401: Chưa đăng nhập hoặc token hết hạn.");
      else if (status === 400) setErrMsg(serverMsg || "400: period/limit không hợp lệ.");
      else setErrMsg(serverMsg || "Gọi API thất bại.");
    } finally {
      setLoading(false);
    }
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
          <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 2 }}>
            <FitnessCenter color="success" fontSize="large" />
            <Typography variant="h4" fontWeight={700}>
              FiHealth
            </Typography>
          </Box>

          <Typography color="text.secondary" mb={3}>
            Xem các thực đơn phổ biến theo gói thời gian (ngày/tuần/tháng).
          </Typography>

          <Paper
            variant="outlined"
            sx={{ p: 2, mb: 3, bgcolor: "#f1fdf9", borderColor: "#cceee5" }}
          >
            <Box sx={{ display: "flex", gap: 1 }}>
              <AutoAwesome color="success" />
              <Box>
                <Typography fontWeight={600}>Chọn gói phù hợp</Typography>
                <Typography variant="body2" color="text.secondary">
                  Bạn có thể chọn 1 ngày / 7 ngày / 30 ngày để xem danh sách gợi ý.
                </Typography>
              </Box>
            </Box>
          </Paper>

          {loading && (
            <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 2 }}>
              <CircularProgress size={20} />
              <Typography variant="body2" color="text.secondary">
                Đang tải dữ liệu...
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

          <Box component="form" onSubmit={handleSubmit}>
            <TextField
              select
              label="Chọn gói thời gian"
              fullWidth
              margin="normal"
              value={period}
              onChange={(e) => setPeriod(e.target.value)}
              required
            >
              {PERIOD_OPTIONS.map((o) => (
                <MenuItem key={o.value} value={o.value}>
                  {o.label}
                </MenuItem>
              ))}
            </TextField>

            <TextField
              label="Số lượng hiển thị"
              type="number"
              fullWidth
              margin="normal"
              value={limit}
              onChange={(e) => setLimit(e.target.value)}
              inputProps={{ min: 1, max: 50 }}
              required
              helperText="Tối đa 50 (backend sẽ giới hạn)."
            />

            <Button
              type="submit"
              variant="contained"
              color="success"
              fullWidth
              sx={{ py: 1.2, mt: 1 }}
              disabled={loading}
            >
              Xem thực đơn hot
            </Button>
          </Box>

          {/* Friendly summary for users */}
          <Divider sx={{ my: 3 }}>Thông tin</Divider>
          <Paper
            variant="outlined"
            sx={{ p: 2, mb: 2, bgcolor: "#fafafa", borderColor: "#eee" }}
          >
            <Typography fontWeight={800} sx={{ mb: 0.5 }}>
              Gói đang chọn: {periodLabel}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Hiển thị tối đa <b>{Number(limit) || 0}</b> thực đơn phổ biến.
            </Typography>

            <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap", mt: 1 }}>
              <Chip size="small" label={`Kỳ: ${period}`} />
              <Chip size="small" label={`Limit: ${Number(limit) || 0}`} />
            </Box>
          </Paper>

          {/* Result */}
          {Array.isArray(result) && (
            <>
              <Divider sx={{ my: 3 }}>Danh sách</Divider>
              <Paper
                variant="outlined"
                sx={{
                  p: 1.5,
                  bgcolor: "#fafafa",
                  borderColor: "#eee",
                  maxHeight: 300,
                  overflow: "auto",
                }}
              >
                {result.length === 0 ? (
                  <Typography variant="body2" color="text.secondary">
                    Không có dữ liệu.
                  </Typography>
                ) : (
                  result.map((p) => (
                    <PlanCard
                      key={p?.id}
                      p={p}
                      onGoDetail={(id) => id && navigate(`/meal-plans/${id}`)}
                    />
                  ))
                )}
              </Paper>
            </>
          )}

          {/* DEV-only technical details */}
          {import.meta?.env?.DEV && (
            <>
              <Divider sx={{ my: 3 }}>Dev tools</Divider>
              <Accordion
                variant="outlined"
                sx={{ borderColor: "#eee" }}
                expanded={showDevJson}
                onChange={() => setShowDevJson((v) => !v)}
              >
                <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                  <Typography fontWeight={800}>Thông tin kỹ thuật (DEV)</Typography>
                </AccordionSummary>
                <AccordionDetails>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{ mb: 1 }}
                  >
                    Chỉ hiển thị khi chạy môi trường DEV.
                  </Typography>

                  <Paper
                    variant="outlined"
                    sx={{
                      p: 1.5,
                      bgcolor: "#0b1020",
                      color: "#e6edf3",
                      borderColor: "#111827",
                      position: "relative",
                      overflow: "auto",
                      maxHeight: 220,
                      mb: 2,
                    }}
                  >
                    <Box sx={{ position: "absolute", top: 8, right: 8 }}>
                      <Tooltip title="Copy request URL">
                        <IconButton
                          size="small"
                          onClick={async () => {
                            const ok = await copyText(payload.url);
                            if (ok) setOkMsg("Đã copy URL để test.");
                          }}
                          sx={{ color: "#e6edf3" }}
                        >
                          <ContentCopyIcon fontSize="inherit" />
                        </IconButton>
                      </Tooltip>
                    </Box>

                    <pre
                      style={{
                        margin: 0,
                        fontSize: 12,
                        whiteSpace: "pre-wrap",
                      }}
                    >
                      {JSON.stringify(payload, null, 2)}
                    </pre>
                  </Paper>

                  {/* Nếu bạn vẫn muốn xem response JSON đẹp trong DEV */}
                  {Array.isArray(result) && (
                    <Paper
                      variant="outlined"
                      sx={{
                        p: 1.5,
                        bgcolor: "#fff",
                        borderColor: "#eee",
                      }}
                    >
                      <Typography fontWeight={800} sx={{ mb: 1 }}>
                        Response (pretty)
                      </Typography>
                      <MealPlanPretty data={result} />
                    </Paper>
                  )}
                </AccordionDetails>
              </Accordion>
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
            "url(https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=1600&q=80)",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <Box sx={{ position: "absolute", inset: 0, bgcolor: "rgba(255,255,255,0.75)" }} />
      </Box>
    </Box>
  );
}

export default MealPlanHotPage;
export { MealPlanHotPage };
