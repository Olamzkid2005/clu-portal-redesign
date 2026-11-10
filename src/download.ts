/**
 * Small download helpers. Everything is generated in the browser from the
 * data already on screen — no backend involved.
 */

export type CsvCell = string | number;

const escapeCell = (value: CsvCell) => {
  const text = String(value ?? "");
  return /[",\r\n]/.test(text) ? `"${text.replace(/"/g, '""')}"` : text;
};

export const toCsv = (rows: CsvCell[][]): string =>
  "\uFEFF" + rows.map((row) => row.map(escapeCell).join(",")).join("\r\n") + "\r\n";

export const CSV_MIME = "text/csv;charset=utf-8;";

export function saveFile(filename: string, content: string, mime: string): string {
  const blob = new Blob([content], { type: mime });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  link.rel = "noopener";
  link.style.display = "none";
  document.body.appendChild(link);
  link.click();
  link.remove();
  window.setTimeout(() => URL.revokeObjectURL(url), 5000);
  return filename;
}

export function saveCsv(filename: string, rows: CsvCell[][]): string {
  return saveFile(filename, toCsv(rows), CSV_MIME);
}

/* ------------------------------------------------------------------ iCal */

export interface IcsEvent {
  uid: string;
  start: Date;
  end: Date;
  summary: string;
  location: string;
  description: string;
}

const pad = (n: number) => String(n).padStart(2, "0");

const localStamp = (d: Date) =>
  `${d.getFullYear()}${pad(d.getMonth() + 1)}${pad(d.getDate())}T${pad(d.getHours())}${pad(
    d.getMinutes()
  )}00`;

const utcStamp = (d: Date) =>
  `${d.getUTCFullYear()}${pad(d.getUTCMonth() + 1)}${pad(d.getUTCDate())}T${pad(
    d.getUTCHours()
  )}${pad(d.getUTCMinutes())}${pad(d.getUTCSeconds())}Z`;

const escapeIcs = (value: string) =>
  value.replace(/\\/g, "\\\\").replace(/;/g, "\\;").replace(/,/g, "\\,").replace(/\r?\n/g, "\\n");

export function saveIcs(filename: string, events: IcsEvent[]): string {
  const lines = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//Chrisland University//Student Portal//EN",
    "CALSCALE:GREGORIAN",
    "METHOD:PUBLISH",
    "X-WR-CALNAME:CLU Timetable",
    "X-WR-TIMEZONE:Africa/Lagos",
  ];

  events.forEach((event) => {
    lines.push(
      "BEGIN:VEVENT",
      `UID:${event.uid}`,
      `DTSTAMP:${utcStamp(new Date())}`,
      `DTSTART:${localStamp(event.start)}`,
      `DTEND:${localStamp(event.end)}`,
      `SUMMARY:${escapeIcs(event.summary)}`,
      `LOCATION:${escapeIcs(event.location)}`,
      `DESCRIPTION:${escapeIcs(event.description)}`,
      "END:VEVENT"
    );
  });

  lines.push("END:VCALENDAR");
  return saveFile(filename, lines.join("\r\n") + "\r\n", "text/calendar;charset=utf-8;");
}
