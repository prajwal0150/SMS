import { useState } from "react";
import { ArrowLeft, Save } from "lucide-react";

import Card from "../../dashboard/components/Card";
import { useSchoolLookups } from "../../School/hooks/useSchoolLookups";

import type {
  FeeCategory,
  FeeStructure,
  NewFeeStructureInput,
} from "../types/feesTypes";


const inputClass =
  "h-11 w-full rounded-lg border border-slate-200 bg-slate-50/70 px-4 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-[#7C3AED] focus:bg-white focus:ring-4 focus:ring-[#7C3AED]/10";


interface AddFeeStructureFormProps {
  categories: FeeCategory[];
  saving: boolean;
  editing: FeeStructure | null;
  onSave: (input: NewFeeStructureInput) => Promise<boolean>;
  onCancel: () => void;
}

const AddFeeStructureForm = ({
  categories,
  saving,
  editing,
  onSave,
  onCancel,
}: AddFeeStructureFormProps) => {
  const isEdit = Boolean(editing);

  const [categoryId, setCategoryId] = useState(editing?.category_id ?? "");
  const [className, setClassName] = useState(editing?.class_name ?? "");
  const [section, setSection] = useState(editing?.section ?? "");
  const [academicYear, setAcademicYear] = useState(
    editing?.academic_year ?? "2026-2027"
  );
  const [amount, setAmount] = useState(
    editing?.amount ? String(editing.amount) : ""
  );
  const [isMandatory, setIsMandatory] = useState(
    editing?.is_mandatory ?? true
  );
  const [dueDay, setDueDay] = useState(
    editing?.due_day ? String(editing.due_day) : ""
  );
  const [status, setStatus] = useState(editing?.status ?? "active");

  const { classes } = useSchoolLookups();


  const handleSubmit = async (
    event: React.FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();

    const success = await onSave({
      category_id: categoryId,
      class_name: className.trim(),
      section: section.trim() || undefined,
      academic_year: academicYear.trim(),
      amount: Number(amount),
      is_mandatory: isMandatory,
      due_day: dueDay ? Number(dueDay) : undefined,
      status,
    });

    if (success) {
      setCategoryId("");
      setClassName("");
      setSection("");
      setAcademicYear("2026-2027");
      setAmount("");
      setIsMandatory(true);
      setDueDay("");
      setStatus("active");
    }
  };


  return (
    <Card
      title={isEdit ? "Edit Fee Structure" : "Add Fee Structure"}
      subtitle={
        isEdit
          ? "Update structure details"
          : "Define a fee amount rule for a class / category"
      }
    >
      <div className="mb-4">
        <button
          type="button"
          onClick={onCancel}
          className="flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold text-slate-600 transition-colors hover:bg-slate-100"
        >
          <ArrowLeft size={14} />
          Back to Structures
        </button>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <div>
            <label
              htmlFor="fsCategory"
              className="mb-2 block text-sm font-semibold text-slate-700"
            >
              Fee Category
            </label>
            <select
              id="fsCategory"
              value={categoryId}
              onChange={(e) => setCategoryId(e.target.value)}
              required
              className={inputClass}
            >
              <option value="">Select category</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.category_name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label
              htmlFor="fsClass"
              className="mb-2 block text-sm font-semibold text-slate-700"
            >
              Class
            </label>
            <select
              id="fsClass"
              value={className}
              onChange={(e) => setClassName(e.target.value)}
              required
              className={inputClass}
            >
              <option value="">Select class</option>
              {classes.map((cls) => (
                <option key={cls.id} value={cls.class_name}>
                  {cls.class_name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label
              htmlFor="fsSection"
              className="mb-2 block text-sm font-semibold text-slate-700"
            >
              Section
            </label>
            <input
              id="fsSection"
              type="text"
              value={section}
              onChange={(e) => setSection(e.target.value)}
              placeholder="Leave blank for all sections"
              className={inputClass}
            />
          </div>

          <div>
            <label
              htmlFor="fsAcademicYear"
              className="mb-2 block text-sm font-semibold text-slate-700"
            >
              Academic Year
            </label>
            <input
              id="fsAcademicYear"
              type="text"
              value={academicYear}
              onChange={(e) => setAcademicYear(e.target.value)}
              required
              placeholder="e.g. 2026-2027"
              className={inputClass}
            />
          </div>

          <div>
            <label
              htmlFor="fsAmount"
              className="mb-2 block text-sm font-semibold text-slate-700"
            >
              Amount (NPR)
            </label>
            <input
              id="fsAmount"
              type="number"
              min="0"
              step="0.01"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              required
              placeholder="e.g. 5000"
              className={inputClass}
            />
          </div>

          <div>
            <label
              htmlFor="fsDueDay"
              className="mb-2 block text-sm font-semibold text-slate-700"
            >
              Due Day
            </label>
            <input
              id="fsDueDay"
              type="number"
              min="1"
              max="31"
              value={dueDay}
              onChange={(e) => setDueDay(e.target.value)}
              placeholder="1-31"
              className={inputClass}
            />
          </div>

          <div className="flex items-end gap-6">
            <div className="flex items-center gap-2">
              <input
                id="fsMandatory"
                type="checkbox"
                checked={isMandatory}
                onChange={(e) => setIsMandatory(e.target.checked)}
                className="h-4 w-4 rounded border-slate-300 text-[#7C3AED] focus:ring-[#7C3AED]"
              />
              <label
                htmlFor="fsMandatory"
                className="text-sm font-medium text-slate-700"
              >
                Mandatory fee
              </label>
            </div>

            <select
              aria-label="status"
              value={status}
              onChange={(e) =>
                setStatus(e.target.value as "active" | "inactive")
              }
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
              {isEdit ? "Update Structure" : "Create Structure"}
            </>
          )}
        </button>
      </form>
    </Card>
  );
};

export default AddFeeStructureForm;
