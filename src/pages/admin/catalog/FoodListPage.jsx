import { useEffect, useState } from "react";
import {
  Alert,
  Box,
  Button,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  IconButton,
  InputAdornment,
  Paper,
  Snackbar,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  TextField,
  Typography,
} from "@mui/material";
import { Add, CloudUpload, Delete, Edit, Search } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import foodApi from "../../../api/foodApi";
import ExcelImportDialog from "../../../components/common/ExcelImportDialog";

const prettifyTag = (tag) =>
  tag
    ?.split("_")
    .map((part) => part.charAt(0) + part.slice(1).toLowerCase())
    .join(" ") || "";

const getTagEnums = (item) => {
  if (Array.isArray(item?.tagEnums) && item.tagEnums.length > 0) return item.tagEnums;
  if (typeof item?.tags === "string" && item.tags.trim()) {
    return item.tags.split(",").map((tag) => tag.trim()).filter(Boolean);
  }
  return [];
};

export function FoodListPage() {
  const navigate = useNavigate();
  const [foods, setFoods] = useState([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(20);
  const [totalElements, setTotalElements] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);
  const [importDialogOpen, setImportDialogOpen] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "success" });

  const fetchFoods = async () => {
    setLoading(true);
    try {
      const res = await foodApi.search({ q: searchQuery, page, size: rowsPerPage });
      const pageData = res.data?.data;
      setFoods(pageData?.content || []);
      setTotalElements(pageData?.totalElements || 0);
    } catch (error) {
      console.error("Lỗi tải thông tin món ăn", error);
      setFoods([]);
      setTotalElements(0);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const debounceId = setTimeout(() => {
      fetchFoods();
    }, 400);
    return () => clearTimeout(debounceId);
  }, [page, rowsPerPage, searchQuery]);

  const handleDelete = async () => {
    try {
      await foodApi.adminDelete(itemToDelete);
      await fetchFoods();
      setSnackbar({ open: true, message: "Xóa thành công!", severity: "success" });
    } catch (error) {
      console.error("Lỗi khi xóa món ăn", error);
      setSnackbar({ open: true, message: "Xóa thất bại!", severity: "error" });
    } finally {
      setDeleteDialogOpen(false);
      setItemToDelete(null);
    }
  };

  const handleImportFoods = async (file) => {
    const res = await foodApi.adminImport(file);
    await fetchFoods();
    setSnackbar({ open: true, message: "Import món ăn hoàn tất", severity: "success" });
    return res.data?.data;
  };

  return (
    <Box>
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 3, gap: 2, flexWrap: "wrap" }}>
        <Typography variant="h4" fontWeight={700}>Quản lý món ăn</Typography>
        <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
          <Button variant="outlined" startIcon={<CloudUpload />} onClick={() => setImportDialogOpen(true)}>
            Import Excel
          </Button>
          <Button variant="contained" startIcon={<Add />} onClick={() => navigate("/admin/foods/create")} color="success">
            Thêm món ăn
          </Button>
        </Stack>
      </Box>

      <Paper elevation={2} sx={{ mb: 3, p: 2 }}>
        <TextField
          fullWidth
          variant="outlined"
          placeholder="Tìm kiếm món ăn..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Search />
              </InputAdornment>
            ),
          }}
        />
      </Paper>

      <Paper elevation={2}>
        <TableContainer>
          <Table>
            <TableHead sx={{ bgcolor: "grey.100" }}>
              <TableRow>
                <TableCell>Tên món ăn</TableCell>
                <TableCell>Thương hiệu</TableCell>
                <TableCell>Khẩu phần</TableCell>
                <TableCell align="right">Kcal</TableCell>
                <TableCell align="right">Đạm (g)</TableCell>
                <TableCell align="right">Béo (g)</TableCell>
                <TableCell align="right">Tinh bột (g)</TableCell>
                <TableCell>Tags</TableCell>
                <TableCell align="right">Giá (VND)</TableCell>
                <TableCell align="right">Trạng thái</TableCell>
                <TableCell align="right">Hành động</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={11} align="center">Đang tải...</TableCell>
                </TableRow>
              ) : foods.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={11} align="center">Không tìm thấy dữ liệu</TableCell>
                </TableRow>
              ) : (
                foods.map((food) => (
                  <TableRow key={food.id} hover>
                    <TableCell>{food.name}</TableCell>
                    <TableCell>{food.brand || "-"}</TableCell>
                    <TableCell>{food.servingSize || "-"}</TableCell>
                    <TableCell align="right">{food.kcalPerServing}</TableCell>
                    <TableCell align="right">{food.proteinG}g</TableCell>
                    <TableCell align="right">{food.fatG}g</TableCell>
                    <TableCell align="right">{food.carbG}g</TableCell>
                    <TableCell>
                      <Stack direction="row" spacing={0.5} useFlexGap flexWrap="wrap">
                        {getTagEnums(food).length > 0 ? (
                          getTagEnums(food).map((tag) => (
                            <Chip key={`${food.id}-${tag}`} label={prettifyTag(tag)} size="small" />
                          ))
                        ) : (
                          <Typography variant="body2" color="text.secondary">-</Typography>
                        )}
                      </Stack>
                    </TableCell>
                    <TableCell align="right">{food.estimatedPriceVndPerServing?.toLocaleString()}</TableCell>
                    <TableCell align="right">{food.active ? "Có" : "Không"}</TableCell>
                    <TableCell align="right">
                      <IconButton color="primary" onClick={() => navigate(`/admin/foods/${food.id}`)}>
                        <Edit />
                      </IconButton>
                      <IconButton color="error" onClick={() => { setItemToDelete(food.id); setDeleteDialogOpen(true); }}>
                        <Delete />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={[10, 20, 50]}
          component="div"
          count={totalElements}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={(_, newPage) => setPage(newPage)}
          onRowsPerPageChange={(event) => {
            setRowsPerPage(parseInt(event.target.value, 10));
            setPage(0);
          }}
        />
      </Paper>

      <ExcelImportDialog
        open={importDialogOpen}
        onClose={() => setImportDialogOpen(false)}
        title="Import món ăn từ Excel"
        description="Upload file .xlsx hoặc .xls để thêm nhanh danh sách món ăn vào bảng food_item."
        expectedColumns={[
          "name",
          "brand",
          "servingSize",
          "kcalPerServing",
          "proteinG",
          "fatG",
          "carbG",
          "estimatedPriceVndPerServing",
          "tags",
          "tagEnums",
          "active",
        ]}
        notes={[
          "Cột name, servingSize, kcalPerServing, proteinG, fatG, carbG, estimatedPriceVndPerServing là bắt buộc.",
          "tagEnums nhập dạng HIGH_PROTEIN,LOW_CARB,HEALTHY.",
          "Nếu trùng tên món, backend có thể cập nhật bản ghi hiện có tùy logic backend.",
        ]}
        onImport={handleImportFoods}
        successMessage="Import món ăn thành công"
      />

      <Dialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)}>
        <DialogTitle>Xác nhận xóa</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Bạn có chắc chắn muốn xóa món ăn này không? Thao tác này không thể hoàn tác.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)} color="inherit">Hủy</Button>
          <Button onClick={handleDelete} color="error" variant="contained">Xóa</Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={() => setSnackbar((prev) => ({ ...prev, open: false }))}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
      >
        <Alert onClose={() => setSnackbar((prev) => ({ ...prev, open: false }))} severity={snackbar.severity} sx={{ width: "100%" }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
}
