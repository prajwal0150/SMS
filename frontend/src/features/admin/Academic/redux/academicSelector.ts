import type { RootState } from "../../../../redux/store";


export const selectAcademic = (
  state: RootState
) => state.academic;

export const selectExams = (
  state: RootState
) => state.academic.exams;

export const selectTimetable = (
  state: RootState
) => state.academic.timetable;

export const selectHolidays = (
  state: RootState
) => state.academic.holidays;

export const selectAcademicLoading = (
  state: RootState
) => state.academic.loading;

export const selectAcademicSaving = (
  state: RootState
) => state.academic.saving;

export const selectAcademicError = (
  state: RootState
) => state.academic.error;