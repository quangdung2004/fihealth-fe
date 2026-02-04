import { useNavigate } from "react-router-dom";
import {
    Box,
    Typography,
    Paper,
    Grid,
    Avatar,
    Chip,
    Divider,
    Button,
    CircularProgress,
    Card,
    CardContent
} from "@mui/material";
import {
    Edit,
    CalendarToday,
    Height,
    MonitorWeight,
    FitnessCenter,
    MedicalServices,
    Warning
} from "@mui/icons-material";
import { useAuth } from "../../components/common/AuthContext";

export function UserProfilePage() {
    const navigate = useNavigate();
    const { me: user, loadingMe } = useAuth();

    if (loadingMe) {
        return (
            <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "50vh" }}>
                <CircularProgress color="success" />
            </Box>
        );
    }

    if (!user) {
        return (
            <Box sx={{ textAlign: "center", mt: 5 }}>
                <Typography variant="h6" color="error">
                    Failed to load profile.
                </Typography>
            </Box>
        );
    }

    const { profile } = user;
    const hasProfile = user.hasProfile && profile;

    return (
        <Box sx={{ maxWidth: 1100, mx: "auto", pb: 6 }}>
            {/* ================= HEADER ================= */}
            <Paper
                elevation={0}
                sx={{
                    p: 4,
                    mb: 4,
                    borderRadius: 4,
                    background: "linear-gradient(135deg, #10b981 0%, #059669 100%)",
                    color: "white"
                }}
            >
                <Grid container spacing={3} alignItems="center">
                    <Grid item>
                        <Avatar
                            sx={{
                                width: 96,
                                height: 96,
                                bgcolor: "#fff",
                                color: "success.main",
                                fontSize: "2rem",
                                fontWeight: 700
                            }}
                        >
                            {user.fullName?.charAt(0) || "U"}
                        </Avatar>
                    </Grid>

                    <Grid item xs>
                        <Typography variant="h4" fontWeight={700}>
                            {user.fullName}
                        </Typography>
                        <Typography sx={{ opacity: 0.9 }}>
                            {user.email}
                        </Typography>
                        <Chip
                            label={user.membership || "FREE"}
                            sx={{
                                mt: 1,
                                bgcolor: "rgba(255,255,255,0.2)",
                                color: "white",
                                fontWeight: 600
                            }}
                        />
                    </Grid>

                    <Grid item>
                        <Button
                            variant="contained"
                            startIcon={<Edit />}
                            sx={{
                                bgcolor: "white",
                                color: "success.main",
                                fontWeight: 600
                            }}
                            onClick={() => navigate("/user/profile/edit")}
                        >
                            Edit Profile
                        </Button>
                    </Grid>
                </Grid>
            </Paper>

            {/* ================= BODY ================= */}
            {!hasProfile ? (
                <Paper sx={{ p: 5, textAlign: "center", borderRadius: 3 }}>
                    <Typography variant="h6" fontWeight={600} gutterBottom>
                        No health profile yet
                    </Typography>
                    <Button
                        variant="contained"
                        color="success"
                        onClick={() => navigate("/user/onboarding")}
                    >
                        Create Health Profile
                    </Button>
                </Paper>
            ) : (
                <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
                    {/* ========== PHYSICAL STATS (TRÊN) ========== */}
                    <Card elevation={0} sx={{ borderRadius: 3, border: "1px solid #e5e7eb" }}>
                        <CardContent>
                            <Typography
                                variant="h6"
                                fontWeight={600}
                                sx={{ display: "flex", alignItems: "center", gap: 1 }}
                            >
                                <FitnessCenter color="success" />
                                Physical Stats
                            </Typography>

                            <Divider sx={{ my: 2 }} />

                            <Grid container spacing={2}>
                                <Grid item xs={12} md={3}>
                                    <StatBox icon={<Height />} label="Height" value={`${profile.heightCm} cm`} />
                                </Grid>
                                <Grid item xs={12} md={3}>
                                    <StatBox icon={<MonitorWeight />} label="Weight" value={`${profile.currentWeightKg} kg`} />
                                </Grid>
                                <Grid item xs={12} md={3}>
                                    <StatBox icon={<CalendarToday />} label="Age" value={`${profile.age} years`} />
                                </Grid>
                                <Grid item xs={12} md={3}>
                                    <StatBox
                                        icon={<FitnessCenter />}
                                        label="Activity"
                                        value={profile.activityLevel?.replace(/_/g, " ")}
                                    />
                                </Grid>
                            </Grid>
                        </CardContent>
                    </Card>

                    {/* ========== HEALTH INFO (DƯỚI – NGANG) ========== */}
                    <Card elevation={0} sx={{ borderRadius: 3, border: "1px solid #e5e7eb" }}>
                        <CardContent>
                            <Typography
                                variant="h6"
                                fontWeight={600}
                                sx={{ display: "flex", alignItems: "center", gap: 1 }}
                            >
                                <MedicalServices color="warning" />
                                Health Info
                            </Typography>

                            <Divider sx={{ my: 2 }} />

                            <Grid container spacing={2}>
                                <Grid item xs={12} md={6}>
                                    <StatBox
                                        icon={<Warning color="error" />}
                                        label="Allergies"
                                        value={
                                            profile.allergies?.length
                                                ? profile.allergies.join(", ")
                                                : "None"
                                        }
                                    />
                                </Grid>

                                <Grid item xs={12} md={6}>
                                    <StatBox
                                        icon={<MedicalServices />}
                                        label="Diseases"
                                        value={
                                            profile.diseases?.length
                                                ? profile.diseases.join(", ")
                                                : "None"
                                        }
                                    />
                                </Grid>

                                <Grid item xs={12} md={6}>
                                    <StatBox
                                        label="Medical Notes"
                                        value={profile.medicalNotes || "No notes"}
                                    />
                                </Grid>

                                <Grid item xs={12} md={6}>
                                    <StatBox
                                        label="Health Status"
                                        value="Stable"
                                    />
                                </Grid>
                            </Grid>
                        </CardContent>
                    </Card>
                </Box>
            )}
        </Box>
    );
}

/* ================= COMPONENT ================= */

function StatBox({ icon, label, value }) {
    return (
        <Box
            sx={{
                border: "1px solid #e5e7eb",
                borderRadius: 2,
                p: 2,
                display: "flex",
                alignItems: "center",
                gap: 1.5,
                height: "100%"
            }}
        >
            {icon && <Box sx={{ color: "text.secondary" }}>{icon}</Box>}
            <Box>
                <Typography variant="caption" color="text.secondary">
                    {label}
                </Typography>
                <Typography fontWeight={600} noWrap>
                    {value}
                </Typography>
            </Box>
        </Box>
    );
}
