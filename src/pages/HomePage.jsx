import { useNavigate } from "react-router-dom";
import {
  Box,
  Button,
  Container,
  Typography,
  Stack,
  Paper,
  GlobalStyles,
} from "@mui/material";
import {
  Shield,
  CameraAlt,
  Settings,
  FitnessCenter,
  NotificationsActive,
  CheckCircle,
  PersonAdd,
  Login,
} from "@mui/icons-material";

// ✅ Font local ổn định
import "@fontsource/poppins/300.css";
import "@fontsource/poppins/400.css";
import "@fontsource/poppins/500.css";
import "@fontsource/poppins/600.css";
import "@fontsource/poppins/700.css";
import "@fontsource/poppins/800.css";
import "@fontsource/poppins/900.css";

// ✅ Ảnh nền
import heroBg from "../assets/images/anh.jpg";
import logo from "../assets/images/favicon.png";

const FONT_FAMILY =
  '"Poppins", ui-sans-serif, system-ui, -apple-system, "Segoe UI", Roboto, Helvetica, Arial, "Apple Color Emoji", "Segoe UI Emoji"';

export function HomePage() {
  const navigate = useNavigate();

  const scrollTo = (id) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <Box sx={{ minHeight: "100vh", bgcolor: "#fff" }}>
      {/* ✅ Font global */}
      <GlobalStyles
        styles={{
          "html, body": {
            fontFamily: FONT_FAMILY,
            WebkitFontSmoothing: "antialiased",
            MozOsxFontSmoothing: "grayscale",
            textRendering: "optimizeLegibility",
          },
          "*": { fontFamily: FONT_FAMILY },
        }}
      />

      {/* Header/Navigation */}
      <Box
        sx={{
          borderBottom: "1px solid",
          borderColor: "divider",
          bgcolor: "rgba(255,255,255,0.95)",
          backdropFilter: "blur(10px)",
          position: "sticky",
          top: 0,
          zIndex: 1000,
        }}
      >
        <Container maxWidth="lg">
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              py: 2,
            }}
          >
            {/* ✅ LOGO: bỏ nền xanh + tăng kích thước */}
            <Stack
              direction="row"
              spacing={1.5}
              alignItems="center"
              onClick={() => navigate("/")}
              sx={{ cursor: "pointer", userSelect: "none" }}
            >
              <Box
                component="img"
                src={logo}
                alt="FiHealth logo"
                sx={{
                  height: { xs: 44, sm: 52 }, // 🔥 tăng/giảm logo tại đây
                  width: "auto",
                  display: "block",
                  objectFit: "contain",
                }}
              />

              <Typography
                variant="h6"
                fontWeight={800}
                sx={{ lineHeight: 1 }}
              >
                FiHealth
              </Typography>
            </Stack>

            <Stack
              direction="row"
              spacing={2}
              sx={{ display: { xs: "none", sm: "flex" } }}
            >
              <Typography
                sx={{
                  cursor: "pointer",
                  "&:hover": { color: "success.main" },
                  transition: "color 0.2s",
                }}
                onClick={() => scrollTo("features")}
              >
                Tính năng
              </Typography>
              <Typography
                sx={{
                  cursor: "pointer",
                  "&:hover": { color: "success.main" },
                  transition: "color 0.2s",
                }}
                onClick={() => scrollTo("benefits")}
              >
                Lợi ích
              </Typography>
            </Stack>

            <Stack direction="row" spacing={1}>
              <Button
                variant="outlined"
                color="success"
                size="small"
                onClick={() => navigate("/login")}
                sx={{ display: { xs: "none", sm: "inline-flex" } }}
              >
                Đăng nhập
              </Button>
              <Button
                variant="contained"
                color="success"
                size="small"
                onClick={() => navigate("/register")}
              >
                Đăng ký
              </Button>
            </Stack>
          </Box>
        </Container>
      </Box>

      {/* ✅ HERO */}
      <Box
        sx={{
          position: "relative",
          overflow: "hidden",
          minHeight: { xs: 520, md: 620 },
          display: "flex",
          alignItems: "center",
        }}
      >
        {/* Ảnh nền */}
        <Box
          component="img"
          src={heroBg}
          alt=""
          loading="eager"
          decoding="async"
          sx={{
            position: "absolute",
            inset: 0,
            width: "100%",
            height: "100%",
            objectFit: "cover",
            objectPosition: "center",
            transform: "translateZ(0)",
            backfaceVisibility: "hidden",
          }}
        />

        {/* ✅ Overlay */}
        <Box
          sx={{
            position: "absolute",
            inset: 0,
            background:
              "linear-gradient(180deg, rgba(0,0,0,0.45) 0%, rgba(0,0,0,0.25) 55%, rgba(0,0,0,0.35) 100%)",
          }}
        />

        <Container
          maxWidth="lg"
          sx={{
            py: { xs: 6, md: 10 },
            position: "relative",
            zIndex: 1,
          }}
        >
          <Box sx={{ textAlign: "center", maxWidth: 980, mx: "auto" }}>
            <Box
              sx={{
                display: "inline-block",
                px: { xs: 2, sm: 3 },
                py: { xs: 2, sm: 2.5 },
                borderRadius: 3,
                background: "rgba(0,0,0,0.28)",
                backdropFilter: "blur(8px)",
                WebkitBackdropFilter: "blur(8px)",
                boxShadow: "0 18px 40px rgba(0,0,0,0.25)",
              }}
            >
              <Typography
                variant="h1"
                sx={{
                  fontSize: { xs: "2.2rem", sm: "3.1rem", md: "3.8rem" },
                  fontWeight: 900,
                  lineHeight: 1.12,
                  letterSpacing: "-0.015em",
                  mb: 1.5,
                  color: "#fff",
                  textShadow: "0 10px 28px rgba(0,0,0,0.55)",
                }}
              >
                <Box component="span" sx={{ color: "#CFF7D5" }}>
                  FiHealth
                </Box>
                <Box component="span" sx={{ opacity: 0.95 }}>
                  {" "}
                  – Trợ lý dinh dưỡng thông minh cho{" "}
                </Box>
                <Box component="span" sx={{ color: "#7CFF8A" }}>
                  người Việt
                </Box>
              </Typography>

              <Typography
                variant="h5"
                sx={{
                  color: "rgba(255,255,255,0.94)",
                  mb: 0,
                  fontSize: { xs: "1.02rem", md: "1.18rem" },
                  fontWeight: 600,
                  lineHeight: 1.6,
                  textShadow: "0 8px 22px rgba(0,0,0,0.45)",
                }}
              >
                FiHealth giúp bạn hiểu rõ bản thân và cải thiện hình thể, sức khỏe.
              </Typography>
            </Box>

            <Box sx={{ mt: 3 }}>

              <Typography>
              <Button
                variant="contained"
                size="large"
                onClick={() => navigate("/register")}
                sx={{
                  bgcolor: "#fff",
                  color: "success.main",
                  py: 1.8,
                  px: 4,
                  fontSize: "1.1rem",
                  fontWeight: 800,
                  borderRadius: 2,
                  textTransform: "none",
                  boxShadow: "0 12px 30px rgba(0,0,0,0.25)",
                  "&:hover": {
                    bgcolor: "#f5f5f5",
                    transform: "translateY(-2px)",
                    boxShadow: "0 16px 38px rgba(0,0,0,0.30)",
                  },
                  transition: "all 0.25s",
                }}
              >
                Dùng thử miễn phí 
              </Button>
</Typography>
              <Typography
                sx={{
                  mt: 2,
                  color: "rgba(255,255,255,0.95)",
                  textShadow: "0 6px 18px rgba(0,0,0,0.4)",
                }}
              >
                Đã có tài khoản?{" "}
                <Box
                  component="span"
                  sx={{
                    color: "#B6FFBF",
                    fontWeight: 800,
                    cursor: "pointer",
                    "&:hover": { textDecoration: "underline" },
                  }}
                  onClick={() => navigate("/login")}
                >
                  Đăng nhập
                </Box>
              </Typography>
            </Box>
          </Box>
        </Container>
      </Box>

      {/* Features Section */}
      <Container maxWidth="lg" sx={{ py: 8 }} id="features">
        <Box sx={{ textAlign: "center", mb: 6 }}>
          <Typography
            variant="h2"
            sx={{
              fontSize: { xs: "2rem", md: "2.5rem" },
              fontWeight: 900,
              mb: 2,
            }}
          >
            Tính Năng Nổi Bật
          </Typography>
          <Typography variant="h6" color="text.secondary" fontWeight={400}>
            Khám phá những tính năng mạnh mẽ giúp bạn quản lý vóc dáng, sức khỏe
          </Typography>
        </Box>

        <Stack spacing={4}>
          {/* Feature 1 */}
          <Box
            sx={{
              display: "flex",
              flexDirection: { xs: "column", md: "row" },
              gap: 4,
              alignItems: "center",
            }}
          >
            <Paper
              elevation={0}
              sx={{
                width: { xs: "100%", md: 200 },
                height: 200,
                borderRadius: 4,
                background: "linear-gradient(135deg, #e8f5e9 0%, #c8e6c9 100%)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                position: "relative",
                overflow: "hidden",
                "&::before": {
                  content: '""',
                  position: "absolute",
                  top: -50,
                  right: -50,
                  width: 150,
                  height: 150,
                  borderRadius: "50%",
                  background: "rgba(255,255,255,0.3)",
                },
              }}
            >
              <Box
                sx={{
                  width: 80,
                  height: 80,
                  borderRadius: "50%",
                  bgcolor: "success.main",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  zIndex: 1,
                }}
              >
                <CameraAlt sx={{ fontSize: 40, color: "#fff" }} />
              </Box>
            </Paper>

            <Box sx={{ flex: 1 }}>
              <Box
                sx={{
                  width: 60,
                  height: 4,
                  bgcolor: "success.main",
                  borderRadius: 2,
                  mb: 2,
                }}
              />
              <Typography sx={{ fontSize: "1.8rem", fontWeight: 800, mb: 2 }}>
                AI thông minh phân tích hình thể
              </Typography>
              <Typography sx={{ color: "text.secondary", mb: 2, lineHeight: 1.7 }}>
                Đăng tải hình ảnh hình thể để AI phân tích và cung cấp thông tin sức khỏe chi tiết dựa trên chỉ số cơ thể của bạn.
              </Typography>
              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <CheckCircle sx={{ color: "success.main", fontSize: 20 }} />
                <Typography variant="body2" fontWeight={600}>
                  Tính năng nổi bật #1
                </Typography>
              </Box>
            </Box>
          </Box>

          {/* Feature 2 */}
          <Box
            sx={{
              display: "flex",
              flexDirection: { xs: "column", md: "row-reverse" },
              gap: 4,
              alignItems: "center",
            }}
          >
            <Paper
              elevation={0}
              sx={{
                width: { xs: "100%", md: 200 },
                height: 200,
                borderRadius: 4,
                background: "linear-gradient(135deg, #fff3e0 0%, #ffe0b2 100%)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                position: "relative",
                overflow: "hidden",
                "&::before": {
                  content: '""',
                  position: "absolute",
                  top: -50,
                  left: -50,
                  width: 150,
                  height: 150,
                  borderRadius: "50%",
                  background: "rgba(255,255,255,0.3)",
                },
              }}
            >
              <Box
                sx={{
                  width: 80,
                  height: 80,
                  borderRadius: "50%",
                  bgcolor: "#ff9800",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  zIndex: 1,
                }}
              >
                <Settings sx={{ fontSize: 40, color: "#fff" }} />
              </Box>
            </Paper>

            <Box sx={{ flex: 1 }}>
              <Box sx={{ width: 60, height: 4, bgcolor: "#ff9800", borderRadius: 2, mb: 2 }} />
              <Typography sx={{ fontSize: "1.8rem", fontWeight: 800, mb: 2 }}>
                AI dinh dưỡng thông minh
              </Typography>
              <Typography sx={{ color: "text.secondary", mb: 2, lineHeight: 1.7 }}>
                Trợ lý AI thông minh sẵn sàng hỗ trợ bạn mọi lúc. Tư vấn dinh dưỡng đưa ra các thực đơn healthy phù hợp với nhu cầu và mục tiêu của bạn.
              </Typography>
              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <CheckCircle sx={{ color: "#ff9800", fontSize: 20 }} />
                <Typography variant="body2" fontWeight={600}>
                  Tính năng nổi bật #2
                </Typography>
              </Box>
            </Box>
          </Box>

          {/* Feature 3 */}
          <Box
            sx={{
              display: "flex",
              flexDirection: { xs: "column", md: "row" },
              gap: 4,
              alignItems: "center",
            }}
          >
            <Paper
              elevation={0}
              sx={{
                width: { xs: "100%", md: 200 },
                height: 200,
                borderRadius: 4,
                background: "linear-gradient(135deg, #f3e5f5 0%, #e1bee7 100%)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                position: "relative",
                overflow: "hidden",
                "&::before": {
                  content: '""',
                  position: "absolute",
                  bottom: -50,
                  right: -50,
                  width: 150,
                  height: 150,
                  borderRadius: "50%",
                  background: "rgba(255,255,255,0.3)",
                },
              }}
            >
              <Box
                sx={{
                  width: 80,
                  height: 80,
                  borderRadius: "50%",
                  bgcolor: "#9c27b0",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  zIndex: 1,
                }}
              >
                <FitnessCenter sx={{ fontSize: 40, color: "#fff" }} />
              </Box>
            </Paper>

            <Box sx={{ flex: 1 }}>
              <Box sx={{ width: 60, height: 4, bgcolor: "#9c27b0", borderRadius: 2, mb: 2 }} />
              <Typography sx={{ fontSize: "1.8rem", fontWeight: 800, mb: 2 }}>
                Chế Độ Cá Nhân Hóa
              </Typography>
              <Typography sx={{ color: "text.secondary", mb: 2, lineHeight: 1.7 }}>
                Dựa trên tình trạng sức khỏe, chỉ số sinh học và mục tiêu cá nhân,
                hệ thống đề xuất chế độ dinh dưỡng và luyện tập phù hợp.
                Theo dõi tiến độ và đạt mục tiêu một cách khoa học.
              </Typography>
              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <CheckCircle sx={{ color: "#9c27b0", fontSize: 20 }} />
                <Typography variant="body2" fontWeight={600}>
                  Tính năng nổi bật #3
                </Typography>
              </Box>
            </Box>
          </Box>

          {/* Feature 4 */}
          <Box
            sx={{
              display: "flex",
              flexDirection: { xs: "column", md: "row-reverse" },
              gap: 4,
              alignItems: "center",
            }}
          >
            <Paper
              elevation={0}
              sx={{
                width: { xs: "100%", md: 200 },
                height: 200,
                borderRadius: 4,
                background: "linear-gradient(135deg, #e3f2fd 0%, #bbdefb 100%)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                position: "relative",
                overflow: "hidden",
                "&::before": {
                  content: '""',
                  position: "absolute",
                  bottom: -50,
                  left: -50,
                  width: 150,
                  height: 150,
                  borderRadius: "50%",
                  background: "rgba(255,255,255,0.3)",
                },
              }}
            >
              <Box
                sx={{
                  width: 80,
                  height: 80,
                  borderRadius: "50%",
                  bgcolor: "#2196f3",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  zIndex: 1,
                }}
              >
                <NotificationsActive sx={{ fontSize: 40, color: "#fff" }} />
              </Box>
            </Paper>

            <Box sx={{ flex: 1 }}>
              <Box sx={{ width: 60, height: 4, bgcolor: "#2196f3", borderRadius: 2, mb: 2 }} />
              <Typography sx={{ fontSize: "1.8rem", fontWeight: 800, mb: 2 }}>
                Nhắc Nhở Thông Minh
              </Typography>
              <Typography sx={{ color: "text.secondary", mb: 2, lineHeight: 1.7 }}>
                Hệ thống nhắc nhở thông minh giúp bạn duy trì thói quen lành mạnh.
              </Typography>
              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <CheckCircle sx={{ color: "#2196f3", fontSize: 20 }} />
                <Typography variant="body2" fontWeight={600}>
                  Tính năng nổi bật #4
                </Typography>
              </Box>
            </Box>
          </Box>
        </Stack>
      </Container>

      {/* Benefits Section */}
      <Box
        id="benefits"
        sx={{
          background: "linear-gradient(135deg, #20ce11 0%, #e8f5e9 100%)",
          py: 8,
        }}
      >
        <Container maxWidth="lg">
          <Box
            sx={{
              display: "flex",
              flexDirection: { xs: "column", md: "row" },
              gap: 6,
              alignItems: "center",
            }}
          >
            <Box sx={{ flex: 1 }}>
              <Typography
                variant="h2"
                sx={{
                  fontSize: { xs: "2rem", md: "2.5rem" },
                  fontWeight: 900,
                  mb: 3,
                }}
              >
                Tại Sao Chọn FiHealth?
              </Typography>
              <Typography sx={{ color: "text.secondary", mb: 4, lineHeight: 1.7 }}>
                FiHealth là giải pháp toàn diện giúp bạn quản lý sức khỏe, vóc dáng một cách thông minh,
                tiện lợi và hiệu quả. Với công nghệ AI tiên tiến, chúng tôi mang đến trải nghiệm tốt nhất cho bạn.
              </Typography>

              <Stack spacing={2}>
                {[
                  "Truy cập mọi lúc, mọi nơi",
                  "Bảo mật thông tin tuyệt đối",
                  "AI hỗ trợ 24/7",
                  "Giao diện thân thiện, dễ sử dụng",
                  "Hoàn toàn miễn phí",
                  "AI thông minh hỗ trợ xây dựng bữa ăn healthy",
                ].map((benefit, idx) => (
                  <Box key={idx} sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                    <Box
                      sx={{
                        width: 32,
                        height: 32,
                        borderRadius: "50%",
                        bgcolor: "success.main",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        flexShrink: 0,
                      }}
                    >
                      <CheckCircle sx={{ color: "#fff", fontSize: 20 }} />
                    </Box>
                    <Typography sx={{ fontSize: "1.05rem", fontWeight: 500 }}>
                      {benefit}
                    </Typography>
                  </Box>
                ))}
              </Stack>
            </Box>

            <Paper
              elevation={0}
              sx={{
                width: { xs: "100%", md: 400 },
                height: 400,
                borderRadius: 4,
                background: "linear-gradient(135deg, #2e7d32 0%, #66bb6a 100%)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                position: "relative",
                overflow: "hidden",
              }}
            >
              <Box
                sx={{
                  position: "absolute",
                  top: -100,
                  right: -100,
                  width: 300,
                  height: 300,
                  borderRadius: "50%",
                  background: "rgba(255,255,255,0.1)",
                }}
              />
              <Box
                sx={{
                  position: "absolute",
                  bottom: -80,
                  left: -80,
                  width: 250,
                  height: 250,
                  borderRadius: "50%",
                  background: "rgba(255,255,255,0.1)",
                }}
              />
              <Shield sx={{ fontSize: 120, color: "rgba(255,255,255,0.9)", zIndex: 1 }} />
            </Paper>
          </Box>
        </Container>
      </Box>

      {/* CTA Section */}
      <Box
        sx={{
          background: "linear-gradient(135deg, #1b5e20 0%, #2e7d32 100%)",
          py: 10,
          color: "#fff",
        }}
      >
        <Container maxWidth="md">
          <Typography
            variant="h2"
            sx={{
              fontSize: { xs: "2rem", md: "2.5rem" },
              fontWeight: 900,
              textAlign: "center",
              mb: 2,
            }}
          >
            Sẵn Sàng Bắt Đầu?
          </Typography>

          <Typography
            variant="h6"
            sx={{
              textAlign: "center",
              mb: 4,
              opacity: 0.9,
              fontWeight: 400,
            }}
          >
            Tham gia cùng hàng nghìn người dùng đã tin tưởng FiHealth
            <br />
            để quản lý sức khỏe của họ
          </Typography>

          <Stack direction={{ xs: "column", sm: "row" }} spacing={2} sx={{ justifyContent: "center" }}>
            <Button
              variant="contained"
              size="large"
              startIcon={<PersonAdd />}
              onClick={() => navigate("/register")}
              sx={{
                bgcolor: "#fff",
                color: "success.main",
                py: 1.8,
                px: 4,
                fontSize: "1.1rem",
                fontWeight: 700,
                borderRadius: 2,
                "&:hover": {
                  bgcolor: "#f5f5f5",
                  transform: "translateY(-2px)",
                },
                transition: "all 0.3s",
              }}
            >
              Đăng Ký Miễn Phí
            </Button>

            <Button
              variant="outlined"
              size="large"
              startIcon={<Login />}
              onClick={() => navigate("/login")}
              sx={{
                borderColor: "#fff",
                color: "#fff",
                py: 1.8,
                px: 4,
                fontSize: "1.1rem",
                fontWeight: 700,
                borderRadius: 2,
                "&:hover": {
                  borderColor: "#fff",
                  bgcolor: "rgba(255,255,255,0.1)",
                  transform: "translateY(-2px)",
                },
                transition: "all 0.3s",
              }}
            >
              Đăng Nhập Ngay
            </Button>
          </Stack>
        </Container>
      </Box>

      {/* Footer */}
      <Box sx={{ bgcolor: "#1a1a1a", color: "#fff", py: 4, textAlign: "center" }}>
        <Container maxWidth="lg">
          <Typography sx={{ mb: 1 }}>© 2026 FiHealth. All rights reserved.</Typography>
          <Typography variant="body2" sx={{ opacity: 0.7 }}>
            Made with ❤️ for your health
          </Typography>
        </Container>
      </Box>
    </Box>
  );
}
