import { Link } from "react-router-dom";
import {
  ArrowRight,
  GraduationCap,
  RefreshCw,
  UserX,
} from "lucide-react";

import ChildAvatar from "../components/ChildAvatar";
import useParentData from "../hooks/useParentData";
import { formatDate } from "../utils/parentUtils";

const ParentChildrenPage = () => {
  const { loading, error, children, summaries } = useParentData();

  const summaryByStudent = new Map(
    summaries.map((item) => [item.student_id, item] as const)
  );

  if (loading) {
    return (
      <div className="rounded-xl border border-slate-200 bg-white p-12 text-center text-sm text-slate-500">
        Loading children...
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-xl border border-rose-200 bg-white p-8 text-center">
        <p className="text-base font-semibold text-slate-900">
          Children could not be loaded
        </p>
        <p className="mx-auto mt-2 max-w-xl text-sm text-slate-500">
          {error}
        </p>
        <button
          onClick={() => window.location.reload()}
          className="mt-5 inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-700"
        >
          <RefreshCw size={15} /> Retry
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900">
          My Children
        </h1>
        <p className="mt-1 text-sm text-slate-500">
          Select a child to view attendance, results, fees, homework,
          timetable and more.
        </p>
      </header>

      {children.length === 0 ? (
        <div className="rounded-lg border border-dashed border-slate-200 bg-slate-50/60 px-6 py-14 text-center">
          <UserX size={30} className="mx-auto text-slate-300" />
          <p className="mt-3 text-sm font-semibold text-slate-700">
            No children linked to your account
          </p>
          <p className="mt-1 text-xs text-slate-500">
            Please contact the school office to link your children.
          </p>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {children.map((child) => {
            const summary = summaryByStudent.get(child.student_id);

            return (
              <Link
                key={child.student_id}
                to={`/parent/children/${child.student_id}`}
                className="group rounded-lg border border-slate-200 bg-white p-5 transition hover:-translate-y-0.5 hover:border-indigo-300 hover:shadow-sm"
              >
                <div className="flex items-start gap-4">
                  <ChildAvatar
                    name={child.student_name}
                    photoUrl={child.photo_url}
                    size="lg"
                  />
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-base font-bold text-slate-900">
                      {child.student_name}
                    </p>
                    <p className="mt-0.5 text-xs text-slate-500">
                      {[child.class_name, child.section_name]
                        .filter(Boolean)
                        .join(" - ") || "Class not set"}
                    </p>
                    <span className="mt-2 inline-flex items-center gap-1 rounded-full bg-indigo-50 px-2 py-0.5 text-[11px] font-semibold text-indigo-600">
                      <GraduationCap size={12} />
                      {child.relation ?? "Child"} ·{" "}
                      {child.academic_year ?? "—"}
                    </span>
                  </div>
                </div>

                <div className="mt-4 grid grid-cols-3 gap-2 border-t border-slate-100 pt-3 text-center">
                  <div>
                    <p className="text-sm font-bold text-slate-900">
                      {summary?.attendance_percent ?? "—"}%
                    </p>
                    <p className="text-[10px] text-slate-400">
                      Attendance
                    </p>
                  </div>
                  <div>
                    <p className="text-sm font-bold text-slate-900">
                      {summary?.open_assignments ?? 0}
                    </p>
                    <p className="text-[10px] text-slate-400">Homework</p>
                  </div>
                  <div>
                    <p className="text-sm font-bold text-slate-900">
                      {summary?.pending_fees_count ?? 0}
                    </p>
                    <p className="text-[10px] text-slate-400">
                      Pending fees
                    </p>
                  </div>
                </div>

                <div className="mt-3 flex items-center justify-between">
                  <p className="text-[11px] text-slate-400">
                    {formatDate(child.date_of_birth)}
                  </p>
                  <span className="inline-flex items-center gap-1 text-xs font-semibold text-indigo-600">
                    View details
                    <ArrowRight
                      size={13}
                      className="transition-transform group-hover:translate-x-0.5"
                    />
                  </span>
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default ParentChildrenPage;