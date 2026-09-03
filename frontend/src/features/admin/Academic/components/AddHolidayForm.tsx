import { useState } from "react";
import { Sun } from "lucide-react";

import Card from "../../dashboard/components/Card";

import type {
  HolidayAppliesTo,
  HolidayStatus,
  HolidayType,
  NewHolidayInput,
} from "../types/academicTypes";


const inputClass =
  "h-11 w-full rounded-lg border border-slate-200 bg-slate-50/70 px-4 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-[#166534] focus:bg-white focus:ring-4 focus:ring-[#166534]/10";

const textareaClass =
  "w-full rounded-lg border border-slate-200 bg-slate-50/70 px-4 py-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-[#166534] focus:bg-white focus:ring-4 focus:ring-[#166534]/10";


interface AddHolidayFormProps {
  saving: boolean;
  onSave: (input: NewHolidayInput) => Promise<boolean>;
}

const AddHolidayForm = ({ saving, onSave }: AddHolidayFormProps) => {
  const [name, setName] = useState("");
  const [holidayType, setHolidayType] = useState<HolidayType>("Holiday");
  const [appliesTo, setAppliesTo] = useState<HolidayAppliesTo>("Everyone");
  const [occasion, setOccasion] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [status, setStatus] = useState<HolidayStatus>("upcoming");
  const [description, setDescription] = useState("");

  const handleSubmit = async (
    event: React.FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();

    const success = await onSave({
      name: name.trim(),
      holiday_type: holidayType,
      applies_to: appliesTo,
      occasion: occasion.trim() || undefined,
      start_date: startDate,
      end_date: endDate || undefined,
      status,
      description: description.trim() || undefined,
    });

    if (success) {
      setName("");
      setHolidayType("Holiday");
      setAppliesTo("Everyone");
      setOccasion("");
      setStartDate("");
      setEndDate("");
      setStatus("upcoming");
      setDescription("");
    }
  };

  return (
    <Card title="Add Holiday" subtitle="Add a holiday or vacation to the calendar">
      <form onSubmit={handleSubmit}>
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label htmlFor="hName" className="mb-2 block text-sm font-semibold text-slate-700">
              Name
            </label>
            <input
              id="hName"
              type="text"
              value={name}
              onChange={(event) => setName(event.target.value)}
              required
              placeholder="e.g. Summer Vacation"
              className={inputClass}
            />
          </div>

          <div>
            <label htmlFor="hType" className="mb-2 block text-sm font-semibold text-slate-700">
              Type
            </label>
            <select
              id="hType"
              value={holidayType}
              onChange={(event) => setHolidayType(event.target.value as HolidayType)}
              className={inputClass}
            >
              <option value="Holiday">Holiday</option>
              <option value="Vacation">Vacation</option>
              <option value="Festival">Festival</option>
              <option value="National">National</option>
              <option value="School Event">School Event</option>
              <option value="Other">Other</option>
            </select>
          </div>

          <div>
            <label htmlFor="hApplies" className="mb-2 block text-sm font-semibold text-slate-700">
              Applies To
            </label>
            <select
              id="hApplies"
              value={appliesTo}
              onChange={(event) => setAppliesTo(event.target.value as HolidayAppliesTo)}
              className={inputClass}
            >
              <option value="Everyone">Everyone</option>
              <option value="Students">Students</option>
              <option value="Teachers">Teachers</option>
              <option value="Staff">Staff</option>
            </select>
          </div>

          <div>
            <label htmlFor="hOccasion" className="mb-2 block text-sm font-semibold text-slate-700">
              Occasion (optional)
            </label>
            <input
              id="hOccasion"
              type="text"
              value={occasion}
              onChange={(event) => setOccasion(event.target.value)}
              placeholder="e.g. Independence Day"
              className={inputClass}
            />
          </div>

          <div>
            <label htmlFor="hStart" className="mb-2 block text-sm font-semibold text-slate-700">
              Start Date
            </label>
            <input
              id="hStart"
              type="date"
              value={startDate}
              onChange={(event) => setStartDate(event.target.value)}
              required
              className={inputClass}
            />
          </div>

          <div>
            <label htmlFor="hEnd" className="mb-2 block text-sm font-semibold text-slate-700">
              End Date (optional)
            </label>
            <input
              id="hEnd"
              type="date"
              value={endDate}
              onChange={(event) => setEndDate(event.target.value)}
              className={inputClass}
            />
          </div>

          <div>
            <label htmlFor="hStatus" className="mb-2 block text-sm font-semibold text-slate-700">
              Status
            </label>
            <select
              id="hStatus"
              value={status}
              onChange={(event) => setStatus(event.target.value as HolidayStatus)}
              className={inputClass}
            >
              <option value="upcoming">Upcoming</option>
              <option value="ongoing">Ongoing</option>
              <option value="completed">Completed</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>

          <div className="sm:col-span-2">
            <label htmlFor="hDesc" className="mb-2 block text-sm font-semibold text-slate-700">
              Description (optional)
            </label>
            <textarea
              id="hDesc"
              value={description}
              onChange={(event) => setDescription(event.target.value)}
              rows={3}
              placeholder="Short description of the holiday..."
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
              <Sun size={16} />
              Add Holiday
            </>
          )}
        </button>
      </form>
    </Card>
  );
};

export default AddHolidayForm;