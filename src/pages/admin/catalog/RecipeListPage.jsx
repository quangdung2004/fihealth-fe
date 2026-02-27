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
import axiosClient from "../../../api/axiosClient";
import recipeApi from "../../../api/recipeApi";

export function RecipeListPage() {
    const navigate = useNavigate();
    const [recipes, setRecipes] = useState([]);
    const [loading, setLoading] = useState(false);
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(20);
    const [totalElements, setTotalElements] = useState(0);
    const [searchQuery, setSearchQuery] = useState("");

    // State cho Dialog xóa và Snackbar
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [itemToDelete, setItemToDelete] = useState(null);
    const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "success" });

    const fetchRecipes = async () => {
        setLoading(true);
        try {
            const res = await recipeApi.getAll({
                q: searchQuery,
                page,
                size: rowsPerPage,
            });

            const pageData = res.data.data;

            setRecipes(pageData?.content || []);
            setTotalElements(pageData?.totalElements || 0);

        } catch (error) {
            console.error("Lỗi tải danh sách công thức", error);
            setRecipes([]);
            setTotalElements(0);
        } finally {
            setLoading(false);
        }
    };


    useEffect(() => {
        const delayDebounceFn = setTimeout(() => {
            fetchRecipes();
        }, 500);

        return () => clearTimeout(delayDebounceFn);
    }, [page, rowsPerPage, searchQuery]);

    const confirmDelete = (id) => {
        setItemToDelete(id);
        setDeleteDialogOpen(true);
    };

    const handleDelete = async () => {
        try {
            await recipeApi.delete(itemToDelete);
            fetchRecipes();
            setSnackbar({ open: true, message: "Xóa thành công!", severity: "success" });
        } catch (error) {
            console.error("Lỗi khi xóa công thức", error);
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
                <Typography variant="h4" fontWeight={700}>Quản lý công thức</Typography>
                <Button
                    variant="contained"
                    startIcon={<Add />}
                    onClick={() => navigate("/admin/recipes/create")}
                    color="success"
                >
                    Thêm công thức
                </Button>
            </Box>

            <Paper elevation={2} sx={{ mb: 3, p: 2 }}>
                <TextField
                    fullWidth
                    variant="outlined"
                    placeholder="Tìm kiếm công thức..."
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
                                <TableCell fontWeight="bold">Tên công thức</TableCell>
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
                                    <TableCell colSpan={8} align="center">Đang tải...</TableCell>
                                </TableRow>
                            ) : recipes.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={8} align="center">Không tìm thấy dữ liệu</TableCell>
                                </TableRow>
                            ) : (
                                recipes.map((recipe) => (
                                    <TableRow key={recipe.id} hover>
                                        <TableCell>{recipe.name}</TableCell>
                                        <TableCell align="right">{recipe.kcal}</TableCell>
                                        <TableCell align="right">{recipe.proteinG}g</TableCell>
                                        <TableCell align="right">{recipe.fatG}g</TableCell>
                                        <TableCell align="right">{recipe.carbG}g</TableCell>
                                        <TableCell align="right">{recipe.estimatedCostVnd?.toLocaleString()}</TableCell>
                                        <TableCell align="right">{recipe.active ? "Có" : "Không"}</TableCell>
                                        <TableCell align="right">
                                            <IconButton
                                                color="primary"
                                                onClick={() => navigate(`/admin/recipes/${recipe.id}`)}
                                            >
                                                <Edit />
                                            </IconButton>
                                            <IconButton
                                                color="error"
                                                onClick={() => confirmDelete(recipe.id)}
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
                        Bạn có chắc chắn muốn xóa công thức này không? Thao tác này không thể hoàn tác.
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
