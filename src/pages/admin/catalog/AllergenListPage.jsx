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

export function AllergenListPage() {
    const navigate = useNavigate();
    const [allergens, setAllergens] = useState([]);
    const [loading, setLoading] = useState(false);
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(20);
    const [totalElements, setTotalElements] = useState(0);
    const [searchQuery, setSearchQuery] = useState("");

    const fetchAllergens = async () => {
        setLoading(true);
        try {
            const res = await axiosClient.get("/admin/allergens", {
                params: {
                    q: searchQuery,
                    page,
                    size: rowsPerPage,
                },
            });

            const pageData = res.data.data;

            setAllergens(pageData?.content || []);
            setTotalElements(pageData?.totalElements || 0);
        } catch (error) {
            console.error("Failed to fetch allergens", error);
            setAllergens([]);
            setTotalElements(0);
        } finally {
            setLoading(false);
        }
    };


    useEffect(() => {
        const delayDebounceFn = setTimeout(() => {
            fetchAllergens();
        }, 500);

        return () => clearTimeout(delayDebounceFn);
    }, [page, rowsPerPage, searchQuery]);

    const handleDelete = async (id) => {
        if (window.confirm("Are you sure you want to delete this allergen?")) {
            try {
                await axiosClient.delete(`/admin/allergens/${id}`);
                fetchAllergens();
            } catch (error) {
                console.error("Failed to delete allergen", error);
                alert("Failed to delete allergen");
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
                <Typography variant="h4" fontWeight={700}>Allergens</Typography>
                <Button
                    variant="contained"
                    startIcon={<Add />}
                    onClick={() => navigate("/admin/allergens/create")}
                    color="success"
                >
                    Add Allergen
                </Button>
            </Box>

            <Paper elevation={2} sx={{ mb: 3, p: 2 }}>
                <TextField
                    fullWidth
                    variant="outlined"
                    placeholder="Search allergens..."
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
                                <TableCell fontWeight="bold">Code</TableCell>
                                <TableCell fontWeight="bold">Name</TableCell>
                                <TableCell align="right">Actions</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {loading ? (
                                <TableRow>
                                    <TableCell colSpan={3} align="center">Loading...</TableCell>
                                </TableRow>
                            ) : allergens.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={3} align="center">No allergens found</TableCell>
                                </TableRow>
                            ) : (
                                allergens.map((allergen) => (
                                    <TableRow key={allergen.id} hover>
                                        <TableCell>{allergen.code}</TableCell>
                                        <TableCell>{allergen.name}</TableCell>
                                        <TableCell align="right">
                                            <IconButton
                                                color="primary"
                                                onClick={() => navigate(`/admin/allergens/${allergen.id}`)}
                                            >
                                                <Edit />
                                            </IconButton>
                                            <IconButton
                                                color="error"
                                                onClick={() => handleDelete(allergen.id)}
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
