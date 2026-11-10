import {
  ArrowRight,
  BookOpen,
  CalendarClock,
  ChevronRight,
  ClipboardList,
  FileCheck2,
  FileText,
  MapPin,
  Megaphone,
  ShieldCheck,
  UserCheck,
  Wallet,
} from "lucide-react";
import {
  announcements,
  attendancePercent,
  cgpa,
  fees,
  naira,
  results,
  semesterGpa,
  student,
  timetable,
} from "../data";
import { Button, Card, CardHead, CardLink, Empty, Pill, Ring, Stat } from "../components/ui";
import { useNav } from "../nav";

const DAY_NAMES = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const toMinutes = (t: string) => {
  const [h, m] = t.split(":").map(Number);
  return h * 60 + m;
};

export default function Dashboard() {
  const { go } = useNav();

  const now = new Date();
  const todayName = DAY_NAMES[now.getDay()];
  const isTeachingDay = ["Mon", "Tue", "Wed", "Thu", "Fri"].includes(todayName);
  const slots = timetable
    .filter((t) => t.day === (isTeachingDay ? todayName : "Mon"))
    .sort((a, b) => a.start.localeCompare(b.start));
  const nowMinutes = now.getHours() * 60 + now.getMinutes();

  const published = results.filter((r) => r.status === "published");
  const chronological = [...published].reverse();
  const points = chronological.slice(-7).map((r) => ({
    label:
      r.session.slice(2, 4) +
      "·" +
      (r.semester === "First" ? "1" : r.semester === "Second" ? "2" : "S"),
    gpa: semesterGpa(r) ?? 0,
    title: `${r.session} ${r.semester}`,
  }));
  const best = published.reduce(
    (acc, r) => {
      const g = semesterGpa(r) ?? 0;
      return g > acc.gpa ? { gpa: g, label: `${r.session} ${r.semester.toLowerCase()}` } : acc;
    },
    { gpa: 0, label: "" }
  );

  const attendance = attendancePercent();

  return (
    <>
      <div className="bento">
        <section className="hero s8">
          <div className="eyebrow">
            {student.session} · {student.semester} semester · Level {student.level}
          </div>
          <h1 className="hero__greet serif">
            Your term,
            <br />
            in plain view.
          </h1>
          <div className="hero__meta">
            {student.name} · {student.programme} · {student.matric}
          </div>
          <div className="hero__row">
            <div className="hero__facts">
              <div className="hero__fact">
                <span>CGPA</span>
                <b className="tnum">{cgpa.toFixed(2)}</b>
              </div>
              <div className="hero__fact">
                <span>Units</span>
                <b className="tnum">21</b>
              </div>
              <div className="hero__fact">
                <span>Attendance</span>
                <b className="tnum">{attendance}%</b>
              </div>
              <div className="hero__fact">
                <span>Fees</span>
                <b>Cleared</b>
              </div>
            </div>
            <div className="hero__actions">
              <Button variant="heroSolid" onClick={() => go("courses")}>
                <BookOpen /> Manage courses
              </Button>
              <Button variant="hero" onClick={() => go("timetable")}>
                <CalendarClock /> Timetable
              </Button>
            </div>
          </div>
        </section>

        <Card className="s4 fee-card">
          <CardHead
            title="Fee status"
            sub={`${student.session} session`}
            action={<Pill tone="green">Cleared</Pill>}
          />
          <div
            className="card__bd"
            style={{ display: "flex", alignItems: "center", gap: 18, flexWrap: "wrap" }}
          >
            <Ring value={fees.paid} max={fees.billed} label="paid" text="100%" />
            <div style={{ minWidth: 0, flex: 1 }}>
              <div className="tiny fee-card__label">Outstanding balance</div>
              <div className="tnum fee-card__amount">{naira(fees.outstanding)}</div>
              <div className="tiny fee-card__meta">
                {naira(fees.paid)} of {naira(fees.billed)} settled
              </div>
              <Button size="sm" style={{ marginTop: 12 }} onClick={() => go("payments")}>
                Payment history <ArrowRight />
              </Button>
            </div>
          </div>
        </Card>

        <div className="statgrid s12">
          <Stat
            icon={<Wallet />}
            label="Outstanding"
            value={<>{naira(fees.outstanding)} <small>NGN</small></>}
            meta="No payment due"
            tone="green"
            onClick={() => go("payments")}
          />
          <Stat
            icon={<ShieldCheck />}
            label="Registration"
            value={<>Pending <small>approval</small></>}
            meta="Submitted 2 Nov"
            tone="amber"
            onClick={() => go("courses")}
          />
          <Stat
            icon={<ClipboardList />}
            label="Assignments"
            value={<>3 <small>pending</small></>}
            meta="1 marked overdue"
            tone="blue"
            onClick={() => go("assignments")}
          />
          <Stat
            icon={<UserCheck />}
            label="Attendance"
            value={<>{attendance} <small>%</small></>}
            meta="Across 7 courses"
            tone="rose"
            onClick={() => go("attendance")}
          />
        </div>

        <Card className="s7">
          <CardHead
            title={isTeachingDay ? `Today · ${todayName}` : "Next teaching day · Mon"}
            sub={`${slots.length} classes scheduled`}
            action={
              <CardLink onClick={() => go("timetable")}>
                Full week <ChevronRight />
              </CardLink>
            }
          />
          <div className="card__bd" style={{ paddingTop: 4 }}>
            {slots.length === 0 ? (
              <Empty
                icon={<CalendarClock />}
                title="No classes today"
                body="Your timetable is free. Use the day to clear pending assignments."
              />
            ) : (
              <div className="today">
                {slots.map((c) => {
                  const live =
                    isTeachingDay &&
                    nowMinutes >= toMinutes(c.start) &&
                    nowMinutes <= toMinutes(c.end);
                  return (
                    <div className="today__item" key={c.code + c.start}>
                      <div className="today__time">
                        {c.start}
                        <br />
                        {c.end}
                      </div>
                      <div className="today__body">
                        {live && <div className="today__now">In progress</div>}
                        <div className="today__code">{c.code}</div>
                        <div className="today__title">{c.title}</div>
                        <div
                          className="today__title"
                          style={{ display: "flex", alignItems: "center", gap: 4, marginTop: 3 }}
                        >
                          <MapPin size={11} /> {c.venue}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </Card>

        <Card className="s5">
          <CardHead
            title="GPA trend"
            sub="Last seven published semesters"
            action={<Pill tone="brand">{cgpa.toFixed(2)} CGPA</Pill>}
          />
          <div className="card__bd">
            <div className="bars">
              {points.map((p) => (
                <div
                  key={p.label + p.title}
                  className="bar"
                  style={{ height: `${Math.max(6, (p.gpa / 5) * 100)}%` }}
                  title={`${p.title} — ${p.gpa.toFixed(2)}`}
                />
              ))}
            </div>
            <div className="bar__axis">
              {points.map((p) => (
                <span key={p.label + p.title}>{p.label}</span>
              ))}
            </div>
            <div className="chartnote">
              Best semester <b className="tnum">{best.gpa.toFixed(2)}</b> in {best.label}
            </div>
          </div>
        </Card>

        <Card className="s8">
          <CardHead
            title="Announcements"
            sub="From your department and the registry"
            action={
              <CardLink onClick={() => go("feedback")}>
                Send feedback <ChevronRight />
              </CardLink>
            }
          />
          <div className="rows">
            {announcements.map((a) => (
              <div className="rowitem" key={a.id}>
                <div className="rowitem__main">
                  <div className="rowitem__title">{a.title}</div>
                  <div className="rowitem__meta">{a.body}</div>
                </div>
                <div className="rowitem__side">
                  <Pill tone="outline">{a.tag}</Pill>
                  <div className="tiny" style={{ color: "var(--faint)", marginTop: 5 }}>
                    {a.date}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Card>

        <Card className="s4">
          <CardHead title="Quick actions" sub="Most used services" />
          <div className="card__bd" style={{ display: "grid", gap: 8 }}>
            {[
              { label: "Request transcript", icon: <FileText />, to: "requests/transcript" },
              { label: "Verify certificate", icon: <FileCheck2 />, to: "requests/verification" },
              { label: "Proficiency letter", icon: <FileText />, to: "requests/proficiency" },
              { label: "Medical report", icon: <ShieldCheck />, to: "medicals" },
              { label: "Student feedback", icon: <Megaphone />, to: "feedback" },
            ].map((a) => (
              <button
                key={a.to}
                className="btn btn--outline"
                style={{ justifyContent: "space-between" }}
                onClick={() => go(a.to)}
              >
                <span style={{ display: "inline-flex", alignItems: "center", gap: 9 }}>
                  {a.icon}
                  {a.label}
                </span>
                <ChevronRight size={14} style={{ color: "var(--faint)" }} />
              </button>
            ))}
            <div className="tiny muted" style={{ padding: "6px 2px 0" }}>
              Fees, registration and results are the three most visited pages this session.
            </div>
          </div>
        </Card>
      </div>
    </>
  );
}
