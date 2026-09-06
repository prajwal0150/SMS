import { supabase } from "../../../lib/supabase";

import { setRememberMe } from "../../../lib/authStorage";

import type {
  User,
  Session,
} from "@supabase/supabase-js";

import type {
  LoginData,
  RegisterData,
} from "../types/authTypes";


// ==============================
// DEMO ADMIN
// ==============================

export const ADMIN_EMAIL =
  "schoolAdmin@gmail.com";

export const ADMIN_PASSWORD = "admin123@";

const DEMO_ADMIN_SESSION_KEY =
  "sb-demo-admin";

export const isAdminEmail = (
  email?: string | null
): boolean =>
  (email ?? "")
    .trim()
    .toLowerCase() ===
  ADMIN_EMAIL.toLowerCase();


// ==============================
// ROLE-BASED HOME PATH
// ==============================

interface UserLike {
  email?: string | null;
  user_metadata?: {
    role?: string | null;
  } | null;
}

// Where each account type lands after signing in:
// admins -> admin panel, students -> student panel,
// everything else -> teacher panel.
export const getUserHomePath = (
  user?: UserLike | null
): string => {
  if (isAdminEmail(user?.email)) {
    return "/admin/dashboard";
  }

  if (user?.user_metadata?.role === "student") {
    return "/student";
  }

  return "/teacher";
};


const createDemoAdminResult = (): {
  user: User;
  session: Session;
} => {
  const user = {
    id: "demo-admin",
    email: ADMIN_EMAIL,
    user_metadata: {
      full_name: "School Admin",
      role: "admin",
    },
    app_metadata: {
      provider: "email",
      role: "admin",
    },
    created_at: new Date().toISOString(),
  } as unknown as User;

  const session = {
    access_token: "demo-admin-session",
    refresh_token: "demo-admin-session",
  } as unknown as Session;

  return { user, session };
};


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
  // Demo admin login - no Supabase account required.
  if (
    isAdminEmail(data.email) &&
    data.password === ADMIN_PASSWORD
  ) {
    try {
      window.localStorage.setItem(
        DEMO_ADMIN_SESSION_KEY,
        "true"
      );
    } catch {
      /* storage unavailable */
    }

    return createDemoAdminResult();
  }

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
  try {
    window.localStorage.removeItem(
      DEMO_ADMIN_SESSION_KEY
    );
  } catch {
    /* storage unavailable */
  }

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
  try {
    if (
      window.localStorage.getItem(
        DEMO_ADMIN_SESSION_KEY
      ) === "true"
    ) {
      return createDemoAdminResult().user;
    }
  } catch {
    /* storage unavailable */
  }

  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error) {
    throw new Error(error.message);
  }

  return user;
};