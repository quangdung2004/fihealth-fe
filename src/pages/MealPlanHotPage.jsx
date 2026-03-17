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
  FitnessCenter,
  AutoAwesome,
} from "@mui/icons-material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import axiosClient from "../api/axiosClient";

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
    p?.name || p?.title || `Thực đơn ${p?.period ?? ""}`;
  const shortId = p?.id ? String(p.id).slice(0, 8) : "";

  return (
    <Paper variant="outlined" sx={{ p: 1.5, mb: 1.5 }}>
      <Typography fontWeight={800}>
        {displayName} {shortId && `• #${shortId}`}
      </Typography>

      <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap", my: 1 }}>
        <Chip size="small" label={`Kỳ: ${p?.period}`} />
        <Chip size="small" label={`Số ngày: ${totalDays}`} />
      </Box>

      <Button size="small" onClick={() => onGoDetail(p?.id)}>
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
  const [showDevJson, setShowDevJson] = useState(false);

  const payload = useMemo(
    () => ({
      method: "GET",
      url: `/api/meal-plans/hot?period=${period}&limit=${limit}`,
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

    setLoading(true);
    try {
      const res = await axiosClient.get("/meal-plans/hot", {
        params: { period, limit },
      });
      const data = unwrap(res);
      if (!Array.isArray(data)) throw new Error("Invalid data");
      setResult(data);
      setOkMsg("Lấy danh sách hot thành công.");
    } catch (err) {
      setErrMsg("Gọi API thất bại.");
    } finally {
      setLoading(false);
    }
  };

  return (
    // ✅ FIX Ở ĐÂY — KHÔNG fixed, KHÔNG inset
    <Box sx={{ display: "flex", minHeight: "100%" }}>
      {/* LEFT */}
      <Box
        sx={{
          flex: 1,
          display: "flex",
          justifyContent: "center",
          py: 4,
          px: 2,
        }}
      >
        <Paper sx={{ p: 4, width: "100%", maxWidth: 520 }}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 2 }}>
            <FitnessCenter color="success" />
            <Typography variant="h4" fontWeight={700}>
              FiHealth
            </Typography>
          </Box>

          <Typography color="text.secondary" mb={3}>
            Xem các thực đơn phổ biến theo gói thời gian.
          </Typography>

          {loading && <CircularProgress size={20} />}
          {errMsg && <Alert severity="warning">{errMsg}</Alert>}
          {okMsg && <Alert severity="success">{okMsg}</Alert>}

          <Box component="form" onSubmit={handleSubmit}>
            <TextField
              select
              label="Gói thời gian"
              fullWidth
              margin="normal"
              value={period}
              onChange={(e) => setPeriod(e.target.value)}
            >
              {PERIOD_OPTIONS.map((o) => (
                <MenuItem key={o.value} value={o.value}>
                  {o.label}
                </MenuItem>
              ))}
            </TextField>

            <TextField
              label="Số lượng"
              type="number"
              fullWidth
              margin="normal"
              value={limit}
              onChange={(e) => setLimit(e.target.value)}
            />

            <Button type="submit" fullWidth variant="contained" color="success">
              Xem thực đơn hot
            </Button>
          </Box>

          <Divider sx={{ my: 3 }}>Danh sách</Divider>

          {Array.isArray(result) &&
            result.map((p) => (
              <PlanCard
                key={p.id}
                p={p}
                onGoDetail={(id) => navigate(`/meal-plans/${id}`)}
              />
            ))}

          <Divider sx={{ my: 3 }} />

          <Button size="small" onClick={() => navigate("/")}>
            ← Về trang chủ
          </Button>
        </Paper>
      </Box>

      {/* RIGHT */}
      <Box
        sx={{
          flex: 1,
          display: { xs: "none", md: "block" },
          backgroundImage:
            "url(https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b)",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      />
    </Box>
  );
}

export default MealPlanHotPage;
