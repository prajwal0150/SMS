import { useCallback, useEffect, useState } from "react";

import { fetchStudentProfile } from "../services/profileService";

import type { StudentProfileData } from "../types/profileTypes";


export const useStudentProfile = () => {

  const [profile, setProfile] =
    useState<StudentProfileData | null>(null);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState<string | null>(null);


  const loadProfile = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const result = await fetchStudentProfile();

      setProfile(result);
    } catch (err) {
      setProfile(null);
      setError(
        err instanceof Error
          ? err.message
          : "Unable to load your profile."
      );
    } finally {
      setLoading(false);
    }
  }, []);


  useEffect(() => {
    loadProfile();
  }, [loadProfile]);


  return {
    profile,
    loading,
    error,
    reload: loadProfile,
  };
};
