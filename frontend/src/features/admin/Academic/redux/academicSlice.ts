import { createSlice } from "@reduxjs/toolkit";

import type {
  Exam,
  TimetableEntry,
  Holiday,
} from "../types/academicTypes";

import {
  fetchExamsThunk,
  createExamThunk,
  deleteExamThunk,
  fetchTimetableThunk,
  createTimetableEntryThunk,
  deleteTimetableEntryThunk,
  fetchHolidaysThunk,
  createHolidayThunk,
  deleteHolidayThunk,
} from "./academicThunk";


interface AcademicState {
  exams: Exam[];
  timetable: TimetableEntry[];
  holidays: Holiday[];
  loading: boolean;
  saving: boolean;
  error: string | null;
}


const initialState: AcademicState = {
  exams: [],
  timetable: [],
  holidays: [],
  loading: false,
  saving: false,
  error: null,
};


const academicSlice = createSlice({
  name: "academic",

  initialState,

  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },

  extraReducers: (builder) => {

    // =================================
    // EXAMS
    // =================================

    builder
      .addCase(
        fetchExamsThunk.pending,
        (state) => {
          state.loading = true;
          state.error = null;
        }
      )

      .addCase(
        fetchExamsThunk.fulfilled,
        (state, action) => {
          state.loading = false;
          state.exams = action.payload;
        }
      )

      .addCase(
        fetchExamsThunk.rejected,
        (state, action) => {
          state.loading = false;
          state.error = action.payload as string;
        }
      );

    builder
      .addCase(
        createExamThunk.pending,
        (state) => {
          state.saving = true;
        }
      )

      .addCase(
        createExamThunk.fulfilled,
        (state, action) => {
          state.saving = false;
          state.exams.unshift(action.payload);
        }
      )

      .addCase(
        createExamThunk.rejected,
        (state) => {
          state.saving = false;
        }
      );

    builder.addCase(
      deleteExamThunk.fulfilled,
      (state, action) => {
        state.exams = state.exams.filter(
          (exam) => exam.id !== action.payload
        );
      }
    );


    // =================================
    // TIMETABLE
    // =================================

    builder
      .addCase(
        fetchTimetableThunk.pending,
        (state) => {
          state.loading = true;
        }
      )

      .addCase(
        fetchTimetableThunk.fulfilled,
        (state, action) => {
          state.loading = false;
          state.timetable = action.payload;
        }
      )

      .addCase(
        fetchTimetableThunk.rejected,
        (state) => {
          state.loading = false;
        }
      );

    builder
      .addCase(
        createTimetableEntryThunk.pending,
        (state) => {
          state.saving = true;
        }
      )

      .addCase(
        createTimetableEntryThunk.fulfilled,
        (state, action) => {
          state.saving = false;
          state.timetable.unshift(action.payload);
        }
      )

      .addCase(
        createTimetableEntryThunk.rejected,
        (state) => {
          state.saving = false;
        }
      );

    builder.addCase(
      deleteTimetableEntryThunk.fulfilled,
      (state, action) => {
        state.timetable = state.timetable.filter(
          (entry) => entry.id !== action.payload
        );
      }
    );


    // =================================
    // HOLIDAYS
    // =================================

    builder
      .addCase(
        fetchHolidaysThunk.pending,
        (state) => {
          state.loading = true;
        }
      )

      .addCase(
        fetchHolidaysThunk.fulfilled,
        (state, action) => {
          state.loading = false;
          state.holidays = action.payload;
        }
      )

      .addCase(
        fetchHolidaysThunk.rejected,
        (state) => {
          state.loading = false;
        }
      );

    builder
      .addCase(
        createHolidayThunk.pending,
        (state) => {
          state.saving = true;
        }
      )

      .addCase(
        createHolidayThunk.fulfilled,
        (state, action) => {
          state.saving = false;
          state.holidays.unshift(action.payload);
        }
      )

      .addCase(
        createHolidayThunk.rejected,
        (state) => {
          state.saving = false;
        }
      );

    builder.addCase(
      deleteHolidayThunk.fulfilled,
      (state, action) => {
        state.holidays = state.holidays.filter(
          (holiday) => holiday.id !== action.payload
        );
      }
    );
  },
});

export const {
  clearError,
} = academicSlice.actions;

export default academicSlice.reducer;