/**
 * Placeholder data for the staff-facing views.
 * Modelled on how Nigerian university bursaries, registry, ICT directorates
 * and academic offices actually work — all identities and numbers are invented.
 */

import { student } from "./data";

/* ---------------------------------------------------------------- lecturer */

export interface StaffCourse {
  code: string;
  title: string;
  level: number;
  units: number;
  enrolled: number;
  day: string;
  start: string;
  end: string;
  venue: string;
}

export const lecturerCourses: StaffCourse[] = [
  {
    code: "SWE 501",
    title: "Software Architecture & Design",
    level: 500,
    units: 3,
    enrolled: 48,
    day: "Mon",
    start: "08:00",
    end: "10:00",
    venue: "Lecture Theatre 1",
  },
  {
    code: "SWE 511",
    title: "Software Engineering Project I",
    level: 500,
    units: 3,
    enrolled: 32,
    day: "Thu",
    start: "10:00",
    end: "13:00",
    venue: "Project Studio",
  },
];

export interface RosterStudent {
  matric: string;
  name: string;
  ca: number;
  exam: number | null;
}

export const lecturerRoster: Record<string, RosterStudent[]> = {
  "SWE 501": [
    { matric: student.matric, name: student.name, ca: 27, exam: 61 },
    { matric: "CLU210118-057", name: "Ibrahim Suleiman", ca: 24, exam: 55 },
    { matric: "CLU210118-063", name: "Chiamaka Obi", ca: 29, exam: 66 },
    { matric: "CLU210118-071", name: "Tunde Balogun", ca: 21, exam: 44 },
    { matric: "CLU210118-084", name: "Fatima Bello", ca: 26, exam: null },
    { matric: "CLU210118-092", name: "Emeka Nwosu", ca: 19, exam: 38 },
    { matric: "CLU210118-103", name: "Halima Yusuf", ca: 28, exam: 58 },
    { matric: "CLU210118-118", name: "Kelechi Eze", ca: 23, exam: null },
  ],
  "SWE 511": [
    { matric: student.matric, name: student.name, ca: 28, exam: 64 },
    { matric: "CLU210118-063", name: "Chiamaka Obi", ca: 27, exam: 60 },
    { matric: "CLU210118-071", name: "Tunde Balogun", ca: 22, exam: 41 },
    { matric: "CLU210118-084", name: "Fatima Bello", ca: 25, exam: 52 },
    { matric: "CLU210118-103", name: "Halima Yusuf", ca: 29, exam: 67 },
    { matric: "CLU210118-118", name: "Kelechi Eze", ca: 24, exam: null },
  ],
};

export const gradeFor = (total: number): string =>
  total >= 70 ? "A" : total >= 60 ? "B" : total >= 50 ? "C" : total >= 45 ? "D" : total >= 40 ? "E" : "F";

export const lecturerAttendance = [
  { date: "3 Nov 2025", course: "SWE 501", present: 44, total: 48 },
  { date: "30 Oct 2025", course: "SWE 511", present: 29, total: 32 },
  { date: "27 Oct 2025", course: "SWE 501", present: 41, total: 48 },
  { date: "23 Oct 2025", course: "SWE 511", present: 31, total: 32 },
];

/* ------------------------------------------------------------------ bursar */

export interface LedgerRow {
  id: string;
  date: string;
  student: string;
  matric: string;
  item: string;
  amount: number;
  channel: "Paystack" | "Bank transfer" | "Bank draft";
  status: "Confirmed" | "Pending" | "Failed";
  reference: string;
}

export const bursarKpis = {
  collected: 412_800_000,
  outstanding: 38_400_000,
  transactions: 3_412,
  reconciliation: 99.2,
};

export const bursarMonthly = [
  { label: "Jun", value: 42 },
  { label: "Jul", value: 58 },
  { label: "Aug", value: 74 },
  { label: "Sep", value: 96 },
  { label: "Oct", value: 84 },
  { label: "Nov", value: 39 },
];

export const ledger: LedgerRow[] = [
  { id: "l1", date: "13 Oct 2025", student: student.name, matric: student.matric, item: "School fee", amount: 400_000, channel: "Paystack", status: "Confirmed", reference: "T812578850258641" },
  { id: "l2", date: "13 Oct 2025", student: "Ibrahim Suleiman", matric: "CLU210118-057", item: "School fee", amount: 400_000, channel: "Paystack", status: "Confirmed", reference: "T827361784050449" },
  { id: "l3", date: "13 Oct 2025", student: "Chiamaka Obi", matric: "CLU210118-063", item: "Hostel accommodation", amount: 85_000, channel: "Bank transfer", status: "Pending", reference: "T706588823289515" },
  { id: "l4", date: "12 Oct 2025", student: "Tunde Balogun", matric: "CLU210118-071", item: "School fee", amount: 400_000, channel: "Paystack", status: "Confirmed", reference: "T184066784475197" },
  { id: "l5", date: "12 Oct 2025", student: "Fatima Bello", matric: "CLU210118-084", item: "Transcript request", amount: 5_000, channel: "Paystack", status: "Confirmed", reference: "T976815985567626" },
  { id: "l6", date: "11 Oct 2025", student: "Emeka Nwosu", matric: "CLU210118-092", item: "School fee", amount: 200_000, channel: "Bank draft", status: "Pending", reference: "T825117756330993" },
  { id: "l7", date: "11 Oct 2025", student: "Halima Yusuf", matric: "CLU210118-103", item: "School fee", amount: 400_000, channel: "Paystack", status: "Confirmed", reference: "T237439257847016" },
  { id: "l8", date: "10 Oct 2025", student: "Kelechi Eze", matric: "CLU210118-118", item: "Certificate verification", amount: 10_000, channel: "Paystack", status: "Confirmed", reference: "T466307244290536" },
  { id: "l9", date: "10 Oct 2025", student: "Aisha Mohammed", matric: "CLU210118-126", item: "School fee", amount: 400_000, channel: "Paystack", status: "Failed", reference: "T053627746677613" },
  { id: "l10", date: "9 Oct 2025", student: "Samuel Adeyemi", matric: "CLU210118-134", item: "Hostel accommodation", amount: 62_000, channel: "Bank transfer", status: "Confirmed", reference: "T513027489219274" },
  { id: "l11", date: "9 Oct 2025", student: "Ngozi Uche", matric: "CLU210118-145", item: "School fee", amount: 350_000, channel: "Paystack", status: "Confirmed", reference: "T902184726351800" },
  { id: "l12", date: "8 Oct 2025", student: "Yusuf Danjuma", matric: "CLU210118-152", item: "English proficiency", amount: 7_500, channel: "Paystack", status: "Confirmed", reference: "T371357011881654" },
];

export interface FeeRow {
  level: string;
  tuition: number;
  hostel: number;
  ict: number;
  total: number;
}

export const feeSchedule: FeeRow[] = [
  { level: "100", tuition: 350_000, hostel: 85_000, ict: 15_000, total: 450_000 },
  { level: "200", tuition: 380_000, hostel: 85_000, ict: 15_000, total: 480_000 },
  { level: "300", tuition: 395_000, hostel: 85_000, ict: 18_000, total: 498_000 },
  { level: "400", tuition: 410_000, hostel: 85_000, ict: 18_000, total: 513_000 },
  { level: "500", tuition: 400_000, hostel: 85_000, ict: 20_000, total: 505_000 },
];

/* ---------------------------------------------------------------------- ICT */

export const ictKpis = {
  uptime: 99.97,
  activeSessions: 1_284,
  failedLogins: 23,
  storage: 62,
};

export const services = [
  { name: "Student portal", status: "Operational" as const, latency: "142 ms" },
  { name: "Results API", status: "Operational" as const, latency: "188 ms" },
  { name: "Payment webhook (Paystack)", status: "Degraded" as const, latency: "1.4 s" },
  { name: "Email delivery", status: "Operational" as const, latency: "310 ms" },
];

export interface SystemUser {
  id: string;
  name: string;
  email: string;
  role: string;
  status: "Active" | "Suspended";
  lastLogin: string;
}

export const systemUsers: SystemUser[] = [
  { id: "u1", name: student.name, email: student.email, role: "Student", status: "Active", lastLogin: "Today, 21:04" },
  { id: "u2", name: "Dr. Bamidele Adeyemi", email: "b.adeyemi@chrislanduniversity.edu.ng", role: "Lecturer", status: "Active", lastLogin: "Today, 18:22" },
  { id: "u3", name: "Mrs. Folake Adekunle", email: "f.adekunle@chrislanduniversity.edu.ng", role: "Bursar", status: "Active", lastLogin: "Today, 09:41" },
  { id: "u4", name: "Mr. Tochukwu Okafor", email: "t.okafor@chrislanduniversity.edu.ng", role: "ICT", status: "Active", lastLogin: "Today, 22:10" },
  { id: "u5", name: "Prof. Chinedu Eze", email: "c.eze@chrislanduniversity.edu.ng", role: "Vice Chancellor", status: "Active", lastLogin: "Yesterday, 16:35" },
  { id: "u6", name: "Dr. Maryam Bello", email: "m.bello@chrislanduniversity.edu.ng", role: "Registrar", status: "Active", lastLogin: "Today, 08:12" },
  { id: "u7", name: "Ibrahim Suleiman", email: "ibrahim.suleiman@chrislanduniversity.edu.ng", role: "Student", status: "Suspended", lastLogin: "2 Sept 2025" },
  { id: "u8", name: "Mrs. Cheryl Nwosu", email: "c.nwosu@chrislanduniversity.edu.ng", role: "Lecturer", status: "Active", lastLogin: "Yesterday, 11:07" },
  { id: "u9", name: "Emeka Nwosu", email: "emeka.nwosu@chrislanduniversity.edu.ng", role: "Student", status: "Active", lastLogin: "3 days ago" },
  { id: "u10", name: "Mr. Sani Ibrahim", email: "s.ibrahim@chrislanduniversity.edu.ng", role: "Lecturer", status: "Suspended", lastLogin: "14 Aug 2025" },
];

export interface AuditEntry {
  id: string;
  time: string;
  actor: string;
  action: string;
  target: string;
  ip: string;
}

export const auditLog: AuditEntry[] = [
  { id: "a1", time: "09 Nov 22:10", actor: "t.okafor", action: "Role changed", target: "u7 → Student suspended", ip: "10.20.4.18" },
  { id: "a2", time: "09 Nov 21:42", actor: "system", action: "Payment webhook retried", target: "T812578850258641", ip: "52.31.8.204" },
  { id: "a3", time: "09 Nov 18:22", actor: "b.adeyemi", action: "Exam scores submitted", target: "SWE 501 · 41 records", ip: "10.20.7.91" },
  { id: "a4", time: "09 Nov 16:03", actor: "f.adekunle", action: "Fee schedule exported", target: "2025/2026 schedule", ip: "10.20.2.55" },
  { id: "a5", time: "09 Nov 12:18", actor: "system", action: "Failed login threshold", target: "23 attempts / 15 min", ip: "41.58.22.19" },
  { id: "a6", time: "09 Nov 09:12", actor: "m.bello", action: "Transcript approved", target: "T857106556305836", ip: "10.20.3.77" },
  { id: "a7", time: "08 Nov 17:45", actor: "t.okafor", action: "Password reset issued", target: "u10", ip: "10.20.4.18" },
  { id: "a8", time: "08 Nov 10:02", actor: "system", action: "Nightly backup", target: "portal-db · 4.2 GB", ip: "10.20.9.2" },
];

/* ----------------------------------------------------------------------- VC */

export const institutionalKpis = {
  students: 4_812,
  staff: 386,
  revenue: 1_240_000_000,
  avgCgpa: 3.61,
  accreditation: "8 / 8",
  retention: 94,
};

export const faculties = [
  { name: "Natural & Applied Sciences", students: 1_284, cgpa: 3.68, retention: 96 },
  { name: "Management & Social Sciences", students: 1_106, cgpa: 3.54, retention: 93 },
  { name: "Law", students: 642, cgpa: 3.72, retention: 97 },
  { name: "Engineering", students: 894, cgpa: 3.49, retention: 91 },
  { name: "Health Sciences", students: 886, cgpa: 3.63, retention: 95 },
];

export interface Approval {
  id: string;
  title: string;
  type: string;
  submittedBy: string;
  date: string;
  amount?: number;
  status: "Pending" | "Approved" | "Rejected";
}

export const approvals: Approval[] = [
  { id: "ap1", title: "2025/2026 first semester broadsheet", type: "Academic", submittedBy: "Registry", date: "07 Nov 2025", status: "Pending" },
  { id: "ap2", title: "Capital vote: computing lab upgrade", type: "Finance", submittedBy: "Bursary", date: "06 Nov 2025", amount: 48_000_000, status: "Pending" },
  { id: "ap3", title: "New lecturer appointments (6)", type: "Establishment", submittedBy: "HR", date: "05 Nov 2025", status: "Pending" },
  { id: "ap4", title: "Faculty of Law accreditation submission", type: "Academic", submittedBy: "Quality assurance", date: "03 Nov 2025", status: "Approved" },
  { id: "ap5", title: "Hostel maintenance contract", type: "Finance", submittedBy: "Works", date: "01 Nov 2025", amount: 12_500_000, status: "Rejected" },
  { id: "ap6", title: "Student disciplinary committee report", type: "Conduct", submittedBy: "Dean of students", date: "30 Oct 2025", status: "Pending" },
];

/* ---------------------------------------------------------------- registrar */

export interface RegistryRequest {
  id: string;
  type: string;
  student: string;
  matric: string;
  submitted: string;
  fee: number;
  status: "New" | "In review" | "Completed";
}

export const registryQueue: RegistryRequest[] = [
  { id: "r1", type: "Transcript", student: student.name, matric: student.matric, submitted: "08 Nov 2025", fee: 5_000, status: "New" },
  { id: "r2", type: "Certificate verification", student: "Kelechi Eze", matric: "CLU210118-118", submitted: "07 Nov 2025", fee: 10_000, status: "In review" },
  { id: "r3", type: "English proficiency", student: "Yusuf Danjuma", matric: "CLU210118-152", submitted: "06 Nov 2025", fee: 7_500, status: "New" },
  { id: "r4", type: "Transcript", student: "Ngozi Uche", matric: "CLU210118-145", submitted: "05 Nov 2025", fee: 5_000, status: "Completed" },
  { id: "r5", type: "Certificate verification", student: "Samuel Adeyemi", matric: "CLU210118-134", submitted: "04 Nov 2025", fee: 10_000, status: "In review" },
  { id: "r6", type: "Transcript", student: "Aisha Mohammed", matric: "CLU210118-126", submitted: "03 Nov 2025", fee: 5_000, status: "Completed" },
];
