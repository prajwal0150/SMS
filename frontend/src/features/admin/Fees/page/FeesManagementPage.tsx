import { useEffect, useState } from "react";

import PageHeader from "../../dashboard/components/PageHeader";

import FeesActions from "../components/FeesActions";
import FeeStats from "../components/FeeStats";
import FeeCategoriesTable from "../components/FeeCategoriesTable";
import AddFeeCategoryForm from "../components/AddFeeCategoryForm";
import FeeStructuresTable from "../components/FeeStructuresTable";
import AddFeeStructureForm from "../components/AddFeeStructureForm";
import StudentFeesTable from "../components/StudentFeesTable";
import AssignFeesForm from "../components/AssignFeesForm";
import InvoicesTable from "../components/InvoicesTable";
import CreateInvoiceForm from "../components/CreateInvoiceForm";
import PaymentsTable from "../components/PaymentsTable";
import RecordPaymentForm from "../components/RecordPaymentForm";

import { useFees } from "../hooks/useFees";

import type {
  FeesManagementView,
  FeeCategory,
  FeeStructure,
} from "../types/feesTypes";


interface FeesManagementPageProps {
  initialView?: FeesManagementView;
}


const VIEW_LABELS: Record<FeesManagementView, string> = {
  overview: "Overview",
  categories: "Fee Categories",
  "add-category": "Add Fee Category",
  structures: "Fee Structures",
  "add-structure": "Add Fee Structure",
  "student-fees": "Student Fees",
  "generate-fees": "Assign Fees",
  invoices: "Invoices",
  "create-invoice": "Create Invoice",
  payments: "Payments",
  "record-payment": "Record Payment",
};


const FeesManagementPage = ({
  initialView = "overview",
}: FeesManagementPageProps) => {
  const [view, setView] =
    useState<FeesManagementView>(initialView);

  const [editingCategory, setEditingCategory] =
    useState<FeeCategory | null>(null);
  const [editingStructure, setEditingStructure] =
    useState<FeeStructure | null>(null);

  const {
    summary,
    categories,
    structures,
    studentFees,
    invoices,
    payments,
    loading,
    saving,
    error,
    loadSummary,
    loadCategories,
    loadStructures,
    loadStudentFees,
    loadInvoices,
    loadPayments,
    loadPaymentMethods,
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
  } = useFees();


  useEffect(() => {
    loadSummary();
    loadCategories();
    loadStructures();
    loadStudentFees();
    loadInvoices();
    loadPayments();
    loadPaymentMethods();
  }, [
    loadSummary,
    loadCategories,
    loadStructures,
    loadStudentFees,
    loadInvoices,
    loadPayments,
    loadPaymentMethods,
  ]);


  const onCategorySave = async (
    input: { category_name: string; category_code?: string; description?: string; is_mandatory?: boolean; status?: "active" | "inactive" }
  ): Promise<boolean> => {
    if (editingCategory) {
      return handleUpdateCategory(editingCategory.id, input);
    }
    return handleCreateCategory(input);
  };


  const onStructureSave = async (
    input: { category_id: string; class_name: string; section?: string; academic_year?: string; amount: number; is_mandatory?: boolean; due_day?: number; status?: "active" | "inactive" }
  ): Promise<boolean> => {
    return handleCreateStructure(input);
  };


  const isFormView =
    view === "add-category" ||
    view === "add-structure" ||
    view === "generate-fees" ||
    view === "create-invoice" ||
    view === "record-payment";


  return (
    <>
      <PageHeader
        title="Fee Management"
        description="Manage fee categories, structures, student fees, invoices and payments."
        actions={
          <FeesActions
            view={view}
            onChange={(next) => {
              setView(next);
              setEditingCategory(null);
              setEditingStructure(null);
            }}
          />
        }
      />

      {isFormView && (
        <div className="mb-4 flex animate-fade-up items-center rounded-lg border border-slate-200 bg-white px-4 py-2">
          <p className="text-xs font-semibold text-slate-900">
            {VIEW_LABELS[view]}
          </p>
        </div>
      )}

      <div className="mt-4">
        {view === "overview" && (
          <FeeStats summary={summary} loading={loading} />
        )}

        {view === "categories" && (
          <FeeCategoriesTable
            categories={categories}
            loading={loading}
            error={error}
            onEdit={(category) => {
              setEditingCategory(category);
              setView("add-category");
            }}
            onDelete={handleDeleteCategory}
            onReload={loadCategories}
          />
        )}

        {view === "add-category" && (
          <AddFeeCategoryForm
            saving={saving}
            editing={editingCategory}
            onSave={onCategorySave}
            onCancel={() => {
              setEditingCategory(null);
              setView("categories");
            }}
          />
        )}

        {view === "structures" && (
          <FeeStructuresTable
            structures={structures}
            categories={categories}
            loading={loading}
            error={error}
            onEdit={(structure) => {
              setEditingStructure(structure);
              setView("add-structure");
            }}
            onDelete={handleDeleteStructure}
            onReload={loadStructures}
          />
        )}

        {view === "add-structure" && (
          <AddFeeStructureForm
            categories={categories}
            saving={saving}
            editing={editingStructure}
            onSave={onStructureSave}
            onCancel={() => {
              setEditingStructure(null);
              setView("structures");
            }}
          />
        )}

        {view === "student-fees" && (
          <>
            <div className="mb-3 flex justify-end">
              <button
                type="button"
                onClick={() => setView("generate-fees")}
                className="inline-flex h-10 items-center gap-2 rounded-lg bg-[#7C3AED] px-4 text-sm font-semibold text-white transition-all duration-200 hover:-translate-y-0.5 hover:bg-[#6D28D9]"
              >
                Assign Fees
              </button>
            </div>
            <StudentFeesTable
              studentFees={studentFees}
              loading={loading}
              error={error}
              onStatusChange={handleUpdateStudentFeeStatus}
              onReload={loadStudentFees}
            />
          </>
        )}

        {view === "generate-fees" && (
          <AssignFeesForm
            structures={structures}
            saving={saving}
            onSave={handleGenerateStudentFees}
            onCancel={() => setView("student-fees")}
          />
        )}

        {view === "invoices" && (
          <>
            <div className="mb-3 flex justify-end">
              <button
                type="button"
                onClick={() => setView("create-invoice")}
                className="inline-flex h-10 items-center gap-2 rounded-lg bg-[#7C3AED] px-4 text-sm font-semibold text-white transition-all duration-200 hover:-translate-y-0.5 hover:bg-[#6D28D9]"
              >
                Create Invoice
              </button>
            </div>
            <InvoicesTable
              invoices={invoices}
              loading={loading}
              error={error}
              onView={(_inv) => {
                // placeholder — could open a detail drawer
              }}
              onDelete={handleDeleteInvoice}
              onReload={loadInvoices}
            />
          </>
        )}

        {view === "create-invoice" && (
          <CreateInvoiceForm
            saving={saving}
            onSave={handleCreateInvoice}
            onCancel={() => setView("invoices")}
          />
        )}

        {view === "payments" && (
          <>
            <div className="mb-3 flex justify-end">
              <button
                type="button"
                onClick={() => setView("record-payment")}
                className="inline-flex h-10 items-center gap-2 rounded-lg bg-[#7C3AED] px-4 text-sm font-semibold text-white transition-all duration-200 hover:-translate-y-0.5 hover:bg-[#6D28D9]"
              >
                Record Payment
              </button>
            </div>
            <PaymentsTable
              payments={payments}
              loading={loading}
              error={error}
              onReload={loadPayments}
            />
          </>
        )}

        {view === "record-payment" && (
          <RecordPaymentForm
            onSave={handleCreatePayment}
            onCancel={() => setView("payments")}
          />
        )}
      </div>
    </>
  );
};

export default FeesManagementPage;
