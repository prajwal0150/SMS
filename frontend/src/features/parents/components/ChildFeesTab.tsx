import { FileCheck2, IndianRupee } from "lucide-react";

import DataStates from "../components/DataStates";
import StatusBadge from "../components/StatusBadge";
import useChildSection from "../hooks/useChildSection";
import {
  fetchChildFees,
  fetchChildInvoices,
} from "../services/parentService";
import {
  FEE_STATUS_LABELS,
  formatDate,
  formatNpr,
  INVOICE_STATUS_LABELS,
} from "../utils/parentUtils";

const FEE_TONES = {
  pending: "red",
  partial: "amber",
  paid: "green",
  waived: "slate",
} as const;

const INVOICE_TONES = {
  draft: "slate",
  unpaid: "red",
  partial: "amber",
  paid: "green",
  overdue: "red",
  cancelled: "slate",
} as const;

interface ChildFeesTabProps {
  studentId: string;
}

const ChildFeesTab = ({ studentId }: ChildFeesTabProps) => {
  const feesState = useChildSection(studentId, fetchChildFees);
  const invoicesState = useChildSection(
    studentId,
    fetchChildInvoices
  );

  const outstanding = feesState.rows.reduce(
    (sum, row) => sum + Number(row.balance || 0),
    0
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center gap-3 rounded-lg border border-slate-200 bg-white p-4">
        <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-amber-50 text-amber-600">
          <IndianRupee size={19} />
        </span>
        <div>
          <p className="text-xl font-bold text-slate-900">
            {formatNpr(outstanding)}
          </p>
          <p className="text-xs text-slate-500">
            Total outstanding balance
          </p>
        </div>
        {!feesState.loading && feesState.rows.length === 0 && (
          <span className="ml-auto rounded-full bg-emerald-50 px-3 py-1 text-xs font-bold text-emerald-700">
            All cleared
          </span>
        )}
      </div>

      <section className="rounded-lg border border-slate-200 bg-white">
        <header className="flex items-center gap-2 border-b border-slate-100 px-6 py-4">
          <IndianRupee size={16} className="text-slate-400" />
          <h2 className="text-base font-semibold text-slate-900">
            Fee obligations
          </h2>
        </header>

        <table className="min-w-full divide-y divide-slate-100">
          <thead>
            <tr className="bg-slate-50 text-left text-[11px] font-semibold uppercase tracking-wide text-slate-500">
              <th className="px-4 py-3">Category</th>
              <th className="px-4 py-3">Due date</th>
              <th className="px-4 py-3">Amount</th>
              <th className="px-4 py-3">Paid</th>
              <th className="px-4 py-3">Balance</th>
              <th className="px-4 py-3">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {feesState.rows.map((fee) => (
              <tr key={fee.fee_id} className="text-sm text-slate-700">
                <td className="px-4 py-2.5">
                  {fee.category_name}
                  <span className="block text-[11px] text-slate-400">
                    {fee.academic_year}
                  </span>
                </td>
                <td className="whitespace-nowrap px-4 py-2.5">
                  {formatDate(fee.due_date)}
                </td>
                <td className="px-4 py-2.5">
                  {formatNpr(fee.payable_amount)}
                </td>
                <td className="px-4 py-2.5">
                  {formatNpr(fee.total_paid)}
                </td>
                <td className="px-4 py-2.5 font-semibold">
                  {formatNpr(fee.balance)}
                </td>
                <td className="px-4 py-2.5">
                  <StatusBadge
                    label={
                      FEE_STATUS_LABELS[fee.status] ?? fee.status
                    }
                    tone={FEE_TONES[fee.status] as string}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="px-4 py-5">
          <DataStates
            isLoading={feesState.loading}
            error={feesState.error}
            empty={
              feesState.rows.length === 0
                ? "No fee obligations have been generated for this child yet."
                : undefined
            }
          />
        </div>
      </section>
<section className="rounded-lg border border-slate-200 bg-white">
        <header className="flex items-center gap-2 border-b border-slate-100 px-6 py-4">
          <FileCheck2 size={16} className="text-slate-400" />
          <h2 className="text-base font-semibold text-slate-900">
            Invoices & receipts
          </h2>
        </header>

        <table className="min-w-full divide-y divide-slate-100">
          <thead>
            <tr className="bg-slate-50 text-left text-[11px] font-semibold uppercase tracking-wide text-slate-500">
              <th className="px-4 py-3">Invoice</th>
              <th className="px-4 py-3">Issued</th>
              <th className="px-4 py-3">Due</th>
              <th className="px-4 py-3">Payable</th>
              <th className="px-4 py-3">Paid</th>
              <th className="px-4 py-3">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {invoicesState.rows.map((invoice) => (
              <tr
                key={invoice.invoice_id}
                className="text-sm text-slate-700"
              >
                <td className="px-4 py-2.5 font-semibold">
                  {invoice.invoice_number}
                  <span className="block text-[11px] text-slate-400">
                    {invoice.payment_count} payment
                    {invoice.payment_count === 1 ? "" : "s"}
                    {invoice.last_payment_method
                      ? ` via ${invoice.last_payment_method}`
                      : ""}
                  </span>
                </td>
                <td className="whitespace-nowrap px-4 py-2.5">
                  {formatDate(invoice.issue_date)}
                </td>
                <td className="whitespace-nowrap px-4 py-2.5">
                  {formatDate(invoice.due_date)}
                </td>
                <td className="px-4 py-2.5">
                  {formatNpr(invoice.payable_amount)}
                </td>
                <td className="px-4 py-2.5">
                  {formatNpr(invoice.paid_amount)}
                </td>
                <td className="px-4 py-2.5">
                  <StatusBadge
                    label={
                      INVOICE_STATUS_LABELS[invoice.status] ??
                      invoice.status
                    }
                    tone={INVOICE_TONES[invoice.status] as string}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="px-4 py-5">
          <DataStates
            isLoading={invoicesState.loading}
            error={invoicesState.error}
            empty={
              invoicesState.rows.length === 0
                ? "No invoices have been issued for this child yet."
                : undefined
            }
          />
        </div>
      </section>
    </div>
  );
};

export default ChildFeesTab;