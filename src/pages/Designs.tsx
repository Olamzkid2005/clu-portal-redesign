import { useEffect, useState } from "react";
import { ArrowUpRight, ChevronRight } from "lucide-react";
import { cx } from "../components/ui";

/*
 * Five visual directions for the Chrisland University portal.
 * The Quad is the shipped direction. The rest of the study is kept as an
 * archive of the alternatives that were considered.
 */

const DIRECTIONS = [
  {
    id: "register",
    number: "01",
    name: "The Register",
    character: "exact, scholarly, composed",
    world: "Registry ledgers, ruled paper and ink",
    build: "A deep plum index rail, warm record paper and ruled rows",
    palette: ["#3b1c42", "#f2ede4", "#a47a42", "#211a24"],
  },
  {
    id: "quad",
    number: "02",
    name: "The Quad",
    character: "open, direct, contemporary",
    world: "Campus wayfinding and daylight between academic blocks",
    build: "Horizontal navigation, solid plum fields and a clear information grid",
    palette: ["#562366", "#fbfaf7", "#e9dfec", "#c56f47"],
  },
  {
    id: "bulletin",
    number: "03",
    name: "The Bulletin",
    character: "plain-spoken, current, civic",
    world: "The campus noticeboard and the student newspaper",
    build: "A masthead, double rules and closely set columns",
    palette: ["#52235c", "#eee8da", "#1d1a16", "#a56b30"],
  },
  {
    id: "evening",
    number: "04",
    name: "Evening Study",
    character: "quiet, focused, a little formal",
    world: "The library after dark and brass reading lamps",
    build: "Deep ink surfaces, warm type and one closely drawn GPA line",
    palette: ["#171218", "#c7a76a", "#f2e8d8", "#6d5a68"],
  },
  {
    id: "studio",
    number: "05",
    name: "The Studio",
    character: "spacious, editorial, assured",
    world: "A printed course catalogue and a drafting table",
    build: "Oversized serif names, hairline indexes and generous white space",
    palette: ["#4c2458", "#f7f5f0", "#ded6e5", "#6b7456"],
  },
] as const;

type DirectionId = (typeof DIRECTIONS)[number]["id"];

const schedule = [
  {
    start: "10:00",
    end: "12:00",
    code: "SWE 505",
    title: "Advanced Algorithms",
    venue: "Computing Lab 2",
  },
  {
    start: "14:00",
    end: "16:00",
    code: "GES 501",
    title: "Entrepreneurship & Innovation",
    venue: "Auditorium A",
  },
];

const grades = [
  { code: "SWE 402", title: "Software Design Patterns", units: 3, grade: "A" },
  { code: "SWE 404", title: "Database Systems", units: 3, grade: "A" },
  { code: "SWE 408", title: "Human Computer Interaction", units: 2, grade: "B" },
  { code: "CSC 406", title: "Compiler Construction", units: 3, grade: "B" },
];

const gpaBars = [
  { label: "22·1", value: 4.1 },
  { label: "22·2", value: 4.32 },
  { label: "23·1", value: 4.18 },
  { label: "23·2", value: 4.4 },
  { label: "24·1", value: 4.46 },
  { label: "24·2", value: 4.69 },
  { label: "25·1", value: 4.25 },
];

function Portrait() {
  return (
    <span className="dp-portrait" aria-hidden="true">
      <span>AO</span>
      <img src="/student-avatar.jpg" alt="" />
    </span>
  );
}

function RegisterBoard() {
  return (
    <div className="dp dp--register">
      <div className="dp__shell register">
        <aside className="register__rail">
          <div className="register__identity">
            <span className="register__seal">CLU</span>
            <div>
              <strong>Chrisland University</strong>
              <span>Student records</span>
            </div>
          </div>

          <nav className="register__nav" aria-label="Register preview navigation">
            <p>Study</p>
            <span className="is-active">
              <i>01</i>Overview
            </span>
            <span>
              <i>02</i>Timetable
            </span>
            <span>
              <i>03</i>Courses
            </span>
            <span>
              <i>04</i>Results
            </span>
            <p>Account</p>
            <span>
              <i>05</i>Payments
            </span>
            <span>
              <i>06</i>Profile
            </span>
          </nav>

          <div className="register__railfoot">
            <span>First semester</span>
            <strong>2025 / 2026</strong>
          </div>
        </aside>

        <main className="register__main">
          <header className="register__utility">
            <span>Student record / 2025–26</span>
            <span className="register__me">
              <Portrait />
              <span>
                <b>Adaeze N. Okonkwo</b>
                <small>CLU210118-042</small>
              </span>
            </span>
          </header>

          <section className="register__intro">
            <div className="register__kicker">
              Semester record <span>01</span>
            </div>
            <h2>Adaeze N. Okonkwo</h2>
            <p>BSc Software Engineering · Level 500</p>
            <div className="register__facts">
              <div>
                <span>CGPA</span>
                <strong>4.25</strong>
              </div>
              <div>
                <span>Units</span>
                <strong>21</strong>
              </div>
              <div>
                <span>Attendance</span>
                <strong>85%</strong>
              </div>
              <div>
                <span>Fees</span>
                <strong>Cleared</strong>
              </div>
            </div>
          </section>

          <div className="register__columns">
            <section className="register__ledger">
              <header>
                <h3>Term ledger</h3>
                <span>2025/2026 · First</span>
              </header>
              <div className="register__row">
                <span>Tuition and fees</span>
                <span>₦400,000</span>
              </div>
              <div className="register__row">
                <span>Paid to date</span>
                <span>₦400,000</span>
              </div>
              <div className="register__row register__row--total">
                <span>Balance</span>
                <strong>₦0</strong>
              </div>
              <p className="register__fine">Cleared 13 October 2025 · Paystack</p>
            </section>

            <section className="register__day">
              <header>
                <h3>Tuesday, 10 November</h3>
                <span>2 classes</span>
              </header>
              <div className="register__class">
                <span>10:00 — 12:00</span>
                <div>
                  <b>SWE 505</b>
                  <p>Advanced Algorithms</p>
                  <small>Computing Lab 2</small>
                </div>
              </div>
              <div className="register__class">
                <span>14:00 — 16:00</span>
                <div>
                  <b>GES 501</b>
                  <p>Entrepreneurship &amp; Innovation</p>
                  <small>Auditorium A</small>
                </div>
              </div>
              <span className="register__textlink">
                Full week <ArrowUpRight />
              </span>
            </section>
          </div>

          <section className="register__results">
            <header>
              <h3>Published results</h3>
              <span>Latest semester</span>
            </header>
            <table>
              <thead>
                <tr>
                  <th>Course</th>
                  <th>Title</th>
                  <th>Units</th>
                  <th>Grade</th>
                </tr>
              </thead>
              <tbody>
                {grades.slice(0, 3).map((row) => (
                  <tr key={row.code}>
                    <td>{row.code}</td>
                    <td>{row.title}</td>
                    <td>{row.units}</td>
                    <td>
                      <b>{row.grade}</b>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </section>
        </main>
      </div>
    </div>
  );
}

function QuadBoard() {
  return (
    <div className="dp dp--quad">
      <div className="dp__shell quad">
        <header className="quad__nav">
          <div className="quad__brand">
            <span className="quad__mark">CLU</span>
            <span>Chrisland University</span>
          </div>
          <nav aria-label="Quad preview navigation">
            <span className="is-active">Overview</span>
            <span>Timetable</span>
            <span>Courses</span>
            <span>Results</span>
            <span>Payments</span>
          </nav>
          <div className="quad__me">
            <Portrait />
            <span>Adaeze</span>
          </div>
        </header>

        <main className="quad__main">
          <section className="quad__intro">
            <div className="quad__heading">
              <span className="quad__kicker">Final year · first semester</span>
              <h2>
                Your term,
                <br />
                in plain view.
              </h2>
              <p>BSc Software Engineering · Level 500 · 21 registered units</p>
            </div>
            <aside className="quad__fees">
              <span>Account balance</span>
              <strong>₦0</strong>
              <i aria-hidden="true" />
              <p>Paid in full · 13 October</p>
              <span className="quad__feeLink">
                View statement <ArrowUpRight />
              </span>
            </aside>
          </section>

          <section className="quad__stats" aria-label="Term summary">
            <div>
              <span>CGPA</span>
              <strong>4.25</strong>
              <p>Of 5.00</p>
            </div>
            <div>
              <span>Attendance</span>
              <strong>85%</strong>
              <p>Across 7 courses</p>
            </div>
            <div>
              <span>Registration</span>
              <strong>Pending</strong>
              <p>Submitted 2 November</p>
            </div>
            <div>
              <span>Next class</span>
              <strong>10:00</strong>
              <p>SWE 505 · Lab 2</p>
            </div>
          </section>

          <div className="quad__grid">
            <section className="quad__schedule">
              <header>
                <h3>Today</h3>
                <span>Tuesday, 10 November</span>
              </header>
              {schedule.map((item) => (
                <div className="quad__class" key={item.code}>
                  <span className="quad__time">
                    {item.start}
                    <small>{item.end}</small>
                  </span>
                  <div>
                    <b>{item.code}</b>
                    <p>{item.title}</p>
                    <small>{item.venue}</small>
                  </div>
                  <ChevronRight size={14} />
                </div>
              ))}
              <span className="quad__textlink">Open the full timetable</span>
            </section>

            <section className="quad__chart">
              <header>
                <h3>GPA across semesters</h3>
                <span>4.25 CGPA</span>
              </header>
              <div className="quad__bars">
                {gpaBars.map((bar) => (
                  <div key={bar.label}>
                    <i style={{ height: `${(bar.value / 5) * 100}%` }} />
                    <span>{bar.label}</span>
                  </div>
                ))}
              </div>
              <p className="quad__chartnote">
                Best semester <b>4.69</b> · 2024/25 second
              </p>
            </section>
          </div>
        </main>
      </div>
    </div>
  );
}

function BulletinBoard() {
  return (
    <div className="dp dp--bulletin">
      <div className="dp__shell bulletin">
        <header className="bulletin__masthead">
          <div className="bulletin__edition">
            <span>Chrisland University</span>
            <small>Student bulletin</small>
          </div>
          <div className="bulletin__title">The weekly record</div>
          <div className="bulletin__date">
            <span>Vol. 04</span>
            <small>10 November 2026</small>
          </div>
        </header>

        <nav className="bulletin__nav" aria-label="Bulletin preview navigation">
          <span className="is-active">Overview</span>
          <span>Timetable</span>
          <span>Courses</span>
          <span>Results</span>
          <span>Payments</span>
          <span className="bulletin__me">
            <Portrait /> <span className="bulletin__mename">Adaeze N. Okonkwo</span>
          </span>
        </nav>

        <main className="bulletin__main">
          <section className="bulletin__lead">
            <div>
              <span className="bulletin__kicker">Semester report / 2025–26</span>
              <h2>Adaeze N. Okonkwo</h2>
              <p>BSc Software Engineering · Level 500 · CLU210118-042</p>
            </div>
            <div className="bulletin__stamp">
              <span>Fee status</span>
              <strong>Cleared</strong>
              <small>₦0 outstanding</small>
            </div>
          </section>

          <div className="bulletin__columns">
            <section className="bulletin__leadcol">
              <header>
                <span>01</span>
                <h3>Today on campus</h3>
              </header>
              {schedule.map((item) => (
                <article className="bulletin__class" key={item.code}>
                  <span>
                    {item.start} — {item.end}
                  </span>
                  <b>{item.code}</b>
                  <h4>{item.title}</h4>
                  <small>{item.venue}</small>
                </article>
              ))}
              <div className="bulletin__notice">
                <span>Registry</span>
                <p>Course registration closes on 14 November. Confirm your electives this week.</p>
              </div>
            </section>

            <section className="bulletin__tablecol">
              <header>
                <span>02</span>
                <h3>Latest results</h3>
              </header>
              <div className="bulletin__term">2024/2025 · Second semester</div>
              {grades.map((row) => (
                <div className="bulletin__result" key={row.code}>
                  <span>{row.code}</span>
                  <p>{row.title}</p>
                  <b>{row.grade}</b>
                </div>
              ))}
            </section>

            <aside className="bulletin__sidecol">
              <section className="bulletin__score">
                <span>Term summary</span>
                <strong>4.25</strong>
                <p>Current CGPA</p>
              </section>
              <section className="bulletin__facts">
                <div>
                  <span>Attendance</span>
                  <b>85%</b>
                </div>
                <div>
                  <span>Units</span>
                  <b>21</b>
                </div>
                <div>
                  <span>Next class</span>
                  <b>10:00</b>
                </div>
                <div>
                  <span>Venue</span>
                  <b>Lab 2</b>
                </div>
              </section>
              <div className="bulletin__contact">
                <span>Need help?</span>
                <p>Registry · registry@chrislanduniversity.edu.ng</p>
              </div>
            </aside>
          </div>
        </main>
      </div>
    </div>
  );
}

function EveningBoard() {
  return (
    <div className="dp dp--evening">
      <div className="dp__shell evening">
        <aside className="evening__rail">
          <div className="evening__brand">
            <span>CLU</span>
            <div>
              <strong>Chrisland University</strong>
              <small>Student portal</small>
            </div>
          </div>
          <nav aria-label="Evening preview navigation">
            <span className="is-active">Overview</span>
            <span>Timetable</span>
            <span>Courses</span>
            <span>Results</span>
            <span>Payments</span>
            <span>Profile</span>
          </nav>
          <div className="evening__railfoot">
            <i aria-hidden="true" />
            <span>First semester</span>
            <strong>2025 / 2026</strong>
          </div>
        </aside>

        <main className="evening__main">
          <header className="evening__utility">
            <span>2025/2026 · First semester</span>
            <span className="evening__me">
              <Portrait />
              <span>
                <b>Adaeze N. Okonkwo</b>
                <small>CLU210118-042</small>
              </span>
            </span>
          </header>

          <section className="evening__intro">
            <div className="evening__heading">
              <span>Student overview</span>
              <h2>
                First semester,
                <br />
                steady progress.
              </h2>
              <p>BSc Software Engineering · Level 500 · 21 registered units</p>
            </div>

            <div className="evening__chart">
              <header>
                <span>GPA trend</span>
                <b>4.25</b>
              </header>
              <svg viewBox="0 0 360 138" role="img" aria-label="GPA trend across six semesters">
                <title>GPA across six semesters, from 4.10 to 4.69</title>
                <g className="evening__grid">
                  <line x1="0" y1="20" x2="360" y2="20" />
                  <line x1="0" y1="66" x2="360" y2="66" />
                  <line x1="0" y1="112" x2="360" y2="112" />
                </g>
                <path
                  className="evening__line"
                  d="M0 94 L60 76 L120 86 L180 58 L240 45 L300 32 L360 68"
                  fill="none"
                />
                <g className="evening__dots">
                  <circle cx="0" cy="94" r="3" />
                  <circle cx="60" cy="76" r="3" />
                  <circle cx="120" cy="86" r="3" />
                  <circle cx="180" cy="58" r="3" />
                  <circle cx="240" cy="45" r="3" />
                  <circle cx="300" cy="32" r="4.5" />
                  <circle cx="360" cy="68" r="3" />
                </g>
              </svg>
              <div className="evening__labels">
                <span>22·1</span>
                <span>22·2</span>
                <span>23·1</span>
                <span>23·2</span>
                <span>24·1</span>
                <span>24·2</span>
                <span>25·1</span>
              </div>
              <p>Best semester 4.69 · 2024/25 second</p>
            </div>
          </section>

          <section className="evening__stats" aria-label="Term summary">
            <div>
              <span>CGPA</span>
              <strong>4.25</strong>
              <p>Stable this semester</p>
            </div>
            <div>
              <span>Attendance</span>
              <strong>85%</strong>
              <p>Across 7 courses</p>
            </div>
            <div>
              <span>Fees</span>
              <strong>₦0</strong>
              <p>Cleared 13 October</p>
            </div>
            <div>
              <span>Next class</span>
              <strong>10:00</strong>
              <p>SWE 505 · Lab 2</p>
            </div>
          </section>

          <div className="evening__lower">
            <section className="evening__day">
              <header>
                <h3>Tuesday, 10 November</h3>
                <span>2 classes</span>
              </header>
              {schedule.map((item) => (
                <div className="evening__class" key={item.code}>
                  <span>
                    {item.start} — {item.end}
                  </span>
                  <div>
                    <b>{item.code}</b>
                    <p>{item.title}</p>
                    <small>{item.venue}</small>
                  </div>
                </div>
              ))}
            </section>

            <section className="evening__account">
              <header>
                <h3>Account</h3>
                <span>Current session</span>
              </header>
              <div>
                <span>Billed</span>
                <b>₦400,000</b>
              </div>
              <div>
                <span>Paid</span>
                <b>₦400,000</b>
              </div>
              <div className="evening__balance">
                <span>Balance</span>
                <strong>₦0</strong>
              </div>
              <p>Last payment 13 October 2025 · Paystack</p>
            </section>
          </div>
        </main>
      </div>
    </div>
  );
}

function StudioBoard() {
  return (
    <div className="dp dp--studio">
      <div className="dp__shell studio">
        <header className="studio__bar">
          <div className="studio__brand">
            <span>Chrisland University</span>
            <small>Student portal</small>
          </div>
          <nav aria-label="Studio preview navigation">
            <span className="is-active">Overview</span>
            <span>Timetable</span>
            <span>Courses</span>
            <span>Results</span>
            <span>Payments</span>
          </nav>
          <Portrait />
        </header>

        <main className="studio__main">
          <section className="studio__intro">
            <div>
              <span className="studio__index">Record 01 / 2025–26</span>
              <h2>
                Adaeze N.
                <br />
                Okonkwo
              </h2>
            </div>
            <div className="studio__details">
              <p>BSc Software Engineering</p>
              <dl>
                <div>
                  <dt>Level</dt>
                  <dd>500</dd>
                </div>
                <div>
                  <dt>CGPA</dt>
                  <dd>4.25</dd>
                </div>
                <div>
                  <dt>Units</dt>
                  <dd>21</dd>
                </div>
                <div>
                  <dt>Matric</dt>
                  <dd>CLU210118-042</dd>
                </div>
              </dl>
            </div>
          </section>

          <div className="studio__grid">
            <section className="studio__record">
              <header>
                <span>Term index</span>
                <span>Status</span>
              </header>
              <div className="studio__row">
                <i>01</i>
                <div>
                  <b>Tuition and fees</b>
                  <p>2025/2026 · First semester</p>
                </div>
                <strong>Cleared</strong>
              </div>
              <div className="studio__row">
                <i>02</i>
                <div>
                  <b>Course registration</b>
                  <p>21 units across 7 courses</p>
                </div>
                <strong className="is-pending">Pending</strong>
              </div>
              <div className="studio__row">
                <i>03</i>
                <div>
                  <b>Attendance</b>
                  <p>Across all registered courses</p>
                </div>
                <strong>85%</strong>
              </div>
              <div className="studio__row">
                <i>04</i>
                <div>
                  <b>Next class</b>
                  <p>SWE 505 · Advanced Algorithms</p>
                </div>
                <strong>10:00</strong>
              </div>
            </section>

            <aside className="studio__side">
              <div className="studio__fees">
                <span>Account balance</span>
                <strong>₦0</strong>
                <p>Paid in full on 13 October 2025</p>
                <span className="studio__link">
                  View statement <ArrowUpRight />
                </span>
              </div>
              <div className="studio__course">
                <span>Course to prepare for</span>
                <b>SWE 505</b>
                <p>Advanced Algorithms</p>
                <small>10:00 · Computing Lab 2</small>
              </div>
            </aside>
          </div>

          <footer className="studio__foot">
            <span>Today</span>
            <b>Two classes · 4 contact hours</b>
            <span className="studio__footlink">
              Full timetable <ArrowUpRight />
            </span>
          </footer>
        </main>
      </div>
    </div>
  );
}

function DesignBoard({ id }: { id: DirectionId }) {
  switch (id) {
    case "quad":
      return <QuadBoard />;
    case "bulletin":
      return <BulletinBoard />;
    case "evening":
      return <EveningBoard />;
    case "studio":
      return <StudioBoard />;
    default:
      return <RegisterBoard />;
  }
}

export default function DesignLab({ initial }: { initial?: string }) {
  const validInitial = DIRECTIONS.some((direction) => direction.id === initial)
    ? (initial as DirectionId)
    : "quad";
  const [active, setActive] = useState<DirectionId>(validInitial);
  const [device, setDevice] = useState<"desktop" | "phone">("desktop");
  const direction = DIRECTIONS.find((item) => item.id === active) ?? DIRECTIONS[0];

  useEffect(() => {
    // The alternate faces live in the design boards, so load them while the
    // gallery is in view instead of flashing a fallback on the first tab click.
    document.fonts?.load('400 16px "DM Sans"');
    document.fonts?.load('500 16px "DM Sans"');
    document.fonts?.load('400 16px "Newsreader"');
  }, []);

  return (
    <div className="lab">
      <header className="lab__top">
        <a className="lab__brand" href="#/dashboard" aria-label="Back to the portal">
          <span className="lab__seal">CLU</span>
          <span>
            <b>Chrisland University</b>
            <small>Portal design study</small>
          </span>
        </a>
        <div className="lab__topmeta">
          <span>Five directions</span>
          <span>10 November 2026</span>
        </div>
      </header>

      <main className="lab__main">
        <header className="lab__intro">
          <div>
            <div className="lab__kicker">Student and staff portal / visual direction</div>
            <h1>Five ways to make the portal feel like Chrisland.</h1>
            <p>
              The same records, fees and timetable, seen through five different design
              languages. <b>The Quad is now applied across every student and staff screen.</b>{" "}
              The other four boards remain here as the record of what was considered.
            </p>
          </div>
          <div className="lab__aside">
            <span className="lab__asideLabel">How to read these</span>
            <p>
              The full student overview is shown at working size. Switch to phone to see the
              compact layout. The live portal now uses the same open navigation, solid plum
              fields and warm record paper as direction 02.
            </p>
            <div className="lab__device" aria-label="Preview size">
              <button
                className={cx(device === "desktop" && "is-active")}
                onClick={() => setDevice("desktop")}
                type="button"
              >
                Desktop
              </button>
              <button
                className={cx(device === "phone" && "is-active")}
                onClick={() => setDevice("phone")}
                type="button"
              >
                Phone
              </button>
            </div>
          </div>
        </header>

        <section className="lab__workspace">
          <aside className="lab__index" aria-label="Design directions">
            <div className="lab__indexHead">Directions</div>
            {DIRECTIONS.map((item) => (
              <button
                key={item.id}
                className={cx("lab__tab", item.id === active && "is-active")}
                onClick={() => setActive(item.id)}
                type="button"
                aria-pressed={item.id === active}
              >
                <span className="lab__tabNum">{item.number}</span>
                <span className="lab__tabCopy">
                  <b>{item.name}</b>
                  <small>{item.character}</small>
                </span>
                {item.id === "quad" && <span className="lab__shipTag">Shipped</span>}
              </button>
            ))}
            <p className="lab__credit">
              Direction study informed by{" "}
              <a href="https://github.com/heydamir/unslop" target="_blank" rel="noreferrer">
                unslop
              </a>{" "}
              by Damir Sokolovsky.
            </p>
          </aside>

          <div className="lab__view">
            <div className="lab__bar">
              <div>
                <span className="lab__barnum">{direction.number}</span>
                <span className="lab__barname">{direction.name}</span>
              </div>
              <span className="lab__barworld">{direction.world}</span>
            </div>

            <div className={cx("lab__stage", device === "phone" && "is-phone")}>
              <DesignBoard id={active} />
            </div>

            <div className="lab__notes">
              <div className="lab__swatches">
                <span>Palette</span>
                <div>
                  {direction.palette.map((colour) => (
                    <i key={colour} style={{ background: colour }} title={colour} />
                  ))}
                </div>
              </div>
              <div className="lab__signature">
                <span>Signature</span>
                <p>{direction.build}</p>
              </div>
              {active === "quad" ? (
                <a className="lab__choose" href="#/dashboard">
                  Open the live portal <ArrowUpRight size={14} />
                </a>
              ) : (
                <span className="lab__notShipped">Study only · The Quad is live</span>
              )}
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
