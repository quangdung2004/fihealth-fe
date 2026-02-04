import { Routes, Route, Navigate } from "react-router-dom";
import { LoginPage } from "./pages/LoginPage";
import { RegisterPage } from "./pages/RegisterPage";
import { ForgotPasswordPage } from "./pages/ForgotPasswordPage";
import CreateAssessmentFullPage from "./pages/CreateAssessmentFullPage";
import MyAssessmentsListPage from "./pages/MyAssessmentsListPage";
import AssessmentDetailPage from "./pages/AssessmentDetailPage";
import MealPlanCreateFromTemplatePage from "./pages/MealPlanCreateFromTemplatePage";
import { MealPlanGetByIdPage } from "./pages/MealPlanGetByIdPage";
import { MealPlanToggleFavoritePage } from "./pages/MealPlanToggleFavoritePage";
import MealPlanHotPage from "./pages/MealPlanHotPage";
import { OtpVerificationPage } from "./pages/OtpVerificationPage";

import { AdminLayout } from "./components/AdminLayout";
import { AllergenListPage } from "./pages/admin/catalog/AllergenListPage";
import { AllergenFormPage } from "./pages/admin/catalog/AllergenFormPage";
import { FoodListPage } from "./pages/admin/catalog/FoodListPage";
import { FoodFormPage } from "./pages/admin/catalog/FoodFormPage";
import { RecipeListPage } from "./pages/admin/catalog/RecipeListPage";
import { RecipeFormPage } from "./pages/admin/catalog/RecipeFormPage";
import { WorkoutListPage } from "./pages/admin/workout/WorkoutListPage";
import { WorkoutFormPage } from "./pages/admin/workout/WorkoutFormPage";

import { UserLayout } from "./components/UserLayout";
import { CurrentPlanPage } from "./pages/user/CurrentPlanPage";
import { WorkoutHistoryPage } from "./pages/user/WorkoutHistoryPage";
import { WorkoutDetailPage } from "./pages/user/WorkoutDetailPage";

import RequireAuth from "./components/common/RequireAuth";
import RequireRole from "./components/common/RequireRole";
import { ForbiddenPage } from "./pages/ForbiddenPage";


function App() {
  return (
    <Routes>
      {/* ===== PUBLIC ===== */}
      <Route path="/" element={<Navigate to="/login" replace />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/forgot-password" element={<ForgotPasswordPage />} />
      <Route path="/verify-otp" element={<OtpVerificationPage />} />
      <Route path="/403" element={<ForbiddenPage />} />
      <Route path="/user" element={<UserLayout />}>
            <Route index element={<Navigate to="current-plan" replace />} />
            <Route path="current-plan" element={<CurrentPlanPage />} />
            <Route path="history" element={<WorkoutHistoryPage />} />
            <Route path="workouts/:id" element={<WorkoutDetailPage />} />
          </Route>

      {/* ===== AUTHENTICATED AREA ===== */}
      <Route element={<RequireAuth />}>
        {/* các route đăng nhập rồi mới vào */}
        <Route path="/assessments/new" element={<CreateAssessmentFullPage />} />
        <Route path="/assessments" element={<MyAssessmentsListPage />} />
        <Route path="/assessments/:id" element={<AssessmentDetailPage />} />

        <Route
          path="/meal-plans/from-template"
          element={<MealPlanCreateFromTemplatePage />}
        />
        <Route path="/meal-plans/get" element={<MealPlanGetByIdPage />} />
        <Route path="/meal-plans/favorite" element={<MealPlanToggleFavoritePage />} />
        <Route path="/meal-plans/hot" element={<MealPlanHotPage />} />

      
        

        {/* ===== ADMIN (role-based) ===== */}
        <Route element={<RequireRole allow={["ADMIN"]} />}>
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
        </Route>

        {/* ===== USER (role-based) ===== */}
        <Route element={<RequireRole allow={["USER"]} />}>
          
        </Route>
      </Route>

      {/* ===== FALLBACK ===== */}
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
}

export default App;
