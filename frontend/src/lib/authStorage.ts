/**
 * Auth session storage for Supabase that honours the
 * "Remember Me" preference:
 *
 *   - checked   → localStorage   (session survives browser restarts)
 *   - unchecked → sessionStorage (session ends with the browser/tab)
 *
 * The flag itself lives in localStorage so the choice survives a restart,
 * while the actual session is stored in whichever area is currently active.
 */

const REMEMBER_ME_KEY = "sb-remember-me";

const isRememberMe = (): boolean => {
  try {
    return window.localStorage.getItem(REMEMBER_ME_KEY) === "true";
  } catch {
    return false;
  }
};

const activeStorage = (): Storage =>
  isRememberMe() ? window.localStorage : window.sessionStorage;


/**
 * Persist the "Remember Me" preference.
 *
 * Call this right before a sign in / sign up call so the Supabase
 * client writes the newly-created session into the correct storage.
 */
export const setRememberMe = (remember: boolean): void => {
  try {
    if (remember) {
      window.localStorage.setItem(REMEMBER_ME_KEY, "true");
    } else {
      window.localStorage.removeItem(REMEMBER_ME_KEY);
    }
  } catch {
    /* storage unavailable - keep default session-only behaviour */
  }
};


interface AuthStorage {
  getItem(key: string): string | null;
  setItem(key: string, value: string): void;
  removeItem(key: string): void;
}

/**
 * Storage adapter handed to the Supabase client.
 *
 * Every auth persist/load goes through these methods, so the session
 * is routed to the correct storage based on the current flag.
 */
export const authStorage: AuthStorage = {

  getItem(key) {
    try {
      return activeStorage().getItem(key);
    } catch {
      return null;
    }
  },

  setItem(key, value) {
    try {
      const target = activeStorage();
      const other =
        target === window.localStorage
          ? window.sessionStorage
          : window.localStorage;

      // Never leave a stale session behind in the other storage.
      other.removeItem(key);

      target.setItem(key, value);
    } catch {
      /* ignore storage errors */
    }
  },

  removeItem(key) {
    try {
      window.localStorage.removeItem(key);
      window.sessionStorage.removeItem(key);
    } catch {
      /* ignore storage errors */
    }
  },
};