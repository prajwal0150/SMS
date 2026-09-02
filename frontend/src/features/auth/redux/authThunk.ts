import { createAsyncThunk } from "@reduxjs/toolkit";

import {
  registerUser,
  loginUser,
  logoutUser,
  getCurrentUser,
} from "../services/authService";

import type {
  RegisterData,
  LoginData,
} from "../types/authTypes";


// ==============================
// REGISTER
// ==============================

export const registerThunk = createAsyncThunk(
  "auth/register",

  async (
    data: RegisterData,
    { rejectWithValue }
  ) => {
    try {
      const result = await registerUser(data);

      return result;
    } catch (error) {
      return rejectWithValue(
        error instanceof Error
          ? error.message
          : "Registration failed"
      );
    }
  }
);


// ==============================
// LOGIN
// ==============================

export const loginThunk = createAsyncThunk(
  "auth/login",

  async (
    data: LoginData,
    { rejectWithValue }
  ) => {
    try {
      const result = await loginUser(data);

      return result;
    } catch (error) {
      return rejectWithValue(
        error instanceof Error
          ? error.message
          : "Login failed"
      );
    }
  }
);


// ==============================
// LOGOUT
// ==============================

export const logoutThunk = createAsyncThunk(
  "auth/logout",

  async (_, { rejectWithValue }) => {
    try {
      await logoutUser();

      return true;
    } catch (error) {
      return rejectWithValue(
        error instanceof Error
          ? error.message
          : "Logout failed"
      );
    }
  }
);


// ==============================
// GET CURRENT USER
// ==============================

export const getCurrentUserThunk =
  createAsyncThunk(
    "auth/getCurrentUser",

    async (_, { rejectWithValue }) => {
      try {
        const user = await getCurrentUser();

        return user;
      } catch (error) {
        return rejectWithValue(
          error instanceof Error
            ? error.message
            : "Unable to get current user"
        );
      }
    }
  );