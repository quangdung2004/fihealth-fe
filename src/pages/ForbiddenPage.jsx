import React, { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  Box,
  Button,
  Paper,
  Typography,
  Stack,
  Divider,
  LinearProgress,
} from "@mui/material";
import { LockOutlined, Login, ArrowBack } from "@mui/icons-material";

function getDefaultRouteByRole(role) {
  const r = String(role || "").toUpperCase();
  if (r === "ADMIN") return "/admin/foods";
  if (r === "USER") return "/user/current-plan";
  return "/login";
}

export function ForbiddenPage() {
  const navigate = useNavigate();
  const location = useLocation();

  const token = localStorage.getItem("accessToken");
  const role = localStorage.getItem("role");

  const isLoggedIn = Boolean(token);
  const fallbackTarget = useMemo(() => {
    // Nếu đã login => về trang theo role
    if (isLoggedIn) return getDefaultRouteByRole(role);
    // Nếu chưa login => về login
    return "/login";
  }, [isLoggedIn, role]);

  // Nếu route trước đó có truyền "from", ưu tiên dùng cho trường hợp chưa login (về login rồi quay lại)
  const fromPath = location.state?.from?.pathname || location.state?.from || null;

  const target = useMemo(() => {
    if (!isLoggedIn) return "/login";
    // Đã login nhưng bị chặn quyền => về default theo role (yêu cầu của bạn)
    return fallbackTarget;
  }, [isLoggedIn, fallbackTarget]);

  const [seconds, setSeconds] = useState(5);

  useEffect(() => {
    const timer = setInterval(() => setSeconds((s) => s - 1), 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    if (seconds <= 0) {
      if (!isLoggedIn) {
        // về login, kèm state.from để login xong có thể quay lại (nếu bạn xử lý ở LoginPage)
        navigate("/login", { replace: true, state: { from: fromPath ? { pathname: fromPath } : location.state?.from } });
      } else {
        // đã login => về trang theo role
        navigate(target, { replace: true });
      }
    }
  }, [seconds, isLoggedIn, navigate, target, fromPath, location.state?.from]);

  const progressValue = ((5 - Math.max(seconds, 0)) / 5) * 100;

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "grid",
        placeItems: "center",
        p: 2,
        bgcolor: "#f6f7fb",
      }}
    >
      <Paper
        elevation={0}
        sx={{
          width: "100%",
          maxWidth: 560,
          p: 4,
          borderRadius: 3,
          border: "1px solid",
          borderColor: "divider",
          bgcolor: "#fff",
        }}
      >
        <Stack direction="row" spacing={2} alignItems="center">
          <Box
            sx={{
              width: 44,
              height: 44,
              borderRadius: 2,
              display: "grid",
              placeItems: "center",
              bgcolor: "rgba(25,118,210,0.08)",
            }}
          >
            <LockOutlined color="primary" />
          </Box>

          <Box>
            <Typography variant="h5" fontWeight={800}>
              403 — Không có quyền truy cập
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Bạn không được phép truy cập nội dung này. Vui lòng kiểm tra quyền hoặc đăng nhập lại.
            </Typography>
          </Box>
        </Stack>

        <Divider sx={{ my: 2.5 }} />

        <Typography variant="body1" sx={{ mb: 1.5 }}>
          {isLoggedIn ? (
            <>
              Bạn đang đăng nhập với quyền <b>{role || "UNKNOWN"}</b>. Hệ thống sẽ đưa bạn về{" "}
              <b>trang mặc định theo role</b> sau <b>{seconds}s</b>.
            </>
          ) : (
            <>
              Bạn chưa đăng nhập. Hệ thống sẽ đưa bạn về <b>trang đăng nhập</b> sau <b>{seconds}s</b>.
            </>
          )}
        </Typography>

        <LinearProgress variant="determinate" value={progressValue} sx={{ height: 8, borderRadius: 99, mb: 2 }} />

        <Stack direction={{ xs: "column", sm: "row" }} spacing={1.2} justifyContent="flex-end">
          <Button
            variant="outlined"
            startIcon={<ArrowBack />}
            onClick={() => navigate(-1)}
          >
            Quay lại
          </Button>

          {!isLoggedIn ? (
            <Button
              variant="contained"
              startIcon={<Login />}
              onClick={() =>
                navigate("/login", {
                  replace: true,
                  state: { from: fromPath ? { pathname: fromPath } : location.state?.from },
                })
              }
            >
              Đến trang đăng nhập
            </Button>
          ) : (
            <Button variant="contained" onClick={() => navigate(target, { replace: true })}>
              Về trang chính
            </Button>
          )}
        </Stack>
      </Paper>
    </Box>
  );
}
