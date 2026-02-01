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
    Divider
} from "@mui/material";
import { Add, Delete } from "@mui/icons-material";
import { useNavigate, useParams } from "react-router-dom";
import axiosClient from "../../../api/axiosClient";

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
        ingredients: [] // { foodItemId, amount, tempFood }
    });

    const [foodOptions, setFoodOptions] = useState([]);
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState({});

    /* ===================== FETCH ===================== */

    useEffect(() => {
        fetchFoodOptions("");

        if (isEdit) {
            fetchRecipe();
        }
    }, [id]);

    const fetchFoodOptions = async (query) => {
        try {
            const res = await axiosClient.get("/admin/foods", {
                params: { q: query, size: 20 }
            });

            const pageData = res.data.data;
            setFoodOptions(pageData?.content || []);
        } catch (error) {
            console.error("Failed to search foods", error);
            setFoodOptions([]);
        }
    };

    const fetchRecipe = async () => {
        setLoading(true);
        try {
            const res = await axiosClient.get(`/admin/recipes/${id}`);
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

    /* ===================== VALIDATE ===================== */

    const validate = () => {
        const temp = {};

        if (!formData.name) temp.name = "Name is required";
        if (formData.kcal === "" || formData.kcal < 0) temp.kcal = "Invalid calories";
        if (formData.proteinG === "" || formData.proteinG < 0) temp.proteinG = "Invalid protein";
        if (formData.fatG === "" || formData.fatG < 0) temp.fatG = "Invalid fat";
        if (formData.carbG === "" || formData.carbG < 0) temp.carbG = "Invalid carbs";
        if (formData.estimatedCostVnd === "" || formData.estimatedCostVnd < 0) {
            temp.estimatedCostVnd = "Invalid cost";
        }

        formData.ingredients.forEach((ing, index) => {
            if (!ing.foodItemId) temp[`ing_${index}_food`] = "Food required";
            if (!ing.amount) temp[`ing_${index}_amount`] = "Amount required";
        });

        setErrors(temp);
        return Object.keys(temp).length === 0;
    };

    /* ===================== INGREDIENT HANDLERS ===================== */

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

        if (field === "tempFood" && value) {
            newIngredients[index].foodItemId = value.id;
        }

        setFormData({ ...formData, ingredients: newIngredients });
    };

    /* ===================== SUBMIT ===================== */

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
                await axiosClient.put(`/admin/recipes/${id}`, payload);
            } else {
                await axiosClient.post("/admin/recipes", payload);
            }

            navigate("/admin/recipes");
        } catch (error) {
            console.error("Failed to save recipe", error);
            alert("Failed to save recipe");
        } finally {
            setLoading(false);
        }
    };

    /* ===================== UI ===================== */

    return (
        <Box>
            <Typography variant="h4" fontWeight={700} mb={3}>
                {isEdit ? "Edit Recipe" : "Create Recipe"}
            </Typography>

            <Paper elevation={2} sx={{ p: 4 }}>
                <Box component="form" onSubmit={handleSubmit}>
                    <Grid container spacing={3}>
                        <Grid item xs={12}>
                            <TextField
                                label="Recipe Name"
                                fullWidth
                                value={formData.name}
                                onChange={(e) =>
                                    setFormData({ ...formData, name: e.target.value })
                                }
                                error={!!errors.name}
                                helperText={errors.name}
                            />
                        </Grid>

                        <Grid item xs={12}>
                            <TextField
                                label="Description"
                                fullWidth
                                multiline
                                rows={3}
                                value={formData.description}
                                onChange={(e) =>
                                    setFormData({ ...formData, description: e.target.value })
                                }
                            />
                        </Grid>

                        <Grid item xs={12} md={4}>
                            <TextField
                                label="Cost (VND)"
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

                        <Grid item xs={12} md={4}>
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

                        <Grid item xs={12} md={4}>
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
                                label="Active"
                                sx={{ mt: 1 }}
                            />
                        </Grid>

                        <Grid item xs={12} md={4}>
                            <TextField
                                label="Protein (g)"
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

                        <Grid item xs={12} md={4}>
                            <TextField
                                label="Fat (g)"
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

                        <Grid item xs={12} md={4}>
                            <TextField
                                label="Carbs (g)"
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

                        <Grid item xs={12}>
                            <TextField
                                label="Tags"
                                fullWidth
                                value={formData.tags}
                                onChange={(e) =>
                                    setFormData({ ...formData, tags: e.target.value })
                                }
                            />
                        </Grid>

                        <Grid item xs={12}>
                            <Divider textAlign="left">INGREDIENTS</Divider>
                        </Grid>

                        <Grid item xs={12}>
                            {formData.ingredients.map((ing, index) => (
                                <Box
                                    key={index}
                                    sx={{ display: "flex", gap: 2, mb: 2 }}
                                >
                                    <Autocomplete
                                        sx={{ flex: 1 }}
                                        options={foodOptions}
                                        getOptionLabel={(o) => o.name || ""}
                                        value={ing.tempFood}
                                        isOptionEqualToValue={(o, v) => o.id === v.id}
                                        onInputChange={(e, value) =>
                                            fetchFoodOptions(value)
                                        }
                                        onChange={(e, value) =>
                                            handleIngredientChange(index, "tempFood", value)
                                        }
                                        renderInput={(params) => (
                                            <TextField
                                                {...params}
                                                label="Select Food"
                                                error={!!errors[`ing_${index}_food`]}
                                                helperText={errors[`ing_${index}_food`]}
                                            />
                                        )}
                                    />
                                    <TextField
                                        label="Amount"
                                        sx={{ width: 150 }}
                                        value={ing.amount}
                                        onChange={(e) =>
                                            handleIngredientChange(index, "amount", e.target.value)
                                        }
                                        error={!!errors[`ing_${index}_amount`]}
                                        helperText={errors[`ing_${index}_amount`]}
                                    />
                                    <IconButton
                                        color="error"
                                        onClick={() => handleRemoveIngredient(index)}
                                        sx={{ mt: 1 }}
                                    >
                                        <Delete />
                                    </IconButton>
                                </Box>
                            ))}
                            <Button startIcon={<Add />} onClick={handleAddIngredient}>
                                Add Ingredient
                            </Button>
                        </Grid>

                        <Grid item xs={12}>
                            <Box sx={{ display: "flex", gap: 2, mt: 2 }}>
                                <Button
                                    variant="contained"
                                    color="success"
                                    type="submit"
                                    disabled={loading}
                                >
                                    {isEdit ? "Update Recipe" : "Create Recipe"}
                                </Button>
                                <Button
                                    variant="outlined"
                                    onClick={() => navigate("/admin/recipes")}
                                    disabled={loading}
                                >
                                    Cancel
                                </Button>
                            </Box>
                        </Grid>
                    </Grid>
                </Box>
            </Paper>
        </Box>
    );
}
