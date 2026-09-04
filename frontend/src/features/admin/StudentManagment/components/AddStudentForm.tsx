import { useState } from "react";
import { UserPlus } from "lucide-react";

import Card from "../../dashboard/components/Card";

import { useSchoolLookups } from "../../School/hooks/useSchoolLookups";

import type {
  NewStudentInput,
  StudentGender,
  StudentStatus,
  BloodGroup,
} from "../types/studentManagmentTypes";


const inputClass =
  "h-11 w-full rounded-lg border border-slate-200 bg-slate-50/70 px-4 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-[#166534] focus:bg-white focus:ring-4 focus:ring-[#166534]/10";


interface AddStudentFormProps {
  saving: boolean;
  onSave: (input: NewStudentInput) => Promise<boolean>;
}

const todayString = (): string =>
  new Date().toISOString().slice(0, 10);

const currentYear = new Date().getFullYear();

const BLOOD_GROUPS: BloodGroup[] = [
  "A+",
  "A-",
  "B+",
  "B-",
  "AB+",
  "AB-",
  "O+",
  "O-",
];


const SectionLabel = ({
  children,
}: {
  children: React.ReactNode;
}) => (
  <p className="mb-3 text-xs font-bold uppercase tracking-[0.15em] text-[#1E3A5F]">
    {children}
  </p>
);


const AddStudentForm = ({
  saving,
  onSave,
}: AddStudentFormProps) => {

  const [firstName, setFirstName] = useState("");
  const [middleName, setMiddleName] = useState("");
  const [lastName, setLastName] = useState("");
  const [gender, setGender] =
    useState<StudentGender>("male");
  const [dateOfBirth, setDateOfBirth] = useState("");
  const [bloodGroup, setBloodGroup] =
    useState<BloodGroup | "">("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [stateName, setStateName] = useState("");
  const [postalCode, setPostalCode] = useState("");

  const [rollNumber, setRollNumber] = useState("");
  const [admissionNumber, setAdmissionNumber] = useState("");
  const [classId, setClassId] = useState("");
  const [section, setSection] = useState("");
  const [admissionYear, setAdmissionYear] =
    useState<number>(currentYear);
  const [admissionDate, setAdmissionDate] =
    useState(todayString());

  const { classes, classSections, loading } =
    useSchoolLookups(classId);

  const selectedClassName =
    classes.find((item) => item.id === classId)?.class_name ?? "";

  const [fatherName, setFatherName] = useState("");
  const [motherName, setMotherName] = useState("");
  const [guardianName, setGuardianName] = useState("");
  const [guardianPhone, setGuardianPhone] = useState("");
  const [status, setStatus] =
    useState<StudentStatus>("active");


  const reset = () => {
    setFirstName("");
    setMiddleName("");
    setLastName("");
    setGender("male");
    setDateOfBirth("");
    setBloodGroup("");
    setEmail("");
    setPhone("");
    setAddress("");
    setCity("");
    setStateName("");
    setPostalCode("");
    setRollNumber("");
    setAdmissionNumber("");
    setClassId("");
    setSection("");
    setAdmissionYear(currentYear);
    setAdmissionDate(todayString());
    setFatherName("");
    setMotherName("");
    setGuardianName("");
    setGuardianPhone("");
    setStatus("active");
  };


  const handleSubmit = async (
    event: React.FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();

    const success = await onSave({
      first_name: firstName.trim(),
      middle_name: middleName.trim() || undefined,
      last_name: lastName.trim(),
      gender,
      date_of_birth: dateOfBirth || undefined,
      blood_group: bloodGroup || undefined,
      email: email.trim() || undefined,
      phone: phone.trim() || undefined,
      address: address.trim() || undefined,
      city: city.trim() || undefined,
      state: stateName.trim() || undefined,
      postal_code: postalCode.trim() || undefined,
      roll_number: rollNumber.trim() || undefined,
      admission_number: admissionNumber.trim(),
      class_name: selectedClassName,
      section: section || undefined,
      admission_year: admissionYear,
      admission_date: admissionDate,
      father_name: fatherName.trim() || undefined,
      mother_name: motherName.trim() || undefined,
      guardian_name: guardianName.trim() || undefined,
      guardian_phone: guardianPhone.trim() || undefined,
      status,
    });

    if (success) {
      reset();
    }
  };


  return (
    <Card
      title="Add Student"
      subtitle="Create a new student record"
    >
      <form onSubmit={handleSubmit}>

        {/* Personal details */}
        <SectionLabel>Personal Details</SectionLabel>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <label htmlFor="sFirstName" className="mb-2 block text-sm font-semibold text-slate-700">
              First name
            </label>
            <input
              id="sFirstName"
              type="text"
              value={firstName}
              onChange={(event) => setFirstName(event.target.value)}
              required
              className={inputClass}
            />
          </div>

          <div>
            <label htmlFor="sMiddleName" className="mb-2 block text-sm font-semibold text-slate-700">
              Middle name
            </label>
            <input
              id="sMiddleName"
              type="text"
              value={middleName}
              onChange={(event) => setMiddleName(event.target.value)}
              className={inputClass}
            />
          </div>

          <div>
            <label htmlFor="sLastName" className="mb-2 block text-sm font-semibold text-slate-700">
              Last name
            </label>
            <input
              id="sLastName"
              type="text"
              value={lastName}
              onChange={(event) => setLastName(event.target.value)}
              required
              className={inputClass}
            />
          </div>

          <div>
            <label htmlFor="sGender" className="mb-2 block text-sm font-semibold text-slate-700">
              Gender
            </label>
            <select
              id="sGender"
              value={gender}
              onChange={(event) => setGender(event.target.value as StudentGender)}
              className={inputClass}
            >
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="other">Other</option>
            </select>
          </div>

          <div>
            <label htmlFor="sDob" className="mb-2 block text-sm font-semibold text-slate-700">
              Date of birth
            </label>
            <input
              id="sDob"
              type="date"
              value={dateOfBirth}
              onChange={(event) => setDateOfBirth(event.target.value)}
              className={inputClass}
            />
          </div>

          <div>
            <label htmlFor="sBlood" className="mb-2 block text-sm font-semibold text-slate-700">
              Blood group
            </label>
            <select
              id="sBlood"
              value={bloodGroup}
              onChange={(event) => setBloodGroup(event.target.value as BloodGroup | "")}
              className={inputClass}
            >
              <option value="">Select</option>
              {BLOOD_GROUPS.map((group) => (
                <option key={group} value={group}>
                  {group}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Contact details */}
        <SectionLabel>Contact Details</SectionLabel>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <div>
            <label htmlFor="sEmail" className="mb-2 block text-sm font-semibold text-slate-700">
              Email
            </label>
            <input
              id="sEmail"
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              className={inputClass}
            />
          </div>

          <div>
            <label htmlFor="sPhone" className="mb-2 block text-sm font-semibold text-slate-700">
              Phone
            </label>
            <input
              id="sPhone"
              type="tel"
              value={phone}
              onChange={(event) => setPhone(event.target.value)}
              className={inputClass}
            />
          </div>

          <div>
            <label htmlFor="sCity" className="mb-2 block text-sm font-semibold text-slate-700">
              City
            </label>
            <input
              id="sCity"
              type="text"
              value={city}
              onChange={(event) => setCity(event.target.value)}
              className={inputClass}
            />
          </div>

          <div>
            <label htmlFor="sState" className="mb-2 block text-sm font-semibold text-slate-700">
              State
            </label>
            <input
              id="sState"
              type="text"
              value={stateName}
              onChange={(event) => setStateName(event.target.value)}
              className={inputClass}
            />
          </div>

          <div>
            <label htmlFor="sPostal" className="mb-2 block text-sm font-semibold text-slate-700">
              Postal code
            </label>
            <input
              id="sPostal"
              type="text"
              value={postalCode}
              onChange={(event) => setPostalCode(event.target.value)}
              className={inputClass}
            />
          </div>

          <div className="sm:col-span-2 lg:col-span-3">
            <label htmlFor="sAddress" className="mb-2 block text-sm font-semibold text-slate-700">
              Address
            </label>
            <input
              id="sAddress"
              type="text"
              value={address}
              onChange={(event) => setAddress(event.target.value)}
              className={inputClass}
            />
          </div>
        </div>

        {/* Academic details */}
        <SectionLabel>Academic Details</SectionLabel>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <label htmlFor="sRoll" className="mb-2 block text-sm font-semibold text-slate-700">
              Roll number
            </label>
            <input
              id="sRoll"
              type="text"
              value={rollNumber}
              onChange={(event) => setRollNumber(event.target.value)}
              className={inputClass}
            />
          </div>

          <div>
            <label htmlFor="sAdmNo" className="mb-2 block text-sm font-semibold text-slate-700">
              Admission number
            </label>
            <input
              id="sAdmNo"
              type="text"
              value={admissionNumber}
              onChange={(event) => setAdmissionNumber(event.target.value)}
              required
              placeholder="e.g. ADM-2024-011"
              className={inputClass}
            />
          </div>

          <div>
            <label htmlFor="sClass" className="mb-2 block text-sm font-semibold text-slate-700">
              Class
            </label>
            <select
              id="sClass"
              value={classId}
              onChange={(event) => {
                setClassId(event.target.value);
                setSection("");
              }}
              required
              className={inputClass}
            >
              <option value="">
                {loading ? "Loading classes..." : "Select class"}
              </option>
              {classes.map((item) => (
                <option key={item.id} value={item.id}>
                  {item.class_name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="sSection" className="mb-2 block text-sm font-semibold text-slate-700">
              Section
            </label>
            <select
              id="sSection"
              value={section}
              onChange={(event) => setSection(event.target.value)}
              disabled={!classId}
              className={inputClass}
            >
              <option value="">Select section</option>
              {classSections.map((item) => (
                <option key={item.id} value={item.section_name}>
                  {item.section_name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="sAdmYear" className="mb-2 block text-sm font-semibold text-slate-700">
              Admission year
            </label>
            <input
              id="sAdmYear"
              type="number"
              value={admissionYear}
              onChange={(event) => setAdmissionYear(Number(event.target.value))}
              required
              className={inputClass}
            />
          </div>

          <div>
            <label htmlFor="sAdmDate" className="mb-2 block text-sm font-semibold text-slate-700">
              Admission date
            </label>
            <input
              id="sAdmDate"
              type="date"
              value={admissionDate}
              onChange={(event) => setAdmissionDate(event.target.value)}
              className={inputClass}
            />
          </div>
        </div>

        {/* Parent / guardian details */}
        <SectionLabel>Parent / Guardian Details</SectionLabel>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <label htmlFor="sFather" className="mb-2 block text-sm font-semibold text-slate-700">
              Father's name
            </label>
            <input
              id="sFather"
              type="text"
              value={fatherName}
              onChange={(event) => setFatherName(event.target.value)}
              className={inputClass}
            />
          </div>

          <div>
            <label htmlFor="sMother" className="mb-2 block text-sm font-semibold text-slate-700">
              Mother's name
            </label>
            <input
              id="sMother"
              type="text"
              value={motherName}
              onChange={(event) => setMotherName(event.target.value)}
              className={inputClass}
            />
          </div>

          <div>
            <label htmlFor="sGuardian" className="mb-2 block text-sm font-semibold text-slate-700">
              Guardian
            </label>
            <input
              id="sGuardian"
              type="text"
              value={guardianName}
              onChange={(event) => setGuardianName(event.target.value)}
              className={inputClass}
            />
          </div>

          <div>
            <label htmlFor="sGuardianPhone" className="mb-2 block text-sm font-semibold text-slate-700">
              Guardian phone
            </label>
            <input
              id="sGuardianPhone"
              type="tel"
              value={guardianPhone}
              onChange={(event) => setGuardianPhone(event.target.value)}
              className={inputClass}
            />
          </div>

          <div>
            <label htmlFor="sStatus" className="mb-2 block text-sm font-semibold text-slate-700">
              Status
            </label>
            <select
              id="sStatus"
              value={status}
              onChange={(event) => setStatus(event.target.value as StudentStatus)}
              className={inputClass}
            >
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
              <option value="transferred">Transferred</option>
              <option value="graduated">Graduated</option>
              <option value="alumni">Alumni</option>
            </select>
          </div>
        </div>

        <button
          type="submit"
          disabled={saving}
          className="mt-6 flex h-11 items-center justify-center gap-2 rounded-lg bg-[#166534] px-5 text-sm font-semibold text-white transition-all duration-200 hover:-translate-y-0.5 hover:bg-[#14532D] disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:translate-y-0"
        >
          {saving ? (
            <>
              <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
              Saving...
            </>
          ) : (
            <>
              <UserPlus size={16} />
              Add Student
            </>
          )}
        </button>
      </form>
    </Card>
  );
};

export default AddStudentForm;
