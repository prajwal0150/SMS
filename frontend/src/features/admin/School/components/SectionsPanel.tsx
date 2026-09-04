import { useState } from "react";
import { ClipboardList, Plus, Trash2 } from "lucide-react";

import Card from "../../dashboard/components/Card";
import DataState from "./DataState";

import type { ClassSection, NewSectionInput } from "../types/schoolTypes";


const inputClass =
  "h-11 w-full rounded-lg border border-slate-200 bg-slate-50/70 px-4 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-[#166534] focus:bg-white focus:ring-4 focus:ring-[#166534]/10";


interface SectionsPanelProps {
  classId: string;
  className: string;
  sections: ClassSection[];
  loading: boolean;
  saving: boolean;
  error: string | null;
  onAdd: (input: NewSectionInput) => Promise<boolean>;
  onDelete: (id: string) => void;
  onReload: () => void;
}

const SectionsPanel = ({
  classId,
  className,
  sections,
  loading,
  saving,
  error,
  onAdd,
  onDelete,
  onReload,
}: SectionsPanelProps) => {
  const [sectionName, setSectionName] = useState("");
  const [capacity, setCapacity] = useState("");


  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const success = await onAdd({
      class_id: classId,
      section_name: sectionName.trim(),
      capacity: capacity.trim() ? Number(capacity) : undefined,
    });

    if (success) {
      setSectionName("");
      setCapacity("");
    }
  };


  return (
    <Card
      title="Sections"
      subtitle={`${sections.length} section${sections.length === 1 ? "" : "s"} in ${className}`}
      action={
        !loading && !error && sections.length > 0 ? (
          <span className="rounded-full bg-[#1E3A5F]/10 px-3 py-1 text-xs font-semibold text-[#1E3A5F]">
            {sections.length} Total
          </span>
        ) : undefined
     }
      className="h-full overflow-hidden"
    >
      <form
        onSubmit={handleSubmit}
        className="mb-5 grid gap-4 rounded-lg border border-slate-200 bg-slate-50/60 p-4 sm:grid-cols-2"
      >
        <div>
          <label htmlFor="sName" className="mb-2 block text-sm font-semibold text-slate-700">
            Section Name
          </label>
          <input
            id="sName"
            type="text"
            value={sectionName}
            onChange={(event) => setSectionName(event.target.value)}
            required
            placeholder="e.g. A"
            className={inputClass}
          />
        </div>

        <div>
          <label htmlFor="sCapacity" className="mb-2 block text-sm font-semibold text-slate-700">
            Capacity
          </label>
          <input
            id="sCapacity"
            type="number"
            min={1}
            value={capacity}
            onChange={(event) => setCapacity(event.target.value)}
            placeholder="e.g. 50"
            className={inputClass}
          />
        </div>

        <div className="sm:col-span-2">
          <button
            type="submit"
            disabled={saving}
            className="flex h-11 w-full items-center justify-center gap-2 rounded-lg bg-[#1E3A5F] px-5 text-sm font-semibold text-white transition-all duration-200 hover:-translate-y-0.5 hover:bg-[#162B45] disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:translate-y-0"
          >
            {saving ? (
              <>
                <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                Saving...
              </>
            ) : (
              <>
                <Plus size={16} />
                Add Section
              </>
            )}
          </button>
        </div>
      </form>

      {loading ? (
        <DataState loading onReload={onReload} />
      ) : error ? (
        <DataState error={error} onReload={onReload} />
      ) : sections.length === 0 ? (
        <DataState message="No sections yet. Add the first section for this class." />
      ) : (
        <div className="flex flex-wrap gap-2">
          {sections.map((section) => (
            <div
              key={section.id}
              className="group inline-flex items-center gap-1 rounded-lg border border-slate-200 bg-slate-50/70 px-3 py-2"
            >
              <ClipboardList size={14} className="text-slate-400" />
              <span className="text-sm font-semibold text-slate-700">
                {section.section_name}
              </span>
              <span className="rounded-full bg-white px-2 py-0.5 text-xs font-medium text-slate-500">
                {section.capacity} seats
              </span>
              <button
                type="button"
                onClick={() => onDelete(section.id)}
                title="Delete section"
                className="ml-1 flex h-7 w-7 items-center justify-center rounded-md text-slate-400 transition-colors hover:bg-red-50 hover:text-red-600"
              >
                <Trash2 size={14} />
              </button>
            </div>
          ))}
        </div>
      )}
    </Card>
  );
};

export default SectionsPanel;