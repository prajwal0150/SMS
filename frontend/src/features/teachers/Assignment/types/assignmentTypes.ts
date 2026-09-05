// A homework / classwork assignment created by the
// teacher (from the `class_assignments` table).
export type ClassAssignmentStatus = "Open" | "Grading" | "Closed";

export interface ClassAssignmentItem {
  id: string;
  teacher_id: string;
  title: string;
  description: string | null;
  class_name: string;
  section: string | null;
  subject: string;
  due_date: string;
  status: ClassAssignmentStatus;
  created_at: string;
}

export type ClassAssignmentRow = Omit<ClassAssignmentItem, "status"> & {
  status: "Open" | "Grading" | "Closed";
};

export interface NewClassAssignmentInput {
  teacher_id: string;
  title: string;
  description?: string | null;
  class_name: string;
  section?: string | null;
  subject: string;
  due_date: string;
  status?: ClassAssignmentStatus;
}
