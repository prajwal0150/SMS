import {
  createSlice,
} from "@reduxjs/toolkit";

import {
  fetchFeeCategoriesThunk,
  createFeeCategoryThunk,
  updateFeeCategoryThunk,
  deleteFeeCategoryThunk,
  fetchFeeStructuresThunk,
  createFeeStructureThunk,
  deleteFeeStructureThunk,
  fetchStudentFeesThunk,
  generateStudentFeesThunk,
  updateStudentFeeStatusThunk,
  fetchInvoicesThunk,
  fetchInvoiceByIdThunk,
  createInvoiceThunk,
  deleteInvoiceThunk,
  fetchPaymentsThunk,
  createPaymentThunk,
  fetchPaymentMethodsThunk,
  fetchFeeSummaryThunk,
} from "./feesThunk";

import type {
  FeeCategory,
  FeeStructure,
  StudentFee,
  Invoice,
  Payment,
  PaymentMethod,
  FeeSummary,
} from "../types/feesTypes";


interface FeesState {
  categories: FeeCategory[];
  structures: FeeStructure[];
  studentFees: StudentFee[];
  invoices: Invoice[];
  invoiceDetail: Invoice | null;
  payments: Payment[];
  paymentMethods: PaymentMethod[];
  summary: FeeSummary | null;
  loading: boolean;
  saving: boolean;
  error: string | null;
}


const initialState: FeesState = {
  categories: [],
  structures: [],
  studentFees: [],
  invoices: [],
  invoiceDetail: null,
  payments: [],
  paymentMethods: [],
  summary: null,
  loading: false,
  saving: false,
  error: null,
};


const feesSlice = createSlice({
  name: "fees",

  initialState,

  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearInvoiceDetail: (state) => {
      state.invoiceDetail = null;
    },
  },

  extraReducers: (builder) => {

    // ==============================
    // FEE CATEGORIES
    // ==============================

    builder
      .addCase(fetchFeeCategoriesThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchFeeCategoriesThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.categories = action.payload;
      })
      .addCase(fetchFeeCategoriesThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    builder
      .addCase(createFeeCategoryThunk.pending, (state) => {
        state.saving = true;
      })
      .addCase(createFeeCategoryThunk.fulfilled, (state, action) => {
        state.saving = false;
        state.categories.unshift(action.payload);
      })
      .addCase(createFeeCategoryThunk.rejected, (state) => {
        state.saving = false;
      });

    builder
      .addCase(updateFeeCategoryThunk.fulfilled, (state, action) => {
        state.categories = state.categories.map((c) =>
          c.id === action.payload.id ? action.payload : c
        );
      });

    builder
      .addCase(deleteFeeCategoryThunk.fulfilled, (state, action) => {
        state.categories = state.categories.filter(
          (c) => c.id !== action.payload
        );
      });


    // ==============================
    // FEE STRUCTURES
    // ==============================

    builder
      .addCase(fetchFeeStructuresThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchFeeStructuresThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.structures = action.payload;
      })
      .addCase(fetchFeeStructuresThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    builder
      .addCase(createFeeStructureThunk.pending, (state) => {
        state.saving = true;
      })
      .addCase(createFeeStructureThunk.fulfilled, (state, action) => {
        state.saving = false;
        state.structures.unshift(action.payload);
      })
      .addCase(createFeeStructureThunk.rejected, (state) => {
        state.saving = false;
      });

    builder
      .addCase(deleteFeeStructureThunk.fulfilled, (state, action) => {
        state.structures = state.structures.filter(
          (s) => s.id !== action.payload
        );
      });


    // ==============================
    // STUDENT FEES
    // ==============================

    builder
      .addCase(fetchStudentFeesThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchStudentFeesThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.studentFees = action.payload;
      })
      .addCase(fetchStudentFeesThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    builder
      .addCase(generateStudentFeesThunk.pending, (state) => {
        state.saving = true;
      })
      .addCase(generateStudentFeesThunk.fulfilled, (state, action) => {
        state.saving = false;
        state.studentFees = [...action.payload, ...state.studentFees];
      })
      .addCase(generateStudentFeesThunk.rejected, (state) => {
        state.saving = false;
      });

    builder
      .addCase(updateStudentFeeStatusThunk.fulfilled, (state, action) => {
        state.studentFees = state.studentFees.map((f) =>
          f.id === action.payload.id ? action.payload : f
        );
      });


    // ==============================
    // INVOICES
    // ==============================

    builder
      .addCase(fetchInvoicesThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchInvoicesThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.invoices = action.payload;
      })
      .addCase(fetchInvoicesThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    builder
      .addCase(fetchInvoiceByIdThunk.fulfilled, (state, action) => {
        state.invoiceDetail = action.payload;
      });

    builder
      .addCase(createInvoiceThunk.pending, (state) => {
        state.saving = true;
      })
      .addCase(createInvoiceThunk.fulfilled, (state, action) => {
        state.saving = false;
        state.invoices.unshift(action.payload);
        state.invoiceDetail = action.payload;
      })
      .addCase(createInvoiceThunk.rejected, (state) => {
        state.saving = false;
      });

    builder
      .addCase(deleteInvoiceThunk.fulfilled, (state, action) => {
        state.invoices = state.invoices.filter(
          (inv) => inv.id !== action.payload
        );
      });


    // ==============================
    // PAYMENTS
    // ==============================

    builder
      .addCase(fetchPaymentsThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPaymentsThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.payments = action.payload;
      })
      .addCase(fetchPaymentsThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    builder
      .addCase(createPaymentThunk.pending, (state) => {
        state.saving = true;
      })
      .addCase(createPaymentThunk.fulfilled, (state, action) => {
        state.saving = false;
        state.payments.unshift(action.payload);

        state.invoices = state.invoices.map((inv) => {
          if (inv.id === action.payload.invoice_id) {
            const newPaid =
              Number(inv.paid_amount) + Number(action.payload.amount);
            return {
              ...inv,
              paid_amount: newPaid,
              status:
                newPaid >= Number(inv.payable_amount)
                  ? "paid"
                  : newPaid > 0
                    ? "partial"
                    : inv.status,
            };
          }
          return inv;
        });
      })
      .addCase(createPaymentThunk.rejected, (state) => {
        state.saving = false;
      });


    // ==============================
    // LOOKUPS & SUMMARY
    // ==============================

    builder
      .addCase(fetchPaymentMethodsThunk.fulfilled, (state, action) => {
        state.paymentMethods = action.payload;
      });

    builder
      .addCase(fetchFeeSummaryThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchFeeSummaryThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.summary = action.payload;
      })
      .addCase(fetchFeeSummaryThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

  },
});


export const {
  clearError,
  clearInvoiceDetail,
} = feesSlice.actions;


export default feesSlice.reducer;
