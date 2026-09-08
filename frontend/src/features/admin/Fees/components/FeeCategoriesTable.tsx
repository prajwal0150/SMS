import { Edit, Trash2 } from "lucide-react";

import Card from "../../dashboard/components/Card";
import DataState from "./DataState";

import type { FeeCategory } from "../types/feesTypes";


interface FeeCategoriesTableProps {
  categories: FeeCategory[];
  loading: boolean;
  error: string | null;
  onEdit: (category: FeeCategory) => void;
  onDelete: (id: string) => void;
  onReload: () => void;
}

const FeeCategoriesTable = ({
  categories,
  loading,
  error,
  onEdit,
  onDelete,
  onReload,
}: FeeCategoriesTableProps) => (
  <Card
    title="Fee Categories"
    subtitle={`${categories.length} categories configured`}
    className="overflow-hidden"
  >
    {loading || error || categories.length === 0 ? (
      <DataState
        loading={loading}
        error={error}
        onReload={onReload}
        message="No fee categories yet. Use 'Add Category' to create the first one."
      />
    ) : (
      <div className="overflow-x-auto">
        <table className="w-full min-w-[600px] border-collapse text-sm">
          <thead>
            <tr>
              <th className="border-b border-slate-200 bg-slate-50 px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                Category
              </th>
              <th className="border-b border-slate-200 bg-slate-50 px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                Code
              </th>
              <th className="border-b border-slate-200 bg-slate-50 px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                Description
              </th>
              <th className="border-b border-slate-200 bg-slate-50 px-4 py-3 text-center text-xs font-semibold uppercase tracking-wider text-slate-500">
                Mandatory
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
            {categories.map((category) => (
              <tr
                key={category.id}
                className="border-b border-slate-100 transition last:border-0 hover:bg-slate-50/60"
              >
                <td className="px-4 py-3 font-semibold text-slate-900">
                  {category.category_name}
                </td>
                <td className="px-4 py-3 text-slate-600">
                  {category.category_code ?? "—"}
                </td>
                <td className="px-4 py-3 text-slate-600">
                  {category.description ?? "—"}
                </td>
                <td className="px-4 py-3 text-center">
                  {category.is_mandatory ? "Yes" : "No"}
                </td>
                <td className="px-4 py-3">
                  <span
                    className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${
                      category.status === "active"
                        ? "bg-[#166534]/10 text-[#166534]"
                        : "bg-slate-100 text-slate-500"
                    }`}
                  >
                    {category.status}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <div className="flex justify-end gap-1.5">
                    <button
                      type="button"
                      onClick={() => onEdit(category)}
                      title="Edit category"
                      className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-700"
                    >
                      <Edit size={15} />
                    </button>
                    <button
                      type="button"
                      onClick={() => onDelete(category.id)}
                      title="Delete category"
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

export default FeeCategoriesTable;
