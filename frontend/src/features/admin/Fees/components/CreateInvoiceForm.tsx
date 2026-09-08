import { useEffect, useState } from "react";
import { ArrowLeft, Save } from "lucide-react";

import Card from "../../dashboard/components/Card";
import { fetchStudents } from "../../StudentManagment/services/studentManagmentServices";
import type { Student } from "../../StudentManagment/types/studentManagmentTypes";

import type { NewInvoiceInput } from "../types/feesTypes";


const inputClass =
  "h-11 w-full rounded-lg border border-slate-200 bg-slate-50/70 px-4 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-[#7C3AED] focus:bg-white focus:ring-4 focus:ring-[#7C3AED]/10";


interface CreateInvoiceFormProps {
  saving: boolean;
  onSave: (input: NewInvoiceInput) => Promise<boolean>;
  onCancel: () => void;
}

const todayString = (): string =>
  new Date().toISOString().slice(0, 10);


const CreateInvoiceForm = ({
  saving,
  onSave,
  onCancel,
}: CreateInvoiceFormProps) => {
  const [students, setStudents] = useState<Student[]>([]);
  const [loadingStudents, setLoadingStudents] = useState(false);

  const [studentId, setStudentId] = useState("");
  const [totalAmount, setTotalAmount] = useState("");
  const [discountAmount, setDiscountAmount] = useState("0");
  const [fineAmount, setFineAmount] = useState("0");
  const [payableAmount, setPayableAmount] = useState("");
  const [dueDate, setDueDate] = useState(todayString());
  const [issueDate, setIssueDate] = useState(todayString());
  const [notes, setNotes] = useState("");


  useEffect(() => {
    const loadStudents = async () => {
      setLoadingStudents(true);
      try {
        const data = await fetchStudents();
        setStudents(data);
      } catch {
        // swallow error — dropdown will just show empty
      } finally {
        setLoadingStudents(false);
      }
    };

    loadStudents();
  }, []);


  const handleSubmit = async (
    event: React.FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();

    const success = await onSave({
      student_id: studentId,
      total_amount: Number(totalAmount),
      discount_amount: Number(discountAmount) || 0,
      fine_amount: Number(fineAmount) || 0,
      payable_amount: Number(payableAmount),
      due_date: dueDate,
      issue_date: issueDate,
      notes: notes.trim() || undefined,
    });

    if (success) {
      setStudentId("");
      setTotalAmount("");
      setDiscountAmount("0");
      setFineAmount("0");
      setPayableAmount("");
      setDueDate(todayString());
      setIssueDate(todayString());
      setNotes("");
    }
  };


  return (
    <Card
      title="Create Invoice"
      subtitle="Issue a new invoice for a student."
    >
      <div className="mb-4">
        <button
          type="button"
          onClick={onCancel}
          className="flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold text-slate-600 transition-colors hover:bg-slate-100"
        >
          <ArrowLeft size={14} />
          Back to Invoices
        </button>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <div>
            <label
              htmlFor="invStudent"
              className="mb-2 block text-sm font-semibold text-slate-700"
            >
              Student
            </label>
            <select
              id="invStudent"
              value={studentId}
              onChange={(e) => setStudentId(e.target.value)}
              required
              disabled={loadingStudents}
              className={inputClass}
            >
              <option value="">Select student</option>
              {students.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.first_name} {s.last_name} ({s.admission_number})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label
              htmlFor="invTotal"
              className="mb-2 block text-sm font-semibold text-slate-700"
            >
              Total Amount (NPR)
            </label>
            <input
              id="invTotal"
              type="number"
              min="0"
              step="0.01"
              value={totalAmount}
              onChange={(e) => setTotalAmount(e.target.value)}
              required
              placeholder="e.g. 15000"
              className={inputClass}
            />
          </div>

          <div>
            <label
              htmlFor="invPayable"
              className="mb-2 block text-sm font-semibold text-slate-700"
            >
              Payable Amount (NPR)
            </label>
            <input
              id="invPayable"
              type="number"
              min="0"
              step="0.01"
              value={payableAmount}
              onChange={(e) => setPayableAmount(e.target.value)}
              required
              placeholder="After discounts"
              className={inputClass}
            />
          </div>

          <div>
            <label
              htmlFor="invDiscount"
              className="mb-2 block text-sm font-semibold text-slate-700"
            >
              Discount (NPR)
            </label>
            <input
              id="invDiscount"
              type="number"
              min="0"
              step="0.01"
              value={discountAmount}
              onChange={(e) => setDiscountAmount(e.target.value)}
              className={inputClass}
            />
          </div>

          <div>
            <label
              htmlFor="invFine"
              className="mb-2 block text-sm font-semibold text-slate-700"
            >
              Fine (NPR)
            </label>
            <input
              id="invFine"
              type="number"
              min="0"
              step="0.01"
              value={fineAmount}
              onChange={(e) => setFineAmount(e.target.value)}
              className={inputClass}
            />
          </div>

          <div>
            <label
              htmlFor="invDueDate"
              className="mb-2 block text-sm font-semibold text-slate-700"
            >
              Due Date
            </label>
            <input
              id="invDueDate"
              type="date"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              required
              className={inputClass}
            />
          </div>

          <div>
            <label
              htmlFor="invIssueDate"
              className="mb-2 block text-sm font-semibold text-slate-700"
            >
              Issue Date
            </label>
            <input
              id="invIssueDate"
              type="date"
              value={issueDate}
              onChange={(e) => setIssueDate(e.target.value)}
              required
              className={inputClass}
            />
          </div>

          <div className="sm:col-span-2">
            <label
              htmlFor="invNotes"
              className="mb-2 block text-sm font-semibold text-slate-700"
            >
              Notes
            </label>
            <input
              id="invNotes"
              type="text"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Optional notes"
              className={inputClass}
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={saving}
          className="mt-6 flex h-11 items-center justify-center gap-2 rounded-lg bg-[#7C3AED] px-5 text-sm font-semibold text-white transition-all duration-200 hover:-translate-y-0.5 hover:bg-[#6D28D9] disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:translate-y-0"
        >
          {saving ? (
            <>
              <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
              Creating...
            </>
          ) : (
            <>
              <Save size={16} />
              Create Invoice
            </>
          )}
        </button>
      </form>
    </Card>
  );
};

export default CreateInvoiceForm;
