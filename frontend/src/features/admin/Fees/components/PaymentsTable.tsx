import Card from "../../dashboard/components/Card";
import DataState from "./DataState";

import type { Payment } from "../types/feesTypes";


interface PaymentsTableProps {
  payments: Payment[];
  loading: boolean;
  error: string | null;
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


const PaymentsTable = ({
  payments,
  loading,
  error,
  onReload,
}: PaymentsTableProps) => {
  const methodName = (payment: Payment): string =>
    payment.payment_methods?.method_name ?? "—";

  const invoiceNumber = (payment: Payment): string =>
    (payment as unknown as { invoices?: { invoice_number: string } }).invoices
      ?.invoice_number ?? "—";

  return (
    <Card
      title="Payment History"
      subtitle={`${payments.length} transactions`}
      className="overflow-hidden"
    >
      {loading || error || payments.length === 0 ? (
        <DataState
          loading={loading}
          error={error}
          onReload={onReload}
          message="No payments recorded yet."
        />
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full min-w-[750px] border-collapse text-sm">
            <thead>
              <tr>
                <th className="border-b border-slate-200 bg-slate-50 px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                  Date
                </th>
                <th className="border-b border-slate-200 bg-slate-50 px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                  Invoice
                </th>
                <th className="border-b border-slate-200 bg-slate-50 px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                  Method
                </th>
                <th className="border-b border-slate-200 bg-slate-50 px-4 py-3 text-right text-xs font-semibold uppercase tracking-wider text-slate-500">
                  Amount
                </th>
                <th className="border-b border-slate-200 bg-slate-50 px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                  Transaction ID
                </th>
                <th className="border-b border-slate-200 bg-slate-50 px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                  Notes
                </th>
              </tr>
            </thead>
            <tbody>
              {payments.map((payment) => (
                <tr
                  key={payment.id}
                  className="border-b border-slate-100 transition last:border-0 hover:bg-slate-50/60"
                >
                  <td className="px-4 py-3 text-slate-600">
                    {formatDate(payment.payment_date)}
                  </td>
                  <td className="px-4 py-3 text-slate-600">
                    {invoiceNumber(payment)}
                  </td>
                  <td className="px-4 py-3 text-slate-600">
                    {methodName(payment)}
                  </td>
                  <td className="px-4 py-3 text-right font-semibold text-[#166534]">
                    {formatCurrency(payment.amount)}
                  </td>
                  <td className="px-4 py-3 text-slate-600">
                    {payment.transaction_id ?? "—"}
                  </td>
                  <td className="px-4 py-3 text-slate-600">
                    {payment.notes ?? "—"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </Card>
  );
};

export default PaymentsTable;
