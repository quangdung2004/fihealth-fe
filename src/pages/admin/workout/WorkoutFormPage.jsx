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
    FormHelperText,
    Snackbar,
    Alert
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

    // Snackbar State
    const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "success" });

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
            console.error("Lỗi khi tải bài tập", error);
            setSnackbar({ open: true, message: "Lỗi tải bài tập", severity: "error" });
            navigate("/admin/workouts");
        } finally {
            setLoading(false);
        }
    };

    const validate = () => {
        const newErrors = {};
        if (!formData.name.trim()) newErrors.name = "Tên là bắt buộc";
        if (formData.name.length > 200) newErrors.name = "Tên không được vượt quá 200 ký tự";
        if (formData.muscleGroups.length > 500) newErrors.muscleGroups = "Nhóm cơ không được vượt quá 500 ký tự";
        if (formData.contraindications.length > 500) newErrors.contraindications = "Chống chỉ định không được vượt quá 500 ký tự";

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
            console.error("Lỗi khi lưu bài tập", error);
            setSnackbar({ open: true, message: "Lưu thất bại!", severity: "error" });
        } finally {
            setLoading(false);
        }
    };

    const handleCloseSnackbar = () => {
        setSnackbar({ ...snackbar, open: false });
    };

    return (
        <Box>
            <Box sx={{ display: "flex", alignItems: "center", mb: 3 }}>
                <Button
                    startIcon={<ArrowBack />}
                    onClick={() => navigate("/admin/workouts")}
                    sx={{ mr: 2 }}
                >
                    Trở lại
                </Button>
                <Typography variant="h4" fontWeight={700}>
                    {isEdit ? "Chỉnh sửa bài tập" : "Tạo bài tập mới"}
                </Typography>
            </Box>

            <Paper elevation={2} sx={{ p: 4 }}>
                <form onSubmit={handleSubmit}>
                    <Grid container spacing={3}>
                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                label="Tên bài tập"
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
                                <InputLabel>Độ khó</InputLabel>
                                <Select
                                    name="level"
                                    value={formData.level}
                                    label="Độ khó"
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
                                <InputLabel>Loại bài tập</InputLabel>
                                <Select
                                    name="type"
                                    value={formData.type}
                                    label="Loại bài tập"
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
                                <InputLabel>Dụng cụ</InputLabel>
                                <Select
                                    name="equipment"
                                    value={formData.equipment}
                                    label="Dụng cụ"
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
                                label="Nhóm cơ (phân cách bằng dấu phẩy)"
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
                                label="Chống chỉ định"
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
                                label="Hoạt động"
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
                                {loading ? "Đang lưu..." : "Lưu bài tập"}
                            </Button>
                        </Grid>
                    </Grid>
                </form>
            </Paper>

            <Snackbar
                open={snackbar.open}
                autoHideDuration={4000}
                onClose={handleCloseSnackbar}
                anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
            >
                <Alert onClose={handleCloseSnackbar} severity={snackbar.severity} sx={{ width: '100%' }}>
                    {snackbar.message}
                </Alert>
            </Snackbar>
        </Box>
    );
}
