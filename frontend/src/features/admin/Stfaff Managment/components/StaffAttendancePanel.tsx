import { useState } from "react";
import { CalendarCheck } from "lucide-react";

import Card from "../../dashboard/components/Card";
import DataState from "./DataState";

import type {
  Teacher,
  StaffAttendance,
  AttendanceStatus,
  NewAttendanceInput,
} from "../types/staffManagmentTypes";


const inputClass =
  "h-11 w-full rounded-lg border border-slate-200 bg-slate-50/70 px-4 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-[#166534] focus:bg-white focus:ring-4 focus:ring-[#166534]/10";


const STATUS_STYLES: Record<AttendanceStatus, string> = {
  present: "bg-[#166534]/10 text-[#166534]",
  absent: "bg-red-50 text-red-600",
  late: "bg-[#D4A017]/15 text-[#8A6A0D]",
  leave: "bg-slate-100 text-slate-500",
};


interface StaffAttendancePanelProps {
  teachers: Teacher[];
  attendance: StaffAttendance[];
  saving: boolean;
  onMark: (input: NewAttendanceInput) => Promise<boolean>;
  onReload: () => void;
}

const todayString = (): string =>
  new Date().toISOString().slice(0, 10);

const teacherName = (
  teachers: Teacher[],
  id: string
): string => {
  const teacher = teachers.find((item) => item.id === id);

  return teacher
    ? `${teacher.first_name} ${teacher.last_name}`
    : "Unknown teacher";
};


const StaffAttendancePanel = ({
  teachers,
  attendance,
  saving,
  onMark,
  onReload,
}: StaffAttendancePanelProps) => {

  const [teacherId, setTeacherId] = useState("");
  const [date, setDate] = useState(todayString());
  const [status, setStatus] =
    useState<AttendanceStatus>("present");


  const handleSubmit = async (
    event: React.FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();

    if (!teacherId) {
      return;
    }

    const success = await onMark({
      teacher_id: teacherId,
      date,
      status,
    });

    if (success) {
      setTeacherId("");
    }
  };


  return (
    <Card
      title="Staff Attendance"
      subtitle="Mark and review daily staff attendance"
      className="overflow-hidden"
    >
      {/* Attendance form */}
      <form
        onSubmit={handleSubmit}
        className="mb-6 grid gap-4 rounded-lg border border-slate-200 bg-slate-50/60 p-4 sm:grid-cols-2 sm:p-5 lg:grid-cols-4"
      >
        <div>
          <label
            htmlFor="attTeacher"
            className="mb-2 block text-sm font-semibold text-slate-700"
          >
            Teacher
          </label>
          <select
            id="attTeacher"
            value={teacherId}
            onChange={(event) =>
              setTeacherId(event.target.value)
            }
            required
            className={inputClass}
          >
            <option value="">Select teacher</option>
            {teachers.map((teacher) => (
              <option key={teacher.id} value={teacher.id}>
                {teacher.first_name} {teacher.last_name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label
            htmlFor="attDate"
            className="mb-2 block text-sm font-semibold text-slate-700"
          >
            Date
          </label>
          <input
            id="attDate"
            type="date"
            value={date}
            onChange={(event) =>
              setDate(event.target.value)
            }
            className={inputClass}
          />
        </div>

        <div>
          <label
            htmlFor="attStatus"
            className="mb-2 block text-sm font-semibold text-slate-700"
          >
            Status
          </label>
          <select
            id="attStatus"
            value={status}
            onChange={(event) =>
              setStatus(
                event.target.value as AttendanceStatus
              )
            }
            className={inputClass}
          >
            <option value="present">Present</option>
            <option value="absent">Absent</option>
            <option value="late">Late</option>
            <option value="leave">Leave</option>
          </select>
        </div>

        <div className="flex items-end">
          <button
            type="submit"
            disabled={saving}
            className="flex h-11 w-full items-center justify-center gap-2 rounded-lg bg-[#166534] px-4 text-sm font-semibold text-white transition-all duration-200 hover:-translate-y-0.5 hover:bg-[#14532D] disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:translate-y-0"
          >
            <CalendarCheck size={16} />
            {saving ? "Saving..." : "Mark"}
          </button>
        </div>
      </form>

      {/* Attendance list */}
      {attendance.length === 0 ? (
        <DataState
          onReload={onReload}
          message="No attendance records yet. Mark a teacher above."
        />
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full min-w-[520px] border-collapse text-sm">
            <thead>
              <tr>
                <th className="border-b border-slate-200 bg-slate-50 px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                  Date
                </th>
                <th className="border-b border-slate-200 bg-slate-50 px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                  Teacher
                </th>
                <th className="border-b border-slate-200 bg-slate-50 px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                  Status
                </th>
              </tr>
            </thead>
            <tbody>
              {attendance.map((record) => (
                <tr
                  key={record.id}
                  className="border-b border-slate-100 last:border-0"
                >
                  <td className="px-4 py-3 text-slate-600">
                    {record.date}
                  </td>
                  <td className="px-4 py-3 font-semibold text-slate-900">
                    {teacherName(teachers, record.teacher_id)}
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${STATUS_STYLES[record.status]}`}
                    >
                      {record.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </Card>
  );
};

export default StaffAttendancePanel;