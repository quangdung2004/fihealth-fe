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

/**
 * ✅ Giống style LoginPage (fixed 2 cột + AI highlight)
 * ✅ Không kết nối backend (chỉ console.log)
 * ✅ Export BOTH để tránh import sai gây trắng UI
 */
export function MealPlanGetByIdPage() {
  const navigate = useNavigate();

  const [mealPlanId, setMealPlanId] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);

    const payload = {
      method: "GET",
      url: `/api/meal-plans/${mealPlanId || "{id}"}`,
      pathParams: { id: mealPlanId || null },
      note: "FE demo only (no backend call).",
    };

    console.log("MealPlanGetById (demo):", payload);
  };

  const preview = {
    method: "GET",
    url: `/api/meal-plans/${mealPlanId || "{id}"}`,
    pathParams: { id: mealPlanId || null },
    note: "FE demo only (no backend call).",
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
        <Paper
          elevation={3}
          sx={{
            p: 4,
            width: "100%",
            maxWidth: 420,
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
            Tra cứu Meal Plan theo ID để xem chi tiết kế hoạch (UI demo).
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
                  Hỗ trợ tra cứu và gợi ý tối ưu kế hoạch dinh dưỡng
                </Typography>
              </Box>
            </Box>
          </Paper>

          {submitted && (
            <Typography
              variant="body2"
              sx={{
                mb: 2,
                p: 1.25,
                borderRadius: 1,
                bgcolor: "#f1fdf9",
                border: "1px solid #cceee5",
              }}
            >
              Đã submit (demo). Mở console để xem payload.
            </Typography>
          )}

          {/* Form */}
          <Box component="form" onSubmit={handleSubmit}>
            <TextField
              label="MealPlan ID (UUID)"
              fullWidth
              margin="normal"
              value={mealPlanId}
              onChange={(e) => setMealPlanId(e.target.value)}
              required
            />

            <Button
              type="submit"
              variant="contained"
              color="success"
              fullWidth
              sx={{ py: 1.2, mt: 1 }}
            >
              Get Meal Plan
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

          <Typography textAlign="center" variant="body2" color="text.secondary" mt={3}>
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
        {/* overlay */}
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

/** ✅ Export default thêm để bạn import kiểu nào cũng không crash */
export default MealPlanGetByIdPage;
