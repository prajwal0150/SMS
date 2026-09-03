import { createSlice } from "@reduxjs/toolkit";

import type {
  Notice,
  Announcement,
  SchoolEvent,
} from "../types/communicationTypes";

import {
  fetchNoticesThunk,
  createNoticeThunk,
  deleteNoticeThunk,
  fetchAnnouncementsThunk,
  createAnnouncementThunk,
  deleteAnnouncementThunk,
  fetchEventsThunk,
  createEventThunk,
  deleteEventThunk,
} from "./communicationThunk";


interface CommunicationState {
  notices: Notice[];
  announcements: Announcement[];
  events: SchoolEvent[];
  loading: boolean;
  saving: boolean;
  error: string | null;
}


const initialState: CommunicationState = {
  notices: [],
  announcements: [],
  events: [],
  loading: false,
  saving: false,
  error: null,
};


const communicationSlice = createSlice({
  name: "communication",

  initialState,

  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },

  extraReducers: (builder) => {

    // =================================
    // NOTICES
    // =================================

    builder
      .addCase(
        fetchNoticesThunk.pending,
        (state) => {
          state.loading = true;
          state.error = null;
        }
      )

      .addCase(
        fetchNoticesThunk.fulfilled,
        (state, action) => {
          state.loading = false;
          state.notices = action.payload;
        }
      )

      .addCase(
        fetchNoticesThunk.rejected,
        (state, action) => {
          state.loading = false;
          state.error = action.payload as string;
        }
      );

    builder
      .addCase(
        createNoticeThunk.pending,
        (state) => {
          state.saving = true;
        }
      )

      .addCase(
        createNoticeThunk.fulfilled,
        (state, action) => {
          state.saving = false;
          state.notices.unshift(action.payload);
        }
      )

      .addCase(
        createNoticeThunk.rejected,
        (state) => {
          state.saving = false;
        }
      );

    builder.addCase(
      deleteNoticeThunk.fulfilled,
      (state, action) => {
        state.notices = state.notices.filter(
          (notice) => notice.id !== action.payload
        );
      }
    );


    // =================================
    // ANNOUNCEMENTS
    // =================================

    builder
      .addCase(
        fetchAnnouncementsThunk.pending,
        (state) => {
          state.loading = true;
        }
      )

      .addCase(
        fetchAnnouncementsThunk.fulfilled,
        (state, action) => {
          state.loading = false;
          state.announcements = action.payload;
        }
      )

      .addCase(
        fetchAnnouncementsThunk.rejected,
        (state) => {
          state.loading = false;
        }
      );

    builder
      .addCase(
        createAnnouncementThunk.pending,
        (state) => {
          state.saving = true;
        }
      )

      .addCase(
        createAnnouncementThunk.fulfilled,
        (state, action) => {
          state.saving = false;
          state.announcements.unshift(action.payload);
        }
      )

      .addCase(
        createAnnouncementThunk.rejected,
        (state) => {
          state.saving = false;
        }
      );

    builder.addCase(
      deleteAnnouncementThunk.fulfilled,
      (state, action) => {
        state.announcements = state.announcements.filter(
          (announcement) => announcement.id !== action.payload
        );
      }
    );


    // =================================
    // EVENTS
    // =================================

    builder
      .addCase(
        fetchEventsThunk.pending,
        (state) => {
          state.loading = true;
        }
      )

      .addCase(
        fetchEventsThunk.fulfilled,
        (state, action) => {
          state.loading = false;
          state.events = action.payload;
        }
      )

      .addCase(
        fetchEventsThunk.rejected,
        (state) => {
          state.loading = false;
        }
      );

    builder
      .addCase(
        createEventThunk.pending,
        (state) => {
          state.saving = true;
        }
      )

      .addCase(
        createEventThunk.fulfilled,
        (state, action) => {
          state.saving = false;
          state.events.unshift(action.payload);
        }
      )

      .addCase(
        createEventThunk.rejected,
        (state) => {
          state.saving = false;
        }
      );

    builder.addCase(
      deleteEventThunk.fulfilled,
      (state, action) => {
        state.events = state.events.filter(
          (event) => event.id !== action.payload
        );
      }
    );
  },
});


export const {
  clearError,
} = communicationSlice.actions;


export default communicationSlice.reducer;
