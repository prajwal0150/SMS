import {
  createSlice,
} from "@reduxjs/toolkit";

import type {
  Teacher,
  TeacherAssignment,
  StaffAttendance,
} from "../types/staffManagmentTypes";

import {
  fetchTeachersThunk,
  createTeacherThunk,
  deleteTeacherThunk,
  fetchAssignmentsThunk,
  createAssignmentThunk,
  fetchAttendanceThunk,
  markAttendanceThunk,
} from "./staffManagmentThunk";


interface StaffManagementState {
  teachers: Teacher[];
  assignments: TeacherAssignment[];
  attendance: StaffAttendance[];
  loading: boolean;
  assignmentsLoading: boolean;
  attendanceLoading: boolean;
  saving: boolean;
  error: string | null;
}


const initialState: StaffManagementState = {
  teachers: [],
  assignments: [],
  attendance: [],
  loading: false,
  assignmentsLoading: false,
  attendanceLoading: false,
  saving: false,
  error: null,
};


const staffManagementSlice = createSlice({
  name: "staffManagement",

  initialState,

  reducers: {

    clearError: (state) => {
      state.error = null;
    },

  },

  extraReducers: (builder) => {

    // =================================
    // TEACHERS - FETCH
    // =================================

    builder
      .addCase(
        fetchTeachersThunk.pending,
        (state) => {
          state.loading = true;
          state.error = null;
        }
      )

      .addCase(
        fetchTeachersThunk.fulfilled,
        (state, action) => {
          state.loading = false;
          state.teachers = action.payload;
        }
      )

      .addCase(
        fetchTeachersThunk.rejected,
        (state, action) => {
          state.loading = false;
          state.error =
            action.payload as string;
        }
      );


    // =================================
    // TEACHERS - CREATE
    // =================================

    builder
      .addCase(
        createTeacherThunk.pending,
        (state) => {
          state.saving = true;
        }
      )

      .addCase(
        createTeacherThunk.fulfilled,
        (state, action) => {
          state.saving = false;

          state.teachers.unshift(
            action.payload
          );
        }
      )

      .addCase(
        createTeacherThunk.rejected,
        (state) => {
          state.saving = false;
        }
      );


    // =================================
    // TEACHERS - DELETE
    // =================================

    builder
      .addCase(
        deleteTeacherThunk.fulfilled,
        (state, action) => {
          state.teachers =
            state.teachers.filter(
              (teacher) =>
                teacher.id !== action.payload
            );
        }
      )


    // =================================
    // ASSIGNMENTS - FETCH
    // =================================

      .addCase(
        fetchAssignmentsThunk.pending,
        (state) => {
          state.assignmentsLoading = true;
        }
      )

      .addCase(
        fetchAssignmentsThunk.fulfilled,
        (state, action) => {
          state.assignmentsLoading = false;
          state.assignments = action.payload;
        }
      )

      .addCase(
        fetchAssignmentsThunk.rejected,
        (state) => {
          state.assignmentsLoading = false;
        }
      );


    // =================================
    // ASSIGNMENTS - CREATE
    // =================================

    builder
      .addCase(
        createAssignmentThunk.pending,
        (state) => {
          state.saving = true;
        }
      )

      .addCase(
        createAssignmentThunk.fulfilled,
        (state, action) => {
          state.saving = false;

          state.assignments.unshift(
            action.payload
          );
        }
      )

      .addCase(
        createAssignmentThunk.rejected,
        (state) => {
          state.saving = false;
        }
      );


    // =================================
    // ATTENDANCE - FETCH
    // =================================

    builder
      .addCase(
        fetchAttendanceThunk.pending,
        (state) => {
          state.attendanceLoading = true;
        }
      )

      .addCase(
        fetchAttendanceThunk.fulfilled,
        (state, action) => {
          state.attendanceLoading = false;
          state.attendance = action.payload;
        }
      )

      .addCase(
        fetchAttendanceThunk.rejected,
        (state) => {
          state.attendanceLoading = false;
        }
      );


    // =================================
    // ATTENDANCE - MARK (upsert by teacher + date)
    // =================================

    builder
      .addCase(
        markAttendanceThunk.pending,
        (state) => {
          state.saving = true;
        }
      )

      .addCase(
        markAttendanceThunk.fulfilled,
        (state, action) => {
          state.saving = false;

          state.attendance = [
            action.payload,
            ...state.attendance.filter(
              (record) =>
                !(
                  record.teacher_id ===
                    action.payload.teacher_id &&
                  record.date === action.payload.date
                )
            ),
          ];
        }
      )

      .addCase(
        markAttendanceThunk.rejected,
        (state) => {
          state.saving = false;
        }
      );

  },
});


export const {
  clearError,
} = staffManagementSlice.actions;


export default staffManagementSlice.reducer;

