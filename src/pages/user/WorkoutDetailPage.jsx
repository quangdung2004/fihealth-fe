import { useEffect, useState } from "react";
import {
    Box,
    Typography,
    Paper,
    Chip,
    Card,
    CardContent,
    CircularProgress,
    Accordion,
    AccordionSummary,
    AccordionDetails,
    List,
    Container,
    Alert,
    Button,
    Stack
} from "@mui/material";
import {
    ExpandMore,
    AccessTime,
    LocalFireDepartment,
    ArrowBack
} from "@mui/icons-material";
import workoutApi from "../../api/workoutApi";
import { useParams, useNavigate } from "react-router-dom";

export function WorkoutDetailPage() {
    const { id } = useParams();
    const navigate = useNavigate();

    const [plan, setPlan] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchPlanDetail();
    }, [id]);

    const fetchPlanDetail = async () => {
        try {
            setLoading(true);
            setError(null);

            const response = await workoutApi.getDetail(id);

            // ✅ FIX: lấy data đúng từ ApiResponse
            setPlan(response.data.data);
        } catch (err) {
            console.error("Failed to fetch plan detail:", err);
            setError("Failed to load workout plan details.");
        } finally {
            setLoading(false);
        }
    };

    // ===== STATES =====
    if (loading) {
        return (
            <Box display="flex" justifyContent="center" mt={5}>
                <CircularProgress />
            </Box>
        );
    }

    if (error) {
        return (
            <Container maxWidth="lg" sx={{ mt: 2 }}>
                <Button
                    startIcon={<ArrowBack />}
                    onClick={() => navigate(-1)}
                    sx={{ mb: 2 }}
                >
                    Back
                </Button>
                <Alert severity="error">{error}</Alert>
            </Container>
        );
    }

    if (!plan) return null;

    // ===== MAIN UI =====
    return (
        <Container maxWidth="lg">
            <Button
                startIcon={<ArrowBack />}
                onClick={() => navigate(-1)}
                sx={{ mb: 2 }}
            >
                Back
            </Button>

            {/* HEADER */}
            <Paper sx={{ p: 3, mb: 3 }}>
                <Stack
                    direction={{ xs: "column", md: "row" }}
                    spacing={2}
                    alignItems={{ md: "center" }}
                    justifyContent="space-between"
                >
                    <Box>
                        <Typography variant="h4" gutterBottom>
                            Workout Plan Details
                        </Typography>
                        <Typography variant="body1" color="text.secondary">
                            {plan.daysPerWeek} days/week • {plan.totalWeeks} weeks
                        </Typography>
                    </Box>

                    <Chip
                        label={plan.status}
                        color={plan.status === "ACTIVE" ? "success" : "default"}
                    />
                </Stack>
            </Paper>

            {/* DAYS */}
            <Box>
                {plan.days?.map((day) => (
                    <Accordion
                        key={day.id}
                        defaultExpanded={day.dayIndex === 1}
                    >
                        <AccordionSummary expandIcon={<ExpandMore />}>
                            <Stack
                                direction="row"
                                alignItems="center"
                                justifyContent="space-between"
                                width="100%"
                                spacing={2}
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
                                {day.items?.map((item, index) => (
                                    <Card
                                        key={item.id || index}
                                        variant="outlined"
                                        sx={{ mb: 1 }}
                                    >
                                        <CardContent
                                            sx={{
                                                py: 1,
                                                "&:last-child": { pb: 1 }
                                            }}
                                        >
                                            <Stack
                                                direction="row"
                                                spacing={2}
                                                alignItems="center"
                                            >
                                                <Typography
                                                    variant="h6"
                                                    color="primary.main"
                                                    width={32}
                                                >
                                                    {index + 1}
                                                </Typography>

                                                <Box flexGrow={1}>
                                                    <Typography
                                                        variant="subtitle1"
                                                        fontWeight="bold"
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

                                                <Box textAlign="right">
                                                    {item.sets && item.reps ? (
                                                        <Typography
                                                            variant="body2"
                                                            fontWeight="bold"
                                                        >
                                                            {item.sets} sets ×{" "}
                                                            {item.reps} reps
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
        </Container>
    );
}

export default WorkoutDetailPage;
