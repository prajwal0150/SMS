import { createAsyncThunk } from "@reduxjs/toolkit";

import {
  fetchNotices,
  createNotice,
  deleteNotice,
  fetchAnnouncements,
  createAnnouncement,
  deleteAnnouncement,
  fetchEvents,
  createEvent,
  deleteEvent,
} from "../services/communicationServices";

import type {
  NewNoticeInput,
  NewAnnouncementInput,
  NewEventInput,
} from "../types/communicationTypes";


// ==============================
// NOTICES
// ==============================

export const fetchNoticesThunk = createAsyncThunk(
  "communication/fetchNotices",

  async (_, { rejectWithValue }) => {
    try {
      return await fetchNotices();
    } catch (error) {
      return rejectWithValue(
        error instanceof Error
          ? error.message
          : "Unable to load notices"
      );
    }
  }
);


export const createNoticeThunk = createAsyncThunk(
  "communication/createNotice",

  async (
    input: NewNoticeInput,
    { rejectWithValue }
  ) => {
    try {
      return await createNotice(input);
    } catch (error) {
      return rejectWithValue(
        error instanceof Error
          ? error.message
          : "Unable to add notice"
      );
    }
  }
);


export const deleteNoticeThunk = createAsyncThunk(
  "communication/deleteNotice",

  async (id: string, { rejectWithValue }) => {
    try {
      await deleteNotice(id);

      return id;
    } catch (error) {
      return rejectWithValue(
        error instanceof Error
          ? error.message
          : "Unable to remove notice"
      );
    }
  }
);


// ==============================
// ANNOUNCEMENTS
// ==============================

export const fetchAnnouncementsThunk = createAsyncThunk(
  "communication/fetchAnnouncements",

  async (_, { rejectWithValue }) => {
    try {
      return await fetchAnnouncements();
    } catch (error) {
      return rejectWithValue(
        error instanceof Error
          ? error.message
          : "Unable to load announcements"
      );
    }
  }
);


export const createAnnouncementThunk = createAsyncThunk(
  "communication/createAnnouncement",

  async (
    input: NewAnnouncementInput,
    { rejectWithValue }
  ) => {
    try {
      return await createAnnouncement(input);
    } catch (error) {
      return rejectWithValue(
        error instanceof Error
          ? error.message
          : "Unable to add announcement"
      );
    }
  }
);


export const deleteAnnouncementThunk = createAsyncThunk(
  "communication/deleteAnnouncement",

  async (id: string, { rejectWithValue }) => {
    try {
      await deleteAnnouncement(id);

      return id;
    } catch (error) {
      return rejectWithValue(
        error instanceof Error
          ? error.message
          : "Unable to remove announcement"
      );
    }
  }
);


// ==============================
// EVENTS
// ==============================

export const fetchEventsThunk = createAsyncThunk(
  "communication/fetchEvents",

  async (_, { rejectWithValue }) => {
    try {
      return await fetchEvents();
    } catch (error) {
      return rejectWithValue(
        error instanceof Error
          ? error.message
          : "Unable to load events"
      );
    }
  }
);


export const createEventThunk = createAsyncThunk(
  "communication/createEvent",

  async (
    input: NewEventInput,
    { rejectWithValue }
  ) => {
    try {
      return await createEvent(input);
    } catch (error) {
      return rejectWithValue(
        error instanceof Error
          ? error.message
          : "Unable to add event"
      );
    }
  }
);


export const deleteEventThunk = createAsyncThunk(
  "communication/deleteEvent",

  async (id: string, { rejectWithValue }) => {
    try {
      await deleteEvent(id);

      return id;
    } catch (error) {
      return rejectWithValue(
        error instanceof Error
          ? error.message
          : "Unable to remove event"
      );
    }
  }
);