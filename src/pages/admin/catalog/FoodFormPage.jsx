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
    Chip
} from "@mui/material";
import { useNavigate, useParams } from "react-router-dom";
import foodService from "../../../services/foodService";
import allergenService from "../../../services/allergenService";

export function FoodFormPage() {
    const navigate = useNavigate();
    const { id } = useParams();
    const isEdit = !!id;

    const [formData, setFormData] = useState({
        name: "",
        brand: "",
        servingSize: "",
        kcalPerServing: "",
        proteinG: "",
        fatG: "",
        carbG: "",
        estimatedPriceVndPerServing: "",
        tags: "",
        active: true,
        allergenIds: []
    });

    const [availableAllergens, setAvailableAllergens] = useState([]);
    const [selectedAllergens, setSelectedAllergens] = useState([]);

    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState({});

    useEffect(() => {
        fetchAvailableAllergens();
        if (isEdit) {
            fetchFood();
        }
    }, [id]);

    const fetchAvailableAllergens = async () => {
        try {
            const data = await allergenService.getAllAllergens({ size: 1000 }); // Get all for select
            setAvailableAllergens(data.content || []);
        } catch (error) {
            console.error("Failed to load allergens", error);
        }
    };

    const fetchFood = async () => {
        setLoading(true);
        try {
            const data = await foodService.getFoodById(id);
            setFormData({
                name: data.name,
                brand: data.brand || "",
                servingSize: data.servingSize || "",
                kcalPerServing: data.kcalPerServing,
                proteinG: data.proteinG,
                fatG: data.fatG,
                carbG: data.carbG,
                estimatedPriceVndPerServing: data.estimatedPriceVndPerServing,
                tags: data.tags || "",
                active: data.active,
                allergenIds: data.allergens ? data.allergens.map(a => a.id) : []
            });
            // Pre-select allergens for Autocomplete
            if (data.allergens) {
                setSelectedAllergens(data.allergens);
            }
        } catch (error) {
            console.error("Failed to fetch food", error);
            navigate("/admin/foods");
        } finally {
            setLoading(false);
        }
    };

    const validate = () => {
        const tempErrors = {};
        if (!formData.name) tempErrors.name = "Name is required";
        if (formData.kcalPerServing === "" || formData.kcalPerServing < 0) tempErrors.kcalPerServing = "Valid calories required";
        if (formData.proteinG === "" || formData.proteinG < 0) tempErrors.proteinG = "Valid protein required";
        if (formData.fatG === "" || formData.fatG < 0) tempErrors.fatG = "Valid fat required";
        if (formData.carbG === "" || formData.carbG < 0) tempErrors.carbG = "Valid carbs required";
        if (formData.estimatedPriceVndPerServing === "" || formData.estimatedPriceVndPerServing < 0) tempErrors.estimatedPriceVndPerServing = "Valid price required";

        setErrors(tempErrors);
        return Object.keys(tempErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validate()) return;

        setLoading(true);
        try {
            const payload = {
                ...formData,
                // Ensure numbers are numbers
                kcalPerServing: Number(formData.kcalPerServing),
                proteinG: Number(formData.proteinG),
                fatG: Number(formData.fatG),
                carbG: Number(formData.carbG),
                estimatedPriceVndPerServing: Number(formData.estimatedPriceVndPerServing),
                allergenIds: selectedAllergens.map(a => a.id)
            };

            if (isEdit) {
                await foodService.updateFood(id, payload);
            } else {
                await foodService.createFood(payload);
            }
            navigate("/admin/foods");
        } catch (error) {
            console.error("Failed to save food", error);
            alert("Failed to save food");
        } finally {
            setLoading(false);
        }
    };

    return (
        <Box>
            <Typography variant="h4" fontWeight={700} mb={3}>
                {isEdit ? "Edit Food" : "Create Food"}
            </Typography>

            <Paper elevation={2} sx={{ p: 4 }}>
                <Box component="form" onSubmit={handleSubmit}>
                    <Grid container spacing={3}>
                        <Grid item xs={12} md={6}>
                            <TextField
                                label="Name"
                                fullWidth
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                error={!!errors.name}
                                helperText={errors.name}
                            />
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <TextField
                                label="Brand"
                                fullWidth
                                value={formData.brand}
                                onChange={(e) => setFormData({ ...formData, brand: e.target.value })}
                            />
                        </Grid>

                        <Grid item xs={12} md={4}>
                            <TextField
                                label="Serving Size"
                                fullWidth
                                value={formData.servingSize}
                                onChange={(e) => setFormData({ ...formData, servingSize: e.target.value })}
                            />
                        </Grid>
                        <Grid item xs={12} md={4}>
                            <TextField
                                label="Price (VND)"
                                type="number"
                                fullWidth
                                value={formData.estimatedPriceVndPerServing}
                                onChange={(e) => setFormData({ ...formData, estimatedPriceVndPerServing: e.target.value })}
                                error={!!errors.estimatedPriceVndPerServing}
                                helperText={errors.estimatedPriceVndPerServing}
                            />
                        </Grid>
                        <Grid item xs={12} md={4}>
                            <TextField
                                label="Calories (kcal)"
                                type="number"
                                fullWidth
                                value={formData.kcalPerServing}
                                onChange={(e) => setFormData({ ...formData, kcalPerServing: e.target.value })}
                                error={!!errors.kcalPerServing}
                                helperText={errors.kcalPerServing}
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
                            <Autocomplete
                                multiple
                                options={availableAllergens}
                                getOptionLabel={(option) => option.name || ""}
                                value={selectedAllergens}
                                isOptionEqualToValue={(option, value) => option.id === value.id}
                                onChange={(event, newValue) => {
                                    setSelectedAllergens(newValue);
                                }}
                                renderTags={(value, getTagProps) =>
                                    value.map((option, index) => {
                                        const { key, ...tagProps } = getTagProps({ index });
                                        return (
                                            <Chip variant="outlined" label={option.name} key={key} {...tagProps} />
                                        );
                                    })
                                }
                                renderInput={(params) => (
                                    <TextField
                                        {...params}
                                        label="Allergens"
                                        placeholder="Select allergens"
                                    />
                                )}
                            />
                        </Grid>

                        <Grid item xs={12}>
                            <TextField
                                label="Tags"
                                fullWidth
                                multiline
                                rows={2}
                                value={formData.tags}
                                onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                                placeholder="Comma separated tags..."
                            />
                        </Grid>

                        <Grid item xs={12}>
                            <FormControlLabel
                                control={
                                    <Switch
                                        checked={formData.active}
                                        onChange={(e) => setFormData({ ...formData, active: e.target.checked })}
                                        color="success"
                                    />
                                }
                                label="Active"
                            />
                        </Grid>

                        <Grid item xs={12}>
                            <Box sx={{ display: "flex", gap: 2 }}>
                                <Button
                                    variant="contained"
                                    color="success"
                                    type="submit"
                                    disabled={loading}
                                >
                                    {isEdit ? "Update Food" : "Create Food"}
                                </Button>
                                <Button
                                    variant="outlined"
                                    onClick={() => navigate("/admin/foods")}
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
