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
import recipeApi from "../../../api/recipeApi";
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

export function RecipeListPage() {
  const navigate = useNavigate();
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(20);
  const [totalElements, setTotalElements] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);
  const [importDialogOpen, setImportDialogOpen] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "success" });

  const fetchRecipes = async () => {
    setLoading(true);
    try {
      const res = await recipeApi.getAll({ q: searchQuery, page, size: rowsPerPage });
      const pageData = res.data?.data;
      setRecipes(pageData?.content || []);
      setTotalElements(pageData?.totalElements || 0);
    } catch (error) {
      console.error("Lỗi tải danh sách công thức", error);
      setRecipes([]);
      setTotalElements(0);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const debounceId = setTimeout(() => {
      fetchRecipes();
    }, 400);
    return () => clearTimeout(debounceId);
  }, [page, rowsPerPage, searchQuery]);

  const handleDelete = async () => {
    try {
      await recipeApi.delete(itemToDelete);
      await fetchRecipes();
      setSnackbar({ open: true, message: "Xóa thành công!", severity: "success" });
    } catch (error) {
      console.error("Lỗi khi xóa công thức", error);
      setSnackbar({ open: true, message: "Xóa thất bại!", severity: "error" });
    } finally {
      setDeleteDialogOpen(false);
      setItemToDelete(null);
    }
  };

  const handleImportRecipes = async (file) => {
    const res = await recipeApi.importExcel(file);
    await fetchRecipes();
    setSnackbar({ open: true, message: "Import công thức hoàn tất", severity: "success" });
    return res.data?.data;
  };

  return (
    <Box>
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 3, gap: 2, flexWrap: "wrap" }}>
        <Typography variant="h4" fontWeight={700}>Quản lý công thức</Typography>
        <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
          <Button variant="outlined" startIcon={<CloudUpload />} onClick={() => setImportDialogOpen(true)}>
            Import Excel
          </Button>
          <Button variant="contained" startIcon={<Add />} onClick={() => navigate("/admin/recipes/create")} color="success">
            Thêm công thức
          </Button>
        </Stack>
      </Box>

      <Paper elevation={2} sx={{ mb: 3, p: 2 }}>
        <TextField
          fullWidth
          variant="outlined"
          placeholder="Tìm kiếm công thức..."
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
                <TableCell>Tên công thức</TableCell>
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
                  <TableCell colSpan={9} align="center">Đang tải...</TableCell>
                </TableRow>
              ) : recipes.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={9} align="center">Không tìm thấy dữ liệu</TableCell>
                </TableRow>
              ) : (
                recipes.map((recipe) => (
                  <TableRow key={recipe.id} hover>
                    <TableCell>
                      <Typography fontWeight={600}>{recipe.name}</Typography>
                      {recipe.description ? (
                        <Typography variant="body2" color="text.secondary">{recipe.description}</Typography>
                      ) : null}
                    </TableCell>
                    <TableCell align="right">{recipe.kcal}</TableCell>
                    <TableCell align="right">{recipe.proteinG}g</TableCell>
                    <TableCell align="right">{recipe.fatG}g</TableCell>
                    <TableCell align="right">{recipe.carbG}g</TableCell>
                    <TableCell>
                      <Stack direction="row" spacing={0.5} useFlexGap flexWrap="wrap">
                        {getTagEnums(recipe).length > 0 ? (
                          getTagEnums(recipe).map((tag) => (
                            <Chip key={`${recipe.id}-${tag}`} label={prettifyTag(tag)} size="small" />
                          ))
                        ) : (
                          <Typography variant="body2" color="text.secondary">-</Typography>
                        )}
                      </Stack>
                    </TableCell>
                    <TableCell align="right">{recipe.estimatedCostVnd?.toLocaleString()}</TableCell>
                    <TableCell align="right">{recipe.active ? "Có" : "Không"}</TableCell>
                    <TableCell align="right">
                      <IconButton color="primary" onClick={() => navigate(`/admin/recipes/${recipe.id}`)}>
                        <Edit />
                      </IconButton>
                      <IconButton color="error" onClick={() => { setItemToDelete(recipe.id); setDeleteDialogOpen(true); }}>
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
        title="Import công thức từ Excel"
        description="Upload file .xlsx hoặc .xls để thêm nhanh danh sách công thức vào bảng recipe và recipe_ingredient."
        expectedColumns={[
          "name",
          "description",
          "kcal",
          "proteinG",
          "fatG",
          "carbG",
          "estimatedCostVnd",
          "tags",
          "tagEnums",
          "active",
          "ingredients",
        ]}
        notes={[
          "ingredients nên theo dạng foodItemId:amount;foodItemId:amount.",
          "tagEnums nhập dạng HIGH_PROTEIN,WEIGHT_LOSS,HEALTHY.",
          "Nút này cần backend có endpoint POST /api/admin/recipes/import để hoạt động.",
        ]}
        onImport={handleImportRecipes}
        successMessage="Import công thức thành công"
      />

      <Dialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)}>
        <DialogTitle>Xác nhận xóa</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Bạn có chắc chắn muốn xóa công thức này không? Thao tác này không thể hoàn tác.
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
