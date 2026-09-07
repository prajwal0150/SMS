import { useMemo } from "react";
import {
  ClipboardCheck,
  ClipboardList,
  FileText,
  School,
} from "lucide-react";

import PageHeader from "../../dashboard/components/PageHeader";

import ClassesTable from "../components/ClassesTable";
import SectionsPanel from "../components/SectionsPanel";
import SubjectsPanel from "../components/SubjectsPanel";

import { useSchoolManagement } from "../hooks/useSchoolManagement";


const SchoolManagementPage = () => {
  const {
    classes,
    sections,
    subjects,
    classSubjects,
    selectedClassId,
    loading,
    saving,
    error,
    selectClass,
    reloadClassSubjects,
    loadClasses,
    handleCreateClass,
    handleDeleteClass,
    handleCreateSection,
    handleDeleteSection,
    handleAttachSubject,
    handleRemoveClassSubject,
  } = useSchoolManagement();


  const selectedClassName =
    classes.find((item) => item.id === selectedClassId)?.class_name ?? "";


  const classSections = useMemo(
    () =>
      sections.filter(
        (section) => section.class_id === selectedClassId
      ),
    [sections, selectedClassId]
  );


  const stats = useMemo(
    () => [
      {
        label: "Classes",
        value: classes.length,
        icon: School,
        tint: "bg-[#166534]/10 text-[#166534]",
      },
      {
        label: "Sections",
        value: sections.length,
        icon: ClipboardList,
        tint: "bg-[#1E3A5F]/10 text-[#1E3A5F]",
      },
      {
        label: "Subjects",
        value: subjects.length,
        icon: FileText,
        tint: "bg-[#D4A017]/15 text-[#8A6A0D]",
      },
      {
        label: "Assigned Subjects",
        value: classSubjects.length,
        icon: ClipboardCheck,
        tint: "bg-indigo-50 text-indigo-600",
      },
    ],
    [classes, sections, subjects, classSubjects]
  );


  return (
    <>
      <PageHeader
        title="School Management"
        description="Manage classes, sections and subjects for the academic year."
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

      <div className="mt-4 space-y-4">
        <ClassesTable
          classes={classes}
          sections={sections}
          loading={loading}
          saving={saving}
          error={error}
          selectedClassId={selectedClassId}
          onSelect={selectClass}
          onAdd={handleCreateClass}
          onDelete={handleDeleteClass}
          onReload={loadClasses}
        />

        {selectedClassId && selectedClassName ? (
          <div className="grid gap-4 lg:grid-cols-2">
            <SectionsPanel
              classId={selectedClassId}
              className={selectedClassName}
              sections={classSections}
              loading={loading}
              saving={saving}
              error={error}
              onAdd={handleCreateSection}
              onDelete={handleDeleteSection}
              onReload={loadClasses}
            />

            <SubjectsPanel
              classId={selectedClassId}
              className={selectedClassName}
              classSubjects={classSubjects}
              subjects={subjects}
              loading={loading}
              saving={saving}
              error={error}
              onAdd={handleAttachSubject}
              onRemove={handleRemoveClassSubject}
              onReload={reloadClassSubjects}
            />
          </div>
        ) : (
          <div className="rounded-lg border border-dashed border-slate-300 bg-white p-6 text-center">
            <p className="text-xs font-semibold text-slate-700">
              Add a class first to manage its sections and subjects.
            </p>
            <p className="mt-1 text-xs text-slate-500">
              Use the form above to create your first class.
            </p>
          </div>
        )}
      </div>
    </>
  );
};

export default SchoolManagementPage;