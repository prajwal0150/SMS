import Card from "../../dashboard/components/Card";
import DataState from "./DataState";

import type { StudentFee } from "../types/feesTypes";


interface StudentFeesTableProps {
  studentFees: StudentFee[];
  loading: boolean;
  error: string | null;
  onStatusChange: (id: string, status: StudentFee["status"]) => void;
  onReload: () => void;
}

const formatCurrency = (value: number): string =>
  new Intl.NumberFormat("en-NP", {
    style: "currency",
    currency: "NPR",
    maximumFractionDigits: 0,
  }).format(value);

const formatDate = (iso: string): string =>
  new Date(iso).toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
  });


const STATUS_COLORS: Record<StudentFee["status"], string> = {
  pending: "bg-amber-500/10 text-amber-700",
  partial: "bg-blue-500/10 text-blue-700",
  paid: "bg-[#166534]/10 text-[#166534]",
  waived: "bg-slate-400/10 text-slate-500",
};


const STATUS_OPTIONS: StudentFee["status"][] = [
  "pending",
  "partial",
  "paid",
  "waived",
];


const StudentFeesTable = ({
  studentFees,
  loading,
  error,
  onStatusChange,
  onReload,
}: StudentFeesTableProps) => {
  const studentName = (fee: StudentFee): string => {
    const s = fee.students;
    if (s) {
      return `${s.first_name} ${s.last_name}`;
    }
    return "—";
  };

  const admissionNumber = (fee: StudentFee): string =>
    fee.students?.admission_number ?? "—";

  const categoryName = (fee: StudentFee): string =>
    fee.fee_categories?.category_name ?? "—";

  return (
    <Card
      title="Student Fees"
      subtitle={`${studentFees.length} fee records`}
      className="overflow-hidden"
    >
      {loading || error || studentFees.length === 0 ? (
        <DataState
          loading={loading}
          error={error}
          onReload={onReload}
          message="No student fee records yet. Use 'Assign Fees' to generate them."
        />
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full min-w-[850px] border-collapse text-sm">
            <thead>
              <tr>
                <th className="border-b border-slate-200 bg-slate-50 px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                  Student
                </th>
                <th className="border-b border-slate-200 bg-slate-50 px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                  Adm. No.
                </th>
                <th className="border-b border-slate-200 bg-slate-50 px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                  Category
                </th>
                <th className="border-b border-slate-200 bg-slate-50 px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                  Class
                </th>
                <th className="border-b border-slate-200 bg-slate-50 px-4 py-3 text-right text-xs font-semibold uppercase tracking-wider text-slate-500">
                  Amount
                </th>
                <th className="border-b border-slate-200 bg-slate-50 px-4 py-3 text-center text-xs font-semibold uppercase tracking-wider text-slate-500">
                  Due Date
                </th>
                <th className="border-b border-slate-200 bg-slate-50 px-4 py-3 text-center text-xs font-semibold uppercase tracking-wider text-slate-500">
                  Status
                </th>
              </tr>
            </thead>
            <tbody>
              {studentFees.map((fee) => (
                <tr
                  key={fee.id}
                  className="border-b border-slate-100 transition last:border-0 hover:bg-slate-50/60"
                >
                  <td className="px-4 py-3 font-semibold text-slate-900">
                    {studentName(fee)}
                  </td>
                  <td className="px-4 py-3 text-slate-600">
                    {admissionNumber(fee)}
                  </td>
                  <td className="px-4 py-3 text-slate-600">
                    {categoryName(fee)}
                  </td>
                  <td className="px-4 py-3 text-slate-600">
                    {fee.class_name}
                    {fee.section ? ` (${fee.section})` : ""}
                  </td>
                  <td className="px-4 py-3 text-right text-slate-600">
                    {formatCurrency(fee.amount)}
                  </td>
                  <td className="px-4 py-3 text-center text-slate-600">
                    {formatDate(fee.due_date)}
                  </td>
                  <td className="px-4 py-3 text-center">
                    <select
                      aria-label={`status for ${studentName(fee)}`}
                      value={fee.status}
                      onChange={(e) =>
                        onStatusChange(
                          fee.id,
                          e.target.value as StudentFee["status"]
                        )
                      }
                      className={`rounded-lg border-0 bg-transparent text-xs font-semibold ${STATUS_COLORS[fee.status]} focus:ring-2 focus:ring-[#7C3AED]`}
                    >
                      {STATUS_OPTIONS.map((option) => (
                        <option key={option} value={option}>
                          {option}
                        </option>
                      ))}
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </Card>
  );
};

export default StudentFeesTable;
