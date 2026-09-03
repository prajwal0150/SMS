import { createSlice } from "@reduxjs/toolkit";

import type {
  Student,
  StudentPromotion,
  StudentDocument,
} from "../types/studentManagmentTypes";

import {
  fetchStudentsThunk,
  createStudentThunk,
  deleteStudentThunk,
  fetchPromotionsThunk,
  promoteStudentsThunk,
  fetchDocumentsThunk,
  createDocumentThunk,
  deleteDocumentThunk,
} from "./studentManagmentThunk";


interface StudentManagementState {
  students: Student[];
  promotions: StudentPromotion[];
  documents: StudentDocument[];
  loading: boolean;
  promotionsLoading: boolean;
  documentsLoading: boolean;
  saving: boolean;
  error: string | null;
}


const initialState: StudentManagementState = {
  students: [],
  promotions: [],
  documents: [],
  loading: false,
  promotionsLoading: false,
  documentsLoading: false,
  saving: false,
  error: null,
};


const studentManagementSlice = createSlice({
  name: "studentManagement",

  initialState,

  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },

  extraReducers: (builder) => {

    // =================================
    // STUDENTS - FETCH
    // =================================

    builder
      .addCase(
        fetchStudentsThunk.pending,
        (state) => {
          state.loading = true;
          state.error = null;
        }
      )

      .addCase(
        fetchStudentsThunk.fulfilled,
        (state, action) => {
          state.loading = false;
          state.students = action.payload;
        }
      )

      .addCase(
        fetchStudentsThunk.rejected,
        (state, action) => {
          state.loading = false;
          state.error = action.payload as string;
        }
      );


    // =================================
    // STUDENTS - CREATE
    // =================================

    builder
      .addCase(
        createStudentThunk.pending,
        (state) => {
          state.saving = true;
        }
      )

      .addCase(
        createStudentThunk.fulfilled,
        (state, action) => {
          state.saving = false;
          state.students.unshift(action.payload);
        }
      )

      .addCase(
        createStudentThunk.rejected,
        (state) => {
          state.saving = false;
        }
      );


    // =================================
    // STUDENTS - DELETE
    // =================================

    builder.addCase(
      deleteStudentThunk.fulfilled,
      (state, action) => {
        state.students = state.students.filter(
          (student) => student.id !== action.payload
        );
      }
    );


    // =================================
    // PROMOTIONS - FETCH
    // =================================

    builder
      .addCase(
        fetchPromotionsThunk.pending,
        (state) => {
          state.promotionsLoading = true;
        }
      )

      .addCase(
        fetchPromotionsThunk.fulfilled,
        (state, action) => {
          state.promotionsLoading = false;
          state.promotions = action.payload;
        }
      )

      .addCase(
        fetchPromotionsThunk.rejected,
        (state) => {
          state.promotionsLoading = false;
        }
      );


    // =================================
    // STUDENTS - PROMOTE
    // =================================

    builder
      .addCase(
        promoteStudentsThunk.pending,
        (state) => {
          state.saving = true;
        }
      )

      .addCase(
        promoteStudentsThunk.fulfilled,
        (state, action) => {
          state.saving = false;

          const {
            student_ids,
            class_name,
            section,
          } = action.payload;

          state.students = state.students.map(
            (student) =>
              student_ids.includes(student.id)
                ? {
                    ...student,
                    class_name,
                    section: section ?? null,
                  }
                : student
          );
        }
      )

      .addCase(
        promoteStudentsThunk.rejected,
        (state) => {
          state.saving = false;
        }
      );


    // =================================
    // DOCUMENTS - FETCH
    // =================================

    builder
      .addCase(
        fetchDocumentsThunk.pending,
        (state) => {
          state.documentsLoading = true;
        }
      )

      .addCase(
        fetchDocumentsThunk.fulfilled,
        (state, action) => {
          state.documentsLoading = false;
          state.documents = action.payload;
        }
      )

      .addCase(
        fetchDocumentsThunk.rejected,
        (state) => {
          state.documentsLoading = false;
        }
      );


    // =================================
    // DOCUMENTS - CREATE
    // =================================

    builder
      .addCase(
        createDocumentThunk.pending,
        (state) => {
          state.saving = true;
        }
      )

      .addCase(
        createDocumentThunk.fulfilled,
        (state, action) => {
          state.saving = false;
          state.documents.unshift(action.payload);
        }
      )

      .addCase(
        createDocumentThunk.rejected,
        (state) => {
          state.saving = false;
        }
      );


    // =================================
    // DOCUMENTS - DELETE
    // =================================

    builder.addCase(
      deleteDocumentThunk.fulfilled,
      (state, action) => {
        state.documents = state.documents.filter(
          (document) => document.id !== action.payload
        );
      }
    );

  },
});


export const {
  clearError,
} = studentManagementSlice.actions;


export default studentManagementSlice.reducer;