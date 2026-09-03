import { useMemo, useState } from "react";
import toast from "react-hot-toast";
import { UserCheck } from "lucide-react";

import PageHeader from "../components/PageHeader";
import Card from "../components/Card";

import type {
  StudentAttendance,
  AttendanceStatus,
} from "../types/teacherTypes";

import { teacherClasses, classStudents } from "../utils/mockData";


const todayString = (): string =>
  new Date().toISOString().slice(0, 10);


const inputClass =
  "h-11 w-full rounded-lg border border-slate-200 bg-slate-50/70 px-4 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-indigo-500 focus:bg-white focus:ring-4 focus:ring-indigo-500/10";


const TeacherAttendancePage = () => {
  const [selectedClass, setSelectedClass] = useState(
    teacherClasses[0]?.name ?? ""
  );

  const [selectedSubject, setSelectedSubject] = useState(
    ""
  );

  const [date, setDate] = useState(todayString());

  const [students, setStudents] =
    useState<StudentAttendance[] | null>(null);

  const [loadedFor, setLoadedFor] = useState("");


  const subjects = useMemo(
    () =>
      teacherClasses
        .filter((item) => item.name === selectedClass)
        .map((item) => item.subject),
    [selectedClass]
  );


  const handleClassChange = (value: string) => {
    setSelectedClass(value);

    const subject =
      teacherClasses.find(
        (item) => item.name === value
      )?.subject ?? "";

    setSelectedSubject(subject);
  };


  const handleLoadStudents = () => {
    if (!selectedClass) {
      toast.error("Please select a class first.");
      return;
    }

    const subject =
      teacherClasses.find(
        (item) => item.name === selectedClass
      )?.subject ?? "";

    setSelectedSubject(subject);

    const list = classStudents[selectedClass] ?? [];

    setStudents(list.map((student) => ({ ...student })));
    setLoadedFor(selectedClass);

    toast.success(
      `${list.length} students loaded for ${selectedClass}`
    );
  };


  const setStatus = (
    id: string,
    status: AttendanceStatus
  ) => {
    setStudents((prev) =>
      prev === null
        ? prev
        : prev.map((student) =>
            student.id === id
              ? { ...student, status }
              : student
          )
    );
  };


  const handleMarkAllPresent = () => {
    setStudents((prev) =>
      prev === null
        ? prev
        : prev.map((student) => ({
            ...student,
            status: "Present" as AttendanceStatus,
          }))
    );
  };


  const handleSave = () => {
    if (!students) {
      toast.error("Load students first.");
      return;
    }

    const present = students.filter(
      (student) => student.status === "Present"
    ).length;

    const absent = students.length - present;

    toast.success(
      `Attendance saved for ${loadedFor} on ${date} — ${present} present, ${absent} absent`
    );
  };


  const presentCount =
    students?.filter(
      (student) => student.status === "Present"
    ).length ?? 0;

  const absentCount =
    students === null ? 0 : students.length - presentCount;


  return (
    <>
      <PageHeader
        title="Attendance"
        description="Select a class and mark student attendance."
      />

      <Card title="Mark Attendance">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <label
              htmlFor="attendanceClass"
              className="mb-2 block text-sm font-semibold text-slate-700"
            >
              Class
            </label>
            <select
              id="attendanceClass"
              value={selectedClass}
              onChange={(event) =>
                handleClassChange(event.target.value)
              }
              className={inputClass}
            >
              {teacherClasses.map((item) => (
                <option key={item.id} value={item.name}>
                  {item.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label
              htmlFor="attendanceSubject"
              className="mb-2 block text-sm font-semibold text-slate-700"
            >
              Subject
            </label>
            <select
              id="attendanceSubject"
              value={selectedSubject}
              onChange={(event) =>
                setSelectedSubject(event.target.value)
              }
              className={inputClass}
            >
              {(subjects.length > 0
                ? subjects
                : ["Mathematics"]
              ).map((subject) => (
                <option key={subject} value={subject}>
                  {subject}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label
              htmlFor="attendanceDate"
              className="mb-2 block text-sm font-semibold text-slate-700"
            >
              Date
            </label>
            <input
              id="attendanceDate"
              type="date"
              value={date}
              onChange={(event) =>
                setDate(event.target.value)
              }
              className={inputClass}
            />
          </div>

          <div className="flex items-end">
            <button
              type="button"
              onClick={handleLoadStudents}
              className="flex h-11 w-full items-center justify-center gap-2 rounded-lg bg-indigo-600 px-4 text-sm font-semibold text-white transition-colors hover:bg-indigo-700"
            >
              <UserCheck size={16} />
              Load Students
            </button>
          </div>
        </div>
      </Card>

      {/* Student list */}
      {students !== null && (
        <Card
          title={`Student List — ${loadedFor}`}
          subtitle={`${date} · ${selectedSubject}`}
          className="mt-6 overflow-hidden"
          action={
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-green-50 px-3 py-1 text-xs font-semibold text-green-600">
                <span className="h-2 w-2 rounded-full bg-green-600" />
                {presentCount} Present
              </span>
              <span className="inline-flex items-center gap-1.5 rounded-full bg-red-50 px-3 py-1 text-xs font-semibold text-red-600">
                <span className="h-2 w-2 rounded-full bg-red-600" />
                {absentCount} Absent
              </span>
            </div>
          }
        >
          <div className="overflow-x-auto">
            <table className="w-full min-w-[520px] border-collapse text-sm">
              <thead>
                <tr>
                  <th className="w-16 border-b border-slate-200 bg-slate-50 px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                    Roll
                  </th>
                  <th className="border-b border-slate-200 bg-slate-50 px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                    Student
                  </th>
                  <th className="border-b border-slate-200 bg-slate-50 px-4 py-3 text-right text-xs font-semibold uppercase tracking-wider text-slate-500">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody>
                {students.map((student) => (
                  <tr
                    key={student.id}
                    className="border-b border-slate-100 transition last:border-0"
                  >
                    <td className="px-4 py-3 font-semibold text-slate-400">
                      {student.roll}
                    </td>
                    <td className="px-4 py-3 font-semibold text-slate-900">
                      {student.name}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex justify-end">
                        <div className="inline-flex rounded-full bg-slate-100 p-1">
                          <button
                            type="button"
                            onClick={() =>
                              setStatus(
                                student.id,
                                "Present"
                              )
                            }
                            className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-semibold transition-colors ${
                              student.status === "Present"
                                ? "bg-green-600 text-white"
                                : "text-slate-500 hover:text-slate-700"
                            }`}
                          >
                            <span className="h-2 w-2 rounded-full bg-current" />
                            Present
                          </button>
                          <button
                            type="button"
                            onClick={() =>
                              setStatus(
                                student.id,
                                "Absent"
                              )
                            }
                            className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-semibold transition-colors ${
                              student.status === "Absent"
                                ? "bg-red-600 text-white"
                                : "text-slate-500 hover:text-slate-700"
                            }`}
                          >
                            <span className="flex h-2 w-2 items-center justify-center rounded-full border-[1.5px] border-current" />
                            Absent
                          </button>
                        </div>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-3 border-t border-slate-100 pt-4">
            <button
              type="button"
              onClick={handleMarkAllPresent}
              className="rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition-colors hover:bg-slate-50"
            >
              Mark all present
            </button>

            <button
              type="button"
              onClick={handleSave}
              className="rounded-lg bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-indigo-700"
            >
              Save Attendance
            </button>
          </div>
        </Card>
      )}
    </>
  );
};

export default TeacherAttendancePage;