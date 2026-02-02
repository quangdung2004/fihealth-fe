import { BrowserRouter, Routes, Route } from "react-router-dom";
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

// Admin Components
import { AdminLayout } from "./components/AdminLayout";
import { AllergenListPage } from "./pages/admin/catalog/AllergenListPage";
import { AllergenFormPage } from "./pages/admin/catalog/AllergenFormPage";
import { FoodListPage } from "./pages/admin/catalog/FoodListPage";
import { FoodFormPage } from "./pages/admin/catalog/FoodFormPage";
import { RecipeListPage } from "./pages/admin/catalog/RecipeListPage";
import { RecipeFormPage } from "./pages/admin/catalog/RecipeFormPage";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
        <Route path="/assessments/new" element={<CreateAssessmentFullPage />} />
        <Route path="/assessments" element={<MyAssessmentsListPage />} />
        <Route path="/assessments/:id" element={<AssessmentDetailPage />} />
        <Route path="/meal-plans/from-template"element={<MealPlanCreateFromTemplatePage />}/>
        <Route path="/meal-plans/get" element={<MealPlanGetByIdPage />} />
        <Route path="/meal-plans/favorite" element={<MealPlanToggleFavoritePage />} />
        <Route path="/meal-plans/hot" element={<MealPlanHotPage />} />
        
        

        <Route path="/verify-otp" element={<OtpVerificationPage />} />

        {/* Admin Routes */}
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
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
