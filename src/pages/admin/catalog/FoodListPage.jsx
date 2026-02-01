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
import axiosClient from "../../../api/axiosClient";

export function FoodListPage() {
    const navigate = useNavigate();
    const [foods, setFoods] = useState([]);
    const [loading, setLoading] = useState(false);
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(20);
    const [totalElements, setTotalElements] = useState(0);
    const [searchQuery, setSearchQuery] = useState("");

    const fetchFoods = async () => {
        setLoading(true);
        try {
            const res = await axiosClient.get("/foods/search", {
            params: {
                q: searchQuery,
                page,
                size: rowsPerPage,
            },
            });
            
            const pageData = res.data.data;

            setFoods(pageData?.content || []);
            setTotalElements(pageData?.totalElements || 0);

            
        } catch (error) {
            console.error("Failed to fetch foods", error);
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

    const handleDelete = async (id) => {
        if (window.confirm("Are you sure you want to delete this food item?")) {
            try {
                await foodService.deleteFood(id);
                fetchFoods();
            } catch (error) {
                console.error("Failed to delete food", error);
                alert("Failed to delete food");
            }
        }
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
                <Typography variant="h4" fontWeight={700}>Foods</Typography>
                <Button
                    variant="contained"
                    startIcon={<Add />}
                    onClick={() => navigate("/admin/foods/create")}
                    color="success"
                >
                    Add Food
                </Button>
            </Box>

            <Paper elevation={2} sx={{ mb: 3, p: 2 }}>
                <TextField
                    fullWidth
                    variant="outlined"
                    placeholder="Search foods..."
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
                                <TableCell fontWeight="bold">Name</TableCell>
                                <TableCell fontWeight="bold">Brand</TableCell>
                                <TableCell fontWeight="bold">Serving Size</TableCell>
                                <TableCell align="right">Kcal</TableCell>
                                <TableCell align="right">Protein</TableCell>
                                <TableCell align="right">Fat</TableCell>
                                <TableCell align="right">Carb</TableCell>
                                <TableCell align="right">Price (VND)</TableCell>
                                <TableCell align="right">Actions</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {loading ? (
                                <TableRow>
                                    <TableCell colSpan={9} align="center">Loading...</TableCell>
                                </TableRow>
                            ) : foods.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={9} align="center">No foods found</TableCell>
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
                                        <TableCell align="right">
                                            <IconButton
                                                color="primary"
                                                onClick={() => navigate(`/admin/foods/${food.id}`)}
                                            >
                                                <Edit />
                                            </IconButton>
                                            <IconButton
                                                color="error"
                                                onClick={() => handleDelete(food.id)}
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
        </Box>
    );
}
