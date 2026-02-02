import { useState, useEffect } from "react";
import {
    Box,
    Button,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Typography,
    IconButton,
    TablePagination,
    TextField,
    InputAdornment
} from "@mui/material";
import { Edit, Delete, Add, Search } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import workoutApi from "../../../api/workoutApi";

export function WorkoutListPage() {
    const navigate = useNavigate();

    const [workouts, setWorkouts] = useState([]);
    const [loading, setLoading] = useState(false);
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(20);
    const [totalElements, setTotalElements] = useState(0);
    const [searchQuery, setSearchQuery] = useState("");

    const fetchWorkouts = async () => {
        setLoading(true);
        try {
            const res = await workoutApi.search({
                q: searchQuery,
                page,
                size: rowsPerPage,
            });

            const pageData = res.data.data;

            setWorkouts(pageData?.content || []);
            setTotalElements(pageData?.totalElements || 0);
        } catch (error) {
            console.error("Failed to fetch workouts", error);
            setWorkouts([]);
            setTotalElements(0);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        const delayDebounceFn = setTimeout(() => {
            fetchWorkouts();
        }, 500);

        return () => clearTimeout(delayDebounceFn);
    }, [page, rowsPerPage, searchQuery]);

    const handleDelete = async (id) => {
        if (window.confirm("Are you sure you want to delete this workout?")) {
            try {
                await workoutApi.adminDelete(id);
                fetchWorkouts();
            } catch (error) {
                console.error("Failed to delete workout", error);
                alert("Failed to delete workout");
            }
        }
    };

    return (
        <Box>
            <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 3 }}>
                <Typography variant="h4" fontWeight={700}>
                    Workouts
                </Typography>
                <Button
                    variant="contained"
                    startIcon={<Add />}
                    color="success"
                    onClick={() => navigate("/admin/workouts/create")}
                >
                    Add Workout
                </Button>
            </Box>

            <Paper elevation={2} sx={{ mb: 3, p: 2 }}>
                <TextField
                    fullWidth
                    placeholder="Search workouts..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    InputProps={{
                        startAdornment: (
                            <InputAdornment position="start">
                                <Search />
                            </InputAdornment>
                        ),
                    }}
                />
            </Paper>

            <Paper elevation={2}>
                <TableContainer>
                    <Table>
                        <TableHead sx={{ bgcolor: "grey.100" }}>
                            <TableRow>
                                <TableCell>Name</TableCell>
                                <TableCell>Level</TableCell>
                                <TableCell>Duration (min)</TableCell>
                                <TableCell align="right">Calories</TableCell>
                                <TableCell align="right">Active</TableCell>
                                <TableCell align="right">Actions</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {loading ? (
                                <TableRow>
                                    <TableCell colSpan={6} align="center">
                                        Loading...
                                    </TableCell>
                                </TableRow>
                            ) : workouts.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={6} align="center">
                                        No workouts found
                                    </TableCell>
                                </TableRow>
                            ) : (
                                workouts.map((workout) => (
                                    <TableRow key={workout.id} hover>
                                        <TableCell>{workout.name}</TableCell>
                                        <TableCell>{workout.level}</TableCell>
                                        <TableCell>{workout.duration}</TableCell>
                                        <TableCell align="right">
                                            {workout.caloriesBurned}
                                        </TableCell>
                                        <TableCell align="right">
                                            {workout.active ? "Yes" : "No"}
                                        </TableCell>
                                        <TableCell align="right">
                                            <IconButton
                                                color="primary"
                                                onClick={() =>
                                                    navigate(`/admin/workouts/${workout.id}`)
                                                }
                                            >
                                                <Edit />
                                            </IconButton>
                                            <IconButton
                                                color="error"
                                                onClick={() => handleDelete(workout.id)}
                                            >
                                                <Delete />
                                            </IconButton>
                                        </TableCell>
                                    </TableRow>
                                ))
                            )}
                        </TableBody>
                    </Table>
                </TableContainer>

                <TablePagination
                    rowsPerPageOptions={[10, 20, 50]}
                    component="div"
                    count={totalElements}
                    rowsPerPage={rowsPerPage}
                    page={page}
                    onPageChange={(e, newPage) => setPage(newPage)}
                    onRowsPerPageChange={(e) => {
                        setRowsPerPage(parseInt(e.target.value, 10));
                        setPage(0);
                    }}
                />
            </Paper>
        </Box>
    );
}
