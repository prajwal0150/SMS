import { Bell, Menu } from "lucide-react";

interface TopbarProps {
  onMenuClick: () => void;
}

const Topbar = ({ onMenuClick }: TopbarProps) => (
  <header className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b border-slate-200 bg-white/80 px-6 backdrop-blur lg:px-8">
    <button
      type="button"
      onClick={onMenuClick}
      className="flex h-10 w-10 items-center justify-center rounded-lg text-slate-500 transition-colors hover:bg-slate-100 lg:hidden"
    >
      <Menu size={20} />
    </button>

    <p className="text-sm font-medium text-slate-500">
      {new Date().toLocaleDateString(undefined, {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
      })}
    </p>

    <button
      type="button"
      className="ml-auto flex h-9 w-9 items-center justify-center rounded-lg bg-indigo-100 text-indigo-600 transition-colors hover:bg-indigo-200"
      title="Notifications"
    >
      <Bell size={18} />
    </button>
  </header>
);

export default Topbar;