import { useEffect, useState } from "react";

import {
  fetchParentChildren,
  fetchParentNotices,
  fetchParentProfile,
  fetchParentSummaries,
} from "../services/parentService";

import type {
  ParentChild,
  ParentChildSummary,
  ParentDashboardData,
  ParentNoticeRow,
  ParentProfile,
} from "../types/parentTypes";

export interface ParentDataState {
  loading: boolean;
  error: string | null;
  profile: ParentProfile | null;
  children: ParentChild[];
  summaries: ParentChildSummary[];
  notices: ParentNoticeRow[];
}

const EMPTY: Omit<ParentDashboardData, "children" | "summaries"> = {
  profile: null,
  notices: [],
};

/**
 * Loads the parent dashboard bag: profile, children, per-child
 * summaries and the latest published notices. Every loader fails
 * soft, so a missing view degrades to empty data instead of a
 * blank screen.
 */
export const useParentData = (): ParentDataState => {
  const [state, setState] = useState<ParentDataState>({
    loading: true,
    error: null,
    profile: EMPTY.profile,
    children: [],
    summaries: [],
    notices: EMPTY.notices,
  });

  useEffect(() => {
    let cancelled = false;

    const load = async () => {
      try {
        const profile = await fetchParentProfile();
        const children = await fetchParentChildren();
        const summaries = await fetchParentSummaries();
        const notices = await fetchParentNotices();

        if (cancelled) {
          return;
        }

        setState({
          loading: false,
          error: null,
          profile,
          children,
          summaries,
          notices,
        });
      } catch (errorValue) {
        if (cancelled) {
          return;
        }

        setState({
          loading: false,
          error:
            errorValue instanceof Error
              ? errorValue.message
              : "Parent dashboard could not be loaded.",
          profile: null,
          children: [],
          summaries: [],
          notices: [],
        });
      }
    };

    load();

    return () => {
      cancelled = true;
    };
  }, []);

  return state;
};

export default useParentData;