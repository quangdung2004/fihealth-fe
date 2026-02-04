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
    Avatar
} from "@mui/material";
import {
    Message,
    RestaurantMenu,
    LocalDining,
    Menu as MenuIcon,
    Logout,
    FitnessCenter,
    Dashboard
} from "@mui/icons-material";

const drawerWidth = 260;

export function AdminLayout() {
    const navigate = useNavigate();
    const location = useLocation();
    const [mobileOpen, setMobileOpen] = useState(false);

    const handleDrawerToggle = () => setMobileOpen(!mobileOpen);

    const menuItems = [
        { text: "Allergens", icon: <Message />, path: "/admin/allergens" },
        { text: "Foods", icon: <RestaurantMenu />, path: "/admin/foods" },
        { text: "Recipes", icon: <LocalDining />, path: "/admin/recipes" },
        { text: "Workouts", icon: <FitnessCenter />, path: "/admin/workouts" },
    ];

    const drawer = (
        <Box sx={{ height: "100%", p: 2 }}>
            {/* Logo */}
            <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 3 }}>
                <Dashboard sx={{ color: "primary.light" }} />
                <Typography variant="h6" sx={{ fontWeight: 700, color: "primary.light" }}>
                    FiHealth Admin
                </Typography>
            </Box>

            <Divider sx={{ mb: 2, borderColor: "rgba(255,255,255,0.15)" }} />

            <List>
                {menuItems.map((item) => {
                    const active = location.pathname.startsWith(item.path);
                    return (
                        <ListItem key={item.text} disablePadding sx={{ mb: 0.5 }}>
                            <ListItemButton
                                onClick={() => navigate(item.path)}
                                sx={{
                                    borderRadius: 2,
                                    color: active ? "primary.main" : "rgba(255,255,255,0.75)",
                                    backgroundColor: active ? "rgba(59,130,246,0.18)" : "transparent",
                                    "&:hover": {
                                        backgroundColor: "rgba(59,130,246,0.25)",
                                        color: "primary.light"
                                    }
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

            <Box sx={{ flexGrow: 1 }} />

            <Divider sx={{ my: 2, borderColor: "rgba(255,255,255,0.15)" }} />

            <List>
                <ListItem disablePadding>
                    <ListItemButton
                        onClick={() => navigate("/")}
                        sx={{
                            borderRadius: 2,
                            color: "rgba(255,255,255,0.7)",
                            "&:hover": {
                                backgroundColor: "rgba(239,68,68,0.25)",
                                color: "#fecaca"
                            }
                        }}
                    >
                        <ListItemIcon sx={{ color: "inherit", minWidth: 40 }}>
                            <Logout />
                        </ListItemIcon>
                        <ListItemText primary="Logout" />
                    </ListItemButton>
                </ListItem>
            </List>
        </Box>
    );

    return (
        <Box sx={{ display: "flex", minHeight: "100vh", background: "linear-gradient(135deg, #020617, #0f172a)" }}>
            {/* TOP BAR */}
            <AppBar
                position="fixed"
                elevation={0}
                sx={{
                    width: { sm: `calc(100% - ${drawerWidth}px)` },
                    ml: { sm: `${drawerWidth}px` },
                    backdropFilter: "blur(14px)",
                    backgroundColor: "rgba(15, 23, 42, 0.85)",
                    borderBottom: "1px solid rgba(255,255,255,0.12)"
                }}
            >
                <Toolbar sx={{ display: "flex", justifyContent: "space-between" }}>
                    <Box sx={{ display: "flex", alignItems: "center" }}>
                        <IconButton
                            color="inherit"
                            edge="start"
                            onClick={handleDrawerToggle}
                            sx={{ mr: 2, display: { sm: "none" } }}
                        >
                            <MenuIcon />
                        </IconButton>
                        <Typography variant="h6" sx={{ fontWeight: 600 }}>
                            Catalog Management
                        </Typography>
                    </Box>

                    <Avatar sx={{ bgcolor: "primary.main", width: 36, height: 36 }}>A</Avatar>
                </Toolbar>
            </AppBar>

            {/* SIDEBAR */}
            <Box component="nav" sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}>
                <Drawer
                    variant="temporary"
                    open={mobileOpen}
                    onClose={handleDrawerToggle}
                    ModalProps={{ keepMounted: true }}
                    sx={{
                        display: { xs: "block", sm: "none" },
                        "& .MuiDrawer-paper": {
                            width: drawerWidth,
                            background: "rgba(15, 23, 42, 0.9)",
                            backdropFilter: "blur(16px)",
                            color: "white",
                            borderRight: "1px solid rgba(255,255,255,0.12)"
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
                            background: "rgba(15, 23, 42, 0.85)",
                            backdropFilter: "blur(16px)",
                            color: "white",
                            borderRight: "1px solid rgba(255,255,255,0.12)"
                        }
                    }}
                >
                    {drawer}
                </Drawer>
            </Box>

            {/* MAIN CONTENT */}
            <Box
                component="main"
                sx={{
                    flexGrow: 1,
                    p: 3,
                    mt: 8,
                    width: { sm: `calc(100% - ${drawerWidth}px)` }
                }}
            >
                <Outlet />
            </Box>
        </Box>
    );
}
