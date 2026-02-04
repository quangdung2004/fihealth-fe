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
  Divider
} from "@mui/material";
import {
  Message,
  RestaurantMenu,
  LocalDining,
  Menu as MenuIcon,
  Logout,
  FitnessCenter
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
    <Box>
      {/* Logo */}
      <Toolbar sx={{ px: 2 }}>
        <Typography
          variant="h6"
          fontWeight={700}
          color="success.main"
        >
          FiHealth Admin
        </Typography>
      </Toolbar>

      <Divider />

      {/* Menu */}
      <List sx={{ px: 1 }}>
        {menuItems.map((item) => {
          const active = location.pathname.startsWith(item.path);
          return (
            <ListItem key={item.text} disablePadding sx={{ mb: 0.5 }}>
              <ListItemButton
                onClick={() => navigate(item.path)}
                sx={{
                  borderRadius: 2,
                  bgcolor: active ? "success.light" : "transparent",
                  color: active ? "success.dark" : "text.primary",
                  "&:hover": {
                    bgcolor: "success.light",
                  },
                }}
              >
                <ListItemIcon
                  sx={{
                    color: active ? "success.dark" : "text.secondary",
                    minWidth: 40,
                  }}
                >
                  {item.icon}
                </ListItemIcon>
                <ListItemText
                  primary={item.text}
                  primaryTypographyProps={{
                    fontWeight: active ? 600 : 500,
                  }}
                />
              </ListItemButton>
            </ListItem>
          );
        })}
      </List>

      <Divider sx={{ mt: 2 }} />

      {/* Logout */}
      <List sx={{ px: 1 }}>
        <ListItem disablePadding>
          <ListItemButton
            onClick={() => navigate("/")}
            sx={{
              borderRadius: 2,
              color: "error.main",
              "&:hover": {
                bgcolor: "error.light",
              },
            }}
          >
            <ListItemIcon sx={{ color: "error.main", minWidth: 40 }}>
              <Logout />
            </ListItemIcon>
            <ListItemText primary="Logout" />
          </ListItemButton>
        </ListItem>
      </List>
    </Box>
  );

  return (
    <Box sx={{ display: "flex" }}>
      {/* AppBar */}
      <AppBar
        position="fixed"
        elevation={0}
        sx={{
          width: { sm: `calc(100% - ${drawerWidth}px)` },
          ml: { sm: `${drawerWidth}px` },
          bgcolor: "#ffffff",
          borderBottom: "1px solid #e0e0e0",
          color: "text.primary",
        }}
      >
        <Toolbar>
          <IconButton
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2, display: { sm: "none" } }}
          >
            <MenuIcon />
          </IconButton>

          <Typography variant="h6" fontWeight={600}>
            Catalog Management
          </Typography>
        </Toolbar>
      </AppBar>

      {/* Drawer */}
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
              boxSizing: "border-box",
            },
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
              boxSizing: "border-box",
              borderRight: "1px solid #e0e0e0",
            },
          }}
        >
          {drawer}
        </Drawer>
      </Box>

      {/* Main Content */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          width: { sm: `calc(100% - ${drawerWidth}px)` },
          minHeight: "100vh",
          bgcolor: "#f4f6f8",
        }}
      >
        <Toolbar />
        <Outlet />
      </Box>
    </Box>
  );
}
