import { RefreshCw } from "lucide-react";

import PageHeader from "../../dashboard/components/PageHeader";

import ClassResultsPanel from "../components/ClassResultsPanel";
import GradeScaleModal from "../components/GradeScaleModal";
import QuickActions from "../components/QuickActions";
import ResultDetailsPanel from "../components/ResultDetailsPanel";
import ResultExportModal from "../components/ResultExportModal";
import ResultFilters from "../components/ResultFilters";
import ResultsTable from "../components/ResultsTable";
import ResultStats from "../components/ResultStats";

import { useSchoolLookups } from "../../School/hooks/useSchoolLookups";
import { useResults } from "../hooks/useResults";
import type { ResultFilters as ResultFilterState } from "../types/resultTypes";

const ResultsManagementPage = () => {
  const {
    filters,
    setFilter,
    resetFilters,
    rows,
    stats,
    academicYears,
    exams,
    students,
    loading,
    error,
    setSelectedId,
    selectedSummary,
    detailRows,
    detailLoading,
    actionBusy,
    approveResult,
    rejectResult,
    publishResult,
    exportOpen,
    setExportOpen,
    gradeOpen,
    setGradeOpen,
    gradeScales,
    generating,
    generateExport,
    downloadSelectedPdf,
    printSelected,
    refresh,
  } = useResults();

  const { classes, sections, loading: schoolLoading } = useSchoolLookups();

  const handleFilterChange = (
    key: keyof ResultFilterState,
    value: string
  ) => {
    // Changing the class invalidates the section choice.
    if (key === "classId") {
      setFilter("sectionId", "");
    }
    setFilter(key, value);
  };

  // Quick-action shortcuts jump to the matching workflow stage.
  const focusWorkflow = (status: string) => {
    setFilter("workflowStatus", status);
  };

  // "Generate Class Report" jumps to the class/overall report panel below.
  const scrollToClassReport = () => {
    document
      .getElementById("class-results-panel")
      ?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <>
      <PageHeader
        title="Results Management"
        description="Review, approve and publish the marks submitted by teachers, and export result reports."
        actions={
          <button
            type="button"
            onClick={refresh}
            className="flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-600 transition hover:border-indigo-300 hover:text-indigo-600"
          >
            <RefreshCw size={16} className={loading ? "animate-spin" : ""} />
            Refresh
          </button>
        }
      />

      <div className="space-y-4">
        <ResultStats stats={stats} loading={loading} />

        <ResultFilters
          filters={filters}
          exams={exams}
          classes={classes}
          sections={sections}
          academicYears={academicYears}
          onChange={handleFilterChange}
          onReset={resetFilters}
          onApply={refresh}
        />

        <div className="grid gap-4 xl:grid-cols-3">
          <div className="xl:col-span-2">
            <ResultsTable
              rows={rows}
              loading={loading || schoolLoading}
              error={error}
              onRetry={refresh}
              onView={(row) => setSelectedId(row.result_id)}
              onRowClick={(row) => setSelectedId(row.result_id)}
            />
          </div>

          <ResultDetailsPanel
            summary={selectedSummary}
            details={detailRows}
            loading={detailLoading}
            actionBusy={actionBusy}
            onClose={() => setSelectedId(null)}
            onApprove={() => void approveResult()}
            onReject={(remark) => void rejectResult(remark)}
            onPublish={() => void publishResult()}
            onDownloadPdf={downloadSelectedPdf}
            onPrint={printSelected}
          />
        </div>

        <QuickActions
          onReviewPending={() => focusWorkflow("submitted")}
          onPublishedResults={() => focusWorkflow("reviewed")}
          onGenerateClassReport={scrollToClassReport}
          onGradeConfiguration={() => setGradeOpen(true)}
          onExportAll={() => setExportOpen(true)}
        />

        {/* Overall / class reports (class_result_summary view) */}
        <ClassResultsPanel filters={filters} />
      </div>

      {/* PDF export popup */}
      <ResultExportModal
        open={exportOpen}
        onClose={() => setExportOpen(false)}
        exams={exams}
        classes={classes}
        sections={sections}
        students={students}
        generating={generating}
        onGenerate={generateExport}
      />

      {/* Grade configuration */}
      <GradeScaleModal
        open={gradeOpen}
        loading={false}
        scales={gradeScales}
        onClose={() => setGradeOpen(false)}
      />
    </>
  );
};

export default ResultsManagementPage;

