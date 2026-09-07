import { NavLink, useNavigate } from "react-router-dom";
import {
  Award,
  CalendarDays,
  ClipboardCheck,
  FileText,
  GraduationCap,
  LayoutDashboard,
  LogOut,
  Megaphone,
} from "lucide-react";

import useAuth from "../../features/auth/hooks/useAuth";


const NAV_ITEMS = [
  { label: "Dashboard", path: "/student/dashboard", icon: LayoutDashboard },
  { label: "Attendance", path: "/student/attendance", icon: ClipboardCheck },
  { label: "Timetable", path: "/student/timetable", icon: CalendarDays },
  { label: "Assignments", path: "/student/assignments", icon: FileText },
  { label: "Results", path: "/student/results", icon: Award },
  { label: "Notices", path: "/student/notices", icon: Megaphone },
];


interface SidebarProps {
  onNavigate?: () => void;
}

const Sidebar = ({ onNavigate }: SidebarProps) => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const fullName =
    user?.user_metadata?.full_name ?? "Student";

  const email = user?.email ?? "";

  const initial = fullName.charAt(0).toUpperCase();


  const handleLogout = async () => {
    await logout();

    navigate("/login", { replace: true });
  };


  return (
    <div className="flex h-full w-72 flex-col bg-slate-900 text-slate-300">
      {/* Brand */}
      <div className="flex items-center gap-3 px-6 py-6">
        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-indigo-600 text-white">
          <GraduationCap size={22} />
        </div>
        <div>
          <p className="font-bold tracking-tight text-white">
            EduManage
          </p>
          <p className="text-[11px] text-slate-400">
            Student Portal
          </p>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-1 overflow-y-auto px-4 py-2">
        {NAV_ITEMS.map(({ label, path, icon: Icon }) => (
          <NavLink
            key={path}
            to={path}
            onClick={onNavigate}
            className={({ isActive }) =>
              `flex items-center gap-3 rounded-lg px-4 py-2.5 text-sm font-medium transition-colors ${
                isActive
                  ? "bg-indigo-600 text-white"
                  : "text-slate-400 hover:bg-white/5 hover:text-white"
              }`
            }
          >
            <Icon size={18} />
            {label}
          </NavLink>
        ))}
      </nav>

      {/* User + logout */}
      <div className="border-t border-white/10 p-4">
        <div className="flex items-center gap-3 rounded-lg bg-white/5 px-4 py-3">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-indigo-600/90 text-sm font-bold text-white">
            {initial}
          </div>
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-semibold text-white">
              {fullName}
            </p>
            <p className="truncate text-xs text-slate-400">
              {email}
            </p>
          </div>
          <button
            type="button"
            onClick={handleLogout}
            title="Sign out"
            className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-slate-400 transition hover:bg-white/10 hover:text-white"
          >
            <LogOut size={16} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
