import { useEffect, useRef, useState } from "react";
import {
  BookOpen,
  CalendarDays,
  GraduationCap,
  RefreshCw,
  User,
} from "lucide-react";
import toast from "react-hot-toast";

import StatTile from "../../Dashboard/components/StatTile";

import ChangePasswordModal from "../components/ChangePasswordModal";
import EditProfileModal from "../components/EditProfileModal";
import ProfileBanner from "../components/ProfileBanner";
import ProfileDetailsSection from "../components/ProfileDetailsSection";
import ProfileIdentityCard from "../components/ProfileIdentityCard";
import ProfileSidePanel from "../components/ProfileSidePanel";
import ViewDocumentsModal from "../components/ViewDocumentsModal";

import { useStudentProfile } from "../hooks/useStudentProfile";
import {
  MAX_PHOTO_BYTES,
  updateMyStudentProfile,
  uploadStudentPhoto,
} from "../services/profileService";

import type {
  ProfileTab,
  ProfileTabId,
} from "../components/ProfileDetailsSection";
import type { ProfileEditInput } from "../types/profileTypes";

/**
 * My Profile - the logged in student's personal information,
 * academic details and family contacts, with quick actions
 * to update the profile, change the password and view
 * documents.
 */
const StudentProfilePage = () => {
  const { profile, loading, error, reload } = useStudentProfile();

  const [activeTab, setActiveTab] = useState<ProfileTabId>("personal");
  const [highlightedId, setHighlightedId] = useState<string | null>(null);

  const [editOpen, setEditOpen] = useState(false);
  const [passwordOpen, setPasswordOpen] = useState(false);
  const [documentsOpen, setDocumentsOpen] = useState(false);

  const [savingProfile, setSavingProfile] = useState(false);
  const [uploadingPhoto, setUploadingPhoto] = useState(false);

  const highlightTimer = useRef<number | null>(null);

  // Clear the pending highlight timer on unmount.
  useEffect(
    () => () => {
      if (highlightTimer.current !== null) {
        window.clearTimeout(highlightTimer.current);
      }
    },
    []
  );

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <span className="h-8 w-8 animate-spin rounded-full border-2 border-indigo-200 border-t-indigo-600" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-xl border border-red-200 bg-red-50 p-6 text-center">
        <p className="text-sm font-semibold text-red-700">{error}</p>
        <p className="mt-1 text-sm text-red-600">
          Make sure the student profile SQL
          (supabase/Student/student-profile.sql) has been run.
        </p>
        <button
          type="button"
          onClick={reload}
          className="mt-4 inline-flex items-center gap-2 rounded-lg bg-red-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-red-700"
        >
          <RefreshCw size={15} />
          Try again
        </button>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="rounded-xl border border-amber-200 bg-amber-50 p-6 text-center">
        <p className="text-sm font-semibold text-amber-700">
          No student profile is linked to this account yet.
        </p>
        <p className="mt-1 text-sm text-amber-600">
          Please contact the school office so they can link your
          admission record.
        </p>
      </div>
    );
  }

  const classValue =
    [profile.class_name, profile.section_name]
      .map((part) => part?.trim())
      .filter(Boolean)
      .join(" - ") || "-";

  // Tabs scroll to the matching info card and briefly
  // highlight it.
  const focusSection = (targetId: string) => {
    document
      .getElementById(targetId)
      ?.scrollIntoView({ behavior: "smooth", block: "center" });

    setHighlightedId(targetId);

    if (highlightTimer.current !== null) {
      window.clearTimeout(highlightTimer.current);
    }

    highlightTimer.current = window.setTimeout(
      () => setHighlightedId(null),
      1800
    );
  };

  const handleTabSelect = (tab: ProfileTab) => {
    setActiveTab(tab.id);
    focusSection(tab.targetId);
  };

  const handleSaveProfile = async (
    input: ProfileEditInput
  ): Promise<boolean> => {
    if (!profile) {
      return false;
    }

    setSavingProfile(true);

    try {
      await updateMyStudentProfile(profile, input);
      await reload();
      toast.success("Profile updated successfully.");
      setEditOpen(false);
      return true;
    } catch (err) {
      toast.error(
        err instanceof Error
          ? err.message
          : "Could not update your profile."
      );
      return false;
    } finally {
      setSavingProfile(false);
    }
  };

  const handlePhotoSelected = async (file: File) => {
    if (!profile) {
      return;
    }

    if (!file.type.startsWith("image/")) {
      toast.error("Please choose an image file.");
      return;
    }

    if (file.size > MAX_PHOTO_BYTES) {
      toast.error("The photo must be smaller than 5 MB.");
      return;
    }

    setUploadingPhoto(true);

    try {
      const publicUrl = await uploadStudentPhoto(profile.student_id, file);
      await updateMyStudentProfile(profile, { photo_url: publicUrl });
      await reload();
      toast.success("Profile photo updated.");
    } catch (err) {
      toast.error(
        err instanceof Error
          ? err.message
          : "Could not upload the photo."
      );
    } finally {
      setUploadingPhoto(false);
    }
  };

  return (
    <div className="space-y-6">
      <ProfileBanner />

      {/* Identity card + summary tiles */}
      <div className="grid gap-6 xl:grid-cols-5">
        <ProfileIdentityCard
          profile={profile}
          uploading={uploadingPhoto}
          onPhotoSelected={handlePhotoSelected}
          className="xl:col-span-3"
        />

        <div className="grid content-start gap-4 sm:grid-cols-2 xl:col-span-2">
          <StatTile
            label="Class"
            value={classValue}
            icon={BookOpen}
            iconClassName="bg-blue-500 text-white"
          />
          <StatTile
            label="Roll Number"
            value={profile.roll_number ?? "-"}
            icon={User}
            iconClassName="bg-emerald-500 text-white"
          />
          <StatTile
            label="Total Subjects"
            value={
              profile.total_subjects !== null
                ? String(profile.total_subjects)
                : "-"
            }
            icon={GraduationCap}
            iconClassName="bg-violet-500 text-white"
          />
          <StatTile
            label="Academic Year"
            value={profile.academic_year ?? "-"}
            icon={CalendarDays}
            iconClassName="bg-amber-500 text-white"
          />
        </div>
      </div>

      {/* Details + side panel */}
      <div className="grid gap-6 xl:grid-cols-3">
        <div className="xl:col-span-2">
          <ProfileDetailsSection
            profile={profile}
            activeTab={activeTab}
            highlightedId={highlightedId}
            onTabSelect={handleTabSelect}
          />
        </div>

        <ProfileSidePanel
          profile={profile}
          onUpdateProfile={() => setEditOpen(true)}
          onChangePassword={() => setPasswordOpen(true)}
          onViewDocuments={() => setDocumentsOpen(true)}
        />
      </div>

      {/* Quick action popups */}
      <EditProfileModal
        open={editOpen}
        profile={profile}
        saving={savingProfile}
        onClose={() => setEditOpen(false)}
        onSave={handleSaveProfile}
      />
      <ChangePasswordModal
        open={passwordOpen}
        onClose={() => setPasswordOpen(false)}
      />
      <ViewDocumentsModal
        open={documentsOpen}
        studentId={profile.student_id}
        onClose={() => setDocumentsOpen(false)}
      />
    </div>
  );
};

export default StudentProfilePage;

