import PageHeader from "../components/PageHeader";
import Card from "../components/Card";

import { timetable } from "../utils/mockData";


const DAYS = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
];

const PERIOD_LABELS = [
  ...new Set(
    timetable.map(
      (entry) => `${entry.period} - ${entry.time}`
    )
  ),
];


const TeacherTimetablePage = () => (
  <>
    <PageHeader
      title="Timetable"
      description="Your weekly class schedule."
    />

    <Card title="Weekly Schedule" className="overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[900px] border-collapse text-sm">
          <thead>
            <tr>
              <th className="border-b border-slate-200 bg-slate-50 px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                Period
              </th>
              {DAYS.map((day) => (
                <th
                  key={day}
                  className="border-b border-slate-200 bg-slate-50 px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500"
                >
                  {day}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {PERIOD_LABELS.map((label) => (
              <tr
                key={label}
                className="border-b border-slate-100 last:border-0"
              >
                <td className="px-4 py-3 font-medium text-slate-500">
                  {label}
                </td>

                {DAYS.map((day) => {
                  const entry = timetable.find(
                    (item) =>
                      item.day === day &&
                      `${item.period} - ${item.time}` === label
                  );

                  return (
                    <td key={day} className="px-4 py-3">
                      {entry ? (
                        <div className="rounded-lg bg-indigo-50 px-3 py-2">
                          <p className="font-semibold text-indigo-700">
                            {entry.subject}
                          </p>
                          <p className="text-xs text-slate-500">
                            {entry.className}
                          </p>
                        </div>
                      ) : (
                        <span className="text-slate-300">
                          -
                        </span>
                      )}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  </>
);

export default TeacherTimetablePage;