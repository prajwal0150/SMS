// ==============================
// FEE CATEGORIES (master list)
// ==============================

export interface FeeCategory {
  id: string;
  category_name: string;
  category_code: string | null;
  description: string | null;
  is_mandatory: boolean;
  status: "active" | "inactive";
  created_at: string;
  updated_at: string;
}

export interface NewFeeCategoryInput {
  category_name: string;
  category_code?: string;
  description?: string;
  is_mandatory?: boolean;
  status?: "active" | "inactive";
}


// ==============================
// FEE STRUCTURES (rules per class)
// ==============================

export interface FeeStructure {
  id: string;
  category_id: string;
  class_name: string;
  section: string | null;
  academic_year: string;
  amount: number;
  is_mandatory: boolean;
  due_day: number | null;
  status: "active" | "inactive";
  created_at: string;
  updated_at: string;
  fee_categories?: FeeCategory;
}

export interface NewFeeStructureInput {
  category_id: string;
  class_name: string;
  section?: string;
  academic_year?: string;
  amount: number;
  is_mandatory?: boolean;
  due_day?: number;
  status?: "active" | "inactive";
}


// ==============================
// STUDENT FEES (per-student obligations)
// ==============================

export type StudentFeeStatus =
  | "pending"
  | "partial"
  | "paid"
  | "waived";

export interface StudentFee {
  id: string;
  student_id: string;
  fee_structure_id: string;
  category_id: string;
  class_name: string;
  section: string | null;
  academic_year: string;
  amount: number;
  due_date: string;
  fine_amount: number;
  discount_amount: number;
  status: StudentFeeStatus;
  notes: string | null;
  created_at: string;
  updated_at: string;
  students?: {
    id: string;
    first_name: string;
    last_name: string;
    admission_number: string;
    class_name: string;
    section: string | null;
  };
  fee_categories?: FeeCategory;
}

export interface NewStudentFeeInput {
  student_id: string;
  fee_structure_id: string;
  category_id: string;
  class_name: string;
  section?: string;
  academic_year: string;
  amount: number;
  due_date: string;
  fine_amount?: number;
  discount_amount?: number;
  status?: StudentFeeStatus;
  notes?: string;
}

export interface GenerateStudentFeesInput {
  fee_structure_id: string;
  class_name: string;
  section?: string;
  academic_year: string;
  due_date: string;
}


// ==============================
// INVOICES
// ==============================

export type InvoiceStatus =
  | "draft"
  | "unpaid"
  | "partial"
  | "paid"
  | "overdue"
  | "cancelled";

export interface Invoice {
  id: string;
  student_id: string;
  invoice_number: string;
  total_amount: number;
  discount_amount: number;
  fine_amount: number;
  payable_amount: number;
  paid_amount: number;
  due_date: string;
  issue_date: string;
  status: InvoiceStatus;
  notes: string | null;
  created_at: string;
  updated_at: string;
  students?: {
    id: string;
    first_name: string;
    last_name: string;
    admission_number: string;
  };
  payments?: Payment[];
}

export interface NewInvoiceInput {
  student_id: string;
  total_amount: number;
  discount_amount?: number;
  fine_amount?: number;
  payable_amount: number;
  due_date: string;
  issue_date?: string;
  notes?: string;
}


// ==============================
// INVOICE ITEMS
// ==============================

export interface InvoiceItem {
  id: string;
  invoice_id: string;
  student_fee_id: string;
  amount: number;
  created_at: string;
  student_fees?: StudentFee;
}


// ==============================
// PAYMENT METHODS
// ==============================

export interface PaymentMethod {
  id: string;
  method_name: string;
  method_code: string;
  description: string | null;
  status: "active" | "inactive";
  created_at: string;
  updated_at: string;
}

export type NewPaymentMethodInput = Omit<
  PaymentMethod,
  "id" | "created_at" | "updated_at"
>;


// ==============================
// PAYMENTS
// ==============================

export interface Payment {
  id: string;
  invoice_id: string;
  payment_method_id: string | null;
  amount: number;
  transaction_id: string | null;
  payment_date: string;
  received_by: string | null;
  notes: string | null;
  created_at: string;
  payment_methods?: PaymentMethod;
}

export type NewPaymentInput = Omit<
  Payment,
  "id" | "created_at"
> & {
  payable_amount?: number;
};


// ==============================
// VIEWS
// ==============================

export interface FeeSummary {
  total_students: number;
  total_outstanding: number;
  today_collection: number;
  pending_invoices: number;
  overdue_invoices: number;
}


export type FeesManagementView =
  | "overview"
  | "categories"
  | "add-category"
  | "structures"
  | "add-structure"
  | "student-fees"
  | "generate-fees"
  | "invoices"
  | "create-invoice"
  | "payments"
  | "record-payment";
