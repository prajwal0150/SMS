import { Routes, Route, Navigate } from "react-router-dom";

import LoginPage from "./features/auth/page/LoginPage";
import RegisterPage from "./features/auth/page/RegisterPage";
import DashboardPage from "./features/dashboard/page/DashboardPage";
// import ForgotPasswordPage from "./modules/auth/page/ForgotPasswordPage";


const App = () => {
  return (
    <Routes>

      {/* Auth Routes */}
      <Route
        path="/login"
        element={<LoginPage />}
      />

      <Route
        path="/register"
        element={<RegisterPage />}
      />

      <Route
        path="/dashboard"
        element={<DashboardPage />}
      />
{/* 
      <Route
        path="/forgot-password"
        element={<ForgotPasswordPage />}
      /> */}


      {/* Default Route */}
      <Route
        path="/"
        element={<Navigate to="/login" replace />}
      />


      {/* 404 */}
      <Route
        path="*"
        element={<Navigate to="/login" replace />}
      />

    </Routes>
  );
};


export default App;
