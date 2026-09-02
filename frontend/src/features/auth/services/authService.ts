import { supabase } from "../../../lib/supabase";

import { setRememberMe } from "../../../lib/authStorage";

import type {
  LoginData,
  RegisterData,
} from "../types/authTypes";


// ==============================
// REGISTER
// ==============================

export const registerUser = async (
  data: RegisterData
) => {
  const { data: authData, error } =
    await supabase.auth.signUp({
      email: data.email,
      password: data.password,

      options: {
        data: {
          full_name: data.fullName,
        },
      },
    });

  if (error) {
    throw new Error(error.message);
  }

  return authData;
};


// ==============================
// LOGIN
// ==============================

export const loginUser = async (
  data: LoginData
) => {
  setRememberMe(!!data.rememberMe);

  const { data: authData, error } =
    await supabase.auth.signInWithPassword({
      email: data.email,
      password: data.password,
    });

  if (error) {
    throw new Error(error.message);
  }

  return authData;
};


// ==============================
// LOGOUT
// ==============================

export const logoutUser = async () => {
  const { error } =
    await supabase.auth.signOut();

  if (error) {
    throw new Error(error.message);
  }
};


// ==============================
// CURRENT USER
// ==============================

export const getCurrentUser = async () => {
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error) {
    throw new Error(error.message);
  }

  return user;
};