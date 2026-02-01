import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Button,
  TextField,
  Typography,
  Checkbox,
  FormControlLabel,
  Divider,
  IconButton,
  Paper,
} from "@mui/material";
import {
  Visibility,
  VisibilityOff,
  FitnessCenter,
  AutoAwesome,
} from "@mui/icons-material";

function MealPlanToggleFavoritePage() {
  const navigate = useNavigate();

  const [showPreview, setShowPreview] = useState(true);
  const [mealPlanId, setMealPlanId] = useState("");
  const [confirm, setConfirm] = useState(true);
  const [submitted, setSubmitted] = useState(false);

  const payload = {
    method: "POST",
    url: `/api/meal-plans/${mealPlanId || "{id}"}/favorite`,
    pathParams: { id: mealPlanId || null },
    note: "FE demo only (no backend call).",
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);

    if (!confirm) {
      console.log("Bạn chưa tick xác nhận toggle (demo).");
      return;
    }

    console.log("MealPlanToggleFavorite (demo):", payload);
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
            Toggle “yêu thích” cho Meal Plan theo ID (UI demo, chưa gọi API).
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
                  Cá nhân hóa gợi ý và theo dõi meal plan yêu thích
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

            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                my: 1,
              }}
            >
              <FormControlLabel
                control={
                  <Checkbox
                    checked={confirm}
                    onChange={(e) => setConfirm(e.target.checked)}
                  />
                }
                label="Xác nhận toggle favorite"
              />

              <Button size="small" onClick={() => navigate("/")}>
                Về trang chủ
              </Button>
            </Box>

            <Button
              type="submit"
              variant="contained"
              color="success"
              fullWidth
              sx={{ py: 1.2, mt: 1 }}
            >
              Toggle Favorite
            </Button>
          </Box>

          <Divider sx={{ my: 3 }}>preview</Divider>

          <TextField
            label="Xem payload (ẩn/hiện)"
            type={showPreview ? "text" : "password"}
            fullWidth
            margin="normal"
            value={JSON.stringify(payload, null, 2)}
            multiline
            rows={5}
            InputProps={{
              endAdornment: (
                <IconButton
                  onClick={() => setShowPreview(!showPreview)}
                  edge="end"
                >
                  {showPreview ? <VisibilityOff /> : <Visibility />}
                </IconButton>
              ),
              readOnly: true,
            }}
          />

          <Typography textAlign="center" variant="body2" color="text.secondary" mt={1}>
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

/** ✅ Export BOTH để bạn import kiểu nào cũng không làm app crash */
export default MealPlanToggleFavoritePage;
export { MealPlanToggleFavoritePage };
