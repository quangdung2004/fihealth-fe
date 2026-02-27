import { useState, useEffect } from "react";
import {
    Box,
    Button,
    Paper,
    TextField,
    Typography,
    Grid,
    FormControlLabel,
    Switch,
    Autocomplete,
    IconButton,
    Divider,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    List,
    ListItem,
    ListItemText,
    CircularProgress,
    InputAdornment,
    Snackbar,
    Alert
} from "@mui/material";
import { Add, Delete, Search } from "@mui/icons-material";
import { useNavigate, useParams } from "react-router-dom";
import axiosClient from "../../../api/axiosClient";
import recipeApi from "../../../api/recipeApi";
import foodApi from "../../../api/foodApi";

export function RecipeFormPage() {
    const navigate = useNavigate();
    const { id } = useParams();
    const isEdit = !!id;

    const [formData, setFormData] = useState({
        name: "",
        description: "",
        kcal: "",
        proteinG: "",
        fatG: "",
        carbG: "",
        estimatedCostVnd: "",
        tags: "",
        active: true,
        ingredients: []
    });

    const [foodOptions, setFoodOptions] = useState([]);
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState({});

    // Dialog Search Food State
    const [searchDialogIndex, setSearchDialogIndex] = useState(null);
    const [searchDialogQuery, setSearchDialogQuery] = useState("");
    const [searchDialogResults, setSearchDialogResults] = useState([]);
    const [isSearching, setIsSearching] = useState(false);

    // Snackbar State
    const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "success" });

    useEffect(() => {
        fetchFoodOptions("");
        if (isEdit) {
            fetchRecipe();
        }
    }, [id]);

    const fetchFoodOptions = async (query) => {
        setIsSearching(true);
        try {
            const res = await foodApi.search({ q: query, size: 20 });
            const pageData = res.data.data;
            setSearchDialogResults(pageData?.content || []);
        } catch (error) {
            console.error("Lỗi tìm kiếm món ăn", error);
            setSearchDialogResults([]);
        } finally {
            setIsSearching(false);
        }
    };

    useEffect(() => {
        const delayDebounceFn = setTimeout(() => {
            if (searchDialogIndex !== null) {
                fetchFoodOptions(searchDialogQuery);
            }
        }, 500);
        return () => clearTimeout(delayDebounceFn);
    }, [searchDialogQuery, searchDialogIndex]);

    const fetchRecipe = async () => {
        setLoading(true);
        try {
            const res = await recipeApi.getById(id);
            const data = res.data.data;

            const ingredientsForForm = (data.ingredients || []).map((ing) => ({
                foodItemId: ing.foodItem.id,
                amount: ing.amount,
                tempFood: ing.foodItem
            }));

            setFormData({
                name: data.name || "",
                description: data.description || "",
                kcal: data.kcal ?? "",
                proteinG: data.proteinG ?? "",
                fatG: data.fatG ?? "",
                carbG: data.carbG ?? "",
                estimatedCostVnd: data.estimatedCostVnd ?? "",
                tags: data.tags || "",
                active: data.active ?? true,
                ingredients: ingredientsForForm
            });
        } catch (error) {
            console.error("Failed to fetch recipe", error);
            navigate("/admin/recipes");
        } finally {
            setLoading(false);
        }
    };

    const validate = () => {
        const temp = {};

        if (!formData.name) temp.name = "Tên là bắt buộc";
        if (formData.kcal === "" || formData.kcal < 0) temp.kcal = "Kcal không hợp lệ";
        if (formData.proteinG === "" || formData.proteinG < 0) temp.proteinG = "Protein không hợp lệ";
        if (formData.fatG === "" || formData.fatG < 0) temp.fatG = "Chất béo không hợp lệ";
        if (formData.carbG === "" || formData.carbG < 0) temp.carbG = "Carb không hợp lệ";
        if (formData.estimatedCostVnd === "" || formData.estimatedCostVnd < 0) {
            temp.estimatedCostVnd = "Giá tiền không hợp lệ";
        }

        formData.ingredients.forEach((ing, index) => {
            if (!ing.foodItemId) temp[`ing_${index}_food`] = "Cần chọn món ăn";
            if (!ing.amount) temp[`ing_${index}_amount`] = "Số lượng bắt buộc";
        });

        setErrors(temp);
        return Object.keys(temp).length === 0;
    };

    const handleAddIngredient = () => {
        setFormData({
            ...formData,
            ingredients: [
                ...formData.ingredients,
                { foodItemId: "", amount: "", tempFood: null }
            ]
        });
    };

    const handleRemoveIngredient = (index) => {
        const newIngredients = [...formData.ingredients];
        newIngredients.splice(index, 1);
        setFormData({ ...formData, ingredients: newIngredients });
    };

    const handleIngredientChange = (index, field, value) => {
        const newIngredients = [...formData.ingredients];
        newIngredients[index][field] = value;
        setFormData({ ...formData, ingredients: newIngredients });
    };

    const handleOpenSearchDialog = (index) => {
        setSearchDialogIndex(index);
        setSearchDialogQuery("");
        setSearchDialogResults([]);
        fetchFoodOptions(""); // Load default list
    };

    const handleCloseSearchDialog = () => {
        setSearchDialogIndex(null);
    };

    const handleSelectFood = (food) => {
        if (searchDialogIndex !== null) {
            const newIngredients = [...formData.ingredients];
            newIngredients[searchDialogIndex].tempFood = food;
            newIngredients[searchDialogIndex].foodItemId = food.id;
            setFormData({ ...formData, ingredients: newIngredients });
        }
        handleCloseSearchDialog();
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validate()) return;

        setLoading(true);
        try {
            const payload = {
                ...formData,
                kcal: Number(formData.kcal),
                proteinG: Number(formData.proteinG),
                fatG: Number(formData.fatG),
                carbG: Number(formData.carbG),
                estimatedCostVnd: Number(formData.estimatedCostVnd),
                ingredients: formData.ingredients.map(({ foodItemId, amount }) => ({
                    foodItemId,
                    amount
                }))
            };

            if (isEdit) {
                await recipeApi.update(id, payload);
            } else {
                await recipeApi.create(payload);
            }

            navigate("/admin/recipes");
        } catch (error) {
            console.error("Failed to save recipe", error);
            setSnackbar({ open: true, message: "Lưu công thức thất bại", severity: "error" });
        } finally {
            setLoading(false);
        }
    };

    const handleCloseSnackbar = () => {
        setSnackbar({ ...snackbar, open: false });
    };

    return (
        <Box>
            <Typography variant="h4" fontWeight={700} mb={3}>
                {isEdit ? "Chỉnh sửa công thức" : "Tạo công thức mới"}
            </Typography>

            <Paper elevation={2} sx={{ p: 4 }}>
                <Box component="form" onSubmit={handleSubmit}>
                    <Grid container spacing={3}>

                        <Grid size={12}>
                            <TextField
                                label="Tên công thức"
                                fullWidth
                                value={formData.name}
                                onChange={(e) =>
                                    setFormData({ ...formData, name: e.target.value })
                                }
                                error={!!errors.name}
                                helperText={errors.name}
                            />
                        </Grid>

                        <Grid size={12}>
                            <TextField
                                label="Mô tả"
                                fullWidth
                                multiline
                                rows={3}
                                value={formData.description}
                                onChange={(e) =>
                                    setFormData({ ...formData, description: e.target.value })
                                }
                            />
                        </Grid>

                        <Grid size={{ xs: 12, md: 4 }}>
                            <TextField
                                label="Giá tiền (VND)"
                                type="number"
                                fullWidth
                                value={formData.estimatedCostVnd}
                                onChange={(e) =>
                                    setFormData({ ...formData, estimatedCostVnd: e.target.value })
                                }
                                error={!!errors.estimatedCostVnd}
                                helperText={errors.estimatedCostVnd}
                            />
                        </Grid>

                        <Grid size={{ xs: 12, md: 4 }}>
                            <TextField
                                label="Calories (kcal)"
                                type="number"
                                fullWidth
                                value={formData.kcal}
                                onChange={(e) =>
                                    setFormData({ ...formData, kcal: e.target.value })
                                }
                                error={!!errors.kcal}
                                helperText={errors.kcal}
                            />
                        </Grid>

                        <Grid size={{ xs: 12, md: 4 }}>
                            <FormControlLabel
                                control={
                                    <Switch
                                        checked={formData.active}
                                        onChange={(e) =>
                                            setFormData({ ...formData, active: e.target.checked })
                                        }
                                        color="success"
                                    />
                                }
                                label="Hoạt động"
                                sx={{ mt: 1 }}
                            />
                        </Grid>

                        <Grid size={{ xs: 12, md: 4 }}>
                            <TextField
                                label="Chất đạm - Protein (g)"
                                type="number"
                                fullWidth
                                value={formData.proteinG}
                                onChange={(e) =>
                                    setFormData({ ...formData, proteinG: e.target.value })
                                }
                                error={!!errors.proteinG}
                                helperText={errors.proteinG}
                            />
                        </Grid>

                        <Grid size={{ xs: 12, md: 4 }}>
                            <TextField
                                label="Chất béo - Fat (g)"
                                type="number"
                                fullWidth
                                value={formData.fatG}
                                onChange={(e) =>
                                    setFormData({ ...formData, fatG: e.target.value })
                                }
                                error={!!errors.fatG}
                                helperText={errors.fatG}
                            />
                        </Grid>

                        <Grid size={{ xs: 12, md: 4 }}>
                            <TextField
                                label="Tinh bột - Carbs (g)"
                                type="number"
                                fullWidth
                                value={formData.carbG}
                                onChange={(e) =>
                                    setFormData({ ...formData, carbG: e.target.value })
                                }
                                error={!!errors.carbG}
                                helperText={errors.carbG}
                            />
                        </Grid>

                        <Grid size={12}>
                            <TextField
                                label="Nhãn (Tags)"
                                fullWidth
                                value={formData.tags}
                                onChange={(e) =>
                                    setFormData({ ...formData, tags: e.target.value })
                                }
                            />
                        </Grid>

                        <Grid size={12}>
                            <Divider textAlign="left">THÀNH PHẦN (INGREDIENTS)</Divider>
                        </Grid>

                        <Grid size={12}>
                            {formData.ingredients.map((ing, index) => (
                                <Box key={index} sx={{ display: "flex", gap: 2, mb: 2, alignItems: 'center' }}>

                                    {/* Food Display Box */}
                                    <Box
                                        sx={{
                                            flex: 1,
                                            p: 1.5,
                                            border: '1px solid',
                                            borderColor: errors[`ing_${index}_food`] ? 'error.main' : 'grey.300',
                                            borderRadius: 1,
                                            display: 'flex',
                                            justifyContent: 'space-between',
                                            alignItems: 'center'
                                        }}
                                    >
                                        <Typography variant="body1" color={ing.tempFood ? "text.primary" : "text.secondary"}>
                                            {ing.tempFood ? ing.tempFood.name : "Chưa chọn món ăn..."}
                                        </Typography>
                                        <Button
                                            variant="outlined"
                                            size="small"
                                            color="primary"
                                            onClick={() => handleOpenSearchDialog(index)}
                                            startIcon={<Search />}
                                        >
                                            Tìm món
                                        </Button>
                                    </Box>

                                    {/* Amount Input */}
                                    <TextField
                                        label="Số lượng"
                                        sx={{ width: 150 }}
                                        value={ing.amount}
                                        onChange={(e) =>
                                            handleIngredientChange(index, "amount", e.target.value)
                                        }
                                        error={!!errors[`ing_${index}_amount`]}
                                        helperText={errors[`ing_${index}_amount`]}
                                    />

                                    {/* Remove Button */}
                                    <IconButton
                                        color="error"
                                        onClick={() => handleRemoveIngredient(index)}
                                    >
                                        <Delete />
                                    </IconButton>

                                    {/* Error text for food if any */}
                                    {errors[`ing_${index}_food`] && !ing.tempFood && (
                                        <Typography color="error" variant="caption" sx={{ position: 'absolute', mt: 7 }}>
                                            {errors[`ing_${index}_food`]}
                                        </Typography>
                                    )}
                                </Box>
                            ))}
                            <Button startIcon={<Add />} onClick={handleAddIngredient}>
                                Thêm thành phần
                            </Button>
                        </Grid>

                        <Grid size={12}>
                            <Box sx={{ display: "flex", gap: 2, mt: 2 }}>
                                <Button
                                    variant="contained"
                                    color="success"
                                    type="submit"
                                    disabled={loading}
                                >
                                    {isEdit ? "Cập nhật công thức" : "Tạo công thức"}
                                </Button>
                                <Button
                                    variant="outlined"
                                    onClick={() => navigate("/admin/recipes")}
                                    disabled={loading}
                                >
                                    Hủy
                                </Button>
                            </Box>
                        </Grid>

                    </Grid>
                </Box>
            </Paper>

            {/* Dialog Search Food */}
            <Dialog
                open={searchDialogIndex !== null}
                onClose={handleCloseSearchDialog}
                fullWidth
                maxWidth="sm"
            >
                <DialogTitle>Tìm kiếm món ăn</DialogTitle>
                <DialogContent dividers>
                    <TextField
                        autoFocus
                        fullWidth
                        margin="dense"
                        label="Nhập tên món ăn..."
                        variant="outlined"
                        value={searchDialogQuery}
                        onChange={(e) => setSearchDialogQuery(e.target.value)}
                        InputProps={{
                            endAdornment: isSearching ? <CircularProgress size={20} /> : null
                        }}
                        sx={{ mb: 2 }}
                    />
                    <List sx={{ pt: 0 }}>
                        {searchDialogResults.length === 0 && !isSearching ? (
                            <ListItem>
                                <ListItemText primary="Không tìm thấy món nào" />
                            </ListItem>
                        ) : (
                            searchDialogResults.map((food) => (
                                <ListItem
                                    button
                                    key={food.id}
                                    onClick={() => handleSelectFood(food)}
                                    divider
                                >
                                    <ListItemText
                                        primary={food.name}
                                        secondary={`${food.kcalPerServing} kcal | P: ${food.proteinG}g | F: ${food.fatG}g | C: ${food.carbG}g ${food.brand ? ` | Hãng: ${food.brand}` : ''}`}
                                    />
                                </ListItem>
                            ))
                        )}
                    </List>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseSearchDialog} color="inherit">Đóng</Button>
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