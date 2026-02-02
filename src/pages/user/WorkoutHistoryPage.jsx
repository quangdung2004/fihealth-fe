import { useEffect, useState } from "react";
import {
    Container,
    Typography,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Chip,
    CircularProgress,
    Alert,
    Button,
    Box
} from "@mui/material";
import { Visibility } from "@mui/icons-material";
import workoutApi from "../../api/workoutApi";
import { useNavigate } from "react-router-dom";
import moment from "moment";

export function WorkoutHistoryPage() {
    const navigate = useNavigate();

    const [history, setHistory] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchHistory();
    }, []);

    const fetchHistory = async () => {
        try {
            setLoading(true);
            setError(null);

            const res = await workoutApi.myHistory();

            // ✅ BACKEND TRẢ LIST
            setHistory(res.data?.data ?? []);
        } catch (err) {
            console.error("Failed to fetch history:", err);
            setError("Failed to load workout history.");
            setHistory([]);
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
                <Alert severity="error">{error}</Alert>
            </Container>
        );
    }

    // ===== MAIN UI =====
    return (
        <Container maxWidth="lg">
            <Typography variant="h4" gutterBottom sx={{ mb: 3 }}>
                Workout History
            </Typography>

            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Created Date</TableCell>
                            <TableCell>Plan Details</TableCell>
                            <TableCell>Status</TableCell>
                            <TableCell align="right">Actions</TableCell>
                        </TableRow>
                    </TableHead>

                    <TableBody>
                        {history.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={4} align="center">
                                    No workout history found.
                                </TableCell>
                            </TableRow>
                        ) : (
                            history.map((plan) => (
                                <TableRow key={plan.id}>
                                    <TableCell>
                                        {moment(plan.createdAt).format(
                                            "MMM DD, YYYY"
                                        )}
                                    </TableCell>

                                    <TableCell>
                                        {plan.daysPerWeek} days/week •{" "}
                                        {plan.totalWeeks} weeks
                                    </TableCell>

                                    <TableCell>
                                        <Chip
                                            label={plan.status}
                                            color={
                                                plan.status === "ACTIVE"
                                                    ? "success"
                                                    : "default"
                                            }
                                            size="small"
                                        />
                                    </TableCell>

                                    <TableCell align="right">
                                        <Button
                                            size="small"
                                            startIcon={<Visibility />}
                                            onClick={() =>
                                                navigate(
                                                    `/user/workouts/${plan.id}`
                                                )
                                            }
                                        >
                                            View
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </TableContainer>
        </Container>
    );
}

export default WorkoutHistoryPage;
