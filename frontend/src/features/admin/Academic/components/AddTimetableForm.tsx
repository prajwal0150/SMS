import { useEffect, useState } from "react";
import { CalendarClock } from "lucide-react";

import Card from "../../dashboard/components/Card";

import { fetchTeachers } from "../../Stfaff Managment/services/staffManagmentServices";

import type {
  DayOfWeek,
  NewTimetableEntryInput,
} from "../types/academicTypes";

import type {
  Teacher as StaffTeacher,
} from "../../Stfaff Managment/types/staffManagmentTypes";


const inputClass =
  "h-11 w-full rounded-lg border border-slate-200 bg-slate-50/70 px-4 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-[#166534] focus:bg-white focus:ring-4 focus:ring-[#166534]/10";


interface AddTimetableFormProps {
  saving: boolean;
  onSave: (input: NewTimetableEntryInput) => Promise<boolean>;
}

const DAYS: DayOfWeek[] = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
];

const AddTimetableForm = ({ saving, onSave }: AddTimetableFormProps) => {
  const [teachers, setTeachers] = useState<StaffTeacher[]>([]);
  const [teachersLoading, setTeachersLoading] = useState(true);
  const [teacherId, setTeacherId] = useState("");
  const [className, setClassName] = useState("");
  const [section, setSection] = useState("");
  const [day, setDay] = useState<DayOfWeek>("Monday");
  const [periodNumber, setPeriodNumber] = useState(1);
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [subject, setSubject] = useState("");
  const [room, setRoom] = useState("");


  // Load the real teacher list so the admin can pick
  // exactly who teaches this period.
  useEffect(() => {
    let cancelled = false;

    const load = async () => {
      try {
        const rows = await fetchTeachers();

        if (!cancelled) {
          setTeachers(rows);
        }
      } catch {
        if (!cancelled) {
          setTeachers([]);
        }
      } finally {
        if (!cancelled) {
          setTeachersLoading(false);
        }
      }
    };

    load();

    return () => {
      cancelled = true;
    };
  }, []);


  const handleSubmit = async (
    event: React.FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();

    if (!teacherId) {
      return;
    }

    const chosen = teachers.find(
      (teacher) => teacher.id === teacherId
    );

    const success = await onSave({
      class_name: className.trim(),
      section: section.trim() || undefined,
      day_of_week: day,
      period_number: periodNumber,
      start_time: startTime,
      end_time: endTime,
      subject: subject.trim(),
      teacher_id: teacherId,
      teacher_name: chosen
        ? `${chosen.first_name} ${chosen.last_name}`
        : undefined,
      room: room.trim() || undefined,
    });

    if (success) {
      setSubject("");
      setRoom("");
    }
  };

  return (
    <Card title="Add Timetable Entry" subtitle="Create a weekly period">
      <form onSubmit={handleSubmit}>
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label htmlFor="tClass" className="mb-2 block text-sm font-semibold text-slate-700">
              Class
            </label>
            <input
              id="tClass"
              type="text"
              value={className}
              onChange={(event) => setClassName(event.target.value)}
              required
              placeholder="e.g. Class 10"
              className={inputClass}
            />
          </div>

          <div>
            <label htmlFor="tSection" className="mb-2 block text-sm font-semibold text-slate-700">
              Section (optional)
            </label>
            <input
              id="tSection"
              type="text"
              value={section}
              onChange={(event) => setSection(event.target.value)}
              placeholder="e.g. A"
              className={inputClass}
            />
          </div>

          <div>
            <label htmlFor="tDay" className="mb-2 block text-sm font-semibold text-slate-700">
              Day
            </label>
            <select
              id="tDay"
              value={day}
              onChange={(event) => setDay(event.target.value as DayOfWeek)}
              className={inputClass}
            >
              {DAYS.map((d) => (
                <option key={d} value={d}>
                  {d}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="tPeriod" className="mb-2 block text-sm font-semibold text-slate-700">
              Period Number
            </label>
            <input
              id="tPeriod"
              type="number"
              min={1}
              value={periodNumber}
              onChange={(event) => setPeriodNumber(Number(event.target.value))}
              required
              className={inputClass}
            />
          </div>

          <div>
            <label htmlFor="tStart" className="mb-2 block text-sm font-semibold text-slate-700">
              Start Time
            </label>
            <input
              id="tStart"
              type="time"
              value={startTime}
              onChange={(event) => setStartTime(event.target.value)}
              required
              className={inputClass}
            />
          </div>

          <div>
            <label htmlFor="tEnd" className="mb-2 block text-sm font-semibold text-slate-700">
              End Time
            </label>
            <input
              id="tEnd"
              type="time"
              value={endTime}
              onChange={(event) => setEndTime(event.target.value)}
              required
              className={inputClass}
            />
          </div>

          <div>
            <label htmlFor="tSubject" className="mb-2 block text-sm font-semibold text-slate-700">
              Subject
            </label>
            <input
              id="tSubject"
              type="text"
              value={subject}
              onChange={(event) => setSubject(event.target.value)}
              required
              placeholder="e.g. Mathematics"
              className={inputClass}
            />
          </div>

          <div>
            <label htmlFor="tTeacher" className="mb-2 block text-sm font-semibold text-slate-700">
              Teacher
            </label>
            <select
              id="tTeacher"
              value={teacherId}
              onChange={(event) =>
                setTeacherId(event.target.value)
              }
              required
              disabled={teachersLoading}
              className={inputClass}
            >
              <option value="">
                {teachersLoading
                  ? "Loading teachers..."
                  : "Select teacher"}
              </option>
              {teachers.map((teacher) => (
                <option key={teacher.id} value={teacher.id}>
                  {teacher.first_name} {teacher.last_name}
                </option>
              ))}
            </select>
            <p className="mt-1.5 text-xs text-slate-500">
              This teacher will see the period on their Timetable page.
            </p>
          </div>

          <div>
            <label htmlFor="tRoom" className="mb-2 block text-sm font-semibold text-slate-700">
              Room (optional)
            </label>
            <input
              id="tRoom"
              type="text"
              value={room}
              onChange={(event) => setRoom(event.target.value)}
              placeholder="e.g. Room 101"
              className={inputClass}
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
              <CalendarClock size={16} />
              Add Timetable Entry
            </>
          )}
        </button>
      </form>
    </Card>
  );
};

export default AddTimetableForm;