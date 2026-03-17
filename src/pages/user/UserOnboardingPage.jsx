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
    allergies: [],
    diseases: [],
    medicalNotes: ""
  });

  const commonAllergies = [
    "Peanuts",
    "Shellfish",
    "Dairy",
    "Gluten",
    "Soy",
    "Eggs"
  ];

  const commonDiseases = [
    "Diabetes",
    "Hypertension",
    "Asthma",
    "Heart Disease"
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  /* ================= VALIDATION ================= */

  const validateStepOne = () => {
    const age = Number(formData.age);
    const height = Number(formData.heightCm);
    const weight = Number(formData.currentWeightKg);

    if (!age || !height || !weight) {
      return "Please fill in all required fields";
    }

    if (age < 10 || age > 100) {
      return "Age must be between 10 and 100";
    }

    if (height < 100 || height > 250) {
      return "Height must be between 100cm and 250cm";
    }

    if (weight < 30 || weight > 300) {
      return "Weight must be between 30kg and 300kg";
    }

    return null;
  };

  const handleNext = () => {
    if (activeStep === 0) {
      const validationError = validateStepOne();
      if (validationError) {
        setError(validationError);
        return;
      }
    }

    setError("");
    setActiveStep((prev) => prev + 1);
  };

  const handleBack = () => {
    setActiveStep((prev) => prev - 1);
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
        allergies: formData.allergies,
        diseases: formData.diseases,
        medicalNotes: formData.medicalNotes || null
      };

      await axiosClient.post("/users/profile", payload);
      await fetchMe();
      navigate("/user/current-plan", { replace: true });
    } catch (err) {
      setError(
        err.response?.data?.message ||
        "Failed to create profile. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ maxWidth: 900, mx: "auto", py: 5, px: 3 }}>
      {/* HEADER */}
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

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      <Paper elevation={0} sx={{ p: 4, borderRadius: 3, border: "1px solid #e0e0e0" }}>
        {/* STEP 1 */}
        {activeStep === 0 && (
          <Grid container spacing={3}>
            <Grid size={12}>
              <Typography variant="h6" fontWeight={600} color="success.main">
                Tell us about yourself
              </Typography>
            </Grid>

            <Grid size={{ xs: 12, sm: 6 }}>
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

            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField
                fullWidth
                required
                label="Age"
                name="age"
                type="number"
                value={formData.age}
                onChange={handleChange}
                inputProps={{ min: 10, max: 100 }}
              />
            </Grid>

            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField
                fullWidth
                required
                label="Height (cm)"
                name="heightCm"
                type="number"
                value={formData.heightCm}
                onChange={handleChange}
                inputProps={{ min: 100, max: 250 }}
              />
            </Grid>

            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField
                fullWidth
                required
                label="Current Weight (kg)"
                name="currentWeightKg"
                type="number"
                value={formData.currentWeightKg}
                onChange={handleChange}
                inputProps={{ min: 30, max: 300, step: 0.1 }}
              />
            </Grid>

            <Grid size={12}>
              <FormControl fullWidth required>
                <InputLabel>Activity Level</InputLabel>
                <Select
                  name="activityLevel"
                  value={formData.activityLevel}
                  label="Activity Level"
                  onChange={handleChange}
                >
                  <MenuItem value="SEDENTARY">Sedentary</MenuItem>
                  <MenuItem value="LIGHT">Light</MenuItem>
                  <MenuItem value="MODERATE">Moderate</MenuItem>
                  <MenuItem value="ACTIVE">Active</MenuItem>
                  <MenuItem value="VERY_ACTIVE">Very Active</MenuItem>
                </Select>
              </FormControl>
            </Grid>

            <Grid size={12}>
              <FormControl fullWidth required>
                <InputLabel>Goal</InputLabel>
                <Select
                  name="goal"
                  value={formData.goal}
                  label="Goal"
                  onChange={handleChange}
                >
                  <MenuItem value="FAT_LOSS">Fat Loss</MenuItem>
                  <MenuItem value="MUSCLE_GAIN">Muscle Gain</MenuItem>
                  <MenuItem value="MAINTENANCE">Maintenance</MenuItem>
                </Select>
              </FormControl>
            </Grid>
          </Grid>
        )}

        {/* STEP 2 */}
        {activeStep === 1 && (
          <Grid container spacing={3}>
            <Grid size={12}>
              <Typography variant="h6" fontWeight={600} color="success.main">
                Health Information
              </Typography>
            </Grid>

            <Grid size={{ xs: 12, md: 6 }}>
              <Autocomplete
                multiple
                freeSolo
                options={commonAllergies}
                value={formData.allergies}
                onChange={(e, newValue) =>
                  setFormData((prev) => ({ ...prev, allergies: newValue }))
                }
                renderTags={(value, getTagProps) =>
                  value.map((option, index) => (
                    <Chip
                      {...getTagProps({ index })}
                      key={index}
                      variant="outlined"
                      color="error"
                      label={option}
                    />
                  ))
                }
                renderInput={(params) => (
                  <TextField {...params} label="Allergies" />
                )}
              />
            </Grid>

            <Grid size={{ xs: 12, md: 6 }}>
              <Autocomplete
                multiple
                freeSolo
                options={commonDiseases}
                value={formData.diseases}
                onChange={(e, newValue) =>
                  setFormData((prev) => ({ ...prev, diseases: newValue }))
                }
                renderTags={(value, getTagProps) =>
                  value.map((option, index) => (
                    <Chip
                      {...getTagProps({ index })}
                      key={index}
                      variant="outlined"
                      color="info"
                      label={option}
                    />
                  ))
                }
                renderInput={(params) => (
                  <TextField {...params} label="Diseases / Conditions" />
                )}
              />
            </Grid>

            <Grid size={12}>
              <TextField
                fullWidth
                label="Medical Notes"
                name="medicalNotes"
                multiline
                rows={4}
                value={formData.medicalNotes}
                onChange={handleChange}
              />
            </Grid>
          </Grid>
        )}

        {/* BUTTONS */}
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