import { useEffect, useMemo, useState } from "react";
import {
  ArrowLeft,
  CalendarCheck,
  ClipboardList,
  UserCheck,
  Users,
} from "lucide-react";

import PageHeader from "../../dashboard/components/PageHeader";

import StaffManagementActions from "../components/StaffManagementActions";
import TeachersTable from "../components/TeachersTable";
import AddTeacherForm from "../components/AddTeacherForm";
import TeacherAssignmentsPanel from "../components/TeacherAssignmentsPanel";
import StaffAttendancePanel from "../components/StaffAttendancePanel";

import { useStaffManagement } from "../hooks/useStaffManagement";

import type {
  StaffManagementView,
} from "../types/staffManagmentTypes";


const todayString = (): string =>
  new Date().toISOString().slice(0, 10);

const VIEW_LABELS: Record<StaffManagementView, string> = {
  teachers: "All Teachers",
  "add-teacher": "Add Teacher",
  assignments: "Teacher Assignments",
  attendance: "Staff Attendance",
};


const StaffManagementPage = () => {
  const [view, setView] =
    useState<StaffManagementView>("teachers");

  const {
    teachers,
    assignments,
    attendance,
    loading,
    saving,
    error,
    loadTeachers,
    loadAssignments,
    loadAttendance,
    handleCreateTeacher,
    handleDeleteTeacher,
    handleCreateAssignment,
    handleMarkAttendance,
  } = useStaffManagement();


  // Load everything up-front so the stat cards show live data.
  useEffect(() => {
    loadTeachers();
    loadAssignments();
    loadAttendance();
  }, [loadTeachers, loadAssignments, loadAttendance]);


  const stats = useMemo(
    () => [
      {
        label: "Total Teachers",
        value: teachers.length,
        icon: Users,
        tint: "bg-[#166534]/10 text-[#166534]",
      },
      {
        label: "Active Staff",
        value: teachers.filter(
          (teacher) => teacher.status === "active"
        ).length,
        icon: UserCheck,
        tint: "bg-[#1E3A5F]/10 text-[#1E3A5F]",
      },
      {
        label: "Class Assignments",
        value: assignments.length,
        icon: ClipboardList,
        tint: "bg-[#D4A017]/15 text-[#8A6A0D]",
      },
      {
        label: "Present Today",
        value: attendance.filter(
          (record) =>
            record.date === todayString() &&
            record.status === "present"
        ).length,
        icon: CalendarCheck,
        tint: "bg-[#166534]/10 text-[#166534]",
      },
    ],
    [teachers, assignments, attendance]
  );


  return (
    <>
      <PageHeader
        title="Staff Management"
        description="Manage teachers, class assignments and staff attendance."
        actions={<StaffManagementActions view={view} onChange={setView} />}
      />

      {/* Live stats from Supabase */}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map(({ label, value, icon: Icon, tint }, index) => (
          <div
            key={label}
            className="flex animate-fade-up items-center gap-4 rounded-lg border border-slate-200 bg-white p-5 transition-all duration-200 hover:-translate-y-0.5 hover:border-[#166534]/30"
            style={{ animationDelay: `${index * 70}ms` }}
          >
            <div
              className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-lg ${tint}`}
            >
              <Icon size={22} />
            </div>

            <div className="min-w-0">
              <p className="truncate text-sm font-medium text-slate-500">
                {label}
              </p>
              <p className="text-2xl font-bold text-slate-900">
                {value}
              </p>
            </div>
          </div>
        ))}
      </div>

      {view !== "teachers" && (
        <div className="mt-6 flex animate-fade-up items-center justify-between rounded-lg border border-slate-200 bg-white px-4 py-3">
          <p className="text-sm font-semibold text-slate-900">
            {VIEW_LABELS[view]}
          </p>

          <button
            type="button"
            onClick={() => setView("teachers")}
            className="flex items-center gap-1.5 rounded-lg text-sm font-semibold text-[#166534] transition-colors hover:text-[#14532D]"
          >
            <ArrowLeft size={15} />
            Back to All Teachers
          </button>
        </div>
      )}

      <div className="mt-6">
        {view === "teachers" && (
          <TeachersTable
            teachers={teachers}
            loading={loading}
            error={error}
            onDelete={handleDeleteTeacher}
            onReload={loadTeachers}
          />
        )}

        {view === "add-teacher" && (
          <AddTeacherForm
            saving={saving}
            onSave={handleCreateTeacher}
          />
        )}

        {view === "assignments" && (
          <TeacherAssignmentsPanel
            teachers={teachers}
            assignments={assignments}
            loading={loading}
            saving={saving}
            onCreate={handleCreateAssignment}
            onReload={loadAssignments}
          />
        )}

        {view === "attendance" && (
          <StaffAttendancePanel
            teachers={teachers}
            attendance={attendance}
            saving={saving}
            onMark={handleMarkAttendance}
            onReload={loadAttendance}
          />
        )}
      </div>
    </>
  );
};

export default StaffManagementPage;