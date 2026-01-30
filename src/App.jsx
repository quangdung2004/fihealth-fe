import { BrowserRouter, Routes, Route } from "react-router-dom";
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

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
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
