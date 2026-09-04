import { createSlice } from "@reduxjs/toolkit";

import type {
  ClassSection,
 ClassSubject,
 SchoolClass,
 Subject,
} from "../types/schoolTypes";

import {
  attachSubjectThunk,
 createClassThunk,
 createSectionThunk,
 createSubjectThunk,
 deleteClassThunk,
 deleteSectionThunk,
 fetchClassesThunk,
 fetchClassSubjectsThunk,
 fetchSectionsThunk,
 fetchSubjectsThunk,
 removeClassSubjectThunk,
} from "./schoolThunk";


interface SchoolState {
  classes: SchoolClass[];
  sections: ClassSection[];
  subjects: Subject[];
  classSubjects: ClassSubject[];
  selectedClassId: string | null;
  loading: boolean;
  saving: boolean;
  error: string | null;
}


const initialState: SchoolState = {
  classes: [],
  sections: [],
  subjects: [],
  classSubjects: [],
  selectedClassId: null,
  loading: false,
  saving: false,
  error: null,
};


const schoolSlice = createSlice({
  name: "school",

  initialState,

  reducers: {
    clearError: (state) => {
      state.error = null;
    },

    setSelectedClassId: (state, action: { payload: string | null }) => {
      state.selectedClassId = action.payload;
    },
  },

  extraReducers: (builder) => {

    // =================================
    // CLASSES
    // =================================

    builder
      .addCase(
        fetchClassesThunk.pending,
        (state) => {
          state.loading = true;
          state.error = null;
        }
      )

      .addCase(
        fetchClassesThunk.fulfilled,
        (state, action) => {
          state.loading = false;
          state.classes = action.payload;
        }
      )

      .addCase(
        fetchClassesThunk.rejected,
        (state, action) => {
          state.loading = false;
          state.error = action.payload as string;
        }
      );

    builder
      .addCase(
        createClassThunk.pending,
        (state) => {
          state.saving = true;
        }
      )

      .addCase(
        createClassThunk.fulfilled,
        (state, action) => {
          state.saving = false;
          state.classes.unshift(action.payload);
        }
      )

      .addCase(
        createClassThunk.rejected,
        (state) => {
          state.saving = false;
        }
      );

    builder.addCase(
      deleteClassThunk.fulfilled,
      (state, action) => {
        state.classes = state.classes.filter(
          (item) => item.id !== action.payload
        );

        if (state.selectedClassId === action.payload) {
          state.selectedClassId = null;
        }
      }
    );

    // =================================
    // SECTIONS
    // =================================

    builder
      .addCase(
        fetchSectionsThunk.pending,
        (state) => {
          state.loading = true;
          state.error = null;
        }
      )

      .addCase(
        fetchSectionsThunk.fulfilled,
        (state, action) => {
          state.loading = false;
          state.sections = action.payload;
        }
      )

      .addCase(
        fetchSectionsThunk.rejected,
        (state) => {
          state.loading = false;
        }
      );

    builder
      .addCase(
        createSectionThunk.pending,
        (state) => {
          state.saving = true;
        }
      )

      .addCase(
        createSectionThunk.fulfilled,
        (state, action) => {
          state.saving = false;
          state.sections.unshift(action.payload);
        }
      )

      .addCase(
        createSectionThunk.rejected,
        (state) => {
          state.saving = false;
        }
      );

    builder.addCase(
      deleteSectionThunk.fulfilled,
      (state, action) => {
        state.sections = state.sections.filter(
          (item) => item.id !== action.payload
        );
      }
    );

    // =================================
    // SUBJECTS (master list)
    // =================================

    builder
      .addCase(
        fetchSubjectsThunk.pending,
        (state) => {
          state.loading = true;
          state.error = null;
        }
      )

      .addCase(
        fetchSubjectsThunk.fulfilled,
        (state, action) => {
          state.loading = false;
          state.subjects = action.payload;
        }
      )

      .addCase(
        fetchSubjectsThunk.rejected,
        (state) => {
          state.loading = false;
        }
      );

    builder
      .addCase(
        createSubjectThunk.pending,
        (state) => {
          state.saving = true;
        }
      )

      .addCase(
        createSubjectThunk.fulfilled,
        (state, action) => {
          state.saving = false;
          state.subjects.unshift(action.payload);
        }
      )

      .addCase(
        createSubjectThunk.rejected,
        (state) => {
          state.saving = false;
        }
      );

    // =================================
    // CLASS SUBJECTS
    // =================================

    builder
      .addCase(
        fetchClassSubjectsThunk.pending,
        (state) => {
          state.loading = true;
          state.error = null;
        }
      )

      .addCase(
        fetchClassSubjectsThunk.fulfilled,
        (state, action) => {
          state.loading = false;
          state.classSubjects = action.payload;
        }
      )

      .addCase(
        fetchClassSubjectsThunk.rejected,
        (state) => {
          state.loading = false;
        }
      );

    builder
      .addCase(
        attachSubjectThunk.pending,
        (state) => {
          state.saving = true;
        }
      )

      .addCase(
        attachSubjectThunk.fulfilled,
        (state, action) => {
          state.saving = false;
          state.classSubjects.unshift(action.payload);
        }
      )

      .addCase(
        attachSubjectThunk.rejected,
        (state) => {
          state.saving = false;
        }
      );

    builder.addCase(
      removeClassSubjectThunk.fulfilled,
      (state, action) => {
        state.classSubjects = state.classSubjects.filter(
          (item) => item.id !== action.payload
        );
      }
    );
  },
});

export const {
  clearError,
  setSelectedClassId,
} = schoolSlice.actions;

export default schoolSlice.reducer;