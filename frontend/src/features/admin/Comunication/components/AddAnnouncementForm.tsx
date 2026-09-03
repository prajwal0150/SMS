import { useState } from "react";
import { Send } from "lucide-react";

import Card from "../../dashboard/components/Card";

import type {
  NewAnnouncementInput,
  AnnouncementAudience,
  NoticePriority,
  PublishStatus,
} from "../types/communicationTypes";


const inputClass =
  "h-11 w-full rounded-lg border border-slate-200 bg-slate-50/70 px-4 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-[#166534] focus:bg-white focus:ring-4 focus:ring-[#166534]/10";


interface AddAnnouncementFormProps {
  saving: boolean;
  onSave: (input: NewAnnouncementInput) => Promise<boolean>;
}

const todayString = (): string =>
  new Date().toISOString().slice(0, 10);


const AddAnnouncementForm = ({
  saving,
  onSave,
}: AddAnnouncementFormProps) => {

  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [audience, setAudience] =
    useState<AnnouncementAudience>("All");
  const [date, setDate] = useState(todayString());
  const [priority, setPriority] =
    useState<NoticePriority>("normal");
  const [status, setStatus] =
    useState<PublishStatus>("published");


  const handleSubmit = async (
    event: React.FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();

    const success = await onSave({
      title: title.trim(),
      body: body.trim(),
      audience,
      date,
      priority,
      status,
    });

    if (success) {
      setTitle("");
      setBody("");
      setAudience("All");
      setDate(todayString());
      setPriority("normal");
      setStatus("published");
    }
  };


  return (
    <Card title="Add Announcement" subtitle="Share an announcement with the school community">
      <form onSubmit={handleSubmit}>
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label htmlFor="aTitle" className="mb-2 block text-sm font-semibold text-slate-700">
              Title
            </label>
            <input
              id="aTitle"
              type="text"
              value={title}
              onChange={(event) => setTitle(event.target.value)}
              required
              placeholder="e.g. New Library Timings"
              className={inputClass}
            />
          </div>

          <div>
            <label htmlFor="aAudience" className="mb-2 block text-sm font-semibold text-slate-700">
              Audience
            </label>
            <select
              id="aAudience"
              value={audience}
              onChange={(event) => setAudience(event.target.value as AnnouncementAudience)}
              className={inputClass}
            >
              <option value="All">All</option>
              <option value="Students">Students</option>
              <option value="Teachers">Teachers</option>
              <option value="Parents">Parents</option>
            </select>
          </div>

          <div className="sm:col-span-2">
            <label htmlFor="aBody" className="mb-2 block text-sm font-semibold text-slate-700">
              Message
            </label>
            <textarea
              id="aBody"
              value={body}
              onChange={(event) => setBody(event.target.value)}
              required
              rows={4}
              placeholder="Write the announcement message..."
              className="w-full rounded-lg border border-slate-200 bg-slate-50/70 px-4 py-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-[#166534] focus:bg-white focus:ring-4 focus:ring-[#166534]/10"
            />
          </div>

          <div>
            <label htmlFor="aDate" className="mb-2 block text-sm font-semibold text-slate-700">
              Date
            </label>
            <input
              id="aDate"
              type="date"
              value={date}
              onChange={(event) => setDate(event.target.value)}
              required
              className={inputClass}
            />
          </div>

          <div>
            <label htmlFor="aPriority" className="mb-2 block text-sm font-semibold text-slate-700">
              Priority
            </label>
            <select
              id="aPriority"
              value={priority}
              onChange={(event) => setPriority(event.target.value as NoticePriority)}
              className={inputClass}
            >
              <option value="low">Low</option>
              <option value="normal">Normal</option>
              <option value="high">High</option>
              <option value="urgent">Urgent</option>
            </select>
          </div>

          <div>
            <label htmlFor="aStatus" className="mb-2 block text-sm font-semibold text-slate-700">
              Status
            </label>
            <select
              id="aStatus"
              value={status}
              onChange={(event) => setStatus(event.target.value as PublishStatus)}
              className={inputClass}
            >
              <option value="published">Published</option>
              <option value="draft">Draft</option>
              <option value="scheduled">Scheduled</option>
              <option value="archived">Archived</option>
            </select>
          </div>
        </div>

        <button
          type="submit"
          disabled={saving}
          className="mt-6 flex h-11 items-center justify-center gap-2 rounded-lg bg-[#1E3A5F] px-5 text-sm font-semibold text-white transition-all duration-200 hover:-translate-y-0.5 hover:bg-[#162E4C] disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:translate-y-0"
        >
          {saving ? (
            <>
              <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
              Saving...
            </>
          ) : (
            <>
              <Send size={16} />
              Add Announcement
            </>
          )}
        </button>
      </form>
    </Card>
  );
};

export default AddAnnouncementForm;
