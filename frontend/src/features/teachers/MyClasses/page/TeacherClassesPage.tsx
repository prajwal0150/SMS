import {
  BookOpen,
  CalendarDays,
  Users,
} from "lucide-react";

import PageHeader from "../../components/PageHeader";
import Card from "../../components/Card";

import { useTeacherProfile } from "../../hooks/useTeacherProfile";


const TeacherClassesPage = () => {
  const { profile, assignments, loading } =
    useTeacherProfile();

  return (
    <>
      <PageHeader
        title="My Classes"
        description="Classes you are currently teaching."
      />

      {loading ? (
        <p className="text-sm text-slate-500">
          Loading your classes...
        </p>
      ) : !profile ? (
        <p className="text-sm text-slate-500">
          We could not find your teacher profile. Please contact the admin.
        </p>
      ) : assignments.length === 0 ? (
        <Card className="text-center">
          <div className="flex flex-col items-center gap-2 px-4 py-10">
            <BookOpen size={28} className="text-slate-300" />
            <p className="text-sm font-medium text-slate-700">
              No classes assigned yet.
            </p>
            <p className="text-xs text-slate-500">
              Once the admin assigns you a class, section and subject, it will appear here.
            </p>
          </div>
        </Card>
      ) : (
        <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
          {assignments.map((item) => (
            <section
              key={item.id}
              className="animate-fade-up rounded-lg border border-slate-200 bg-white p-6 transition-all duration-200 hover:-translate-y-0.5 hover:border-indigo-200"
            >
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wider text-indigo-600">
                    {item.subject}
                  </p>
                  <h3 className="mt-1 text-lg font-bold text-slate-900">
                    Class {item.className}
                    {item.section ? `-${item.section}` : ""}
                  </h3>
                </div>
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-indigo-600/10 text-indigo-600">
                  <BookOpen size={20} />
                </div>
              </div>

              <dl className="mt-5 space-y-2 text-sm text-slate-500">
                <div className="flex items-center gap-2">
                  <Users size={15} className="shrink-0 text-slate-400" />
                  Assigned by the admin
                </div>
                <div className="flex items-center gap-2">
                  <CalendarDays size={15} className="shrink-0 text-slate-400" />
                  See your Timetable page for periods
                </div>
              </dl>
            </section>
          ))}
        </div>
      )}
    </>
  );
};

export default TeacherClassesPage;
