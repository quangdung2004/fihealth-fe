import { useNavigate } from "react-router-dom";
import {
    Box,
    Button,
    Container,
    Typography,
    Stack,
    Paper,
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

export function HomePage() {
    const navigate = useNavigate();

    return (
        <Box sx={{ minHeight: "100vh", bgcolor: "#fff" }}>
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
                        <Stack direction="row" spacing={1} alignItems="center">
                            <Box
                                sx={{
                                    width: 40,
                                    height: 40,
                                    borderRadius: 2,
                                    background: "linear-gradient(135deg, #2e7d32 0%, #66bb6a 100%)",
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                }}
                            >
                                <Shield sx={{ color: "#fff", fontSize: 24 }} />
                            </Box>
                            <Typography variant="h6" fontWeight={800}>
                                FiHealth
                            </Typography>
                        </Stack>

                        <Stack direction="row" spacing={2} sx={{ display: { xs: "none", sm: "flex" } }}>
                            <Typography
                                sx={{
                                    cursor: "pointer",
                                    "&:hover": { color: "success.main" },
                                    transition: "color 0.2s",
                                }}
                                onClick={() => document.getElementById("features")?.scrollIntoView({ behavior: "smooth" })}
                            >
                                Tính năng
                            </Typography>
                            <Typography
                                sx={{
                                    cursor: "pointer",
                                    "&:hover": { color: "success.main" },
                                    transition: "color 0.2s",
                                }}
                                onClick={() => document.getElementById("benefits")?.scrollIntoView({ behavior: "smooth" })}
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

            {/* Hero Section */}
            <Container maxWidth="lg" sx={{ py: { xs: 6, md: 10 } }}>
                <Box
                    sx={{
                        textAlign: "center",
                        maxWidth: 900,
                        mx: "auto",
                    }}
                >
                    <Typography
                        variant="h1"
                        sx={{
                            fontSize: { xs: "2.5rem", sm: "3.5rem", md: "4rem" },
                            fontWeight: 900,
                            lineHeight: 1.1,
                            mb: 3,
                            background: "linear-gradient(135deg, #1b5e20 0%, #2e7d32 50%, #66bb6a 100%)",
                            WebkitBackgroundClip: "text",
                            WebkitTextFillColor: "transparent",
                            backgroundClip: "text",
                        }}
                    >
                        Fihealth trợ lý dinh dưỡng thông minh cho người Việt
                        
                    </Typography>

                    <Typography
                        variant="h5"
                        sx={{
                            color: "text.secondary",
                            mb: 4,
                            fontSize: { xs: "1.1rem", md: "1.3rem" },
                            fontWeight: 400,
                            lineHeight: 1.6,
                        }}
                    >
                        FiHealth giúp bạn hiểu rõ bản thân và cải thiện hình thể, sức khỏe.
                    </Typography>



                    <Box>
                        <Button
                            variant="contained"
                            color="success"
                            size="large"
                            onClick={() => navigate("/register")}
                            sx={{
                                py: 1.8,
                                px: 4,
                                fontSize: "1.1rem",
                                fontWeight: 700,
                                borderRadius: 2,
                                textTransform: "none",
                                boxShadow: "0 8px 24px rgba(46, 125, 50, 0.3)",
                                "&:hover": {
                                    boxShadow: "0 12px 32px rgba(46, 125, 50, 0.4)",
                                    transform: "translateY(-2px)",
                                },
                                transition: "all 0.3s",
                            }}
                        >
                            Dùng thử miễn phí - không cần thẻ
                        </Button>
                        <Typography sx={{ mt: 2, color: "text.secondary" }}>
                            Đã có tài khoản?{" "}
                            <Box
                                component="span"
                                sx={{
                                    color: "success.main",
                                    fontWeight: 600,
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
                            <Typography variant="h3" sx={{ fontSize: "1.8rem", fontWeight: 800, mb: 2 }}>
                                Lưu Trữ Hồ Sơ Y Tế Thông Minh
                            </Typography>
                            <Typography sx={{ color: "text.secondary", mb: 2, lineHeight: 1.7 }}>
                                Chụp ảnh hồ sơ y tế và tự động chuyển đổi thành dữ liệu số hóa.
                                Công nghệ OCR tiên tiến giúp trích xuất thông tin chính xác,
                                lưu trữ an toàn và truy cập mọi lúc mọi nơi.
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
                            <Box
                                sx={{
                                    width: 60,
                                    height: 4,
                                    bgcolor: "#ff9800",
                                    borderRadius: 2,
                                    mb: 2,
                                }}
                            />
                            <Typography variant="h3" sx={{ fontSize: "1.8rem", fontWeight: 800, mb: 2 }}>
                                AI Tư Vấn Y Tế 24/7
                            </Typography>
                            <Typography sx={{ color: "text.secondary", mb: 2, lineHeight: 1.7 }}>
                                Trợ lý AI thông minh được đào tạo bởi các chuyên gia y tế, sẵn sàng hỗ trợ bạn mọi lúc.
                                Giải đáp thắc mắc về sức khỏe, đưa ra lời khuyên y tế phù hợp và hướng dẫn chăm sóc bản thân.
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
                            <Box
                                sx={{
                                    width: 60,
                                    height: 4,
                                    bgcolor: "#9c27b0",
                                    borderRadius: 2,
                                    mb: 2,
                                }}
                            />
                            <Typography variant="h3" sx={{ fontSize: "1.8rem", fontWeight: 800, mb: 2 }}>
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
                            <Box
                                sx={{
                                    width: 60,
                                    height: 4,
                                    bgcolor: "#2196f3",
                                    borderRadius: 2,
                                    mb: 2,
                                }}
                            />
                            <Typography variant="h3" sx={{ fontSize: "1.8rem", fontWeight: 800, mb: 2 }}>
                                Nhắc Nhở Thông Minh
                            </Typography>
                            <Typography sx={{ color: "text.secondary", mb: 2, lineHeight: 1.7 }}>
                                Lên lịch nhắc nhở uống thuốc, khám bệnh định kỳ, tập luyện và các hoạt động chăm sóc sức khỏe.
                                Thông báo đúng lúc, không bao giờ quên. Tùy chỉnh linh hoạt theo nhu cầu của bạn.
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
                    background: "linear-gradient(135deg, #f5f5f5 0%, #e8f5e9 100%)",
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
                                tiện lợi và hiệu quả. Với công nghệ AI tiên tiến, chúng tôi mang đến trải nghiệm
                                tốt nhất cho bạn.
                            </Typography>

                            <Stack spacing={2}>
                                {[
                                    "Quản lý hồ sơ y tế tập trung",
                                    "Truy cập mọi lúc, mọi nơi",
                                    "Bảo mật thông tin tuyệt đối",
                                    "AI hỗ trợ 24/7",
                                    "Giao diện thân thiện, dễ sử dụng",
                                    "Hoàn toàn miễn phí",
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

                    <Stack
                        direction={{ xs: "column", sm: "row" }}
                        spacing={2}
                        sx={{ justifyContent: "center" }}
                    >
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
            <Box
                sx={{
                    bgcolor: "#1a1a1a",
                    color: "#fff",
                    py: 4,
                    textAlign: "center",
                }}
            >
                <Container maxWidth="lg">
                    <Typography sx={{ mb: 1 }}>
                        © 2026 FiHealth. All rights reserved.
                    </Typography>
                    <Typography variant="body2" sx={{ opacity: 0.7 }}>
                        Made with ❤️ for your health
                    </Typography>
                </Container>
            </Box>
        </Box>
    );
}
