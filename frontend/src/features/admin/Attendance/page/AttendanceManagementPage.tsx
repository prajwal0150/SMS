import { useState } from "react";
import type { LucideIcon } from "lucide-react";
import { FileDown, GraduationCap, RefreshCw, Users } from "lucide-react";

import PageHeader from "../../dashboard/components/PageHeader";

import AttendanceFilters from "../components/AttendanceFilters";
import AttendanceStats from "../components/AttendanceStats";
import ReportGeneratorModal from "../components/ReportGeneratorModal";
import StaffAttendanceTable from "../components/StaffAttendanceTable";
import StudentAttendanceTable from "../components/StudentAttendanceTable";

import { useSchoolLookups } from "../../School/hooks/useSchoolLookups";
import { useAttendance } from "../hooks/useAttendance";
import type {
  AttendanceFilters as AttendanceFilterState,
  AttendanceTab,
  ReportOptions,
} from "../types/attendanceTypes";

const TABS: { key: AttendanceTab; label: string; icon: LucideIcon }[] = [
  { key: "student", label: "Student Attendance", icon: GraduationCap },
  { key: "staff", label: "Staff Attendance", icon: Users },
];

const AttendanceManagementPage = () => {
  const [modalOpen, setModalOpen] = useState(false);

  const {
    tab,
    setTab,
    filters,
    setFilter,
    resetFilters,
    studentRows,
    staffRows,
    studentStats,
    staffStats,
    students,
    teachers,
    loading,
    error,
    generating,
    refresh,
    generateReport,
  } = useAttendance();

  // Classes / sections / subjects configured on the School Management page.
  const { classes, sections, subjects } = useSchoolLookups();

  const stats = tab === "student" ? studentStats : staffStats;

  const handleFilterChange = (
    key: keyof AttendanceFilterState,
    value: string
  ) => {
    // Changing the class invalidates the section choice.
    if (key === "classId") {
      setFilter("sectionId", "");
    }
    setFilter(key, value);
  };

  const handleGenerate = async (options: ReportOptions) => {
    const success = await generateReport(options);
    if (success) {
      setModalOpen(false);
    }

    return success;
  };

  return (
    <>
      <PageHeader
        title="Attendance Management"
        description="Track daily student and staff attendance and export PDF reports."
        actions={
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={refresh}
              className="flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-600 transition hover:border-indigo-300 hover:text-indigo-600"
            >
              <RefreshCw size={16} className={loading ? "animate-spin" : ""} />
              Refresh
            </button>
            <button
              type="button"
              onClick={() => setModalOpen(true)}
              className="flex items-center gap-2 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-indigo-700"
            >
              <FileDown size={16} />
              Generate Report
            </button>
          </div>
        }
      />

      {/* Student / Staff tabs */}
      <div className="mb-6 inline-flex items-center gap-1 rounded-lg bg-slate-100 p-1">
        {TABS.map(({ key, label, icon: Icon }) => (
          <button
            key={key}
            type="button"
            onClick={() => setTab(key)}
            className={`flex items-center gap-2 rounded-md px-4 py-2 text-sm font-medium transition ${
              tab === key
                ? "bg-white text-indigo-700 shadow-sm"
                : "text-slate-500 hover:text-slate-700"
            }`}
          >
            <Icon size={16} />
            {label}
          </button>
        ))}
      </div>

      <div className="space-y-6">
        <AttendanceStats tab={tab} stats={stats} />

        <AttendanceFilters
          filters={filters}
          classes={classes}
          sections={sections}
          subjects={subjects}
          teachers={teachers}
          onChange={handleFilterChange}
          onReset={resetFilters}
        />

        {tab === "student" ? (
          <StudentAttendanceTable
            rows={studentRows}
            loading={loading}
            error={error}
            onRetry={refresh}
          />
        ) : (
          <StaffAttendanceTable
            rows={staffRows}
            loading={loading}
            error={error}
            onRetry={refresh}
          />
        )}
      </div>

      {/* PDF export popup */}
      <ReportGeneratorModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        defaultTarget={tab}
        classes={classes}
        sections={sections}
        students={students}
        teachers={teachers}
        generating={generating}
        onGenerate={handleGenerate}
      />
    </>
  );
};

export default AttendanceManagementPage;