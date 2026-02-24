import { useState, useEffect } from "react";
import {
    Box,
    Button,
    Paper,
    TextField,
    Typography,
    Grid,
    Snackbar,
    Alert
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
    const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "success" });

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
            console.error("Lỗi tải thông tin dị ứng", error);
            setSnackbar({ open: true, message: "Lỗi tải thông tin dị ứng", severity: "error" });
            navigate("/admin/allergens");
        } finally {
            setLoading(false);
        }
    };

    // ===== VALIDATION =====
    const validate = () => {
        const tempErrors = {};

        if (!formData.code) {
            tempErrors.code = "Mã CODE là bắt buộc";
        } else if (!/^[A-Z_]+$/.test(formData.code)) {
            tempErrors.code = "Mã CODE chỉ dùng chữ in hoa và dấu gạch dưới";
        }

        if (!formData.name) {
            tempErrors.name = "Tên là bắt buộc";
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
            console.error("Lưu dị ứng thất bại", error);
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
            <Typography variant="h4" fontWeight={700} mb={3}>
                {isEdit ? "Chỉnh sửa dị ứng" : "Tạo mới dị ứng"}
            </Typography>

            <Paper elevation={2} sx={{ p: 4 }}>
                <Box component="form" onSubmit={handleSubmit}>
                    <Grid container spacing={3}>
                        <Grid item xs={12} md={6}>
                            <TextField
                                label="Mã CODE"
                                fullWidth
                                value={formData.code}
                                onChange={(e) =>
                                    setFormData({ ...formData, code: e.target.value })
                                }
                                error={!!errors.code}
                                helperText={
                                    errors.code ||
                                    "Chỉ dùng chữ in hoa và dấu gạch dưới (vd: PEANUT, MILK)"
                                }
                            />
                        </Grid>

                        <Grid item xs={12} md={6}>
                            <TextField
                                label="Tên dị ứng"
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
                                    {isEdit ? "Cập nhật" : "Tạo mới"}
                                </Button>
                                <Button
                                    variant="outlined"
                                    onClick={() => navigate("/admin/allergens")}
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
