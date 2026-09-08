import { useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import toast from "react-hot-toast";

import type { AppDispatch } from "../../../../redux/store";

import {
  selectFeeCategories,
  selectFeeStructures,
  selectStudentFees,
  selectInvoices,
  selectInvoiceDetail,
  selectPayments,
  selectPaymentMethods,
  selectFeeSummary,
  selectFeesLoading,
  selectFeesSaving,
  selectFeesError,
} from "../redux/feesSelector";

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
} from "../redux/feesThunk";

import { clearError } from "../redux/feesSlice";

import type {
  StudentFee,
  NewFeeCategoryInput,
  NewFeeStructureInput,
  GenerateStudentFeesInput,
  NewInvoiceInput,
  NewPaymentInput,
} from "../types/feesTypes";


const asMessage = (error: unknown): string =>
  typeof error === "string"
    ? error
    : error instanceof Error
      ? error.message
      : "Something went wrong.";


export const useFees = () => {
  const dispatch = useDispatch<AppDispatch>();

  const categories = useSelector(selectFeeCategories);
  const structures = useSelector(selectFeeStructures);
  const studentFees = useSelector(selectStudentFees);
  const invoices = useSelector(selectInvoices);
  const invoiceDetail = useSelector(selectInvoiceDetail);
  const payments = useSelector(selectPayments);
  const paymentMethods = useSelector(selectPaymentMethods);
  const summary = useSelector(selectFeeSummary);
  const loading = useSelector(selectFeesLoading);
  const saving = useSelector(selectFeesSaving);
  const error = useSelector(selectFeesError);


  // ==============================
  // FEES OVERVIEW (summary + payments)
  // ==============================

  const loadSummary = useCallback(() => {
    dispatch(fetchFeeSummaryThunk())
      .unwrap()
      .catch((err) => toast.error(asMessage(err)));
  }, [dispatch]);


  // ==============================
  // FEE CATEGORIES
  // ==============================

  const loadCategories = useCallback(() => {
    dispatch(fetchFeeCategoriesThunk())
      .unwrap()
      .catch((err) => toast.error(asMessage(err)));
  }, [dispatch]);


  const handleCreateCategory = useCallback(
    async (input: NewFeeCategoryInput) => {
      try {
        await dispatch(createFeeCategoryThunk(input)).unwrap();
        toast.success("Fee category created.");
        return true;
      } catch (err) {
        toast.error(asMessage(err));
        return false;
      }
    },
    [dispatch]
  );


  const handleUpdateCategory = useCallback(
    async (id: string, input: NewFeeCategoryInput) => {
      try {
        await dispatch(
          updateFeeCategoryThunk({ id, input })
        ).unwrap();
        toast.success("Fee category updated.");
        return true;
      } catch (err) {
        toast.error(asMessage(err));
        return false;
      }
    },
    [dispatch]
  );


  const handleDeleteCategory = useCallback(
    async (id: string) => {
      try {
        await dispatch(deleteFeeCategoryThunk(id)).unwrap();
        toast.success("Fee category removed.");
      } catch (err) {
        toast.error(asMessage(err));
      }
    },
    [dispatch]
  );


  // ==============================
  // FEE STRUCTURES
  // ==============================

  const loadStructures = useCallback(() => {
    dispatch(fetchFeeStructuresThunk())
      .unwrap()
      .catch((err) => toast.error(asMessage(err)));
  }, [dispatch]);


  const handleCreateStructure = useCallback(
    async (input: NewFeeStructureInput) => {
      try {
        await dispatch(createFeeStructureThunk(input)).unwrap();
        toast.success("Fee structure created.");
        return true;
      } catch (err) {
        toast.error(asMessage(err));
        return false;
      }
    },
    [dispatch]
  );


  const handleDeleteStructure = useCallback(
    async (id: string) => {
      try {
        await dispatch(deleteFeeStructureThunk(id)).unwrap();
        toast.success("Fee structure removed.");
      } catch (err) {
        toast.error(asMessage(err));
      }
    },
    [dispatch]
  );


  // ==============================
  // STUDENT FEES
  // ==============================

  const loadStudentFees = useCallback(() => {
    dispatch(fetchStudentFeesThunk())
      .unwrap()
      .catch((err) => toast.error(asMessage(err)));
  }, [dispatch]);


  const handleGenerateStudentFees = useCallback(
    async (input: GenerateStudentFeesInput) => {
      try {
        const created = await dispatch(
          generateStudentFeesThunk(input)
        ).unwrap();
        toast.success(
          `${created.length} fee record(s) generated.`
        );
        return true;
      } catch (err) {
        toast.error(asMessage(err));
        return false;
      }
    },
    [dispatch]
  );


  const handleUpdateStudentFeeStatus = useCallback(
    async (id: string, status: StudentFee["status"]) => {
      try {
        await dispatch(
          updateStudentFeeStatusThunk({ id, status })
        ).unwrap();
        toast.success("Student fee status updated.");
        return true;
      } catch (err) {
        toast.error(asMessage(err));
        return false;
      }
    },
    [dispatch]
  );


  // ==============================
  // INVOICES
  // ==============================

  const loadInvoices = useCallback(() => {
    dispatch(fetchInvoicesThunk())
      .unwrap()
      .catch((err) => toast.error(asMessage(err)));
  }, [dispatch]);


  const loadInvoiceById = useCallback(
    (id: string) => {
      dispatch(fetchInvoiceByIdThunk(id))
        .unwrap()
        .catch((err) => toast.error(asMessage(err)));
    },
    [dispatch]
  );


  const handleCreateInvoice = useCallback(
    async (input: NewInvoiceInput) => {
      try {
        await dispatch(createInvoiceThunk(input)).unwrap();
        toast.success("Invoice created.");
        return true;
      } catch (err) {
        toast.error(asMessage(err));
        return false;
      }
    },
    [dispatch]
  );


  const handleDeleteInvoice = useCallback(
    async (id: string) => {
      try {
        await dispatch(deleteInvoiceThunk(id)).unwrap();
        toast.success("Invoice removed.");
      } catch (err) {
        toast.error(asMessage(err));
      }
    },
    [dispatch]
  );


  // ==============================
  // PAYMENTS
  // ==============================

  const loadPayments = useCallback(() => {
    dispatch(fetchPaymentsThunk())
      .unwrap()
      .catch((err) => toast.error(asMessage(err)));
  }, [dispatch]);


  const loadPaymentMethods = useCallback(() => {
    dispatch(fetchPaymentMethodsThunk())
      .unwrap()
      .catch((err) => toast.error(asMessage(err)));
  }, [dispatch]);


  const handleCreatePayment = useCallback(
    async (input: NewPaymentInput) => {
      try {
        await dispatch(createPaymentThunk(input)).unwrap();
        toast.success("Payment recorded.");
        loadInvoices();
        return true;
      } catch (err) {
        toast.error(asMessage(err));
        return false;
      }
    },
    [dispatch, loadInvoices]
  );


  const clearFeesError = useCallback(() => {
    dispatch(clearError());
  }, [dispatch]);


  return {
    // state
    categories,
    structures,
    studentFees,
    invoices,
    invoiceDetail,
    payments,
    paymentMethods,
    summary,
    loading,
    saving,
    error,

    // loaders
    loadSummary,
    loadCategories,
    loadStructures,
    loadStudentFees,
    loadInvoices,
    loadInvoiceById,
    loadPayments,
    loadPaymentMethods,

    // handlers
    handleCreateCategory,
    handleUpdateCategory,
    handleDeleteCategory,
    handleCreateStructure,
    handleDeleteStructure,
    handleGenerateStudentFees,
    handleUpdateStudentFeeStatus,
    handleCreateInvoice,
    handleDeleteInvoice,
    handleCreatePayment,
    clearFeesError,
  };
};
