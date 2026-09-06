import { useCallback, useEffect, useState } from "react";

import { fetchStudentDashboard } from "../services/dashboardService";

import type { StudentDashboardData } from "../types/dashboardTypes";


export const useStudentDashboard = () => {

  const [data, setData] =
    useState<StudentDashboardData | null>(null);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState<string | null>(null);


  const loadDashboard = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const result = await fetchStudentDashboard();

      setData(result);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Unable to load your dashboard."
      );
    } finally {
      setLoading(false);
    }
  }, []);


  useEffect(() => {
    loadDashboard();
  }, [loadDashboard]);


  return {
    data,
    loading,
    error,
    reload: loadDashboard,
  };
};
