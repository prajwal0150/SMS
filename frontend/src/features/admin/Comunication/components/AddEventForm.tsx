import { useState } from "react";
import { CalendarPlus } from "lucide-react";

import Card from "../../dashboard/components/Card";

import type {
  NewEventInput,
  EventStatus,
} from "../types/communicationTypes";


const inputClass =
  "h-11 w-full rounded-lg border border-slate-200 bg-slate-50/70 px-4 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-[#166534] focus:bg-white focus:ring-4 focus:ring-[#166534]/10";


interface AddEventFormProps {
  saving: boolean;
  onSave: (input: NewEventInput) => Promise<boolean>;
}

const todayString = (): string =>
  new Date().toISOString().slice(0, 10);


const AddEventForm = ({
  saving,
  onSave,
}: AddEventFormProps) => {

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [date, setDate] = useState(todayString());
  const [time, setTime] = useState("");
  const [location, setLocation] = useState("");
  const [organizer, setOrganizer] = useState("");
  const [status, setStatus] =
    useState<EventStatus>("published");


  const handleSubmit = async (
    event: React.FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();

    const success = await onSave({
      title: title.trim(),
      description: description.trim() || undefined,
      date,
      time: time.trim() || undefined,
      location: location.trim() || undefined,
      organizer: organizer.trim() || undefined,
      status,
    });

    if (success) {
      setTitle("");
      setDescription("");
      setDate(todayString());
      setTime("");
      setLocation("");
      setOrganizer("");
      setStatus("published");
    }
  };


  return (
    <Card title="Add Event" subtitle="Schedule a new school event">
      <form onSubmit={handleSubmit}>
        <div className="grid gap-4 sm:grid-cols-2">
          <label htmlFor="eTitle" className="mb-2 block text-sm font-semibold text-slate-700">
              Event name
            </label>
            <input
              id="eTitle"
              type="text"
              value={title}
              onChange={(event) => setTitle(event.target.value)}
              required
              placeholder="e.g. Annual Sports Day"
              className={inputClass}
            />
          </div>

          <div>
            <label htmlFor="eOrganizer" className="mb-2 block text-sm font-semibold text-slate-700">
              Organizer
            </label>
            <input
              id="eOrganizer"
              type="text"
              value={organizer}
              onChange={(event) => setOrganizer(event.target.value)}
              placeholder="e.g. Sports Department"
              className={inputClass}
            />
          </div>

          <div className="sm:col-span-2">
            <label htmlFor="eDesc" className="mb-2 block text-sm font-semibold text-slate-700">
              Description
            </label>
            <textarea
              id="eDesc"
              value={description}
              onChange={(event) => setDescription(event.target.value)}
              rows={3}
              placeholder="Describe the event..."
              className="w-full rounded-lg border border-slate-200 bg-slate-50/70 px-4 py-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-[#166534] focus:bg-white focus:ring-4 focus:ring-[#166534]/10"
            />
          </div>

          <div>
            <label htmlFor="eDate" className="mb-2 block text-sm font-semibold text-slate-700">
              Date
            </label>
            <input
              id="eDate"
              type="date"
              value={date}
              onChange={(event) => setDate(event.target.value)}
              required
              className={inputClass}
            />
          </div>

          <div>
            <label htmlFor="eTime" className="mb-2 block text-sm font-semibold text-slate-700">
              Time
            </label>
            <input
              id="eTime"
              type="time"
              value={time}
              onChange={(event) => setTime(event.target.value)}
              className={inputClass}
            />
          </div>

          <div>
            <label htmlFor="eLocation" className="mb-2 block text-sm font-semibold text-slate-700">
              Location
            </label>
            <input
              id="eLocation"
              type="text"
              value={location}
              onChange={(event) => setLocation(event.target.value)}
              placeholder="e.g. School Ground"
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
              onChange={(event) => setStatus(event.target.value as EventStatus)}
              className={inputClass}
            >
              <option value="published">Published</option>
              <option value="scheduled">Scheduled</option>
              <option value="draft">Draft</option>
              <option value="completed">Completed</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>

        <button
          type="submit"
          disabled={saving}
          className="mt-6 flex h-11 items-center justify-center gap-2 rounded-lg bg-[#D4A017] px-5 text-sm font-semibold text-[#1F2937] transition-all duration-200 hover:-translate-y-0.5 hover:bg-[#B8860B] disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:translate-y-0"
        >
          {saving ? (
            <>
              <span className="h-4 w-4 animate-spin rounded-full border-2 border-[#1F2937]/30 border-t-[#1F2937]" />
              Saving...
            </>
          ) : (
            <>
              <CalendarPlus size={16} />
              Add Event
            </>
          )}
        </button>
      </form>
    </Card>
  );
};

export default AddEventForm;
