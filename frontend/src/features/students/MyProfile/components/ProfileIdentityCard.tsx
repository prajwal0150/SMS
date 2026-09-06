import { useRef } from "react";
import type { ChangeEvent } from "react";
import { CalendarDays, Camera, Loader2, Mail, Phone, User } from "lucide-react";

import { capitalize, composeFullName, formatDate } from "../utils/profileUtils";

import type { StudentProfileData } from "../types/profileTypes";

interface ProfileIdentityCardProps {
  profile: StudentProfileData;
  uploading: boolean;
  onPhotoSelected: (file: File) => void;
  className?: string;
}

/**
 * Photo + name + status pill + class / roll / admission
 * chips + contact rows, with a Change Photo uploader.
 */
const ProfileIdentityCard = ({
  profile,
  uploading,
  onPhotoSelected,
  className,
}: ProfileIdentityCardProps) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const fullName =
    composeFullName(
      profile.first_name,
      profile.middle_name,
      profile.last_name
    ) || "Student";

  const isActive = profile.status.toLowerCase() === "active";
  const statusLabel = capitalize(profile.status || "active");

  const classValue = [profile.class_name, profile.section_name]
    .map((part) => part?.trim())
    .filter(Boolean)
    .join(" - ");

  const admittedLabel = profile.admission_date
    ? `Admitted on ${formatDate(profile.admission_date)}`
    : profile.admission_year
      ? `Admitted in ${profile.admission_year}`
      : "Admission date not set";

  const handleButtonClick = () => fileInputRef.current?.click();

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0] ?? null;

    // Reset so picking the same file again still fires onChange.
    event.target.value = "";

    if (file) {
      onPhotoSelected(file);
    }
  };

  return (
    <section
      className={`flex flex-col gap-6 rounded-xl border border-slate-200 bg-white p-6 sm:flex-row sm:items-center ${
        className ?? ""
      }`}
    >
      {/* Photo + change photo */}
      <div className="flex shrink-0 flex-col items-center gap-3">
        {profile.photo_url ? (
          <img
            src={profile.photo_url}
            alt={fullName}
            className="h-28 w-28 rounded-full object-cover ring-4 ring-slate-100"
          />
        ) : (
          <span className="flex h-28 w-28 items-center justify-center rounded-full bg-indigo-50 text-indigo-400 ring-4 ring-slate-100">
            <User size={44} />
          </span>
        )}

        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleFileChange}
        />

        <button
          type="button"
          onClick={handleButtonClick}
          disabled={uploading}
          className="flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-600 transition hover:border-indigo-300 hover:text-indigo-600 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {uploading ? (
            <Loader2 size={13} className="animate-spin" />
          ) : (
            <Camera size={13} />
          )}
          {uploading ? "Uploading..." : "Change Photo"}
        </button>
      </div>

      {/* Identity details */}
      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-2.5">
          <h2 className="text-xl font-bold tracking-tight text-slate-900 sm:text-2xl">
            {fullName}
          </h2>
          <span
            className={`rounded-full px-2.5 py-0.5 text-[11px] font-semibold ${
              isActive
                ? "bg-emerald-100 text-emerald-700"
                : "bg-amber-100 text-amber-700"
            }`}
          >
            {statusLabel}
          </span>
        </div>

        <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1.5 text-sm text-slate-500">
          {classValue && <span>Class {classValue}</span>}
          {classValue && (
            <span className="h-3.5 w-px bg-slate-200" aria-hidden="true" />
          )}
          {profile.roll_number && <span>Roll No. {profile.roll_number}</span>}
          {profile.roll_number && (
            <span className="h-3.5 w-px bg-slate-200" aria-hidden="true" />
          )}
          <span>Admission No. {profile.admission_number || "-"}</span>
        </div>

        <div className="mt-4 space-y-2.5">
          <p className="flex items-center gap-2.5 text-sm text-slate-600">
            <Mail size={15} className="shrink-0 text-slate-400" />
            <span className="truncate">{profile.email ?? "-"}</span>
          </p>
          <p className="flex items-center gap-2.5 text-sm text-slate-600">
            <Phone size={15} className="shrink-0 text-slate-400" />
            <span className="truncate">{profile.phone ?? "-"}</span>
          </p>
          <p className="flex items-center gap-2.5 text-sm text-slate-600">
            <CalendarDays size={15} className="shrink-0 text-slate-400" />
            {admittedLabel}
          </p>
        </div>
      </div>
    </section>
  );
};

export default ProfileIdentityCard;
