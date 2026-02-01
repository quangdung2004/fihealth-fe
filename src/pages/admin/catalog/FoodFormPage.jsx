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
    Chip
} from "@mui/material";
import { useNavigate, useParams } from "react-router-dom";
import axiosClient from "../../../api/axiosClient";

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
        active: true
    });

    const [availableAllergens, setAvailableAllergens] = useState([]);
    const [selectedAllergens, setSelectedAllergens] = useState([]);

    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState({});

    /* ===================== FETCH ===================== */

    useEffect(() => {
        fetchAvailableAllergens();
        if (isEdit) {
            fetchFood();
        }
    }, [id]);

    const fetchAvailableAllergens = async () => {
        try {
            const res = await axiosClient.get("/admin/allergens", {
                params: { size: 1000 }
            });

            const pageData = res.data.data;
            setAvailableAllergens(pageData?.content || []);
        } catch (error) {
            console.error("Failed to load allergens", error);
            setAvailableAllergens([]);
        }
    };

    const fetchFood = async () => {
        setLoading(true);
        try {
            const res = await axiosClient.get(`/admin/foods/${id}`);
            const data = res.data.data;

            setFormData({
                name: data.name || "",
                brand: data.brand || "",
                servingSize: data.servingSize || "",
                kcalPerServing: data.kcalPerServing ?? "",
                proteinG: data.proteinG ?? "",
                fatG: data.fatG ?? "",
                carbG: data.carbG ?? "",
                estimatedPriceVndPerServing: data.estimatedPriceVndPerServing ?? "",
                tags: data.tags || "",
                active: data.active ?? true
            });

            setSelectedAllergens(data.allergens || []);
        } catch (error) {
            console.error("Failed to fetch food", error);
            navigate("/admin/foods");
        } finally {
            setLoading(false);
        }
    };

    /* ===================== VALIDATE ===================== */

    const validate = () => {
        const temp = {};

        if (!formData.name) temp.name = "Name is required";
        if (formData.kcalPerServing === "" || formData.kcalPerServing < 0) temp.kcalPerServing = "Invalid kcal";
        if (formData.proteinG === "" || formData.proteinG < 0) temp.proteinG = "Invalid protein";
        if (formData.fatG === "" || formData.fatG < 0) temp.fatG = "Invalid fat";
        if (formData.carbG === "" || formData.carbG < 0) temp.carbG = "Invalid carb";
        if (
            formData.estimatedPriceVndPerServing === "" ||
            formData.estimatedPriceVndPerServing < 0
        ) {
            temp.estimatedPriceVndPerServing = "Invalid price";
        }

        setErrors(temp);
        return Object.keys(temp).length === 0;
    };

    /* ===================== SUBMIT ===================== */

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validate()) return;

        setLoading(true);
        try {
            const payload = {
                ...formData,
                kcalPerServing: Number(formData.kcalPerServing),
                proteinG: Number(formData.proteinG),
                fatG: Number(formData.fatG),
                carbG: Number(formData.carbG),
                estimatedPriceVndPerServing: Number(formData.estimatedPriceVndPerServing),
                allergenIds: selectedAllergens.map(a => a.id)
            };

            if (isEdit) {
                await axiosClient.put(`/admin/foods/${id}`, payload);
            } else {
                await axiosClient.post("/admin/foods", payload);
            }

            navigate("/admin/foods");
        } catch (error) {
            console.error("Failed to save food", error);
            alert("Failed to save food");
        } finally {
            setLoading(false);
        }
    };

    /* ===================== UI ===================== */

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
                                label="Price (VND)"
                                type="number"
                                fullWidth
                                value={formData.estimatedPriceVndPerServing}
                                onChange={(e) =>
                                    setFormData({ ...formData, estimatedPriceVndPerServing: e.target.value })
                                }
                                error={!!errors.estimatedPriceVndPerServing}
                                helperText={errors.estimatedPriceVndPerServing}
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
                                value={selectedAllergens}
                                getOptionLabel={(option) => option.name || ""}
                                isOptionEqualToValue={(o, v) => o.id === v.id}
                                onChange={(e, value) => setSelectedAllergens(value)}
                                renderTags={(value, getTagProps) =>
                                    value.map((option, index) => {
                                        const { key, ...tagProps } = getTagProps({ index });
                                        return (
                                            <Chip key={key} label={option.name} {...tagProps} />
                                        );
                                    })
                                }
                                renderInput={(params) => (
                                    <TextField {...params} label="Allergens" />
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
                            />
                        </Grid>

                        <Grid item xs={12}>
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
                            />
                        </Grid>

                        <Grid item xs={12}>
                            <Box sx={{ display: "flex", gap: 2 }}>
                                <Button
                                    type="submit"
                                    variant="contained"
                                    color="success"
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
