import { useMemo, useState } from "react";
import { Outlet, useNavigate, useLocation } from "react-router-dom";
import {
  AppBar,
  Avatar,
  Box,
  CssBaseline,
  Divider,
  Drawer,
  IconButton,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Menu,
  MenuItem,
  Toolbar,
  Tooltip,
  Typography,
  Chip,
} from "@mui/material";
import {
  Menu as MenuIcon,
  Logout,
  FitnessCenter,
  History,
  Settings,
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

  const [mobileOpen, setMobileOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);

  const handleDrawerToggle = () => setMobileOpen((p) => !p);

  const menuItems = useMemo(
    () => [
      { text: "Current Plan", icon: <FitnessCenter />, path: "/user/current-plan" },
      { text: "History", icon: <History />, path: "/user/history" },
    ],
    []
  );

  const isActive = (path) => {
    const cur = location.pathname;
    return cur === path || cur.startsWith(path + "/");
  };

  const handleLogout = () => {
    logout();
    navigate("/login", { replace: true });
  };

  const drawer = (
    <Box sx={{ height: "100%", display: "flex", flexDirection: "column" }}>
      <Box sx={{ px: 2.5, py: 2.5 }}>
        <Typography sx={{ fontWeight: 900, fontSize: 18, color: "#fff" }}>
          FiHealth
        </Typography>
        <Typography variant="body2" sx={{ color: "rgba(255,255,255,.6)", mt: 0.5 }}>
          User Dashboard
        </Typography>
      </Box>

      <Divider sx={{ borderColor: "rgba(255,255,255,.08)" }} />

      <List sx={{ px: 1.5, py: 1.5 }}>
        {menuItems.map((item) => {
          const active = isActive(item.path);
          return (
            <ListItem key={item.text} disablePadding sx={{ mb: 0.5 }}>
              <ListItemButton
                selected={active}
                onClick={() => {
                  navigate(item.path);
                  setMobileOpen(false);
                }}
                sx={{
                  borderRadius: 2,
                  px: 1.6,
                  py: 1.2,
                  color: active ? "#fff" : "rgba(255,255,255,.8)",
                  "& .MuiListItemIcon-root": {
                    minWidth: 40,
                    color: active ? "#6DFFB2" : "rgba(255,255,255,.55)",
                  },
                  "&.Mui-selected": {
                    background:
                      "linear-gradient(90deg, rgba(109,255,178,.18), rgba(109,255,178,.06))",
                    outline: "1px solid rgba(109,255,178,.25)",
                  },
                  "&:hover": {
                    backgroundColor: "rgba(255,255,255,.06)",
                  },
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
              <ListItemIcon sx={{ minWidth: 36 }}>
                <Settings fontSize="small" />
              </ListItemIcon>
              Profile / Settings
            </MenuItem>
            <Divider />
            <MenuItem
              onClick={() => {
                setAnchorEl(null);
                handleLogout();
              }}
            >
              <ListItemIcon sx={{ minWidth: 36, color: "error.main" }}>
                <Logout fontSize="small" />
              </ListItemIcon>
              <Typography sx={{ fontWeight: 800, color: "error.main" }}>
                Logout
              </Typography>
            </MenuItem>
          </Menu>
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
              bgcolor: "#0B1220",
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
              bgcolor: "#0B1220",
              borderRight: "1px solid rgba(255,255,255,.08)",
            },
          }}
        >
          {drawer}
        </Drawer>
      </Box>

      {/* MAIN */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          bgcolor: "#F5F7FB",
          minHeight: "100vh",
          p: { xs: 2, sm: 3 },
        }}
      >
        <Toolbar />
        <Box sx={{ maxWidth: 1200, mx: "auto" }}>
          <Outlet />
        </Box>
      </Box>
    </Box>
  );
}
