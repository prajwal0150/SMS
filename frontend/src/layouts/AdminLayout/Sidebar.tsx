import { useState } from "react";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import {
  ChevronDown,
  GraduationCap,
  LayoutDashboard,
  LogOut,
} from "lucide-react";

import useAuth from "../../features/auth/hooks/useAuth";

import { adminNavGroups } from "./navConfig";


const isPathActive = (
  pathname: string,
  path: string
): boolean =>
  pathname === path ||
  pathname.startsWith(`${path}/`);


interface SidebarProps {
  onNavigate?: () => void;
}

const Sidebar = ({ onNavigate }: SidebarProps) => {
  const navigate = useNavigate();
  const location = useLocation();

  const { user, logout } = useAuth();

  const fullName =
    user?.user_metadata?.full_name ?? "Admin";

  const email = user?.email ?? "";

  const initial = fullName.charAt(0).toUpperCase();


  const [openGroups, setOpenGroups] = useState<
    Record<string, boolean>
  >(() => {
    const initial: Record<string, boolean> = {};

    adminNavGroups.forEach((group) => {
      initial[group.id] = group.children.some(
        (child) =>
          isPathActive(
            location.pathname,
            child.path
          )
      );
    });

    return initial;
  });


  const toggleGroup = (id: string) => {
    setOpenGroups((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };


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
            Admin Portal
          </p>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-1 overflow-y-auto px-4 py-2">
        {/* Dashboard */}
        <NavLink
          to="/admin/dashboard"
          onClick={onNavigate}
          className={({ isActive }) =>
            `flex items-center gap-3 rounded-lg px-4 py-2.5 text-sm font-medium transition-colors ${
              isActive
                ? "bg-indigo-600 text-white"
                : "text-slate-400 hover:bg-white/5 hover:text-white"
            }`
          }
        >
          <LayoutDashboard size={18} />
          Dashboard
        </NavLink>

        {/* Groups */}
        {adminNavGroups.map((group) => {
          const Icon = group.icon;

          // Groups without children render as a direct link.
          if (group.children.length === 0) {
            return (
              <NavLink
                key={group.id}
                to={`/admin/${group.id}`}
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
                {group.label}
              </NavLink>
            );
          }

          const isOpen = !!openGroups[group.id];

          return (
            <div key={group.id}>
              <button
                type="button"
                onClick={() => toggleGroup(group.id)}
                className="flex w-full items-center gap-3 rounded-lg px-4 py-2.5 text-sm font-medium text-slate-400 transition-colors hover:bg-white/5 hover:text-white"
              >
                <Icon size={18} className="shrink-0" />
                <span className="flex-1 text-left">
                  {group.label}
                </span>
                <ChevronDown
                  size={15}
                  className={`shrink-0 transition-transform duration-200 ${
                    isOpen ? "rotate-180" : ""
                  }`}
                />
              </button>

              {isOpen && (
                <div className="ml-6 mt-1 space-y-1 border-l border-white/10 pl-3">
                  {group.children.map((child) => (
                    <NavLink
                      key={child.path}
                      to={child.path}
                      onClick={onNavigate}
                      className={({ isActive }) =>
                        `block truncate rounded-lg px-3 py-2 text-sm transition-colors ${
                          isActive
                            ? "bg-indigo-600 text-white"
                            : "text-slate-400 hover:bg-white/5 hover:text-white"
                        }`
                      }
                    >
                      {child.label}
                    </NavLink>
                  ))}
                </div>
              )}
            </div>
          );
        })}
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