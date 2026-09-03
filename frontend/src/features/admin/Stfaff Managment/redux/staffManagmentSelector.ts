import type { RootState } from "../../../../redux/store";


export const selectStaffManagement = (
  state: RootState
) => state.staffManagement;


export const selectTeachers = (
  state: RootState
) => state.staffManagement.teachers;


export const selectAssignments = (
  state: RootState
) => state.staffManagement.assignments;


export const selectAttendance = (
  state: RootState
) => state.staffManagement.attendance;


export const selectStaffLoading = (
  state: RootState
) => state.staffManagement.loading;


export const selectAssignmentsLoading = (
  state: RootState
) => state.staffManagement.assignmentsLoading;


export const selectAttendanceLoading = (
  state: RootState
) => state.staffManagement.attendanceLoading;


export const selectStaffSaving = (
  state: RootState
) => state.staffManagement.saving;


export const selectStaffError = (
  state: RootState
) => state.staffManagement.error;

