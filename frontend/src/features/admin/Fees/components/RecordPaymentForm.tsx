import { useEffect, useState } from "react";
import { ArrowLeft, IndianRupee } from "lucide-react";

import Card from "../../dashboard/components/Card";
import { useFees } from "../../Fees/hooks/useFees";

import type { NewPaymentInput } from "../types/feesTypes";


const inputClass =
  "h-11 w-full rounded-lg border border-slate-200 bg-slate-50/70 px-4 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-[#7C3AED] focus:bg-white focus:ring-4 focus:ring-[#7C3AED]/10";


interface RecordPaymentFormProps {
  onSave: (input: NewPaymentInput) => Promise<boolean>;
  onCancel: () => void;
}

const todayString = (): string =>
  new Date().toISOString().slice(0, 10);


const RecordPaymentForm = ({
  onSave,
  onCancel,
}: RecordPaymentFormProps) => {
  const { invoices, paymentMethods, loading: feesLoading } = useFees();

  const [invoiceId, setInvoiceId] = useState("");
  const [methodId, setMethodId] = useState("");
  const [amount, setAmount] = useState("");
  const [transactionId, setTransactionId] = useState("");
  const [paymentDate, setPaymentDate] = useState(todayString());
  const [notes, setNotes] = useState("");

  const [saving, setSaving] = useState(false);


  useEffect(() => {
    if (invoices.length === 0) {
      // trigger load if not yet loaded
    }
  }, [invoices.length]);


  const payableInvoices = invoices.filter(
    (inv) => inv.status !== "paid" && inv.status !== "cancelled"
  );


  const handleSubmit = async (
    event: React.FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();

    setSaving(true);

    const success = await onSave({
      invoice_id: invoiceId,
      amount: Number(amount),
      payment_method_id: methodId || null,
      transaction_id: transactionId.trim() || null,
      payment_date: paymentDate,
      received_by: null,
      notes: notes.trim() || null,
    });

    setSaving(false);

    if (success) {
      setInvoiceId("");
      setMethodId("");
      setAmount("");
      setTransactionId("");
      setPaymentDate(todayString());
      setNotes("");
    }
  };


  if (feesLoading && invoices.length === 0) {
    return (
      <Card>
        <div className="flex flex-col items-center gap-3 py-10 text-center">
          <div className="h-8 w-8 animate-spin rounded-full border-[3px] border-[#7C3AED]/20 border-t-[#7C3AED]" />
          <p className="text-sm font-medium text-slate-500">
            Loading invoice data...
          </p>
        </div>
      </Card>
    );
  }

  return (
    <Card
      title="Record Payment"
      subtitle="Record a new payment against an invoice."
    >
      <div className="mb-4">
        <button
          type="button"
          onClick={onCancel}
          className="flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold text-slate-600 transition-colors hover:bg-slate-100"
        >
          <ArrowLeft size={14} />
          Back to Payments
        </button>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <div>
            <label
              htmlFor="rpInvoice"
              className="mb-2 block text-sm font-semibold text-slate-700"
            >
              Invoice
            </label>
            <select
              id="rpInvoice"
              value={invoiceId}
              onChange={(e) => setInvoiceId(e.target.value)}
              required
              className={inputClass}
            >
              <option value="">Select invoice</option>
              {payableInvoices.map((inv) => (
                <option key={inv.id} value={inv.id}>
                  {inv.invoice_number} — {inv.students
                    ? `${inv.students.first_name} ${inv.students.last_name}`
                    : "Unknown"} — NPR {Number(inv.payable_amount).toLocaleString()}
                  (paid: NPR {Number(inv.paid_amount).toLocaleString()})
                </option>
              ))}
            </select>
            {payableInvoices.length === 0 && (
              <p className="mt-1.5 text-xs text-slate-500">
                No outstanding invoices to pay.
              </p>
            )}
          </div>

          <div>
            <label
              htmlFor="rpMethod"
              className="mb-2 block text-sm font-semibold text-slate-700"
            >
              Payment Method
            </label>
            <select
              id="rpMethod"
              value={methodId}
              onChange={(e) => setMethodId(e.target.value)}
              required
              className={inputClass}
            >
              <option value="">Select method</option>
              {paymentMethods
                .filter((m) => m.status === "active")
                .map((m) => (
                  <option key={m.id} value={m.id}>
                    {m.method_name}
                  </option>
                ))}
            </select>
          </div>

          <div>
            <label
              htmlFor="rpAmount"
              className="mb-2 block text-sm font-semibold text-slate-700"
            >
              Amount (NPR)
            </label>
            <input
              id="rpAmount"
              type="number"
              min="0.01"
              step="0.01"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              required
              placeholder="e.g. 5000"
              className={inputClass}
            />
          </div>

          <div>
            <label
              htmlFor="rpTransactionId"
              className="mb-2 block text-sm font-semibold text-slate-700"
            >
              Transaction ID
            </label>
            <input
              id="rpTransactionId"
              type="text"
              value={transactionId}
              onChange={(e) => setTransactionId(e.target.value)}
              placeholder="eSewa / Khalti / bank ref"
              className={inputClass}
            />
          </div>

          <div>
            <label
              htmlFor="rpDate"
              className="mb-2 block text-sm font-semibold text-slate-700"
            >
              Payment Date
            </label>
            <input
              id="rpDate"
              type="date"
              value={paymentDate}
              onChange={(e) => setPaymentDate(e.target.value)}
              required
              className={inputClass}
            />
          </div>

          <div className="sm:col-span-2">
            <label
              htmlFor="rpNotes"
              className="mb-2 block text-sm font-semibold text-slate-700"
            >
              Notes
            </label>
            <input
              id="rpNotes"
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
              Recording...
            </>
          ) : (
            <>
              <IndianRupee size={16} />
              Record Payment
            </>
          )}
        </button>
      </form>
    </Card>
  );
};

export default RecordPaymentForm;
