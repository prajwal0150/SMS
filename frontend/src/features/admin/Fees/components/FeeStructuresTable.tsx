import { Edit, Trash2 } from "lucide-react";

import Card from "../../dashboard/components/Card";
import DataState from "./DataState";

import type { FeeStructure, FeeCategory } from "../types/feesTypes";


interface FeeStructuresTableProps {
  structures: FeeStructure[];
  categories: FeeCategory[];
  loading: boolean;
  error: string | null;
  onEdit: (structure: FeeStructure) => void;
  onDelete: (id: string) => void;
  onReload: () => void;
}

const formatCurrency = (value: number): string =>
  new Intl.NumberFormat("en-NP", {
    style: "currency",
    currency: "NPR",
    maximumFractionDigits: 0,
  }).format(value);


const FeeStructuresTable = ({
  structures,
  categories,
  loading,
  error,
  onEdit,
  onDelete,
  onReload,
}: FeeStructuresTableProps) => {
  const categoryName = (id: string): string =>
    categories.find((c) => c.id === id)?.category_name ?? "—";

  return (
    <Card
      title="Fee Structures"
      subtitle={`${structures.length} structures defined`}
      className="overflow-hidden"
    >
      {loading || error || structures.length === 0 ? (
        <DataState
          loading={loading}
          error={error}
          onReload={onReload}
          message="No fee structures yet. Use 'Add Structure' to create the first one."
        />
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full min-w-[800px] border-collapse text-sm">
            <thead>
              <tr>
                <th className="border-b border-slate-200 bg-slate-50 px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                  Category
                </th>
                <th className="border-b border-slate-200 bg-slate-50 px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                  Class
                </th>
                <th className="border-b border-slate-200 bg-slate-50 px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                  Section
                </th>
                <th className="border-b border-slate-200 bg-slate-50 px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                  Amount
                </th>
                <th className="border-b border-slate-200 bg-slate-50 px-4 py-3 text-center text-xs font-semibold uppercase tracking-wider text-slate-500">
                  Mandatory
                </th>
                <th className="border-b border-slate-200 bg-slate-50 px-4 py-3 text-center text-xs font-semibold uppercase tracking-wider text-slate-500">
                  Due Day
                </th>
                <th className="border-b border-slate-200 bg-slate-50 px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                  Status
                </th>
                <th className="border-b border-slate-200 bg-slate-50 px-4 py-3 text-right text-xs font-semibold uppercase tracking-wider text-slate-500">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {structures.map((structure) => (
                <tr
                  key={structure.id}
                  className="border-b border-slate-100 transition last:border-0 hover:bg-slate-50/60"
                >
                  <td className="px-4 py-3 font-semibold text-slate-900">
                    {categoryName(structure.category_id)}
                  </td>
                  <td className="px-4 py-3 text-slate-600">
                    {structure.class_name}
                  </td>
                  <td className="px-4 py-3 text-slate-600">
                    {structure.section ?? "All"}
                  </td>
                  <td className="px-4 py-3 text-slate-600">
                    {formatCurrency(structure.amount)}
                  </td>
                  <td className="px-4 py-3 text-center">
                    {structure.is_mandatory ? "Yes" : "No"}
                  </td>
                  <td className="px-4 py-3 text-center">
                    {structure.due_day ?? "—"}
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${
                        structure.status === "active"
                          ? "bg-[#166534]/10 text-[#166534]"
                          : "bg-slate-100 text-slate-500"
                      }`}
                    >
                      {structure.status}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex justify-end gap-1.5">
                      <button
                        type="button"
                        onClick={() => onEdit(structure)}
                        title="Edit structure"
                        className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-700"
                      >
                        <Edit size={15} />
                      </button>
                      <button
                        type="button"
                        onClick={() => onDelete(structure.id)}
                        title="Delete structure"
                        className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 transition-colors hover:bg-red-50 hover:text-red-600"
                      >
                        <Trash2 size={15} />
                      </button>
                    </div>
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

export default FeeStructuresTable;
