import { createAsyncThunk } from "@reduxjs/toolkit";

import {
  fetchExams,
  createExam,
  deleteExam,
  fetchTimetable,
  createTimetableEntry,
  deleteTimetableEntry,
  fetchHolidays,
  createHoliday,
  deleteHoliday,
} from "../services/academicServices";

import type {
  NewExamInput,
  NewTimetableEntryInput,
  NewHolidayInput,
} from "../types/academicTypes";


// ==============================
// EXAMS
// ==============================

export const fetchExamsThunk = createAsyncThunk(
  "academic/fetchExams",

  async (_, { rejectWithValue }) => {
    try {
      return await fetchExams();
    } catch (error) {
      return rejectWithValue(
        error instanceof Error
          ? error.message
          : "Unable to load exams"
      );
    }
  }
);


export const createExamThunk = createAsyncThunk(
  "academic/createExam",

  async (
    input: NewExamInput,
    { rejectWithValue }
  ) => {
    try {
      return await createExam(input);
    } catch (error) {
      return rejectWithValue(
        error instanceof Error
          ? error.message
          : "Unable to add exam"
      );
    }
  }
);


export const deleteExamThunk = createAsyncThunk(
  "academic/deleteExam",

  async (id: string, { rejectWithValue }) => {
    try {
      await deleteExam(id);

      return id;
    } catch (error) {
      return rejectWithValue(
        error instanceof Error
          ? error.message
          : "Unable to remove exam"
      );
    }
  }
);


// ==============================
// TIMETABLE
// ==============================

export const fetchTimetableThunk = createAsyncThunk(
  "academic/fetchTimetable",

  async (_, { rejectWithValue }) => {
    try {
      return await fetchTimetable();
    } catch (error) {
      return rejectWithValue(
        error instanceof Error
          ? error.message
          : "Unable to load timetable"
      );
    }
  }
);


export const createTimetableEntryThunk = createAsyncThunk(
  "academic/createTimetableEntry",

  async (
    input: NewTimetableEntryInput,
    { rejectWithValue }
  ) => {
    try {
      return await createTimetableEntry(input);
    } catch (error) {
      return rejectWithValue(
        error instanceof Error
          ? error.message
          : "Unable to add timetable entry"
      );
    }
  }
);


export const deleteTimetableEntryThunk = createAsyncThunk(
  "academic/deleteTimetableEntry",

  async (id: string, { rejectWithValue }) => {
    try {
      await deleteTimetableEntry(id);

      return id;
    } catch (error) {
      return rejectWithValue(
        error instanceof Error
          ? error.message
          : "Unable to remove timetable entry"
      );
    }
  }
);


// ==============================
// HOLIDAYS
// ==============================

export const fetchHolidaysThunk = createAsyncThunk(
  "academic/fetchHolidays",

  async (_, { rejectWithValue }) => {
    try {
      return await fetchHolidays();
    } catch (error) {
      return rejectWithValue(
        error instanceof Error
          ? error.message
          : "Unable to load holidays"
      );
    }
  }
);


export const createHolidayThunk = createAsyncThunk(
  "academic/createHoliday",

  async (
    input: NewHolidayInput,
    { rejectWithValue }
  ) => {
    try {
      return await createHoliday(input);
    } catch (error) {
      return rejectWithValue(
        error instanceof Error
          ? error.message
          : "Unable to add holiday"
      );
    }
  }
);


export const deleteHolidayThunk = createAsyncThunk(
  "academic/deleteHoliday",

  async (id: string, { rejectWithValue }) => {
    try {
      await deleteHoliday(id);

      return id;
    } catch (error) {
      return rejectWithValue(
        error instanceof Error
          ? error.message
          : "Unable to remove holiday"
      );
    }
  }
);