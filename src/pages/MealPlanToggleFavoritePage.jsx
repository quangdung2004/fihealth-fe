import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import MealPlanPretty from "../components/MealPlanPretty";
import {
  Box, Button, TextField, Typography, Divider, IconButton,
  Paper, Alert, CircularProgress, MenuItem, InputAdornment
} from "@mui/material";
import { Visibility, VisibilityOff, FitnessCenter, AutoAwesome, Search } from "@mui/icons-material";
import axiosClient from "../api/axiosClient"; // chỉnh path nếu cần

function unwrap(res) {
  return res?.data?.data ?? res?.data;
}

function planLabel(p) {
  const period = p?.period ?? "—";
  const start = p?.startDate ?? "—";
  const end = p?.endDate ?? "—";
  const fav = p?.favorite ? "★" : "";
  return `${fav}${start} → ${end} • ${period} • ${p?.id?.slice?.(0, 8) ?? ""}`;
}

function MealPlanToggleFavoritePage() {
  const navigate = useNavigate();

  const [period, setPeriod] = useState("WEEK");
  const [limit, setLimit] = useState(20);
  const [plans, setPlans] = useState([]);
  const [selectedId, setSelectedId] = useState("");

  const [search, setSearch] = useState("");
  const [showPreview, setShowPreview] = useState(true);

  const [loadingList, setLoadingList] = useState(false);
  const [loading, setLoading] = useState(false);

  const [errMsg, setErrMsg] = useState("");
  const [okMsg, setOkMsg] = useState("");
  const [result, setResult] = useState(null);

  const PERIOD_OPTIONS = [
    { value: "DAY", label: "1 ngày (DAY)" },
    { value: "WEEK", label: "7 ngày (WEEK)" },
    { value: "MONTH", label: "30 ngày (MONTH)" },
  ];

  useEffect(() => {
    let alive = true;
    (async () => {
      setErrMsg(""); setOkMsg(""); setResult(null);
      setLoadingList(true);
      try {
        const res = await axiosClient.get("/meal-plans/hot", {
          params: { period, limit: Number(limit) },
        });
        const data = unwrap(res);
        if (!alive) return;

        if (!Array.isArray(data)) {
          setPlans([]);
          setErrMsg("Danh sách meal plans không đúng định dạng (không phải mảng).");
          return;
        }
        setPlans(data);
        if (data[0]?.id) setSelectedId(data[0].id);
      } catch (e) {
        if (!alive) return;
        setPlans([]);
        setErrMsg(e?.response?.data?.message || "Không tải được danh sách meal plans.");
      } finally {
        if (alive) setLoadingList(false);
      }
    })();
    return () => { alive = false; };
  }, [period, limit]);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return plans;
    return plans.filter((p) => planLabel(p).toLowerCase().includes(q));
  }, [plans, search]);

  const preview = useMemo(() => ({
    method: "POST",
    url: `/api/meal-plans/${selectedId || "{id}"}/favorite`,
    note: "Không cần body. Controller toggle theo user + planId",
  }), [selectedId]);

  const handleToggle = async () => {
    setErrMsg(""); setOkMsg(""); setResult(null);

    if (!selectedId) {
      setErrMsg("Bạn chưa chọn meal plan nào.");
      return;
    }

    setLoading(true);
    try {
      const res = await axiosClient.post(`/meal-plans/${selectedId}/favorite`);
      const data = unwrap(res); // { mealPlanId, favorite }
      setResult(data);
      setOkMsg("Toggle favorite thành công.");

      // UX: cập nhật ngay icon ★ trong dropdown
      setPlans((prev) =>
        prev.map((p) =>
          p.id === selectedId ? { ...p, favorite: !!data?.favorite } : p
        )
      );
    } catch (e) {
      const status = e?.response?.status;
      if (status === 401) setErrMsg("401: Chưa đăng nhập hoặc token hết hạn.");
      else setErrMsg(e?.response?.data?.message || "Toggle favorite thất bại.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ position: "fixed", inset: 0, display: "flex", overflow: "hidden", bgcolor: "#fff" }}>
      <Box sx={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", px: 2 }}>
        <Paper elevation={3} sx={{ p: 4, width: "100%", maxWidth: 560 }}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 2 }}>
            <FitnessCenter color="success" fontSize="large" />
            <Typography variant="h4" fontWeight={700}>FiHealth</Typography>
          </Box>

          <Paper variant="outlined" sx={{ p: 2, mb: 3, bgcolor: "#f1fdf9", borderColor: "#cceee5" }}>
            <Box sx={{ display: "flex", gap: 1 }}>
              <AutoAwesome color="success" />
              <Box>
                <Typography fontWeight={600}>Người dùng không cần biết ID</Typography>
                <Typography variant="body2" color="text.secondary">
                  Chọn meal plan từ danh sách và bấm toggle.
                </Typography>
              </Box>
            </Box>
          </Paper>

          {!!errMsg && <Alert severity="warning" sx={{ mb: 2 }}>{errMsg}</Alert>}
          {!!okMsg && <Alert severity="success" sx={{ mb: 2 }}>{okMsg}</Alert>}

          <Box sx={{ display: "flex", gap: 2 }}>
            <TextField select fullWidth label="period" value={period} onChange={(e) => setPeriod(e.target.value)}>
              {PERIOD_OPTIONS.map((o) => (
                <MenuItem key={o.value} value={o.value}>{o.label}</MenuItem>
              ))}
            </TextField>

            <TextField
              label="limit"
              type="number"
              value={limit}
              onChange={(e) => setLimit(e.target.value)}
              inputProps={{ min: 1, max: 50 }}
              sx={{ width: 140 }}
            />
          </Box>

          <TextField
            fullWidth
            label="Tìm nhanh"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            sx={{ mt: 2 }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start"><Search /></InputAdornment>
              ),
            }}
          />

          <TextField
            select
            fullWidth
            label="Chọn Meal Plan"
            value={selectedId}
            onChange={(e) => setSelectedId(e.target.value)}
            sx={{ mt: 2 }}
            disabled={loadingList || filtered.length === 0}
          >
            {filtered.map((p) => (
              <MenuItem key={p.id} value={p.id}>
                {planLabel(p)}
              </MenuItem>
            ))}
          </TextField>

          <Button
            variant="contained"
            color="success"
            fullWidth
            sx={{ mt: 2, py: 1.2 }}
            onClick={handleToggle}
            disabled={loadingList || loading || !selectedId}
          >
            {loading ? <CircularProgress size={20} /> : "Toggle Favorite"}
          </Button>

          <Divider sx={{ my: 3 }}>preview</Divider>
          <TextField
            label="Xem payload (ẩn/hiện)"
            type={showPreview ? "text" : "password"}
            fullWidth
            margin="normal"
            value={JSON.stringify(preview, null, 2)}
            multiline
            rows={4}
            InputProps={{
              endAdornment: (
                <IconButton onClick={() => setShowPreview(!showPreview)} edge="end">
                  {showPreview ? <VisibilityOff /> : <Visibility />}
                </IconButton>
              ),
              readOnly: true,
            }}
          />

          {!!result && (
            <>
              <Divider sx={{ my: 3 }}>response</Divider>
              <MealPlanPretty data={result} />
            </>
          )}

          <Typography textAlign="center" variant="body2" color="text.secondary" mt={2}>
            <Button size="small" onClick={() => navigate("/")}>← Về trang chủ</Button>
          </Typography>
        </Paper>
      </Box>
    </Box>
  );
}

export default MealPlanToggleFavoritePage;
export { MealPlanToggleFavoritePage };
