import { useEffect, useMemo, useState } from "react";
import {
  ArrowLeft,
  FileText,
  GraduationCap,
  UserCheck,
  Users,
} from "lucide-react";

import PageHeader from "../../dashboard/components/PageHeader";

import StudentManagementActions from "../components/StudentManagementActions";
import StudentsTable from "../components/StudentsTable";
import AddStudentForm from "../components/AddStudentForm";
import StudentPromotionPanel from "../components/StudentPromotionPanel";
import StudentDocumentsPanel from "../components/StudentDocumentsPanel";

import { useStudentManagement } from "../hooks/useStudentManagement";

import type {
  StudentManagementView,
} from "../types/studentManagmentTypes";


const VIEW_LABELS: Record<StudentManagementView, string> = {
  students: "All Students",
  "add-student": "Add Student",
  promotion: "Student Promotion",
  documents: "Student Documents",
};


interface StudentManagementPageProps {
  initialView?: StudentManagementView;
}

const StudentManagementPage = ({
  initialView = "students",
}: StudentManagementPageProps) => {
  const [view, setView] =
    useState<StudentManagementView>(initialView);

  const {
    students,
    promotions,
    documents,
    loading,
    promotionsLoading,
    documentsLoading,
    saving,
    error,
    loadStudents,
    loadPromotions,
    loadDocuments,
    handleCreateStudent,
    handleDeleteStudent,
    handlePromoteStudents,
    handleCreateDocument,
    handleDeleteDocument,
  } = useStudentManagement();


  // Load everything up-front so the stat cards show live data.
  useEffect(() => {
    loadStudents();
    loadPromotions();
    loadDocuments();
  }, [loadStudents, loadPromotions, loadDocuments]);


  const stats = useMemo(
    () => [
      {
        label: "Total Students",
        value: students.length,
        icon: Users,
        tint: "bg-[#166534]/10 text-[#166534]",
      },
      {
        label: "Active Students",
        value: students.filter(
          (student) => student.status === "active"
        ).length,
        icon: UserCheck,
        tint: "bg-[#1E3A5F]/10 text-[#1E3A5F]",
      },
      {
        label: "Classes Represented",
        value: new Set(
          students.map((student) => student.class_name)
        ).size,
        icon: GraduationCap,
        tint: "bg-[#D4A017]/15 text-[#8A6A0D]",
      },
      {
        label: "Documents on File",
        value: documents.length,
        icon: FileText,
        tint: "bg-[#166534]/10 text-[#166534]",
      },
    ],
    [students, documents]
  );


  return (
    <>
      <PageHeader
        title="Student Management"
        description="Manage student records, class promotions and documents."
        actions={<StudentManagementActions view={view} onChange={setView} />}
      />

      {/* Live stats from Supabase */}
      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map(({ label, value, icon: Icon, tint }, index) => (
          <div
            key={label}
            className="flex animate-fade-up items-center gap-3 rounded-lg border border-slate-200 bg-white p-4 transition-all duration-200 hover:-translate-y-0.5 hover:border-indigo-200"
            style={{ animationDelay: `${index * 70}ms` }}
          >
            <div
              className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg ${tint}`}
            >
              <Icon size={18} />
            </div>

            <div className="min-w-0">
              <p className="truncate text-xs font-medium text-slate-500">
                {label}
              </p>
              <p className="text-base font-bold text-slate-900">
                {value}
              </p>
            </div>
          </div>
        ))}
      </div>

      {view !== "students" && (
        <div className="mt-4 flex animate-fade-up items-center justify-between rounded-lg border border-slate-200 bg-white px-4 py-2">
          <p className="text-xs font-semibold text-slate-900">
            {VIEW_LABELS[view]}
          </p>

          <button
            type="button"
            onClick={() => setView("students")}
            className="flex items-center gap-1.5 rounded-lg text-xs font-semibold text-[#166534] transition-colors hover:text-[#14532D]"
          >
            <ArrowLeft size={15} />
            Back to All Students
          </button>
        </div>
      )}

      <div className="mt-4">
        {view === "students" && (
          <StudentsTable
            students={students}
            loading={loading}
            error={error}
            onDelete={handleDeleteStudent}
            onReload={loadStudents}
          />
        )}

        {view === "add-student" && (
          <AddStudentForm
            saving={saving}
            onSave={handleCreateStudent}
          />
        )}

        {view === "promotion" && (
          <StudentPromotionPanel
            students={students}
            promotions={promotions}
            loading={loading}
            promotionsLoading={promotionsLoading}
            saving={saving}
            onPromote={handlePromoteStudents}
            onReload={loadStudents}
            onReloadPromotions={loadPromotions}
          />
        )}

        {view === "documents" && (
          <StudentDocumentsPanel
            students={students}
            documents={documents}
            documentsLoading={documentsLoading}
            saving={saving}
            onCreate={handleCreateDocument}
            onDelete={handleDeleteDocument}
            onReload={loadDocuments}
          />
        )}
      </div>
    </>
  );
};

export default StudentManagementPage;