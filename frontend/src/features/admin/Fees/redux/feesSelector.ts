import type { RootState } from "../../../../redux/store";


export const selectFees = (state: RootState) => state.fees;


export const selectFeeCategories =
  (state: RootState) => state.fees.categories;


export const selectFeeStructures =
  (state: RootState) => state.fees.structures;


export const selectStudentFees =
  (state: RootState) => state.fees.studentFees;


export const selectInvoices =
  (state: RootState) => state.fees.invoices;


export const selectInvoiceDetail =
  (state: RootState) => state.fees.invoiceDetail;


export const selectPayments =
  (state: RootState) => state.fees.payments;


export const selectPaymentMethods =
  (state: RootState) => state.fees.paymentMethods;


export const selectFeeSummary =
  (state: RootState) => state.fees.summary;


export const selectFeesLoading =
  (state: RootState) => state.fees.loading;


export const selectFeesSaving =
  (state: RootState) => state.fees.saving;


export const selectFeesError =
  (state: RootState) => state.fees.error;
