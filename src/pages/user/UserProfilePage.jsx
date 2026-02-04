import { useState, useEffect } from "react";
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
    CardContent,
    useTheme
} from "@mui/material";
import {
    Edit,
    CalendarToday,
    Height,
    MonitorWeight,
    FitnessCenter,
    Flag,
    MedicalServices,
    Warning
} from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import axiosClient from "../../api/axiosClient";

export function UserProfilePage() {
    const navigate = useNavigate();
    const theme = useTheme();
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const res = await axiosClient.get("/users/me");
                setUser(res.data.data);
            } catch (error) {
                console.error("Failed to fetch user profile", error);
            } finally {
                setLoading(false);
            }
        };
        fetchUser();
    }, []);

    if (loading) {
        return (
            <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "50vh" }}>
                <CircularProgress color="success" />
            </Box>
        );
    }

    if (!user) {
        return (
            <Box sx={{ textAlign: "center", mt: 5 }}>
                <Typography variant="h6" color="error">Failed to load profile.</Typography>
            </Box>
        );
    }

    const { profile } = user;
    const hasProfile = user.hasProfile && profile;

    return (
        <Box sx={{ maxWidth: 1000, mx: "auto" }}>
            {/* Header / Cover */}
            <Paper
                elevation={0}
                sx={{
                    p: 4,
                    mb: 3,
                    borderRadius: 4,
                    background: "linear-gradient(135deg, #10b981 0%, #059669 100%)",
                    color: "white",
                    position: "relative",
                    overflow: "hidden"
                }}
            >
                {/* Decorative circles */}
                <Box sx={{ position: "absolute", top: -20, right: -20, width: 200, height: 200, borderRadius: "50%", bgcolor: "rgba(255,255,255,0.1)" }} />
                <Box sx={{ position: "absolute", bottom: -40, left: -20, width: 150, height: 150, borderRadius: "50%", bgcolor: "rgba(255,255,255,0.1)" }} />

                <Grid container spacing={3} alignItems="center" sx={{ position: "relative", zIndex: 1 }}>
                    <Grid item>
                        <Avatar
                            sx={{
                                width: 100,
                                height: 100,
                                bgcolor: "white",
                                color: "success.main",
                                fontSize: "2.5rem",
                                fontWeight: 700,
                                border: "4px solid rgba(255,255,255,0.3)"
                            }}
                        >
                            {user.fullName?.charAt(0) || "U"}
                        </Avatar>
                    </Grid>
                    <Grid item xs>
                        <Typography variant="h4" fontWeight={700}>
                            {user.fullName}
                        </Typography>
                        <Typography variant="body1" sx={{ opacity: 0.9, mb: 1 }}>
                            {user.email}
                        </Typography>
                        <Chip
                            label={user.membership || "FREE"}
                            color={user.membership === 'PREMIUM' ? "warning" : "default"}
                            sx={{
                                bgcolor: "rgba(255,255,255,0.2)",
                                color: "white",
                                fontWeight: 600,
                                backdropFilter: "blur(4px)"
                            }}
                        />
                    </Grid>
                    <Grid item>
                        <Button
                            variant="contained"
                            sx={{
                                bgcolor: "white",
                                color: "success.main",
                                "&:hover": { bgcolor: "grey.100" }
                            }}
                            startIcon={<Edit />}
                            onClick={() => navigate("/user/profile/edit")}
                        >
                            Edit Profile
                        </Button>
                    </Grid>
                </Grid>
            </Paper>

            {/* Health Profile */}
            {!hasProfile ? (
                <Paper sx={{ p: 4, textAlign: "center", borderRadius: 3 }}>
                    <Typography variant="h6" gutterBottom>
                        You haven't set up your health profile yet.
                    </Typography>
                    <Typography color="text.secondary" paragraph>
                        Complete your profile to get personalized meal plans and workout recommendations.
                    </Typography>
                    <Button
                        variant="contained"
                        color="success"
                        onClick={() => navigate("/assessments/new")}
                    >
                        Create Health Profile
                    </Button>
                </Paper>
            ) : (
                <Grid container spacing={3}>
                    {/* Basic Stats */}
                    <Grid item xs={12} md={4}>
                        <Card elevation={0} sx={{ height: "100%", borderRadius: 3, border: "1px solid #e2e8f0" }}>
                            <CardContent>
                                <Typography variant="h6" fontWeight={600} gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                    <FitnessCenter color="primary" /> Physical Stats
                                </Typography>
                                <Divider sx={{ my: 2 }} />

                                <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                                    <StatItem icon={<Height />} label="Height" value={`${profile.heightCm} cm`} />
                                    <StatItem icon={<MonitorWeight />} label="Weight" value={`${profile.currentWeightKg} kg`} />
                                    <StatItem icon={<CalendarToday />} label="Age" value={`${profile.age} years`} />
                                    <StatItem icon={<FitnessCenter />} label="Activity" value={profile.activityLevel?.replace(/_/g, " ")} />
                                </Box>
                            </CardContent>
                        </Card>
                    </Grid>

                    {/* Goals */}
                    <Grid item xs={12} md={4}>
                        <Card elevation={0} sx={{ height: "100%", borderRadius: 3, border: "1px solid #e2e8f0" }}>
                            <CardContent>
                                <Typography variant="h6" fontWeight={600} gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                    <Flag color="error" /> Goals
                                </Typography>
                                <Divider sx={{ my: 2 }} />

                                <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                                    <StatItem label="Main Goal" value={profile.goal} highlight />
                                    <StatItem label="Target Weight" value={profile.targetWeightKg ? `${profile.targetWeightKg} kg` : "N/A"} />
                                    <StatItem label="Deadline" value={profile.goalDeadline || "No deadline"} />
                                    <Box>
                                        <Typography variant="caption" color="text.secondary">Specific Goal</Typography>
                                        <Typography variant="body2" sx={{ fontStyle: "italic", mt: 0.5 }}>
                                            "{profile.specificGoal || "No specific details"}"
                                        </Typography>
                                    </Box>
                                </Box>
                            </CardContent>
                        </Card>
                    </Grid>

                    {/* Medical / Health */}
                    <Grid item xs={12} md={4}>
                        <Card elevation={0} sx={{ height: "100%", borderRadius: 3, border: "1px solid #e2e8f0" }}>
                            <CardContent>
                                <Typography variant="h6" fontWeight={600} gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                    <MedicalServices color="warning" /> Health Info
                                </Typography>
                                <Divider sx={{ my: 2 }} />

                                <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                                    <Box>
                                        <Typography variant="subtitle2" sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                                            <Warning fontSize="small" color="error" /> Allergies
                                        </Typography>
                                        <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1, mt: 1 }}>
                                            {profile.allergies && profile.allergies.length > 0 ? (
                                                profile.allergies.map(a => <Chip key={a} label={a} size="small" color="error" variant="outlined" />)
                                            ) : (
                                                <Typography variant="body2" color="text.secondary">None</Typography>
                                            )}
                                        </Box>
                                    </Box>

                                    <Box>
                                        <Typography variant="subtitle2" sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                                            <MedicalServices fontSize="small" color="info" /> Diseases / Conditions
                                        </Typography>
                                        <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1, mt: 1 }}>
                                            {profile.diseases && profile.diseases.length > 0 ? (
                                                profile.diseases.map(d => <Chip key={d} label={d} size="small" color="info" variant="outlined" />)
                                            ) : (
                                                <Typography variant="body2" color="text.secondary">None</Typography>
                                            )}
                                        </Box>
                                    </Box>

                                    <Box>
                                        <Typography variant="caption" color="text.secondary">Medical Notes</Typography>
                                        <Typography variant="body2" sx={{ mt: 0.5, color: "text.secondary" }}>
                                            {profile.medicalNotes || "No notes"}
                                        </Typography>
                                    </Box>
                                </Box>
                            </CardContent>
                        </Card>
                    </Grid>
                </Grid>
            )}
        </Box>
    );
}

function StatItem({ icon, label, value, highlight = false }) {
    return (
        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                {icon && <Box sx={{ color: "text.secondary", display: 'flex' }}>{icon}</Box>}
                <Typography variant="body2" color="text.secondary">{label}</Typography>
            </Box>
            <Typography variant="body1" fontWeight={highlight ? 700 : 500} color={highlight ? "primary.main" : "text.primary"}>
                {value}
            </Typography>
        </Box>
    );
}
