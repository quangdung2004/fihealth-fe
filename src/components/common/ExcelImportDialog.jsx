import { useEffect, useMemo, useState } from "react";
import {
  Alert,
  Box,
  Button,
  Chip,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  Stack,
  Typography,
} from "@mui/material";
import { CloudUpload, InsertDriveFile } from "@mui/icons-material";

export default function ExcelImportDialog({
  open,
  onClose,
  title,
  description,
  expectedColumns = [],
  notes = [],
  onImport,
  successMessage = "Import thành công",
}) {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!open) {
      setFile(null);
      setLoading(false);
      setResult(null);
      setError("");
    }
  }, [open]);

  const acceptLabel = useMemo(() => {
    if (!file) return "Chưa chọn file";
    return `${file.name} (${Math.round(file.size / 1024)} KB)`;
  }, [file]);

  const handleFileChange = (event) => {
    const selected = event.target.files?.[0] || null;
    setFile(selected);
    setError("");
    setResult(null);
  };

  const handleImport = async () => {
    if (!file) {
      setError("Vui lòng chọn file Excel .xlsx hoặc .xls");
      return;
    }

    setLoading(true);
    setError("");
    try {
      const importResult = await onImport(file);
      setResult(importResult);
    } catch (err) {
      console.error("Import failed", err);
      const apiMessage =
        err?.response?.data?.message ||
        err?.response?.data?.error ||
        err?.message ||
        "Import thất bại";
      setError(apiMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onClose={loading ? undefined : onClose} fullWidth maxWidth="md">
      <DialogTitle>{title}</DialogTitle>
      <DialogContent dividers>
        <Stack spacing={2}>
          {description ? <Typography color="text.secondary">{description}</Typography> : null}

          <Box
            sx={{
              border: "1px dashed",
              borderColor: "divider",
              borderRadius: 2,
              p: 2,
              display: "flex",
              flexDirection: { xs: "column", sm: "row" },
              alignItems: { xs: "stretch", sm: "center" },
              gap: 2,
            }}
          >
            <Button component="label" variant="contained" startIcon={<CloudUpload />} disabled={loading}>
              Chọn file Excel
              <input hidden type="file" accept=".xlsx,.xls" onChange={handleFileChange} />
            </Button>

            <Stack direction="row" spacing={1} alignItems="center" sx={{ minWidth: 0 }}>
              <InsertDriveFile color={file ? "success" : "disabled"} />
              <Typography noWrap>{acceptLabel}</Typography>
            </Stack>
          </Box>

          {expectedColumns.length > 0 ? (
            <>
              <Divider />
              <Box>
                <Typography variant="subtitle2" gutterBottom>
                  Header cột Excel cần có
                </Typography>
                <Stack direction="row" spacing={1} useFlexGap flexWrap="wrap">
                  {expectedColumns.map((column) => (
                    <Chip key={column} label={column} size="small" />
                  ))}
                </Stack>
              </Box>
            </>
          ) : null}

          {notes.length > 0 ? (
            <Alert severity="info">
              <Stack spacing={0.5}>
                {notes.map((note) => (
                  <Typography key={note} variant="body2">
                    • {note}
                  </Typography>
                ))}
              </Stack>
            </Alert>
          ) : null}

          {loading ? (
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <CircularProgress size={20} />
              <Typography>Đang import file...</Typography>
            </Box>
          ) : null}

          {error ? <Alert severity="error">{error}</Alert> : null}

          {result ? (
            <Alert severity="success">
              <Typography fontWeight={700}>{successMessage}</Typography>
              {typeof result.totalRows !== "undefined" ? (
                <Typography variant="body2">Tổng dòng: {result.totalRows}</Typography>
              ) : null}
              {typeof result.successCount !== "undefined" ? (
                <Typography variant="body2">Thành công: {result.successCount}</Typography>
              ) : null}
              {typeof result.failedCount !== "undefined" ? (
                <Typography variant="body2">Thất bại: {result.failedCount}</Typography>
              ) : null}
              {Array.isArray(result.errors) && result.errors.length > 0 ? (
                <Box sx={{ mt: 1 }}>
                  <Typography variant="body2" fontWeight={700}>
                    Chi tiết lỗi:
                  </Typography>
                  {result.errors.slice(0, 10).map((item) => (
                    <Typography key={item} variant="body2">
                      • {item}
                    </Typography>
                  ))}
                </Box>
              ) : null}
            </Alert>
          ) : null}
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} disabled={loading} color="inherit">
          Đóng
        </Button>
        <Button onClick={handleImport} variant="contained" disabled={loading || !file}>
          Import
        </Button>
      </DialogActions>
    </Dialog>
  );
}
