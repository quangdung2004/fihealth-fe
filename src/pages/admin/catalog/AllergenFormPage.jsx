import { useState, useEffect } from "react";
import {
    Box,
    Button,
    Paper,
    TextField,
    Typography,
    Grid
} from "@mui/material";
import { useNavigate, useParams } from "react-router-dom";
import allergenApi from "../../../api/allergenApi";

export function AllergenFormPage() {
    const navigate = useNavigate();
    const { id } = useParams();
    const isEdit = !!id;

    const [formData, setFormData] = useState({
        code: "",
        name: ""
    });
    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (isEdit) {
            fetchAllergen();
        }
    }, [id]);

    // ===== FETCH BY ID =====
    const fetchAllergen = async () => {
        setLoading(true);
        try {
            const res = await allergenApi.adminGetById(id);
            const data = res.data.data;

            setFormData({
                code: data.code,
                name: data.name
            });
        } catch (error) {
            console.error("Failed to fetch allergen", error);
            alert("Failed to fetch allergen details");
            navigate("/admin/allergens");
        } finally {
            setLoading(false);
        }
    };

    // ===== VALIDATION =====
    const validate = () => {
        const tempErrors = {};

        if (!formData.code) {
            tempErrors.code = "Code is required";
        } else if (!/^[A-Z_]+$/.test(formData.code)) {
            tempErrors.code = "Code must be uppercase with underscores";
        }

        if (!formData.name) {
            tempErrors.name = "Name is required";
        }

        setErrors(tempErrors);
        return Object.keys(tempErrors).length === 0;
    };

    // ===== SUBMIT =====
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validate()) return;

        setLoading(true);
        try {
            if (isEdit) {
                await allergenApi.adminUpdate(id, formData);
            } else {
                await allergenApi.adminCreate(formData);
            }
            navigate("/admin/allergens");
        } catch (error) {
            console.error("Failed to save allergen", error);
            alert("Failed to save allergen");
        } finally {
            setLoading(false);
        }
    };

    return (
        <Box>
            <Typography variant="h4" fontWeight={700} mb={3}>
                {isEdit ? "Edit Allergen" : "Create Allergen"}
            </Typography>

            <Paper elevation={2} sx={{ p: 4 }}>
                <Box component="form" onSubmit={handleSubmit}>
                    <Grid container spacing={3}>
                        <Grid item xs={12} md={6}>
                            <TextField
                                label="Code"
                                fullWidth
                                value={formData.code}
                                onChange={(e) =>
                                    setFormData({ ...formData, code: e.target.value })
                                }
                                error={!!errors.code}
                                helperText={
                                    errors.code ||
                                    "Uppercase letters and underscores only (e.g., PEANUT, MILK_DAIRY)"
                                }
                            />
                        </Grid>

                        <Grid item xs={12} md={6}>
                            <TextField
                                label="Name"
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
                            <Box sx={{ display: "flex", gap: 2 }}>
                                <Button
                                    variant="contained"
                                    color="success"
                                    type="submit"
                                    disabled={loading}
                                >
                                    {isEdit ? "Update" : "Create"}
                                </Button>
                                <Button
                                    variant="outlined"
                                    onClick={() => navigate("/admin/allergens")}
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
