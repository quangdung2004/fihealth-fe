import { Routes, Route, Navigate } from "react-router-dom";

import { LoginPage } from "./pages/LoginPage";
import { RegisterPage } from "./pages/RegisterPage";
import { ForgotPasswordPage } from "./pages/ForgotPasswordPage";
import { OtpVerificationPage } from "./pages/OtpVerificationPage";
import { ForbiddenPage } from "./pages/ForbiddenPage";

import CreateAssessmentFullPage from "./pages/CreateAssessmentFullPage";
import MyAssessmentsListPage from "./pages/MyAssessmentsListPage";
import AssessmentDetailPage from "./pages/AssessmentDetailPage";
import AssessmentViewPage from "./pages/AssessmentViewPage";

import MealPlanCreateFromTemplatePage from "./pages/MealPlanCreateFromTemplatePage";
import { MealPlanGetByIdPage } from "./pages/MealPlanGetByIdPage";
import { MealPlanToggleFavoritePage } from "./pages/MealPlanToggleFavoritePage";
import MealPlanHotPage from "./pages/MealPlanHotPage";

/* ===== AI PAGES ===== */
import MealPlanGeneratePage from "./pages/MealPlanGeneratePage";
import MealPlanDetailPage from "./pages/MealPlanDetailPage";
import BodyAnalysisPage from "./pages/BodyAnalysisPage";

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

import { AuthProvider } from "./components/common/AuthContext";
import UserManagementPage from "./pages/admin/user/UserManagementPage";
import NotificationManagementPage from "./pages/admin/notification/NotificationManagementPage";
import SubscriptionPlanPage from "./pages/admin/SubscriptionPlanPage";
import UserPlans from "./pages/user/UserPlans";

function UserOnboardingPage() {
  return <div style={{ padding: 24 }}>Onboarding Page (create profile)</div>;
}

/**
 * Root redirect:
 * - có token + role ADMIN -> /admin/foods
 * - có token + role USER -> /user
 * - không có token -> /login
 */
function PublicRedirect() {
  const token = localStorage.getItem("accessToken");
  const role = localStorage.getItem("role");

  if (!token) return <Navigate to="/login" replace />;
  if (role === "ADMIN") return <Navigate to="/admin/foods" replace />;
  if (role === "USER") return <Navigate to="/user" replace />;

  return <Navigate to="/login" replace />;
}

function App() {
  return (
    <AuthProvider>
      <Routes>
        {/* ===== PUBLIC ===== */}
        <Route path="/" element={<PublicRedirect />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
        <Route path="/verify-otp" element={<OtpVerificationPage />} />
        <Route path="/403" element={<ForbiddenPage />} />
        <Route path="/meal-plans/:id" element={<MealPlanDetailPage />} />



        {/* ===== AUTHENTICATED AREA ===== */}
        <Route element={<RequireAuth />}>
          {/* Assessments */}
          <Route path="/assessments/new" element={<CreateAssessmentFullPage />} />
          <Route path="/assessments" element={<MyAssessmentsListPage />} />
          <Route path="/assessments/:id" element={<AssessmentDetailPage />} />

          {/* Meal Plans */}
          <Route
            path="/meal-plans/from-template"
            element={<MealPlanCreateFromTemplatePage />}
          />
          <Route path="/meal-plans/get" element={<MealPlanGetByIdPage />} />
          <Route
            path="/meal-plans/favorite"
            element={<MealPlanToggleFavoritePage />}
          />
          <Route path="/meal-plans/hot" element={<MealPlanHotPage />} />

          {/* AI Meal Plan */}
          <Route
            path="/meal-plans/generate"
            element={<MealPlanGeneratePage />}
          />
          <Route path="/meal-plans/:id" element={<MealPlanDetailPage />} />

          {/* Body Analysis */}
          <Route path="/body-analysis" element={<BodyAnalysisPage />} />
          <Route
            path="/assessments/:id/body-analysis"
            element={<BodyAnalysisPage />}
          />

          {/* ===== ADMIN ===== */}
          <Route element={<RequireRole allow={["ADMIN"]} />}>
            <Route path="/admin" element={<AdminLayout />}>
              <Route index element={<Navigate to="foods" replace />} />
              <Route path="users" element={<UserManagementPage />} />
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

              <Route
                path="notifications"
                element={<NotificationManagementPage />}
              />
              <Route
                path="subscription-plans"
                element={<SubscriptionPlanPage />}
              />
            </Route>
          </Route>

          {/* ===== USER ===== */}
          <Route element={<RequireRole allow={["USER"]} />}>
            <Route path="/user" element={<UserLayout />}>
              <Route
                index
                element={<Navigate to="current-plan" replace />}
              />
              <Route
                path="current-plan"
                element={<CurrentPlanPage />}
              />
              <Route path="history" element={<WorkoutHistoryPage />} />
              <Route path="workouts/:id" element={<WorkoutDetailPage />} />

              <Route path="assessments" element={<MyAssessmentsListPage />} />
              <Route path="assessments/new" element={<CreateAssessmentFullPage />} />
              <Route path="assessments/:id" element={<AssessmentDetailPage />} />
              <Route
                path="assessments/:id/view"
                element={<AssessmentViewPage />}
              />
              <Route path="meal-plans/get" element={<MealPlanGetByIdPage />} /> 
              <Route path="meal-plans/favorite" element={<MealPlanToggleFavoritePage />} />
              <Route path="meal-plans/hot" element={<MealPlanHotPage />} />
              <Route path="onboarding" element={<UserOnboardingPage />} />
              <Route path="plans" element={<UserPlans />} />
            </Route>
          </Route>
        </Route>

        {/* ===== FALLBACK ===== */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </AuthProvider>
  );
}

export default App;
