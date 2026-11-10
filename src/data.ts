/**
 * Fake data for the CLU portal redesign demo.
 * All identities, grades, fees and references are invented placeholders.
 */

export type Grade = "A" | "B" | "C" | "D" | "E" | "F";
export const GRADE_POINTS: Record<Grade, number> = { A: 5, B: 4, C: 3, D: 2, E: 1, F: 0 };

export interface Course {
  code: string;
  title: string;
  units: number;
  kind: "Core" | "Elective" | "Carry-over";
  lecturer: string;
}

export interface SemesterResult {
  session: string;
  semester: "First" | "Second" | "Summer";
  level: number;
  status: "published" | "in-progress";
  courses: { code: string; title: string; units: number; grade?: Grade }[];
}

export interface Payment {
  id: string;
  date: string;
  session: string;
  type: string;
  amount: number;
  channel: "Online" | "Bank draft";
  reference: string;
}

export interface ClassSlot {
  day: "Mon" | "Tue" | "Wed" | "Thu" | "Fri";
  start: string;
  end: string;
  code: string;
  title: string;
  venue: string;
  lecturer: string;
}

export interface Assignment {
  id: string;
  code: string;
  title: string;
  uploaded: string;
  due: string;
  status: "pending" | "submitted" | "graded" | "overdue";
  score?: string;
}

export const student = {
  name: "Adaeze N. Okonkwo",
  firstName: "Adaeze",
  matric: "CLU210118-042",
  email: "adaeze.okonkwo@chrislanduniversity.edu.ng",
  programme: "BSc Software Engineering",
  department: "Software Engineering",
  school: "Natural and Applied Sciences",
  level: 500,
  session: "2025/2026",
  semester: "First",
  gender: "Female",
  dob: "14 March 2003",
  state: "Anambra",
  phone: "+234 803 555 0142",
  address: "Block C, Room 214, Chrisland University, Abeokuta",
  guardian: { name: "Mr. Emeka Okonkwo", email: "e.okonkwo@example.com", phone: "+234 805 555 0119", address: "12 Awka Road, Onitsha, Anambra" },
  photo: "",
};

export const fees = {
  billed: 400_000,
  paid: 400_000,
  get outstanding() {
    return this.billed - this.paid;
  },
};

export const registered: Course[] = [
  { code: "SWE 501", title: "Software Architecture & Design", units: 3, kind: "Core", lecturer: "Dr. B. Adeyemi" },
  { code: "SWE 503", title: "Software Quality Assurance & Testing", units: 2, kind: "Core", lecturer: "Mrs. C. Nwosu" },
  { code: "SWE 505", title: "Advanced Algorithms", units: 3, kind: "Core", lecturer: "Prof. K. Balogun" },
  { code: "SWE 507", title: "Distributed Systems", units: 3, kind: "Core", lecturer: "Dr. I. Salami" },
  { code: "SWE 511", title: "Software Engineering Project I", units: 3, kind: "Core", lecturer: "Dr. B. Adeyemi" },
  { code: "CSC 511", title: "Artificial Intelligence", units: 3, kind: "Core", lecturer: "Dr. F. Ogunleye" },
  { code: "GES 501", title: "Entrepreneurship & Innovation", units: 2, kind: "Core", lecturer: "Mr. T. Eze" },
];

export const available: Course[] = [
  { code: "SWE 509", title: "Mobile Application Development", units: 3, kind: "Elective", lecturer: "Mr. S. Ibrahim" },
  { code: "CSC 513", title: "Cyber Security Fundamentals", units: 3, kind: "Elective", lecturer: "Dr. A. Musa" },
  { code: "GES 503", title: "Communication in English II", units: 2, kind: "Core", lecturer: "Mrs. R. Adebayo" },
  { code: "SWE 499", title: "Industrial Training Report", units: 3, kind: "Carry-over", lecturer: "Dr. I. Salami" },
];

export const MAX_UNITS = 24;

const rawResults: SemesterResult[] = [
  {
    session: "2025/2026",
    semester: "First",
    level: 500,
    status: "in-progress",
    courses: registered.map((c) => ({ code: c.code, title: c.title, units: c.units })),
  },
  {
    session: "2024/2025",
    semester: "Second",
    level: 400,
    status: "published",
    courses: [
      { code: "SWE 402", title: "Software Design Patterns", units: 3, grade: "A" },
      { code: "SWE 404", title: "Database Systems", units: 3, grade: "A" },
      { code: "SWE 408", title: "Human Computer Interaction", units: 2, grade: "B" },
      { code: "CSC 406", title: "Compiler Construction", units: 3, grade: "B" },
      { code: "SWE 410", title: "Team Project II", units: 3, grade: "A" },
      { code: "GES 402", title: "Technical Writing", units: 2, grade: "A" },
    ],
  },
  {
    session: "2024/2025",
    semester: "First",
    level: 400,
    status: "published",
    courses: [
      { code: "SWE 401", title: "Operating Systems", units: 3, grade: "A" },
      { code: "SWE 403", title: "Computer Networks", units: 3, grade: "B" },
      { code: "SWE 405", title: "Requirements Engineering", units: 2, grade: "A" },
      { code: "MTH 401", title: "Discrete Mathematics II", units: 2, grade: "B" },
      { code: "SWE 409", title: "Team Project I", units: 3, grade: "A" },
    ],
  },
  {
    session: "2023/2024",
    semester: "Second",
    level: 300,
    status: "published",
    courses: [
      { code: "SWE 302", title: "Data Structures & Algorithms", units: 3, grade: "A" },
      { code: "SWE 304", title: "Web Technologies", units: 3, grade: "A" },
      { code: "CSC 306", title: "Computer Graphics", units: 2, grade: "B" },
      { code: "SWE 308", title: "Object Oriented Programming", units: 3, grade: "A" },
      { code: "STA 302", title: "Probability for Engineers", units: 2, grade: "C" },
    ],
  },
  {
    session: "2023/2024",
    semester: "Summer",
    level: 300,
    status: "published",
    courses: [
      { code: "SWE 310", title: "Carry-over: Digital Logic Design", units: 3, grade: "B" },
      { code: "GES 302", title: "Peace & Conflict Studies", units: 2, grade: "A" },
    ],
  },
  {
    session: "2023/2024",
    semester: "First",
    level: 300,
    status: "published",
    courses: [
      { code: "SWE 301", title: "Software Engineering Principles", units: 3, grade: "A" },
      { code: "CSC 303", title: "Computer Organisation", units: 3, grade: "B" },
      { code: "MTH 301", title: "Linear Algebra", units: 2, grade: "B" },
      { code: "SWE 305", title: "Systems Analysis", units: 3, grade: "A" },
      { code: "GES 301", title: "Entrepreneurship I", units: 2, grade: "A" },
    ],
  },
  {
    session: "2022/2023",
    semester: "Second",
    level: 200,
    status: "published",
    courses: [
      { code: "CSC 202", title: "Programming with Java", units: 3, grade: "A" },
      { code: "CSC 204", title: "Database Fundamentals", units: 3, grade: "B" },
      { code: "MTH 202", title: "Discrete Mathematics", units: 2, grade: "B" },
      { code: "PHY 208", title: "Electronics", units: 2, grade: "C" },
      { code: "GES 202", title: "Nigerian Peoples & Culture", units: 2, grade: "A" },
    ],
  },
  {
    session: "2022/2023",
    semester: "First",
    level: 200,
    status: "published",
    courses: [
      { code: "CSC 201", title: "Introduction to Programming", units: 3, grade: "A" },
      { code: "CSC 203", title: "Digital Logic Design", units: 3, grade: "D" },
      { code: "MTH 201", title: "Calculus II", units: 3, grade: "C" },
      { code: "STA 201", title: "Statistics for Computing", units: 2, grade: "B" },
      { code: "GES 201", title: "Use of English II", units: 2, grade: "B" },
    ],
  },
  {
    session: "2021/2022",
    semester: "Second",
    level: 100,
    status: "published",
    courses: [
      { code: "MTH 102", title: "Calculus I", units: 3, grade: "C" },
      { code: "CSC 102", title: "Introduction to Computing", units: 3, grade: "A" },
      { code: "PHY 102", title: "General Physics II", units: 3, grade: "B" },
      { code: "GES 102", title: "Use of English I", units: 2, grade: "B" },
      { code: "BIO 108", title: "General Biology", units: 2, grade: "B" },
    ],
  },
  {
    session: "2021/2022",
    semester: "First",
    level: 100,
    status: "published",
    courses: [
      { code: "MTH 101", title: "Elementary Mathematics I", units: 3, grade: "C" },
      { code: "PHY 101", title: "General Physics I", units: 3, grade: "C" },
      { code: "CHM 101", title: "General Chemistry", units: 3, grade: "B" },
      { code: "GES 101", title: "Communication in English", units: 2, grade: "B" },
    ],
  },
];

export function semesterGpa(r: SemesterResult): number | null {
  const graded = r.courses.filter((c) => c.grade);
  if (!graded.length) return null;
  const units = graded.reduce((sum, c) => sum + c.units, 0);
  const points = graded.reduce((sum, c) => sum + c.units * GRADE_POINTS[c.grade as Grade], 0);
  return units ? points / units : null;
}

export function cumulativeGpa(results: SemesterResult[]): number | null {
  const graded = results.flatMap((r) => r.courses.filter((c) => c.grade));
  if (!graded.length) return null;
  const units = graded.reduce((sum, c) => sum + c.units, 0);
  const points = graded.reduce((sum, c) => sum + c.units * GRADE_POINTS[c.grade as Grade], 0);
  return units ? points / units : null;
}

export const results = rawResults;
export const cgpa = cumulativeGpa(results) ?? 0;

export const payments: Payment[] = [
  { id: "p1", date: "2025-10-13T13:21:00", session: "2025/2026", type: "School Fee", amount: 400_000, channel: "Online", reference: "T812578850258641" },
  { id: "p2", date: "2025-10-13T13:20:00", session: "2025/2026", type: "SRC Dues", amount: 5_000, channel: "Online", reference: "T706588823289515" },
  { id: "p3", date: "2025-10-13T13:18:00", session: "2025/2026", type: "New Horizon", amount: 35_000, channel: "Online", reference: "T827361784050449" },
  { id: "p4", date: "2025-10-13T13:15:00", session: "2025/2026", type: "Classera Subscription", amount: 5_000, channel: "Online", reference: "T184066784475197" },
  { id: "p5", date: "2025-09-25T12:20:00", session: "2024/2025", type: "Entrepreneurship Fees", amount: 20_000, channel: "Online", reference: "T976815985567626" },
  { id: "p6", date: "2025-09-25T12:04:00", session: "2024/2025", type: "O'Level Verification", amount: 10_000, channel: "Online", reference: "T825117756330993" },
  { id: "p7", date: "2025-09-25T12:01:00", session: "2024/2025", type: "Convocation & Alumni Dues", amount: 60_000, channel: "Online", reference: "T237439257847016" },
  { id: "p8", date: "2024-11-01T08:24:00", session: "2024/2025", type: "School Fee", amount: 400_000, channel: "Online", reference: "T466307244290536" },
  { id: "p9", date: "2024-11-01T08:16:00", session: "2024/2025", type: "School Fee", amount: 100_000, channel: "Online", reference: "T053627746677613" },
  { id: "p10", date: "2024-09-24T10:02:00", session: "2023/2024", type: "Bio 108 Manual", amount: 2_500, channel: "Online", reference: "T513027489219274" },
  { id: "p11", date: "2024-09-24T09:58:00", session: "2023/2024", type: "Project Binding", amount: 12_000, channel: "Bank draft", reference: "T902184726351800" },
];

export const paymentTypes = [
  { label: "School Fee", amount: 400_000 },
  { label: "SRC Dues", amount: 5_000 },
  { label: "Hostel Accommodation", amount: 85_000 },
  { label: "Classera Subscription", amount: 5_000 },
  { label: "Project Binding", amount: 12_000 },
  { label: "Transcript Request", amount: 5_000 },
  { label: "Certificate Verification", amount: 10_000 },
  { label: "English Proficiency", amount: 7_500 },
];

export const timetable: ClassSlot[] = [
  { day: "Mon", start: "08:00", end: "10:00", code: "SWE 501", title: "Software Architecture & Design", venue: "Lecture Theatre 1", lecturer: "Dr. B. Adeyemi" },
  { day: "Mon", start: "12:00", end: "14:00", code: "CSC 511", title: "Artificial Intelligence", venue: "Lecture Theatre 3", lecturer: "Dr. F. Ogunleye" },
  { day: "Tue", start: "10:00", end: "12:00", code: "SWE 505", title: "Advanced Algorithms", venue: "Computing Lab 2", lecturer: "Prof. K. Balogun" },
  { day: "Tue", start: "14:00", end: "16:00", code: "GES 501", title: "Entrepreneurship & Innovation", venue: "Auditorium A", lecturer: "Mr. T. Eze" },
  { day: "Wed", start: "08:00", end: "10:00", code: "SWE 503", title: "Software Quality Assurance & Testing", venue: "Lecture Theatre 2", lecturer: "Mrs. C. Nwosu" },
  { day: "Wed", start: "12:00", end: "14:00", code: "SWE 507", title: "Distributed Systems", venue: "Lecture Theatre 1", lecturer: "Dr. I. Salami" },
  { day: "Thu", start: "10:00", end: "13:00", code: "SWE 511", title: "Software Engineering Project I", venue: "Project Studio", lecturer: "Dr. B. Adeyemi" },
  { day: "Fri", start: "09:00", end: "11:00", code: "SWE 507", title: "Distributed Systems (Lab)", venue: "Computing Lab 1", lecturer: "Dr. I. Salami" },
];

export const assignments: Assignment[] = [
  { id: "a1", code: "SWE 501", title: "Architecture case study: campus LMS", uploaded: "2 Nov 2025", due: "16 Nov 2025", status: "pending" },
  { id: "a2", code: "SWE 507", title: "Distributed cache implementation", uploaded: "4 Nov 2025", due: "18 Nov 2025", status: "pending" },
  { id: "a3", code: "SWE 511", title: "Project proposal — Chapters 1 & 2", uploaded: "6 Nov 2025", due: "22 Nov 2025", status: "pending" },
  { id: "a4", code: "SWE 503", title: "Test plan for the library system", uploaded: "20 Oct 2025", due: "1 Nov 2025", status: "graded", score: "18 / 20" },
  { id: "a5", code: "CSC 511", title: "Search agent implementation", uploaded: "12 Oct 2025", due: "26 Oct 2025", status: "graded", score: "15 / 20" },
  { id: "a6", code: "SWE 505", title: "Dynamic programming problem set", uploaded: "10 Oct 2025", due: "24 Oct 2025", status: "overdue" },
];

export const attendance = [
  { code: "SWE 501", title: "Software Architecture & Design", present: 22, total: 24 },
  { code: "SWE 503", title: "Software Quality Assurance & Testing", present: 15, total: 16 },
  { code: "SWE 505", title: "Advanced Algorithms", present: 19, total: 24 },
  { code: "SWE 507", title: "Distributed Systems", present: 18, total: 22 },
  { code: "SWE 511", title: "Software Engineering Project I", present: 12, total: 12 },
  { code: "CSC 511", title: "Artificial Intelligence", present: 20, total: 24 },
  { code: "GES 501", title: "Entrepreneurship & Innovation", present: 8, total: 12 },
];

export const announcements = [
  { id: "n1", tag: "Examinations", title: "First semester exams begin 1 December", body: "Course registration must be approved before you can download your exam card.", date: "7 Nov 2025" },
  { id: "n2", tag: "Fees", title: "School fee deadline extended to 30 November", body: "A late payment charge applies after the deadline. Pay through the Payments page.", date: "5 Nov 2025" },
  { id: "n3", tag: "Department", title: "SWE 505 venue moved to Computing Lab 2", body: "Tuesday's Advanced Algorithms lecture now holds in the computing lab.", date: "3 Nov 2025" },
];

export const medicalRecords = [
  { id: "m1", date: "21 Oct 2025", complaint: "Persistent headache", diagnosis: "Tension headache", treatment: "Analgesic, rest", seenBy: "Dr. N. Fashola" },
  { id: "m2", date: "9 Mar 2025", complaint: "Sprained ankle", diagnosis: "Grade 1 sprain", treatment: "Ice, compression, bandage", seenBy: "Nurse P. Uche" },
];

export const evaluationCourses = registered.map((c, i) => ({
  ...c,
  evaluated: i > 4,
}));

export const requestTypes = {
  transcript: {
    title: "Transcript Request",
    description: "Official transcript sent directly to an institution of your choice.",
    fee: 5_000,
    fields: [
      { name: "copyType", label: "Copy type", type: "select", options: ["Student softcopy", "Hardcopy to institution"], required: true },
      { name: "reason", label: "Reason for request", type: "textarea", required: true },
      { name: "institutionName", label: "Name of university or institution", type: "text", required: true },
      { name: "institutionAddress", label: "Address of institution", type: "text", required: true },
      { name: "deliverEmail", label: "Email address to send the transcript to", type: "email", required: true },
    ],
  },
  proficiency: {
    title: "English Language Proficiency",
    description: "Letter confirming that your degree was taught and examined in English.",
    fee: 7_500,
    fields: [
      { name: "reason", label: "Reason for request", type: "textarea", required: true },
      { name: "institutionName", label: "Name of institution", type: "text", required: true },
      { name: "institutionAddress", label: "Institution address", type: "text", required: true },
      { name: "deliverEmail", label: "Email address to deliver to", type: "email", required: true },
    ],
  },
  verification: {
    title: "Certificate Verification",
    description: "Verification of your degree certificate for an employer or institution.",
    fee: 10_000,
    fields: [
      { name: "certificateNumber", label: "Certificate number", type: "text", required: true },
      { name: "graduationYear", label: "Graduation year / session", type: "text", required: true },
      { name: "college", label: "College", type: "text", required: true },
      { name: "department", label: "Department", type: "text", required: true },
      { name: "reason", label: "Reason for verification", type: "textarea", required: true },
      { name: "institutionName", label: "Requesting institution name", type: "text", required: true },
      { name: "institutionAddress", label: "Requesting institution address", type: "text", required: true },
      { name: "deliverEmail", label: "Email address to deliver to", type: "email", required: true },
    ],
  },
} as const;

export type RequestKey = keyof typeof requestTypes;

export const notifications = [
  { id: "x1", title: "Registration awaiting approval", body: "Your 2025/2026 first semester registration is with the department.", time: "2 hours ago", unread: true },
  { id: "x2", title: "Payment confirmed", body: "₦400,000 school fee received. Reference T812578850258641.", time: "Yesterday", unread: true },
  { id: "x3", title: "Assignment graded", body: "SWE 503 test plan — 18/20.", time: "2 days ago", unread: false },
];

export const registeredUnits = (courses: Course[]) => courses.reduce((sum, c) => sum + c.units, 0);

export const attendancePercent = () => {
  const present = attendance.reduce((s, a) => s + a.present, 0);
  const total = attendance.reduce((s, a) => s + a.total, 0);
  return total ? Math.round((present / total) * 100) : 0;
};

export const naira = (n: number) =>
  "₦" + n.toLocaleString("en-NG", { maximumFractionDigits: 0 });

export const formatDate = (iso: string) => {
  const d = new Date(iso);
  return d
    .toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" })
    .replace(",", "");
};

export const formatTime = (iso: string) =>
  new Date(iso).toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" });
