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
    InputAdornment,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogContentText,
    DialogActions,
    Snackbar,
    Alert
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

    // State cho Dialog xóa và Snackbar
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [itemToDelete, setItemToDelete] = useState(null);
    const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "success" });

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
            console.error("Lỗi tải danh sách bài tập", error);
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

    const confirmDelete = (id) => {
        setItemToDelete(id);
        setDeleteDialogOpen(true);
    };

    const handleDelete = async () => {
        try {
            await workoutApi.adminDelete(itemToDelete);
            fetchWorkouts();
            setSnackbar({ open: true, message: "Xóa thành công!", severity: "success" });
        } catch (error) {
            console.error("Lỗi xóa bài tập", error);
            setSnackbar({ open: true, message: "Xóa thất bại!", severity: "error" });
        } finally {
            setDeleteDialogOpen(false);
            setItemToDelete(null);
        }
    };

    const handleCloseSnackbar = () => {
        setSnackbar({ ...snackbar, open: false });
    };

    return (
        <Box>
            <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 3 }}>
                <Typography variant="h4" fontWeight={700}>
                    Quản lý bài tập
                </Typography>
                <Button
                    variant="contained"
                    startIcon={<Add />}
                    color="success"
                    onClick={() => navigate("/admin/workouts/create")}
                >
                    Thêm bài tập
                </Button>
            </Box>

            <Paper elevation={2} sx={{ mb: 3, p: 2 }}>
                <TextField
                    fullWidth
                    placeholder="Tìm kiếm bài tập..."
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
                                <TableCell fontWeight="bold">Tên bài tập</TableCell>
                                <TableCell fontWeight="bold">Độ khó</TableCell>
                                <TableCell fontWeight="bold">Thời lượng (phút)</TableCell>
                                <TableCell align="right" fontWeight="bold">Calories</TableCell>
                                <TableCell align="right" fontWeight="bold">Trạng thái</TableCell>
                                <TableCell align="right" fontWeight="bold">Hành động</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {loading ? (
                                <TableRow>
                                    <TableCell colSpan={6} align="center">
                                        Đang tải...
                                    </TableCell>
                                </TableRow>
                            ) : workouts.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={6} align="center">
                                        Không tìm thấy bài tập nào
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
                                            {workout.active ? "Có" : "Không"}
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
                                                onClick={() => confirmDelete(workout.id)}
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

            <Dialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)}>
                <DialogTitle>Xác nhận xóa</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Bạn có chắc chắn muốn xóa bài tập này không? Thao tác này không thể hoàn tác.
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setDeleteDialogOpen(false)} color="inherit">Hủy</Button>
                    <Button onClick={handleDelete} color="error" variant="contained">Xóa</Button>
                </DialogActions>
            </Dialog>

            <Snackbar
                open={snackbar.open}
                autoHideDuration={4000}
                onClose={handleCloseSnackbar}
                anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
            >
                <Alert onClose={handleCloseSnackbar} severity={snackbar.severity} sx={{ width: '100%' }}>
                    {snackbar.message}
                </Alert>
            </Snackbar>
        </Box>
    );
}
