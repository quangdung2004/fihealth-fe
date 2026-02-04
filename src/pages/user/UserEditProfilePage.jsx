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
    Autocomplete,
    Chip,
    Alert
} from "@mui/material";
import { Save, ArrowBack } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import dayjs from "dayjs";
import axiosClient from "../../api/axiosClient";
import { useAuth } from "../../components/common/AuthContext";

export function UserEditProfilePage() {
    const navigate = useNavigate();
    const { me: user, fetchMe } = useAuth();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    // Form State
    const [formData, setFormData] = useState({
        sex: "MALE",
        age: "",
        heightCm: "",
        currentWeightKg: "",
        activityLevel: "SEDENTARY",
        goal: "MAINTENANCE",
        targetWeightKg: "",
        goalDeadline: null,
        specificGoal: "",
        allergies: [],
        diseases: [],
        medicalNotes: ""
    });

    // Options for Autocomplete
    const commonAllergies = ["Peanuts", "Shellfish", "Dairy", "Gluten", "Soy", "Eggs"];
    const commonDiseases = ["Diabetes", "Hypertension", "Asthma", "Heart Disease"];

    useEffect(() => {
        if (user && user.profile) {
            const p = user.profile;
            setFormData({
                sex: p.sex || "MALE",
                age: p.age || "",
                heightCm: p.heightCm || "",
                currentWeightKg: p.currentWeightKg || "",
                activityLevel: p.activityLevel || "SEDENTARY",
                goal: p.goal || "MAINTENANCE",
                targetWeightKg: p.targetWeightKg || "",
                goalDeadline: p.goalDeadline ? dayjs(p.goalDeadline) : null,
                specificGoal: p.specificGoal || "",
                allergies: p.allergies || [],
                diseases: p.diseases || [],
                medicalNotes: p.medicalNotes || ""
            });
        }
    }, [user]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setLoading(true);

        try {
            const payload = {
                ...formData,
                age: Number(formData.age),
                heightCm: Number(formData.heightCm),
                currentWeightKg: Number(formData.currentWeightKg),
                targetWeightKg: formData.targetWeightKg ? Number(formData.targetWeightKg) : null,
                goalDeadline: formData.goalDeadline ? formData.goalDeadline.format("YYYY-MM-DD") : null
            };

            await axiosClient.put("/users/profile", payload);
            await fetchMe(); // Refresh global user data
            navigate("/user/profile");
        } catch (err) {
            console.error("Failed to update profile", err);
            setError(err.response?.data?.message || "Failed to update profile");
        } finally {
            setLoading(false);
        }
    };

    return (
        <LocalizationProvider dateAdapter={AdapterDayjs}>
            <Box sx={{ maxWidth: 800, mx: "auto", pb: 5 }}>
                <Button
                    startIcon={<ArrowBack />}
                    onClick={() => navigate("/user/profile")}
                    sx={{ mb: 2 }}
                >
                    Back to Profile
                </Button>

                <Typography variant="h4" fontWeight={700} gutterBottom>
                    Edit Profile
                </Typography>

                {error && <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>}

                <Paper elevation={0} sx={{ p: 4, borderRadius: 3, border: "1px solid #e0e0e0" }}>
                    <form onSubmit={handleSubmit}>
                        <Grid container spacing={3}>
                            {/* === BASIC INFORMATION === */}
                            <Grid item xs={12}>
                                <Typography variant="h6" fontWeight={600} color="success.main" sx={{ mb: 1 }}>
                                    Basic Information
                                </Typography>
                            </Grid>

                            <Grid item xs={12} sm={6} md={3}>
                                <FormControl fullWidth>
                                    <InputLabel>Sex</InputLabel>
                                    <Select
                                        name="sex"
                                        value={formData.sex}
                                        label="Sex"
                                        onChange={handleChange}
                                    >
                                        <MenuItem value="MALE">Male</MenuItem>
                                        <MenuItem value="FEMALE">Female</MenuItem>
                                    </Select>
                                </FormControl>
                            </Grid>

                            <Grid item xs={12} sm={6} md={3}>
                                <TextField
                                    fullWidth
                                    label="Age"
                                    name="age"
                                    type="number"
                                    value={formData.age}
                                    onChange={handleChange}
                                    required
                                    inputProps={{ min: 1, max: 120 }}
                                />
                            </Grid>

                            <Grid item xs={12} sm={6} md={3}>
                                <TextField
                                    fullWidth
                                    label="Height (cm)"
                                    name="heightCm"
                                    type="number"
                                    value={formData.heightCm}
                                    onChange={handleChange}
                                    required
                                    inputProps={{ min: 50 }}
                                />
                            </Grid>

                            <Grid item xs={12} sm={6} md={3}>
                                <TextField
                                    fullWidth
                                    label="Weight (kg)"
                                    name="currentWeightKg"
                                    type="number"
                                    value={formData.currentWeightKg}
                                    onChange={handleChange}
                                    required
                                    inputProps={{ min: 2, step: 0.1 }}
                                />
                            </Grid>

                            <Grid item xs={12}>
                                <FormControl fullWidth>
                                    <InputLabel>Activity Level</InputLabel>
                                    <Select
                                        name="activityLevel"
                                        value={formData.activityLevel}
                                        label="Activity Level"
                                        onChange={handleChange}
                                    >
                                        <MenuItem value="SEDENTARY">Sedentary (Little or no exercise)</MenuItem>
                                        <MenuItem value="LIGHT">Light (Exercise 1-3 times/week)</MenuItem>
                                        <MenuItem value="MODERATE">Moderate (Exercise 4-5 times/week)</MenuItem>
                                        <MenuItem value="ACTIVE">Active (Daily exercise or intense exercise 3-4 times/week)</MenuItem>
                                        <MenuItem value="VERY_ACTIVE">Very Active (Intense exercise 6-7 times/week)</MenuItem>
                                    </Select>
                                </FormControl>
                            </Grid>

                            {/* === HEALTH INFORMATION === */}
                            <Grid item xs={12} sx={{ mt: 3 }}>
                                <Typography variant="h6" fontWeight={600} color="success.main" sx={{ mb: 1 }}>
                                    Health Information
                                </Typography>
                            </Grid>

                            <Grid item xs={12} md={6}>
                                <Autocomplete
                                    multiple
                                    freeSolo
                                    options={commonAllergies}
                                    value={formData.allergies || []}
                                    onChange={(e, newValue) => setFormData(prev => ({ ...prev, allergies: newValue }))}
                                    renderTags={(value, getTagProps) =>
                                        value.map((option, index) => (
                                            <Chip variant="outlined" color="error" label={option} {...getTagProps({ index })} key={index} />
                                        ))
                                    }
                                    renderInput={(params) => <TextField {...params} label="Allergies" placeholder="Type and press Enter" />}
                                />
                            </Grid>

                            <Grid item xs={12} md={6}>
                                <Autocomplete
                                    multiple
                                    freeSolo
                                    options={commonDiseases}
                                    value={formData.diseases || []}
                                    onChange={(e, newValue) => setFormData(prev => ({ ...prev, diseases: newValue }))}
                                    renderTags={(value, getTagProps) =>
                                        value.map((option, index) => (
                                            <Chip variant="outlined" color="info" label={option} {...getTagProps({ index })} key={index} />
                                        ))
                                    }
                                    renderInput={(params) => <TextField {...params} label="Diseases / Conditions" placeholder="Type and press Enter" />}
                                />
                            </Grid>

                            <Grid item xs={12}>
                                <TextField
                                    fullWidth
                                    label="Medical Notes"
                                    name="medicalNotes"
                                    multiline
                                    rows={4}
                                    value={formData.medicalNotes}
                                    onChange={handleChange}
                                    placeholder="Any additional medical information..."
                                />
                            </Grid>

                            <Grid item xs={12} sx={{ mt: 2 }}>
                                <Button
                                    type="submit"
                                    variant="contained"
                                    color="success"
                                    size="large"
                                    startIcon={<Save />}
                                    disabled={loading}
                                    fullWidth
                                >
                                    {loading ? "Saving..." : "Save Changes"}
                                </Button>
                            </Grid>
                        </Grid>
                    </form>
                </Paper>
            </Box>
        </LocalizationProvider>
    );
}
