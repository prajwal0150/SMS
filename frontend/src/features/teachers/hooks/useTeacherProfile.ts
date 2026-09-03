import { useEffect, useState } from "react";

import useAuth from "../../auth/hooks/useAuth";

import {
  fetchTeacherProfile,
  fetchTeacherAssignments,
  fetchTeacherTimetable,
} from "../services/teacherService";

import type {
  TeacherProfile,
  TeacherClassAssignment,
  TeacherTimetableEntry,
} from "../types/teacherTypes";


/**
 * Loads the logged-in teacher's own record
 * (matched by email) and the class sections
 * assigned to them by the admin.
 */
export const useTeacherProfile = () => {
  const { user } = useAuth();

  const email = user?.email ?? null;

  const [profile, setProfile] =
    useState<TeacherProfile | null>(null);

  const [assignments, setAssignments] =
    useState<TeacherClassAssignment[]>([]);

  const [timetable, setTimetable] =
    useState<TeacherTimetableEntry[]>([]);

  const [loading, setLoading] = useState(true);


  useEffect(() => {
    let cancelled = false;

    const load = async () => {
      if (!email) {
        setLoading(false);
        return;
      }

      setLoading(true);

      try {
        const teacherProfile =
          await fetchTeacherProfile(email);

        if (cancelled) return;

        setProfile(teacherProfile);

        if (teacherProfile) {
          const rows =
            await fetchTeacherAssignments(
              teacherProfile.id
            );

          if (!cancelled) {
            setAssignments(rows);
          }

          const periods =
            await fetchTeacherTimetable(
              teacherProfile.id
            );

          if (!cancelled) {
            setTimetable(periods);
          }
        } else if (!cancelled) {
          setAssignments([]);
          setTimetable([]);
        }
      } catch {
        // Panel falls back to generic content
        // when the profile is unavailable.
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    load();

    return () => {
      cancelled = true;
    };
  }, [email]);


  return { profile, assignments, timetable, loading };
};