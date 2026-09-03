import { useState } from "react";
import { Outlet, Navigate } from "react-router-dom";
import { useSelector } from "react-redux";

import type { RootState } from "../../redux/store";

import { selectIsAuthenticated } from "../../features/auth/redux/authSelector";

import Sidebar from "./Sidebar";
import Topbar from "./Topbar";


const AdminLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const isAuthenticated =
    useSelector((state: RootState) =>
      selectIsAuthenticated(state)
    );


  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }


  return (
    <div className="min-h-screen bg-[#F5F7F9]">
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

export default AdminLayout;