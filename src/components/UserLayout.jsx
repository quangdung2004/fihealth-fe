import { useState } from "react";
import { Outlet, useNavigate, useLocation } from "react-router-dom";
import axiosClient from "../api/axiosClient"; // ✅ chỉnh path nếu dự án bạn khác
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
  Alert,
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
  Calculate,
  AddCircleOutline,
  RestaurantMenu,
  Favorite,
  Whatshot,
} from "@mui/icons-material";
import { useAuth } from "./common/AuthContext";

const drawerWidth = 240;

export function UserLayout() {
  const navigate = useNavigate();
  const location = useLocation();
  const { me: user, logout } = useAuth();

  const [mobileOpen, setMobileOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  const [navErr, setNavErr] = useState("");

  const handleDrawerToggle = () => setMobileOpen(!mobileOpen);

  const handleMenuClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    handleMenuClose();
    logout();
    navigate("/login");
  };

  const handleNavigate = (path) => {
    handleMenuClose();
    navigate(path);
  };

  const handleSidebarNavigate = (path) => {
    // ✅ bấm menu trên mobile thì đóng drawer
    setMobileOpen(false);
    navigate(path);
  };

  // ✅ Tính BMI/BMR -> đi tới assessment mới nhất (/user/assessments/:id)
  // Nếu chưa có assessment -> đi tới tạo mới (/user/assessments/new)
  const goLatestAssessmentDetail = async () => {
    setNavErr("");
    setMobileOpen(false);

    try {
      const res = await axiosClient.get("/assessments", { params: { me: true } });
      const list = res?.data?.data ?? res?.data ?? [];
      const arr = Array.isArray(list) ? list : [];

      if (arr.length === 0) {
        navigate("/user/assessments/new");
        return;
      }

      const latest = [...arr].sort((a, b) => {
        const ta = a?.createdAt ? new Date(a.createdAt).getTime() : 0;
        const tb = b?.createdAt ? new Date(b.createdAt).getTime() : 0;
        return tb - ta;
      })[0];

      const id = latest?.id ?? latest?._id ?? latest?.assessmentId;
      if (!id) {
        navigate("/user/assessments");
        return;
      }

      navigate(`/user/assessments/${id}`);
    } catch (e) {
      console.error("goLatestAssessmentDetail error:", e);
      setNavErr("Không thể mở trang BMI/BMR (không lấy được assessment mới nhất).");
      navigate("/user/assessments");
    }
  };

  const menuItems = [
    // ===== Workout =====
    { text: "Kế hoạch hiện tại", icon: <FitnessCenter />, path: "/user/current-plan" },
    { text: "Lịch sử", icon: <History />, path: "/user/history" },

    // ===== Assessment =====
    { text: "Tính BMI/BMR", icon: <Calculate />, action: goLatestAssessmentDetail },
    { text: "Tạo Assessment", icon: <AddCircleOutline />, path: "/user/assessments/new" },
    { text: " Assessment", icon: <AddCircleOutline />, path: "/user/assessments/new" },

    // ===== Meal Plan =====
    { text: "Xem MealPlan", icon: <RestaurantMenu />, path: "/user/meal-plans/get" },
    { text: "MealPlan yêu thích", icon: <Favorite />, path: "/user/meal-plans/favorite" },
    { text: "MealPlan Hot", icon: <Whatshot />, path: "/user/meal-plans/hot" },
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

      {navErr ? (
        <Alert severity="warning" sx={{ mb: 2 }}>
          {navErr}
        </Alert>
      ) : null}

      <Divider sx={{ mb: 2 }} />

      <List>
        {menuItems.map((item) => {
          const active = item.path ? location.pathname.startsWith(item.path) : false;

          return (
            <ListItem key={item.text} disablePadding sx={{ mb: 0.5 }}>
              <ListItemButton
                onClick={() => {
                  if (item.action) return item.action();
                  if (item.path) return handleSidebarNavigate(item.path);
                }}
                sx={{
                  borderRadius: 2,
                  bgcolor: active ? "success.light" : "transparent",
                  color: active ? "success.dark" : "text.secondary",
                  "&:hover": { bgcolor: "success.light" },
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
          color: "text.primary",
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
              Bảng điều khiển
            </Typography>
          </Box>

          {/* Right Side */}
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            {user && (
              <Chip
                label={user.membership || "FREE"}
                color={user.membership === "PREMIUM" ? "warning" : "default"}
                size="small"
                sx={{ fontWeight: 600 }}
              />
            )}

            <Tooltip title="Cài đặt tài khoản">
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
              PaperProps={{
                elevation: 0,
                sx: {
                  overflow: "visible",
                  filter: "drop-shadow(0px 2px 8px rgba(0,0,0,0.32))",
                  mt: 1.5,
                  "& .MuiAvatar-root": { width: 32, height: 32, ml: -0.5, mr: 1 },
                  "&:before": {
                    content: '""',
                    display: "block",
                    position: "absolute",
                    top: 0,
                    right: 14,
                    width: 10,
                    height: 10,
                    bgcolor: "background.paper",
                    transform: "translateY(-50%) rotate(45deg)",
                    zIndex: 0,
                  },
                },
              }}
              transformOrigin={{ horizontal: "right", vertical: "top" }}
              anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
            >
              <MenuItem onClick={() => handleNavigate("/user/profile")}>
                <ListItemIcon>
                  <Person fontSize="small" />
                </ListItemIcon>
                Xem hồ sơ
              </MenuItem>

              <MenuItem onClick={() => handleNavigate("/user/profile/edit")}>
                <ListItemIcon>
                  <Edit fontSize="small" />
                </ListItemIcon>
                Chỉnh sửa hồ sơ
              </MenuItem>

              <MenuItem onClick={() => handleNavigate("/user/change-password")}>
                <ListItemIcon>
                  <Lock fontSize="small" />
                </ListItemIcon>
                Đổi mật khẩu
              </MenuItem>

              <Divider />

              <MenuItem onClick={handleLogout}>
                <ListItemIcon>
                  <Logout fontSize="small" />
                </ListItemIcon>
                Đăng xuất
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
          ModalProps={{ keepMounted: true }}
          sx={{
            display: { xs: "block", sm: "none" },
            "& .MuiDrawer-paper": {
              width: drawerWidth,
              bgcolor: "#ecfdf5",
              borderRight: "1px solid #bbf7d0",
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
              bgcolor: "#ecfdf5",
              borderRight: "1px solid #bbf7d0",
            },
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
