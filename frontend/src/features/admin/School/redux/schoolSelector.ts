import type { RootState } from "../../../../redux/store";


export const selectSchool = (
  state: RootState
) => state.school;

export const selectClasses = (
  state: RootState
) => state.school.classes;

export const selectSections = (
  state: RootState
) => state.school.sections;

export const selectSubjects = (
  state: RootState
) => state.school.subjects;

export const selectClassSubjects = (
  state: RootState
) => state.school.classSubjects;

export const selectSelectedClassId = (
  state: RootState
) => state.school.selectedClassId;

export const selectSchoolLoading = (
  state: RootState
) => state.school.loading;

export const selectSchoolSaving = (
  state: RootState
) => state.school.saving;

export const selectSchoolError = (
  state: RootState
) => state.school.error;