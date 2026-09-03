import { useEffect } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

import LoginPage from "./features/auth/page/LoginPage";
import RegisterPage from "./features/auth/page/RegisterPage";
import DashboardPage from "./features/dashboard/page/DashboardPage";
// import ForgotPasswordPage from "./modules/auth/page/ForgotPasswordPage";

import TeacherLayout from "./layouts/TeacherLayout/TeacherLayout";
import TeacherDashboardPage from "./features/teachers/page/TeacherDashboardPage";
import TeacherClassesPage from "./features/teachers/page/TeacherClassesPage";
import TeacherTimetablePage from "./features/teachers/page/TeacherTimetablePage";
import TeacherAttendancePage from "./features/teachers/page/TeacherAttendancePage";
import TeacherAssignmentsPage from "./features/teachers/page/TeacherAssignmentsPage";
import TeacherResultsPage from "./features/teachers/page/TeacherResultsPage";
import TeacherNoticesPage from "./features/teachers/page/TeacherNoticesPage";

import AdminLayout from "./layouts/AdminLayout/AdminLayout";
import AdminDashboardPage from "./features/admin/dashboard/page/AdminDashboardPage";
import AdminPlaceholderPage from "./features/admin/dashboard/page/AdminPlaceholderPage";
import StaffManagementPage from "./features/admin/Stfaff Managment/page/StaffManagementPage";
import StudentManagementPage from "./features/admin/StudentManagment/page/StudentManagementPage";
import CommunicationManagementPage from "./features/admin/Comunication/page/CommunicationManagementPage";

import LoadingScreen from "./components/LoadingScreen";

import { getCurrentUserThunk } from "./features/auth/redux/authThunk";
import { selectIsAuthenticated, selectAuthIsSessionChecked, selectUser } from "./features/auth/redux/authSelector";
import { isAdminEmail } from "./features/auth/services/authService";
import type { AppDispatch, RootState } from "./redux/store";


const getHomePath = (
  isAuthenticated: boolean,
  email?: string | null
): string => {
  if (!isAuthenticated) {
    return "/login";
  }

  return isAdminEmail(email)
    ? "/admin/dashboard"
    : "/dashboard";
};


const App = () => {
  const dispatch = useDispatch<AppDispatch>();
  const isAuthenticated = useSelector((state: RootState) => selectIsAuthenticated(state));
  const isSessionChecked = useSelector((state: RootState) => selectAuthIsSessionChecked(state));
  const user = useSelector((state: RootState) => selectUser(state));


  // Restore the persisted session on first load, so a user with a
  // valid (non-expired, non-logged-out) session is taken straight
  // to the dashboard instead of the login page.
  useEffect(() => {
    dispatch(getCurrentUserThunk());
  }, [dispatch]);


  // Wait until the session check finishes before rendering routes,
  // otherwise an authenticated user would briefly see the login page.
  if (!isSessionChecked) {
    return <LoadingScreen />;
  }


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

      <Route
        path="/teacher"
        element={<TeacherLayout />}
      >
        <Route
          index
          element={<Navigate to="/teacher/dashboard" replace />}
        />
        <Route
          path="dashboard"
          element={<TeacherDashboardPage />}
        />
        <Route
          path="classes"
          element={<TeacherClassesPage />}
        />
        <Route
          path="timetable"
          element={<TeacherTimetablePage />}
        />
        <Route
          path="attendance"
          element={<TeacherAttendancePage />}
        />
        <Route
          path="assignments"
          element={<TeacherAssignmentsPage />}
        />
        <Route
          path="results"
          element={<TeacherResultsPage />}
        />
        <Route
          path="notices"
          element={<TeacherNoticesPage />}
        />
      </Route>

      <Route
        path="/admin"
        element={<AdminLayout />}
      >
        <Route
          index
          element={<Navigate to="/admin/dashboard" replace />}
        />
        <Route
          path="dashboard"
          element={<AdminDashboardPage />}
        />
        <Route
          path="staff"
          element={<StaffManagementPage />}
        />
        {/* Legacy staff sub-links now redirect to the staff page */}
        <Route
          path="staff/teachers"
          element={<Navigate to="/admin/staff" replace />}
        />
        <Route
          path="staff/add-teacher"
          element={<Navigate to="/admin/staff" replace />}
        />
        <Route
          path="staff/teacher-assignments"
          element={<Navigate to="/admin/staff" replace />}
        />
        <Route
          path="staff/attendance"
          element={<Navigate to="/admin/staff" replace />}
        />

        {/* Student Management */}
        <Route
          path="students"
          element={<Navigate to="/admin/students/list" replace />}
        />
        <Route
          path="students/list"
          element={<StudentManagementPage />}
        />
        <Route
          path="students/add-student"
          element={<StudentManagementPage initialView="add-student" />}
        />
        <Route
          path="students/promotion"
          element={<StudentManagementPage initialView="promotion" />}
        />
        <Route
          path="students/documents"
          element={<StudentManagementPage initialView="documents" />}
        />

        {/* Communication */}
        <Route
          path="communication"
          element={<CommunicationManagementPage />}
        />
        <Route
          path="communication/notices"
          element={<Navigate to="/admin/communication" replace />}
        />
        <Route
          path="communication/events"
          element={<Navigate to="/admin/communication" replace />}
        />
        <Route
          path="communication/announcements"
          element={<Navigate to="/admin/communication" replace />}
        />
        <Route
          path="communication/circulars"
          element={<Navigate to="/admin/communication" replace />}
        />
        <Route
          path="communication/emergency"
          element={<Navigate to="/admin/communication" replace />}
        />

        <Route
          path="*"
          element={<AdminPlaceholderPage />}
        />
      </Route>
{/*
      <Route
        path="/forgot-password"
        element={<ForgotPasswordPage />}
      /> */}


      {/* Default Route */}
      <Route
        path="/"
        element={
          <Navigate
            to={getHomePath(isAuthenticated, user?.email)}
            replace
          />
        }
      />


      {/* 404 */}
      <Route
        path="*"
        element={
          <Navigate
            to={getHomePath(isAuthenticated, user?.email)}
            replace
          />
        }
      />

    </Routes>
  );
};


export default App;
