import { AlertCircle, Inbox, RefreshCw } from "lucide-react";


interface DataStateProps {
  loading?: boolean;
  error?: string | null;
  message?: string;
  onReload?: () => void;
}

const DataState = ({
  loading,
  error,
  message = "No records found yet.",
  onReload,
}: DataStateProps) => {

  if (loading) {
    return (
      <div className="flex flex-col items-center gap-3 py-14 text-center">
        <div className="h-8 w-8 animate-spin rounded-full border-[3px] border-[#166534]/20 border-t-[#166534]" />
        <p className="text-sm font-medium text-slate-500">
          Loading data...
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center gap-3 py-14 text-center">
        <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-red-50 text-red-600">
          <AlertCircle size={22} />
        </div>
        <p className="text-sm font-semibold text-slate-900">
          Could not load data
        </p>
        <p className="max-w-md text-sm text-slate-500">
          {error}
        </p>

        {onReload && (
          <button
            type="button"
            onClick={onReload}
            className="mt-1 flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition-colors hover:bg-slate-50"
          >
            <RefreshCw size={15} />
            Try again
          </button>
        )}
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center gap-3 py-14 text-center">
      <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-slate-100 text-slate-400">
        <Inbox size={22} />
      </div>
      <p className="text-sm font-medium text-slate-500">
        {message}
      </p>
    </div>
  );
};

export default DataState;