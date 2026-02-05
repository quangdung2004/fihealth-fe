import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getMealPlanDetail } from "../api/mealPlanApi";
import {
    Box,
    Paper,
    Typography,
    Alert,
    CircularProgress,
    Divider,
    Card,
    CardContent,
    Chip,
    Stack,
    Button,
    Accordion,
    AccordionSummary,
    AccordionDetails,
    List,
    ListItem,
    ListItemText,
} from "@mui/material";
import {
    FitnessCenter,
    ExpandMore,
    Restaurant,
    CalendarToday,
    AttachMoney,
    LocalFireDepartment,
} from "@mui/icons-material";

/**
 * Helper function to format VND currency
 */
function formatVnd(amount) {
    if (amount == null) return "0 ₫";
    return new Intl.NumberFormat("vi-VN").format(amount) + " ₫";
}

/**
 * Map meal type to Vietnamese label
 */
function getMealTypeLabel(mealType) {
    const map = {
        BREAKFAST: "Bữa sáng",
        LUNCH: "Bữa trưa",
        DINNER: "Bữa tối",
        SNACK: "Bữa phụ",
    };
    return map[mealType] || mealType;
}

/**
 * Get color for meal type chip
 */
function getMealTypeColor(mealType) {
    const map = {
        BREAKFAST: "warning",
        LUNCH: "success",
        DINNER: "info",
        SNACK: "secondary",
    };
    return map[mealType] || "default";
}

function MealPlanDetailPage() {
    const { id } = useParams();
    const navigate = useNavigate();

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [mealPlan, setMealPlan] = useState(null);

    useEffect(() => {
        let isMounted = true;

        const fetchData = async () => {
            if (!id) {
                setError("Meal Plan ID không được cung cấp");
                setLoading(false);
                return;
            }

            try {
                setLoading(true);
                setError("");
                const data = await getMealPlanDetail(id);

                if (isMounted) {
                    setMealPlan(data);
                }
            } catch (err) {
                if (!isMounted) return;

                const status = err?.response?.status;

                if (status === 401) {
                    // Token expired or unauthorized
                    localStorage.removeItem("accessToken");
                    navigate("/login");
                    return;
                }

                if (status === 403) {
                    setError("Forbidden: Bạn không có quyền truy cập meal plan này");
                } else if (status === 404) {
                    setError("Not Found: Không tìm thấy meal plan với ID này");
                } else {
                    setError(err?.response?.data?.message || err.message || "Lỗi tải meal plan");
                }
            } finally {
                if (isMounted) {
                    setLoading(false);
                }
            }
        };

        fetchData();

        return () => {
            isMounted = false;
        };
    }, [id, navigate]);

    if (loading) {
        return (
            <Box
                sx={{
                    position: "fixed",
                    inset: 0,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    bgcolor: "#fff",
                }}
            >
                <Box sx={{ textAlign: "center" }}>
                    <CircularProgress size={60} />
                    <Typography mt={2} color="text.secondary">
                        Đang tải meal plan...
                    </Typography>
                </Box>
            </Box>
        );
    }

    if (error) {
        return (
            <Box
                sx={{
                    position: "fixed",
                    inset: 0,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    bgcolor: "#fff",
                    px: 2,
                }}
            >
                <Paper elevation={3} sx={{ p: 4, maxWidth: 500 }}>
                    <Alert severity="error" sx={{ mb: 2 }}>
                        {error}
                    </Alert>
                    <Button variant="outlined" onClick={() => navigate("/")}>
                        ← Về trang chủ
                    </Button>
                </Paper>
            </Box>
        );
    }

    if (!mealPlan) {
        return (
            <Box
                sx={{
                    position: "fixed",
                    inset: 0,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    bgcolor: "#fff",
                }}
            >
                <Typography color="text.secondary">Không có dữ liệu</Typography>
            </Box>
        );
    }

    return (
        <Box
            sx={{
                minHeight: "100vh",
                bgcolor: "#f5f5f5",
                py: 4,
                px: 2,
            }}
        >
            <Box sx={{ maxWidth: 1200, mx: "auto" }}>
                {/* Header */}
                <Paper elevation={2} sx={{ p: 3, mb: 3 }}>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 2 }}>
                        <FitnessCenter color="success" fontSize="large" />
                        <Typography variant="h4" fontWeight={800}>
                            FiHealth
                        </Typography>
                    </Box>

                    <Typography variant="h5" fontWeight={700} mb={2}>
                        Chi tiết Meal Plan
                    </Typography>

                    <Stack direction={{ xs: "column", sm: "row" }} spacing={2} flexWrap="wrap">
                        <Chip
                            icon={<CalendarToday />}
                            label={`Period: ${mealPlan.period}`}
                            color="primary"
                            variant="outlined"
                        />
                        <Chip
                            icon={<CalendarToday />}
                            label={`${mealPlan.startDate} → ${mealPlan.endDate}`}
                            color="info"
                            variant="outlined"
                        />
                        <Chip
                            label={`${mealPlan.totalDays} ngày`}
                            color="success"
                            variant="outlined"
                        />
                        <Chip
                            icon={<AttachMoney />}
                            label={formatVnd(mealPlan.estimatedTotalCostVnd)}
                            color="warning"
                            variant="outlined"
                        />
                    </Stack>
                </Paper>

                {/* Days */}
                {mealPlan.days && mealPlan.days.length > 0 ? (
                    mealPlan.days.map((day) => (
                        <Accordion key={day.dayIndex} defaultExpanded={day.dayIndex === 1}>
                            <AccordionSummary expandIcon={<ExpandMore />}>
                                <Box sx={{ display: "flex", alignItems: "center", gap: 2, width: "100%" }}>
                                    <Typography fontWeight={700}>
                                        Ngày {day.dayIndex}: {day.date}
                                    </Typography>
                                    <Chip
                                        icon={<LocalFireDepartment />}
                                        label={`${day.totalKcal} kcal`}
                                        size="small"
                                        color="error"
                                    />
                                    <Chip
                                        icon={<AttachMoney />}
                                        label={formatVnd(day.costVnd)}
                                        size="small"
                                        color="warning"
                                    />
                                </Box>
                            </AccordionSummary>

                            <AccordionDetails>
                                <Stack spacing={2}>
                                    {day.meals && day.meals.length > 0 ? (
                                        day.meals.map((meal, mealIdx) => (
                                            <Card key={mealIdx} variant="outlined">
                                                <CardContent>
                                                    {/* Meal Header */}
                                                    <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1 }}>
                                                        <Restaurant color="action" />
                                                        <Typography fontWeight={700}>{meal.name}</Typography>
                                                        <Chip
                                                            label={getMealTypeLabel(meal.mealType)}
                                                            color={getMealTypeColor(meal.mealType)}
                                                            size="small"
                                                        />
                                                        <Chip
                                                            icon={<LocalFireDepartment />}
                                                            label={`${meal.kcal} kcal`}
                                                            size="small"
                                                            variant="outlined"
                                                        />
                                                        <Chip
                                                            icon={<AttachMoney />}
                                                            label={formatVnd(meal.costVnd)}
                                                            size="small"
                                                            variant="outlined"
                                                        />
                                                    </Box>

                                                    <Divider sx={{ my: 1 }} />

                                                    {/* Meal Items */}
                                                    {meal.items && meal.items.length > 0 ? (
                                                        <Stack spacing={1.5}>
                                                            {meal.items.map((item, itemIdx) => (
                                                                <Box key={itemIdx}>
                                                                    <Typography fontWeight={600} color="primary">
                                                                        {item.recipeName || "Recipe"} - {item.amount}
                                                                    </Typography>
                                                                    <Typography variant="body2" color="text.secondary">
                                                                        {item.kcal} kcal • {formatVnd(item.costVnd)}
                                                                    </Typography>

                                                                    {/* Ingredients */}
                                                                    {item.ingredients && item.ingredients.length > 0 && (
                                                                        <List dense sx={{ pl: 2 }}>
                                                                            {item.ingredients.map((ingredient, ingIdx) => (
                                                                                <ListItem key={ingIdx} disablePadding>
                                                                                    <ListItemText
                                                                                        primary={`• ${ingredient.foodItemName} - ${ingredient.amount}`}
                                                                                        primaryTypographyProps={{
                                                                                            variant: "body2",
                                                                                            color: "text.secondary",
                                                                                        }}
                                                                                    />
                                                                                </ListItem>
                                                                            ))}
                                                                        </List>
                                                                    )}
                                                                </Box>
                                                            ))}
                                                        </Stack>
                                                    ) : (
                                                        <Typography variant="body2" color="text.secondary">
                                                            Không có món ăn
                                                        </Typography>
                                                    )}
                                                </CardContent>
                                            </Card>
                                        ))
                                    ) : (
                                        <Typography variant="body2" color="text.secondary">
                                            Không có bữa ăn trong ngày này
                                        </Typography>
                                    )}
                                </Stack>
                            </AccordionDetails>
                        </Accordion>
                    ))
                ) : (
                    <Paper sx={{ p: 3 }}>
                        <Typography color="text.secondary">Không có dữ liệu ngày nào</Typography>
                    </Paper>
                )}

                {/* Footer */}
                <Box sx={{ mt: 3, textAlign: "center" }}>
                    <Button variant="outlined" onClick={() => navigate("/")}>
                        ← Về trang chủ
                    </Button>
                </Box>
            </Box>
        </Box>
    );
}

export default MealPlanDetailPage;
