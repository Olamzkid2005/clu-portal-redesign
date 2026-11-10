import { useCallback, useEffect, useState, type ReactNode } from "react";
import { NavContext } from "./nav";
import { ToastProvider } from "./components/ui";
import Shell, { pageTitles } from "./components/Shell";
import { ROLE_META, useRole } from "./roles";
import Dashboard from "./pages/Dashboard";
import SignIn from "./pages/SignIn";
import ProfilePage from "./pages/Profile";
import DesignLab from "./pages/Designs";
import { CoursesPage, ResultsPage } from "./pages/Academic";
import { AssignmentsPage, AttendancePage, EvaluationPage, TimetablePage } from "./pages/Study";
import { AccommodationPage, PaymentsPage } from "./pages/Money";
import { FeedbackPage, MedicalsPage, RequestsPage, SettingsPage } from "./pages/Services";
import { LecturerAttendance, LecturerCourses, LecturerOverview } from "./pages/staff/Lecturer";
import { BursarFees, BursarLedger, BursarOverview } from "./pages/staff/Bursar";
import { IctAudit, IctOverview, IctUsers } from "./pages/staff/Ict";
import { ExecutiveApprovals, ExecutiveOverview } from "./pages/staff/Executive";
import { RegistrarQueue } from "./pages/staff/Registrar";
import type { RequestKey } from "./data";

const STAFF_BASES = ["lecturer", "bursar", "ict", "vc", "registrar"];

const readRoute = () => window.location.hash.replace(/^#\/?/, "") || "dashboard";

export default function App() {
  const { role, signedIn } = useRole();
  const [route, setRoute] = useState(readRoute);

  useEffect(() => {
    const onHash = () => setRoute(readRoute());
    window.addEventListener("hashchange", onHash);
    return () => window.removeEventListener("hashchange", onHash);
  }, []);

  const go = useCallback((path: string) => {
    if (window.location.hash !== `#/${path}`) window.location.hash = `#/${path}`;
    setRoute(path);
  }, []);

  const [requestedBase, param] = route.split("/");
  const showingDesignLab = requestedBase === "designs";
  const allowed =
    showingDesignLab ||
    (role === "student" ? !STAFF_BASES.includes(requestedBase) : requestedBase === role);

  useEffect(() => {
    if (signedIn && !showingDesignLab && !allowed) go(ROLE_META[role].home);
  }, [signedIn, allowed, showingDesignLab, role, go]);

  useEffect(() => {
    if (!signedIn && window.location.hash !== "#/signin") {
      window.history.replaceState(null, "", "#/signin");
    }
  }, [signedIn, route]);

  const base = allowed ? requestedBase : ROLE_META[role].home;
  const section = allowed ? param : undefined;

  useEffect(() => {
    window.scrollTo(0, 0);
    document.querySelector<HTMLElement>(".page")?.scrollTo(0, 0);
    const key = allowed ? route : base;
    document.title = !signedIn
      ? "Sign in · CLU Portal"
      : showingDesignLab
        ? "Five directions · CLU Portal"
        : `${pageTitles[key] ?? pageTitles[base] ?? "Portal"} · CLU Portal`;
  }, [route, base, allowed, showingDesignLab, signedIn]);

  let page: ReactNode;
  switch (base) {
    case "timetable":
      page = <TimetablePage />;
      break;
    case "courses":
      page = <CoursesPage />;
      break;
    case "results":
      page = <ResultsPage />;
      break;
    case "assignments":
      page = <AssignmentsPage />;
      break;
    case "attendance":
      page = <AttendancePage />;
      break;
    case "payments":
      page = <PaymentsPage />;
      break;
    case "accommodation":
      page = <AccommodationPage />;
      break;
    case "requests":
      page = <RequestsPage type={((section as RequestKey) || "transcript") as RequestKey} />;
      break;
    case "evaluation":
      page = <EvaluationPage />;
      break;
    case "medicals":
      page = <MedicalsPage />;
      break;
    case "feedback":
      page = <FeedbackPage />;
      break;
    case "profile":
      page = <ProfilePage />;
      break;
    case "settings":
      page = <SettingsPage />;
      break;
    case "lecturer":
      page =
        section === "courses" ? (
          <LecturerCourses />
        ) : section === "attendance" ? (
          <LecturerAttendance />
        ) : (
          <LecturerOverview />
        );
      break;
    case "bursar":
      page =
        section === "ledger" ? (
          <BursarLedger />
        ) : section === "fees" ? (
          <BursarFees />
        ) : (
          <BursarOverview />
        );
      break;
    case "ict":
      page =
        section === "users" ? (
          <IctUsers />
        ) : section === "audit" ? (
          <IctAudit />
        ) : (
          <IctOverview />
        );
      break;
    case "vc":
      page = section === "approvals" ? <ExecutiveApprovals /> : <ExecutiveOverview />;
      break;
    case "registrar":
      page = <RegistrarQueue />;
      break;
    default:
      page = <Dashboard />;
  }

  if (!signedIn) {
    return <SignIn />;
  }

  if (showingDesignLab) {
    return <DesignLab initial={param} />;
  }

  return (
    <ToastProvider>
      <NavContext.Provider value={{ route, go }}>
        <Shell>
          <main className="page">
            {page}
            <footer className="foot">
              <span>
                © 2026 Chrisland University · {ROLE_META[role].label} portal
              </span>
              {role === "student" ? (
                <span className="foot__links">
                  <button onClick={() => go("feedback")}>Give feedback</button>
                  <button onClick={() => go("medicals")}>Health centre</button>
                  <button onClick={() => go("settings")}>Security</button>
                </span>
              ) : (
                <span className="foot__links">
                  <button onClick={() => go("settings")}>Security</button>
                </span>
              )}
            </footer>
          </main>
        </Shell>
      </NavContext.Provider>
    </ToastProvider>
  );
}
