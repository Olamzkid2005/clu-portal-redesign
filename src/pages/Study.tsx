import { useState } from "react";
import {
  CheckCircle2,
  Download,
  ClipboardList,
  MapPin,
  MessageSquareText,
  Star,
  UserCheck,
} from "lucide-react";
import {
  attendance,
  attendancePercent,
  assignments,
  evaluationCourses,
  registered,
  student,
  timetable,
  type Course,
} from "../data";
import {
  Button,
  Card,
  CardHead,
  Empty,
  Field,
  Modal,
  Pill,
  Ring,
  cx,
  useToast,
} from "../components/ui";
import { exportClasses } from "../exports";

const DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri"] as const;
const DAY_FULL: Record<string, string> = {
  Mon: "Monday",
  Tue: "Tuesday",
  Wed: "Wednesday",
  Thu: "Thursday",
  Fri: "Friday",
};
const toMinutes = (t: string) => {
  const [h, m] = t.split(":").map(Number);
  return h * 60 + m;
};

/* --------------------------------------------------------------- timetable */

export function TimetablePage() {
  const todayName = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"][new Date().getDay()];
  const isTeaching = (DAYS as readonly string[]).includes(todayName);
  const [active, setActive] = useState<string>(isTeaching ? todayName : "Mon");
  const now = new Date();
  const nowMinutes = now.getHours() * 60 + now.getMinutes();
  const [selected, setSelected] = useState<(typeof timetable)[number] | null>(null);
  const toast = useToast();

  return (
    <>
      <div className="page__head">
        <div>
          <div className="eyebrow">Study</div>
          <h1 className="page__title">Timetable</h1>
          <p className="page__sub">
            {student.session} · {student.semester} semester · Level {student.level}. All times
            are West Africa Time (GMT+1).
          </p>
        </div>
        <div className="page__actions">
          <Button
            onClick={() => {
              const filename = exportClasses(timetable, "clu-timetable-week.ics");
              toast(`Downloaded ${filename} — ${timetable.length} classes.`);
            }}
          >
            <Download /> Export week
          </Button>
          <Pill tone="brand">8 contact hours a week</Pill>
        </div>
      </div>

      <div className="mobileonly mb12">
        <div className="seg" style={{ width: "100%", justifyContent: "space-between" }}>
          {DAYS.map((d) => (
            <button
              key={d}
              className={cx("seg__btn", active === d && "is-active")}
              onClick={() => setActive(d)}
              style={{ flex: 1 }}
            >
              {d}
            </button>
          ))}
        </div>
      </div>

      <Card>
        <CardHead title="Lecture timetable" sub="First semester, 2025/2026" />
        <div className="card__bd">
          <div className="week">
            {DAYS.map((d) => {
              const slots = timetable
                .filter((t) => t.day === d)
                .sort((a, b) => a.start.localeCompare(b.start));
              return (
                <div className="week__col" key={d} data-active={active === d}>
                  <div className="week__day">
                    <span className="week__dayname">{DAY_FULL[d]}</span>
                    <span className="week__date">
                      {slots.length} class{slots.length === 1 ? "" : "es"}
                    </span>
                  </div>
                  <div className="week__slots">
                    {slots.length === 0 && (
                      <div className="tiny muted" style={{ padding: "8px 2px" }}>
                        Free day
                      </div>
                    )}
                    {slots.map((c) => {
                      const live =
                        d === todayName &&
                        nowMinutes >= toMinutes(c.start) &&
                        nowMinutes <= toMinutes(c.end);
                      return (
                        <button
                          key={c.code + c.start}
                          className={cx("slotcard", live && "slotcard--now")}
                          onClick={() => setSelected(c)}
                        >
                          <div className="slotcard__time">
                            {c.start} – {c.end}
                          </div>
                          <div className="slotcard__code">{c.code}</div>
                          <div className="slotcard__title">{c.title}</div>
                          <div className="slotcard__venue">
                            <MapPin /> {c.venue}
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </Card>

      <Modal
        open={!!selected}
        onClose={() => setSelected(null)}
        title={selected?.code ?? ""}
        sub={selected?.title}
        footer={
          <>
            <Button onClick={() => setSelected(null)}>Close</Button>
            <Button
              variant="primary"
              onClick={() => {
                if (!selected) return;
                const filename = exportClasses(
                  [selected],
                  `clu-${selected.code.replace(/[^\w]+/g, "-").toLowerCase()}.ics`
                );
                setSelected(null);
                toast(`Downloaded ${filename}.`);
              }}
            >
              <Download /> Add to calendar
            </Button>
          </>
        }
      >
        <div className="kv">
          <div className="kv__item">
            <div className="kv__k">Day</div>
            <div className="kv__v">{selected ? DAY_FULL[selected.day] : "—"}</div>
          </div>
          <div className="kv__item">
            <div className="kv__k">Time</div>
            <div className="kv__v tnum">
              {selected ? `${selected.start} – ${selected.end}` : "—"}
            </div>
          </div>
          <div className="kv__item">
            <div className="kv__k">Venue</div>
            <div className="kv__v">{selected?.venue ?? "—"}</div>
          </div>
          <div className="kv__item">
            <div className="kv__k">Lecturer</div>
            <div className="kv__v">{selected?.lecturer ?? "—"}</div>
          </div>
        </div>
      </Modal>
    </>
  );
}

/* ------------------------------------------------------------- assignments */

export function AssignmentsPage() {
  const [filter, setFilter] = useState<"all" | "pending" | "graded">("all");
  const toast = useToast();
  const list = assignments.filter((a) => {
    if (filter === "pending") return a.status === "pending" || a.status === "overdue";
    if (filter === "graded") return a.status === "graded";
    return true;
  });
  const pendingCount = assignments.filter(
    (a) => a.status === "pending" || a.status === "overdue"
  ).length;

  const tone = (s: string) =>
    s === "graded" ? "green" : s === "overdue" ? "red" : s === "submitted" ? "blue" : "amber";

  return (
    <>
      <div className="page__head">
        <div>
          <div className="eyebrow">Study</div>
          <h1 className="page__title">Assignments</h1>
          <p className="page__sub">
            {pendingCount} of {assignments.length} still open. Uploads close at 23:59 on the due
            date.
          </p>
        </div>
        <div className="page__actions">
          <div className="seg">
            {(["all", "pending", "graded"] as const).map((f) => (
              <button
                key={f}
                className={cx("seg__btn", filter === f && "is-active")}
                onClick={() => setFilter(f)}
              >
                {f === "all" ? "All" : f === "pending" ? "Open" : "Graded"}
              </button>
            ))}
          </div>
        </div>
      </div>

      <Card flush>
        {list.length === 0 ? (
          <Empty
            icon={<ClipboardList />}
            title="Nothing in this view"
            body="No assignments match the filter you picked."
          />
        ) : (
          <div className="tablewrap">
            <table className="table table--stack">
              <thead>
                <tr>
                  <th>Assignment</th>
                  <th>Course</th>
                  <th>Due</th>
                  <th>Status</th>
                  <th className="t-right">Action</th>
                </tr>
              </thead>
              <tbody>
                {list.map((a) => (
                  <tr key={a.id}>
                    <td data-label="Assignment">
                      <div className="table__strong">{a.title}</div>
                      <div className="table__sub">Uploaded {a.uploaded}</div>
                    </td>
                    <td data-label="Course">{a.code}</td>
                    <td data-label="Due" className="nowrap">
                      {a.due}
                    </td>
                    <td data-label="Status">
                      <Pill tone={tone(a.status) as "green" | "red" | "blue" | "amber"}>
                        {a.status === "pending"
                          ? "Open"
                          : a.status === "overdue"
                          ? "Overdue"
                          : a.status === "graded"
                          ? `Graded · ${a.score}`
                          : "Submitted"}
                      </Pill>
                    </td>
                    <td data-label="Action" className="t-right">
                      {a.status === "graded" ? (
                        <span className="tiny muted">Reviewed</span>
                      ) : (
                        <button
                          className="rowbtn"
                          onClick={() => toast(`Upload opened for ${a.code} — ${a.title}`)}
                        >
                          Submit
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>
    </>
  );
}

/* -------------------------------------------------------------- attendance */

export function AttendancePage() {
  const overall = attendancePercent();
  return (
    <>
      <div className="page__head">
        <div>
          <div className="eyebrow">Study</div>
          <h1 className="page__title">Attendance</h1>
          <p className="page__sub">
            The university requires 75% attendance per course to sit the examination.
          </p>
        </div>
      </div>

      <div className="bento">
        <Card className="s4">
          <CardHead title="Overall" sub="All registered courses" />
          <div
            className="card__bd"
            style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 12 }}
          >
            <Ring value={overall} label="attendance" />
            <div className="tiny muted" style={{ textAlign: "center" }}>
              {attendance.reduce((s, a) => s + a.present, 0)} of{" "}
              {attendance.reduce((s, a) => s + a.total, 0)} classes attended this semester.
            </div>
          </div>
        </Card>

        <Card className="s8">
          <CardHead title="By course" sub="Below 75% blocks exam eligibility" />
          <div className="card__bd" style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            {attendance.map((a) => {
              const pct = Math.round((a.present / a.total) * 100);
              return (
                <div key={a.code}>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "baseline",
                      justifyContent: "space-between",
                      gap: 10,
                      marginBottom: 6,
                    }}
                  >
                    <div style={{ minWidth: 0 }}>
                      <span className="small strong">{a.code}</span>{" "}
                      <span className="tiny muted">{a.title}</span>
                    </div>
                    <span className="tiny tnum" style={{ flex: "none" }}>
                      {a.present}/{a.total} · <b>{pct}%</b>
                    </span>
                  </div>
                  <div className="progress">
                    <div
                      className="progress__bar"
                      style={{
                        width: `${pct}%`,
                        background: pct < 75 ? "var(--accent)" : undefined,
                      }}
                    />
                  </div>
                </div>
              );
            })}
            <div className="alert alert--info">
              <CheckCircle2 />
              <span>
                You are eligible for all examinations. Two courses are close to the 75% line —
                attend the next lectures to stay clear.
              </span>
            </div>
          </div>
        </Card>
      </div>
    </>
  );
}

/* -------------------------------------------------------------- evaluation */

export function EvaluationPage() {
  const [done, setDone] = useState<string[]>(
    evaluationCourses.filter((c) => c.evaluated).map((c) => c.code)
  );
  const [course, setCourse] = useState<Course | null>(null);
  const [rating, setRating] = useState(4);
  const [comment, setComment] = useState("");
  const toast = useToast();

  const submit = () => {
    if (!course) return;
    setDone((d) => [...new Set([...d, course.code])]);
    setCourse(null);
    setComment("");
    toast(`Evaluation for ${course.code} submitted anonymously.`);
  };

  return (
    <>
      <div className="page__head">
        <div>
          <div className="eyebrow">Services</div>
          <h1 className="page__title">Course evaluation</h1>
          <p className="page__sub">
            {done.length} of {registered.length} courses evaluated. Responses are anonymous and
            released to lecturers only after grades are published.
          </p>
        </div>
        <div className="page__actions">
          <Pill tone={done.length === registered.length ? "green" : "amber"}>
            {registered.length - done.length} remaining
          </Pill>
        </div>
      </div>

      <Card flush>
        <div className="rows">
          {registered.map((c) => {
            const complete = done.includes(c.code);
            return (
              <div className="rowitem" key={c.code}>
                <div className="rowitem__main">
                  <div className="rowitem__title">
                    {c.code} · {c.title}
                  </div>
                  <div className="rowitem__meta">
                    {c.units} units · {c.lecturer}
                  </div>
                </div>
                <div className="rowitem__side">
                  {complete ? (
                    <Pill tone="green">
                      <CheckCircle2 /> Evaluated
                    </Pill>
                  ) : (
                    <Button
                      size="sm"
                      variant="primary"
                      onClick={() => {
                        setCourse(c);
                        setRating(4);
                      }}
                    >
                      <MessageSquareText /> Evaluate
                    </Button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </Card>

      <Modal
        open={!!course}
        onClose={() => setCourse(null)}
        title={course ? `Evaluate ${course.code}` : ""}
        sub="Takes about a minute. Your name is never attached."
        footer={
          <>
            <Button onClick={() => setCourse(null)}>Cancel</Button>
            <Button variant="primary" onClick={submit}>
              Submit evaluation
            </Button>
          </>
        }
      >
        <div className="field">
          <span className="label">How was the course taught?</span>
          <div className="stars">
            {[1, 2, 3, 4, 5].map((n) => (
              <button
                key={n}
                className={cx("star", n <= rating && "is-on")}
                onClick={() => setRating(n)}
                aria-label={`${n} star${n > 1 ? "s" : ""}`}
              >
                <Star fill={n <= rating ? "currentColor" : "none"} />
              </button>
            ))}
          </div>
        </div>
        <div style={{ height: 14 }} />
        <Field label="What should improve?" hint="Optional, but specific feedback helps most.">
          <textarea
            className="textarea"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Course materials, pace, assessment style…"
          />
        </Field>
        <div className="alert alert--info" style={{ marginTop: 14 }}>
          <UserCheck />
          <span>Your response is stored anonymously and cannot be traced back to you.</span>
        </div>
      </Modal>
    </>
  );
}
