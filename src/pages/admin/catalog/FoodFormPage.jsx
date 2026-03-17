import { useEffect, useMemo, useState } from "react";
import {
  Alert,
  Autocomplete,
  Box,
  Button,
  Chip,
  FormControlLabel,
  Grid,
  Paper,
  Snackbar,
  Switch,
  TextField,
  Typography,
} from "@mui/material";
import { useNavigate, useParams } from "react-router-dom";
import axiosClient from "../../../api/axiosClient";
import catalogTagApi from "../../../api/catalogTagApi";
import foodApi from "../../../api/foodApi";

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

export function FoodFormPage() {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEdit = Boolean(id);

  const [formData, setFormData] = useState({
    name: "",
    brand: "",
    servingSize: "",
    kcalPerServing: "",
    proteinG: "",
    fatG: "",
    carbG: "",
    estimatedPriceVndPerServing: "",
    active: true,
  });
  const [availableAllergens, setAvailableAllergens] = useState([]);
  const [selectedAllergens, setSelectedAllergens] = useState([]);
  const [tagOptions, setTagOptions] = useState([]);
  const [selectedTagEnums, setSelectedTagEnums] = useState([]);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  const tagPreview = useMemo(() => selectedTagEnums.join(","), [selectedTagEnums]);

  useEffect(() => {
    fetchAvailableAllergens();
    fetchCatalogTags();
    if (isEdit) {
      fetchFood();
    }
  }, [id]);

  const fetchCatalogTags = async () => {
    try {
      const res = await catalogTagApi.getAll();
      setTagOptions(res.data?.data || []);
    } catch (error) {
      console.error("Lỗi tải danh sách tag", error);
      setTagOptions([]);
    }
  };

  const fetchAvailableAllergens = async () => {
    try {
      const res = await axiosClient.get("/admin/allergens", {
        params: { size: 1000 },
      });
      const pageData = res.data?.data;
      setAvailableAllergens(pageData?.content || []);
    } catch (error) {
      console.error("Lỗi tải danh sách dị ứng", error);
      setSnackbar({
        open: true,
        message: "Lỗi tải danh sách dị ứng",
        severity: "error",
      });
      setAvailableAllergens([]);
    }
  };

  const fetchFood = async () => {
    setLoading(true);
    try {
      const res = await foodApi.adminGetById(id);
      const data = res.data?.data;

      setFormData({
        name: data?.name || "",
        brand: data?.brand || "",
        servingSize: data?.servingSize || "",
        kcalPerServing: data?.kcalPerServing ?? "",
        proteinG: data?.proteinG ?? "",
        fatG: data?.fatG ?? "",
        carbG: data?.carbG ?? "",
        estimatedPriceVndPerServing: data?.estimatedPriceVndPerServing ?? "",
        active: data?.active ?? true,
      });

      setSelectedAllergens(data?.allergens || []);
      setSelectedTagEnums(getTagEnumsFromPayload(data));
    } catch (error) {
      console.error("Lỗi tải thông tin món ăn", error);
      setSnackbar({
        open: true,
        message: "Lỗi tải thông tin món ăn",
        severity: "error",
      });
      navigate("/admin/foods");
    } finally {
      setLoading(false);
    }
  };

  const validate = () => {
    const temp = {};

    if (!formData.name.trim()) temp.name = "Tên là bắt buộc";
    if (formData.kcalPerServing === "" || Number(formData.kcalPerServing) < 0) {
      temp.kcalPerServing = "Kcal không hợp lệ";
    }
    if (formData.proteinG === "" || Number(formData.proteinG) < 0) {
      temp.proteinG = "Đạm không hợp lệ";
    }
    if (formData.fatG === "" || Number(formData.fatG) < 0) {
      temp.fatG = "Chất béo không hợp lệ";
    }
    if (formData.carbG === "" || Number(formData.carbG) < 0) {
      temp.carbG = "Tinh bột không hợp lệ";
    }
    if (
      formData.estimatedPriceVndPerServing === "" ||
      Number(formData.estimatedPriceVndPerServing) < 0
    ) {
      temp.estimatedPriceVndPerServing = "Giá tiền không hợp lệ";
    }

    setErrors(temp);
    return Object.keys(temp).length === 0;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!validate()) return;

    setLoading(true);
    try {
      const payload = {
        ...formData,
        kcalPerServing: Number(formData.kcalPerServing),
        proteinG: Number(formData.proteinG),
        fatG: Number(formData.fatG),
        carbG: Number(formData.carbG),
        estimatedPriceVndPerServing: Number(formData.estimatedPriceVndPerServing),
        tags: tagPreview,
        tagEnums: selectedTagEnums,
        allergenIds: selectedAllergens.map((item) => item.id),
      };

      if (isEdit) {
        await foodApi.adminUpdate(id, payload);
      } else {
        await foodApi.adminCreate(payload);
      }

      navigate("/admin/foods");
    } catch (error) {
      console.error("Lỗi lưu món ăn", error);
      const message = error?.response?.data?.message || "Lưu thất bại!";
      setSnackbar({ open: true, message, severity: "error" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box>
      <Typography variant="h4" fontWeight={700} mb={3}>
        {isEdit ? "Chỉnh sửa món ăn" : "Tạo món ăn mới"}
      </Typography>

      <Paper elevation={2} sx={{ p: 4 }}>
        <Box component="form" onSubmit={handleSubmit}>
          <Grid container spacing={3}>
            <Grid size={{ xs: 12, md: 6 }}>
              <TextField
                label="Tên món ăn"
                fullWidth
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                error={Boolean(errors.name)}
                helperText={errors.name}
              />
            </Grid>

            <Grid size={{ xs: 12, md: 6 }}>
              <TextField
                label="Thương hiệu"
                fullWidth
                value={formData.brand}
                onChange={(e) => setFormData({ ...formData, brand: e.target.value })}
              />
            </Grid>

            <Grid size={{ xs: 12, md: 4 }}>
              <TextField
                label="Khẩu phần"
                fullWidth
                value={formData.servingSize}
                onChange={(e) => setFormData({ ...formData, servingSize: e.target.value })}
              />
            </Grid>

            <Grid size={{ xs: 12, md: 4 }}>
              <TextField
                label="Kcal"
                type="number"
                fullWidth
                value={formData.kcalPerServing}
                onChange={(e) =>
                  setFormData({ ...formData, kcalPerServing: e.target.value })
                }
                error={Boolean(errors.kcalPerServing)}
                helperText={errors.kcalPerServing}
              />
            </Grid>

            <Grid size={{ xs: 12, md: 4 }}>
              <TextField
                label="Giá (VND)"
                type="number"
                fullWidth
                value={formData.estimatedPriceVndPerServing}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    estimatedPriceVndPerServing: e.target.value,
                  })
                }
                error={Boolean(errors.estimatedPriceVndPerServing)}
                helperText={errors.estimatedPriceVndPerServing}
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

            <Grid size={{ xs: 12 }}>
              <Autocomplete
                multiple
                options={availableAllergens}
                value={selectedAllergens}
                getOptionLabel={(option) => option.name || ""}
                isOptionEqualToValue={(option, value) => option.id === value.id}
                onChange={(_, value) => setSelectedAllergens(value)}
                renderTags={(value, getTagProps) =>
                  value.map((option, index) => {
                    const { key, ...tagProps } = getTagProps({ index });
                    return <Chip key={key} label={option.name} {...tagProps} />;
                  })
                }
                renderInput={(params) => <TextField {...params} label="Dị ứng" />}
              />
            </Grid>

            <Grid size={{ xs: 12 }}>
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
                    placeholder="Chọn tag cho món ăn"
                    helperText="Tag sẽ được lưu xuống cột tags trong DB dưới dạng CSV"
                  />
                )}
              />
            </Grid>

            <Grid size={{ xs: 12 }}>
              <TextField
                label="Tags sẽ lưu xuống DB"
                fullWidth
                value={tagPreview}
                InputProps={{ readOnly: true }}
                helperText="Ví dụ: HIGH_PROTEIN,LOW_CARB,HEALTHY"
              />
            </Grid>

            <Grid size={{ xs: 12 }}>
              <Alert severity="info">
                Tag chỉ nên chọn từ danh sách enum để đảm bảo backend lưu đúng vào cột tags.
              </Alert>
            </Grid>

            <Grid size={{ xs: 12 }}>
              <FormControlLabel
                control={
                  <Switch
                    checked={formData.active}
                    onChange={(e) =>
                      setFormData({ ...formData, active: e.target.checked })
                    }
                    color="success"
                  />
                }
                label="Hoạt động"
              />
            </Grid>

            <Grid size={{ xs: 12 }}>
              <Box sx={{ display: "flex", gap: 2 }}>
                <Button type="submit" variant="contained" color="success" disabled={loading}>
                  {isEdit ? "Cập nhật" : "Tạo mới"}
                </Button>
                <Button variant="outlined" onClick={() => navigate("/admin/foods")} disabled={loading}>
                  Hủy
                </Button>
              </Box>
            </Grid>
          </Grid>
        </Box>
      </Paper>

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
