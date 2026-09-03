import { useState } from "react";
import { Megaphone } from "lucide-react";

import Card from "../../dashboard/components/Card";

import type {
  NewNoticeInput,
  NoticeCategory,
  NoticePriority,
  PublishStatus,
} from "../types/communicationTypes";


const inputClass =
  "h-11 w-full rounded-lg border border-slate-200 bg-slate-50/70 px-4 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-[#166534] focus:bg-white focus:ring-4 focus:ring-[#166534]/10";


interface AddNoticeFormProps {
  saving: boolean;
  onSave: (input: NewNoticeInput) => Promise<boolean>;
}

const todayString = (): string =>
  new Date().toISOString().slice(0, 10);


const AddNoticeForm = ({
  saving,
  onSave,
}: AddNoticeFormProps) => {

  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [category, setCategory] =
    useState<NoticeCategory>("General");
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
      category,
      date,
      priority,
      status,
    });

    if (success) {
      setTitle("");
      setBody("");
      setCategory("General");
      setDate(todayString());
      setPriority("normal");
      setStatus("published");
    }
  };


  return (
    <Card title="Add Notice" subtitle="Publish a new notice">
      <form onSubmit={handleSubmit}>
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label htmlFor="nTitle" className="mb-2 block text-sm font-semibold text-slate-700">
              Title
            </label>
            <input
              id="nTitle"
              type="text"
              value={title}
              onChange={(event) => setTitle(event.target.value)}
              required
              placeholder="e.g. Annual Day Celebration"
              className={inputClass}
            />
          </div>

          <div>
            <label htmlFor="nCategory" className="mb-2 block text-sm font-semibold text-slate-700">
              Category
            </label>
            <select
              id="nCategory"
              value={category}
              onChange={(event) => setCategory(event.target.value as NoticeCategory)}
              className={inputClass}
            >
              <option value="General">General</option>
              <option value="Academic">Academic</option>
              <option value="Event">Event</option>
              <option value="Staff">Staff</option>
            </select>
          </div>

          <div className="sm:col-span-2">
            <label htmlFor="nBody" className="mb-2 block text-sm font-semibold text-slate-700">
              Message
            </label>
            <textarea
              id="nBody"
              value={body}
              onChange={(event) => setBody(event.target.value)}
              required
              rows={4}
              placeholder="Write the notice message..."
              className="w-full rounded-lg border border-slate-200 bg-slate-50/70 px-4 py-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-[#166534] focus:bg-white focus:ring-4 focus:ring-[#166534]/10"
            />
          </div>

          <div>
            <label htmlFor="nDate" className="mb-2 block text-sm font-semibold text-slate-700">
              Date
            </label>
            <input
              id="nDate"
              type="date"
              value={date}
              onChange={(event) => setDate(event.target.value)}
              required
              className={inputClass}
            />
          </div>

          <div>
            <label htmlFor="nPriority" className="mb-2 block text-sm font-semibold text-slate-700">
              Priority
            </label>
            <select
              id="nPriority"
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
            <label htmlFor="nStatus" className="mb-2 block text-sm font-semibold text-slate-700">
              Status
            </label>
            <select
              id="nStatus"
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
          className="mt-6 flex h-11 items-center justify-center gap-2 rounded-lg bg-[#166534] px-5 text-sm font-semibold text-white transition-all duration-200 hover:-translate-y-0.5 hover:bg-[#14532D] disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:translate-y-0"
        >
          {saving ? (
            <>
              <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
              Saving...
            </>
          ) : (
            <>
              <Megaphone size={16} />
              Add Notice
            </>
          )}
        </button>
      </form>
    </Card>
  );
};

export default AddNoticeForm;