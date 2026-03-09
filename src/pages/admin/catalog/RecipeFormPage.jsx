import { useEffect, useMemo, useState } from "react";
import {
  Alert,
  Autocomplete,
  Box,
  Button,
  Chip,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  FormControlLabel,
  Grid,
  IconButton,
  List,
  ListItemButton,
  ListItemText,
  Paper,
  Snackbar,
  Switch,
  TextField,
  Typography,
} from "@mui/material";
import { Add, Delete, Search } from "@mui/icons-material";
import { useNavigate, useParams } from "react-router-dom";
import catalogTagApi from "../../../api/catalogTagApi";
import foodApi from "../../../api/foodApi";
import recipeApi from "../../../api/recipeApi";

const prettifyTag = (tag) =>
  tag
    ?.split("_")
    .map((part) => part.charAt(0) + part.slice(1).toLowerCase())
    .join(" ") || "";

const getTagEnumsFromPayload = (data) => {
  if (Array.isArray(data?.tagEnums) && data.tagEnums.length > 0) {
    return data.tagEnums;
  }

  if (typeof data?.tags === "string" && data.tags.trim()) {
    return data.tags
      .split(",")
      .map((item) => item.trim())
      .filter(Boolean);
  }

  return [];
};

export function RecipeFormPage() {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEdit = Boolean(id);

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    kcal: "",
    proteinG: "",
    fatG: "",
    carbG: "",
    estimatedCostVnd: "",
    active: true,
    ingredients: [],
  });
  const [tagOptions, setTagOptions] = useState([]);
  const [selectedTagEnums, setSelectedTagEnums] = useState([]);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [searchDialogIndex, setSearchDialogIndex] = useState(null);
  const [searchDialogQuery, setSearchDialogQuery] = useState("");
  const [searchDialogResults, setSearchDialogResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "success" });

  const tagPreview = useMemo(() => selectedTagEnums.join(","), [selectedTagEnums]);

  useEffect(() => {
    fetchCatalogTags();
    if (isEdit) {
      fetchRecipe();
    }
  }, [id]);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (searchDialogIndex !== null) {
        fetchFoodOptions(searchDialogQuery);
      }
    }, 400);

    return () => clearTimeout(timeoutId);
  }, [searchDialogQuery, searchDialogIndex]);

  const fetchCatalogTags = async () => {
    try {
      const res = await catalogTagApi.getAll();
      setTagOptions(res.data?.data || []);
    } catch (error) {
      console.error("Lỗi tải tag công thức", error);
      setTagOptions([]);
    }
  };

  const fetchFoodOptions = async (query) => {
    setIsSearching(true);
    try {
      const res = await foodApi.search({ q: query, size: 20 });
      const pageData = res.data?.data;
      setSearchDialogResults(pageData?.content || []);
    } catch (error) {
      console.error("Lỗi tìm kiếm món ăn", error);
      setSearchDialogResults([]);
    } finally {
      setIsSearching(false);
    }
  };

  const fetchRecipe = async () => {
    setLoading(true);
    try {
      const res = await recipeApi.getById(id);
      const data = res.data?.data;
      const ingredientsForForm = (data?.ingredients || []).map((item) => ({
        foodItemId: item.foodItem?.id || "",
        amount: item.amount || "",
        tempFood: item.foodItem || null,
      }));

      setFormData({
        name: data?.name || "",
        description: data?.description || "",
        kcal: data?.kcal ?? "",
        proteinG: data?.proteinG ?? "",
        fatG: data?.fatG ?? "",
        carbG: data?.carbG ?? "",
        estimatedCostVnd: data?.estimatedCostVnd ?? "",
        active: data?.active ?? true,
        ingredients: ingredientsForForm,
      });
      setSelectedTagEnums(getTagEnumsFromPayload(data));
    } catch (error) {
      console.error("Failed to fetch recipe", error);
      navigate("/admin/recipes");
    } finally {
      setLoading(false);
    }
  };

  const validate = () => {
    const temp = {};

    if (!formData.name.trim()) temp.name = "Tên là bắt buộc";
    if (formData.kcal === "" || Number(formData.kcal) < 0) temp.kcal = "Kcal không hợp lệ";
    if (formData.proteinG === "" || Number(formData.proteinG) < 0) temp.proteinG = "Protein không hợp lệ";
    if (formData.fatG === "" || Number(formData.fatG) < 0) temp.fatG = "Chất béo không hợp lệ";
    if (formData.carbG === "" || Number(formData.carbG) < 0) temp.carbG = "Carb không hợp lệ";
    if (formData.estimatedCostVnd === "" || Number(formData.estimatedCostVnd) < 0) {
      temp.estimatedCostVnd = "Giá tiền không hợp lệ";
    }

    formData.ingredients.forEach((item, index) => {
      if (!item.foodItemId) temp[`ing_${index}_food`] = "Cần chọn món ăn";
      if (!item.amount?.trim()) temp[`ing_${index}_amount`] = "Số lượng bắt buộc";
    });

    setErrors(temp);
    return Object.keys(temp).length === 0;
  };

  const handleAddIngredient = () => {
    setFormData((prev) => ({
      ...prev,
      ingredients: [...prev.ingredients, { foodItemId: "", amount: "", tempFood: null }],
    }));
  };

  const handleRemoveIngredient = (index) => {
    setFormData((prev) => ({
      ...prev,
      ingredients: prev.ingredients.filter((_, itemIndex) => itemIndex !== index),
    }));
  };

  const handleIngredientChange = (index, field, value) => {
    setFormData((prev) => ({
      ...prev,
      ingredients: prev.ingredients.map((item, itemIndex) =>
        itemIndex === index ? { ...item, [field]: value } : item
      ),
    }));
  };

  const handleSelectFood = (food) => {
    if (searchDialogIndex === null) return;

    setFormData((prev) => ({
      ...prev,
      ingredients: prev.ingredients.map((item, itemIndex) =>
        itemIndex === searchDialogIndex
          ? { ...item, tempFood: food, foodItemId: food.id }
          : item
      ),
    }));
    setSearchDialogIndex(null);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!validate()) return;

    setLoading(true);
    try {
      const payload = {
        ...formData,
        kcal: Number(formData.kcal),
        proteinG: Number(formData.proteinG),
        fatG: Number(formData.fatG),
        carbG: Number(formData.carbG),
        estimatedCostVnd: Number(formData.estimatedCostVnd),
        tags: tagPreview,
        tagEnums: selectedTagEnums,
        ingredients: formData.ingredients.map(({ foodItemId, amount }) => ({
          foodItemId,
          amount,
        })),
      };

      if (isEdit) {
        await recipeApi.update(id, payload);
      } else {
        await recipeApi.create(payload);
      }

      navigate("/admin/recipes");
    } catch (error) {
      console.error("Failed to save recipe", error);
      const message = error?.response?.data?.message || "Lưu công thức thất bại";
      setSnackbar({ open: true, message, severity: "error" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box>
      <Typography variant="h4" fontWeight={700} mb={3}>
        {isEdit ? "Chỉnh sửa công thức" : "Tạo công thức mới"}
      </Typography>

      <Paper elevation={2} sx={{ p: 4 }}>
        <Box component="form" onSubmit={handleSubmit}>
          <Grid container spacing={3}>
            <Grid size={12}>
              <TextField
                label="Tên công thức"
                fullWidth
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                error={Boolean(errors.name)}
                helperText={errors.name}
              />
            </Grid>

            <Grid size={12}>
              <TextField
                label="Mô tả"
                fullWidth
                multiline
                rows={3}
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              />
            </Grid>

            <Grid size={{ xs: 12, md: 4 }}>
              <TextField
                label="Giá tiền (VND)"
                type="number"
                fullWidth
                value={formData.estimatedCostVnd}
                onChange={(e) =>
                  setFormData({ ...formData, estimatedCostVnd: e.target.value })
                }
                error={Boolean(errors.estimatedCostVnd)}
                helperText={errors.estimatedCostVnd}
              />
            </Grid>

            <Grid size={{ xs: 12, md: 4 }}>
              <TextField
                label="Calories (kcal)"
                type="number"
                fullWidth
                value={formData.kcal}
                onChange={(e) => setFormData({ ...formData, kcal: e.target.value })}
                error={Boolean(errors.kcal)}
                helperText={errors.kcal}
              />
            </Grid>

            <Grid size={{ xs: 12, md: 4 }}>
              <FormControlLabel
                control={
                  <Switch
                    checked={formData.active}
                    onChange={(e) => setFormData({ ...formData, active: e.target.checked })}
                    color="success"
                  />
                }
                label="Hoạt động"
                sx={{ mt: 1 }}
              />
            </Grid>

            <Grid size={{ xs: 12, md: 4 }}>
              <TextField
                label="Chất đạm - Protein (g)"
                type="number"
                fullWidth
                value={formData.proteinG}
                onChange={(e) => setFormData({ ...formData, proteinG: e.target.value })}
                error={Boolean(errors.proteinG)}
                helperText={errors.proteinG}
              />
            </Grid>

            <Grid size={{ xs: 12, md: 4 }}>
              <TextField
                label="Chất béo - Fat (g)"
                type="number"
                fullWidth
                value={formData.fatG}
                onChange={(e) => setFormData({ ...formData, fatG: e.target.value })}
                error={Boolean(errors.fatG)}
                helperText={errors.fatG}
              />
            </Grid>

            <Grid size={{ xs: 12, md: 4 }}>
              <TextField
                label="Tinh bột - Carbs (g)"
                type="number"
                fullWidth
                value={formData.carbG}
                onChange={(e) => setFormData({ ...formData, carbG: e.target.value })}
                error={Boolean(errors.carbG)}
                helperText={errors.carbG}
              />
            </Grid>

            <Grid size={12}>
              <Autocomplete
                multiple
                options={tagOptions}
                value={selectedTagEnums}
                onChange={(_, value) => setSelectedTagEnums(value)}
                isOptionEqualToValue={(option, value) => option === value}
                getOptionLabel={(option) => prettifyTag(option)}
                renderTags={(value, getTagProps) =>
                  value.map((option, index) => {
                    const { key, ...tagProps } = getTagProps({ index });
                    return <Chip key={key} label={prettifyTag(option)} {...tagProps} />;
                  })
                }
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Tag danh mục"
                    placeholder="Chọn tag cho công thức"
                    helperText="Tag sẽ được backend gộp và lưu vào cột tags"
                  />
                )}
              />
            </Grid>

            <Grid size={12}>
              <TextField
                label="Tags sẽ lưu xuống DB"
                fullWidth
                value={tagPreview}
                InputProps={{ readOnly: true }}
                helperText="Ví dụ: HIGH_PROTEIN,WEIGHT_LOSS,HEALTHY"
              />
            </Grid>

            <Grid size={12}>
              <Alert severity="info">
                Chọn nguyên liệu từ danh sách món ăn đã có. Backend sẽ lưu từng nguyên liệu vào bảng recipe_ingredient.
              </Alert>
            </Grid>

            <Grid size={12}>
              <Divider textAlign="left">THÀNH PHẦN (INGREDIENTS)</Divider>
            </Grid>

            <Grid size={12}>
              {formData.ingredients.map((item, index) => (
                <Box key={`${item.foodItemId || "new"}-${index}`} sx={{ display: "flex", gap: 2, mb: 2, alignItems: "flex-start" }}>
                  <Box
                    sx={{
                      flex: 1,
                      p: 1.5,
                      border: "1px solid",
                      borderColor: errors[`ing_${index}_food`] ? "error.main" : "grey.300",
                      borderRadius: 1,
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      minHeight: 56,
                    }}
                  >
                    <Typography variant="body1" color={item.tempFood ? "text.primary" : "text.secondary"}>
                      {item.tempFood ? item.tempFood.name : "Chưa chọn món ăn..."}
                    </Typography>
                    <Button
                      variant="outlined"
                      size="small"
                      color="primary"
                      onClick={() => {
                        setSearchDialogIndex(index);
                        setSearchDialogQuery("");
                        setSearchDialogResults([]);
                        fetchFoodOptions("");
                      }}
                      startIcon={<Search />}
                    >
                      Tìm món
                    </Button>
                  </Box>

                  <TextField
                    label="Số lượng"
                    sx={{ width: 170 }}
                    value={item.amount}
                    onChange={(e) => handleIngredientChange(index, "amount", e.target.value)}
                    error={Boolean(errors[`ing_${index}_amount`] || errors[`ing_${index}_food`] )}
                    helperText={errors[`ing_${index}_amount`] || errors[`ing_${index}_food`] || "Ví dụ: 150g"}
                  />

                  <IconButton color="error" onClick={() => handleRemoveIngredient(index)}>
                    <Delete />
                  </IconButton>
                </Box>
              ))}

              <Button startIcon={<Add />} onClick={handleAddIngredient}>
                Thêm thành phần
              </Button>
            </Grid>

            <Grid size={12}>
              <Box sx={{ display: "flex", gap: 2, mt: 2 }}>
                <Button variant="contained" color="success" type="submit" disabled={loading}>
                  {isEdit ? "Cập nhật công thức" : "Tạo công thức"}
                </Button>
                <Button variant="outlined" onClick={() => navigate("/admin/recipes")} disabled={loading}>
                  Hủy
                </Button>
              </Box>
            </Grid>
          </Grid>
        </Box>
      </Paper>

      <Dialog open={searchDialogIndex !== null} onClose={() => setSearchDialogIndex(null)} fullWidth maxWidth="sm">
        <DialogTitle>Tìm kiếm món ăn</DialogTitle>
        <DialogContent dividers>
          <TextField
            autoFocus
            fullWidth
            margin="dense"
            label="Nhập tên món ăn..."
            variant="outlined"
            value={searchDialogQuery}
            onChange={(e) => setSearchDialogQuery(e.target.value)}
            InputProps={{
              endAdornment: isSearching ? <CircularProgress size={20} /> : null,
            }}
            sx={{ mb: 2 }}
          />
          <List sx={{ pt: 0 }}>
            {searchDialogResults.length === 0 && !isSearching ? (
              <ListItemText primary="Không tìm thấy món nào" />
            ) : (
              searchDialogResults.map((food) => (
                <ListItemButton key={food.id} onClick={() => handleSelectFood(food)} divider>
                  <ListItemText
                    primary={food.name}
                    secondary={`${food.kcalPerServing} kcal | P: ${food.proteinG}g | F: ${food.fatG}g | C: ${food.carbG}g${food.brand ? ` | Hãng: ${food.brand}` : ""}`}
                  />
                </ListItemButton>
              ))
            )}
          </List>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setSearchDialogIndex(null)} color="inherit">
            Đóng
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={() => setSnackbar((prev) => ({ ...prev, open: false }))}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
      >
        <Alert
          onClose={() => setSnackbar((prev) => ({ ...prev, open: false }))}
          severity={snackbar.severity}
          sx={{ width: "100%" }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
}
