import { useState, useEffect } from "react";
import {
    Box,
    Button,
    Paper,
    TextField,
    Typography,
    Grid,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    FormControlLabel,
    Switch,
    FormHelperText
} from "@mui/material";
import { Save, ArrowBack } from "@mui/icons-material";
import { useNavigate, useParams } from "react-router-dom";
import workoutApi from "../../../api/workoutApi";

export function WorkoutFormPage() {
    const navigate = useNavigate();
    const { id } = useParams();
    const isEdit = Boolean(id);

    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        name: "",
        level: "Beginner",
        type: "STRENGTH",
        muscleGroups: "",
        equipment: "NONE",
        contraindications: "",
        active: true
    });

    const [errors, setErrors] = useState({});

    // Enums
    const levels = ["Beginner", "Intermediate", "Advanced"];
    const types = ["CARDIO", "STRENGTH", "MOBILITY", "HIIT", "YOGA"];
    const equipmentList = ["NONE", "DUMBBELL", "BARBELL", "KETTLEBELL", "BAND", "MACHINE", "MAT", "FOAM_ROLLER"];

    useEffect(() => {
        if (isEdit) {
            fetchWorkout();
        }
    }, [id]);

    const fetchWorkout = async () => {
        setLoading(true);
        try {
            const res = await workoutApi.adminGetById(id);
            const data = res.data.data;
            setFormData({
                name: data.name || "",
                level: data.level || "Beginner",
                type: data.type || "STRENGTH",
                muscleGroups: data.muscleGroups || "",
                equipment: data.equipment || "NONE",
                contraindications: data.contraindications || "",
                active: data.active ?? true
            });
        } catch (error) {
            console.error("Failed to fetch workout", error);
            navigate("/admin/workouts");
        } finally {
            setLoading(false);
        }
    };

    const validate = () => {
        const newErrors = {};
        if (!formData.name.trim()) newErrors.name = "Name is required";
        if (formData.name.length > 200) newErrors.name = "Name must be less than 200 characters";
        if (formData.muscleGroups.length > 500) newErrors.muscleGroups = "Muscle groups must be less than 500 characters";
        if (formData.contraindications.length > 500) newErrors.contraindications = "Contraindications must be less than 500 characters";

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleChange = (e) => {
        const { name, value, checked, type } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: type === "checkbox" ? checked : value
        }));
        if (errors[name]) {
            setErrors((prev) => ({ ...prev, [name]: null }));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validate()) return;

        setLoading(true);
        try {
            if (isEdit) {
                await workoutApi.adminUpdate(id, formData);
            } else {
                await workoutApi.adminCreate(formData);
            }
            navigate("/admin/workouts");
        } catch (error) {
            console.error("Failed to save workout", error);
            alert("Failed to save workout");
        } finally {
            setLoading(false);
        }
    };

    return (
        <Box>
            <Box sx={{ display: "flex", alignItems: "center", mb: 3 }}>
                <Button
                    startIcon={<ArrowBack />}
                    onClick={() => navigate("/admin/workouts")}
                    sx={{ mr: 2 }}
                >
                    Back
                </Button>
                <Typography variant="h4" fontWeight={700}>
                    {isEdit ? "Edit Workout" : "Create Workout"}
                </Typography>
            </Box>

            <Paper elevation={2} sx={{ p: 4 }}>
                <form onSubmit={handleSubmit}>
                    <Grid container spacing={3}>
                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                label="Workout Name"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                error={Boolean(errors.name)}
                                helperText={errors.name}
                                required
                            />
                        </Grid>

                        <Grid item xs={12} md={4}>
                            <FormControl fullWidth>
                                <InputLabel>Level</InputLabel>
                                <Select
                                    name="level"
                                    value={formData.level}
                                    label="Level"
                                    onChange={handleChange}
                                >
                                    {levels.map((option) => (
                                        <MenuItem key={option} value={option}>{option}</MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        </Grid>

                        <Grid item xs={12} md={4}>
                            <FormControl fullWidth>
                                <InputLabel>Type</InputLabel>
                                <Select
                                    name="type"
                                    value={formData.type}
                                    label="Type"
                                    onChange={handleChange}
                                >
                                    {types.map((option) => (
                                        <MenuItem key={option} value={option}>{option}</MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        </Grid>

                        <Grid item xs={12} md={4}>
                            <FormControl fullWidth>
                                <InputLabel>Equipment</InputLabel>
                                <Select
                                    name="equipment"
                                    value={formData.equipment}
                                    label="Equipment"
                                    onChange={handleChange}
                                >
                                    {equipmentList.map((option) => (
                                        <MenuItem key={option} value={option}>{option}</MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        </Grid>

                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                label="Muscle Groups (comma separated)"
                                name="muscleGroups"
                                value={formData.muscleGroups}
                                onChange={handleChange}
                                error={Boolean(errors.muscleGroups)}
                                helperText={errors.muscleGroups}
                                multiline
                                rows={2}
                            />
                        </Grid>

                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                label="Contraindications"
                                name="contraindications"
                                value={formData.contraindications}
                                onChange={handleChange}
                                error={Boolean(errors.contraindications)}
                                helperText={errors.contraindications}
                                multiline
                                rows={2}
                            />
                        </Grid>

                        <Grid item xs={12}>
                            <FormControlLabel
                                control={
                                    <Switch
                                        checked={formData.active}
                                        onChange={handleChange}
                                        name="active"
                                        color="success"
                                    />
                                }
                                label="Active"
                            />
                        </Grid>

                        <Grid item xs={12}>
                            <Button
                                type="submit"
                                variant="contained"
                                color="primary"
                                startIcon={<Save />}
                                disabled={loading}
                                size="large"
                            >
                                {loading ? "Saving..." : "Save Workout"}
                            </Button>
                        </Grid>
                    </Grid>
                </form>
            </Paper>
        </Box>
    );
}
