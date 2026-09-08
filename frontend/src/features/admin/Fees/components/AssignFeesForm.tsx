import { useState } from "react";
import { Calendar } from "lucide-react";

import Card from "../../dashboard/components/Card";
import { useSchoolLookups } from "../../School/hooks/useSchoolLookups";

import type {
  FeeStructure,
  GenerateStudentFeesInput,
} from "../types/feesTypes";


const inputClass =
  "h-11 w-full rounded-lg border border-slate-200 bg-slate-50/70 px-4 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-[#7C3AED] focus:bg-white focus:ring-4 focus:ring-[#7C3AED]/10";


interface AssignFeesFormProps {
  structures: FeeStructure[];
  saving: boolean;
  onSave: (input: GenerateStudentFeesInput) => Promise<boolean>;
  onCancel: () => void;
}

const todayString = (): string =>
  new Date().toISOString().slice(0, 10);


const AssignFeesForm = ({
  structures,
  saving,
  onSave,
  onCancel,
}: AssignFeesFormProps) => {
  const [structureId, setStructureId] = useState("");
  const [className, setClassName] = useState("");
  const [section, setSection] = useState("");
  const [academicYear, setAcademicYear] = useState("2026-2027");
  const [dueDate, setDueDate] = useState(todayString());

  const { classes } = useSchoolLookups();


  const handleSubmit = async (
    event: React.FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();

    const success = await onSave({
      fee_structure_id: structureId,
      class_name: className.trim(),
      section: section.trim() || undefined,
      academic_year: academicYear.trim(),
      due_date: dueDate,
    });

    if (success) {
      setStructureId("");
      setClassName("");
      setSection("");
      setAcademicYear("2026-2027");
      setDueDate(todayString());
    }
  };


  return (
    <Card
      title="Assign Fees to Students"
      subtitle="Generate fee records for every student in a class / section from an existing fee structure."
    >
      <div className="mb-4">
        <button
          type="button"
          onClick={onCancel}
          className="flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold text-slate-600 transition-colors hover:bg-slate-100"
        >
          ← Back to Student Fees
        </button>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <div>
            <label
              htmlFor="afStructure"
              className="mb-2 block text-sm font-semibold text-slate-700"
            >
              Fee Structure
            </label>
            <select
              id="afStructure"
              value={structureId}
              onChange={(e) => setStructureId(e.target.value)}
              required
              className={inputClass}
            >
              <option value="">Select a structure</option>
              {structures.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.fee_categories?.category_name ?? s.category_id}
                  {s.class_name} — NPR {s.amount}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label
              htmlFor="afClass"
              className="mb-2 block text-sm font-semibold text-slate-700"
            >
              Class
            </label>
            <select
              id="afClass"
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
              htmlFor="afSection"
              className="mb-2 block text-sm font-semibold text-slate-700"
            >
              Section
            </label>
            <input
              id="afSection"
              type="text"
              value={section}
              onChange={(e) => setSection(e.target.value)}
              placeholder="Leave blank for all sections"
              className={inputClass}
            />
          </div>

          <div>
            <label
              htmlFor="afAcademicYear"
              className="mb-2 block text-sm font-semibold text-slate-700"
            >
              Academic Year
            </label>
            <input
              id="afAcademicYear"
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
              htmlFor="afDueDate"
              className="mb-2 block text-sm font-semibold text-slate-700"
            >
              Due Date
            </label>
            <input
              id="afDueDate"
              type="date"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              required
              className={inputClass}
            />
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
              Generating...
            </>
          ) : (
            <>
              <Calendar size={16} />
              Generate Fees
            </>
          )}
        </button>
      </form>
    </Card>
  );
};

export default AssignFeesForm;
