import { createAsyncThunk } from "@reduxjs/toolkit";

import {
  fetchStudents,
  createStudent,
  deleteStudent,
  fetchPromotions,
  promoteStudents,
  fetchDocuments,
  createDocument,
  deleteDocument,
} from "../services/studentManagmentServices";

import type {
  NewStudentInput,
  PromotionInput,
  NewDocumentInput,
} from "../types/studentManagmentTypes";


// ==============================
// FETCH STUDENTS
// ==============================

export const fetchStudentsThunk = createAsyncThunk(
  "studentManagement/fetchStudents",

  async (_, { rejectWithValue }) => {
    try {
      return await fetchStudents();
    } catch (error) {
      return rejectWithValue(
        error instanceof Error
          ? error.message
          : "Unable to load students"
      );
    }
  }
);


// ==============================
// CREATE STUDENT
// ==============================

export const createStudentThunk = createAsyncThunk(
  "studentManagement/createStudent",

  async (
    input: NewStudentInput,
    { rejectWithValue }
  ) => {
    try {
      return await createStudent(input);
    } catch (error) {
      return rejectWithValue(
        error instanceof Error
          ? error.message
          : "Unable to add student"
      );
    }
  }
);


// ==============================
// DELETE STUDENT
// ==============================

export const deleteStudentThunk = createAsyncThunk(
  "studentManagement/deleteStudent",

  async (id: string, { rejectWithValue }) => {
    try {
      await deleteStudent(id);

      return id;
    } catch (error) {
      return rejectWithValue(
        error instanceof Error
          ? error.message
          : "Unable to remove student"
      );
    }
  }
);


// ==============================
// FETCH PROMOTIONS
// ==============================

export const fetchPromotionsThunk = createAsyncThunk(
  "studentManagement/fetchPromotions",

  async (_, { rejectWithValue }) => {
    try {
      return await fetchPromotions();
    } catch (error) {
      return rejectWithValue(
        error instanceof Error
          ? error.message
          : "Unable to load promotions"
      );
    }
  }
);


// ==============================
// PROMOTE STUDENTS
// ==============================

export const promoteStudentsThunk = createAsyncThunk(
  "studentManagement/promoteStudents",

  async (
    input: PromotionInput,
    { rejectWithValue }
  ) => {
    try {
      await promoteStudents(input);

      return input;
    } catch (error) {
      return rejectWithValue(
        error instanceof Error
          ? error.message
          : "Unable to promote students"
      );
    }
  }
);


// ==============================
// FETCH DOCUMENTS
// ==============================

export const fetchDocumentsThunk = createAsyncThunk(
  "studentManagement/fetchDocuments",

  async (_, { rejectWithValue }) => {
    try {
      return await fetchDocuments();
    } catch (error) {
      return rejectWithValue(
        error instanceof Error
          ? error.message
          : "Unable to load documents"
      );
    }
  }
);


// ==============================
// CREATE DOCUMENT
// ==============================

export const createDocumentThunk = createAsyncThunk(
  "studentManagement/createDocument",

  async (
    input: NewDocumentInput,
    { rejectWithValue }
  ) => {
    try {
      return await createDocument(input);
    } catch (error) {
      return rejectWithValue(
        error instanceof Error
          ? error.message
          : "Unable to add document"
      );
    }
  }
);


// ==============================
// DELETE DOCUMENT
// ==============================

export const deleteDocumentThunk = createAsyncThunk(
  "studentManagement/deleteDocument",

  async (id: string, { rejectWithValue }) => {
    try {
      await deleteDocument(id);

      return id;
    } catch (error) {
      return rejectWithValue(
        error instanceof Error
          ? error.message
          : "Unable to remove document"
      );
    }
  }
);
