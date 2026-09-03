import { useState } from "react";
import { UserPlus } from "lucide-react";

import Card from "../../dashboard/components/Card";

import type {
  NewTeacherInput,
  TeacherStatus,
} from "../types/staffManagmentTypes";


const inputClass =
  "h-11 w-full rounded-lg border border-slate-200 bg-slate-50/70 px-4 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-[#166534] focus:bg-white focus:ring-4 focus:ring-[#166534]/10";


interface AddTeacherFormProps {
  saving: boolean;
  onSave: (input: NewTeacherInput) => Promise<boolean>;
}

const todayString = (): string =>
  new Date().toISOString().slice(0, 10);


const AddTeacherForm = ({
  saving,
  onSave,
}: AddTeacherFormProps) => {

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [subject, setSubject] = useState("");
  const [qualification, setQualification] = useState("");
  const [joinDate, setJoinDate] = useState(todayString());
  const [status, setStatus] =
    useState<TeacherStatus>("active");


  const handleSubmit = async (
    event: React.FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();

    const success = await onSave({
      first_name: firstName.trim(),
      last_name: lastName.trim(),
      email: email.trim(),
      phone: phone.trim() || undefined,
      subject: subject.trim(),
      qualification: qualification.trim() || undefined,
      join_date: joinDate,
      status,
    });

    if (success) {
      setFirstName("");
      setLastName("");
      setEmail("");
      setPhone("");
      setSubject("");
      setQualification("");
      setJoinDate(todayString());
      setStatus("active");
    }
  };


  return (
    <Card
      title="Add Teacher"
      subtitle="Create a new teacher record"
    >
      <form onSubmit={handleSubmit}>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <div>
            <label
              htmlFor="tFirstName"
              className="mb-2 block text-sm font-semibold text-slate-700"
            >
              First name
            </label>
            <input
              id="tFirstName"
              type="text"
              value={firstName}
              onChange={(event) =>
                setFirstName(event.target.value)
              }
              required
              className={inputClass}
            />
          </div>

          <div>
            <label
              htmlFor="tLastName"
              className="mb-2 block text-sm font-semibold text-slate-700"
            >
              Last name
            </label>
            <input
              id="tLastName"
              type="text"
              value={lastName}
              onChange={(event) =>
                setLastName(event.target.value)
              }
              required
              className={inputClass}
            />
          </div>

          <div>
            <label
              htmlFor="tEmail"
              className="mb-2 block text-sm font-semibold text-slate-700"
            >
              Email
            </label>
            <input
              id="tEmail"
              type="email"
              value={email}
              onChange={(event) =>
                setEmail(event.target.value)
              }
              required
              className={inputClass}
            />
          </div>

          <div>
            <label
              htmlFor="tPhone"
              className="mb-2 block text-sm font-semibold text-slate-700"
            >
              Phone
            </label>
            <input
              id="tPhone"
              type="tel"
              value={phone}
              onChange={(event) =>
                setPhone(event.target.value)
              }
              className={inputClass}
            />
          </div>

          <div>
            <label
              htmlFor="tSubject"
              className="mb-2 block text-sm font-semibold text-slate-700"
            >
              Subject
            </label>
            <input
              id="tSubject"
              type="text"
              value={subject}
              onChange={(event) =>
                setSubject(event.target.value)
              }
              required
              placeholder="e.g. Mathematics"
              className={inputClass}
            />
          </div>

          <div>
            <label
              htmlFor="tQualification"
              className="mb-2 block text-sm font-semibold text-slate-700"
            >
              Qualification
            </label>
            <input
              id="tQualification"
              type="text"
              value={qualification}
              onChange={(event) =>
                setQualification(event.target.value)
              }
              placeholder="e.g. M.Sc, B.Ed"
              className={inputClass}
            />
          </div>

          <div>
            <label
              htmlFor="tJoinDate"
              className="mb-2 block text-sm font-semibold text-slate-700"
            >
              Join date
            </label>
            <input
              id="tJoinDate"
              type="date"
              value={joinDate}
              onChange={(event) =>
                setJoinDate(event.target.value)
              }
              className={inputClass}
            />
          </div>

          <div>
            <label
              htmlFor="tStatus"
              className="mb-2 block text-sm font-semibold text-slate-700"
            >
              Status
            </label>
            <select
              id="tStatus"
              value={status}
              onChange={(event) =>
                setStatus(
                  event.target.value as TeacherStatus
                )
              }
              className={inputClass}
            >
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
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
              Add Teacher
            </>
          )}
        </button>
      </form>
    </Card>
  );
};

export default AddTeacherForm;