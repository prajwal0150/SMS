import {
  CheckCircle2,
  ChevronRight,
  FileText,
  KeyRound,
  Megaphone,
  PencilLine,
  ShieldCheck,
  Zap,
} from "lucide-react";

import { capitalize } from "../utils/profileUtils";

import type { StudentProfileData } from "../types/profileTypes";

interface ProfileSidePanelProps {
  profile: StudentProfileData;
  onUpdateProfile: () => void;
  onChangePassword: () => void;
  onViewDocuments: () => void;
}

/**
 * Right hand column - profile status banner, quick actions
 * and the motivational quote.
 */
const ProfileSidePanel = ({
  profile,
  onUpdateProfile,
  onChangePassword,
  onViewDocuments,
}: ProfileSidePanelProps) => {
  const isActive = profile.status.toLowerCase() === "active";
  const statusLabel = capitalize(profile.status || "active");

  const quickActions = [
    {
      icon: PencilLine,
      title: "Update Profile",
      subtitle: "Edit your personal information",
      onClick: onUpdateProfile,
    },
    {
      icon: KeyRound,
      title: "Change Password",
      subtitle: "Update your login password",
      onClick: onChangePassword,
    },
    {
      icon: FileText,
      title: "View Documents",
      subtitle: "Access your academic documents",
      onClick: onViewDocuments,
    },
  ];

  return (
    <aside className="flex flex-col gap-6 rounded-xl border border-slate-200 bg-white p-5 sm:p-6">
      {/* Profile status */}
      <section>
        <header className="flex items-center gap-2.5">
          <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
            <ShieldCheck size={15} />
          </span>
          <h3 className="text-sm font-bold text-slate-900">Profile Status</h3>
          <span
            className={`rounded-full px-2.5 py-0.5 text-[11px] font-semibold ${
              isActive
                ? "bg-emerald-100 text-emerald-700"
                : "bg-amber-100 text-amber-700"
            }`}
          >
            {statusLabel}
          </span>
        </header>

        <div
          className={`mt-4 flex items-start gap-2.5 rounded-lg border p-3.5 ${
            isActive
              ? "border-emerald-200 bg-emerald-50"
              : "border-amber-200 bg-amber-50"
          }`}
        >
          <CheckCircle2
            size={16}
            className={`mt-0.5 shrink-0 ${
              isActive ? "text-emerald-500" : "text-amber-500"
            }`}
          />
          <p
            className={`text-xs leading-relaxed ${
              isActive ? "text-emerald-700" : "text-amber-700"
            }`}
          >
            {isActive
              ? "Your profile is active and you can access all student features."
              : "Your profile is not active. Please contact the school office for assistance."}
          </p>
        </div>
      </section>

      {/* Quick actions */}
      <section>
        <header className="flex items-center gap-2.5">
          <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-indigo-50 text-indigo-600">
            <Zap size={15} />
          </span>
          <h3 className="text-sm font-bold text-slate-900">Quick Actions</h3>
        </header>

        <div className="mt-3 space-y-1.5">
          {quickActions.map(({ icon: Icon, title, subtitle, onClick }) => (
            <button
              key={title}
              type="button"
              onClick={onClick}
              className="flex w-full items-center gap-3 rounded-lg px-2.5 py-2.5 text-left transition-colors hover:bg-slate-50"
            >
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-indigo-50 text-indigo-600">
                <Icon size={16} />
              </span>
              <span className="min-w-0 flex-1">
                <span className="block text-sm font-semibold text-slate-800">
                  {title}
                </span>
                <span className="block truncate text-xs text-slate-400">
                  {subtitle}
                </span>
              </span>
              <ChevronRight size={15} className="shrink-0 text-slate-300" />
            </button>
          ))}
        </div>
      </section>

      {/* Motivation */}
      <section className="flex items-start gap-3.5 rounded-xl border border-indigo-100 bg-gradient-to-br from-indigo-50 via-white to-emerald-50 p-4">
        <Megaphone size={26} className="shrink-0 text-indigo-500" />
        <div className="min-w-0">
          <p className="text-sm font-bold leading-snug text-slate-900">
            "Your future is created by what you do today."
          </p>
          <div className="my-2.5 h-0.5 w-8 rounded-full bg-indigo-300" />
          <p className="text-xs font-medium text-slate-500">Keep going!</p>
        </div>
      </section>
    </aside>
  );
};

export default ProfileSidePanel;
