import { useState } from "react";
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
    Stepper,
    Step,
    StepLabel,
    Alert,
    Autocomplete,
    Chip
} from "@mui/material";
import { NavigateNext, Check } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import axiosClient from "../../api/axiosClient";
import { useAuth } from "../../components/common/AuthContext";

const steps = ["Basic Info", "Health Info"];

export function UserOnboardingPage() {
    const navigate = useNavigate();
    const { fetchMe } = useAuth();
    const [activeStep, setActiveStep] = useState(0);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const [formData, setFormData] = useState({
        sex: "MALE",
        age: "",
        heightCm: "",
        currentWeightKg: "",
        activityLevel: "SEDENTARY",
        goal: "MAINTENANCE",
        targetWeightKg: "",
        goalDeadline: "",
        specificGoal: "",
        allergies: [],
        diseases: [],
        medicalNotes: ""
    });

    const commonAllergies = ["Peanuts", "Shellfish", "Dairy", "Gluten", "Soy", "Eggs"];
    const commonDiseases = ["Diabetes", "Hypertension", "Asthma", "Heart Disease"];

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleNext = () => {
        // Validate current step
        if (activeStep === 0) {
            if (!formData.age || !formData.heightCm || !formData.currentWeightKg) {
                setError("Please fill in all required fields");
                return;
            }
        }
        setError("");
        setActiveStep((prevActiveStep) => prevActiveStep + 1);
    };

    const handleBack = () => {
        setActiveStep((prevActiveStep) => prevActiveStep - 1);
        setError("");
    };

    const handleSubmit = async () => {
        setError("");
        setLoading(true);

        try {
            const payload = {
                sex: formData.sex,
                age: Number(formData.age),
                heightCm: Number(formData.heightCm),
                currentWeightKg: Number(formData.currentWeightKg),
                activityLevel: formData.activityLevel,
                goal: formData.goal,
                targetWeightKg: formData.targetWeightKg ? Number(formData.targetWeightKg) : null,
                goalDeadline: formData.goalDeadline || null,
                specificGoal: formData.specificGoal || null,
                allergies: formData.allergies,
                diseases: formData.diseases,
                medicalNotes: formData.medicalNotes || null
            };

            await axiosClient.post("/users/profile", payload);
            await fetchMe(); // Refresh user data to update hasProfile flag
            navigate("/user/current-plan", { replace: true });
        } catch (err) {
            console.error("Failed to create profile", err);
            setError(err.response?.data?.message || "Failed to create profile. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <Box sx={{ maxWidth: 900, mx: "auto", py: 5, px: 3 }}>
            <Box sx={{ textAlign: "center", mb: 4 }}>
                <Typography variant="h3" fontWeight={700} color="success.main" gutterBottom>
                    Welcome to FiHealth! 🎉
                </Typography>
                <Typography variant="body1" color="text.secondary">
                    Let's set up your health profile to get personalized recommendations
                </Typography>
            </Box>

            <Stepper activeStep={activeStep} sx={{ mb: 4 }}>
                {steps.map((label) => (
                    <Step key={label}>
                        <StepLabel>{label}</StepLabel>
                    </Step>
                ))}
            </Stepper>

            {error && <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>}

            <Paper elevation={0} sx={{ p: 4, borderRadius: 3, border: "1px solid #e0e0e0" }}>
                {activeStep === 0 && (
                    <Grid container spacing={3}>
                        <Grid item xs={12}>
                            <Typography variant="h6" fontWeight={600} color="success.main" gutterBottom>
                                Tell us about yourself
                            </Typography>
                        </Grid>

                        <Grid item xs={12} sm={6}>
                            <FormControl fullWidth required>
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

                        <Grid item xs={12} sm={6}>
                            <TextField
                                fullWidth
                                required
                                label="Age"
                                name="age"
                                type="number"
                                value={formData.age}
                                onChange={handleChange}
                                inputProps={{ min: 1, max: 120 }}
                            />
                        </Grid>

                        <Grid item xs={12} sm={6}>
                            <TextField
                                fullWidth
                                required
                                label="Height (cm)"
                                name="heightCm"
                                type="number"
                                value={formData.heightCm}
                                onChange={handleChange}
                                inputProps={{ min: 50 }}
                            />
                        </Grid>

                        <Grid item xs={12} sm={6}>
                            <TextField
                                fullWidth
                                required
                                label="Current Weight (kg)"
                                name="currentWeightKg"
                                type="number"
                                value={formData.currentWeightKg}
                                onChange={handleChange}
                                inputProps={{ min: 2, step: 0.1 }}
                            />
                        </Grid>

                        <Grid item xs={12}>
                            <FormControl fullWidth required>
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
                    </Grid>
                )}

                {activeStep === 1 && (
                    <Grid container spacing={3}>
                        <Grid item xs={12}>
                            <Typography variant="h6" fontWeight={600} color="success.main" gutterBottom>
                                Health Information
                            </Typography>
                            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                                This helps us provide safer and more personalized recommendations
                            </Typography>
                        </Grid>

                        <Grid item xs={12} md={6}>
                            <Autocomplete
                                multiple
                                freeSolo
                                options={commonAllergies}
                                value={formData.allergies}
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
                                value={formData.diseases}
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
                                placeholder="Any additional medical information we should know..."
                            />
                        </Grid>
                    </Grid>
                )}

                <Box sx={{ display: "flex", justifyContent: "space-between", mt: 4 }}>
                    <Button
                        disabled={activeStep === 0}
                        onClick={handleBack}
                        sx={{ visibility: activeStep === 0 ? "hidden" : "visible" }}
                    >
                        Back
                    </Button>

                    {activeStep === steps.length - 1 ? (
                        <Button
                            variant="contained"
                            color="success"
                            size="large"
                            onClick={handleSubmit}
                            disabled={loading}
                            startIcon={<Check />}
                        >
                            {loading ? "Creating Profile..." : "Complete Setup"}
                        </Button>
                    ) : (
                        <Button
                            variant="contained"
                            color="success"
                            onClick={handleNext}
                            endIcon={<NavigateNext />}
                        >
                            Next
                        </Button>
                    )}
                </Box>
            </Paper>
        </Box>
    );
}
