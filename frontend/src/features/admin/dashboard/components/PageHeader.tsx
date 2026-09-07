import type { ReactNode } from "react";

interface PageHeaderProps {
  title: string;
  description?: string;
  actions?: ReactNode;
}

const PageHeader = ({
  title,
  description,
  actions,
}: PageHeaderProps) => (
  <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
    <div>
      <h1 className="text-xl font-bold tracking-tight text-slate-900">
        {title}
      </h1>
      {description && (
        <p className="mt-1 text-xs text-slate-500">
          {description}
        </p>
      )}
    </div>
    {actions}
  </div>
);

export default PageHeader;