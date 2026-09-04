import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";

export interface PdfSection {
  heading: string;
  columns: string[];
  rows: (string | number)[][];
}

export interface AttendancePdfPayload {
  fileName: string;
  title: string;
  subtitle: string;
  period: string; // e.g. "01 Sep 2026 - 30 Sep 2026"
  summary?: { label: string; value: string }[];
  sections: PdfSection[];
}

const INDIGO: [number, number, number] = [79, 70, 229];
const SLATE: [number, number, number] = [71, 85, 105];
const DARK: [number, number, number] = [15, 23, 42];

const lastY = (doc: jsPDF): number => {
  const table = (doc as unknown as { lastAutoTable?: { finalY: number } })
    .lastAutoTable;
  return table?.finalY ?? 48;
};

/**
 * Builds a branded attendance PDF and triggers the browser download
 * immediately (doc.save).
 */
export const exportAttendancePdf = (payload: AttendancePdfPayload): void => {
  const doc = new jsPDF({ orientation: "landscape", unit: "pt", format: "a4" });
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();

  // Header band
  doc.setFillColor(...INDIGO);
  doc.rect(0, 0, pageWidth, 64, "F");
  doc.setTextColor(255, 255, 255);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(16);
  doc.text(payload.title, 40, 28);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(10);
  doc.text(payload.subtitle, 40, 46);
  doc.text(`Period: ${payload.period}`, pageWidth - 40, 28, {
    align: "right",
  });
  doc.text(`Generated: ${new Date().toLocaleString()}`, pageWidth - 40, 46, {
    align: "right",
  });

  let cursorY = 84;

  // Summary strip (Total / Present / Absent / Late / Rate)
  if (payload.summary && payload.summary.length > 0) {
    autoTable(doc, {
      startY: cursorY,
      head: [payload.summary.map((item) => item.label)],
      body: [payload.summary.map((item) => item.value)],
      theme: "grid",
      headStyles: {
        fillColor: [241, 245, 249],
        textColor: SLATE,
        fontStyle: "bold",
        fontSize: 8,
      },
      bodyStyles: {
        fontSize: 10,
        fontStyle: "bold",
        textColor: DARK,
        halign: "center",
      },
      styles: { cellPadding: 6 },
      margin: { left: 40, right: 40 },
    });
    cursorY = lastY(doc) + 20;
  }

  payload.sections.forEach((section) => {
    if (cursorY > pageHeight - 140) {
      doc.addPage();
      cursorY = 48;
    }
    doc.setTextColor(...DARK);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(11);
    doc.text(section.heading, 40, cursorY);
    cursorY += 8;

    autoTable(doc, {
      startY: cursorY,
      head: [section.columns],
      body:
        section.rows.length > 0
          ? section.rows.map((row) =>
              row.map((cell) =>
                cell === null || cell === undefined || cell === ""
                  ? "-"
                  : String(cell)
              )
            )
          : [
              {
                content: "No records found for the selected filters.",
                colSpan: section.columns.length,
              },
            ],
      theme: "striped",
      headStyles: { fillColor: INDIGO, fontSize: 8 },
      styles: { fontSize: 8, cellPadding: 4 },
      alternateRowStyles: { fillColor: [248, 250, 252] },
      margin: { left: 40, right: 40 },
    });
    cursorY = lastY(doc) + 24;
  });

  // Page numbers
  const pageCount = doc.getNumberOfPages();
  for (let i = 1; i <= pageCount; i += 1) {
    doc.setPage(i);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(8);
    doc.setTextColor(148, 163, 184);
    doc.text(`Page ${i} of ${pageCount}`, pageWidth / 2, pageHeight - 16, {
      align: "center",
    });
  }

  doc.save(payload.fileName);
};