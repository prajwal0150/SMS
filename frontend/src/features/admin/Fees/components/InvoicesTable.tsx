import Card from "../../dashboard/components/Card";
import DataState from "./DataState";

import type { Invoice } from "../types/feesTypes";


interface InvoicesTableProps {
  invoices: Invoice[];
  loading: boolean;
  error: string | null;
  onView: (invoice: Invoice) => void;
  onDelete: (id: string) => void;
  onReload: () => void;
}

const formatCurrency = (value: number): string =>
  new Intl.NumberFormat("en-NP", {
    style: "currency",
    currency: "NPR",
    maximumFractionDigits: 0,
  }).format(value);

const formatDate = (iso: string): string =>
  new Date(iso).toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
  });


const STATUS_COLORS: Record<Invoice["status"], string> = {
  draft: "bg-slate-200/50 text-slate-600",
  unpaid: "bg-amber-500/10 text-amber-700",
  partial: "bg-blue-500/10 text-blue-700",
  paid: "bg-[#166534]/10 text-[#166534]",
  overdue: "bg-red-500/10 text-red-700",
  cancelled: "bg-slate-200/50 text-slate-500",
};


const InvoicesTable = ({
  invoices,
  loading,
  error,
  onView,
  onDelete,
  onReload,
}: InvoicesTableProps) => {
  const studentName = (inv: Invoice): string => {
    const s = inv.students;
    if (s) {
      return `${s.first_name} ${s.last_name}`;
    }
    return "—";
  };

  const admissionNumber = (inv: Invoice): string =>
    inv.students?.admission_number ?? "—";

  const paidAmount = (inv: Invoice): number =>
    (inv.payments ?? []).reduce((sum, p) => sum + Number(p.amount), 0);

  return (
    <Card
      title="Invoices"
      subtitle={`${invoices.length} invoices`}
      className="overflow-hidden"
    >
      {loading || error || invoices.length === 0 ? (
        <DataState
          loading={loading}
          error={error}
          onReload={onReload}
          message="No invoices yet. Use 'Create Invoice' to generate one."
        />
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full min-w-[900px] border-collapse text-sm">
            <thead>
              <tr>
                <th className="border-b border-slate-200 bg-slate-50 px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                  Invoice #
                </th>
                <th className="border-b border-slate-200 bg-slate-50 px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                  Student
                </th>
                <th className="border-b border-slate-200 bg-slate-50 px-4 py-3 text-right text-xs font-semibold uppercase tracking-wider text-slate-500">
                  Total
                </th>
                <th className="border-b border-slate-200 bg-slate-50 px-4 py-3 text-right text-xs font-semibold uppercase tracking-wider text-slate-500">
                  Paid
                </th>
                <th className="border-b border-slate-200 bg-slate-50 px-4 py-3 text-center text-xs font-semibold uppercase tracking-wider text-slate-500">
                  Due Date
                </th>
                <th className="border-b border-slate-200 bg-slate-50 px-4 py-3 text-center text-xs font-semibold uppercase tracking-wider text-slate-500">
                  Status
                </th>
                <th className="border-b border-slate-200 bg-slate-50 px-4 py-3 text-right text-xs font-semibold uppercase tracking-wider text-slate-500">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {invoices.map((invoice) => {
                const paid = paidAmount(invoice);
                return (
                  <tr
                    key={invoice.id}
                    className="border-b border-slate-100 transition last:border-0 hover:bg-slate-50/60"
                  >
                    <td className="px-4 py-3 font-semibold text-slate-900">
                      {invoice.invoice_number}
                    </td>
                    <td className="px-4 py-3 text-slate-600">
                      <div>
                        <p className="font-medium">{studentName(invoice)}</p>
                        <p className="text-xs text-slate-400">
                          {admissionNumber(invoice)}
                        </p>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-right text-slate-600">
                      {formatCurrency(invoice.total_amount)}
                    </td>
                    <td className="px-4 py-3 text-right text-slate-600">
                      {formatCurrency(paid)}
                    </td>
                    <td className="px-4 py-3 text-center text-slate-600">
                      {formatDate(invoice.due_date)}
                    </td>
                    <td className="px-4 py-3 text-center">
                      <span
                        className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${STATUS_COLORS[invoice.status]}`}
                      >
                        {invoice.status}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex justify-end gap-1.5">
                      <button
                        type="button"
                        onClick={() => onView(invoice)}
                        title="View invoice"
                          className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-700"
                        >
                          View
                        </button>
                        <button
                          type="button"
                          onClick={() => onDelete(invoice.id)}
                          title="Delete invoice"
                          className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 transition-colors hover:bg-red-50 hover:text-red-600"
                        >
                          ×
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </Card>
  );
};

export default InvoicesTable;
