import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AnimatePresence, motion } from "motion/react";
import { Bell, ChevronDown, LogOut, Menu, Search, User } from "lucide-react";
import { useSelector } from "react-redux";

import useAuth from "../../features/auth/hooks/useAuth";
import { selectUser } from "../../features/auth/redux/authSelector";
import { supabase } from "../../lib/supabase";
import type { RootState } from "../../redux/store";

interface TopbarProps {
  onMenuClick: () => void;
}

// Small summary shown in the header chip (name, class, photo).
interface StudentChipMeta {
  name: string;
  subtitle: string;
  avatarUrl: string | null;
}

const Topbar = ({ onMenuClick }: TopbarProps) => {
  const navigate = useNavigate();
  const { logout } = useAuth();
  const user = useSelector((state: RootState) => selectUser(state));

  const [chip, setChip] = useState<StudentChipMeta | null>(null);
  const [open, setOpen] = useState(false);

  const menuRef = useRef<HTMLDivElement>(null);

  // Close the dropdown when clicking outside the menu.
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        menuRef.current &&
        !menuRef.current.contains(event.target as Node)
      ) {
        setOpen(false);
      }
    };

    if (open) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [open]);

  // The header chip mirrors the student's profile. The summary
  // view is RLS scoped to the logged in student and cheap to
  // read; auth metadata is the fallback while it loads or when
  // the views are unavailable.
  useEffect(() => {
    let cancelled = false;

    const loadChip = async () => {
      try {
        const { data, error } = await supabase
          .from("student_profile_summary")
          .select("student_name, photo_url, class_name, section_name")
          .maybeSingle();

        if (cancelled) {
          return;
        }

        if (!error && data?.student_name) {
          const subtitle =
            [data.class_name, data.section_name]
              .filter(Boolean)
              .join(" - ") || "Student";

          setChip({
            name: data.student_name,
            subtitle,
            avatarUrl: data.photo_url ?? null,
          });
        }
      } catch {
        // Keep the metadata fallback.
      }
    };

    loadChip();

    return () => {
      cancelled = true;
    };
  }, []);

  const name = chip?.name ?? user?.user_metadata?.full_name ?? "Student";
  const subtitle = chip?.subtitle ?? "Student";
  const avatarUrl = chip?.avatarUrl ?? null;
  const initial = name.charAt(0).toUpperCase();

  const handleProfile = () => {
    setOpen(false);
    navigate("/student/profile");
  };

  const handleLogout = async () => {
    setOpen(false);
    await logout();
    navigate("/login", { replace: true });
  };

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center gap-3 border-b border-slate-200 bg-white/80 px-4 backdrop-blur sm:px-6 lg:px-8">
      <button
        type="button"
        onClick={onMenuClick}
        className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg text-slate-500 transition-colors hover:bg-slate-100 lg:hidden"
      >
        <Menu size={20} />
      </button>

      {/* Search */}
      <div className="hidden min-w-0 flex-1 justify-center md:flex">
        <div className="flex w-full max-w-md items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-4 py-2 transition-colors focus-within:border-indigo-300 focus-within:bg-white">
          <Search size={15} className="shrink-0 text-slate-400" />
          <input
            type="search"
            placeholder="Search anything..."
            className="w-full bg-transparent text-sm text-slate-700 outline-none placeholder:text-slate-400"
          />
        </div>
      </div>

      <div className="ml-auto flex shrink-0 items-center gap-2.5 sm:gap-3">
        {/* Notifications */}
        <button
          type="button"
          title="Notifications"
          className="relative flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-500 transition-colors hover:bg-slate-50"
        >
          <Bell size={17} />
          <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-rose-500 ring-2 ring-white" />
        </button>

        {/* Student chip - click toggles the profile menu */}
        <div ref={menuRef} className="relative">
          <button
            type="button"
            onClick={() => setOpen((prev) => !prev)}
            className="flex items-center gap-2.5 rounded-full border border-slate-200 bg-white py-1 pl-1 pr-2.5 transition-colors hover:bg-slate-50 sm:pr-3"
          >
            {avatarUrl ? (
              <img
                src={avatarUrl}
                alt={name}
                className="h-8 w-8 rounded-full object-cover"
              />
            ) : (
              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-indigo-600 text-xs font-bold text-white">
                {initial}
              </span>
            )}
            <span className="hidden text-left sm:block">
              <span className="block max-w-[150px] truncate text-xs font-bold leading-tight text-slate-900">
                {name}
              </span>
              <span className="block max-w-[150px] truncate text-[10px] leading-tight text-slate-400">
                {subtitle}
              </span>
            </span>
            <ChevronDown
              size={14}
              className={
                "shrink-0 text-slate-400 transition-transform duration-200" +
                (open ? " rotate-180" : "")
              }
            />
          </button>

          <AnimatePresence>
            {open ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: -6 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: -6 }}
                transition={{ duration: 0.18, ease: "easeOut" }}
                className="absolute right-0 z-50 mt-2 w-56 origin-top-right rounded-lg border border-slate-200 bg-white p-1.5 shadow-lg"
              >
                {/* Menu header */}
                <div className="border-b border-slate-100 px-3 py-2">
                  <p className="truncate text-xs font-semibold text-slate-900">
                    {name}
                  </p>
                  <p className="truncate text-[11px] text-slate-400">
                    {subtitle}
                  </p>
                </div>

                {/* My Profile */}
                <button
                  type="button"
                  onClick={handleProfile}
                  className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-xs font-medium text-slate-700 transition-colors hover:bg-slate-50"
                >
                  <User size={14} className="text-slate-400" />
                  My Profile
                </button>

                {/* Sign out */}
                <button
                  type="button"
                  onClick={handleLogout}
                  className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-xs font-medium text-rose-600 transition-colors hover:bg-rose-50"
                >
                  <LogOut size={14} />
                  Sign out
                </button>
              </motion.div>
            ) : null}
          </AnimatePresence>
        </div>
      </div>
    </header>
  );
};

export default Topbar;

