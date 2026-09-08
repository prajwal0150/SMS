import { useEffect, useState } from "react";

export interface ChildSectionState<T> {
  loading: boolean;
  error: string | null;
  rows: T[];
}

/**
 * Loads one child-scoped dataset for a detail tab. Views fail
 * soft (empty rows) so a missing view degrades gracefully.
 */
export const useChildSection = <T,>(
  studentId: string,
  fetcher: (id: string) => Promise<T[]>
): ChildSectionState<T> => {
  const [state, setState] = useState<ChildSectionState<T>>({
    loading: true,
    error: null,
    rows: [],
  });

  useEffect(() => {
    let cancelled = false;

    const load = async () => {
      try {
        const rows = await fetcher(studentId);

        if (!cancelled) {
          setState({ loading: false, error: null, rows });
        }
      } catch (errorValue) {
        if (!cancelled) {
          setState({
            loading: false,
            error:
              errorValue instanceof Error
                ? errorValue.message
                : "Could not load this section.",
            rows: [],
          });
        }
      }
    };

    load();

    return () => {
      cancelled = true;
    };
  }, [studentId, fetcher]);

  return state;
};

export default useChildSection;