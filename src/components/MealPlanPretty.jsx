import {
  Box,
  Chip,
  Divider,
  Grid,
  Paper,
  Stack,
  Typography,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

function humanPeriod(p) {
  if (!p) return "—";
  if (p === "DAY") return "1 ngày";
  if (p === "WEEK") return "7 ngày";
  if (p === "MONTH") return "30 ngày";
  return String(p);
}

function humanMealType(t) {
  if (!t) return "—";
  const map = {
    BREAKFAST: "Bữa sáng",
    LUNCH: "Bữa trưa",
    DINNER: "Bữa tối",
    SNACK: "Ăn nhẹ",
  };
  return map[t] || String(t);
}

function fmtDate(d) {
  if (!d) return "—";
  try {
    return new Date(d).toLocaleDateString("vi-VN");
  } catch {
    return String(d);
  }
}

function safeNum(n) {
  return typeof n === "number" && Number.isFinite(n) ? n : null;
}

export default function MealPlanPretty({ data }) {
  if (!data) return null;

  const days = Array.isArray(data.days) ? data.days : [];
  const totalMeals = days.reduce((sum, d) => sum + (Array.isArray(d.meals) ? d.meals.length : 0), 0);

  return (
    <Paper variant="outlined" sx={{ p: 2, bgcolor: "#fff" }}>
      {/* SUMMARY */}
      <Typography variant="h6" fontWeight={800} sx={{ mb: 1 }}>
        Chi tiết Meal Plan
      </Typography>

      <Grid container spacing={1.5} sx={{ mb: 1 }}>
        <Grid item xs={12} sm={6}>
          <Stack spacing={0.5}>
            <Typography variant="body2" color="text.secondary">Thời gian</Typography>
            <Typography fontWeight={700}>
              {fmtDate(data.startDate)} → {fmtDate(data.endDate)}
            </Typography>
          </Stack>
        </Grid>

        <Grid item xs={12} sm={6}>
          <Stack spacing={0.5}>
            <Typography variant="body2" color="text.secondary">Kỳ hạn</Typography>
            <Typography fontWeight={700}>{humanPeriod(data.period)}</Typography>
          </Stack>
        </Grid>
      </Grid>

      <Stack direction="row" spacing={1} flexWrap="wrap" sx={{ mb: 1 }}>
        <Chip label={`Số ngày: ${days.length}`} />
        <Chip label={`Số bữa: ${totalMeals}`} />
        <Chip color={data.favorite ? "warning" : "default"} label={data.favorite ? "★ Yêu thích" : "Chưa yêu thích"} />
        <Chip variant="outlined" label={`ID: ${String(data.id || "").slice(0, 8)}…`} />
      </Stack>

      <Divider sx={{ my: 2 }} />

      {/* DAYS */}
      <Typography variant="subtitle1" fontWeight={800} sx={{ mb: 1 }}>
        Lịch theo ngày
      </Typography>

      {days.length === 0 ? (
        <Typography color="text.secondary">Meal plan chưa có ngày nào.</Typography>
      ) : (
        <Box>
          {days.map((d, idx) => {
            const meals = Array.isArray(d.meals) ? d.meals : [];
            const title = d.date ? `Ngày ${idx + 1} • ${fmtDate(d.date)}` : `Ngày ${idx + 1}`;
            return (
              <Accordion key={idx} defaultExpanded={idx === 0} sx={{ mb: 1 }}>
                <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                  <Stack direction="row" spacing={1} alignItems="center" flexWrap="wrap">
                    <Typography fontWeight={800}>{title}</Typography>
                    <Chip size="small" label={`${meals.length} bữa`} />
                  </Stack>
                </AccordionSummary>

                <AccordionDetails>
                  {meals.length === 0 ? (
                    <Typography color="text.secondary">Chưa có bữa ăn trong ngày này.</Typography>
                  ) : (
                    <Stack spacing={2}>
                      {meals
                        .slice()
                        .sort((a, b) => (a?.mealOrder ?? 0) - (b?.mealOrder ?? 0))
                        .map((m, mi) => {
                          const items = Array.isArray(m.items) ? m.items : [];
                          const kcal = safeNum(m.kcal);
                          const p = safeNum(m.protein);
                          const f = safeNum(m.fat);
                          const c = safeNum(m.carb);

                          return (
                            <Paper key={mi} variant="outlined" sx={{ p: 1.5, bgcolor: "#fafafa" }}>
                              <Stack direction="row" justifyContent="space-between" alignItems="center" flexWrap="wrap">
                                <Box>
                                  <Typography fontWeight={900}>
                                    {humanMealType(m.mealType)} {m?.name ? `• ${m.name}` : ""}
                                  </Typography>
                                  <Typography variant="body2" color="text.secondary">
                                    Thứ tự: {m.mealOrder ?? "—"}
                                  </Typography>
                                </Box>

                                <Stack direction="row" spacing={1} flexWrap="wrap">
                                  {kcal != null && <Chip size="small" label={`${kcal} kcal`} />}
                                  {p != null && <Chip size="small" label={`P ${p}g`} />}
                                  {f != null && <Chip size="small" label={`F ${f}g`} />}
                                  {c != null && <Chip size="small" label={`C ${c}g`} />}
                                </Stack>
                              </Stack>

                              <Divider sx={{ my: 1.2 }} />

                              {items.length === 0 ? (
                                <Typography variant="body2" color="text.secondary">
                                  Chưa có món/food trong bữa này.
                                </Typography>
                              ) : (
                                <Table size="small">
                                  <TableHead>
                                    <TableRow>
                                      <TableCell>Tên</TableCell>
                                      <TableCell align="right">Kcal</TableCell>
                                      <TableCell align="right">P</TableCell>
                                      <TableCell align="right">F</TableCell>
                                      <TableCell align="right">C</TableCell>
                                    </TableRow>
                                  </TableHead>
                                  <TableBody>
                                    {items.map((it, ii) => (
                                      <TableRow key={ii}>
                                        <TableCell>{it?.name ?? it?.foodName ?? "—"}</TableCell>
                                        <TableCell align="right">{it?.kcal ?? "—"}</TableCell>
                                        <TableCell align="right">{it?.protein ?? "—"}</TableCell>
                                        <TableCell align="right">{it?.fat ?? "—"}</TableCell>
                                        <TableCell align="right">{it?.carb ?? "—"}</TableCell>
                                      </TableRow>
                                    ))}
                                  </TableBody>
                                </Table>
                              )}
                            </Paper>
                          );
                        })}
                    </Stack>
                  )}
                </AccordionDetails>
              </Accordion>
            );
          })}
        </Box>
      )}
    </Paper>
  );
}
