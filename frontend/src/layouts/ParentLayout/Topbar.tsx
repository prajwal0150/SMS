import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AnimatePresence, motion } from "motion/react";
import { Bell, ChevronDown, LogOut, Menu } from "lucide-react";
import { useSelector } from "react-redux";

import useAuth from "../../features/auth/hooks/useAuth";
import { selectUser } from "../../features/auth/redux/authSelector";
import { supabase } from "../../lib/supabase";
import type { RootState } from "../../redux/store";

interface TopbarProps {
  onMenuClick: () => void;
}

// Small summary shown in the header chip.
interface ParentChipMeta {
  name: string;
  subtitle: string;
  avatarUrl: string | null;
}

const Topbar = ({ onMenuClick }: TopbarProps) => {
  const navigate = useNavigate();
  const { logout } = useAuth();
  const user = useSelector((state: RootState) => selectUser(state));

  const [chip, setChip] = useState<ParentChipMeta | null>(null);
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

  // The header chip mirrors the parent profile from the
  // parent_profile view (scoped to the logged-in parent).
  useEffect(() => {
    let cancelled = false;

    const loadChip = async () => {
      try {
        const { data, error } = await supabase
          .from("parent_profile")
          .select("full_name")
          .maybeSingle();

        if (cancelled) {
          return;
        }

        if (!error && data?.full_name) {
          setChip({
            name: data.full_name,
            subtitle: "Parent",
            avatarUrl: null,
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

  const name = chip?.name ?? user?.user_metadata?.full_name ?? "Parent";
  const subtitle = chip?.subtitle ?? "Parent";
  const avatarUrl = chip?.avatarUrl ?? null;
  const initial = name.charAt(0).toUpperCase();

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
        className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg text-slate-500 transition-colors hover:bg-slate-50 lg:hidden"
      >
        <Menu size={19} />
      </button>

      <div className="flex items-center gap-2 text-sm font-bold text-slate-800">
        Parent Portal
      </div>

      <div className="ml-auto flex items-center gap-3">
        {/* Notifications */}
        <button
          type="button"
          aria-label="Notifications"
          className="relative flex h-10 w-10 items-center justify-center rounded-lg text-slate-500 transition-colors hover:bg-slate-50"
        >
          <Bell size={17} />
        </button>
        {/* Parent chip - click toggles the sign-out menu */}
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