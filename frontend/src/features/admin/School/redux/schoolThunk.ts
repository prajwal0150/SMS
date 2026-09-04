import { createAsyncThunk } from "@reduxjs/toolkit";

import {
  assignSubjectToClass,
  createClass,
  createSection,
  createSubject,
  deleteClass,
  deleteSection,
  fetchClasses,
  fetchClassSubjects,
  fetchSections,
  fetchSubjects,
  removeClassSubject,
} from "../services/schoolServices";

import type {
  AttachSubjectInput,
  NewClassInput,
  NewSectionInput,
  NewSubjectInput,
} from "../types/schoolTypes";


// ==============================
// CLASSES
// ==============================

export const fetchClassesThunk = createAsyncThunk(
  "school/fetchClasses",

  async (_, { rejectWithValue }) => {
    try {
      return await fetchClasses();
    } catch (error) {
      return rejectWithValue(
        error instanceof Error
          ? error.message
          : "Unable to load classes"
      );
    }
  }
);


export const createClassThunk = createAsyncThunk(
  "school/createClass",

  async (
    input: NewClassInput,
    { rejectWithValue }
  ) => {
    try {
      return await createClass(input);
    } catch (error) {
      return rejectWithValue(
        error instanceof Error
          ? error.message
          : "Unable to add class"
      );
    }
  }
);


export const deleteClassThunk = createAsyncThunk(
  "school/deleteClass",

  async (id: string, { rejectWithValue }) => {
    try {
      await deleteClass(id);

      return id;
    } catch (error) {
      return rejectWithValue(
        error instanceof Error
          ? error.message
          : "Unable to remove class"
      );
    }
  }
);


// ==============================
// SECTIONS
// ==============================

export const fetchSectionsThunk = createAsyncThunk(
  "school/fetchSections",

  async (_, { rejectWithValue }) => {
    try {
      return await fetchSections();
    } catch (error) {
      return rejectWithValue(
        error instanceof Error
          ? error.message
          : "Unable to load sections"
      );
    }
  }
);


export const createSectionThunk = createAsyncThunk(
  "school/createSection",

  async (
    input: NewSectionInput,
    { rejectWithValue }
  ) => {
    try {
      return await createSection(input);
    } catch (error) {
      return rejectWithValue(
        error instanceof Error
          ? error.message
          : "Unable to add section"
      );
    }
  }
);


export const deleteSectionThunk = createAsyncThunk(
  "school/deleteSection",

  async (id: string, { rejectWithValue }) => {
    try {
      await deleteSection(id);

      return id;
    } catch (error) {
      return rejectWithValue(
        error instanceof Error
          ? error.message
          : "Unable to remove section"
      );
    }
  }
);


// ==============================
// SUBJECTS (master list)
// ==============================

export const fetchSubjectsThunk = createAsyncThunk(
  "school/fetchSubjects",

  async (_, { rejectWithValue }) => {
    try {
      return await fetchSubjects();
    } catch (error) {
      return rejectWithValue(
        error instanceof Error
          ? error.message
          : "Unable to load subjects"
      );
    }
  }
);


export const createSubjectThunk = createAsyncThunk(
  "school/createSubject",

  async (
    input: NewSubjectInput,
    { rejectWithValue }
  ) => {
    try {
      return await createSubject(input);
    } catch (error) {
      return rejectWithValue(
        error instanceof Error
          ? error.message
          : "Unable to create subject"
      );
    }
  }
);


// ==============================
// CLASS SUBJECTS
// ==============================

export const fetchClassSubjectsThunk = createAsyncThunk(
  "school/fetchClassSubjects",

  async (classId: string, { rejectWithValue }) => {
    try {
      return await fetchClassSubjects(classId);
    } catch (error) {
      return rejectWithValue(
        error instanceof Error
          ? error.message
          : "Unable to load class subjects"
      );
    }
  }
);


export const attachSubjectThunk = createAsyncThunk(
  "school/attachSubject",

  async (
    input: AttachSubjectInput,
    { rejectWithValue }
  ) => {
    try {
      return await assignSubjectToClass(input);
    } catch (error) {
      return rejectWithValue(
        error instanceof Error
          ? error.message
          : "Unable to assign subject"
      );
    }
  }
);


export const removeClassSubjectThunk = createAsyncThunk(
  "school/removeClassSubject",

  async (id: string, { rejectWithValue }) => {
    try {
      await removeClassSubject(id);

      return id;
    } catch (error) {
      return rejectWithValue(
        error instanceof Error
          ? error.message
          : "Unable to remove subject"
      );
    }
  }
);