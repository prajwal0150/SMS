import { useState } from "react";
import { Outlet, Navigate } from "react-router-dom";
import { useSelector } from "react-redux";

import type { RootState } from "../../redux/store";

import { selectIsAuthenticated, selectUser } from "../../features/auth/redux/authSelector";
import { isAdminEmail } from "../../features/auth/services/authService";

import Sidebar from "./Sidebar";
import Topbar from "./Topbar";


const ParentLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const isAuthenticated =
    useSelector((state: RootState) =>
      selectIsAuthenticated(state)
    );

  const user =
    useSelector((state: RootState) =>
      selectUser(state)
    );


  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }


  // The admin has their own panel - keep the parent
  // panel exclusive to parent accounts.
  if (isAdminEmail(user?.email)) {
    return <Navigate to="/admin/dashboard" replace />;
  }


  if (user?.user_metadata?.role !== "parent") {
    return <Navigate to="/teacher" replace />;
  }


  return (
    <div className="min-h-screen bg-slate-50">
      {/* Desktop sidebar */}
      <aside className="fixed inset-y-0 left-0 z-40 hidden w-72 lg:block">
        <Sidebar />
      </aside>

      {/* Mobile sidebar */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div
            className="absolute inset-0 bg-slate-900/60"
            onClick={() => setSidebarOpen(false)}
          />
          <div className="absolute inset-y-0 left-0 w-72 animate-fade-up">
            <Sidebar onNavigate={() => setSidebarOpen(false)} />
          </div>
        </div>
      )}

      {/* Main area */}
      <div className="lg:pl-72">
        <Topbar onMenuClick={() => setSidebarOpen(true)} />

        <main className="animate-fade-up p-6 lg:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default ParentLayout;