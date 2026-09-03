import { createAsyncThunk } from "@reduxjs/toolkit";

import {
  fetchTeachers,
  createTeacher,
  deleteTeacher,
  fetchAssignments,
  createAssignment,
  fetchAttendance,
  markAttendance,
} from "../services/staffManagmentServices";

import type {
  NewTeacherInput,
  NewAssignmentInput,
  NewAttendanceInput,
} from "../types/staffManagmentTypes";


// ==============================
// FETCH TEACHERS
// ==============================

export const fetchTeachersThunk = createAsyncThunk(
  "staffManagement/fetchTeachers",

  async (_, { rejectWithValue }) => {
    try {
      const teachers = await fetchTeachers();

      return teachers;
    } catch (error) {
      return rejectWithValue(
        error instanceof Error
          ? error.message
          : "Unable to load teachers"
      );
    }
  }
);


// ==============================
// CREATE TEACHER
// ==============================

export const createTeacherThunk = createAsyncThunk(
  "staffManagement/createTeacher",

  async (
    input: NewTeacherInput,
    { rejectWithValue }
  ) => {
    try {
      const teacher = await createTeacher(input);

      return teacher;
    } catch (error) {
      return rejectWithValue(
        error instanceof Error
          ? error.message
          : "Unable to add teacher"
      );
    }
  }
);


// ==============================
// DELETE TEACHER
// ==============================

export const deleteTeacherThunk = createAsyncThunk(
  "staffManagement/deleteTeacher",

  async (id: string, { rejectWithValue }) => {
    try {
      await deleteTeacher(id);

      return id;
    } catch (error) {
      return rejectWithValue(
        error instanceof Error
          ? error.message
          : "Unable to remove teacher"
      );
    }
  }
);


// ==============================
// FETCH ASSIGNMENTS
// ==============================

export const fetchAssignmentsThunk = createAsyncThunk(
  "staffManagement/fetchAssignments",

  async (_, { rejectWithValue }) => {
    try {
      const assignments = await fetchAssignments();

      return assignments;
    } catch (error) {
      return rejectWithValue(
        error instanceof Error
          ? error.message
          : "Unable to load assignments"
      );
    }
  }
);


// ==============================
// CREATE ASSIGNMENT
// ==============================

export const createAssignmentThunk = createAsyncThunk(
  "staffManagement/createAssignment",

  async (
    input: NewAssignmentInput,
    { rejectWithValue }
  ) => {
    try {
      const assignment = await createAssignment(input);

      return assignment;
    } catch (error) {
      return rejectWithValue(
        error instanceof Error
          ? error.message
          : "Unable to create assignment"
      );
    }
  }
);


// ==============================
// FETCH ATTENDANCE
// ==============================

export const fetchAttendanceThunk = createAsyncThunk(
  "staffManagement/fetchAttendance",

  async (_, { rejectWithValue }) => {
    try {
      const records = await fetchAttendance();

      return records;
    } catch (error) {
      return rejectWithValue(
        error instanceof Error
          ? error.message
          : "Unable to load attendance"
      );
    }
  }
);


// ==============================
// MARK ATTENDANCE
// ==============================

export const markAttendanceThunk = createAsyncThunk(
  "staffManagement/markAttendance",

  async (
    input: NewAttendanceInput,
    { rejectWithValue }
  ) => {
    try {
      const record = await markAttendance(input);

      return record;
    } catch (error) {
      return rejectWithValue(
        error instanceof Error
          ? error.message
          : "Unable to save attendance"
      );
    }
  }
);

