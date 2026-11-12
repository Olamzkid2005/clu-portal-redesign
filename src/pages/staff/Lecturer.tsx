import { useState } from "react";
import {
  CalendarDays,
  ChevronRight,
  ClipboardList,
  Download,
  GraduationCap,
  MapPin,
  Save,
  Users,
} from "lucide-react";
import {
  gradeFor,
  lecturerAttendance,
  lecturerCourses as courses,
  lecturerRoster,
  type RosterStudent,
} from "../../staffData";
import {
  Button,
  Card,
  CardHead,
  CardLink,
  Empty,
  Field,
  Kpi,
  Modal,
  Pill,
  WorkspaceHero,
  cx,
  useToast,
} from "../../components/ui";
import { saveCsv } from "../../download";
import { useNav } from "../../nav";

const slug = (value: string) => value.replace(/[^\w]+/g, "-").toLowerCase();

const courseTabs = (value: string, onChange: (code: string) => void) => (
  <div className="seg" style={{ flexWrap: "wrap" }}>
    {courses.map((c) => (
      <button
        key={c.code}
        className={cx("seg__btn", c.code === value && "is-active")}
        onClick={() => onChange(c.code)}
      >
        {c.code}
      </button>
    ))}
  </div>
);

const gradeTone = (grade: string): "green" | "blue" | "amber" | "red" =>
  grade === "A" ? "green" : grade === "B" ? "blue" : grade === "C" ? "amber" : "red";

export function LecturerOverview() {
  const { go } = useNav();
  const roster = Object.values(lecturerRoster).flat();
  const ungraded = roster.filter((s) => s.exam === null).length;
  const students = courses.reduce((sum, c) => sum + c.enrolled, 0);

  return (
    <>
      <WorkspaceHero
        eyebrow="Teaching workspace · 2025/2026"
        title="Teaching overview"
        sub={`${courses.length} allocated courses · ${students} students · first semester.`}
        mark={<GraduationCap />}
        media={{
          src: "/animations/lecturer.mp4",
          label: "A student in an online lesson with a teacher",
        }}
        actions={
          <Button variant="heroSolid" onClick={() => go("lecturer/courses")}>
            <ClipboardList /> Enter scores
          </Button>
        }
      />

      <div className="bento">
        <div className="statgrid s12">
          <Kpi icon={<GraduationCap />} label="Allocated courses" value={courses.length} meta="SWE 501 and SWE 511" />
          <Kpi icon={<Users />} label="Students taught" value={students} meta="Across both courses" />
          <Kpi
            icon={<ClipboardList />}
            label="Awaiting scores"
            value={ungraded}
            meta="Exam scores not yet entered"
            tone="amber"
          />
          <Kpi icon={<CalendarDays />} label="Average attendance" value="88%" meta="Last four sessions" tone="green" />
        </div>

        <Card className="s7">
          <CardHead
            title="Teaching schedule"
            sub="Allocated by the department"
            icon={<CalendarDays />}
          />
          <div className="rows">
            {courses.map((c) => (
              <div className="rowitem" key={c.code}>
                <div className="rowitem__main">
                  <div className="rowitem__title">
                    {c.code} · {c.title}
                  </div>
                  <div className="rowitem__meta">
                    {c.day} {c.start}–{c.end} · {c.level} level · {c.enrolled} students
                  </div>
                </div>
                <div className="rowitem__side">
                  <Pill tone="outline">
                    <MapPin size={11} /> {c.venue}
                  </Pill>
                </div>
              </div>
            ))}
          </div>
          <div className="weekmini" aria-hidden="true">
            {["Mon", "Tue", "Wed", "Thu", "Fri"].map((day) => {
              const daySlots = courses.filter((c) => c.day === day);
              return (
                <div
                  key={day}
                  className={cx("weekmini__day", daySlots.length > 0 && "has-class")}
                >
                  <span className="weekmini__label">{day}</span>
                  {daySlots.length > 0 ? (
                    daySlots.map((c) => (
                      <div className="weekmini__slot" key={c.code}>
                        <b>{c.code}</b>
                        <span>
                          {c.start}–{c.end}
                        </span>
                      </div>
                    ))
                  ) : (
                    <span className="weekmini__free">Free</span>
                  )}
                </div>
              );
            })}
          </div>
        </Card>

        <Card className="s5">
          <CardHead title="Grading queue" sub="Exam scripts to enter" icon={<ClipboardList />} />
          <div className="card__bd" style={{ display: "grid", gap: 12 }}>
            {courses.map((c) => {
              const pending = lecturerRoster[c.code].filter((s) => s.exam === null).length;
              return (
                <div
                  key={c.code}
                  style={{ display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap" }}
                >
                  <div style={{ flex: 1, minWidth: 120 }}>
                    <div className="small strong">{c.code}</div>
                    <div className="tiny muted">{pending} of {lecturerRoster[c.code].length} ungraded</div>
                  </div>
                  <Button size="sm" onClick={() => go("lecturer/courses")}>
                    Open roster
                  </Button>
                </div>
              );
            })}
            <div className="alert alert--info">
              <ClipboardList />
              <span>CA is capped at 30 and the exam at 70. Grades are computed live as you type.</span>
            </div>
          </div>
        </Card>

        <Card className="s12">
          <CardHead
            title="Recent attendance"
            sub="Submitted sessions"
            action={
              <CardLink onClick={() => go("lecturer/attendance")}>
                Full register <ChevronRight />
              </CardLink>
            }
          />
          <div className="tablewrap">
            <table className="table table--stack table--compact">
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Course</th>
                  <th className="t-right">Present</th>
                  <th className="t-right">Rate</th>
                  <th className="t-right">Status</th>
                </tr>
              </thead>
              <tbody>
                {lecturerAttendance.map((a) => (
                  <tr key={a.date + a.course}>
                    <td data-label="Date">{a.date}</td>
                    <td data-label="Course">{a.course}</td>
                    <td data-label="Present" className="t-right tnum">
                      {a.present}/{a.total}
                    </td>
                    <td data-label="Rate" className="t-right tnum strong">
                      {Math.round((a.present / a.total) * 100)}%
                    </td>
                    <td data-label="Status" className="t-right">
                      <Pill tone="green" dot>
                        Submitted
                      </Pill>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      </div>
    </>
  );
}

export function LecturerCourses() {
  const toast = useToast();
  const [course, setCourse] = useState(courses[0].code);
  const [rosters, setRosters] = useState<Record<string, RosterStudent[]>>(lecturerRoster);
  const [editing, setEditing] = useState<RosterStudent | null>(null);
  const [exam, setExam] = useState("");
  const [error, setError] = useState("");

  const roster = rosters[course];
  const graded = roster.filter((s) => s.exam !== null);
  const average = graded.length
    ? Math.round(
        (graded.reduce((sum, s) => sum + s.ca + (s.exam ?? 0), 0) / graded.length) * 10
      ) / 10
    : 0;

  const openEditor = (student: RosterStudent) => {
    setEditing(student);
    setExam(student.exam === null ? "" : String(student.exam));
    setError("");
  };

  const save = () => {
    if (!editing) return;
    const value = Number(exam);
    if (exam.trim() === "" || Number.isNaN(value) || value < 0 || value > 70) {
      setError("Enter an exam score between 0 and 70.");
      return;
    }
    setRosters((prev) => ({
      ...prev,
      [course]: prev[course].map((s) =>
        s.matric === editing.matric ? { ...s, exam: value } : s
      ),
    }));
    toast(`${editing.name} — exam score saved, grade ${gradeFor(editing.ca + value)}.`);
    setEditing(null);
    setError("");
  };

  const exportRoster = () => {
    const filename = `clu-${slug(course)}-scores.csv`;
    saveCsv(filename, [
      ["Chrisland University — course score sheet"],
      ["Course", `${course} · ${courses.find((c) => c.code === course)?.title ?? ""}`],
      ["Generated", new Date().toLocaleString("en-GB")],
      [],
      ["Name", "Matric number", "CA (30)", "Exam (70)", "Total", "Grade"],
      ...roster.map((s) => [
        s.name,
        s.matric,
        s.ca,
        s.exam ?? "",
        s.exam === null ? "" : s.ca + s.exam,
        s.exam === null ? "Ungraded" : gradeFor(s.ca + s.exam),
      ]),
    ]);
    toast(`Downloaded ${filename} — ${roster.length} students.`);
  };

  return (
    <>
      <div className="page__head">
        <div>
          <div className="eyebrow">Teaching</div>
          <h1 className="page__title">My courses</h1>
          <p className="page__sub">
            Class lists and score entry for the courses allocated to you this semester.
          </p>
        </div>
        <div className="page__actions">
          <Button onClick={exportRoster}>
            <Download /> Export scores
          </Button>
        </div>
      </div>

      <div className="cluster mb12" style={{ justifyContent: "space-between" }}>
        {courseTabs(course, setCourse)}
        <Pill tone="brand">
          {graded.length}/{roster.length} graded · avg {average || "—"}
        </Pill>
      </div>

      <Card flush>
        <CardHead
          title={`${course} class list`}
          sub={courses.find((c) => c.code === course)?.title}
        />
        <div className="tablewrap">
          <table className="table table--stack">
            <thead>
              <tr>
                <th>Student</th>
                <th className="t-right">CA (30)</th>
                <th className="t-right">Exam (70)</th>
                <th className="t-right">Total</th>
                <th className="t-right">Grade</th>
                <th className="t-right">Action</th>
              </tr>
            </thead>
            <tbody>
              {roster.map((s) => {
                const total = s.exam === null ? null : s.ca + s.exam;
                return (
                  <tr key={s.matric}>
                    <td data-label="Student">
                      <div className="table__strong">{s.name}</div>
                      <div className="table__sub">{s.matric}</div>
                    </td>
                    <td data-label="CA (30)" className="t-right tnum">
                      {s.ca}
                    </td>
                    <td data-label="Exam (70)" className="t-right tnum">
                      {s.exam ?? <span className="muted">—</span>}
                    </td>
                    <td data-label="Total" className="t-right tnum strong">
                      {total ?? <span className="muted">—</span>}
                    </td>
                    <td data-label="Grade" className="t-right">
                      {total === null ? (
                        <Pill tone="amber">Ungraded</Pill>
                      ) : (
                        <Pill tone={gradeTone(gradeFor(total))}>{gradeFor(total)}</Pill>
                      )}
                    </td>
                    <td data-label="Action" className="t-right">
                      <button className="rowbtn" onClick={() => openEditor(s)}>
                        {s.exam === null ? "Enter score" : "Edit"}
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </Card>

      <Modal
        open={!!editing}
        onClose={() => setEditing(null)}
        title={editing ? `Exam score — ${editing.name}` : ""}
        sub={editing ? `${editing.matric} · CA ${editing.ca} of 30` : ""}
        footer={
          <>
            <Button onClick={() => setEditing(null)}>Cancel</Button>
            <Button variant="primary" onClick={save}>
              <Save /> Save score
            </Button>
          </>
        }
      >
        <Field
          label="Exam score (0–70)"
          required
          error={error || undefined}
          hint={
            editing
              ? `Total becomes ${editing.ca + (Number(exam) || 0)} — grade ${gradeFor(editing.ca + (Number(exam) || 0))}.`
              : undefined
          }
        >
          <input
            className="input tnum"
            inputMode="numeric"
            value={exam}
            onChange={(e) => setExam(e.target.value.replace(/[^\d]/g, ""))}
          />
        </Field>
      </Modal>
    </>
  );
}

export function LecturerAttendance() {
  const toast = useToast();
  const [course, setCourse] = useState(courses[0].code);
  const [date, setDate] = useState("2025-11-10");
  const [marks, setMarks] = useState<Record<string, boolean>>({});

  const roster = lecturerRoster[course];
  const present = roster.filter((s) => marks[`${course}:${s.matric}`] ?? true).length;

  const exportSheet = () => {
    const filename = `clu-${slug(course)}-attendance.csv`;
    saveCsv(filename, [
      ["Chrisland University — attendance sheet"],
      ["Course", course],
      ["Date", date],
      [],
      ["Name", "Matric number", "Status"],
      ...roster.map((s) => [
        s.name,
        s.matric,
        (marks[`${course}:${s.matric}`] ?? true) ? "Present" : "Absent",
      ]),
      [],
      ["Present", `${present} of ${roster.length}`],
    ]);
    toast(`Downloaded ${filename}.`);
  };

  return (
    <>
      <div className="page__head">
        <div>
          <div className="eyebrow">Teaching</div>
          <h1 className="page__title">Attendance</h1>
          <p className="page__sub">
            Mark a session and it posts straight to each student's attendance record.
          </p>
        </div>
        <div className="page__actions">
          <Button onClick={exportSheet}>
            <Download /> Export sheet
          </Button>
        </div>
      </div>

      <div className="cluster mb12" style={{ justifyContent: "space-between" }}>
        {courseTabs(course, (code) => {
          setCourse(code);
          setMarks({});
        })}
        <Pill tone={present === roster.length ? "green" : "amber"}>
          {present} of {roster.length} present
        </Pill>
      </div>

      <Card>
        <CardHead
          title={`${course} · session register`}
          sub={courses.find((c) => c.code === course)?.title}
          action={
            <div style={{ width: 170 }}>
              <input
                className="input"
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                aria-label="Session date"
              />
            </div>
          }
        />
        <div className="rows">
          {roster.map((s) => {
            const isPresent = marks[`${course}:${s.matric}`] ?? true;
            return (
              <div className="rowitem" key={s.matric}>
                <div className="rowitem__main">
                  <div className="rowitem__title">{s.name}</div>
                  <div className="rowitem__meta">{s.matric}</div>
                </div>
                <div className="rowitem__side">
                  <div className="seg">
                    <button
                      className={cx("seg__btn", isPresent && "is-active")}
                      onClick={() =>
                        setMarks((m) => ({ ...m, [`${course}:${s.matric}`]: true }))
                      }
                    >
                      Present
                    </button>
                    <button
                      className={cx("seg__btn", !isPresent && "is-active")}
                      onClick={() =>
                        setMarks((m) => ({ ...m, [`${course}:${s.matric}`]: false }))
                      }
                    >
                      Absent
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
        <div className="unitbar">
          <div className="unitbar__num">
            <b>{present}</b> present · {roster.length - present} absent
          </div>
          <div className="unitbar__meter">
            <div className="progress">
              <div
                className="progress__bar"
                style={{ width: `${roster.length ? (present / roster.length) * 100 : 0}%` }}
              />
            </div>
          </div>
          <div style={{ flex: 1 }} />
          <Button
            variant="primary"
            onClick={() =>
              toast(`Attendance saved for ${course} on ${date} — ${present} present.`)
            }
          >
            <Save /> Save register
          </Button>
        </div>
      </Card>

      {roster.length === 0 && (
        <Empty icon={<Users />} title="No students registered" body="The class list is empty." />
      )}
    </>
  );
}
