export type AttendanceStatus = "Present" | "Absent";

export interface StudentAttendance {
  id: string;
  roll: string;
  name: string;
  status: AttendanceStatus;
}
