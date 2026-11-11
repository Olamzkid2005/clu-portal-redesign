import { Fragment, useState } from "react";
import {
  AlertTriangle,
  ArrowRight,
  BookOpen,
  ChevronDown,
  Download,
  Info,
  Trash2,
} from "lucide-react";
import {
  MAX_UNITS,
  available,
  cgpa,
  registered,
  registeredUnits,
  results,
  semesterGpa,
  student,
  type Course,
  GRADE_POINTS,
} from "../data";
import { Button, Card, CardHead, Pill, cx, useToast } from "../components/ui";
import { exportRegistrationSlip, exportStatement } from "../exports";

/* ----------------------------------------------------------------- results */

export function ResultsPage() {
  const [open, setOpen] = useState<string | null>("2024/2025-Second");
  const toast = useToast();
  const published = results.filter((r) => r.status === "published");
  const unitsEarned = published
    .flatMap((r) => r.courses.filter((c) => c.grade))
    .reduce((sum, c) => sum + c.units, 0);
  const gpas = published.map((r) => semesterGpa(r) ?? 0);
  const best = Math.max(...gpas);
  const current = results.find((r) => r.status === "in-progress");

  return (
    <>
      <div className="page__head">
        <div>
          <div className="eyebrow">Academic record</div>
          <h1 className="page__title">Results</h1>
          <p className="page__sub">
            Published results for {student.programme}. The current semester appears once the
            senate approves the broadsheet.
          </p>
        </div>
        <div className="page__actions">
          <Button
            onClick={() => {
              const filename = exportStatement();
              toast(`Downloaded ${filename}.`);
            }}
          >
            <Download /> Download statement
          </Button>
        </div>
      </div>

      <div className="bento mb12">
        <div className="s3">
          <Card>
            <div className="card__bd">
              <div className="tiny muted">Cumulative GPA</div>
              <div className="tnum" style={{ fontSize: 28, fontWeight: 600, letterSpacing: "-0.03em" }}>
                {cgpa.toFixed(2)}
              </div>
              <div className="tiny muted">Scale of 5.00</div>
            </div>
          </Card>
        </div>
        <div className="s3">
          <Card>
            <div className="card__bd">
              <div className="tiny muted">Units earned</div>
              <div className="tnum" style={{ fontSize: 28, fontWeight: 600, letterSpacing: "-0.03em" }}>
                {unitsEarned}
              </div>
              <div className="tiny muted">Across {published.length} semesters</div>
            </div>
          </Card>
        </div>
        <div className="s3">
          <Card>
            <div className="card__bd">
              <div className="tiny muted">Best semester</div>
              <div className="tnum" style={{ fontSize: 28, fontWeight: 600, letterSpacing: "-0.03em" }}>
                {best.toFixed(2)}
              </div>
              <div className="tiny muted">2024/2025 second</div>
            </div>
          </Card>
        </div>
        <div className="s3">
          <Card>
            <div className="card__bd">
              <div className="tiny muted">Class standing</div>
              <div style={{ fontSize: 20, fontWeight: 600, letterSpacing: "-0.02em", marginTop: 2 }}>
                Second class upper
              </div>
              <div className="tiny muted">Projected from CGPA 3.50–4.49</div>
            </div>
          </Card>
        </div>
      </div>

      <Card flush>
        <CardHead title="Semester results" sub="Tap a row to see the course breakdown" />
        <div className="tablewrap">
          <table className="table table--stack">
            <thead>
              <tr>
                <th>Session</th>
                <th>Semester</th>
                <th>Level</th>
                <th className="t-right">Units</th>
                <th className="t-right">GPA</th>
                <th className="t-right">Status</th>
                <th />
              </tr>
            </thead>
            <tbody>
              {results.map((r) => {
                const key = `${r.session}-${r.semester}`;
                const units = r.courses.reduce((s, c) => s + c.units, 0);
                const gpa = semesterGpa(r);
                const expanded = open === key;
                return (
                  <Fragment key={key}>
                    <tr
                      onClick={() => setOpen(expanded ? null : key)}
                      style={{ cursor: "pointer" }}
                    >
                      <td data-label="Session">
                        <span className="table__strong">{r.session}</span>
                      </td>
                      <td data-label="Semester">{r.semester}</td>
                      <td data-label="Level">{r.level}</td>
                      <td data-label="Units" className="t-right tnum">
                        {units}
                      </td>
                      <td data-label="GPA" className="t-right tnum">
                        {gpa ? <b>{gpa.toFixed(2)}</b> : <span className="muted">—</span>}
                      </td>
                      <td data-label="Status" className="t-right">
                        {r.status === "in-progress" ? (
                          <Pill tone="amber">In progress</Pill>
                        ) : (
                          <Pill tone="green">Published</Pill>
                        )}
                      </td>
                      <td className="t-right" aria-hidden="true">
                        <ChevronDown
                          size={15}
                          style={{
                            color: "var(--faint)",
                            transform: expanded ? "rotate(180deg)" : "none",
                            transition: "transform .18s",
                          }}
                        />
                      </td>
                    </tr>
                    {expanded && (
                      <tr key={key + "-detail"}>
                        <td colSpan={7} style={{ padding: 0, background: "var(--surface-2)" }}>
                          <div style={{ padding: "4px 18px 16px" }}>
                            <table className="table table--stack table--compact">
                              <thead>
                                <tr>
                                  <th>Course</th>
                                  <th>Code</th>
                                  <th className="t-right">Units</th>
                                  <th className="t-right">Grade</th>
                                  <th className="t-right">Points</th>
                                </tr>
                              </thead>
                              <tbody>
                                {r.courses.map((c) => (
                                  <tr key={c.code}>
                                    <td data-label="Course">{c.title}</td>
                                    <td data-label="Code" className="muted">{c.code}</td>
                                    <td data-label="Units" className="t-right tnum">{c.units}</td>
                                    <td data-label="Grade" className="t-right">
                                      {c.grade ? (
                                        <span className={cx("grade", `grade--${c.grade.toLowerCase()}`)}>
                                          {c.grade}
                                        </span>
                                      ) : (
                                        <span className="muted tiny">—</span>
                                      )}
                                    </td>
                                    <td data-label="Points" className="t-right tnum">
                                      {c.grade ? c.units * GRADE_POINTS[c.grade] : "—"}
                                    </td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </div>
                        </td>
                      </tr>
                    )}
                  </Fragment>
                );
              })}
            </tbody>
          </table>
        </div>
      </Card>

      {current && (
        <div className="alert alert--info mt12">
          <Info />
          <span>
            <b>{current.session} {current.semester.toLowerCase()} semester</b> is in progress with{" "}
            {current.courses.reduce((s, c) => s + c.units, 0)} registered units.
          </span>
        </div>
      )}
    </>
  );
}

/* --------------------------------------------------------- course register */

export function CoursesPage() {
  const toast = useToast();
  const [reg, setReg] = useState<Course[]>(registered);
  const [picked, setPicked] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);

  const regUnits = registeredUnits(reg);
  const pickedCourses = available.filter((c) => picked.includes(c.code));
  const totalUnits = regUnits + registeredUnits(pickedCourses);
  const remaining = MAX_UNITS - totalUnits;

  const toggle = (course: Course) => {
    if (picked.includes(course.code)) {
      setPicked((p) => p.filter((c) => c !== course.code));
      setError(null);
      return;
    }
    if (totalUnits + course.units > MAX_UNITS) {
      setError(
        `${course.code} is ${course.units} units. Adding it would take you to ${
          totalUnits + course.units
        } units — the maximum allowed this semester is ${MAX_UNITS}. Remove a course first.`
      );
      return;
    }
    setPicked((p) => [...p, course.code]);
    setError(null);
  };

  const save = () => {
    setSaved(true);
    toast(`Registration saved — ${totalUnits} units submitted for approval.`);
  };

  return (
    <>
      <div className="page__head">
        <div>
          <div className="eyebrow">Classes</div>
          <h1 className="page__title">Course registration</h1>
          <p className="page__sub">
            {student.session} · {student.semester} semester. You must register every carry-over
            course before the portal closes.
          </p>
        </div>
        <div className="page__actions">
          <Button
            onClick={() => {
              const filename = exportRegistrationSlip();
              toast(`Downloaded ${filename}.`);
            }}
          >
            <Download /> Download slip
          </Button>
        </div>
      </div>

      {saved && (
        <div className="alert alert--ok mb12">
          <Info />
          <span>
            <b>Submitted for approval.</b> Your department will review the registration within two
            working days.
          </span>
        </div>
      )}

      <div className="bento">
        <Card className="s7" flush>
          <CardHead
            title="Registered courses"
            sub={`${reg.length} courses · ${regUnits} units`}
            action={<Pill tone="amber">Awaiting approval</Pill>}
          />
          <div className="tablewrap">
            <table className="table table--compact table--stack">
              <thead>
                <tr>
                  <th>Course</th>
                  <th className="t-right">Units</th>
                  <th className="t-right">Type</th>
                  <th className="t-right">Action</th>
                </tr>
              </thead>
              <tbody>
                {reg.map((c) => (
                  <tr key={c.code}>
                    <td data-label="Course">
                      <div className="table__strong">{c.code}</div>
                      <div className="table__sub">{c.title}</div>
                    </td>
                    <td data-label="Units" className="t-right tnum">
                      {c.units}
                    </td>
                    <td data-label="Type" className="t-right">
                      <Pill tone="outline">{c.kind}</Pill>
                    </td>
                    <td data-label="Action" className="t-right">
                      <button
                        className="rowbtn"
                        style={{ color: "var(--red)" }}
                        onClick={() => {
                          setReg((r) => r.filter((x) => x.code !== c.code));
                          toast(`${c.code} removed from this registration.`);
                        }}
                      >
                        <Trash2 /> Remove
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="unitbar">
            <div className="unitbar__num">
              <b>{totalUnits}</b> of {MAX_UNITS} units
            </div>
            <div style={{ flex: 1, minWidth: 120 }}>
              <div className="progress">
                <div
                  className="progress__bar"
                  style={{
                    width: `${Math.min(100, (totalUnits / MAX_UNITS) * 100)}%`,
                    background: totalUnits > MAX_UNITS ? "var(--red)" : undefined,
                  }}
                />
              </div>
            </div>
            <Button variant="primary" onClick={save} disabled={totalUnits === 0}>
              Save registration <ArrowRight />
            </Button>
          </div>
        </Card>

        <Card className="s5 card--hug" flush>
          <CardHead
            title="Available courses"
            sub="Electives and carry-over units"
            action={
              <Pill tone={remaining > 0 ? "brand" : "red"}>
                {remaining > 0 ? `${remaining} units left` : "Limit reached"}
              </Pill>
            }
          />
          <div>
            {available.map((c) => {
              const on = picked.includes(c.code);
              const off = !on && totalUnits + c.units > MAX_UNITS;
              return (
                <label key={c.code} className={cx("pick", on && "is-on", off && "is-off")}>
                  <input
                    type="checkbox"
                    checked={on}
                    onChange={() => toggle(c)}
                    aria-label={`Add ${c.code}`}
                  />
                  <span className="pick__main">
                    <span className="pick__title" style={{ display: "block" }}>
                      {c.code} · {c.title}
                    </span>
                    <span className="pick__meta" style={{ display: "block" }}>
                      {c.kind} · {c.lecturer}
                    </span>
                  </span>
                  <span className="pick__units">{c.units}u</span>
                </label>
              );
            })}
          </div>
          {error && (
            <div className="card__bd" style={{ paddingTop: 0 }}>
              <div className="alert alert--error">
                <AlertTriangle />
                <span>{error}</span>
              </div>
            </div>
          )}
          {!error && remaining === 0 && (
            <div className="card__bd" style={{ paddingTop: 0 }}>
              <div className="alert alert--warn">
                <AlertTriangle />
                <span>You have reached the {MAX_UNITS}-unit ceiling for the semester.</span>
              </div>
            </div>
          )}
        </Card>
      </div>

      <Card className="mt12">
        <div className="card__bd" style={{ display: "flex", gap: 10, alignItems: "flex-start" }}>
          <BookOpen size={16} style={{ color: "var(--brand-2)", marginTop: 2, flex: "none" }} />
          <div className="small muted">
            <b style={{ color: "var(--ink)" }}>Carry-over rule.</b> Courses with a previous fail
            must be re-registered before new electives. The portal marks them as{" "}
            <Pill tone="outline">Carry-over</Pill> and they cannot be removed.
          </div>
        </div>
      </Card>
    </>
  );
}
