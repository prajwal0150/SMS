import {
  BookOpen,
  CalendarDays,
  Clock,
  Users,
} from "lucide-react";

import PageHeader from "../components/PageHeader";

import { teacherClasses } from "../utils/mockData";


const TeacherClassesPage = () => (
  <>
    <PageHeader
      title="My Classes"
      description="Classes you are currently teaching."
    />

    <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
      {teacherClasses.map((item) => (
        <section
          key={item.id}
          className="rounded-lg border border-slate-200 bg-white p-6 transition-all duration-200 hover:-translate-y-0.5 hover:border-indigo-200"
        >
          <div className="flex items-start justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-indigo-600">
                {item.subject}
              </p>
              <h3 className="mt-1 text-lg font-bold text-slate-900">
                {item.name}
              </h3>
            </div>
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-indigo-600/10 text-indigo-600">
              <BookOpen size={20} />
            </div>
          </div>

          <dl className="mt-5 space-y-2 text-sm text-slate-500">
            <div className="flex items-center gap-2">
              <Users size={15} className="shrink-0 text-slate-400" />
              {item.students} students
            </div>
            <div className="flex items-center gap-2">
              <Clock size={15} className="shrink-0 text-slate-400" />
              {item.schedule}
            </div>
            <div className="flex items-center gap-2">
              <CalendarDays size={15} className="shrink-0 text-slate-400" />
              {item.periodsPerWeek} periods per week
            </div>
          </dl>
        </section>
      ))}
    </div>
  </>
);

export default TeacherClassesPage;