import { Routes, Route, Navigate } from "react-router-dom";
import { LoginPage } from "./pages/LoginPage";
import { RegisterPage } from "./pages/RegisterPage";
import { ForgotPasswordPage } from "./pages/ForgotPasswordPage";
import { OtpVerificationPage } from "./pages/OtpVerificationPage";

// Admin Components
import { AdminLayout } from "./components/AdminLayout";
import { AllergenListPage } from "./pages/admin/catalog/AllergenListPage";
import { AllergenFormPage } from "./pages/admin/catalog/AllergenFormPage";
import { FoodListPage } from "./pages/admin/catalog/FoodListPage";
import { FoodFormPage } from "./pages/admin/catalog/FoodFormPage";
import { RecipeListPage } from "./pages/admin/catalog/RecipeListPage";
import { RecipeFormPage } from "./pages/admin/catalog/RecipeFormPage";
import { WorkoutListPage } from "./pages/admin/workout/WorkoutListPage";
import { WorkoutFormPage } from "./pages/admin/workout/WorkoutFormPage";

// User Components
import { UserLayout } from "./components/UserLayout";
import { CurrentPlanPage } from "./pages/user/CurrentPlanPage";
import { WorkoutHistoryPage } from "./pages/user/WorkoutHistoryPage";
import { WorkoutDetailPage } from "./pages/user/WorkoutDetailPage";

function App() {
  return (
    <Routes>
      {/* ================= AUTH ROUTES ================= */}
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/forgot-password" element={<ForgotPasswordPage />} />
      <Route path="/verify-otp" element={<OtpVerificationPage />} />

      {/* Redirect root → login */}
      <Route path="/" element={<Navigate to="/login" replace />} />

      {/* ================= ADMIN ROUTES ================= */}
      <Route path="/admin" element={<AdminLayout />}>
        <Route path="allergens" element={<AllergenListPage />} />
        <Route path="allergens/create" element={<AllergenFormPage />} />
        <Route path="allergens/:id" element={<AllergenFormPage />} />

        <Route path="foods" element={<FoodListPage />} />
        <Route path="foods/create" element={<FoodFormPage />} />
        <Route path="foods/:id" element={<FoodFormPage />} />

        <Route path="recipes" element={<RecipeListPage />} />
        <Route path="recipes/create" element={<RecipeFormPage />} />
        <Route path="recipes/:id" element={<RecipeFormPage />} />

        <Route path="workouts" element={<WorkoutListPage />} />
        <Route path="workouts/create" element={<WorkoutFormPage />} />
        <Route path="workouts/:id" element={<WorkoutFormPage />} />
      </Route>

      {/* ================= USER ROUTES ================= */}
      <Route path="/user" element={<UserLayout />}>
        {/* Redirect /user -> /user/current-plan */}
        <Route index element={<Navigate to="current-plan" replace />} />
        <Route path="current-plan" element={<CurrentPlanPage />} />
        <Route path="history" element={<WorkoutHistoryPage />} />
        <Route path="workouts/:id" element={<WorkoutDetailPage />} />
      </Route>

      {/* ================= FALLBACK ================= */}
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
}

export default App;
