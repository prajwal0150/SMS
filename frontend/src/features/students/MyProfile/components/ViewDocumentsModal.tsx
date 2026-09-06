import { useEffect, useState } from "react";
import { FileText, Loader2, RefreshCw, X } from "lucide-react";

import { fetchStudentDocuments } from "../services/profileService";
import { formatDate } from "../utils/profileUtils";

import type { StudentDocument } from "../types/profileTypes";

interface ViewDocumentsModalProps {
  open: boolean;
  studentId: string | null;
  onClose: () => void;
}

/**
 * Lists the documents the school has uploaded for the
 * student (student_documents table), with links to open
 * each file.
 */
const ViewDocumentsModal = ({
  open,
  studentId,
  onClose,
}: ViewDocumentsModalProps) => {
  const [documents, setDocuments] = useState<StudentDocument[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fresh list every time the popup opens.
  const [prevOpen, setPrevOpen] = useState(open);

  if (open !== prevOpen) {
    setPrevOpen(open);

    if (open) {
      setDocuments([]);
      setError(null);
      setLoading(true);
    }
  }

  useEffect(() => {
    if (!open || !studentId) {
      return;
    }

    let cancelled = false;

    const loadDocuments = async () => {
      try {
        const rows = await fetchStudentDocuments(studentId);

        if (!cancelled) {
          setDocuments(rows);
        }
      } catch (err) {
        if (!cancelled) {
          setError(
            err instanceof Error
              ? err.message
              : "Could not load the documents."
          );
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    loadDocuments();

    return () => {
      cancelled = true;
    };
  }, [open, studentId]);

  if (!open) {
    return null;
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4"
      onClick={onClose}
    >
      <div
        className="flex max-h-[80vh] w-full max-w-lg flex-col overflow-hidden rounded-xl bg-white shadow-xl"
        onClick={(event) => event.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4">
          <div>
            <h2 className="text-base font-bold text-slate-900">
              My Documents
            </h2>
            <p className="mt-0.5 text-xs text-slate-400">
              Documents shared by the school office
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 transition hover:bg-slate-100 hover:text-slate-600"
          >
            <X size={17} />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto px-5 py-4">
          {loading ? (
            <div className="flex items-center justify-center gap-2 py-10 text-sm text-slate-400">
              <Loader2 size={16} className="animate-spin" />
              Loading documents...
            </div>
          ) : error ? (
            <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-center">
              <p className="text-xs font-semibold text-red-700">{error}</p>
              <button
                type="button"
                onClick={() => {
                  setError(null);
                  setLoading(true);
                }}
                className="mt-3 inline-flex items-center gap-1.5 rounded-lg bg-red-600 px-3 py-1.5 text-xs font-semibold text-white transition hover:bg-red-700"
              >
                <RefreshCw size={12} />
                Try again
              </button>
            </div>
          ) : documents.length === 0 ? (
            <div className="flex flex-col items-center gap-2 py-10 text-center">
              <FileText size={28} className="text-slate-200" />
              <p className="text-sm font-medium text-slate-500">
                No documents on file yet.
              </p>
              <p className="text-xs text-slate-400">
                Documents uploaded by the school office will appear here.
              </p>
            </div>
          ) : (
            <ul className="space-y-2.5">
              {documents.map((document) => (
                <li
                  key={document.id}
                  className="flex items-center gap-3 rounded-lg border border-slate-200 px-3.5 py-3"
                >
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-indigo-50 text-indigo-600">
                    <FileText size={16} />
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block truncate text-sm font-semibold text-slate-800">
                      {document.document_name}
                    </span>
                    <span className="mt-0.5 flex items-center gap-2 text-[11px] text-slate-400">
                      {document.document_type && (
                        <span className="rounded-full bg-slate-100 px-2 py-0.5 font-semibold text-slate-500">
                          {document.document_type}
                        </span>
                      )}
                      {formatDate(document.created_at)}
                    </span>
                  </span>
                  <a
                    href={document.file_url}
                    target="_blank"
                    rel="noreferrer"
                    className="shrink-0 rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-semibold text-indigo-600 transition hover:border-indigo-300 hover:bg-indigo-50"
                  >
                    Open
                  </a>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
};

export default ViewDocumentsModal;
