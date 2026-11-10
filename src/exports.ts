import {
  cgpa,
  registered,
  results,
  semesterGpa,
  student,
  type ClassSlot,
  type Payment,
} from "./data";
import { saveCsv, saveIcs } from "./download";

const dateOnly = (iso: string) =>
  new Date(iso).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" });

const timeOnly = (iso: string) =>
  new Date(iso).toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" });

const safeName = (value: string) => value.replace(/[^\w.-]+/g, "-").replace(/-+/g, "-");

/* -------------------------------------------------------------- payments */

export function exportPayments(rows: Payment[], scope: string): string {
  const total = rows.reduce((sum, p) => sum + p.amount, 0);
  const body: (string | number)[][] = rows.map((p) => [
    dateOnly(p.date),
    timeOnly(p.date),
    p.session,
    p.type,
    p.amount,
    p.channel,
    p.reference,
  ]);

  const filename = `clu-payments-${safeName(scope)}.csv`;
  saveCsv(filename, [
    ["Chrisland University — Payment statement"],
    ["Generated", new Date().toLocaleString("en-GB")],
    ["Scope", scope === "all" ? "All sessions" : scope],
    [],
    ["Date", "Time", "Session", "Payment for", "Amount (NGN)", "Channel", "Reference"],
    ...body,
    [],
    ["Total", "", "", `${rows.length} payment${rows.length === 1 ? "" : "s"}`, total],
  ]);
  return filename;
}

/* ------------------------------------------------------------- timetable */

const DAY_INDEX: Record<ClassSlot["day"], number> = {
  Mon: 1,
  Tue: 2,
  Wed: 3,
  Thu: 4,
  Fri: 5,
};

function nextDateFor(day: ClassSlot["day"]): Date {
  const date = new Date();
  date.setHours(0, 0, 0, 0);
  const diff = (DAY_INDEX[day] - date.getDay() + 7) % 7;
  date.setDate(date.getDate() + diff);
  return date;
}

function at(date: Date, hhmm: string): Date {
  const [hours, minutes] = hhmm.split(":").map(Number);
  const next = new Date(date);
  next.setHours(hours, minutes, 0, 0);
  return next;
}

export function exportClasses(slots: ClassSlot[], filename: string): string {
  saveIcs(
    filename,
    slots.map((slot, index) => {
      const day = nextDateFor(slot.day);
      return {
        uid: `clu-${safeName(slot.code)}-${slot.day}-${index}@portal.chrislanduniversity.edu.ng`,
        start: at(day, slot.start),
        end: at(day, slot.end),
        summary: `${slot.code} — ${slot.title}`,
        location: slot.venue,
        description: `Lecturer: ${slot.lecturer}\nChrisland University · ${student.session} first semester`,
      };
    })
  );
  return filename;
}

/* -------------------------------------------------------------- documents */

export function exportExamCard(): string {
  const filename = `clu-exam-card-${safeName(student.matric)}.csv`;
  saveCsv(filename, [
    ["Chrisland University — Examination Card"],
    ["Name", student.name],
    ["Matric number", student.matric],
    ["Programme", student.programme],
    ["Level", student.level],
    ["Session", `${student.session} · ${student.semester} semester`],
    ["Generated", new Date().toLocaleString("en-GB")],
    [],
    ["Course code", "Course title", "Units", "Type"],
    ...registered.map((c) => [c.code, c.title, c.units, c.kind]),
    [],
    ["Total units", "", registered.reduce((sum, c) => sum + c.units, 0)],
    [],
    ["Note", "Demo document generated from placeholder data."],
  ]);
  return filename;
}

export function exportRegistrationSlip(): string {
  const filename = `clu-registration-slip-${safeName(student.matric)}.csv`;
  saveCsv(filename, [
    ["Chrisland University — Course Registration Slip"],
    ["Name", student.name],
    ["Matric number", student.matric],
    ["Programme", student.programme],
    ["Session", `${student.session} · ${student.semester} semester`],
    ["Status", "Submitted — awaiting departmental approval"],
    ["Generated", new Date().toLocaleString("en-GB")],
    [],
    ["Course code", "Course title", "Units", "Type"],
    ...registered.map((c) => [c.code, c.title, c.units, c.kind]),
    [],
    ["Total units", "", registered.reduce((sum, c) => sum + c.units, 0)],
  ]);
  return filename;
}

export function exportStatement(): string {
  const filename = `clu-statement-of-result-${safeName(student.matric)}.csv`;
  saveCsv(filename, [
    ["Chrisland University — Statement of Result"],
    ["Name", student.name],
    ["Matric number", student.matric],
    ["Programme", student.programme],
    ["Cumulative GPA", cgpa.toFixed(2)],
    ["Generated", new Date().toLocaleString("en-GB")],
    [],
    ["Session", "Semester", "Level", "Units", "GPA", "Status"],
    ...results.map((r) => {
      const units = r.courses.reduce((sum, c) => sum + c.units, 0);
      const gpa = semesterGpa(r);
      return [
        r.session,
        r.semester,
        r.level,
        units,
        gpa ? gpa.toFixed(2) : "In progress",
        r.status === "published" ? "Published" : "In progress",
      ];
    }),
  ]);
  return filename;
}

export function exportRequestReceipt(
  title: string,
  reference: string,
  fee: number
): string {
  const filename = `clu-receipt-${safeName(reference)}.csv`;
  saveCsv(filename, [
    ["Chrisland University — Request Receipt"],
    ["Request", title],
    ["Reference", reference],
    ["Name", student.name],
    ["Matric number", student.matric],
    ["Fee paid (NGN)", fee],
    ["Status", "Queued for academic affairs review"],
    ["Issued", new Date().toLocaleString("en-GB")],
  ]);
  return filename;
}
