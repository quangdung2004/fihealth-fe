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
    Container
} from "@mui/material";
import {
    Menu as MenuIcon,
    Logout,
    FitnessCenter,
    History,
    Person,
    Dashboard
} from "@mui/icons-material";

const drawerWidth = 240;

export function UserLayout() {
    const navigate = useNavigate();
    const location = useLocation();
    const [mobileOpen, setMobileOpen] = useState(false);

    const handleDrawerToggle = () => {
        setMobileOpen(!mobileOpen);
    };

    const menuItems = [
        { text: "Current Plan", icon: <FitnessCenter />, path: "/user/current-plan" },
        { text: "History", icon: <History />, path: "/user/history" },
        // Placeholder for future
        // { text: "Profile", icon: <Person />, path: "/user/profile" },
    ];

    const drawer = (
        <div>
            <Toolbar>
                <Typography variant="h6" noWrap component="div" sx={{ color: 'primary.main', fontWeight: 'bold' }}>
                    FiHealth
                </Typography>
            </Toolbar>
            <Divider />
            <List>
                {menuItems.map((item) => (
                    <ListItem key={item.text} disablePadding>
                        <ListItemButton
                            selected={location.pathname === item.path}
                            onClick={() => navigate(item.path)}
                        >
                            <ListItemIcon>{item.icon}</ListItemIcon>
                            <ListItemText primary={item.text} />
                        </ListItemButton>
                    </ListItem>
                ))}
            </List>
            <Divider />
            <List>
                <ListItem disablePadding>
                    <ListItemButton onClick={() => navigate("/login")}>
                        <ListItemIcon><Logout /></ListItemIcon>
                        <ListItemText primary="Logout" />
                    </ListItemButton>
                </ListItem>
            </List>
        </div>
    );

    return (
        <Box sx={{ display: "flex" }}>
            <AppBar
                position="fixed"
                sx={{
                    width: { sm: `calc(100% - ${drawerWidth}px)` },
                    ml: { sm: `${drawerWidth}px` },
                    bgcolor: 'white',
                    color: 'text.primary',
                    boxShadow: 1
                }}
            >
                <Toolbar>
                    <IconButton
                        color="inherit"
                        aria-label="open drawer"
                        edge="start"
                        onClick={handleDrawerToggle}
                        sx={{ mr: 2, display: { sm: "none" } }}
                    >
                        <MenuIcon />
                    </IconButton>
                    <Typography variant="h6" noWrap component="div">
                        Dashboard
                    </Typography>
                </Toolbar>
            </AppBar>
            <Box
                component="nav"
                sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}
                aria-label="mailbox folders"
            >
                <Drawer
                    variant="temporary"
                    open={mobileOpen}
                    onClose={handleDrawerToggle}
                    ModalProps={{
                        keepMounted: true,
                    }}
                    sx={{
                        display: { xs: "block", sm: "none" },
                        "& .MuiDrawer-paper": {
                            boxSizing: "border-box",
                            width: drawerWidth,
                        },
                    }}
                >
                    {drawer}
                </Drawer>
                <Drawer
                    variant="permanent"
                    sx={{
                        display: { xs: "none", sm: "block" },
                        "& .MuiDrawer-paper": {
                            boxSizing: "border-box",
                            width: drawerWidth,
                        },
                    }}
                    open
                >
                    {drawer}
                </Drawer>
            </Box>
            <Box
                component="main"
                sx={{
                    flexGrow: 1,
                    p: 3,
                    width: { sm: `calc(100% - ${drawerWidth}px)` },
                    minHeight: "100vh",
                    bgcolor: "#f5f5f5"
                }}
            >
                <Toolbar />
                <Outlet />
            </Box>
        </Box>
    );
}
