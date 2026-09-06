import {
  BookOpen,
  Building2,
  Cake,
  CalendarDays,
  Droplet,
  Hash,
  Mail,
  Map,
  MapPin,
  Phone,
  ShieldCheck,
  Tag,
  User,
  UserCheck,
  Users,
} from "lucide-react";

import InfoCard from "./InfoCard";

import { capitalize, composeFullName, formatDate } from "../utils/profileUtils";

import type { StudentProfileData } from "../types/profileTypes";

export type ProfileTabId = "personal" | "academic" | "family";

export interface ProfileTab {
  id: ProfileTabId;
  label: string;
  /** InfoCard the tab scrolls to. */
  targetId: string;
}

const PROFILE_TABS: ProfileTab[] = [
  {
    id: "personal",
    label: "Personal Information",
    targetId: "profile-basic",
  },
  {
    id: "academic",
    label: "Academic Details",
    targetId: "profile-class",
  },
  {
    id: "family",
    label: "Parent / Guardian Details",
    targetId: "profile-family",
  },
];

interface ProfileDetailsSectionProps {
  profile: StudentProfileData;
  activeTab: ProfileTabId;
  highlightedId: string | null;
  onTabSelect: (tab: ProfileTab) => void;
}

const dash = (value: string | null): string =>
  value && value.trim() ? value : "-";

/**
 * Tabbed section with all profile info cards - Basic
 * Information, Address, Class & Section, Admission Details
 * and Family Information.
 */
const ProfileDetailsSection = ({
  profile,
  activeTab,
  highlightedId,
  onTabSelect,
}: ProfileDetailsSectionProps) => {
  const fullName =
    composeFullName(
      profile.first_name,
      profile.middle_name,
      profile.last_name
    ) || "-";

  const basicRows = [
    { icon: User, label: "Full Name", value: fullName },
    { icon: Mail, label: "Email", value: dash(profile.email) },
    { icon: Phone, label: "Phone", value: dash(profile.phone) },
    {
      icon: User,
      label: "Gender",
      value: profile.gender ? capitalize(profile.gender) : "-",
    },
    { icon: Cake, label: "Date of Birth", value: formatDate(profile.date_of_birth) },
    { icon: Droplet, label: "Blood Group", value: dash(profile.blood_group) },
    { icon: Tag, label: "Category", value: dash(profile.category) },
    { icon: ShieldCheck, label: "RTE", value: profile.rte ? "Yes" : "No" },
  ];

  const addressRows = [
    { icon: MapPin, label: "Address", value: dash(profile.address) },
    { icon: Building2, label: "City", value: dash(profile.city) },
    { icon: Map, label: "State", value: dash(profile.state) },
    { icon: Hash, label: "Postal Code", value: dash(profile.postal_code) },
  ];

  const classRows = [
    { icon: BookOpen, label: "Class", value: dash(profile.class_name) },
    { icon: Users, label: "Section", value: dash(profile.section_name) },
    {
      icon: UserCheck,
      label: "Class Teacher",
      value: dash(profile.class_teacher_name),
    },
  ];

  const admissionRows = [
    {
      icon: Hash,
      label: "Admission Number",
      value: dash(profile.admission_number),
    },
    {
      icon: CalendarDays,
      label: "Admission Year",
      value: profile.admission_year ? String(profile.admission_year) : "-",
    },
    {
      icon: CalendarDays,
      label: "Admission Date",
      value: formatDate(profile.admission_date),
    },
  ];

  const familyRows = [
    { icon: User, label: "Father's Name", value: dash(profile.father_name) },
    { icon: User, label: "Mother's Name", value: dash(profile.mother_name) },
    { icon: Users, label: "Guardian Name", value: dash(profile.guardian_name) },
    {
      icon: Phone,
      label: "Guardian Phone",
      value: dash(profile.guardian_phone),
    },
  ];

  return (
    <section className="rounded-xl border border-slate-200 bg-white">
      {/* Tabs */}
      <div className="flex gap-1 overflow-x-auto border-b border-slate-100 px-3 sm:px-5">
        {PROFILE_TABS.map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => onTabSelect(tab)}
            className={`-mb-px whitespace-nowrap border-b-2 px-3 py-3.5 text-sm font-semibold transition-colors sm:px-4 ${
              activeTab === tab.id
                ? "border-indigo-600 text-indigo-600"
                : "border-transparent text-slate-500 hover:text-slate-700"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Info cards */}
      <div className="grid gap-6 p-4 sm:p-6 lg:grid-cols-2">
        <div className="space-y-6">
          <InfoCard
            id="profile-basic"
            title="Basic Information"
            icon={User}
            rows={basicRows}
            highlighted={highlightedId === "profile-basic"}
          />
          <InfoCard
            id="profile-address"
            title="Address"
            icon={MapPin}
            rows={addressRows}
            highlighted={highlightedId === "profile-address"}
          />
        </div>

        <div className="space-y-6">
          <InfoCard
            id="profile-class"
            title="Class & Section"
            icon={BookOpen}
            rows={classRows}
            highlighted={highlightedId === "profile-class"}
          />
          <InfoCard
            id="profile-admission"
            title="Admission Details"
            icon={CalendarDays}
            rows={admissionRows}
            highlighted={highlightedId === "profile-admission"}
          />
          <InfoCard
            id="profile-family"
            title="Family Information"
            icon={Users}
            rows={familyRows}
            highlighted={highlightedId === "profile-family"}
          />
        </div>
      </div>
    </section>
  );
};

export default ProfileDetailsSection;
