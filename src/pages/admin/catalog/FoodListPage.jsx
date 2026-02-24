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
import foodApi from "../../../api/foodApi";

export function FoodListPage() {
    const navigate = useNavigate();
    const [foods, setFoods] = useState([]);
    const [loading, setLoading] = useState(false);
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(20);
    const [totalElements, setTotalElements] = useState(0);
    const [searchQuery, setSearchQuery] = useState("");

    // State cho Dialog xóa và Snackbar thông báo
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [itemToDelete, setItemToDelete] = useState(null);
    const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "success" });

    const fetchFoods = async () => {
        setLoading(true);
        try {
            const res = await foodApi.search({
                q: searchQuery,
                page,
                size: rowsPerPage,
            });

            const pageData = res.data.data;

            setFoods(pageData?.content || []);
            setTotalElements(pageData?.totalElements || 0);


        } catch (error) {
            console.error("Lỗi tải thông tin món ăn", error);
            setFoods([]);
            setTotalElements(0);
        } finally {
            setLoading(false);
        }
    };


    useEffect(() => {
        const delayDebounceFn = setTimeout(() => {
            fetchFoods();
        }, 500);

        return () => clearTimeout(delayDebounceFn);
    }, [page, rowsPerPage, searchQuery]);

    const confirmDelete = (id) => {
        setItemToDelete(id);
        setDeleteDialogOpen(true);
    };

    const handleDelete = async () => {
        try {
            await foodApi.adminDelete(itemToDelete);
            fetchFoods();
            setSnackbar({ open: true, message: "Xóa thành công!", severity: "success" });
        } catch (error) {
            console.error("Lỗi khi xóa món ăn", error);
            setSnackbar({ open: true, message: "Xóa thất bại!", severity: "error" });
        } finally {
            setDeleteDialogOpen(false);
            setItemToDelete(null);
        }
    };

    const handleCloseSnackbar = () => {
        setSnackbar({ ...snackbar, open: false });
    };

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    return (
        <Box>
            <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 3 }}>
                <Typography variant="h4" fontWeight={700}>Quản lý món ăn</Typography>
                <Button
                    variant="contained"
                    startIcon={<Add />}
                    onClick={() => navigate("/admin/foods/create")}
                    color="success"
                >
                    Thêm món ăn
                </Button>
            </Box>

            <Paper elevation={2} sx={{ mb: 3, p: 2 }}>
                <TextField
                    fullWidth
                    variant="outlined"
                    placeholder="Tìm kiếm món ăn..."
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
                                <TableCell fontWeight="bold">Tên món ăn</TableCell>
                                <TableCell fontWeight="bold">Thương hiệu</TableCell>
                                <TableCell fontWeight="bold">Khẩu phần</TableCell>
                                <TableCell align="right">Kcal</TableCell>
                                <TableCell align="right">Đạm (g)</TableCell>
                                <TableCell align="right">Béo (g)</TableCell>
                                <TableCell align="right">Tinh bột (g)</TableCell>
                                <TableCell align="right">Giá (VND)</TableCell>
                                <TableCell align="right">Trạng thái</TableCell>
                                <TableCell align="right">Hành động</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {loading ? (
                                <TableRow>
                                    <TableCell colSpan={10} align="center">Đang tải...</TableCell>
                                </TableRow>
                            ) : foods.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={10} align="center">Không tìm thấy dữ liệu</TableCell>
                                </TableRow>
                            ) : (
                                foods.map((food) => (
                                    <TableRow key={food.id} hover>
                                        <TableCell>{food.name}</TableCell>
                                        <TableCell>{food.brand}</TableCell>
                                        <TableCell>{food.servingSize}</TableCell>
                                        <TableCell align="right">{food.kcalPerServing}</TableCell>
                                        <TableCell align="right">{food.proteinG}g</TableCell>
                                        <TableCell align="right">{food.fatG}g</TableCell>
                                        <TableCell align="right">{food.carbG}g</TableCell>
                                        <TableCell align="right">{food.estimatedPriceVndPerServing?.toLocaleString()}</TableCell>
                                        <TableCell align="right">{food.active ? "Có" : "Không"}</TableCell>
                                        <TableCell align="right">
                                            <IconButton
                                                color="primary"
                                                onClick={() => navigate(`/admin/foods/${food.id}`)}
                                            >
                                                <Edit />
                                            </IconButton>
                                            <IconButton
                                                color="error"
                                                onClick={() => confirmDelete(food.id)}
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
                    onPageChange={handleChangePage}
                    onRowsPerPageChange={handleChangeRowsPerPage}
                />
            </Paper>

            <Dialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)}>
                <DialogTitle>Xác nhận xóa</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Bạn có chắc chắn muốn xóa món ăn này không? Thao tác này không thể hoàn tác.
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
