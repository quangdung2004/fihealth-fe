import { useState, useEffect } from "react";
import {
    Box,
    Button,
    Paper,
    TextField,
    Typography,
    Stack
} from "@mui/material";
import { useNavigate, useParams } from "react-router-dom";
import allergenService from "../../../services/allergenService";

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

    const fetchAllergen = async () => {
        setLoading(true);
        try {
            const data = await allergenService.getAllergenById(id);
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

    const validate = () => {
        const tempErrors = {};
        if (!formData.code) tempErrors.code = "Code is required";
        else if (!/^[A-Z_]+$/.test(formData.code)) tempErrors.code = "Code must be uppercase with underscores";

        if (!formData.name) tempErrors.name = "Name is required";

        setErrors(tempErrors);
        return Object.keys(tempErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validate()) return;

        setLoading(true);
        try {
            if (isEdit) {
                await allergenService.updateAllergen(id, formData);
            } else {
                await allergenService.createAllergen(formData);
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

            <Paper elevation={2} sx={{ p: 4, maxWidth: 600 }}>
                <Box component="form" onSubmit={handleSubmit}>
                    <Stack spacing={3}>
                        <TextField
                            label="Code"
                            fullWidth
                            value={formData.code}
                            onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                            error={!!errors.code}
                            helperText={errors.code || "Uppercase letters and underscores only (e.g., PEANUT, MILK_DAIRY)"}
                        />
                        <TextField
                            label="Name"
                            fullWidth
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            error={!!errors.name}
                            helperText={errors.name}
                        />

                        <Box sx={{ display: "flex", gap: 2, pt: 2 }}>
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
                    </Stack>
                </Box>
            </Paper>
        </Box>
    );
}
