import type { ReactNode } from "react";

interface DashboardCardProps {
  title: string;
  subtitle?: string;
  action?: ReactNode;
  children: ReactNode;
  className?: string;
}

const DashboardCard = ({
  title,
  subtitle,
  action,
  children,
  className,
}: DashboardCardProps) => (
  <section
    className={`flex flex-col rounded-lg border border-slate-200 bg-white ${
      className ?? ""
    }`}
  >
    <header className="flex items-center justify-between gap-3 border-b border-slate-100 px-4 py-3">
      <div className="min-w-0">
        <h2 className="truncate text-sm font-bold text-slate-900">
          {title}
        </h2>
        {subtitle && (
          <p className="mt-0.5 text-xs text-slate-400">{subtitle}</p>
        )}
      </div>
      {action}
    </header>
    <div className="flex-1 p-4">{children}</div>
  </section>
);

export default DashboardCard;