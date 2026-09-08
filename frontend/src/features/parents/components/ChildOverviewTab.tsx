import DataStates from "../components/DataStates";
import useChildSection from "../hooks/useChildSection";
import { fetchChildAttendance } from "../services/parentService";
import { titleCase } from "../utils/parentUtils";

import type { ParentChild } from "../types/parentTypes";

interface ChildOverviewTabProps {
  child: ParentChild;
  attendancePercent: number | null;
}

const ChildOverviewTab = ({
  child,
  attendancePercent,
}: ChildOverviewTabProps) => {
  const { loading, error, rows } = useChildSection(
    child.student_id,
    fetchChildAttendance
  );

  const total = rows.length;

  const count = (status: string) =>
    rows.filter((row) => row.status === status).length;

  return (
    <div className="grid gap-6 lg:grid-cols-3">
      <section className="rounded-lg border border-slate-200 bg-white p-6">
        <h2 className="text-sm font-bold text-slate-900">
          Basic information
        </h2>
        <dl className="mt-4 space-y-3 text-sm">
          {[
            ["Admission number", child.admission_number],
            ["Roll number", child.roll_number],
            ["Class", child.class_name],
            ["Section", child.section_name],
            ["Academic year", child.academic_year],
            ["Date of birth", child.date_of_birth],
            ["Gender", child.gender],
            ["Blood group", child.blood_group],
            ["Category", child.category],
            ["Status", child.status],
          ].map(([label, value]) => (
            <div
              key={label}
              className="flex items-center justify-between gap-3"
            >
              <dt className="text-xs text-slate-500">{label}</dt>
              <dd className="text-sm font-semibold text-slate-800">
                {value && value !== "" ? titleCase(value) : "—"}
              </dd>
            </div>
          ))}
        </dl>
      </section>

      <section className="rounded-lg border border-slate-200 bg-white p-6">
        <h2 className="text-sm font-bold text-slate-900">
          Attendance summary
        </h2>

        <DataStates
          isLoading={loading}
          empty="No attendance has been recorded yet."
          error={error}
        />

        {!loading && !error && total > 0 && (
          <div className="mt-4 grid grid-cols-2 gap-3">
            <div className="rounded-lg bg-emerald-50 p-4">
              <p className="text-2xl font-bold text-emerald-700">
                {count("present")}
              </p>
              <p className="text-xs text-emerald-600">Present days</p>
            </div>
            <div className="rounded-lg bg-amber-50 p-4">
              <p className="text-2xl font-bold text-amber-700">
                {count("late")}
              </p>
              <p className="text-xs text-amber-600">Late days</p>
            </div>
            <div className="rounded-lg bg-rose-50 p-4">
              <p className="text-2xl font-bold text-rose-700">
                {count("absent")}
              </p>
              <p className="text-xs text-rose-600">Absent days</p>
            </div>
            <div className="rounded-lg bg-sky-50 p-4">
              <p className="text-2xl font-bold text-sky-700">
                {count("leave")}
              </p>
              <p className="text-xs text-sky-600">Leave days</p>
            </div>
          </div>
        )}

        {attendancePercent !== null && (
          <p className="mt-4 border-t border-slate-100 pt-3 text-xs text-slate-500">
            Overall attendance:{" "}
            <span className="font-bold text-slate-800">
              {attendancePercent}%
            </span>
          </p>
        )}
      </section>

      <section className="rounded-lg border border-slate-200 bg-white p-6">
        <h2 className="text-sm font-bold text-slate-900">
          Parent / guardian
        </h2>
        <dl className="mt-4 space-y-3 text-sm">
          {[
            ["Father", child.father_name],
            ["Mother", child.mother_name],
            ["Guardian", child.guardian_name],
            ["Guardian phone", child.guardian_phone],
            ["Your relation", child.relation],
            ["Email", child.student_email],
            ["Phone", child.student_phone],
          ].map(([label, value]) => (
            <div
              key={label}
              className="flex items-center justify-between gap-3"
            >
              <dt className="text-xs text-slate-500">{label}</dt>
              <dd className="text-sm font-semibold text-slate-800">
                {value && value !== "" ? value : "—"}
              </dd>
            </div>
          ))}
        </dl>
      </section>
    </div>
  );
};

export default ChildOverviewTab;