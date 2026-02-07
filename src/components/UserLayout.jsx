import { useState } from "react";
import { Outlet, useNavigate, useLocation } from "react-router-dom";
import {
    Box,
    Drawer,
    List,
    ListItem,
    ListItemButton,
    ListItemIcon,
    ListItemText,
    AppBar,
    Toolbar,
    Typography,
    IconButton,
    Divider,
    Avatar,
    Menu,
    MenuItem,
    Chip,
    Tooltip,
    Button
} from "@mui/material";
import {
    Menu as MenuIcon,
    Logout,
    FitnessCenter,
    History,
    Dashboard,
    Person,
    Edit,
    Lock,
    Assessment,
    Restaurant,
    Favorite,
    Whatshot
} from "@mui/icons-material";
import WorkspacePremiumIcon from "@mui/icons-material/WorkspacePremium";
import { useAuth } from "./common/AuthContext";

const drawerWidth = 240;

export function UserLayout() {
    const navigate = useNavigate();
    const location = useLocation();
    const { me: user, logout } = useAuth();
    const [mobileOpen, setMobileOpen] = useState(false);
    const [anchorEl, setAnchorEl] = useState(null);
    const open = Boolean(anchorEl);

    const handleDrawerToggle = () => setMobileOpen(!mobileOpen);
    const handleMenuClick = (event) => setAnchorEl(event.currentTarget);
    const handleMenuClose = () => setAnchorEl(null);

    const handleLogout = () => {
        handleMenuClose();
        logout();
        navigate("/login");
    };

    const handleNavigate = (path) => {
        handleMenuClose();
        navigate(path);
    };

    const menuItems = [
        { text: "Current Plan", icon: <FitnessCenter />, path: "/user/current-plan" },
        { text: "History", icon: <History />, path: "/user/history" },
        { text: "Assessments", icon: <Assessment />, path: "/user/assessments" },
        { text: "Meal Plan Get", icon: <Restaurant />, path: "/user/meal-plans/get" },
        { text: "Meal Plan Favorite", icon: <Favorite />, path: "/user/meal-plans/favorite" },
        { text: "Meal Plan Hot", icon: <Whatshot />, path: "/user/meal-plans/hot" },
    ];

    const drawer = (
        <Box sx={{ height: "100%", p: 2 }}>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 3 }}>
                <Dashboard sx={{ color: "success.main" }} />
                <Typography variant="h6" sx={{ fontWeight: 700, color: "success.main" }}>
                    FiHealth
                </Typography>
            </Box>

            <Divider sx={{ mb: 2 }} />

            <List>
                {menuItems.map((item) => {
                    const active = location.pathname.startsWith(item.path);
                    return (
                        <ListItem key={item.text} disablePadding sx={{ mb: 0.5 }}>
                            <ListItemButton
                                onClick={() => navigate(item.path)}
                                sx={{
                                    borderRadius: 2,
                                    bgcolor: active ? "success.light" : "transparent",
                                    color: active ? "success.dark" : "text.secondary",
                                    "&:hover": { bgcolor: "success.light" }
                                }}
                            >
                                <ListItemIcon sx={{ color: "inherit", minWidth: 40 }}>
                                    {item.icon}
                                </ListItemIcon>
                                <ListItemText primary={item.text} />
                            </ListItemButton>
                        </ListItem>
                    );
                })}
            </List>
        </Box>
    );

    return (
        <Box sx={{ display: "flex", minHeight: "100vh", bgcolor: "#f0fdf4" }}>
            {/* TOP BAR */}
            <AppBar
                position="fixed"
                elevation={0}
                sx={{
                    width: { sm: `calc(100% - ${drawerWidth}px)` },
                    ml: { sm: `${drawerWidth}px` },
                    bgcolor: "rgba(240,253,244,0.9)",
                    backdropFilter: "blur(10px)",
                    borderBottom: "1px solid #bbf7d0",
                    color: "text.primary"
                }}
            >
                <Toolbar sx={{ display: "flex", justifyContent: "space-between" }}>
                    <Box sx={{ display: "flex", alignItems: "center" }}>
                        <IconButton
                            edge="start"
                            onClick={handleDrawerToggle}
                            sx={{ mr: 2, display: { sm: "none" } }}
                        >
                            <MenuIcon />
                        </IconButton>
                        <Typography variant="h6" sx={{ fontWeight: 600 }}>
                            Dashboard
                        </Typography>
                    </Box>

                    {/* RIGHT SIDE */}
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                        {user && (
                            <>
                                <Chip
                                    label={user.membership}
                                    color={user.membership === "PREMIUM" ? "warning" : "default"}
                                    size="small"
                                    sx={{ fontWeight: 600 }}
                                />

                                {/* ✅ CHỈ THÊM – KHÔNG SỬA LOGIC CŨ */}
                                {user.membership === "FREE" && (
                                    <Button
                                        size="small"
                                        startIcon={<WorkspacePremiumIcon />}
                                        sx={{
                                            ml: 1,
                                            bgcolor: "#facc15",
                                            color: "#78350f",
                                            fontWeight: 700,
                                            "&:hover": { bgcolor: "#fde047" }
                                        }}
                                        onClick={() => navigate("/user/plans")}
                                    >
                                        Xem gói Premium
                                    </Button>
                                )}
                            </>
                        )}

                        <Tooltip title="Account settings">
                            <IconButton onClick={handleMenuClick} size="small" sx={{ ml: 1 }}>
                                <Avatar sx={{ bgcolor: "success.main", width: 36, height: 36 }}>
                                    {user?.fullName?.charAt(0) || "U"}
                                </Avatar>
                            </IconButton>
                        </Tooltip>

                        <Menu
                            anchorEl={anchorEl}
                            open={open}
                            onClose={handleMenuClose}
                            transformOrigin={{ horizontal: "right", vertical: "top" }}
                            anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
                        >
                            <MenuItem onClick={() => handleNavigate("/user/profile")}>
                                <ListItemIcon><Person fontSize="small" /></ListItemIcon>
                                View Profile
                            </MenuItem>
                            <MenuItem onClick={() => handleNavigate("/user/profile/edit")}>
                                <ListItemIcon><Edit fontSize="small" /></ListItemIcon>
                                Edit Profile
                            </MenuItem>
                            <MenuItem onClick={() => handleNavigate("/user/change-password")}>
                                <ListItemIcon><Lock fontSize="small" /></ListItemIcon>
                                Change Password
                            </MenuItem>
                            <Divider />
                            <MenuItem onClick={handleLogout}>
                                <ListItemIcon><Logout fontSize="small" /></ListItemIcon>
                                Logout
                            </MenuItem>
                        </Menu>
                    </Box>
                </Toolbar>
            </AppBar>

            {/* SIDEBAR */}
            <Box component="nav" sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}>
                <Drawer
                    variant="temporary"
                    open={mobileOpen}
                    onClose={handleDrawerToggle}
                    sx={{
                        display: { xs: "block", sm: "none" },
                        "& .MuiDrawer-paper": {
                            width: drawerWidth,
                            bgcolor: "#ecfdf5",
                            borderRight: "1px solid #bbf7d0"
                        }
                    }}
                >
                    {drawer}
                </Drawer>

                <Drawer
                    variant="permanent"
                    open
                    sx={{
                        display: { xs: "none", sm: "block" },
                        "& .MuiDrawer-paper": {
                            width: drawerWidth,
                            bgcolor: "#ecfdf5",
                            borderRight: "1px solid #bbf7d0"
                        }
                    }}
                >
                    {drawer}
                </Drawer>
            </Box>

            {/* MAIN CONTENT */}
            <Box component="main" sx={{ flexGrow: 1, p: 3, mt: 8 }}>
                <Outlet />
            </Box>
        </Box>
    );
}
