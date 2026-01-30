import { useState, useEffect } from "react";
import {
    Box,
    Button,
    Paper,
    TextField,
    Typography,
    Stack,
    Grid,
    FormControlLabel,
    Switch,
    Autocomplete,
    IconButton,
    Divider
} from "@mui/material";
import { Add, Delete } from "@mui/icons-material";
import { useNavigate, useParams } from "react-router-dom";
import recipeService from "../../../services/recipeService";
import foodService from "../../../services/foodService";

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
        ingredients: [] // { foodItemId: "uuid", amount: "100g", tempFood: object }
    });

    // For searching foods in ingredient rows
    const [foodOptions, setFoodOptions] = useState([]);

    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState({});

    useEffect(() => {
        // Initial fetch of some foods (optional, maybe better to fetch on type)
        fetchFoodOptions("");

        if (isEdit) {
            fetchRecipe();
        }
    }, [id]);

    const fetchFoodOptions = async (query) => {
        try {
            const data = await foodService.searchFoods({ q: query, size: 20 });
            setFoodOptions(data.content || []);
        } catch (error) {
            console.error("Failed to search foods", error);
        }
    };

    const fetchRecipe = async () => {
        setLoading(true);
        try {
            const data = await recipeService.getRecipeById(id);

            // Transform ingredients for form
            const ingredientsForForm = (data.ingredients || []).map(ing => ({
                foodItemId: ing.foodItem.id,
                amount: ing.amount,
                tempFood: ing.foodItem // Store full object to populate Autocomplete
            }));

            setFormData({
                name: data.name,
                description: data.description || "",
                kcal: data.kcal,
                proteinG: data.proteinG,
                fatG: data.fatG,
                carbG: data.carbG,
                estimatedCostVnd: data.estimatedCostVnd,
                tags: data.tags || "",
                active: data.active,
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
        const tempErrors = {};
        if (!formData.name) tempErrors.name = "Name is required";
        if (formData.kcal === "" || formData.kcal < 0) tempErrors.kcal = "Valid calories required";
        if (formData.proteinG === "" || formData.proteinG < 0) tempErrors.proteinG = "Valid protein required";
        if (formData.fatG === "" || formData.fatG < 0) tempErrors.fatG = "Valid fat required";
        if (formData.carbG === "" || formData.carbG < 0) tempErrors.carbG = "Valid carbs required";
        if (formData.estimatedCostVnd === "" || formData.estimatedCostVnd < 0) tempErrors.estimatedCostVnd = "Valid cost required";

        // Validate ingredients
        if (formData.ingredients.length === 0) {
            // tempErrors.ingredients = "At least one ingredient is required";
            // Or maybe not? User didn't specify validation on ingredients size, but typically a recipe has ingredients.
            // Let's allow empty for now unless backend validation fails.
        }

        // Check ingredient fields
        formData.ingredients.forEach((ing, index) => {
            if (!ing.foodItemId) tempErrors[`ing_${index}_food`] = "Food is required";
            if (!ing.amount) tempErrors[`ing_${index}_amount`] = "Amount is required";
        });

        setErrors(tempErrors);
        return Object.keys(tempErrors).length === 0;
    };

    const handleAddIngredient = () => {
        setFormData({
            ...formData,
            ingredients: [...formData.ingredients, { foodItemId: "", amount: "", tempFood: null }]
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
                // Strip tempFood before sending
                ingredients: formData.ingredients.map(({ foodItemId, amount }) => ({ foodItemId, amount }))
            };

            if (isEdit) {
                await recipeService.updateRecipe(id, payload);
            } else {
                await recipeService.createRecipe(payload);
            }
            navigate("/admin/recipes");
        } catch (error) {
            console.error("Failed to save recipe", error);
            alert("Failed to save recipe");
        } finally {
            setLoading(false);
        }
    };

    // Re-calculate nutrition from ingredients (Optional helper)
    const calculateNutrition = () => {
        // Logic to auto-sum nutrition if needed, but the requirements show manual input for these fields.
        // I'll leave them manual as per the DTO which has these fields explicitly.
        // Maybe the user wants manual control or the calculation is complex on backend.
        // For now, I just provided manual entry fields matching the DTO.
    };

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
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
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
                                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                            />
                        </Grid>

                        <Grid item xs={12} md={4}>
                            <TextField
                                label="Cost (VND)"
                                type="number"
                                fullWidth
                                value={formData.estimatedCostVnd}
                                onChange={(e) => setFormData({ ...formData, estimatedCostVnd: e.target.value })}
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
                                onChange={(e) => setFormData({ ...formData, kcal: e.target.value })}
                                error={!!errors.kcal}
                                helperText={errors.kcal}
                            />
                        </Grid>
                        <Grid item xs={12} md={4}>
                            <FormControlLabel
                                control={
                                    <Switch
                                        checked={formData.active}
                                        onChange={(e) => setFormData({ ...formData, active: e.target.checked })}
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
                                onChange={(e) => setFormData({ ...formData, proteinG: e.target.value })}
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
                                onChange={(e) => setFormData({ ...formData, fatG: e.target.value })}
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
                                onChange={(e) => setFormData({ ...formData, carbG: e.target.value })}
                                error={!!errors.carbG}
                                helperText={errors.carbG}
                            />
                        </Grid>

                        <Grid item xs={12}>
                            <TextField
                                label="Tags"
                                fullWidth
                                multiline
                                rows={1}
                                value={formData.tags}
                                onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                                placeholder="Comma separated tags..."
                            />
                        </Grid>

                        <Grid item xs={12}>
                            <Divider textAlign="left">INGREDIENTS</Divider>
                        </Grid>

                        <Grid item xs={12}>
                            {formData.ingredients.map((ing, index) => (
                                <Box key={index} sx={{ display: "flex", gap: 2, mb: 2, alignItems: "start" }}>
                                    <Autocomplete
                                        sx={{ flex: 1 }}
                                        options={foodOptions}
                                        getOptionLabel={(option) => option.name || ""}
                                        value={ing.tempFood}
                                        isOptionEqualToValue={(option, value) => option.id === value.id}
                                        onInputChange={(event, value) => {
                                            fetchFoodOptions(value);
                                        }}
                                        onChange={(event, newValue) => {
                                            handleIngredientChange(index, "tempFood", newValue);
                                        }}
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
                                        onChange={(e) => handleIngredientChange(index, "amount", e.target.value)}
                                        error={!!errors[`ing_${index}_amount`]}
                                        helperText={errors[`ing_${index}_amount`]}
                                        placeholder="e.g. 100g"
                                    />
                                    <IconButton color="error" onClick={() => handleRemoveIngredient(index)} sx={{ mt: 1 }}>
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
