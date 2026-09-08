import { createAsyncThunk } from "@reduxjs/toolkit";

import {
  fetchFeeCategories,
  createFeeCategory,
  updateFeeCategory,
  deleteFeeCategory,
  fetchFeeStructures,
  createFeeStructure,
  deleteFeeStructure,
  fetchStudentFees,
  generateStudentFees,
  updateStudentFeeStatus,
  fetchInvoices,
  fetchInvoiceById,
  createInvoice,
  deleteInvoice,
  fetchPayments,
  createPayment,
  fetchPaymentMethods,
  fetchFeeSummary,
} from "../services/feesServices";

import type {
  NewFeeCategoryInput,
  NewFeeStructureInput,
  StudentFee,
  GenerateStudentFeesInput,
  NewInvoiceInput,
  NewPaymentInput,
} from "../types/feesTypes";


const rejectMessage = (error: unknown, fallback: string): string =>
  error instanceof Error ? error.message : fallback;


// ==============================
// FEE CATEGORIES
// ==============================

export const fetchFeeCategoriesThunk = createAsyncThunk(
  "fees/fetchFeeCategories",
  async (_, { rejectWithValue }) => {
    try {
      return await fetchFeeCategories();
    } catch (error) {
      return rejectWithValue(rejectMessage(error, "Unable to load fee categories"));
    }
  }
);

export const createFeeCategoryThunk = createAsyncThunk(
  "fees/createFeeCategory",
  async (input: NewFeeCategoryInput, { rejectWithValue }) => {
    try {
      return await createFeeCategory(input);
    } catch (error) {
      return rejectWithValue(rejectMessage(error, "Unable to create fee category"));
    }
  }
);

export const updateFeeCategoryThunk = createAsyncThunk(
  "fees/updateFeeCategory",
  async (
    { id, input }: { id: string; input: NewFeeCategoryInput },
    { rejectWithValue }
  ) => {
    try {
      return await updateFeeCategory(id, input);
    } catch (error) {
      return rejectWithValue(rejectMessage(error, "Unable to update fee category"));
    }
  }
);

export const deleteFeeCategoryThunk = createAsyncThunk(
  "fees/deleteFeeCategory",
  async (id: string, { rejectWithValue }) => {
    try {
      await deleteFeeCategory(id);
      return id;
    } catch (error) {
      return rejectWithValue(rejectMessage(error, "Unable to remove fee category"));
    }
  }
);


// ==============================
// FEE STRUCTURES
// ==============================

export const fetchFeeStructuresThunk = createAsyncThunk(
  "fees/fetchFeeStructures",
  async (_, { rejectWithValue }) => {
    try {
      return await fetchFeeStructures();
    } catch (error) {
      return rejectWithValue(rejectMessage(error, "Unable to load fee structures"));
    }
  }
);

export const createFeeStructureThunk = createAsyncThunk(
  "fees/createFeeStructure",
  async (input: NewFeeStructureInput, { rejectWithValue }) => {
    try {
      return await createFeeStructure(input);
    } catch (error) {
      return rejectWithValue(rejectMessage(error, "Unable to create fee structure"));
    }
  }
);

export const deleteFeeStructureThunk = createAsyncThunk(
  "fees/deleteFeeStructure",
  async (id: string, { rejectWithValue }) => {
    try {
      await deleteFeeStructure(id);
      return id;
    } catch (error) {
      return rejectWithValue(rejectMessage(error, "Unable to remove fee structure"));
    }
  }
);


// ==============================
// STUDENT FEES
// ==============================

export const fetchStudentFeesThunk = createAsyncThunk(
  "fees/fetchStudentFees",
  async (_, { rejectWithValue }) => {
    try {
      return await fetchStudentFees();
    } catch (error) {
      return rejectWithValue(rejectMessage(error, "Unable to load student fees"));
    }
  }
);

export const generateStudentFeesThunk = createAsyncThunk(
  "fees/generateStudentFees",
  async (input: GenerateStudentFeesInput, { rejectWithValue }) => {
    try {
      return await generateStudentFees(input);
    } catch (error) {
      return rejectWithValue(rejectMessage(error, "Unable to generate student fees"));
    }
  }
);

export const updateStudentFeeStatusThunk = createAsyncThunk(
  "fees/updateStudentFeeStatus",
  async (
    { id, status }: { id: string; status: StudentFee["status"] },
    { rejectWithValue }
  ) => {
    try {
      return await updateStudentFeeStatus(id, status);
    } catch (error) {
      return rejectWithValue(rejectMessage(error, "Unable to update fee status"));
    }
  }
);


// ==============================
// INVOICES
// ==============================

export const fetchInvoicesThunk = createAsyncThunk(
  "fees/fetchInvoices",
  async (_, { rejectWithValue }) => {
    try {
      return await fetchInvoices();
    } catch (error) {
      return rejectWithValue(rejectMessage(error, "Unable to load invoices"));
    }
  }
);

export const fetchInvoiceByIdThunk = createAsyncThunk(
  "fees/fetchInvoiceById",
  async (id: string, { rejectWithValue }) => {
    try {
      return await fetchInvoiceById(id);
    } catch (error) {
      return rejectWithValue(rejectMessage(error, "Unable to load invoice"));
    }
  }
);

export const createInvoiceThunk = createAsyncThunk(
  "fees/createInvoice",
  async (input: NewInvoiceInput, { rejectWithValue }) => {
    try {
      return await createInvoice(input);
    } catch (error) {
      return rejectWithValue(rejectMessage(error, "Unable to create invoice"));
    }
  }
);

export const deleteInvoiceThunk = createAsyncThunk(
  "fees/deleteInvoice",
  async (id: string, { rejectWithValue }) => {
    try {
      await deleteInvoice(id);
      return id;
    } catch (error) {
      return rejectWithValue(rejectMessage(error, "Unable to remove invoice"));
    }
  }
);


// ==============================
// PAYMENTS
// ==============================

export const fetchPaymentsThunk = createAsyncThunk(
  "fees/fetchPayments",
  async (_, { rejectWithValue }) => {
    try {
      return await fetchPayments();
    } catch (error) {
      return rejectWithValue(rejectMessage(error, "Unable to load payments"));
    }
  }
);

export const createPaymentThunk = createAsyncThunk(
  "fees/createPayment",
  async (input: NewPaymentInput, { rejectWithValue }) => {
    try {
      return await createPayment(input);
    } catch (error) {
      return rejectWithValue(rejectMessage(error, "Unable to record payment"));
    }
  }
);


// ==============================
// LOOKUPS & SUMMARY
// ==============================

export const fetchPaymentMethodsThunk = createAsyncThunk(
  "fees/fetchPaymentMethods",
  async (_, { rejectWithValue }) => {
    try {
      return await fetchPaymentMethods();
    } catch (error) {
      return rejectWithValue(rejectMessage(error, "Unable to load payment methods"));
    }
  }
);

export const fetchFeeSummaryThunk = createAsyncThunk(
  "fees/fetchFeeSummary",
  async (_, { rejectWithValue }) => {
    try {
      return await fetchFeeSummary();
    } catch (error) {
      return rejectWithValue(rejectMessage(error, "Unable to load fee summary"));
    }
  }
);
