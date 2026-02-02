import { useEffect, useState } from "react";
import {
  Box,
  Card,
  CardContent,
  Typography,
  CircularProgress,
  Alert,
  Stack
} from "@mui/material";
import workoutApi from "../../api/workoutApi";

export const CurrentPlanPage = () => {
  const [plan, setPlan] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchCurrentPlan();
  }, []);

  const fetchCurrentPlan = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await workoutApi.myCurrent();

      setPlan(response.data.data); 
    } catch (err) {
      if (err.response?.status === 404) {
        // Chưa có plan ACTIVE
        setPlan(null);
      } else {
        setError("Không thể tải workout plan hiện tại.");
        console.error("Fetch current plan error:", err);
      }
    } finally {
      setLoading(false);
    }
  };

  // ===== RENDER STATES =====

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" mt={5}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box mt={4}>
        <Alert severity="error">{error}</Alert>
      </Box>
    );
  }

  if (!plan) {
    return (
      <Box mt={4}>
        <Alert severity="info">
          Bạn chưa có workout plan nào đang hoạt động.
        </Alert>
      </Box>
    );
  }

  // ===== MAIN UI =====

  return (
    <Box>
      <Typography variant="h5" fontWeight={600} mb={2}>
        Current Workout Plan
      </Typography>

      <Card>
        <CardContent>
          <Stack spacing={1}>
            <Typography>
              <b>Days / week:</b> {plan.daysPerWeek}
            </Typography>

            <Typography>
              <b>Total weeks:</b> {plan.totalWeeks}
            </Typography>

            <Typography>
              <b>Status:</b> {plan.status}
            </Typography>

            {plan.days && plan.days.length > 0 ? (
              <Box mt={2}>
                <Typography fontWeight={600} mb={1}>
                  Workout Days
                </Typography>

                <Stack spacing={1}>
                  {plan.days.map((day, index) => (
                    <Card key={day.id || index} variant="outlined">
                      <CardContent>
                        <Typography fontWeight={600}>
                          Day {day.dayIndex}
                        </Typography>

                        <Typography variant="body2">
                          Focus: {day.focus}
                        </Typography>

                        <Typography variant="body2">
                          Exercises: {day.exercises?.length || 0}
                        </Typography>
                      </CardContent>
                    </Card>
                  ))}
                </Stack>
              </Box>
            ) : (
              <Typography mt={2} color="text.secondary">
                Chưa có workout day chi tiết.
              </Typography>
            )}
          </Stack>
        </CardContent>
      </Card>
    </Box>
  );
};

export default CurrentPlanPage;
