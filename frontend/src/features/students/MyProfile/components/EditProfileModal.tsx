import { useState } from "react";
import { AlertCircle, Loader2, Save, X } from "lucide-react";

import type { ProfileEditInput, StudentProfileData } from "../types/profileTypes";

interface EditProfileModalProps {
  open: boolean;
  profile: StudentProfileData;
  saving: boolean;
  onClose: () => void;
  onSave: (input: ProfileEditInput) => Promise<boolean>;
}

const inputClass =
  "w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 transition focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-100 disabled:cursor-not-allowed disabled:bg-slate-50 disabled:text-slate-400";

const labelClass = "mb-1.5 block text-xs font-medium text-slate-500";

const sectionClass =
  "text-[11px] font-bold uppercase tracking-wider text-slate-400";

const GENDER_OPTIONS = [
  { value: "", label: "Not set" },
  { value: "male", label: "Male" },
  { value: "female", label: "Female" },
  { value: "other", label: "Other" },
];

const BLOOD_GROUP_OPTIONS = [
  "A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-",
];

/**
 * Popup form for editing the student's personal, address and
 * family details (saved through update_my_student_profile).
 */
const EditProfileModal = ({
  open,
  profile,
  saving,
  onClose,
  onSave,
}: EditProfileModalProps) => {
  const [firstName, setFirstName] = useState("");
  const [middleName, setMiddleName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phone, setPhone] = useState("");
  const [gender, setGender] = useState("");
  const [dateOfBirth, setDateOfBirth] = useState("");
  const [bloodGroup, setBloodGroup] = useState("");
  const [category, setCategory] = useState("");
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [stateName, setStateName] = useState("");
  const [postalCode, setPostalCode] = useState("");
  const [fatherName, setFatherName] = useState("");
  const [motherName, setMotherName] = useState("");
  const [guardianName, setGuardianName] = useState("");
  const [guardianPhone, setGuardianPhone] = useState("");

  // Fresh form every time the popup opens, pre-filled with
  // the current profile.
  const [prevOpen, setPrevOpen] = useState(open);

  if (open !== prevOpen) {
    setPrevOpen(open);

    if (open) {
      setFirstName(profile.first_name);
      setMiddleName(profile.middle_name ?? "");
      setLastName(profile.last_name);
      setPhone(profile.phone ?? "");
      setGender(profile.gender ?? "");
      setDateOfBirth(profile.date_of_birth ?? "");
      setBloodGroup(profile.blood_group ?? "");
      setCategory(profile.category ?? "");
      setAddress(profile.address ?? "");
      setCity(profile.city ?? "");
      setStateName(profile.state ?? "");
      setPostalCode(profile.postal_code ?? "");
      setFatherName(profile.father_name ?? "");
      setMotherName(profile.mother_name ?? "");
      setGuardianName(profile.guardian_name ?? "");
      setGuardianPhone(profile.guardian_phone ?? "");
    }
  }

  if (!open) {
    return null;
  }

  const namesMissing = !firstName.trim() || !lastName.trim();

  const handleSubmit = async () => {
    if (namesMissing || saving) {
      return;
    }

    await onSave({
      first_name: firstName.trim(),
      middle_name: middleName.trim() || null,
      last_name: lastName.trim(),
      phone: phone.trim() || null,
      gender: gender || null,
      date_of_birth: dateOfBirth || null,
      blood_group: bloodGroup || null,
      category: category.trim() || null,
      address: address.trim() || null,
      city: city.trim() || null,
      state: stateName.trim() || null,
      postal_code: postalCode.trim() || null,
      father_name: fatherName.trim() || null,
      mother_name: motherName.trim() || null,
      guardian_name: guardianName.trim() || null,
      guardian_phone: guardianPhone.trim() || null,
    });
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4"
      onClick={onClose}
    >
      <div
        className="flex max-h-[90vh] w-full max-w-2xl flex-col overflow-hidden rounded-xl bg-white shadow-xl"
        onClick={(event) => event.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4">
          <div>
            <h2 className="text-base font-bold text-slate-900">
              Update Profile
            </h2>
            <p className="mt-0.5 text-xs text-slate-400">
              Edit your personal information
            </p>
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
        <div className="flex-1 space-y-5 overflow-y-auto px-5 py-5">
          {/* Basic details */}
          <div className="space-y-3">
            <p className={sectionClass}>Basic Details</p>
            <div className="grid gap-3 sm:grid-cols-3">
              <label className="block">
                <span className={labelClass}>First Name *</span>
                <input
                  type="text"
                  value={firstName}
                  onChange={(event) => setFirstName(event.target.value)}
                  className={inputClass}
                  placeholder="First name"
                />
              </label>
              <label className="block">
                <span className={labelClass}>Middle Name</span>
                <input
                  type="text"
                  value={middleName}
                  onChange={(event) => setMiddleName(event.target.value)}
                  className={inputClass}
                  placeholder="Middle name"
                />
              </label>
              <label className="block">
                <span className={labelClass}>Last Name *</span>
                <input
                  type="text"
                  value={lastName}
                  onChange={(event) => setLastName(event.target.value)}
                  className={inputClass}
                  placeholder="Last name"
                />
              </label>
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              <label className="block">
                <span className={labelClass}>Phone</span>
                <input
                  type="tel"
                  value={phone}
                  onChange={(event) => setPhone(event.target.value)}
                  className={inputClass}
                  placeholder="Phone number"
                />
              </label>
              <label className="block">
                <span className={labelClass}>Gender</span>
                <select
                  value={gender}
                  onChange={(event) => setGender(event.target.value)}
                  className={inputClass}
                >
                  {GENDER_OPTIONS.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </label>
              <label className="block">
                <span className={labelClass}>Date of Birth</span>
                <input
                  type="date"
                  value={dateOfBirth}
                  onChange={(event) => setDateOfBirth(event.target.value)}
                  className={inputClass}
                />
              </label>
              <label className="block">
                <span className={labelClass}>Blood Group</span>
                <select
                  value={bloodGroup}
                  onChange={(event) => setBloodGroup(event.target.value)}
                  className={inputClass}
                >
                  <option value="">Not set</option>
                  {BLOOD_GROUP_OPTIONS.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              </label>
              <label className="block sm:col-span-2">
                <span className={labelClass}>Category</span>
                <input
                  type="text"
                  value={category}
                  onChange={(event) => setCategory(event.target.value)}
                  className={inputClass}
                  placeholder="General, OBC, SC, ..."
                />
              </label>
            </div>
          </div>

          {/* Address */}
          <div className="space-y-3">
            <p className={sectionClass}>Address</p>
            <label className="block">
              <span className={labelClass}>Address</span>
              <input
                type="text"
                value={address}
                onChange={(event) => setAddress(event.target.value)}
                className={inputClass}
                placeholder="House / street / area"
              />
            </label>
            <div className="grid gap-3 sm:grid-cols-3">
              <label className="block">
                <span className={labelClass}>City</span>
                <input
                  type="text"
                  value={city}
                  onChange={(event) => setCity(event.target.value)}
                  className={inputClass}
                />
              </label>
              <label className="block">
                <span className={labelClass}>State</span>
                <input
                  type="text"
                  value={stateName}
                  onChange={(event) => setStateName(event.target.value)}
                  className={inputClass}
                />
              </label>
              <label className="block">
                <span className={labelClass}>Postal Code</span>
                <input
                  type="text"
                  value={postalCode}
                  onChange={(event) => setPostalCode(event.target.value)}
                  className={inputClass}
                />
              </label>
            </div>
          </div>


          {/* Family information */}
          <div className="space-y-3">
            <p className={sectionClass}>Family Information</p>
            <div className="grid gap-3 sm:grid-cols-2">
              <label className="block">
                <span className={labelClass}>Father's Name</span>
                <input
                  type="text"
                  value={fatherName}
                  onChange={(event) => setFatherName(event.target.value)}
                  className={inputClass}
                />
              </label>
              <label className="block">
                <span className={labelClass}>Mother's Name</span>
                <input
                  type="text"
                  value={motherName}
                  onChange={(event) => setMotherName(event.target.value)}
                  className={inputClass}
                />
              </label>
              <label className="block">
                <span className={labelClass}>Guardian Name</span>
                <input
                  type="text"
                  value={guardianName}
                  onChange={(event) => setGuardianName(event.target.value)}
                  className={inputClass}
                />
              </label>
              <label className="block">
                <span className={labelClass}>Guardian Phone</span>
                <input
                  type="tel"
                  value={guardianPhone}
                  onChange={(event) => setGuardianPhone(event.target.value)}
                  className={inputClass}
                />
              </label>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center gap-3 border-t border-slate-100 px-5 py-4">
          {namesMissing && !saving && (
            <p className="mr-auto flex items-center gap-1.5 text-xs font-medium text-rose-600">
              <AlertCircle size={13} />
              First name and last name are required.
            </p>
          )}

          <button
            type="button"
            onClick={onClose}
            disabled={saving}
            className="ml-auto rounded-lg border border-slate-200 px-4 py-2 text-sm font-medium text-slate-600 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSubmit}
            disabled={namesMissing || saving}
            className="flex items-center gap-2 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:bg-indigo-300"
          >
            {saving ? (
              <>
                <Loader2 size={15} className="animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Save size={15} />
                Save Changes
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditProfileModal;

