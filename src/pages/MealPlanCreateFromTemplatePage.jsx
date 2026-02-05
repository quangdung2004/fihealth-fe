import { useEffect, useMemo, useState } from "react";
import {
  Box,
  Button,
  TextField,
  Typography,
  Divider,
  Paper,
  Alert,
  MenuItem,
  CircularProgress,
  Card,
  CardContent,
  Stack,
  Chip,
} from "@mui/material";
import axiosClient from "../api/axiosClient";

function formatAssessmentLabel(a) {
  const date = a?.createdAt ? new Date(a.createdAt).toLocaleString("vi-VN") : "—";
  const goal = a?.goal ? String(a.goal).replaceAll("_", " ") : "—";
  const act = a?.activityLevel ? String(a.activityLevel).replaceAll("_", " ") : "—";
  const wh = `${a?.heightCm ?? "—"}cm • ${a?.weightKg ?? "—"}kg`;
  const budget =
    a?.budgetPerDayVnd != null ? `${a.budgetPerDayVnd} VND/ngày` : "Chưa có budget";
  return `${date} • ${goal} • ${act} • ${wh} • ${budget}`;
}

function isValidYYYYMMDD(s) {
  if (!s) return true; // optional
  return /^\d{4}-\d{2}-\d{2}$/.test(s.trim());
}

function fmtDateMaybe(s) {
  if (!s) return "—";
  const d = new Date(s);
  if (!Number.isFinite(d.getTime())) return String(s);
  return d.toLocaleDateString("vi-VN");
}

function fmtNumber(n) {
  if (n == null || n === "") return null;
  const x = Number(n);
  if (!Number.isFinite(x)) return String(n);
  return x.toLocaleString("vi-VN");
}

/**
 * Normalize theo schema bạn đang có trong ảnh:
 * {
 *  id, period, startDate, endDate, favorite,
 *  days: [{ dayIndex, date, meals: [] }]
 * }
 */
function normalizeMealPlanResult(result) {
  if (!result || typeof result !== "object") return null;

  const title = "Meal Plan";

  const period = result?.period;
  const startDate = result?.startDate;
  const endDate = result?.endDate;

  const rawDays = Array.isArray(result?.days) ? result.days : [];

  const days = rawDays.map((d) => {
    const date = d?.date || null;

    // backend hiện đang trả meals: []
    const rawMeals = Array.isArray(d?.meals) ? d.meals : [];

    const meals = rawMeals.map((m) => {
      const name =
        m?.mealType ||
        m?.name ||
        m?.type ||
        m?.meal ||
        "Meal";

      const rawItems =
        m?.items ||
        m?.foods ||
        m?.dishes ||
        m?.mealDetails ||
        m?.mealItems ||
        [];

      const items = Array.isArray(rawItems)
        ? rawItems.map((it) => ({
            name:
              it?.foodName ||
              it?.name ||
              it?.dishName ||
              it?.menuItemName ||
              "—",
            qty:
              it?.quantity ??
              it?.qty ??
              it?.serving ??
              it?.portion ??
              null,
            unit: it?.unit || it?.uom || "",
            kcal:
              it?.kcal ??
              it?.calories ??
              it?.energyKcal ??
              null,
            note: it?.note || it?.description || "",
          }))
        : [];

      const mealKcal =
        m?.totalKcal ??
        m?.totalCalories ??
        m?.kcal ??
        null;

      return { name, items, mealKcal };
    });

    const dayKcal =
      d?.totalKcal ??
      d?.totalCalories ??
      d?.kcal ??
      null;

    return { date, meals, dayKcal, dayIndex: d?.dayIndex };
  });

  const metaChips = [];
  if (result?.id) metaChips.push({ label: `ID: ${String(result.id).slice(0, 8)}…` });
  if (period) metaChips.push({ label: `Period: ${String(period)}` });
  if (startDate) metaChips.push({ label: `Start: ${fmtDateMaybe(startDate)}` });
  if (endDate) metaChips.push({ label: `End: ${fmtDateMaybe(endDate)}` });
  if (result?.favorite != null) metaChips.push({ label: `Favorite: ${String(result.favorite)}` });

  return { title, metaChips, days };
}

function MealPlanCards({ result }) {
  const normalized = useMemo(() => normalizeMealPlanResult(result), [result]);

  if (!normalized) return null;

  const { title, metaChips, days } = normalized;

  return (
    <Box sx={{ mt: 2 }}>
      <Divider sx={{ mb: 2 }} />

      {/* Header */}
      <Card sx={{ mb: 2 }}>
        <CardContent>
          <Typography variant="h6" fontWeight={800}>
            {title}
          </Typography>

          {metaChips?.length > 0 && (
            <Stack direction="row" gap={1} flexWrap="wrap" sx={{ mt: 1 }}>
              {metaChips.map((c, idx) => (
                <Chip key={idx} label={c.label} size="small" />
              ))}
            </Stack>
          )}

          {(!days || days.length === 0) && (
            <Alert severity="info" sx={{ mt: 2 }}>
              Không có ngày nào trong meal plan.
            </Alert>
          )}
        </CardContent>
      </Card>

      {/* Days */}
      <Stack spacing={2}>
        {days?.map((d, di) => (
          <Card key={di} variant="outlined">
            <CardContent>
              <Stack
                direction="row"
                justifyContent="space-between"
                alignItems="center"
                flexWrap="wrap"
                gap={1}
              >
                <Typography fontWeight={800}>
                  Ngày {d?.dayIndex ?? di + 1}: {fmtDateMaybe(d?.date)}
                </Typography>

                {d?.dayKcal != null && (
                  <Chip label={`${fmtNumber(d.dayKcal)} kcal`} size="small" />
                )}
              </Stack>

              <Divider sx={{ my: 1.5 }} />

              {/* Meals */}
              {d?.meals?.length ? (
                <Stack spacing={1.5}>
                  {d.meals.map((m, mi) => (
                    <Box key={mi}>
                      <Stack
                        direction="row"
                        justifyContent="space-between"
                        alignItems="center"
                        flexWrap="wrap"
                        gap={1}
                      >
                        <Typography fontWeight={700}>
                          {String(m?.name || "Meal").replaceAll("_", " ")}
                        </Typography>

                        {m?.mealKcal != null && (
                          <Chip label={`${fmtNumber(m.mealKcal)} kcal`} size="small" />
                        )}
                      </Stack>

                      <Stack spacing={0.75} sx={{ mt: 1 }}>
                        {m?.items?.length ? (
                          m.items.map((it, ii) => (
                            <Paper
                              key={ii}
                              variant="outlined"
                              sx={{ p: 1.25, borderRadius: 2 }}
                            >
                              <Stack
                                direction="row"
                                justifyContent="space-between"
                                alignItems="flex-start"
                                gap={1}
                              >
                                <Box sx={{ minWidth: 0 }}>
                                  <Typography fontWeight={700} noWrap>
                                    {it?.name || "—"}
                                  </Typography>

                                  {(it?.qty != null || it?.note) && (
                                    <Typography variant="body2" color="text.secondary">
                                      {it?.qty != null
                                        ? `Khẩu phần: ${fmtNumber(it.qty)} ${it?.unit || ""}`.trim()
                                        : null}
                                      {it?.qty != null && it?.note ? " • " : null}
                                      {it?.note || null}
                                    </Typography>
                                  )}
                                </Box>

                                {it?.kcal != null && (
                                  <Chip
                                    label={`${fmtNumber(it.kcal)} kcal`}
                                    size="small"
                                    sx={{ flexShrink: 0 }}
                                  />
                                )}
                              </Stack>
                            </Paper>
                          ))
                        ) : (
                          <Typography variant="body2" color="text.secondary">
                            (Không có món trong bữa này)
                          </Typography>
                        )}
                      </Stack>

                      {mi < d.meals.length - 1 && <Divider sx={{ my: 1.5 }} />}
                    </Box>
                  ))}
                </Stack>
              ) : (
                <Alert severity="info">
                  Meal plan đã tạo thành công nhưng <b>chưa có meals</b>. (Backend đang trả{" "}
                  <code>meals: []</code>)
                </Alert>
              )}
            </CardContent>
          </Card>
        ))}
      </Stack>
    </Box>
  );
}

export default function MealPlanCreateFromTemplatePage() {
  const [assessments, setAssessments] = useState([]);
  const [assessmentId, setAssessmentId] = useState("");
  const [period, setPeriod] = useState("WEEK");
  const [startDate, setStartDate] = useState("");

  const [loadingAssessments, setLoadingAssessments] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const [errMsg, setErrMsg] = useState("");
  const [okMsg, setOkMsg] = useState("");
  const [result, setResult] = useState(null);

  const PERIOD_OPTIONS = [
    { value: "DAY", label: "1 ngày (DAY)" },
    { value: "WEEK", label: "7 ngày (WEEK)" },
    { value: "MONTH", label: "30 ngày (MONTH)" },
  ];

  useEffect(() => {
    let alive = true;

    (async () => {
      setErrMsg("");
      setOkMsg("");
      setResult(null);
      setLoadingAssessments(true);

      try {
        const res = await axiosClient.get("/assessments", { params: { me: true } });
        const list = res?.data?.data;

        if (!alive) return;

        if (!Array.isArray(list)) {
          setAssessments([]);
          setErrMsg("Không lấy được danh sách assessments (data không phải mảng).");
          return;
        }

        const sorted = [...list].sort((a, b) => {
          const ta = a?.createdAt ? new Date(a.createdAt).getTime() : 0;
          const tb = b?.createdAt ? new Date(b.createdAt).getTime() : 0;
          return tb - ta;
        });

        setAssessments(sorted);
        if (sorted[0]?.id) setAssessmentId(sorted[0].id);
      } catch (e) {
        if (!alive) return;

        const status = e?.response?.status;
        const serverMsg = e?.response?.data?.message || e?.message;

        if (status === 401) setErrMsg("Bạn chưa đăng nhập hoặc token hết hạn. Hãy đăng nhập lại.");
        else setErrMsg(serverMsg || "Không tải được assessments.");

        setAssessments([]);
      } finally {
        if (alive) setLoadingAssessments(false);
      }
    })();

    return () => {
      alive = false;
    };
  }, []);

  async function handleSubmit(e) {
    e.preventDefault();
    setErrMsg("");
    setOkMsg("");
    setResult(null);

    if (!assessmentId) {
      setErrMsg("Bạn chưa có assessment nào. Hãy tạo assessment trước.");
      return;
    }
    if (!isValidYYYYMMDD(startDate)) {
      setErrMsg("startDate không đúng định dạng YYYY-MM-DD.");
      return;
    }

    setSubmitting(true);
    try {
      const body = startDate?.trim() ? { startDate: startDate.trim() } : {};

      const res = await axiosClient.post("/meal-plans/from-template", body, {
        params: { assessmentId, period },
      });

      const payload = res?.data?.data ?? res?.data;
      setResult(payload);
      setOkMsg("Tạo Meal Plan thành công!");
    } catch (e2) {
      const status = e2?.response?.status;
      const serverMsg = e2?.response?.data?.message || e2?.message;

      if (status === 401) setErrMsg("401: Bạn chưa đăng nhập hoặc token hết hạn.");
      else if (status === 400) setErrMsg(serverMsg || "400: Dữ liệu không hợp lệ.");
      else setErrMsg(serverMsg || "Tạo Meal Plan thất bại.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <Box sx={{ p: 3 }}>
      <Paper sx={{ p: 3, maxWidth: 720 }}>
        <Typography variant="h5" fontWeight={800}>
          Tạo Meal Plan
        </Typography>
        <Typography color="text.secondary" mb={2}>
          Chọn lần đánh giá dinh dưỡng (assessment) để tạo thực đơn.
        </Typography>

        {loadingAssessments && (
          <Alert severity="info" sx={{ mb: 2 }}>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <CircularProgress size={18} />
              Đang tải danh sách assessments…
            </Box>
          </Alert>
        )}

        {!!errMsg && (
          <Alert severity="warning" sx={{ mb: 2 }}>
            {errMsg}
          </Alert>
        )}
        {!!okMsg && (
          <Alert severity="success" sx={{ mb: 2 }}>
            {okMsg}
          </Alert>
        )}

        <Box component="form" onSubmit={handleSubmit}>
          <TextField
            select
            fullWidth
            label="Chọn assessment"
            value={assessmentId}
            onChange={(e) => setAssessmentId(e.target.value)}
            sx={{ mb: 2 }}
            disabled={loadingAssessments || assessments.length === 0}
            helperText={
              assessments.length === 0 ? "Bạn chưa có assessment nào." : "Mặc định chọn lần mới nhất."
            }
          >
            {assessments.map((a) => (
              <MenuItem key={a.id} value={a.id} sx={{ whiteSpace: "normal", lineHeight: 1.2 }}>
                {formatAssessmentLabel(a)}
              </MenuItem>
            ))}
          </TextField>

          <TextField
            select
            fullWidth
            label="Kỳ hạn (period)"
            value={period}
            onChange={(e) => setPeriod(e.target.value)}
            sx={{ mb: 2 }}
          >
            {PERIOD_OPTIONS.map((o) => (
              <MenuItem key={o.value} value={o.value}>
                {o.label}
              </MenuItem>
            ))}
          </TextField>

          <TextField
            fullWidth
            label="startDate (optional) - YYYY-MM-DD"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            placeholder="Để trống => backend dùng LocalDate.now()"
            sx={{ mb: 2 }}
            error={!!startDate && !isValidYYYYMMDD(startDate)}
            helperText={
              !!startDate && !isValidYYYYMMDD(startDate)
                ? "Sai định dạng. Ví dụ: 2026-02-01"
                : "Có thể để trống."
            }
          />

          <Button
            type="submit"
            variant="contained"
            fullWidth
            disabled={submitting || loadingAssessments}
          >
            {submitting ? "Đang tạo..." : "Tạo Meal Plan"}
          </Button>
        </Box>

        {/* ✅ Render result as cards */}
        {!!result && <MealPlanCards result={result} />}
      </Paper>
    </Box>
  );
}
