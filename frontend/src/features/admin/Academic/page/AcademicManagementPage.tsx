import { useEffect, useMemo, useState } from "react";
import {
  Activity,
  ArrowLeft,
  CalendarClock,
  ClipboardList,
  Sun,
} from "lucide-react";

import PageHeader from "../../dashboard/components/PageHeader";

import AcademicActions from "../components/AcademicActions";
import ExamsTable from "../components/ExamsTable";
import TimetableTable from "../components/TimetableTable";
import HolidaysTable from "../components/HolidaysTable";
import AddExamForm from "../components/AddExamForm";
import AddTimetableForm from "../components/AddTimetableForm";
import AddHolidayForm from "../components/AddHolidayForm";

import { useAcademic } from "../hooks/useAcademic";

import type {
  AcademicManagementView,
} from "../types/academicTypes";


interface AcademicManagementPageProps {
  initialView?: AcademicManagementView;
}

const VIEW_LABELS: Record<AcademicManagementView, string> = {
  overview: "Overview",
  "add-exam": "Add Exam",
  "add-timetable": "Add Timetable",
  "add-holiday": "Add Holiday",
};


const AcademicManagementPage = ({
  initialView = "overview",
}: AcademicManagementPageProps) => {
  const [view, setView] =
    useState<AcademicManagementView>(initialView);

  const {
    exams,
    timetable,
    holidays,
    loading,
    saving,
    error,
    loadExams,
    loadTimetable,
    loadHolidays,
    handleCreateExam,
    handleDeleteExam,
    handleCreateTimetableEntry,
    handleDeleteTimetableEntry,
    handleCreateHoliday,
    handleDeleteHoliday,
  } = useAcademic();


  // Load everything so the stats and lists show live data.
  useEffect(() => {
    loadExams();
    loadTimetable();
    loadHolidays();
  }, [loadExams, loadTimetable, loadHolidays]);


  const stats = useMemo(
    () => [
      {
        label: "Total Exams",
        value: exams.length,
        icon: ClipboardList,
        tint: "bg-[#166534]/10 text-[#166534]",
      },
      {
        label: "Timetable Periods",
        value: timetable.length,
        icon: CalendarClock,
        tint: "bg-[#1E3A5F]/10 text-[#1E3A5F]",
      },
      {
        label: "Holidays",
        value: holidays.length,
        icon: Sun,
        tint: "bg-[#D4A017]/15 text-[#8A6A0D]",
      },
      {
        label: "Ongoing Exams",
        value: exams.filter(
          (exam) => exam.status === "ongoing"
        ).length,
        icon: Activity,
        tint: "bg-red-50 text-red-600",
      },
    ],
    [exams, timetable, holidays]
  );


  return (
    <>
      <PageHeader
        title="Academic"
        description="Manage exams, timetable and holidays."
        actions={<AcademicActions view={view} onChange={setView} />}
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

      {view !== "overview" && (
        <div className="mt-6 flex animate-fade-up items-center justify-between rounded-lg border border-slate-200 bg-white px-4 py-3">
          <p className="text-sm font-semibold text-slate-900">
            {VIEW_LABELS[view]}
          </p>

          <button
            type="button"
            onClick={() => setView("overview")}
            className="flex items-center gap-1.5 rounded-lg text-sm font-semibold text-[#166534] transition-colors hover:text-[#14532D]"
          >
            <ArrowLeft size={15} />
            Back to Academic
          </button>
        </div>
      )}

      <div className="mt-6 space-y-6">
        {view === "overview" && (
          <>
            <ExamsTable
              exams={exams}
              loading={loading}
              error={error}
              onDelete={handleDeleteExam}
              onReload={loadExams}
            />

            <TimetableTable
              entries={timetable}
              loading={loading}
              error={error}
              onDelete={handleDeleteTimetableEntry}
              onReload={loadTimetable}
            />

            <HolidaysTable
              holidays={holidays}
              loading={loading}
              error={error}
              onDelete={handleDeleteHoliday}
              onReload={loadHolidays}
            />
          </>
        )}

        {view === "add-exam" && (
          <AddExamForm
            saving={saving}
            onSave={handleCreateExam}
          />
        )}

        {view === "add-timetable" && (
          <AddTimetableForm
            saving={saving}
            onSave={handleCreateTimetableEntry}
          />
        )}

        {view === "add-holiday" && (
          <AddHolidayForm
            saving={saving}
            onSave={handleCreateHoliday}
          />
        )}
      </div>
    </>
  );
};

export default AcademicManagementPage;