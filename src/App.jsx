import { BrowserRouter, Routes, Route } from "react-router-dom";
import { LoginPage } from "./pages/LoginPage";
import { RegisterPage } from "./pages/RegisterPage";
import { ForgotPasswordPage } from "./pages/ForgotPasswordPage";
import CreateAssessmentFullPage from "./pages/CreateAssessmentFullPage";
import MyAssessmentsListPage from "./pages/MyAssessmentsListPage";
import AssessmentDetailPage from "./pages/AssessmentDetailPage";
import { MealPlanCreateFromTemplatePage } from "./pages/MealPlanCreateFromTemplatePage";
import { MealPlanGetByIdPage } from "./pages/MealPlanGetByIdPage";
import { MealPlanToggleFavoritePage } from "./pages/MealPlanToggleFavoritePage";
import MealPlanHotPage from "./pages/MealPlanHotPage";



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
        
        

      </Routes>
    </BrowserRouter>
  );
}

export default App;
