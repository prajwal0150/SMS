import { useState } from "react";
import { Eye, EyeOff, KeyRound, Loader2, X } from "lucide-react";
import toast from "react-hot-toast";

import { changeStudentPassword } from "../services/profileService";

interface ChangePasswordModalProps {
  open: boolean;
  onClose: () => void;
}

const inputClass =
  "w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 transition focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-100 disabled:cursor-not-allowed disabled:bg-slate-50 disabled:text-slate-400";

const labelClass = "mb-1.5 block text-xs font-medium text-slate-500";

/**
 * Popup that updates the password of the logged in auth
 * account through supabase.auth.updateUser.
 */
const ChangePasswordModal = ({ open, onClose }: ChangePasswordModalProps) => {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [saving, setSaving] = useState(false);

  // Fresh form every time the popup opens.
  const [prevOpen, setPrevOpen] = useState(open);

  if (open !== prevOpen) {
    setPrevOpen(open);

    if (open) {
      setPassword("");
      setConfirmPassword("");
      setShowPassword(false);
    }
  }

  if (!open) {
    return null;
  }

  const tooShort = password.length > 0 && password.length < 6;
  const mismatch =
    confirmPassword.length > 0 && confirmPassword !== password;
  const invalid = !password || password.length < 6 || password !== confirmPassword;

  const handleSubmit = async () => {
    if (invalid || saving) {
      return;
    }

    setSaving(true);

    try {
      await changeStudentPassword(password);
      toast.success("Password updated successfully.");
      onClose();
    } catch (err) {
      toast.error(
        err instanceof Error
          ? err.message
          : "Could not update the password."
      );
    } finally {
      setSaving(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4"
      onClick={onClose}
    >
      <div
        className="w-full max-w-md overflow-hidden rounded-xl bg-white shadow-xl"
        onClick={(event) => event.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4">
          <div className="flex items-center gap-2.5">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-50 text-indigo-600">
              <KeyRound size={15} />
            </span>
            <div>
              <h2 className="text-base font-bold text-slate-900">
                Change Password
              </h2>
              <p className="mt-0.5 text-xs text-slate-400">
                Update your login password
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            disabled={saving}
            className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 transition hover:bg-slate-100 hover:text-slate-600"
          >
            <X size={17} />
          </button>
        </div>

        {/* Form */}
        <div className="space-y-4 px-5 py-5">
          <label className="block">
            <span className={labelClass}>New Password</span>
            <span className="relative block">
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                className={inputClass}
                placeholder="At least 6 characters"
                autoComplete="new-password"
              />
              <button
                type="button"
                onClick={() => setShowPassword((current) => !current)}
                className="absolute inset-y-0 right-3 flex items-center text-slate-400 transition hover:text-slate-600"
                title={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
              </button>
            </span>
          </label>

          <label className="block">
            <span className={labelClass}>Confirm New Password</span>
            <input
              type={showPassword ? "text" : "password"}
              value={confirmPassword}
              onChange={(event) => setConfirmPassword(event.target.value)}
              className={inputClass}
              placeholder="Re-enter the new password"
              autoComplete="new-password"
            />
          </label>

          {(tooShort || mismatch) && (
            <p className="text-xs font-medium text-rose-600">
              {tooShort
                ? "The password must be at least 6 characters."
                : "The passwords do not match."}
            </p>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 border-t border-slate-100 px-5 py-4">
          <button
            type="button"
            onClick={onClose}
            disabled={saving}
            className="rounded-lg border border-slate-200 px-4 py-2 text-sm font-medium text-slate-600 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSubmit}
            disabled={invalid || saving}
            className="flex items-center gap-2 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:bg-indigo-300"
          >
            {saving ? (
              <>
                <Loader2 size={15} className="animate-spin" />
                Updating...
              </>
            ) : (
              <>
                <KeyRound size={15} />
                Update Password
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChangePasswordModal;

