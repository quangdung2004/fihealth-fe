import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { uploadBodyImage, getBodyAnalysis } from "../api/bodyAnalysisApi";
import {
    Box,
    Paper,
    Typography,
    TextField,
    Button,
    Alert,
    CircularProgress,
    Card,
    CardContent,
    Stack,
    Divider,
    Chip,
} from "@mui/material";
import {
    FitnessCenter,
    CloudUpload,
    Search,
    Image as ImageIcon,
    WarningAmber,
} from "@mui/icons-material";

/**
 * UUID validation regex
 */
const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

/**
 * Max file size: 10MB
 */
const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB in bytes

function BodyAnalysisPage() {
    const { id } = useParams(); // Auto-fill từ route /assessments/:id/body-analysis
    const navigate = useNavigate();

    const [assessmentId, setAssessmentId] = useState(id || "");
    const [selectedFile, setSelectedFile] = useState(null);
    const [previewUrl, setPreviewUrl] = useState(null);
    const [loading, setLoading] = useState(false);
    const [loadingAnalysis, setLoadingAnalysis] = useState(false);
    const [error, setError] = useState("");
    const [result, setResult] = useState(null);

    // Auto-load analysis if route param exists
    useEffect(() => {
        if (id && UUID_REGEX.test(id)) {
            handleGetAnalysis();
        }
    }, [id]);

    // Cleanup preview URL on unmount or file change
    useEffect(() => {
        return () => {
            if (previewUrl) {
                URL.revokeObjectURL(previewUrl);
            }
        };
    }, [previewUrl]);

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (!file) return;

        // Validate file type
        if (!file.type.startsWith("image/")) {
            setError("Vui lòng chọn file ảnh");
            return;
        }

        // Warn if file size > 10MB
        if (file.size > MAX_FILE_SIZE) {
            setError(`⚠️ File lớn hơn 10MB (${(file.size / 1024 / 1024).toFixed(1)}MB). Upload có thể chậm.`);
        } else {
            setError("");
        }

        // Revoke old preview URL
        if (previewUrl) {
            URL.revokeObjectURL(previewUrl);
        }

        // Create new preview URL
        const url = URL.createObjectURL(file);
        setPreviewUrl(url);
        setSelectedFile(file);
    };

    const handleUploadAnalyze = async () => {
        setError("");
        setResult(null);

        // Validate assessment ID
        if (!UUID_REGEX.test(assessmentId.trim())) {
            setError("Assessment ID không đúng định dạng UUID");
            return;
        }

        // Validate file selected
        if (!selectedFile) {
            setError("⚠️ Vui lòng chọn ảnh trước khi phân tích");
            return;
        }

        setLoading(true);

        try {
            const data = await uploadBodyImage(assessmentId.trim(), selectedFile);
            setResult(data);
        } catch (err) {
            console.error("Upload body image error:", err);
            handleError(err);
        } finally {
            setLoading(false);
        }
    };

    const handleGetAnalysis = async () => {
        setError("");
        setResult(null);

        // Validate assessment ID
        if (!UUID_REGEX.test(assessmentId.trim())) {
            setError("Assessment ID không đúng định dạng UUID");
            return;
        }

        setLoadingAnalysis(true);

        try {
            const data = await getBodyAnalysis(assessmentId.trim());
            setResult(data);
        } catch (err) {
            console.error("Get body analysis error:", err);
            handleError(err);
        } finally {
            setLoadingAnalysis(false);
        }
    };

    const handleError = (err) => {
        const status = err?.response?.status;

        if (status === 401) {
            // Unauthorized - token expired
            localStorage.removeItem("accessToken");
            navigate("/login");
            return;
        }

        if (status === 403) {
            // Forbidden
            navigate("/403");
            return;
        }

        if (status === 404) {
            setError("❌ Chưa có phân tích cho assessment này. Vui lòng upload ảnh trước.");
            return;
        }

        // Generic error
        setError(err?.response?.data?.message || err.message || "Có lỗi xảy ra");
    };

    const formatBodyFat = (min, max) => {
        if (min == null && max == null) return "—";
        if (min == null) return `≤ ${max.toFixed(1)}%`;
        if (max == null) return `≥ ${min.toFixed(1)}%`;
        return `${min.toFixed(1)}% - ${max.toFixed(1)}%`;
    };

    return (
        <Box
            sx={{
                position: "fixed",
                inset: 0,
                display: "flex",
                overflow: "hidden",
                bgcolor: "#fff",
            }}
        >
            {/* LEFT */}
            <Box
                sx={{
                    flex: 1,
                    display: "flex",
                    alignItems: "flex-start",
                    justifyContent: "center",
                    px: 2,
                    py: 2,
                    overflowY: "auto",
                }}
            >
                <Paper elevation={3} sx={{ p: 4, width: "100%", maxWidth: 560, my: 2 }}>
                    {/* Header */}
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1 }}>
                        <FitnessCenter color="success" fontSize="large" />
                        <Box>
                            <Typography variant="h4" fontWeight={800}>
                                FiHealth
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                                Phân tích ảnh cơ thể
                            </Typography>
                        </Box>
                    </Box>

                    <Typography color="text.secondary" mb={2}>
                        Upload ảnh cơ thể để phân tích tỷ lệ mỡ, tư thế và cân đối.
                    </Typography>

                    {/* AI Highlight */}
                    <Paper
                        variant="outlined"
                        sx={{
                            p: 2,
                            mb: 3,
                            bgcolor: "#f1fdf9",
                            borderColor: "#cceee5",
                        }}
                    >
                        <Box sx={{ display: "flex", gap: 1 }}>
                            <ImageIcon color="success" />
                            <Box>
                                <Typography fontWeight={700}>Phân tích bằng AI</Typography>
                                <Typography variant="body2" color="text.secondary">
                                    AI sẽ phân tích ảnh của bạn và đưa ra đánh giá về tỷ lệ mỡ, tư thế và an toàn.
                                </Typography>
                            </Box>
                        </Box>
                    </Paper>

                    {/* Error Alert */}
                    {error && (
                        <Alert severity={error.includes("⚠️") ? "warning" : "error"} sx={{ mb: 2 }}>
                            {error}
                        </Alert>
                    )}

                    {/* Assessment ID Input */}
                    <TextField
                        label="Assessment ID *"
                        fullWidth
                        value={assessmentId}
                        onChange={(e) => setAssessmentId(e.target.value)}
                        placeholder="xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"
                        required
                        disabled={loading || loadingAnalysis}
                        error={assessmentId && !UUID_REGEX.test(assessmentId.trim())}
                        helperText={
                            assessmentId && !UUID_REGEX.test(assessmentId.trim())
                                ? "Định dạng UUID không hợp lệ"
                                : "Nhập UUID của assessment"
                        }
                        sx={{ mb: 2 }}
                    />

                    <Divider sx={{ my: 2 }}>
                        <Chip label="UPLOAD & PHÂN TÍCH ẢNH" color="primary" size="small" />
                    </Divider>

                    {/* File Upload */}
                    <Box sx={{ mb: 2 }}>
                        <input
                            accept="image/*"
                            style={{ display: "none" }}
                            id="image-upload-input"
                            type="file"
                            onChange={handleFileChange}
                        />
                        <label htmlFor="image-upload-input">
                            <Button
                                variant="outlined"
                                component="span"
                                fullWidth
                                startIcon={<ImageIcon />}
                                disabled={loading || loadingAnalysis}
                                sx={{ mb: 1 }}
                            >
                                {selectedFile ? `Đã chọn: ${selectedFile.name}` : "Chọn ảnh"}
                            </Button>
                        </label>

                        {/* Image Preview */}
                        {previewUrl && (
                            <Card variant="outlined" sx={{ mt: 2 }}>
                                <img
                                    src={previewUrl}
                                    alt="Preview"
                                    style={{
                                        width: "100%",
                                        maxHeight: "300px",
                                        objectFit: "contain",
                                    }}
                                />
                            </Card>
                        )}
                    </Box>

                    {/* Upload & Analyze Button */}
                    <Button
                        variant="contained"
                        color="success"
                        fullWidth
                        startIcon={loading ? <CircularProgress size={20} /> : <CloudUpload />}
                        onClick={handleUploadAnalyze}
                        disabled={loading || loadingAnalysis || !assessmentId || !UUID_REGEX.test(assessmentId.trim())}
                        sx={{ py: 1.2, mb: 2 }}
                    >
                        {loading ? "⏳ Đang phân tích... (20-60s)" : "PHÂN TÍCH ẢNH"}
                    </Button>

                    <Divider sx={{ my: 2 }}>
                        <Chip label="HOẶC" size="small" />
                    </Divider>

                    {/* Get Existing Analysis Button */}
                    <Button
                        variant="outlined"
                        color="primary"
                        fullWidth
                        startIcon={loadingAnalysis ? <CircularProgress size={20} /> : <Search />}
                        onClick={handleGetAnalysis}
                        disabled={loading || loadingAnalysis || !assessmentId || !UUID_REGEX.test(assessmentId.trim())}
                        sx={{ py: 1.2 }}
                    >
                        {loadingAnalysis ? "Đang tải..." : "TẢI KẾT QUẢ ĐÃ PHÂN TÍCH"}
                    </Button>

                    {/* Analysis Result */}
                    {result && (
                        <>
                            <Divider sx={{ my: 3 }}>
                                <Chip label="KẾT QUẢ PHÂN TÍCH" color="success" />
                            </Divider>

                            <Card variant="outlined" sx={{ bgcolor: "#f9fafb" }}>
                                <CardContent>
                                    <Typography variant="h6" fontWeight={700} mb={2}>
                                        Kết quả phân tích cơ thể
                                    </Typography>

                                    <Stack spacing={2}>
                                        {/* Body Fat */}
                                        <Box>
                                            <Typography variant="subtitle2" color="text.secondary" mb={0.5}>
                                                💪 Tỷ lệ mỡ cơ thể:
                                            </Typography>
                                            <Typography fontWeight={700} color="primary.main">
                                                {formatBodyFat(result.bodyFatMin, result.bodyFatMax)}
                                            </Typography>
                                        </Box>

                                        <Divider />

                                        {/* Posture Notes */}
                                        <Box>
                                            <Typography variant="subtitle2" color="text.secondary" mb={0.5}>
                                                🧍 Nhận xét về tư thế:
                                            </Typography>
                                            <Typography>{result.postureNotes || "—"}</Typography>
                                        </Box>

                                        <Divider />

                                        {/* Proportions Notes */}
                                        <Box>
                                            <Typography variant="subtitle2" color="text.secondary" mb={0.5}>
                                                📏 Nhận xét về cân đối:
                                            </Typography>
                                            <Typography>{result.proportionsNotes || "—"}</Typography>
                                        </Box>

                                        <Divider />

                                        {/* Safety Notes */}
                                        <Box>
                                            <Typography variant="subtitle2" color="text.secondary" mb={0.5}>
                                                ⚠️ Lưu ý an toàn:
                                            </Typography>
                                            <Typography>{result.safetyNotes || "—"}</Typography>
                                        </Box>
                                    </Stack>
                                </CardContent>
                            </Card>
                        </>
                    )}

                    <Divider sx={{ my: 3 }} />

                    <Stack direction="row" spacing={1}>
                        <Button size="small" onClick={() => navigate("/")}>
                            ← Về trang chủ
                        </Button>
                        <Button size="small" onClick={() => navigate("/assessments")}>
                            Danh sách Assessments
                        </Button>
                    </Stack>
                </Paper>
            </Box>

            {/* RIGHT - Background image */}
            <Box
                sx={{
                    flex: 1,
                    display: { xs: "none", md: "block" },
                    position: "relative",
                    backgroundImage:
                        "url(https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=1600&q=80)",
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                }}
            >
                <Box sx={{ position: "absolute", inset: 0, bgcolor: "rgba(255,255,255,0.75)" }} />
            </Box>
        </Box>
    );
}

export default BodyAnalysisPage;
