import {
  ArrowRight,
  CalendarClock,
  ChevronRight,
  FileCheck2,
  FileText,
  HeartPulse,
  Megaphone,
} from "lucide-react";
import {
  announcements,
  assignments,
  attendancePercent,
  cgpa,
  fees,
  naira,
  registered,
  registeredUnits,
  results,
  semesterGpa,
  student,
  timetable,
} from "../data";
import { Avatar } from "../components/Avatar";
import { Button, Card, CardHead, CardLink, Empty } from "../components/ui";
import { useNav } from "../nav";

const DAY_NAMES = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const DAY_LONG = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
const toMinutes = (t: string) => {
  const [h, m] = t.split(":").map(Number);
  return h * 60 + m;
};

export default function Dashboard() {
  const { go } = useNav();

  const now = new Date();
  const todayName = DAY_NAMES[now.getDay()];
  const todayLong = DAY_LONG[now.getDay()];
  const isTeachingDay = ["Mon", "Tue", "Wed", "Thu", "Fri"].includes(todayName);
  const slots = timetable
    .filter((t) => t.day === (isTeachingDay ? todayName : "Mon"))
    .sort((a, b) => a.start.localeCompare(b.start));
  const nowMinutes = now.getHours() * 60 + now.getMinutes();
  const nextSlot = slots.find((c) => toMinutes(c.start) > nowMinutes);
  const liveSlot = slots.find(
    (c) => nowMinutes >= toMinutes(c.start) && nowMinutes <= toMinutes(c.end)
  );
  const contactHours = slots.reduce(
    (sum, c) => sum + (toMinutes(c.end) - toMinutes(c.start)) / 60,
    0
  );

  const overdue = assignments.find((a) => a.status === "overdue");
  const openAssignments = assignments
    .filter((a) => a.status === "pending" || a.status === "overdue")
    .sort((a, b) => {
      if (a.status === "overdue" && b.status !== "overdue") return -1;
      if (b.status === "overdue" && a.status !== "overdue") return 1;
      return new Date(a.due).getTime() - new Date(b.due).getTime();
    });
  const nextAssignments = openAssignments.slice(0, 3);

  const attendance = attendancePercent();
  const units = registeredUnits(registered);
  const published = results.filter((r) => r.status === "published");
  const best = published.reduce(
    (acc, r) => {
      const gpa = semesterGpa(r) ?? 0;
      return gpa > acc.gpa ? { gpa, label: `${r.session} ${r.semester.toLowerCase()}` } : acc;
    },
    { gpa: 0, label: "" }
  );

  const hour = now.getHours();
  const greeting = hour < 12 ? "Good morning" : hour < 17 ? "Good afternoon" : "Good evening";
  const dateLabel = now.toLocaleDateString("en-GB", {
    weekday: "long",
    day: "numeric",
    month: "long",
  });
  const todayTitle = isTeachingDay ? `Today · ${todayLong}` : "Next teaching day · Monday";
  const todaySub = slots.length
    ? `${slots.length} classes · ${contactHours} contact hours`
    : "No classes scheduled";
  const dayLine = slots.length
    ? `${slots.length} classes today. ${slots[0].code} starts at ${slots[0].start} in ${slots[0].venue}.`
    : "No classes today. The next teaching day is Monday.";

  return (
    <div className="bento student-home">
      <section className="dayhead page__head s8">
        <div className="eyebrow">
          {greeting}, {student.firstName}
        </div>
        <h1 className="dayhead__title">{dateLabel}</h1>
        <p className="dayhead__lede">
          {dayLine}
          {overdue
            ? ` ${overdue.code} has an overdue assignment.`
            : " Your open work is listed below."}
        </p>
        <div className="dayhead__actions">
          <Button variant="heroSolid" onClick={() => go("timetable")}>
            Open timetable <ArrowRight />
          </Button>
          <Button variant="hero" onClick={() => go("assignments")}>
            See assignments
          </Button>
        </div>
        <div className="dayhead__id">
          {student.name} · {student.programme} · Level {student.level}
        </div>
      </section>

      <aside className="student-pass s4" aria-label="Student details">
        <div className="student-pass__top">
          <span>Student pass</span>
          <span>{student.session}</span>
        </div>
        <div className="student-pass__person">
          <Avatar name={student.name} photo={student.photo} size={64} />
          <div>
            <b>{student.name}</b>
            <span>{student.programme}</span>
          </div>
        </div>
        <dl className="student-pass__facts">
          <div>
            <dt>Level</dt>
            <dd>{student.level}</dd>
          </div>
          <div>
            <dt>Matric</dt>
            <dd>{student.matric}</dd>
          </div>
          <div>
            <dt>Session</dt>
            <dd>
              {student.session} · {student.semester}
            </dd>
          </div>
        </dl>
        <div className="student-pass__foot">
          <span className="student-pass__stamp">Fees cleared</span>
          <span>{naira(fees.outstanding)} outstanding</span>
        </div>
      </aside>

      <section className="attentionbar s12" aria-label="Needs your attention">
        <div className="attentionbar__intro">
          <div className="eyebrow">Needs your attention</div>
          <p>Three things worth checking before your next class.</p>
        </div>
        <button className="attentionitem" onClick={() => go("courses")}>
          <span className="attentionitem__status attentionitem__status--amber">Registration</span>
          <span className="attentionitem__title">Still with your department</span>
          <span className="attentionitem__meta">Submitted 2 Nov</span>
          <ChevronRight />
        </button>
        <button className="attentionitem" onClick={() => go("assignments")}>
          <span className="attentionitem__status attentionitem__status--red">Assignment</span>
          <span className="attentionitem__title">
            {overdue ? `${overdue.code} is overdue` : "No overdue work"}
          </span>
          <span className="attentionitem__meta">
            {overdue ? `Was due ${overdue.due}` : `${openAssignments.length} open`}
          </span>
          <ChevronRight />
        </button>
        <button className="attentionitem" onClick={() => go("profile")}>
          <span className="attentionitem__status attentionitem__status--green">Exams</span>
          <span className="attentionitem__title">Exam card opens after registration</span>
          <span className="attentionitem__meta">Exams begin 1 Dec</span>
          <ChevronRight />
        </button>
      </section>

      <Card className="s7 schedule-card">
        <CardHead
          title={todayTitle}
          sub={todaySub}
          action={
            <CardLink onClick={() => go("timetable")}>
              Full week <ChevronRight />
            </CardLink>
          }
        />
        <div className="card__bd">
          {slots.length === 0 ? (
            <Empty
              icon={<CalendarClock />}
              title="No classes today"
              body="Your timetable is free. Use the day to clear pending assignments."
            />
          ) : (
            <ol className="schedule">
              {slots.map((c) => {
                const finished = toMinutes(c.end) < nowMinutes;
                const live = liveSlot?.code === c.code && liveSlot.start === c.start;
                const next = nextSlot?.code === c.code && nextSlot.start === c.start;
                return (
                  <li className="schedule__item" key={c.code + c.start}>
                    <div className="schedule__time">
                      <b>{c.start}</b>
                      <span>{c.end}</span>
                    </div>
                    <span
                      className="schedule__dot"
                      data-state={live ? "live" : next ? "next" : finished ? "done" : "later"}
                      aria-hidden="true"
                    />
                    <div className="schedule__body">
                      <div className="schedule__top">
                        <span className="schedule__code">{c.code}</span>
                        {live && <span className="schedule__state">In progress</span>}
                        {next && <span className="schedule__state">Next</span>}
                      </div>
                      <div className="schedule__title">{c.title}</div>
                      <div className="schedule__meta">
                        {c.lecturer} · {c.venue}
                      </div>
                    </div>
                  </li>
                );
              })}
            </ol>
          )}
        </div>
      </Card>

      <Card className="s5">
        <CardHead
          title="Coming up"
          sub={`${openAssignments.length} open assignment${openAssignments.length === 1 ? "" : "s"}`}
          action={
            <CardLink onClick={() => go("assignments")}>
              All assignments <ChevronRight />
            </CardLink>
          }
        />
        <div className="deadlines">
          {nextAssignments.map((a) => (
            <button className="deadline" key={a.id} onClick={() => go("assignments")}>
              <span
                className={
                  a.status === "overdue" ? "deadline__dot deadline__dot--red" : "deadline__dot"
                }
                aria-hidden="true"
              />
              <span className="deadline__body">
                <b>
                  {a.code} · {a.title}
                </b>
                <span>
                  {a.status === "overdue" ? "Overdue" : "Open"} · due {a.due}
                </span>
              </span>
              <ChevronRight />
            </button>
          ))}
          <button className="deadline" onClick={() => go("timetable")}>
            <span className="deadline__dot deadline__dot--clay" aria-hidden="true" />
            <span className="deadline__body">
              <b>First semester exams</b>
              <span>Begin 1 December · timetable published</span>
            </span>
            <ChevronRight />
          </button>
        </div>
      </Card>

      <Card className="s5 record-card">
        <CardHead
          title="Your record"
          sub="Published results and this semester"
          action={
            <CardLink onClick={() => go("results")}>
              Results <ChevronRight />
            </CardLink>
          }
        />
        <div className="record">
          <div className="record__item">
            <span>CGPA</span>
            <b>{cgpa.toFixed(2)}</b>
            <small>of 5.00</small>
          </div>
          <div className="record__item">
            <span>Units</span>
            <b>{units}</b>
            <small>registered</small>
          </div>
          <div className="record__item">
            <span>Attendance</span>
            <b>{attendance}%</b>
            <small>across {registered.length} courses</small>
          </div>
        </div>
        <div className="record__note">
          Best semester <b>{best.gpa.toFixed(2)}</b> in {best.label}
        </div>
      </Card>

      <Card className="s7">
        <CardHead title="Announcements" sub="From registry, bursary and your department" />
        <div className="announcements">
          {announcements.map((a) => (
            <article className="announcement" key={a.id}>
              <div className="announcement__meta">
                <span>{a.source}</span>
                <time>{a.date}</time>
              </div>
              <h3 className="announcement__title">{a.title}</h3>
              <p className="announcement__body">{a.body}</p>
            </article>
          ))}
        </div>
      </Card>

      <Card className="s12 services-card">
        <CardHead title="Student services" sub="Records, health and feedback" />
        <div className="services">
          {[
            { label: "Request transcript", icon: <FileText />, to: "requests/transcript" },
            { label: "Verify certificate", icon: <FileCheck2 />, to: "requests/verification" },
            { label: "Medical report", icon: <HeartPulse />, to: "medicals" },
            { label: "Student feedback", icon: <Megaphone />, to: "feedback" },
          ].map((service) => (
            <button
              className="service"
              key={service.to}
              onClick={() => go(service.to)}
            >
              <span className="service__icon">{service.icon}</span>
              <span>{service.label}</span>
              <ChevronRight />
            </button>
          ))}
        </div>
      </Card>
    </div>
  );
}
