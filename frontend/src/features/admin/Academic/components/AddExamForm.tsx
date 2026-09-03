import { useState } from "react";
import { ClipboardList } from "lucide-react";

import Card from "../../dashboard/components/Card";

import type {
  ExamStatus,
  ExamType,
  NewExamInput,
} from "../types/academicTypes";


const inputClass =
  "h-11 w-full rounded-lg border border-slate-200 bg-slate-50/70 px-4 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-[#166534] focus:bg-white focus:ring-4 focus:ring-[#166534]/10";

const textareaClass =
  "w-full rounded-lg border border-slate-200 bg-slate-50/70 px-4 py-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-[#166534] focus:bg-white focus:ring-4 focus:ring-[#166534]/10";


interface AddExamFormProps {
  saving: boolean;
  onSave: (input: NewExamInput) => Promise<boolean>;
}

const AddExamForm = ({ saving, onSave }: AddExamFormProps) => {
  const [name, setName] = useState("");
  const [examType, setExamType] = useState<ExamType>("Term Exam");
  const [className, setClassName] = useState("");
  const [section, setSection] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [status, setStatus] = useState<ExamStatus>("upcoming");
  const [description, setDescription] = useState("");

  const handleSubmit = async (
    event: React.FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();

    const success = await onSave({
      name: name.trim(),
      exam_type: examType,
      class_name: className.trim(),
      section: section.trim() || undefined,
      start_date: startDate,
      end_date: endDate || undefined,
      status,
      description: description.trim() || undefined,
    });

    if (success) {
      setName("");
      setExamType("Term Exam");
      setClassName("");
      setSection("");
      setStartDate("");
      setEndDate("");
      setStatus("upcoming");
      setDescription("");
    }
  };

  return (
    <Card title="Add Exam" subtitle="Schedule a new exam">
      <form onSubmit={handleSubmit}>
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label htmlFor="eName" className="mb-2 block text-sm font-semibold text-slate-700">
              Exam Name
            </label>
            <input
              id="eName"
              type="text"
              value={name}
              onChange={(event) => setName(event.target.value)}
              required
              placeholder="e.g. First Term Examination"
              className={inputClass}
            />
          </div>

          <div>
            <label htmlFor="eType" className="mb-2 block text-sm font-semibold text-slate-700">
              Exam Type
            </label>
            <select
              id="eType"
              value={examType}
              onChange={(event) => setExamType(event.target.value as ExamType)}
              className={inputClass}
            >
              <option value="Unit Test">Unit Test</option>
              <option value="Term Exam">Term Exam</option>
              <option value="Mid Term">Mid Term</option>
              <option value="Half Yearly">Half Yearly</option>
              <option value="Annual">Annual</option>
              <option value="Final">Final</option>
              <option value="Practical">Practical</option>
              <option value="Other">Other</option>
            </select>
          </div>

          <div>
            <label htmlFor="eClass" className="mb-2 block text-sm font-semibold text-slate-700">
              Class
            </label>
            <input
              id="eClass"
              type="text"
              value={className}
              onChange={(event) => setClassName(event.target.value)}
              required
              placeholder="e.g. Class 10"
              className={inputClass}
            />
          </div>

          <div>
            <label htmlFor="eSection" className="mb-2 block text-sm font-semibold text-slate-700">
              Section (optional)
            </label>
            <input
              id="eSection"
              type="text"
              value={section}
              onChange={(event) => setSection(event.target.value)}
              placeholder="e.g. A"
              className={inputClass}
            />
          </div>

          <div>
            <label htmlFor="eStart" className="mb-2 block text-sm font-semibold text-slate-700">
              Start Date
            </label>
            <input
              id="eStart"
              type="date"
              value={startDate}
              onChange={(event) => setStartDate(event.target.value)}
              required
              className={inputClass}
            />
          </div>

          <div>
            <label htmlFor="eEnd" className="mb-2 block text-sm font-semibold text-slate-700">
              End Date (optional)
            </label>
            <input
              id="eEnd"
              type="date"
              value={endDate}
              onChange={(event) => setEndDate(event.target.value)}
              className={inputClass}
            />
          </div>

          <div>
            <label htmlFor="eStatus" className="mb-2 block text-sm font-semibold text-slate-700">
              Status
            </label>
            <select
              id="eStatus"
              value={status}
              onChange={(event) => setStatus(event.target.value as ExamStatus)}
              className={inputClass}
            >
              <option value="upcoming">Upcoming</option>
              <option value="draft">Draft</option>
              <option value="ongoing">Ongoing</option>
              <option value="completed">Completed</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>

          <div className="sm:col-span-2">
            <label htmlFor="eDesc" className="mb-2 block text-sm font-semibold text-slate-700">
              Description (optional)
            </label>
            <textarea
              id="eDesc"
              value={description}
              onChange={(event) => setDescription(event.target.value)}
              rows={3}
              placeholder="Short description of the exam..."
              className={textareaClass}
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={saving}
          className="mt-6 flex h-11 items-center justify-center gap-2 rounded-lg bg-[#166534] px-5 text-sm font-semibold text-white transition-all duration-200 hover:-translate-y-0.5 hover:bg-[#14532D] disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:translate-y-0"
        >
          {saving ? (
            <>
              <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
              Saving...
            </>
          ) : (
            <>
              <ClipboardList size={16} />
              Add Exam
            </>
          )}
        </button>
      </form>
    </Card>
  );
};

export default AddExamForm;