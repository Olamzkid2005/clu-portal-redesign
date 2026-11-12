import {
  ArrowRight,
  BookOpen,
  CalendarDays,
  ChevronRight,
  ClipboardList,
  Clock,
  CreditCard,
  FileCheck2,
  FileText,
  Gauge,
  GraduationCap,
  HeartPulse,
  Megaphone,
  Sparkles,
} from "lucide-react";
import {
  announcements,
  assignments,
  cgpa,
  fees,
  naira,
  registered,
  registeredUnits,
  results,
  student,
  timetable,
} from "../data";
import { Button, Ring } from "../components/ui";
import HeroAnimation from "../components/HeroAnimation";
import { useNav } from "../nav";

const DAY_NAMES = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const toMinutes = (t: string) => {
  const [h, m] = t.split(":").map(Number);
  return h * 60 + m;
};

const clock = (time: string) => {
  const [hours, minutes] = time.split(":").map(Number);
  const suffix = hours >= 12 ? "PM" : "AM";
  const hour = hours % 12 || 12;
  return `${hour}:${String(minutes).padStart(2, "0")} ${suffix}`;
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
  const liveSlot = slots.find(
    (c) => nowMinutes >= toMinutes(c.start) && nowMinutes <= toMinutes(c.end)
  );
  const contactHours = slots.reduce(
    (sum, c) => sum + (toMinutes(c.end) - toMinutes(c.start)) / 60,
    0
  );

  const published = results.filter((r) => r.status === "published");
  const unitsEarned = published
    .flatMap((r) => r.courses.filter((c) => c.grade))
    .reduce((sum, c) => sum + c.units, 0);
  const currentUnits = registeredUnits(registered);
  const degreeTarget = student.degreeUnits;
  const completedPct = Math.min(100, Math.round((unitsEarned / degreeTarget) * 100));
  const inProgressPct = Math.round((currentUnits / degreeTarget) * 100);
  const notStartedPct = Math.max(0, 100 - completedPct - inProgressPct);

  const todayIndex = now.getDay() === 0 ? -1 : now.getDay() - 1;
  const upcoming = timetable
    .map((slot) => {
      const slotDay = ["Mon", "Tue", "Wed", "Thu", "Fri"].indexOf(slot.day);
      let offset = (slotDay - todayIndex + 7) % 7;
      if (offset === 0 && toMinutes(slot.end) < nowMinutes) offset = 7;
      return { ...slot, offset };
    })
    .sort((a, b) => a.offset - b.offset || a.start.localeCompare(b.start));
  const nextClass = upcoming[0];
  const upcomingClasses = upcoming.slice(0, 3);

  const overdue = assignments.find((a) => a.status === "overdue");
  const openAssignments = assignments
    .filter((a) => a.status === "pending" || a.status === "overdue")
    .sort((a, b) => {
      if (a.status === "overdue" && b.status !== "overdue") return -1;
      if (b.status === "overdue" && a.status !== "overdue") return 1;
      return new Date(a.due).getTime() - new Date(b.due).getTime();
    });
  const nextAssignments = openAssignments.slice(0, 3);

  const hour = now.getHours();
  const greeting = hour < 12 ? "Good morning" : hour < 17 ? "Good afternoon" : "Good evening";
  const dateLabel = now.toLocaleDateString("en-GB", {
    weekday: "long",
    day: "numeric",
    month: "long",
  });
  const dayLine = slots.length
    ? `${slots.length} classes today · ${contactHours} contact hours. ${
        liveSlot ? `${liveSlot.code} is in progress.` : `${slots[0].code} starts at ${clock(slots[0].start)}.`
      }`
    : "No classes today. Use the day to clear pending work.";

  const nextDate = new Date(now);
  nextDate.setDate(now.getDate() + (nextClass?.offset ?? 0));
  const nextDayLabel =
    nextClass?.offset === 0
      ? "Today"
      : nextClass?.offset === 1
      ? "Tomorrow"
      : nextDate.toLocaleDateString("en-GB", { weekday: "long" });

  return (
    <div className="student-home" id="student-dashboard">
      <div className="student-hero-stage">
        <section className="student-hero">
          <div className="student-hero__copy">
            <div className="student-hero__topline">
              <div className="student-hero__eyebrow">
                <span className="student-hero__pip" />
                Student dashboard
              </div>
              <div className="student-hero__level">
                <GraduationCap />
                <b>{student.level} Level</b>
                <span>•</span>
                <span>{student.programme}</span>
              </div>
            </div>
            <h1>
              {greeting},<br />
              <span>{student.firstName}!</span>
            </h1>
            <p className="student-hero__lede">Keep pushing. You&apos;re doing great!</p>
            <p className="student-hero__day">
              <Clock aria-hidden="true" />
              <span>
                {dateLabel} · {dayLine}
              </span>
            </p>
            <div className="student-hero__actions">
              <Button variant="primary" onClick={() => go("timetable")}>
                Open timetable <ArrowRight />
              </Button>
              <Button onClick={() => go("courses")}>
                <BookOpen /> My courses
              </Button>
            </div>
          </div>

          <HeroAnimation
            className="student-hero__media"
            src="/animations/student.mp4"
            poster="/animations/student-poster.jpg"
            label="A student studying at home with a laptop"
          />
        </section>
      </div>

      <section className="student-quickrow" aria-label="At a glance">
        <button className="quickcard" onClick={() => go("timetable")}>
          <span className="quickcard__icon">
            <CalendarDays />
          </span>
          <span className="quickcard__copy">
            <small>Next class</small>
            <b>{nextClass ? nextClass.code : "No class"}</b>
            <em>
              {nextClass
                ? `${nextDayLabel} · ${clock(nextClass.start)}`
                : "Your timetable is clear"}
            </em>
          </span>
          <ChevronRight />
        </button>

        <button className="quickcard" onClick={() => go("payments")}>
          <span className="quickcard__icon">
            <CreditCard />
          </span>
          <span className="quickcard__copy">
            <small>Fees status</small>
            <b className={fees.outstanding === 0 ? undefined : "quickcard__due"}>
              {fees.outstanding === 0 ? "Up to date" : `${naira(fees.outstanding)} due`}
            </b>
            <em>{student.session} session</em>
          </span>
          <ChevronRight />
        </button>

        <button className="quickcard" onClick={() => go("assignments")}>
          <span className="quickcard__icon">
            <ClipboardList />
          </span>
          <span className="quickcard__copy">
            <small>Open work</small>
            <b>{openAssignments.length} items</b>
            <em className={overdue ? "quickcard__alert" : undefined}>
              {overdue ? "1 overdue" : "Nothing overdue"}
            </em>
          </span>
          <ChevronRight />
        </button>
      </section>

      <div className="student-grid">
        <section className="student-panel student-panel--classes">
          <div className="student-panel__head">
            <div className="student-panel__title">
              <span className="student-panel__icon">
                <CalendarDays />
              </span>
              <div>
                <h2>Upcoming classes</h2>
                <p className="student-panel__sub">Your next three sessions</p>
              </div>
            </div>
            <button className="student-panel__link" onClick={() => go("timetable")}>
              View schedule <ArrowRight />
            </button>
          </div>
          <div className="student-classlist">
            {upcomingClasses.map((c, index) => {
              const classDate = new Date(now);
              classDate.setDate(now.getDate() + c.offset);
              const day = classDate.toLocaleDateString("en-GB", { weekday: "short" });
              const date = classDate.getDate();
              const isLab = c.title.toLowerCase().includes("lab");
              return (
                <button
                  className="student-class"
                  key={`${c.code}-${c.day}-${c.start}`}
                  onClick={() => go("timetable")}
                >
                  <span className="student-class__date">
                    <b>{day}</b>
                    <span>{date}</span>
                  </span>
                  <span className={`student-class__dot student-class__dot--${index}`} />
                  <span className="student-class__body">
                    <b>{c.title}</b>
                    <span>
                      {clock(c.start)} – {clock(c.end)} · {c.venue}
                    </span>
                  </span>
                  <span className="student-class__tag">{isLab ? "Lab" : "Lecture"}</span>
                </button>
              );
            })}
          </div>
        </section>

        <section className="student-panel student-panel--overview">
          <div className="student-panel__head">
            <div className="student-panel__title">
              <span className="student-panel__icon">
                <Gauge />
              </span>
              <div>
                <h2>Academic overview</h2>
                <p className="student-panel__sub">Progress toward your degree</p>
              </div>
            </div>
            <button className="student-panel__link" onClick={() => go("results")}>
              Results <ArrowRight />
            </button>
          </div>
          <div className="student-overview">
            <Ring value={completedPct} size={120} label="Degree progress" text={`${completedPct}%`} />
            <div className="student-overview__body">
              <ul className="student-legend">
                <li>
                  <span className="student-legend__dot student-legend__dot--done" />
                  Completed <b>{completedPct}%</b>
                </li>
                <li>
                  <span className="student-legend__dot student-legend__dot--doing" />
                  In progress <b>{inProgressPct}%</b>
                </li>
                <li>
                  <span className="student-legend__dot student-legend__dot--todo" />
                  Not started <b>{notStartedPct}%</b>
                </li>
              </ul>
              <div className="student-cgpa">
                <span>CGPA</span>
                <b>{cgpa.toFixed(2)}</b>
                <small>/ 5.00</small>
              </div>
            </div>
          </div>
        </section>
      </div>

      <div className="student-grid student-grid--lower">
        <section
          className={
            overdue ? "student-panel student-panel--attention" : "student-panel"
          }
        >
          <div className="student-panel__head">
            <div className="student-panel__title">
              <span className="student-panel__icon">
                <ClipboardList />
              </span>
              <div>
                <h2>Deadlines</h2>
                <p className="student-panel__sub">Open work and due dates</p>
              </div>
            </div>
            <div className="student-panel__actions">
              {overdue && <span className="student-panel__flag">1 overdue</span>}
              <button className="student-panel__link" onClick={() => go("assignments")}>
                All assignments <ArrowRight />
              </button>
            </div>
          </div>
          <div className="student-tasks">
            {nextAssignments.map((a) => (
              <button className="student-task" key={a.id} onClick={() => go("assignments")}>
                <span
                  className={`student-task__dot ${
                    a.status === "overdue" ? "student-task__dot--red" : ""
                  }`}
                />
                <span className="student-task__copy">
                  <b>{a.title}</b>
                  <span>
                    {a.code} · {a.status === "overdue" ? "Overdue" : "Open"} · due {a.due}
                  </span>
                </span>
                <ChevronRight />
              </button>
            ))}
            <div className="student-note">
              {overdue
                ? `${overdue.code} needs attention first.`
                : "You have no overdue work. Keep the streak going."}
            </div>
          </div>
        </section>

        <section className="student-panel student-panel--announcements" id="announcements">
          <div className="student-panel__head">
            <div className="student-panel__title">
              <span className="student-panel__icon">
                <Megaphone />
              </span>
              <div>
                <h2>Announcements</h2>
                <p className="student-panel__sub">From registry and your department</p>
              </div>
            </div>
            <span className="student-panel__count">{announcements.length} new</span>
          </div>
          <div className="student-announcements">
            {announcements.slice(0, 2).map((a) => (
              <article className="student-announcement" key={a.id}>
                <div className="student-announcement__meta">
                  <span>{a.source}</span>
                  <time>{a.date}</time>
                </div>
                <h3>{a.title}</h3>
                <p>{a.body}</p>
              </article>
            ))}
          </div>
        </section>
      </div>

      <section className="student-panel student-panel--services">
        <div className="student-panel__head">
          <div className="student-panel__title">
            <span className="student-panel__icon">
              <Sparkles />
            </span>
            <div>
              <h2>Student services</h2>
              <p className="student-panel__sub">Forms you use most</p>
            </div>
          </div>
          <span className="student-panel__count">Quick access</span>
        </div>
        <div className="student-services">
          {[
            { label: "Request transcript", icon: <FileText />, to: "requests/transcript" },
            { label: "Verify certificate", icon: <FileCheck2 />, to: "requests/verification" },
            { label: "Medical report", icon: <HeartPulse />, to: "medicals" },
            { label: "Student feedback", icon: <Megaphone />, to: "feedback" },
          ].map((service) => (
            <button className="student-service" key={service.to} onClick={() => go(service.to)}>
              <span>{service.icon}</span>
              {service.label}
              <ChevronRight />
            </button>
          ))}
        </div>
      </section>
    </div>
  );
}
