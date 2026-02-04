import { useMemo, useState } from "react";
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
    Menu as MenuIcon,
    Logout,
    FitnessCenter,
    History,
    Dashboard
} from "@mui/icons-material";
import { useAuth } from "./common/AuthContext";

const drawerWidth = 268;

function membershipLabel(m) {
  const s = String(m || "FREE").toUpperCase();
  if (s.includes("PREMIUM")) return "Premium";
  return "Free";
}

export function UserLayout() {
  const navigate = useNavigate();
  const location = useLocation();
  const { me, logout } = useAuth();

    const handleDrawerToggle = () => setMobileOpen(!mobileOpen);

    const menuItems = [
        { text: "Current Plan", icon: <FitnessCenter />, path: "/user/current-plan" },
        { text: "History", icon: <History />, path: "/user/history" },
    ];

    const drawer = (
        <Box sx={{ height: "100%", p: 2 }}>
            {/* Logo */}
            <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 3 }}>
                <Dashboard sx={{ color: "success.main" }} />
                <Typography variant="h6" sx={{ fontWeight: 700, color: "success.main" }}>
                    FiHealth
                </Typography>
            </Box>

            <Divider sx={{ mb: 2 }} />

            <List>
                {menuItems.map((item) => {
                    const active = location.pathname === item.path;
                    return (
                        <ListItem key={item.text} disablePadding sx={{ mb: 0.5 }}>
                            <ListItemButton
                                onClick={() => navigate(item.path)}
                                sx={{
                                    borderRadius: 2,
                                    bgcolor: active ? "success.light" : "transparent",
                                    color: active ? "success.dark" : "text.secondary",
                                    "&:hover": {
                                        bgcolor: "success.light",
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

            <Divider sx={{ my: 2 }} />

            <List>
                <ListItem disablePadding>
                    <ListItemButton
                        onClick={() => navigate("/login")}
                        sx={{
                            borderRadius: 2,
                            color: "error.main",
                            "&:hover": { bgcolor: "error.light" }
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
                    <Avatar sx={{ bgcolor: "success.main", width: 36, height: 36 }}>U</Avatar>
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
            <Box
                component="main"
                sx={{
                    flexGrow: 1,
                    p: 3,
                    mt: 8,
                }}
              >
                <ListItemIcon>{item.icon}</ListItemIcon>
                <ListItemText
                  primary={item.text}
                  primaryTypographyProps={{
                    fontWeight: active ? 800 : 600,
                    fontSize: 14.5,
                  }}
                />
              </ListItemButton>
            </ListItem>
          );
        })}
      </List>

      <Box sx={{ flexGrow: 1 }} />

      <Divider sx={{ borderColor: "rgba(255,255,255,.08)" }} />

      <List sx={{ px: 1.5, py: 1.5 }}>
        <ListItem disablePadding>
          <ListItemButton
            onClick={handleLogout}
            sx={{
              borderRadius: 2,
              px: 1.6,
              py: 1.2,
              color: "rgba(255,255,255,.85)",
              "&:hover": { backgroundColor: "rgba(255,255,255,.06)" },
            }}
          >
            <ListItemIcon sx={{ minWidth: 40, color: "rgba(255,120,120,.9)" }}>
              <Logout />
            </ListItemIcon>
            <ListItemText
              primary="Logout"
              primaryTypographyProps={{ fontWeight: 800, fontSize: 14.5 }}
            />
          </ListItemButton>
        </ListItem>
      </List>
    </Box>
  );

  return (
    <Box sx={{ display: "flex", minHeight: "100vh" }}>
      <CssBaseline />

      {/* TOP BAR */}
      <AppBar
        position="fixed"
        elevation={0}
        sx={{
          bgcolor: "rgba(255,255,255,0.95)",
          backdropFilter: "blur(12px)",
          borderBottom: "1px solid",
          borderColor: "divider",
          width: { sm: `calc(100% - ${drawerWidth}px)` },
          ml: { sm: `${drawerWidth}px` },
        }}
      >
        <Toolbar sx={{ gap: 1 }}>
          <IconButton
            onClick={handleDrawerToggle}
            sx={{ display: { sm: "none" } }}
          >
            <MenuIcon />
          </IconButton>

          <Box sx={{ flexGrow: 1 }}>
            <Typography sx={{ fontWeight: 900, fontSize: 16 }}>
              Dashboard
            </Typography>
            <Typography variant="body2" sx={{ color: "text.secondary" }}>
              Manage your plan & history
            </Typography>
          </Box>

          {/* USER INFO */}
          <Box sx={{ display: "flex", alignItems: "center", gap: 1.2 }}>
            <Chip
              size="small"
              label={membershipLabel(me?.membership)}
              sx={{
                fontWeight: 800,
                borderRadius: 1.5,
                bgcolor: String(me?.membership || "FREE")
                  .toUpperCase()
                  .includes("PREMIUM")
                  ? "rgba(46,204,113,.15)"
                  : "rgba(0,0,0,.06)",
                color: String(me?.membership || "FREE")
                  .toUpperCase()
                  .includes("PREMIUM")
                  ? "#1e8449"
                  : "text.secondary",
                border: "none",
              }}
            />

            <Typography sx={{ fontWeight: 800, fontSize: 14.5 }}>
              {me?.fullName || "User"}
            </Typography>

            <Tooltip title="Account settings">
              <IconButton
                onClick={(e) => setAnchorEl(e.currentTarget)}
                sx={{
                  p: 0.4,
                  border: "1px solid",
                  borderColor: "divider",
                }}
              >
                <Avatar
                  sx={{
                    width: 36,
                    height: 36,
                    bgcolor: "#111827",
                    fontWeight: 900,
                  }}
                >
                  {(me?.fullName || "U").charAt(0).toUpperCase()}
                </Avatar>
              </IconButton>
            </Tooltip>
          </Box>

          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={() => setAnchorEl(null)}
            PaperProps={{ sx: { borderRadius: 2, minWidth: 220 } }}
          >
            <MenuItem
              onClick={() => {
                setAnchorEl(null);
                navigate("/user/profile");
              }}
            >
                <Outlet />
            </Box>
        </Box>
      </Box>
    </Box>
  );
}
