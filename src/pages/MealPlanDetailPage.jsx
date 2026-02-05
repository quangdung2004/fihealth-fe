import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  Box,
  Paper,
  Typography,
  Button,
  Divider,
  Alert,
  CircularProgress,
  Chip,
  Stack,
} from "@mui/material";
import { ArrowBack } from "@mui/icons-material";
import axiosClient from "../api/axiosClient";

function formatVnd(v) {
  if (v == null) return "0 ₫";
  return Number(v).toLocaleString("vi-VN") + " ₫";
}

export default function MealPlanDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [errMsg, setErrMsg] = useState("");

  useEffect(() => {
    let alive = true;

    async function load() {
      setLoading(true);
      setErrMsg("");

      try {
        const res = await axiosClient.get(`/meal-plans/ai/${id}`);
        const payload = res?.data?.data;

        if (!alive) return;

        if (!payload) {
          setErrMsg("Không tìm thấy meal plan.");
          return;
        }

        setData(payload);
      } catch (e) {
        if (!alive) return;

        const status = e?.response?.status;

        if (status === 404) {
          setErrMsg("Meal plan không tồn tại.");
        } else if (status === 403) {
          setErrMsg("Bạn không có quyền xem meal plan này.");
        } else {
          setErrMsg(
            e?.response?.data?.message ||
              e?.message ||
              "Không tải được meal plan."
          );
        }
      } finally {
        if (alive) setLoading(false);
      }
    }

    load();
    return () => (alive = false);
  }, [id]);

  return (
    <Box
      sx={{
        px: { xs: 2, md: 3 },
        py: { xs: 2, md: 3 },
        display: "flex",
        justifyContent: "center",
      }}
    >
      <Paper sx={{ width: "100%", maxWidth: 1000, p: 3, borderRadius: 3 }}>
        <Button
          startIcon={<ArrowBack />}
          onClick={() => navigate(-1)}
          sx={{ mb: 2, textTransform: "none" }}
        >
          Quay lại
        </Button>

        <Typography variant="h5" fontWeight={900}>
          Chi tiết Meal Plan
        </Typography>

        <Divider sx={{ my: 2 }} />

        {loading && (
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <CircularProgress size={20} />
            <Typography>Đang tải dữ liệu…</Typography>
          </Box>
        )}

        {!!errMsg && <Alert severity="warning">{errMsg}</Alert>}

        {!loading && data && (
          <>
            {/* HEADER */}
            <Stack direction="row" spacing={1} flexWrap="wrap" mb={2}>
              <Chip label={`Period: ${data.period}`} />
              <Chip label={`Total days: ${data.totalDays}`} />
              <Chip label={`Start: ${data.startDate}`} />
              <Chip label={`End: ${data.endDate}`} />
              <Chip label={`Cost: ${formatVnd(data.estimatedTotalCostVnd)}`} />
            </Stack>

            {/* DAYS */}
            {data.days?.map((day) => (
              <Paper key={day.dayIndex} sx={{ p: 2, mb: 2 }} variant="outlined">
                <Typography fontWeight={800}>
                  Day {day.dayIndex} - {day.date}
                </Typography>
                <Typography>
                  {day.totalKcal} kcal | {formatVnd(day.costVnd)}
                </Typography>

                {/* MEALS */}
                {day.meals?.map((meal) => (
                  <Box key={meal.mealOrder} sx={{ mt: 2, pl: 2 }}>
                    <Typography fontWeight={700}>
                      {meal.mealOrder}. {meal.name} ({meal.mealType})
                    </Typography>
                    <Typography variant="body2">
                      {meal.kcal} kcal | {formatVnd(meal.costVnd)}
                    </Typography>

                    {/* ITEMS */}
                    {meal.items?.map((item, idx) => (
                      <Box key={idx} sx={{ mt: 1, pl: 2 }}>
                        <Typography>
                          • {item.recipeName || "Món (không tên)"}
                        </Typography>
                        <Typography variant="body2">
                          {item.amount} | {item.kcal} kcal |{" "}
                          {formatVnd(item.costVnd)}
                        </Typography>

                        {/* INGREDIENTS */}
                        {item.ingredients?.map((ing, i) => (
                          <Typography key={i} variant="caption" display="block">
                            - {ing.foodItemName}: {ing.amount}
                          </Typography>
                        ))}
                      </Box>
                    ))}
                  </Box>
                ))}
              </Paper>
            ))}
          </>
        )}
      </Paper>
    </Box>
  );
}
