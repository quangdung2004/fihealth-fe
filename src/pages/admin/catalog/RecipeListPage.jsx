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

export function RecipeListPage() {
    const navigate = useNavigate();
    const [recipes, setRecipes] = useState([]);
    const [loading, setLoading] = useState(false);
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(20);
    const [totalElements, setTotalElements] = useState(0);
    const [searchQuery, setSearchQuery] = useState("");

    const fetchRecipes = async () => {
        setLoading(true);
        try {
            const res = await axiosClient.get("/admin/recipes", {
            params: {
                q: searchQuery,
                page,
                size: rowsPerPage,
            },
            });

            const pageData = res.data.data;

            setRecipes(pageData?.content || []);
            setTotalElements(pageData?.totalElements || 0);


        } catch (error) {
            console.error("Failed to fetch recipes", error);
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

    const handleDelete = async (id) => {
        if (window.confirm("Are you sure you want to delete this recipe?")) {
            try {
                await recipeService.deleteRecipe(id);
                fetchRecipes();
            } catch (error) {
                console.error("Failed to delete recipe", error);
                alert("Failed to delete recipe");
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
                <Typography variant="h4" fontWeight={700}>Recipes</Typography>
                <Button
                    variant="contained"
                    startIcon={<Add />}
                    onClick={() => navigate("/admin/recipes/create")}
                    color="success"
                >
                    Add Recipe
                </Button>
            </Box>

            <Paper elevation={2} sx={{ mb: 3, p: 2 }}>
                <TextField
                    fullWidth
                    variant="outlined"
                    placeholder="Search recipes..."
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
                                <TableCell align="right">Kcal</TableCell>
                                <TableCell align="right">Protein</TableCell>
                                <TableCell align="right">Fat</TableCell>
                                <TableCell align="right">Carb</TableCell>
                                <TableCell align="right">Cost (VND)</TableCell>
                                <TableCell align="right">Active</TableCell>
                                <TableCell align="right">Actions</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {loading ? (
                                <TableRow>
                                    <TableCell colSpan={8} align="center">Loading...</TableCell>
                                </TableRow>
                            ) : recipes.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={8} align="center">No recipes found</TableCell>
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
                                        <TableCell align="right">{recipe.active ? "Yes" : "No"}</TableCell>
                                        <TableCell align="right">
                                            <IconButton
                                                color="primary"
                                                onClick={() => navigate(`/admin/recipes/${recipe.id}`)}
                                            >
                                                <Edit />
                                            </IconButton>
                                            <IconButton
                                                color="error"
                                                onClick={() => handleDelete(recipe.id)}
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
