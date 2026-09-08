import { supabase } from "../../../../lib/supabase";

import type {
  FeeCategory,
  FeeStructure,
  StudentFee,
  Invoice,
  PaymentMethod,
  Payment,
  FeeSummary,
  NewFeeCategoryInput,
  NewFeeStructureInput,
  NewInvoiceInput,
  NewPaymentMethodInput,
  NewPaymentInput,
  GenerateStudentFeesInput,
} from "../types/feesTypes";


// ==============================
// FEE CATEGORIES
// ==============================

export const fetchFeeCategories =
  async (): Promise<FeeCategory[]> => {
    const { data, error } = await supabase
      .from("fee_categories")
      .select("*")
      .order("category_name", { ascending: true });

    if (error) {
      throw new Error(error.message);
    }

    return (data ?? []) as FeeCategory[];
  };


export const createFeeCategory = async (
  input: NewFeeCategoryInput
): Promise<FeeCategory> => {
  const { data, error } = await supabase
    .from("fee_categories")
    .insert(input)
    .select()
    .single();

  if (error) {
    throw new Error(error.message);
  }

  return data as FeeCategory;
};


export const updateFeeCategory = async (
  id: string,
  input: NewFeeCategoryInput
): Promise<FeeCategory> => {
  const { data, error } = await supabase
    .from("fee_categories")
    .update(input)
    .eq("id", id)
    .select()
    .single();

  if (error) {
    throw new Error(error.message);
  }

  return data as FeeCategory;
};


export const deleteFeeCategory = async (
  id: string
): Promise<void> => {
  const { error } = await supabase
    .from("fee_categories")
    .delete()
    .eq("id", id);

  if (error) {
    throw new Error(error.message);
  }
};


// ==============================
// FEE STRUCTURES
// ==============================

export const fetchFeeStructures =
  async (): Promise<FeeStructure[]> => {
    const { data, error } = await supabase
      .from("fee_structures")
      .select(`*, fee_categories(*)`)
      .order("class_name", { ascending: true });

    if (error) {
      throw new Error(error.message);
    }

    return (data ?? []) as FeeStructure[];
  };


export const createFeeStructure = async (
  input: NewFeeStructureInput
): Promise<FeeStructure> => {
  const { data, error } = await supabase
    .from("fee_structures")
    .insert(input)
    .select(`*, fee_categories(*)`)
    .single();

  if (error) {
    throw new Error(error.message);
  }

  return data as FeeStructure;
};


export const updateFeeStructure = async (
  id: string,
  input: NewFeeStructureInput
): Promise<FeeStructure> => {
  const { data, error } = await supabase
    .from("fee_structures")
    .update(input)
    .eq("id", id)
    .select(`*, fee_categories(*)`)
    .single();

  if (error) {
    throw new Error(error.message);
  }

  return data as FeeStructure;
};


export const deleteFeeStructure = async (
  id: string
): Promise<void> => {
  const { error } = await supabase
    .from("fee_structures")
    .delete()
    .eq("id", id);

  if (error) {
    throw new Error(error.message);
  }
};


// ==============================
// STUDENT FEES
// ==============================

export const fetchStudentFees =
  async (): Promise<StudentFee[]> => {
    const { data, error } = await supabase
      .from("student_fees")
      .select(`*, students(*), fee_categories(*)`)
      .order("created_at", { ascending: false });

    if (error) {
      throw new Error(error.message);
    }

    return (data ?? []) as StudentFee[];
  };


export const fetchStudentFeesByStudent =
  async (studentId: string): Promise<StudentFee[]> => {
    const { data, error } = await supabase
      .from("student_fees")
      .select(`*, fee_categories(*)`)
      .eq("student_id", studentId)
      .order("due_date", { ascending: false });

    if (error) {
      throw new Error(error.message);
    }

    return (data ?? []) as StudentFee[];
  };


export const generateStudentFees = async (
  input: GenerateStudentFeesInput
): Promise<StudentFee[]> => {
  const { data: structure, error: structError } = await supabase
    .from("fee_structures")
    .select("*, fee_categories(*)")
    .eq("id", input.fee_structure_id)
    .single();

  if (structError) {
    throw new Error(structError.message);
  }

  if (!structure) {
    throw new Error("Fee structure not found.");
  }

  const query = supabase
    .from("students")
    .select("id, class_name, section")
    .eq("class_name", input.class_name);

  if (input.section) {
    query.eq("section", input.section);
  }

  const { data: students, error: studentError } = await query;

  if (studentError) {
    throw new Error(studentError.message);
  }

  if (!students || students.length === 0) {
    throw new Error(
      "No students found for the selected class/section."
    );
  }

  const rows = students.map((student) => ({
    student_id: student.id,
    fee_structure_id: input.fee_structure_id,
    category_id: structure.category_id,
    class_name: input.class_name,
    section: student.section ?? null,
    academic_year: input.academic_year ?? "2026-2027",
    amount: Number(structure.amount),
    due_date: input.due_date,
  }));

  const { data, error } = await supabase
    .from("student_fees")
    .upsert(rows, {
      onConflict: "student_id,fee_structure_id,academic_year",
    })
    .select(`*, students(*), fee_categories(*)`);

  if (error) {
    throw new Error(error.message);
  }

  return (data ?? []) as StudentFee[];
};


export const updateStudentFeeStatus = async (
  id: string,
  status: StudentFee["status"]
): Promise<StudentFee> => {
  const { data, error } = await supabase
    .from("student_fees")
    .update({ status })
    .eq("id", id)
    .select(`*, students(*), fee_categories(*)`)
    .single();

  if (error) {
    throw new Error(error.message);
  }

  return data as StudentFee;
};


// ==============================
// INVOICES
// ==============================

const nextInvoiceNumber = async (): Promise<string> => {
  const year = new Date().getFullYear();
  const { data, error } = await supabase.rpc("get_next_invoice_number", {
    p_year: year,
  });

  if (error) {
    const fallback = `INV-${year}-${Date.now().toString().slice(-6)}`;
    return fallback;
  }

  return data as string;
};


export const fetchInvoices =
  async (): Promise<Invoice[]> => {
    const { data, error } = await supabase
      .from("invoices")
      .select(`*, students(*), payments(*)`)
      .order("created_at", { ascending: false });

    if (error) {
      throw new Error(error.message);
    }

    return (data ?? []) as Invoice[];
  };


export const fetchInvoiceById =
  async (id: string): Promise<Invoice> => {
    const { data, error } = await supabase
      .from("invoices")
      .select(`*, students(*), payments(*), invoice_items(*)`)
      .eq("id", id)
      .single();

    if (error) {
      throw new Error(error.message);
    }

    return data as Invoice;
  };


export const createInvoice = async (
  input: NewInvoiceInput
): Promise<Invoice> => {
  const invoiceNumber = await nextInvoiceNumber();

  const { data, error } = await supabase
    .from("invoices")
    .insert({
      ...input,
      invoice_number: invoiceNumber,
    })
    .select(`*, students(*), payments(*)`)
    .single();

  if (error) {
    throw new Error(error.message);
  }

  return data as Invoice;
};


export const updateInvoiceStatus = async (
  id: string,
  status: Invoice["status"],
  paidAmount?: number
): Promise<Invoice> => {
  const patch: Record<string, unknown> = { status };
  if (paidAmount !== undefined) {
    patch.paid_amount = paidAmount;
  }

  const { data, error } = await supabase
    .from("invoices")
    .update(patch)
    .eq("id", id)
    .select(`*, students(*), payments(*)`)
    .single();

  if (error) {
    throw new Error(error.message);
  }

  return data as Invoice;
};


export const deleteInvoice = async (
  id: string
): Promise<void> => {
  const { error } = await supabase
    .from("invoices")
    .delete()
    .eq("id", id);

  if (error) {
    throw new Error(error.message);
  }
};


// ==============================
// PAYMENTS
// ==============================

export const fetchPayments =
  async (): Promise<Payment[]> => {
    const { data, error } = await supabase
      .from("payments")
      .select(`*, payment_methods(*), invoices!inner(*)`)
      .order("payment_date", { ascending: false });

    if (error) {
      throw new Error(error.message);
    }

    return (data ?? []) as Payment[];
  };


export const fetchPaymentsByInvoice =
  async (invoiceId: string): Promise<Payment[]> => {
    const { data, error } = await supabase
      .from("payments")
      .select(`*, payment_methods(*)`)
      .eq("invoice_id", invoiceId)
      .order("payment_date", { ascending: false });

    if (error) {
      throw new Error(error.message);
    }

    return (data ?? []) as Payment[];
  };


export const createPayment = async (
  input: NewPaymentInput
): Promise<Payment> => {
  const { invoice_id, amount, payment_method_id } = input;

  const { data: invoiceData, error: invoiceError } = await supabase
    .from("invoices")
    .select("paid_amount, payable_amount, status")
    .eq("id", invoice_id)
    .single();

  if (invoiceError) {
    throw new Error(invoiceError.message);
  }

  const currentPaid = Number(invoiceData?.paid_amount ?? 0);
  const payable = Number(invoiceData?.payable_amount ?? 0);
  const newPaid = currentPaid + Number(amount);

  let newStatus: Invoice["status"] = "partial";
  if (newPaid >= payable) {
    newStatus = "paid";
  } else if (newPaid > 0) {
    newStatus = "partial";
  }

  const { data, error } = await supabase
    .from("payments")
    .insert({
      invoice_id,
      amount,
      payment_method_id,
      transaction_id: input.transaction_id,
      payment_date: input.payment_date,
      received_by: input.received_by,
      notes: input.notes,
    })
    .select(`*, payment_methods(*)`)
    .single();

  if (error) {
    throw new Error(error.message);
  }

  await updateInvoiceStatus(invoice_id, newStatus, newPaid);

  return data as Payment;
};


// ==============================
// PAYMENT METHODS
// ==============================

export const fetchPaymentMethods =
  async (): Promise<PaymentMethod[]> => {
    const { data, error } = await supabase
      .from("payment_methods")
      .select("*")
      .order("method_name", { ascending: true });

    if (error) {
      throw new Error(error.message);
    }

    return (data ?? []) as PaymentMethod[];
  };


export const createPaymentMethod = async (
  input: NewPaymentMethodInput
): Promise<PaymentMethod> => {
  const { data, error } = await supabase
    .from("payment_methods")
    .insert(input)
    .select()
    .single();

  if (error) {
    throw new Error(error.message);
  }

  return data as PaymentMethod;
};


// ==============================
// FEE SUMMARY (dashboard stats)
// ==============================

export const fetchFeeSummary =
  async (): Promise<FeeSummary> => {
    const today = new Date().toISOString().slice(0, 10);

    const [studentsRes, todayRes, pendingRes, overdueRes] =
      await Promise.all([
        supabase.from("students").select("id", { count: "exact", head: true }),
        supabase
          .from("payments")
          .select("amount", { count: "exact" })
          .gte("payment_date", today)
          .lte("payment_date", today),
        supabase
          .from("invoices")
          .select("id", { count: "exact" })
          .eq("status", "unpaid"),
        supabase
          .from("invoices")
          .select("id", { count: "exact" })
          .eq("status", "overdue"),
      ]);

    const totalStudents = Number(studentsRes.count ?? 0);

    const { data: outstanding, error: outError } =
      await supabase
        .from("invoices")
        .select("payable_amount, paid_amount")
        .in("status", ["unpaid", "partial", "overdue"]);

    if (outError) {
      throw new Error(outError.message);
    }

    const totalOutstanding = (outstanding ?? []).reduce(
      (sum, inv) =>
        sum +
        (Number(inv.payable_amount) - Number(inv.paid_amount)),
      0
    );

    const todayCollection = (todayRes.data ?? []).reduce(
      (sum, p) => sum + Number(p.amount),
      0
    );

    return {
      total_students: totalStudents,
      total_outstanding: totalOutstanding,
      today_collection: todayCollection,
      pending_invoices: Number(pendingRes.count ?? 0),
      overdue_invoices: Number(overdueRes.count ?? 0),
    };
  };
