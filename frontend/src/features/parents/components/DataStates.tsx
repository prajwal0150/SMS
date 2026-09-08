interface DataStatesProps {
  /** Shows when there are zero rows. */
  empty?: string;
  /** Shows while the data is being fetched. */
  loading?: string;
  /** Shows when the fetch failed. */
  error?: string | null;
  /** True while the data is being fetched. */
  isLoading?: boolean;
}

/**
 * One component for the three non-success states every data
 * driven block needs: loading skeleton, empty message and an
 * error alert.
 */
const DataStates = ({
  empty = "No records found.",
  loading = "Loading...",
  error,
  isLoading = false,
}: DataStatesProps) => {
  if (error) {
    return (
      <div className="rounded-lg border border-rose-200 bg-rose-50 p-5">
        <p className="text-sm font-semibold text-rose-700">
          Something went wrong
        </p>
        <p className="mt-1 text-xs text-rose-600">{error}</p>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="space-y-3" role="status">
        <div className="h-4 w-1/3 animate-pulse rounded bg-slate-200" />
        <div className="h-4 animate-pulse rounded bg-slate-100" />
        <div className="h-4 w-5/6 animate-pulse rounded bg-slate-100" />
        <p className="sr-only">{loading}</p>
      </div>
    );
  }

  return (
    <div className="rounded-lg border border-dashed border-slate-200 bg-slate-50/60 px-6 py-10 text-center">
      <p className="text-sm font-medium text-slate-500">{empty}</p>
    </div>
  );
};

export default DataStates;