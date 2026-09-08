import { useState } from "react";
import { ArrowLeft, Save } from "lucide-react";

import Card from "../../dashboard/components/Card";

import type {
  FeeCategory,
  NewFeeCategoryInput,
} from "../types/feesTypes";


const inputClass =
  "h-11 w-full rounded-lg border border-slate-200 bg-slate-50/70 px-4 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-[#7C3AED] focus:bg-white focus:ring-4 focus:ring-[#7C3AED]/10";


interface AddFeeCategoryFormProps {
  saving: boolean;
  editing: FeeCategory | null;
  onSave: (input: NewFeeCategoryInput) => Promise<boolean>;
  onCancel: () => void;
}

const AddFeeCategoryForm = ({
  saving,
  editing,
  onSave,
  onCancel,
}: AddFeeCategoryFormProps) => {
  const isEdit = Boolean(editing);

  const [categoryName, setCategoryName] = useState(editing?.category_name ?? "");
  const [categoryCode, setCategoryCode] = useState(editing?.category_code ?? "");
  const [description, setDescription] = useState(editing?.description ?? "");
  const [isMandatory, setIsMandatory] = useState(editing?.is_mandatory ?? true);
  const [status, setStatus] = useState(editing?.status ?? "active");


  const handleSubmit = async (
    event: React.FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();

    const success = await onSave({
      category_name: categoryName.trim(),
      category_code: categoryCode.trim() || undefined,
      description: description.trim() || undefined,
      is_mandatory: isMandatory,
      status,
    });

    if (success) {
      setCategoryName("");
      setCategoryCode("");
      setDescription("");
      setIsMandatory(true);
      setStatus("active");
    }
  };


  return (
    <Card
      title={isEdit ? "Edit Fee Category" : "Add Fee Category"}
      subtitle={
        isEdit
          ? "Update category details"
          : "Create a new fee category (e.g. Tuition, Exam, Transport)"
      }
    >
      <div className="mb-4">
        <button
          type="button"
          onClick={onCancel}
          className="flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold text-slate-600 transition-colors hover:bg-slate-100"
        >
          <ArrowLeft size={14} />
          Back to Categories
        </button>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <div>
            <label
              htmlFor="fcName"
              className="mb-2 block text-sm font-semibold text-slate-700"
            >
              Category Name
            </label>
            <input
              id="fcName"
              type="text"
              value={categoryName}
              onChange={(e) => setCategoryName(e.target.value)}
              required
              placeholder="e.g. Tuition Fee"
              className={inputClass}
            />
          </div>

          <div>
            <label
              htmlFor="fcCode"
              className="mb-2 block text-sm font-semibold text-slate-700"
            >
              Code
            </label>
            <input
              id="fcCode"
              type="text"
              value={categoryCode}
              onChange={(e) => setCategoryCode(e.target.value)}
              placeholder="e.g. TF"
              className={inputClass}
            />
          </div>

          <div className="sm:col-span-2">
            <label
              htmlFor="fcDescription"
              className="mb-2 block text-sm font-semibold text-slate-700"
            >
              Description
            </label>
            <input
              id="fcDescription"
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Optional description of this fee"
              className={inputClass}
            />
          </div>

          <div className="flex items-end gap-6">
            <div className="flex items-center gap-2">
              <input
                id="fcMandatory"
                type="checkbox"
                checked={isMandatory}
                onChange={(e) => setIsMandatory(e.target.checked)}
                className="h-4 w-4 rounded border-slate-300 text-[#7C3AED] focus:ring-[#7C3AED]"
              />
              <label
                htmlFor="fcMandatory"
                className="text-sm font-medium text-slate-700"
              >
                Mandatory fee
              </label>
            </div>

            <div className="flex items-center gap-2">
              <input
                id="fcStatus"
                type="checkbox"
                checked={status === "active"}
                onChange={(e) =>
                  setStatus(e.target.checked ? "active" : "inactive")
                }
                className="h-4 w-4 rounded border-slate-300 text-[#7C3AED] focus:ring-[#7C3AED]"
              />
              <label
                htmlFor="fcStatus"
                className="text-sm font-medium text-slate-700"
              >
                Active
              </label>
            </div>
          </div>

          <div className="flex items-end">
            <select
              aria-label="status"
              value={status}
              onChange={(e) => setStatus(e.target.value as "active" | "inactive")}
              className={inputClass}
            >
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>
        </div>

        <button
          type="submit"
          disabled={saving}
          className="mt-6 flex h-11 items-center justify-center gap-2 rounded-lg bg-[#7C3AED] px-5 text-sm font-semibold text-white transition-all duration-200 hover:-translate-y-0.5 hover:bg-[#6D28D9] disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:translate-y-0"
        >
          {saving ? (
            <>
              <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
              Saving...
            </>
          ) : (
            <>
              <Save size={16} />
              {isEdit ? "Update Category" : "Create Category"}
            </>
          )}
        </button>
      </form>
    </Card>
  );
};

export default AddFeeCategoryForm;
