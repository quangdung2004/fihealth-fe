import { useState } from "react";
import {
    Box,
    Button,
    Paper,
    TextField,
    Typography,
    Alert,
    InputAdornment,
    IconButton
} from "@mui/material";
import { Save, ArrowBack, Visibility, VisibilityOff } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import axiosClient from "../../api/axiosClient";

export function ChangePasswordPage() {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState(false);

    const [formData, setFormData] = useState({
        oldPassword: "",
        newPassword: "",
        confirmPassword: ""
    });

    const [showPassword, setShowPassword] = useState({
        old: false,
        new: false,
        confirm: false
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        setError("");
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setSuccess(false);

        // Validation
        if (formData.newPassword !== formData.confirmPassword) {
            setError("New password and confirmation do not match");
            return;
        }

        if (formData.newPassword.length < 6) {
            setError("New password must be at least 6 characters");
            return;
        }

        setLoading(true);

        try {
            await axiosClient.patch("/users/change-password", {
                oldPassword: formData.oldPassword,
                newPassword: formData.newPassword,
                confirmationPassword: formData.confirmPassword
            });

            setSuccess(true);
            setFormData({ oldPassword: "", newPassword: "", confirmPassword: "" });

            // Redirect after 2 seconds
            setTimeout(() => {
                navigate("/user/profile");
            }, 2000);
        } catch (err) {
            console.error("Failed to change password", err);
            setError(err.response?.data?.message || "Failed to change password. Please check your current password.");
        } finally {
            setLoading(false);
        }
    };

    const toggleShowPassword = (field) => {
        setShowPassword(prev => ({ ...prev, [field]: !prev[field] }));
    };

    return (
        <Box sx={{ maxWidth: 600, mx: "auto", pb: 5 }}>
            <Button
                startIcon={<ArrowBack />}
                onClick={() => navigate("/user/profile")}
                sx={{ mb: 2 }}
            >
                Back to Profile
            </Button>

            <Typography variant="h4" fontWeight={700} gutterBottom>
                Change Password
            </Typography>

            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                Please enter your current password and choose a new password.
            </Typography>

            {error && <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>}
            {success && (
                <Alert severity="success" sx={{ mb: 3 }}>
                    Password changed successfully! Redirecting...
                </Alert>
            )}

            <Paper elevation={0} sx={{ p: 4, borderRadius: 3, border: "1px solid #e0e0e0" }}>
                <form onSubmit={handleSubmit}>
                    <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
                        <TextField
                            fullWidth
                            label="Current Password"
                            name="oldPassword"
                            type={showPassword.old ? "text" : "password"}
                            value={formData.oldPassword}
                            onChange={handleChange}
                            required
                            InputProps={{
                                endAdornment: (
                                    <InputAdornment position="end">
                                        <IconButton
                                            onClick={() => toggleShowPassword("old")}
                                            edge="end"
                                        >
                                            {showPassword.old ? <VisibilityOff /> : <Visibility />}
                                        </IconButton>
                                    </InputAdornment>
                                )
                            }}
                        />

                        <TextField
                            fullWidth
                            label="New Password"
                            name="newPassword"
                            type={showPassword.new ? "text" : "password"}
                            value={formData.newPassword}
                            onChange={handleChange}
                            required
                            helperText="Must be at least 6 characters"
                            InputProps={{
                                endAdornment: (
                                    <InputAdornment position="end">
                                        <IconButton
                                            onClick={() => toggleShowPassword("new")}
                                            edge="end"
                                        >
                                            {showPassword.new ? <VisibilityOff /> : <Visibility />}
                                        </IconButton>
                                    </InputAdornment>
                                )
                            }}
                        />

                        <TextField
                            fullWidth
                            label="Confirm New Password"
                            name="confirmPassword"
                            type={showPassword.confirm ? "text" : "password"}
                            value={formData.confirmPassword}
                            onChange={handleChange}
                            required
                            InputProps={{
                                endAdornment: (
                                    <InputAdornment position="end">
                                        <IconButton
                                            onClick={() => toggleShowPassword("confirm")}
                                            edge="end"
                                        >
                                            {showPassword.confirm ? <VisibilityOff /> : <Visibility />}
                                        </IconButton>
                                    </InputAdornment>
                                )
                            }}
                        />

                        <Button
                            type="submit"
                            variant="contained"
                            color="success"
                            size="large"
                            startIcon={<Save />}
                            disabled={loading || success}
                            fullWidth
                            sx={{ mt: 2 }}
                        >
                            {loading ? "Changing..." : "Change Password"}
                        </Button>
                    </Box>
                </form>
            </Paper>
        </Box>
    );
}
