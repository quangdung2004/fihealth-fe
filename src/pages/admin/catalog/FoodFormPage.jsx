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
    Chip,
    Snackbar,
    Alert
} from "@mui/material";
import { useNavigate, useParams } from "react-router-dom";
import axiosClient from "../../../api/axiosClient";
import foodApi from "../../../api/foodApi";

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
    const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "success" });

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
            console.error("Lỗi tải danh sách dị ứng", error);
            setSnackbar({ open: true, message: "Lỗi tải danh sách dị ứng", severity: "error" });
            setAvailableAllergens([]);
        }
    };

    const fetchFood = async () => {
        setLoading(true);
        try {
            const res = await foodApi.adminGetById(id);
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
            console.error("Lỗi tải thông tin món ăn", error);
            setSnackbar({ open: true, message: "Lỗi tải thông tin món ăn", severity: "error" });
            navigate("/admin/foods");
        } finally {
            setLoading(false);
        }
    };

    /* ===================== VALIDATE ===================== */

    const validate = () => {
        const temp = {};

        if (!formData.name) temp.name = "Tên là bắt buộc";
        if (formData.kcalPerServing === "" || formData.kcalPerServing < 0) temp.kcalPerServing = "Kcal không hợp lệ";
        if (formData.proteinG === "" || formData.proteinG < 0) temp.proteinG = "Đạm không hợp lệ";
        if (formData.fatG === "" || formData.fatG < 0) temp.fatG = "Chất béo không hợp lệ";
        if (formData.carbG === "" || formData.carbG < 0) temp.carbG = "Tinh bột không hợp lệ";
        if (
            formData.estimatedPriceVndPerServing === "" ||
            formData.estimatedPriceVndPerServing < 0
        ) {
            temp.estimatedPriceVndPerServing = "Giá tiền không hợp lệ";
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
                await foodApi.adminUpdate(id, payload);
            } else {
                await foodApi.adminCreate(payload);
            }

            navigate("/admin/foods");
        } catch (error) {
            console.error("Lỗi lưu món ăn", error);
            setSnackbar({ open: true, message: "Lưu thất bại!", severity: "error" });
        } finally {
            setLoading(false);
        }
    };

    const handleCloseSnackbar = () => {
        setSnackbar({ ...snackbar, open: false });
    };

    /* ===================== UI ===================== */

    return (
        <Box>
            <Typography variant="h4" fontWeight={700} mb={3}>
                {isEdit ? "Chỉnh sửa món ăn" : "Tạo món ăn mới"}
            </Typography>

            <Paper elevation={2} sx={{ p: 4 }}>
                <Box component="form" onSubmit={handleSubmit}>
                    <Grid container spacing={3}>

                        <Grid size={{ xs: 12, md: 6 }}>
                            <TextField
                                label="Tên món ăn"
                                fullWidth
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                error={!!errors.name}
                                helperText={errors.name}
                            />
                        </Grid>

                        <Grid size={{ xs: 12, md: 6 }}>
                            <TextField
                                label="Thương hiệu"
                                fullWidth
                                value={formData.brand}
                                onChange={(e) => setFormData({ ...formData, brand: e.target.value })}
                            />
                        </Grid>

                        <Grid size={{ xs: 12, md: 4 }}>
                            <TextField
                                label="Khẩu phần"
                                fullWidth
                                value={formData.servingSize}
                                onChange={(e) => setFormData({ ...formData, servingSize: e.target.value })}
                            />
                        </Grid>

                        <Grid size={{ xs: 12, md: 4 }}>
                            <TextField
                                label="Kcal"
                                type="number"
                                fullWidth
                                value={formData.kcalPerServing}
                                onChange={(e) => setFormData({ ...formData, kcalPerServing: e.target.value })}
                                error={!!errors.kcalPerServing}
                                helperText={errors.kcalPerServing}
                            />
                        </Grid>

                        <Grid size={{ xs: 12, md: 4 }}>
                            <TextField
                                label="Giá (VND)"
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

                        <Grid size={{ xs: 12, md: 4 }}>
                            <TextField
                                label="Chất đạm - Protein (g)"
                                type="number"
                                fullWidth
                                value={formData.proteinG}
                                onChange={(e) => setFormData({ ...formData, proteinG: e.target.value })}
                                error={!!errors.proteinG}
                                helperText={errors.proteinG}
                            />
                        </Grid>

                        <Grid size={{ xs: 12, md: 4 }}>
                            <TextField
                                label="Chất béo - Fat (g)"
                                type="number"
                                fullWidth
                                value={formData.fatG}
                                onChange={(e) => setFormData({ ...formData, fatG: e.target.value })}
                                error={!!errors.fatG}
                                helperText={errors.fatG}
                            />
                        </Grid>

                        <Grid size={{ xs: 12, md: 4 }}>
                            <TextField
                                label="Tinh bột - Carbs (g)"
                                type="number"
                                fullWidth
                                value={formData.carbG}
                                onChange={(e) => setFormData({ ...formData, carbG: e.target.value })}
                                error={!!errors.carbG}
                                helperText={errors.carbG}
                            />
                        </Grid>

                        <Grid size={{ xs: 12 }}>
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
                                    <TextField {...params} label="Dị ứng" />
                                )}
                            />
                        </Grid>

                        <Grid size={{ xs: 12 }}>
                            <TextField
                                label="Nhãn (Tags)"
                                fullWidth
                                multiline
                                rows={2}
                                value={formData.tags}
                                onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                            />
                        </Grid>

                        <Grid size={{ xs: 12 }}>
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
                                label="Hoạt động"
                            />
                        </Grid>

                        <Grid size={{ xs: 12 }}>
                            <Box sx={{ display: "flex", gap: 2 }}>
                                <Button
                                    type="submit"
                                    variant="contained"
                                    color="success"
                                    disabled={loading}
                                >
                                    {isEdit ? "Cập nhật" : "Tạo mới"}
                                </Button>
                                <Button
                                    variant="outlined"
                                    onClick={() => navigate("/admin/foods")}
                                    disabled={loading}
                                >
                                    Hủy
                                </Button>
                            </Box>
                        </Grid>

                    </Grid>
                </Box>
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