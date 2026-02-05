import { useEffect, useMemo, useState } from "react";
import {
  Box,
  Paper,
  Typography,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  TablePagination,
  Chip,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Stack,
  MenuItem,
} from "@mui/material";
import { adminUserApi } from "../../../api/adminUserApi";

/* ===== CONST STATUS ===== */
const USER_STATUS = {
  ALL: "ALL",
  ACTIVE: "ACTIVE",
  BLOCKED: "BLOCKED",
};

export default function UserManagementPage() {
  /* ================= STATE ================= */
  const [users, setUsers] = useState([]);
  const [page, setPage] = useState(0);
  const [size, setSize] = useState(10);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);

  // search + filter
  const [keyword, setKeyword] = useState("");
  const [statusFilter, setStatusFilter] = useState(USER_STATUS.ALL);

  // ban
  const [banDialogOpen, setBanDialogOpen] = useState(false);
  const [banReason, setBanReason] = useState("");

  // unban
  const [unbanDialogOpen, setUnbanDialogOpen] = useState(false);

  const [selectedUser, setSelectedUser] = useState(null);

  /* ================= API ================= */
  const fetchUsers = async () => {
    try {
      setLoading(true);
      const res = await adminUserApi.getUsers(page, size);
      const data = res.data.data;

      setUsers(data.content);
      setTotal(data.totalElements);
    } catch (err) {
      console.error("Fetch users error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [page, size]);

  /* ================= SEARCH + FILTER ================= */
  const filteredUsers = useMemo(() => {
    return users.filter((u) => {
      const matchKeyword =
        u.fullName?.toLowerCase().includes(keyword.toLowerCase()) ||
        u.email?.toLowerCase().includes(keyword.toLowerCase());

      const matchStatus =
        statusFilter === USER_STATUS.ALL || u.status === statusFilter;

      return matchKeyword && matchStatus;
    });
  }, [users, keyword, statusFilter]);

  /* ================= HANDLER ================= */
  const openBanDialog = (user) => {
    setSelectedUser(user);
    setBanReason("");
    setBanDialogOpen(true);
  };

  const handleConfirmBan = async () => {
    await adminUserApi.banUser(selectedUser.id, banReason);
    setBanDialogOpen(false);
    fetchUsers();
  };

  const openUnbanDialog = (user) => {
    setSelectedUser(user);
    setUnbanDialogOpen(true);
  };

  const handleConfirmUnban = async () => {
    await adminUserApi.unbanUser(selectedUser.id);
    setUnbanDialogOpen(false);
    fetchUsers();
  };

  /* ================= RENDER ================= */
  return (
    <Box>
      <Typography variant="h5" fontWeight={600} mb={2}>
        Quản lý người dùng
      </Typography>

      {/* ===== SEARCH + FILTER ===== */}
      <Paper sx={{ p: 2, mb: 2 }}>
        <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
          <TextField
            label="Tìm kiếm tên / email"
            fullWidth
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
          />

          <TextField
            select
            label="Trạng thái"
            sx={{ minWidth: 200 }}
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <MenuItem value={USER_STATUS.ALL}>Tất cả</MenuItem>
            <MenuItem value={USER_STATUS.ACTIVE}>ACTIVE</MenuItem>
            <MenuItem value={USER_STATUS.BLOCKED}>BLOCKED</MenuItem>
          </TextField>
        </Stack>
      </Paper>

      {/* ===== TABLE ===== */}
      <Paper sx={{ width: "100%", overflow: "hidden" }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Email</TableCell>
              <TableCell>Họ tên</TableCell>
              <TableCell>Trạng thái</TableCell>
              <TableCell>Lý do khóa</TableCell>
              <TableCell>Ngày tạo</TableCell>
              <TableCell align="right">Hành động</TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {filteredUsers.map((u) => (
              <TableRow key={u.id} hover>
                <TableCell>{u.email}</TableCell>
                <TableCell>{u.fullName}</TableCell>
                <TableCell>
                  <Chip
                    label={u.status}
                    size="small"
                    color={
                      u.status === USER_STATUS.BLOCKED
                        ? "error"
                        : "success"
                    }
                  />
                </TableCell>
                <TableCell>{u.blockedReason || "-"}</TableCell>
                <TableCell>
                  {new Date(u.createdAt).toLocaleDateString()}
                </TableCell>
                <TableCell align="right">
                  {u.status === USER_STATUS.BLOCKED ? (
                    <Button
                      size="small"
                      color="success"
                      onClick={() => openUnbanDialog(u)}
                    >
                      Unban
                    </Button>
                  ) : (
                    <Button
                      size="small"
                      color="error"
                      onClick={() => openBanDialog(u)}
                    >
                      Ban
                    </Button>
                  )}
                </TableCell>
              </TableRow>
            ))}

            {!loading && filteredUsers.length === 0 && (
              <TableRow>
                <TableCell colSpan={6} align="center">
                  Không có người dùng phù hợp
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>

        <TablePagination
          component="div"
          count={total}
          page={page}
          onPageChange={(_, newPage) => setPage(newPage)}
          rowsPerPage={size}
          onRowsPerPageChange={(e) => {
            setSize(parseInt(e.target.value, 10));
            setPage(0);
          }}
          rowsPerPageOptions={[5, 10, 20]}
        />
      </Paper>

      {/* ===== BAN DIALOG ===== */}
      <Dialog open={banDialogOpen} onClose={() => setBanDialogOpen(false)}>
        <DialogTitle>Khóa tài khoản</DialogTitle>
        <DialogContent>
          <Stack spacing={2} mt={1}>
            <Typography>
              Bạn đang khóa tài khoản:
              <br />
              <b>{selectedUser?.email}</b>
            </Typography>

            <TextField
              label="Lý do khóa"
              fullWidth
              multiline
              minRows={3}
              value={banReason}
              onChange={(e) => setBanReason(e.target.value)}
            />
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setBanDialogOpen(false)}>Hủy</Button>
          <Button
            color="error"
            variant="contained"
            disabled={!banReason.trim()}
            onClick={handleConfirmBan}
          >
            Xác nhận khóa
          </Button>
        </DialogActions>
      </Dialog>

      {/* ===== UNBAN DIALOG ===== */}
      <Dialog open={unbanDialogOpen} onClose={() => setUnbanDialogOpen(false)}>
        <DialogTitle>Mở khóa tài khoản</DialogTitle>
        <DialogContent>
          <Typography mt={1}>
            Bạn có chắc muốn mở khóa tài khoản:
            <br />
            <b>{selectedUser?.email}</b>
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setUnbanDialogOpen(false)}>Hủy</Button>
          <Button
            color="success"
            variant="contained"
            onClick={handleConfirmUnban}
          >
            Xác nhận mở khóa
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
