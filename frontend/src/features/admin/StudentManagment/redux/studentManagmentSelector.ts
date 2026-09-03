import type { RootState } from "../../../../redux/store";


export const selectStudentManagement = (
  state: RootState
) => state.studentManagement;


export const selectStudents = (
  state: RootState
) => state.studentManagement.students;


export const selectPromotions = (
  state: RootState
) => state.studentManagement.promotions;


export const selectDocuments = (
  state: RootState
) => state.studentManagement.documents;


export const selectStudentLoading = (
  state: RootState
) => state.studentManagement.loading;


export const selectPromotionsLoading = (
  state: RootState
) => state.studentManagement.promotionsLoading;


export const selectDocumentsLoading = (
  state: RootState
) => state.studentManagement.documentsLoading;


export const selectStudentSaving = (
  state: RootState
) => state.studentManagement.saving;


export const selectStudentError = (
  state: RootState
) => state.studentManagement.error;