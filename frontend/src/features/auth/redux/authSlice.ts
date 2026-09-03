import {
  createSlice,
  type PayloadAction,
} from "@reduxjs/toolkit";

import type { User } from "@supabase/supabase-js";

import {
  registerThunk,
  loginThunk,
  logoutThunk,
  getCurrentUserThunk,
} from "./authThunk";


interface AuthState {
  user: User | null;
  loading: boolean;
  error: string | null;
  isAuthenticated: boolean;
  isSessionChecked: boolean;
}


const initialState: AuthState = {
  user: null,
  loading: false,
  error: null,
  isAuthenticated: false,
  isSessionChecked: false,
};


const authSlice = createSlice({
  name: "auth",

  initialState,

  reducers: {

    clearError: (state) => {
      state.error = null;
    },

    setUser: (
      state,
      action: PayloadAction<User | null>
    ) => {
      state.user = action.payload;

      state.isAuthenticated =
        !!action.payload;
    },

  },

  extraReducers: (builder) => {

    // =================================
    // REGISTER
    // =================================

    builder
      .addCase(
        registerThunk.pending,
        (state) => {
          state.loading = true;
          state.error = null;
        }
      )

      .addCase(
        registerThunk.fulfilled,
        (state, action) => {
          state.loading = false;

          state.user =
            action.payload.user;

          state.isAuthenticated =
            !!action.payload.session;
        }
      )

      .addCase(
        registerThunk.rejected,
        (state, action) => {
          state.loading = false;

          state.error =
            action.payload as string;
        }
      );


    // =================================
    // LOGIN
    // =================================

    builder
      .addCase(
        loginThunk.pending,
        (state) => {
          state.loading = true;
          state.error = null;
        }
      )

      .addCase(
        loginThunk.fulfilled,
        (state, action) => {
          state.loading = false;

          state.user =
            action.payload.user;

          state.isAuthenticated =
            !!action.payload.session;
        }
      )

      .addCase(
        loginThunk.rejected,
        (state, action) => {
          state.loading = false;

          state.error =
            action.payload as string;
        }
      );


    // =================================
    // LOGOUT
    // =================================

    builder
      .addCase(
        logoutThunk.pending,
        (state) => {
          state.loading = true;
          state.error = null;
        }
      )

      .addCase(
        logoutThunk.fulfilled,
        (state) => {
          state.user = null;
          state.isAuthenticated = false;
          state.loading = false;
          state.error = null;
        }
      )

      .addCase(
        logoutThunk.rejected,
        (state, action) => {
          state.loading = false;

          state.error =
            action.payload as string;
        }
      );


    // =================================
    // CURRENT USER
    // =================================

    builder
      .addCase(
        getCurrentUserThunk.pending,
        (state) => {
          state.loading = true;
        }
      )

      .addCase(
        getCurrentUserThunk.fulfilled,
        (state, action) => {
          state.loading = false;
          state.isSessionChecked = true;

          state.user = action.payload;

          state.isAuthenticated =
            !!action.payload;
        }
      )

      .addCase(
        getCurrentUserThunk.rejected,
        (state) => {
          state.loading = false;
          state.isSessionChecked = true;

          state.user = null;
          state.isAuthenticated = false;
          state.error = null;
        }
      );

  },
});


export const {
  clearError,
  setUser,
} = authSlice.actions;


export default authSlice.reducer;