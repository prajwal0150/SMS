import type { ReactNode } from "react";

interface CardProps {
  title?: string;
  subtitle?: string;
  action?: ReactNode;
  children: ReactNode;
  className?: string;
}

const Card = ({
  title,
  subtitle,
  action,
  children,
  className,
}: CardProps) => (
  <section
    className={`rounded-lg border border-slate-200 bg-white ${className ?? ""}`}
  >
    {(title || action) && (
      <header className="flex items-center justify-between gap-4 border-b border-slate-100 px-4 py-3">
        <div>
          {title && (
            <h2 className="text-sm font-semibold text-slate-900">
              {title}
            </h2>
          )}
          {subtitle && (
            <p className="mt-0.5 text-xs text-slate-500">
              {subtitle}
            </p>
          )}
        </div>
        {action}
      </header>
    )}
    <div className="p-4">{children}</div>
  </section>
);

export default Card;