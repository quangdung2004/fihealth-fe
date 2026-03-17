import { useEffect, useState } from "react";
import {
  Box,
  Card,
  CardContent,
  Typography,
  CircularProgress,
  Alert,
  Stack,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Checkbox,
  Chip,
  Snackbar,
  List
} from "@mui/material";
import {
  ExpandMore,
  AccessTime,
  LocalFireDepartment,
  CheckCircle
} from "@mui/icons-material";
import workoutApi from "../../api/workoutApi";
import { useNavigate } from "react-router-dom";

export const CurrentPlanPage = () => {
  const navigate = useNavigate();
  const [plan, setPlan] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "info" });

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

  const handleToggleComplete = async (itemId, currentStatus) => {
    try {
      await workoutApi.toggleItemCompletion(itemId);

      // Try to refresh plan data
      try {
        const response = await workoutApi.myCurrent();
        const updatedPlan = response.data.data;

        setPlan(updatedPlan);

        // Check if plan is now completed
        if (updatedPlan.status === "COMPLETED") {
          setSnackbar({
            open: true,
            message: "🎉 Chúc mừng! Bạn đã hoàn thành toàn bộ workout plan!",
            severity: "success"
          });

          // Set plan to null to show "no active plan" message
          setTimeout(() => {
            setPlan(null);
          }, 2000);
        } else {
          setSnackbar({
            open: true,
            message: currentStatus ? "Đã bỏ đánh dấu hoàn thành" : "Đã đánh dấu hoàn thành!",
            severity: "success"
          });
        }
      } catch (refreshErr) {
        // If 404, it means the plan was moved to COMPLETED (no active plan)
        if (refreshErr.response?.status === 404) {
          setSnackbar({
            open: true,
            message: "🎉 Chúc mừng! Bạn đã hoàn thành toàn bộ workout plan!",
            severity: "success"
          });

          // Set plan to null to show "no active plan" message
          setTimeout(() => {
            setPlan(null);
          }, 2000);
        } else {
          // Other errors during refresh
          throw refreshErr;
        }
      }
    } catch (err) {
      console.error("Toggle completion error:", err);
      setSnackbar({
        open: true,
        message: "Không thể cập nhật trạng thái. Vui lòng thử lại.",
        severity: "error"
      });
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

      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Stack spacing={1}>
            <Typography>
              <b>Days / week:</b> {plan.daysPerWeek}
            </Typography>

            <Typography>
              <b>Total weeks:</b> {plan.totalWeeks}
            </Typography>

            <Stack direction="row" spacing={1} alignItems="center">
              <Typography>
                <b>Status:</b>
              </Typography>
              <Chip
                label={plan.status}
                color={plan.status === "ACTIVE" ? "success" : "default"}
                size="small"
              />
            </Stack>
          </Stack>
        </CardContent>
      </Card>

      {/* WORKOUT DAYS - ACCORDION */}
      {plan.days && plan.days.length > 0 ? (
        <Box>
          {plan.days.map((day, index) => (
            <Accordion
              key={day.id || index}
              defaultExpanded={index === 0}
            >
              <AccordionSummary expandIcon={<ExpandMore />}>
                <Stack
                  direction="row"
                  alignItems="center"
                  justifyContent="space-between"
                  width="100%"
                  spacing={2}
                  sx={{ pr: 2 }}
                >
                  <Typography variant="h6">
                    Day {day.dayIndex}: {day.focus}
                  </Typography>

                  <Stack direction="row" spacing={1}>
                    <Chip
                      icon={<AccessTime />}
                      label={`${day.totalDurationMin} min`}
                      size="small"
                      variant="outlined"
                    />
                    <Chip
                      icon={<LocalFireDepartment />}
                      label={`${day.caloriesEstimate} kcal`}
                      size="small"
                      variant="outlined"
                    />
                  </Stack>
                </Stack>
              </AccordionSummary>

              <AccordionDetails>
                <List>
                  {day.items?.map((item, itemIndex) => (
                    <Card
                      key={item.id || itemIndex}
                      variant="outlined"
                      sx={{
                        mb: 1,
                        bgcolor: item.completed ? "success.50" : "transparent",
                        borderColor: item.completed ? "success.main" : "divider"
                      }}
                    >
                      <CardContent
                        sx={{
                          py: 1.5,
                          "&:last-child": { pb: 1.5 }
                        }}
                      >
                        <Stack
                          direction="row"
                          spacing={2}
                          alignItems="center"
                        >
                          {/* CHECKBOX */}
                          <Checkbox
                            checked={item.completed || false}
                            onChange={() => handleToggleComplete(item.id, item.completed)}
                            color="success"
                            icon={<CheckCircle sx={{ opacity: 0.3 }} />}
                            checkedIcon={<CheckCircle />}
                          />

                          {/* ORDER NUMBER */}
                          <Typography
                            variant="h6"
                            color={item.completed ? "success.main" : "primary.main"}
                            width={32}
                          >
                            {itemIndex + 1}
                          </Typography>

                          {/* EXERCISE INFO */}
                          <Box flexGrow={1}>
                            <Typography
                              variant="subtitle1"
                              fontWeight="bold"
                              sx={{
                                textDecoration: item.completed ? "line-through" : "none",
                                color: item.completed ? "text.secondary" : "text.primary"
                              }}
                            >
                              {item.workoutCatalog?.name}
                            </Typography>
                            <Typography
                              variant="body2"
                              color="text.secondary"
                            >
                              {item.workoutCatalog?.description}
                            </Typography>
                          </Box>

                          {/* SETS/REPS */}
                          <Box textAlign="right">
                            {item.sets && item.reps ? (
                              <Typography
                                variant="body2"
                                fontWeight="bold"
                              >
                                {item.sets} sets × {item.reps} reps
                              </Typography>
                            ) : (
                              <Typography
                                variant="body2"
                                fontWeight="bold"
                              >
                                {item.durationSec} sec
                              </Typography>
                            )}

                            {item.restSec > 0 && (
                              <Typography
                                variant="caption"
                                display="block"
                                color="text.secondary"
                              >
                                Rest: {item.restSec}s
                              </Typography>
                            )}
                          </Box>
                        </Stack>
                      </CardContent>
                    </Card>
                  ))}
                </List>
              </AccordionDetails>
            </Accordion>
          ))}
        </Box>
      ) : (
        <Typography mt={2} color="text.secondary">
          Chưa có workout day chi tiết.
        </Typography>
      )}

      {/* SNACKBAR FOR NOTIFICATIONS */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert
          onClose={() => setSnackbar({ ...snackbar, open: false })}
          severity={snackbar.severity}
          sx={{ width: "100%" }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default CurrentPlanPage;
