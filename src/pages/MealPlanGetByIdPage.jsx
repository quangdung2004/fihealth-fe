import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Button,
  TextField,
  Typography,
  Paper,
  Alert,
  CircularProgress,
  MenuItem,
  InputAdornment,
} from "@mui/material";
import { FitnessCenter, AutoAwesome, Search } from "@mui/icons-material";
import axiosClient from "../api/axiosClient"; // chỉnh path nếu cần

function unwrap(res) {
  return res?.data?.data ?? res?.data;
}

// ✅ label KHÔNG hiển thị ID nữa
function planLabel(p) {
  const period = p?.period ?? "—";
  const start = p?.startDate ?? "—";
  const end = p?.endDate ?? "—";
  const fav = p?.favorite ? "★ " : "";
  return `${fav}${start} → ${end} • ${period}`;
}

export function MealPlanGetByIdPage() {
  const navigate = useNavigate();

  const [period, setPeriod] = useState("WEEK");
  const [limit, setLimit] = useState(20);
  const [plans, setPlans] = useState([]);
  const [selectedId, setSelectedId] = useState("");

  const [search, setSearch] = useState("");
  const [loadingList, setLoadingList] = useState(false);

  const [errMsg, setErrMsg] = useState("");
  const [okMsg, setOkMsg] = useState("");

  const PERIOD_OPTIONS = [
    { value: "DAY", label: "1 ngày (DAY)" },
    { value: "WEEK", label: "7 ngày (WEEK)" },
    { value: "MONTH", label: "30 ngày (MONTH)" },
  ];

  // load list (hot) để user chọn thay vì nhập UUID
  useEffect(() => {
    let alive = true;
    (async () => {
      setErrMsg("");
      setOkMsg("");
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
    return () => {
      alive = false;
    };
  }, [period, limit]);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return plans;
    return plans.filter((p) => planLabel(p).toLowerCase().includes(q));
  }, [plans, search]);

  // ✅ Details: nhảy thẳng sang trang detail có sẵn
  const handleDetails = () => {
    setErrMsg("");
    setOkMsg("");

    if (!selectedId) {
      setErrMsg("Bạn chưa chọn meal plan nào.");
      return;
    }

    // 🔁 Nếu route detail meal plan của bạn khác, đổi đúng path này:
    navigate(`/meal-plans/${encodeURIComponent(selectedId)}`);
  };

  return (
    <Box sx={{ position: "fixed", inset: 0, display: "flex", overflow: "hidden", bgcolor: "#fff" }}>
      <Box sx={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", px: 2 }}>
        <Paper elevation={3} sx={{ p: 4, width: "100%", maxWidth: 560 }}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 2 }}>
            <FitnessCenter color="success" fontSize="large" />
            <Typography variant="h4" fontWeight={700}>
              FiHealth
            </Typography>
          </Box>

          <Paper variant="outlined" sx={{ p: 2, mb: 3, bgcolor: "#f1fdf9", borderColor: "#cceee5" }}>
            <Box sx={{ display: "flex", gap: 1 }}>
              <AutoAwesome color="success" />
              <Box>
                <Typography fontWeight={600}>Không cần nhập ID</Typography>
                <Typography variant="body2" color="text.secondary">
                  Người dùng chỉ chọn meal plan từ danh sách, FE tự dùng id ẩn phía sau.
                </Typography>
              </Box>
            </Box>
          </Paper>

          {!!errMsg && <Alert severity="warning" sx={{ mb: 2 }}>{errMsg}</Alert>}
          {!!okMsg && <Alert severity="success" sx={{ mb: 2 }}>{okMsg}</Alert>}

          <Box sx={{ display: "flex", gap: 2 }}>
            <TextField select fullWidth label="period" value={period} onChange={(e) => setPeriod(e.target.value)}>
              {PERIOD_OPTIONS.map((o) => (
                <MenuItem key={o.value} value={o.value}>
                  {o.label}
                </MenuItem>
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
                <InputAdornment position="start">
                  <Search />
                </InputAdornment>
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
            helperText={
              loadingList
                ? "Đang tải danh sách..."
                : filtered.length === 0
                ? "Không có meal plan nào."
                : ""
            }
          >
            {filtered.map((p) => (
              <MenuItem key={p.id} value={p.id}>
                {planLabel(p)}
              </MenuItem>
            ))}
          </TextField>

          {/* ✅ Nút Details bên dưới dropdown */}
          <Button
            variant="outlined"
            fullWidth
            sx={{ mt: 2, textTransform: "none" }}
            onClick={handleDetails}
            disabled={loadingList || !selectedId}
          >
            Details
          </Button>

          <Typography textAlign="center" variant="body2" color="text.secondary" mt={2}>
            <Button size="small" onClick={() => navigate("/")}>
              ← Về trang chủ
            </Button>
          </Typography>
        </Paper>
      </Box>
    </Box>
  );
}

export default MealPlanGetByIdPage;