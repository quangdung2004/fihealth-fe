import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { generateMealPlan } from "../api/mealPlanApi";
import {
    Box,
    Paper,
    Typography,
    TextField,
    Button,
    Alert,
    CircularProgress,
    Card,
    CardContent,
    Stack,
    MenuItem,
    InputAdornment,
} from "@mui/material";
import {
    FitnessCenter,
    AutoAwesome,
    Send,
    Visibility,
    CalendarMonth,
    AttachMoney,
} from "@mui/icons-material";

/**
 * Helper function to format VND currency
 */
function formatVnd(amount) {
    if (amount == null) return "0 ₫";
    return new Intl.NumberFormat("vi-VN").format(amount) + " ₫";
}

/**
 * UUID validation regex
 */
const UUID_REGEX =
    /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

function MealPlanGeneratePage() {
    const navigate = useNavigate();

    const [assessmentId, setAssessmentId] = useState("");
    const [period, setPeriod] = useState("WEEK");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [result, setResult] = useState(null);

    const PERIOD_OPTIONS = [
        { value: "DAY", label: "1 ngày (DAY)" },
        { value: "WEEK", label: "7 ngày (WEEK)" },
        { value: "MONTH", label: "30 ngày (MONTH)" },
    ];

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setResult(null);

        // Validate UUID format
        if (!UUID_REGEX.test(assessmentId.trim())) {
            setError("Assessment ID không đúng định dạng UUID");
            return;
        }

        setLoading(true);

        try {
            const data = await generateMealPlan(assessmentId.trim(), period);
            setResult(data);
        } catch (err) {
            console.error("Generate meal plan error:", err);

            // Handle timeout error specifically
            if (err.code === 'ECONNABORTED' || err.message?.includes('timeout')) {
                setError(
                    "⏰ Hệ thống xử lý lâu hơn dự kiến (>90 giây). " +
                    "Vui lòng thử lại hoặc chọn period DAY để giảm thời gian xử lý."
                );
            } else {
                setError(err?.response?.data?.message || err.message || "Tạo meal plan thất bại");
            }
        } finally {
            setLoading(false);
        }
    };

    const handleViewDetail = () => {
        if (result?.mealPlanId) {
            navigate(`/meal-plans/${result.mealPlanId}`);
        }
    };

    return (
        <Box
            sx={{
                position: "fixed",
                inset: 0,
                display: "flex",
                overflow: "hidden",
                bgcolor: "#fff",
            }}
        >
            {/* LEFT */}
            <Box
                sx={{
                    flex: 1,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    px: 2,
                    overflowY: "auto",
                }}
            >
                <Paper elevation={3} sx={{ p: 4, width: "100%", maxWidth: 560, my: 2 }}>
                    {/* Header */}
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1 }}>
                        <FitnessCenter color="success" fontSize="large" />
                        <Box>
                            <Typography variant="h4" fontWeight={800}>
                                FiHealth
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                                Tạo Meal Plan từ Assessment
                            </Typography>
                        </Box>
                    </Box>

                    <Typography color="text.secondary" mb={2}>
                        Nhập Assessment ID và chọn period để tạo meal plan tự động.
                    </Typography>

                    {/* AI Highlight */}
                    <Paper
                        variant="outlined"
                        sx={{
                            p: 2,
                            mb: 3,
                            bgcolor: "#f1fdf9",
                            borderColor: "#cceee5",
                        }}
                    >
                        <Box sx={{ display: "flex", gap: 1 }}>
                            <AutoAwesome color="success" />
                            <Box>
                                <Typography fontWeight={700}>Được hỗ trợ bởi AI</Typography>
                                <Typography variant="body2" color="text.secondary">
                                    Tạo meal plan tự động dựa trên đánh giá dinh dưỡng
                                </Typography>
                            </Box>
                        </Box>
                    </Paper>

                    {/* Loading Info */}
                    {loading && (
                        <Alert severity="info" sx={{ mb: 2 }}>
                            ⏳ Đang tạo meal plan bằng AI, có thể mất 20-90 giây tùy theo period. Vui lòng đợi...
                        </Alert>
                    )}

                    {/* Error Alert */}
                    {error && (
                        <Alert severity="error" sx={{ mb: 2 }}>
                            {error}
                        </Alert>
                    )}

                    {/* Form */}
                    <Box component="form" onSubmit={handleSubmit}>
                        <TextField
                            label="Assessment ID *"
                            fullWidth
                            value={assessmentId}
                            onChange={(e) => setAssessmentId(e.target.value)}
                            placeholder="xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"
                            required
                            disabled={loading}
                            error={assessmentId && !UUID_REGEX.test(assessmentId.trim())}
                            helperText={
                                assessmentId && !UUID_REGEX.test(assessmentId.trim())
                                    ? "Định dạng UUID không hợp lệ"
                                    : "Nhập UUID của assessment"
                            }
                            sx={{ mb: 2 }}
                        />

                        <TextField
                            select
                            fullWidth
                            label="Period *"
                            value={period}
                            onChange={(e) => setPeriod(e.target.value)}
                            disabled={loading}
                            sx={{ mb: 3 }}
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <CalendarMonth />
                                    </InputAdornment>
                                ),
                            }}
                        >
                            {PERIOD_OPTIONS.map((option) => (
                                <MenuItem key={option.value} value={option.value}>
                                    {option.label}
                                </MenuItem>
                            ))}
                        </TextField>

                        <Button
                            type="submit"
                            variant="contained"
                            color="success"
                            fullWidth
                            startIcon={loading ? <CircularProgress size={20} /> : <Send />}
                            disabled={loading || !assessmentId || !UUID_REGEX.test(assessmentId.trim())}
                            sx={{ py: 1.2 }}
                        >
                            {loading ? "⏳ Đang tạo... (có thể mất 20-90s)" : "Tạo Meal Plan"}
                        </Button>
                    </Box>

                    {/* Success Result Card */}
                    {result && (
                        <>
                            <Alert severity="success" sx={{ mt: 3, mb: 2 }}>
                                Tạo meal plan thành công!
                            </Alert>

                            <Card variant="outlined" sx={{ bgcolor: "#f9fafb" }}>
                                <CardContent>
                                    <Typography variant="h6" fontWeight={700} mb={2}>
                                        Meal Plan Summary
                                    </Typography>

                                    <Stack spacing={1.5}>
                                        <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                                            <Typography color="text.secondary">Meal Plan ID:</Typography>
                                            <Typography
                                                fontWeight={600}
                                                sx={{
                                                    fontFamily: "monospace",
                                                    fontSize: "0.85rem",
                                                    wordBreak: "break-all",
                                                }}
                                            >
                                                {result.mealPlanId}
                                            </Typography>
                                        </Box>

                                        <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                                            <Typography color="text.secondary">
                                                <CalendarMonth fontSize="small" sx={{ verticalAlign: "middle", mr: 0.5 }} />
                                                Tổng số ngày:
                                            </Typography>
                                            <Typography fontWeight={700} color="success.main">
                                                {result.totalDays} ngày
                                            </Typography>
                                        </Box>

                                        <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                                            <Typography color="text.secondary">
                                                <AttachMoney fontSize="small" sx={{ verticalAlign: "middle", mr: 0.5 }} />
                                                Chi phí ước tính:
                                            </Typography>
                                            <Typography fontWeight={700} color="primary.main">
                                                {formatVnd(result.estimatedTotalCostVnd)}
                                            </Typography>
                                        </Box>
                                    </Stack>

                                    <Button
                                        variant="contained"
                                        color="primary"
                                        fullWidth
                                        startIcon={<Visibility />}
                                        onClick={handleViewDetail}
                                        sx={{ mt: 3 }}
                                    >
                                        Xem chi tiết
                                    </Button>
                                </CardContent>
                            </Card>
                        </>
                    )}

                    <Box sx={{ mt: 3, textAlign: "center" }}>
                        <Button size="small" onClick={() => navigate("/")}>
                            ← Về trang chủ
                        </Button>
                    </Box>
                </Paper>
            </Box>

            {/* RIGHT - Background image */}
            <Box
                sx={{
                    flex: 1,
                    display: { xs: "none", md: "block" },
                    position: "relative",
                    backgroundImage:
                        "url(https://images.unsplash.com/photo-1490645935967-10de6ba17061?w=1600&q=80)",
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                }}
            >
                <Box sx={{ position: "absolute", inset: 0, bgcolor: "rgba(255,255,255,0.75)" }} />
            </Box>
        </Box>
    );
}

export default MealPlanGeneratePage;
