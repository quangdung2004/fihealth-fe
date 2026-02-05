import { useEffect, useState } from "react";
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TextField,
  Typography,
  Switch,
  Paper,
  Chip,
  MenuItem,
} from "@mui/material";
import { Add, Edit, Delete } from "@mui/icons-material";
import axiosClient from "../../api/axiosClient";

/* ================= PRICE FORMAT ================= */
const formatPrice = (value) =>
  value.replace(/\D/g, "").replace(/\B(?=(\d{3})+(?!\d))/g, ".");
const parsePrice = (value) => Number(value.replace(/\./g, ""));

/* ================= PLAN TYPES ================= */
const PLAN_TYPES = [
  "FREE",
  "PREMIUM",
  "PREMIUM_WEEK",
  "PREMIUM_HALFMONTHLY",
  "PREMIUM_MONTHLY",
  "PREMIUM_3_MONTH",
];

/* ================= DEFAULT FORM ================= */
const emptyForm = {
  planType: "PREMIUM",
  name: "",
  description: "",
  price: 0,
  durationDays: 30,
  active: true,
};

export default function SubscriptionPlanPage() {
  const [plans, setPlans] = useState([]);
  const [open, setOpen] = useState(false);
  const [editingPlan, setEditingPlan] = useState(null);
  const [form, setForm] = useState(emptyForm);

  /* ================= FETCH ================= */
  const fetchPlans = async () => {
    const res = await axiosClient.get("/admin/subscription-plans");
    setPlans(res.data.data || []);
  };

  useEffect(() => {
    fetchPlans();
  }, []);

  /* ================= HANDLERS ================= */
  const openCreate = () => {
    setEditingPlan(null);
    setForm(emptyForm);
    setOpen(true);
  };

  const openEdit = (plan) => {
    setEditingPlan(plan);
    setForm({ ...plan });
    setOpen(true);
  };

  const handleSave = async () => {
    const payload = { ...form }; // ✅ KHÔNG ÉP PREMIUM

    if (editingPlan) {
      await axiosClient.put(
        `/admin/subscription-plans/${editingPlan.id}`,
        payload
      );
    } else {
      await axiosClient.post("/admin/subscription-plans", payload);
    }

    setOpen(false);
    fetchPlans();
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Xóa plan này?")) return;
    await axiosClient.delete(`/admin/subscription-plans/${id}`);
    fetchPlans();
  };

  /* ================= UI ================= */
  return (
    <Box
      p={3}
      sx={{
        minHeight: "100vh",
        background: "radial-gradient(circle at top, #0f172a, #020617)",
      }}
    >
      {/* ===== HEADER ===== */}
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h5" fontWeight={700} color="#fff">
          Quản lý Subscription Plan
        </Typography>

        <Button
          startIcon={<Add />}
          variant="contained"
          sx={{ textTransform: "none", fontWeight: 600, borderRadius: 2, px: 2.5 }}
          onClick={openCreate}
        >
          TẠO PLAN
        </Button>
      </Box>

      {/* ===== TABLE ===== */}
      <Paper
        elevation={4}
        sx={{
          background: "rgba(255,255,255,0.05)",
          backdropFilter: "blur(6px)",
          borderRadius: 3,
          overflow: "hidden",
        }}
      >
        <Table>
          <TableHead>
            <TableRow sx={{ backgroundColor: "rgba(255,255,255,0.1)" }}>
              {["Plan Type", "Tên", "Giá", "Thời hạn", "Active", "Hành động"].map(
                (h) => (
                  <TableCell
                    key={h}
                    sx={{
                      color: "#fff",
                      fontWeight: 600,
                      borderBottom: "1px solid rgba(255,255,255,0.15)",
                    }}
                  >
                    {h}
                  </TableCell>
                )
              )}
            </TableRow>
          </TableHead>

          <TableBody>
            {plans.map((p) => (
              <TableRow
                key={p.id}
                sx={{
                  "&:hover": { backgroundColor: "rgba(255,255,255,0.07)" },
                }}
              >
                <TableCell>
                  <Chip
                    label={p.planType}
                    size="small"
                    sx={{
                      backgroundColor: "rgba(59,130,246,0.25)",
                      color: "#bfdbfe",
                      fontWeight: 600,
                    }}
                  />
                </TableCell>

                <TableCell sx={{ color: "#e5e7eb" }}>{p.name}</TableCell>

                <TableCell sx={{ color: "#4ade80", fontWeight: 600 }}>
                  {p.price?.toLocaleString("vi-VN")} ₫
                </TableCell>

                <TableCell sx={{ color: "#e5e7eb" }}>
                  {p.durationDays}
                </TableCell>

                <TableCell>
                  <Switch checked={p.active} disabled />
                </TableCell>

                <TableCell align="right">
                  <IconButton sx={{ color: "#93c5fd" }} onClick={() => openEdit(p)}>
                    <Edit />
                  </IconButton>
                  <IconButton sx={{ color: "#ef4444" }} onClick={() => handleDelete(p.id)}>
                    <Delete />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Paper>

      {/* ===== MODAL ===== */}
      <Dialog open={open} onClose={() => setOpen(false)} fullWidth maxWidth="sm">
        <DialogTitle>
          {editingPlan ? "Cập nhật Plan" : "Tạo Plan"}
        </DialogTitle>

        <DialogContent>
          {/* PLAN TYPE */}
          <TextField
            select
            fullWidth
            label="Plan Type"
            margin="dense"
            value={form.planType}
            onChange={(e) =>
              setForm({ ...form, planType: e.target.value })
            }
          >
            {PLAN_TYPES.map((type) => (
              <MenuItem key={type} value={type}>
                {type}
              </MenuItem>
            ))}
          </TextField>

          <TextField
            fullWidth
            label="Tên plan"
            margin="dense"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
          />

          <TextField
            fullWidth
            label="Mô tả"
            margin="dense"
            multiline
            rows={3}
            value={form.description || ""}
            onChange={(e) =>
              setForm({ ...form, description: e.target.value })
            }
          />

          <TextField
            fullWidth
            label="Giá"
            margin="dense"
            value={formatPrice(String(form.price || ""))}
            onChange={(e) =>
              setForm({ ...form, price: parsePrice(e.target.value) })
            }
          />

          <TextField
            fullWidth
            type="number"
            label="Thời hạn (ngày)"
            margin="dense"
            value={form.durationDays}
            onChange={(e) =>
              setForm({ ...form, durationDays: Number(e.target.value) })
            }
          />

          <Box display="flex" justifyContent="space-between" alignItems="center" mt={2}>
            <Typography>Active</Typography>
            <Switch
              checked={form.active}
              onChange={(e) =>
                setForm({ ...form, active: e.target.checked })
              }
            />
          </Box>
        </DialogContent>

        <DialogActions>
          <Button onClick={() => setOpen(false)}>HỦY</Button>
          <Button variant="contained" onClick={handleSave}>
            LƯU
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
