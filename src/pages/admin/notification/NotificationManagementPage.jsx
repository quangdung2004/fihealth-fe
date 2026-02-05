import { useEffect, useState } from "react";
import {
  Box,
  Paper,
  Typography,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Button,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Stack,
  MenuItem,
  Switch,
  IconButton,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";

import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";

import { adminNotificationApi } from "../../../api/adminNotificationApi";

/* ===== ENUM ===== */
const NOTIFICATION_TYPE = ["ONCE", "REPEAT"];
const TARGET_GROUP = ["ALL", "FREE", "PREMIUM"];

export default function NotificationManagementPage() {
  const [notifications, setNotifications] = useState([]);
  const [openForm, setOpenForm] = useState(false);
  const [editing, setEditing] = useState(null);

  const [form, setForm] = useState({
    title: "",
    content: "",
    type: "ONCE",
    targetGroup: "ALL",
    startAt: null, // dayjs object
    repeatIntervalMinutes: "",
    active: true,
  });

  /* ================= API ================= */
  const fetchNotifications = async () => {
    const res = await adminNotificationApi.getAll();
    setNotifications(res.data.data);
  };

useEffect(() => {
  const loadData = async () => {
    await fetchNotifications();
  };
  loadData();
}, []);


  /* ================= HANDLER ================= */
  const openCreate = () => {
    setEditing(null);
    setForm({
      title: "",
      content: "",
      type: "ONCE",
      targetGroup: "ALL",
      startAt: null,
      repeatIntervalMinutes: "",
      active: true,
    });
    setOpenForm(true);
  };

  const openEdit = (n) => {
    setEditing(n);
    setForm({
      title: n.title,
      content: n.content,
      active: n.active,
      startAt: n.startAt ? dayjs(n.startAt) : null,
    });
    setOpenForm(true);
  };

  const handleSubmit = async () => {
    if (editing) {
      await adminNotificationApi.update(editing.id, {
        title: form.title,
        content: form.content,
        active: form.active,
      });
    } else {
      await adminNotificationApi.create({
        title: form.title,
        content: form.content,
        type: form.type,
        targetGroup: form.targetGroup,
        startAt: form.startAt
          ? form.startAt.toISOString()
          : null,
        repeatIntervalMinutes:
          form.type === "REPEAT"
            ? Number(form.repeatIntervalMinutes)
            : null,
      });
    }

    setOpenForm(false);
    fetchNotifications();
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Xóa thông báo này?")) return;
    await adminNotificationApi.delete(id);
    fetchNotifications();
  };

  const toggleActive = async (n) => {
    await adminNotificationApi.update(n.id, {
      title: n.title,
      content: n.content,
      active: !n.active,
    });
    fetchNotifications();
  };

  /* ================= RENDER ================= */
  return (
    <Box>
      <Stack direction="row" justifyContent="space-between" mb={2}>
        <Typography variant="h5" fontWeight={600}>
          Quản lý thông báo
        </Typography>
        <Button variant="contained" onClick={openCreate}>
          Tạo thông báo
        </Button>
      </Stack>

      <Paper>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Tiêu đề</TableCell>
              <TableCell>Loại</TableCell>
              <TableCell>Đối tượng</TableCell>
              <TableCell>Bắt đầu</TableCell>
              <TableCell>Active</TableCell>
              <TableCell align="right">Hành động</TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {notifications.map((n) => (
              <TableRow key={n.id} hover>
                <TableCell>{n.title}</TableCell>
                <TableCell>
                  <Chip
                    label={n.type}
                    size="small"
                    color={n.type === "REPEAT" ? "warning" : "info"}
                  />
                </TableCell>
                <TableCell>{n.targetGroup}</TableCell>
                <TableCell>
                  {n.startAt
                    ? new Date(n.startAt).toLocaleString()
                    : "-"}
                </TableCell>
                <TableCell>
                  <Switch
                    checked={n.active}
                    onChange={() => toggleActive(n)}
                  />
                </TableCell>
                <TableCell align="right">
                  <IconButton color="primary" onClick={() => openEdit(n)}>
                    <EditIcon />
                  </IconButton>
                  <IconButton color="error" onClick={() => handleDelete(n.id)}>
                    <DeleteIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}

            {notifications.length === 0 && (
              <TableRow>
                <TableCell colSpan={6} align="center">
                  Chưa có thông báo
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </Paper>

      {/* ===== CREATE / EDIT DIALOG ===== */}
      <Dialog open={openForm} onClose={() => setOpenForm(false)} maxWidth="sm" fullWidth>
        <DialogTitle>
          {editing ? "Cập nhật thông báo" : "Tạo thông báo"}
        </DialogTitle>

        <DialogContent>
          <Stack spacing={2} mt={1}>
            <TextField
              label="Tiêu đề"
              fullWidth
              value={form.title}
              onChange={(e) =>
                setForm({ ...form, title: e.target.value })
              }
            />

            <TextField
              label="Nội dung"
              multiline
              minRows={4}
              fullWidth
              value={form.content}
              onChange={(e) =>
                setForm({ ...form, content: e.target.value })
              }
            />

            {!editing && (
              <>
                <TextField
                  select
                  label="Loại"
                  value={form.type}
                  onChange={(e) =>
                    setForm({ ...form, type: e.target.value })
                  }
                >
                  {NOTIFICATION_TYPE.map((t) => (
                    <MenuItem key={t} value={t}>
                      {t}
                    </MenuItem>
                  ))}
                </TextField>

                <TextField
                  select
                  label="Đối tượng"
                  value={form.targetGroup}
                  onChange={(e) =>
                    setForm({ ...form, targetGroup: e.target.value })
                  }
                >
                  {TARGET_GROUP.map((g) => (
                    <MenuItem key={g} value={g}>
                      {g}
                    </MenuItem>
                  ))}
                </TextField>

                <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <DateTimePicker
                    label="Thời điểm bắt đầu"
                    value={form.startAt}
                    disablePast
                    onChange={(newValue) =>
                      setForm({ ...form, startAt: newValue })
                    }
                    slotProps={{
                      textField: {
                        fullWidth: true,
                      },
                    }}
                  />
                </LocalizationProvider>

                {form.type === "REPEAT" && (
                  <TextField
                    label="Chu kỳ lặp (phút)"
                    type="number"
                    value={form.repeatIntervalMinutes}
                    onChange={(e) =>
                      setForm({
                        ...form,
                        repeatIntervalMinutes: e.target.value,
                      })
                    }
                  />
                )}
              </>
            )}

            {editing && (
              <Stack direction="row" alignItems="center" spacing={2}>
                <Typography>Active</Typography>
                <Switch
                  checked={form.active}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      active: e.target.checked,
                    })
                  }
                />
              </Stack>
            )}
          </Stack>
        </DialogContent>

        <DialogActions>
          <Button onClick={() => setOpenForm(false)}>Hủy</Button>
          <Button variant="contained" onClick={handleSubmit}>
            Lưu
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
