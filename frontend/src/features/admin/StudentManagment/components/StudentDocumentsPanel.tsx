import { useState } from "react";
import { ExternalLink, FileText, Trash2 } from "lucide-react";

import Card from "../../dashboard/components/Card";
import DataState from "./DataState";

import type {
  Student,
  StudentDocument,
  NewDocumentInput,
  DocumentType,
} from "../types/studentManagmentTypes";


const inputClass =
  "h-11 w-full rounded-lg border border-slate-200 bg-slate-50/70 px-4 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-[#166534] focus:bg-white focus:ring-4 focus:ring-[#166534]/10";


const DOCUMENT_TYPES: DocumentType[] = [
  "Birth Certificate",
  "Aadhaar Card",
  "Marksheet",
  "Transfer Certificate",
  "Passport Photo",
  "Medical Report",
  "Other",
];


interface StudentDocumentsPanelProps {
  students: Student[];
  documents: StudentDocument[];
  documentsLoading: boolean;
  saving: boolean;
  onCreate: (input: NewDocumentInput) => Promise<boolean>;
  onDelete: (id: string) => void;
  onReload: () => void;
}

const fullName = (student: Student): string =>
  [student.first_name, student.middle_name, student.last_name]
    .filter(Boolean)
    .join(" ");

const studentName = (
  students: Student[],
  id: string
): string => {
  const student = students.find((item) => item.id === id);

  return student ? fullName(student) : "Unknown student";
};


const StudentDocumentsPanel = ({
  students,
  documents,
  documentsLoading,
  saving,
  onCreate,
  onDelete,
  onReload,
}: StudentDocumentsPanelProps) => {

  const [studentId, setStudentId] = useState("");
  const [documentType, setDocumentType] =
    useState<DocumentType>("Birth Certificate");
  const [documentName, setDocumentName] = useState("");
  const [fileUrl, setFileUrl] = useState("");


  const handleSubmit = async (
    event: React.FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();

    if (!studentId) {
      return;
    }

    const success = await onCreate({
      student_id: studentId,
      document_type: documentType,
      document_name: documentName.trim(),
      file_url: fileUrl.trim(),
    });

    if (success) {
      setStudentId("");
      setDocumentName("");
      setFileUrl("");
    }
  };


  return (
    <Card
      title="Student Documents"
      subtitle="Attach documents to student records"
      className="overflow-hidden"
    >
      {/* Document upload form */}
      <form
        onSubmit={handleSubmit}
        className="mb-6 grid gap-4 rounded-lg border border-slate-200 bg-slate-50/60 p-4 sm:p-5 lg:grid-cols-5"
      >
        <div>
          <label htmlFor="dStudent" className="mb-2 block text-sm font-semibold text-slate-700">
            Student
          </label>
          <select
            id="dStudent"
            value={studentId}
            onChange={(event) => setStudentId(event.target.value)}
            required
            className={inputClass}
          >
            <option value="">Select student</option>
            {students.map((student) => (
              <option key={student.id} value={student.id}>
                {fullName(student)} ({student.admission_number})
              </option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="dType" className="mb-2 block text-sm font-semibold text-slate-700">
            Document type
          </label>
          <select
            id="dType"
            value={documentType}
            onChange={(event) => setDocumentType(event.target.value as DocumentType)}
            className={inputClass}
          >
            {DOCUMENT_TYPES.map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="dName" className="mb-2 block text-sm font-semibold text-slate-700">
            Document name
          </label>
          <input
            id="dName"
            type="text"
            value={documentName}
            onChange={(event) => setDocumentName(event.target.value)}
            required
            placeholder="e.g. Birth certificate scan"
            className={inputClass}
          />
        </div>

        <div>
          <label htmlFor="dUrl" className="mb-2 block text-sm font-semibold text-slate-700">
            File URL
          </label>
          <input
            id="dUrl"
            type="url"
            value={fileUrl}
            onChange={(event) => setFileUrl(event.target.value)}
            required
            placeholder="https://..."
            className={inputClass}
          />
        </div>

        <div className="flex items-end">
          <button
            type="submit"
            disabled={saving}
            className="flex h-11 w-full items-center justify-center gap-2 rounded-lg bg-[#166534] px-4 text-sm font-semibold text-white transition-all duration-200 hover:-translate-y-0.5 hover:bg-[#14532D] disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:translate-y-0"
          >
            <FileText size={16} />
            {saving ? "Saving..." : "Attach"}
          </button>
        </div>
      </form>

      {/* Documents list */}
      {documentsLoading || documents.length === 0 ? (
        <DataState
          loading={documentsLoading}
          onReload={onReload}
          message="No documents yet. Attach a document above."
        />
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full min-w-[640px] border-collapse text-sm">
            <thead>
              <tr>
                <th className="border-b border-slate-200 bg-slate-50 px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                  Document
                </th>
                <th className="border-b border-slate-200 bg-slate-50 px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                  Student
                </th>
                <th className="border-b border-slate-200 bg-slate-50 px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                  Added
                </th>
                <th className="border-b border-slate-200 bg-slate-50 px-4 py-3 text-right text-xs font-semibold uppercase tracking-wider text-slate-500">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {documents.map((document) => (
                <tr
                  key={document.id}
                  className="border-b border-slate-100 transition last:border-0 hover:bg-slate-50/60"
                >
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[#D4A017]/15 text-[#8A6A0D]">
                        <FileText size={16} />
                      </div>
                      <div className="min-w-0">
                        <p className="truncate font-semibold text-slate-900">
                          {document.document_name}
                        </p>
                        <p className="text-xs text-slate-500">
                          {document.document_type}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 font-medium text-slate-700">
                    {studentName(students, document.student_id)}
                  </td>
                  <td className="px-4 py-3 text-slate-600">
                    {document.created_at.slice(0, 10)}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-end gap-1">
                      <a
                        href={document.file_url}
                        target="_blank"
                        rel="noreferrer"
                        title="Open document"
                        className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-700"
                      >
                        <ExternalLink size={15} />
                      </a>
                      <button
                        type="button"
                        onClick={() => onDelete(document.id)}
                        title="Delete document"
                        className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 transition-colors hover:bg-red-50 hover:text-red-600"
                      >
                        <Trash2 size={15} />
                      </button>
                    </div>
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

export default StudentDocumentsPanel;