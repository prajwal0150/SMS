import { supabase } from "../../../../lib/supabase";

/**
 * Number of active students the admin added for a
 * class + section (used for dashboard stats).
 */
export const fetchStudentCountFor = async (
  className: string,
  section: string
): Promise<number> => {
  const { count, error } = await supabase
    .from("students")
    .select("id", { count: "exact", head: true })
    .eq("class_name", className)
    .eq("section", section)
    .eq("status", "active");

  if (error) {
    throw new Error(error.message);
  }

  return count ?? 0;
};