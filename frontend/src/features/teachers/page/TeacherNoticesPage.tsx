import { CalendarDays, Megaphone } from "lucide-react";

import PageHeader from "../components/PageHeader";

import type { NoticeItem } from "../types/teacherTypes";

import { noticeItems } from "../utils/mockData";


const CATEGORY_STYLES: Record<
  NoticeItem["category"],
  string
> = {
  Academic: "bg-indigo-50 text-indigo-700",
  Event: "bg-green-50 text-green-600",
  Staff: "bg-amber-50 text-amber-600",
  General: "bg-slate-100 text-slate-600",
};


const TeacherNoticesPage = () => (
  <>
    <PageHeader
      title="Notices"
      description="Announcements and updates from the school."
    />

    <div className="space-y-4">
      {noticeItems.map((notice) => (
        <section
          key={notice.id}
          className="rounded-lg border border-slate-200 bg-white p-6 transition-all duration-200 hover:-translate-y-0.5 hover:border-indigo-200"
        >
          <div className="flex flex-wrap items-center gap-3">
            <span
              className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${CATEGORY_STYLES[notice.category]}`}
            >
              {notice.category}
            </span>
            <span className="flex items-center gap-1.5 text-xs font-medium text-slate-400">
              <CalendarDays size={14} />
              {notice.date}
            </span>
          </div>

          <h3 className="mt-3 flex items-center gap-2 text-lg font-bold text-slate-900">
            <Megaphone size={18} className="shrink-0 text-indigo-600" />
            {notice.title}
          </h3>

          <p className="mt-2 text-sm leading-6 text-slate-500">
            {notice.body}
          </p>
        </section>
      ))}
    </div>
  </>
);

export default TeacherNoticesPage;