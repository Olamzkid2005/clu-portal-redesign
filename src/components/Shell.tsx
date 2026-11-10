import { useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import {
  BarChart3,
  BedDouble,
  Bell,
  BookOpen,
  Building2,
  CalendarDays,
  ChevronDown,
  ClipboardCheck,
  ClipboardList,
  CreditCard,
  FileCheck2,
  FileText,
  GraduationCap,
  HeartPulse,
  Landmark,
  LayoutDashboard,
  LogOut,
  Megaphone,
  Menu,
  MessageSquareText,
  Moon,
  ReceiptText,
  ScrollText,
  Search,
  ServerCog,
  Settings as SettingsIcon,
  Sun,
  User,
  UserCheck,
  Users,
  Wallet,
  X,
} from "lucide-react";
import { useNav } from "../nav";
import { assignments, notifications as seedNotifications, student } from "../data";
import { ROLE_META, useRole, type Role, type RoleMeta } from "../roles";
import { Avatar } from "./Avatar";
import { cx } from "./ui";

interface NavItem {
  id: string;
  label: string;
  short?: string;
  icon: ReactNode;
  badge?: number;
  children?: { id: string; label: string }[];
}

interface NavGroup {
  label: string;
  items: NavItem[];
}

const studentGroups: NavGroup[] = [
  {
    label: "Study",
    items: [
      { id: "dashboard", label: "Overview", icon: <LayoutDashboard /> },
      { id: "timetable", label: "Timetable", icon: <CalendarDays /> },
      { id: "courses", label: "Course registration", icon: <BookOpen /> },
      { id: "results", label: "Results", icon: <BarChart3 /> },
      { id: "assignments", label: "Assignments", icon: <ClipboardList /> },
      { id: "attendance", label: "Attendance", icon: <UserCheck /> },
    ],
  },
  {
    label: "Money & campus",
    items: [
      { id: "payments", label: "Payments", icon: <CreditCard /> },
      { id: "accommodation", label: "Accommodation", icon: <BedDouble /> },
    ],
  },
  {
    label: "Services",
    items: [
      {
        id: "requests",
        label: "Requests",
        icon: <FileText />,
        children: [
          { id: "requests/transcript", label: "Transcript" },
          { id: "requests/proficiency", label: "English proficiency" },
          { id: "requests/verification", label: "Certificate verification" },
        ],
      },
      { id: "evaluation", label: "Course evaluation", icon: <MessageSquareText /> },
      { id: "medicals", label: "Medicals", icon: <HeartPulse /> },
      { id: "feedback", label: "Student feedback", icon: <Megaphone /> },
    ],
  },
  {
    label: "Account",
    items: [
      { id: "profile", label: "Profile", icon: <User /> },
      { id: "settings", label: "Settings", icon: <SettingsIcon /> },
    ],
  },
];

const staffGroups: Record<Exclude<Role, "student">, NavGroup[]> = {
  lecturer: [
    {
      label: "Teaching",
      items: [
        { id: "lecturer", label: "Overview", icon: <GraduationCap /> },
        { id: "lecturer/courses", label: "My courses", short: "Courses", icon: <BookOpen /> },
        { id: "lecturer/attendance", label: "Attendance", icon: <UserCheck /> },
      ],
    },
  ],
  bursar: [
    {
      label: "Finance",
      items: [
        { id: "bursar", label: "Overview", icon: <Wallet /> },
        { id: "bursar/ledger", label: "Payments ledger", short: "Ledger", icon: <ReceiptText /> },
        { id: "bursar/fees", label: "Fee schedule", short: "Fees", icon: <Landmark /> },
      ],
    },
  ],
  ict: [
    {
      label: "Systems",
      items: [
        { id: "ict", label: "Overview", icon: <ServerCog /> },
        { id: "ict/users", label: "User accounts", short: "Users", icon: <Users /> },
        { id: "ict/audit", label: "Audit log", short: "Audit", icon: <ScrollText /> },
      ],
    },
  ],
  vc: [
    {
      label: "Executive",
      items: [
        { id: "vc", label: "Institution overview", icon: <Building2 /> },
        { id: "vc/approvals", label: "Approvals", icon: <ClipboardCheck /> },
      ],
    },
  ],
  registrar: [
    {
      label: "Registry",
      items: [{ id: "registrar", label: "Request queue", short: "Queue", icon: <FileCheck2 /> }],
    },
  ],
};

export const pageTitles: Record<string, string> = {
  dashboard: "Overview",
  timetable: "Timetable",
  courses: "Course registration",
  results: "Results",
  assignments: "Assignments",
  attendance: "Attendance",
  payments: "Payments",
  accommodation: "Accommodation",
  requests: "Requests",
  evaluation: "Course evaluation",
  medicals: "Medicals",
  feedback: "Student feedback",
  profile: "Profile",
  settings: "Settings",
  lecturer: "Teaching overview",
  "lecturer/courses": "My courses",
  "lecturer/attendance": "Attendance",
  bursar: "Finance overview",
  "bursar/ledger": "Payments ledger",
  "bursar/fees": "Fee schedule",
  ict: "Systems overview",
  "ict/users": "User accounts",
  "ict/audit": "Audit log",
  vc: "Institution overview",
  "vc/approvals": "Approvals",
  registrar: "Request queue",
};

const isActive = (route: string, item: NavItem) =>
  route === item.id || (!!item.children && route.startsWith(item.id + "/"));

function DrawerNav({
  groups,
  route,
  go,
  meta,
  role,
  theme,
  onToggleTheme,
  onSignOut,
  onClose,
}: {
  groups: NavGroup[];
  route: string;
  go: (path: string) => void;
  meta: RoleMeta;
  role: Role;
  theme: string;
  onToggleTheme: () => void;
  onSignOut: () => void;
  onClose: () => void;
}) {
  const pending = assignments.filter(
    (a) => a.status === "pending" || a.status === "overdue"
  ).length;

  return (
    <aside className="drawerpanel" onClick={(event) => event.stopPropagation()}>
      <div className="drawerpanel__head">
        <div className="drawerpanel__brand">
          <span className="quadbrand__mark">CLU</span>
          <span>
            <b>Chrisland University</b>
            <small>{role === "student" ? "Student portal" : "Staff portal"}</small>
          </span>
        </div>
        <button className="drawerpanel__close" onClick={onClose} aria-label="Close menu">
          <X />
        </button>
      </div>

      <div className="drawerpanel__identity">
        <Avatar name={meta.name} photo={meta.photo} size={38} />
        <div>
          <b>{meta.name}</b>
          <span>
            {meta.label} · {meta.detail}
          </span>
        </div>
      </div>

      <nav className="drawerpanel__nav" aria-label="Portal navigation">
        {groups.map((group) => (
          <div className="navgroup" key={group.label}>
            <div className="navgroup__label">{group.label}</div>
            {group.items.map((item) => {
              const active = isActive(route, item);
              return (
                <div key={item.id}>
                  <button
                    className={cx("drawerlink", active && "is-active")}
                    onClick={() => {
                      go(item.id);
                      onClose();
                    }}
                  >
                    {item.icon}
                    <span>{item.label}</span>
                    {role === "student" && item.id === "assignments" && pending > 0 && (
                      <span className="drawerlink__badge">{pending}</span>
                    )}
                  </button>
                  {item.children && active && (
                    <div className="drawerpanel__sub">
                      {item.children.map((child) => (
                        <button
                          key={child.id}
                          className={cx("drawerpanel__sublink", route === child.id && "is-active")}
                          onClick={() => {
                            go(child.id);
                            onClose();
                          }}
                        >
                          {child.label}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        ))}
      </nav>

      <div className="drawerpanel__foot">
        <div className="drawerpanel__accountnote">Signed in · {meta.label}</div>
        <div className="drawerpanel__actions">
          <button className="drawerpanel__action" onClick={onToggleTheme}>
            {theme === "dark" ? <Sun /> : <Moon />}
            {theme === "dark" ? "Light mode" : "Dark mode"}
          </button>
          <button className="drawerpanel__action" onClick={onSignOut}>
            <LogOut />
            Sign out
          </button>
        </div>
      </div>
    </aside>
  );
}

export default function Shell({ children }: { children: ReactNode }) {
  const { route, go } = useNav();
  const { role, signOut } = useRole();
  const meta = ROLE_META[role];
  const [drawer, setDrawer] = useState(false);
  const [menu, setMenu] = useState<null | "user" | "bell" | "search">(null);
  const [query, setQuery] = useState("");
  const [theme, setTheme] = useState(() => {
    const stored = typeof localStorage !== "undefined" ? localStorage.getItem("clu-theme") : null;
    return stored === "dark" ? "dark" : "light";
  });
  const [notes, setNotes] = useState(seedNotifications);
  const headerRef = useRef<HTMLElement>(null);
  const searchRef = useRef<HTMLInputElement>(null);

  const groups = role === "student" ? studentGroups : staffGroups[role];

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    localStorage.setItem("clu-theme", theme);
  }, [theme]);

  useEffect(() => {
    const onDown = (event: MouseEvent) => {
      if (!headerRef.current?.contains(event.target as Node)) setMenu(null);
    };
    document.addEventListener("mousedown", onDown);
    return () => document.removeEventListener("mousedown", onDown);
  }, []);

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setDrawer(false);
        setMenu(null);
      }
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        searchRef.current?.focus();
        searchRef.current?.select();
      }
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, []);

  useEffect(() => {
    if (!drawer) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previous;
    };
  }, [drawer]);

  useEffect(() => {
    setDrawer(false);
    setMenu(null);
    setQuery("");
  }, [route, role]);

  const flatNav = useMemo(
    () =>
      groups.flatMap((group) =>
        group.items.flatMap((item) => [
          { id: item.id, label: item.label, group: group.label },
          ...(item.children ?? []).map((child) => ({
            id: child.id,
            label: child.label,
            group: item.label,
          })),
        ])
      ),
    [groups]
  );

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return flatNav.slice(0, 7);
    return flatNav.filter((item) => item.label.toLowerCase().includes(q)).slice(0, 8);
  }, [flatNav, query]);

  const activeGroup =
    groups.find((group) => group.items.some((item) => isActive(route, item))) ?? groups[0];
  const unread = role === "student" ? notes.filter((note) => note.unread).length : 0;
  const toggleTheme = () => setTheme((current) => (current === "dark" ? "light" : "dark"));

  const handleSignOut = () => {
    signOut();
    window.history.replaceState(null, "", "#/signin");
    setMenu(null);
    setDrawer(false);
  };

  const mobileTabs =
    role === "student"
      ? [
          { id: "dashboard", label: "Overview", icon: <LayoutDashboard /> },
          { id: "timetable", label: "Timetable", icon: <CalendarDays /> },
          { id: "results", label: "Results", icon: <BarChart3 /> },
          { id: "payments", label: "Payments", icon: <CreditCard /> },
        ]
      : groups[0].items.slice(0, 4).map((item) => ({
          id: item.id,
          label: item.short ?? item.label.split(" ")[0],
          icon: item.icon,
        }));

  return (
    <div className="shell shell--quad">
      <div className="main">
        <header className="quadhead" ref={headerRef}>
          <div className="quadbar">
            <button className="quadbrand" onClick={() => go(meta.home)} aria-label="Portal home">
              <span className="quadbrand__mark">CLU</span>
              <span className="quadbrand__copy">
                <b>Chrisland University</b>
                <small>{role === "student" ? "Student portal" : "Staff portal"}</small>
              </span>
            </button>

            <nav className="quadnav" aria-label="Portal sections">
              {groups.map((group) => (
                <button
                  key={group.label}
                  className={cx("quadnav__tab", activeGroup.label === group.label && "is-active")}
                  onClick={() => go(group.items[0].id)}
                >
                  {group.label}
                </button>
              ))}
            </nav>

            <div className="quadbar__actions">
              <div className="search">
                <Search className="search__icon" />
                <input
                  ref={searchRef}
                  className="search__input"
                  placeholder="Search the portal"
                  value={query}
                  onChange={(event) => {
                    setQuery(event.target.value);
                    setMenu("search");
                  }}
                  onFocus={() => setMenu("search")}
                  aria-label="Search the portal"
                />
                {menu === "search" && (
                  <div className="search__panel">
                    {results.length === 0 && (
                      <div className="search__empty">No matches for “{query}”.</div>
                    )}
                    {results.map((result) => (
                      <button
                        key={result.id}
                        className="search__row"
                        onClick={() => {
                          go(result.id);
                          setQuery("");
                          setMenu(null);
                        }}
                      >
                        <Search size={14} />
                        {result.label}
                        <small>{result.group}</small>
                      </button>
                    ))}
                  </div>
                )}
              </div>

              <div className="quadbar__menu">
                <button
                  className="iconbtn"
                  onClick={() => setMenu(menu === "bell" ? null : "bell")}
                  aria-label="Notifications"
                  aria-expanded={menu === "bell"}
                >
                  <Bell />
                  {unread > 0 && <span className="iconbtn__dot" />}
                </button>
                {menu === "bell" && (
                  <div className="menupanel quadmenu">
                    <div className="menupanel__head quadmenu__head">
                      <div>Notifications</div>
                      {role === "student" && (
                        <button
                          className="rowbtn"
                          onClick={() =>
                            setNotes((items) => items.map((item) => ({ ...item, unread: false })))
                          }
                        >
                          Mark all read
                        </button>
                      )}
                    </div>
                    {role === "student" ? (
                      notes.map((note) => (
                        <div key={note.id} className="quadnotice">
                          <span
                            className="dot"
                            style={{
                              color: note.unread ? "var(--accent)" : "var(--line)",
                              marginTop: 6,
                              flex: "none",
                            }}
                          />
                          <div>
                            <div className="quadnotice__title">{note.title}</div>
                            <div className="tiny muted">{note.body}</div>
                            <div className="quadnotice__time">{note.time}</div>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="quadnotice">
                        <div>
                          <div className="small strong">{meta.label} workspace</div>
                          <div className="tiny muted">
                            Staff actions in this portal are recorded in the audit log.
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>

              <button
                className="iconbtn desktoponly"
                onClick={toggleTheme}
                aria-label="Toggle theme"
              >
                {theme === "dark" ? <Sun /> : <Moon />}
              </button>

              <div className="quadbar__menu">
                <button
                  className="user"
                  onClick={() => setMenu(menu === "user" ? null : "user")}
                  aria-label="Account menu"
                  aria-expanded={menu === "user"}
                >
                  <Avatar name={meta.name} photo={meta.photo} />
                  <span className="user__meta">
                    <span className="user__name">{meta.name}</span>
                    <span className="user__role">{meta.detail}</span>
                  </span>
                  <ChevronDown />
                </button>
                {menu === "user" && (
                  <div className="menupanel quadmenu">
                    <div className="menupanel__head">
                      <div>{meta.name}</div>
                      <div>{meta.label}</div>
                    </div>
                    {role === "student" && (
                      <>
                        <button
                          className="menupanel__item"
                          onClick={() => {
                            go("profile");
                            setMenu(null);
                          }}
                        >
                          <User /> Your profile
                        </button>
                        <button
                          className="menupanel__item"
                          onClick={() => {
                            go("settings");
                            setMenu(null);
                          }}
                        >
                          <SettingsIcon /> Settings
                        </button>
                      </>
                    )}
                    <div className="menupanel__section">
                      <button className="menupanel__item" onClick={handleSignOut}>
                        <LogOut /> Sign out
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          <nav className="quadsubnav" aria-label={activeGroup.label}>
            {activeGroup.items.map((item) => (
              <button
                key={item.id}
                className={cx("quadsubnav__link", isActive(route, item) && "is-active")}
                onClick={() => go(item.id)}
              >
                {item.label}
              </button>
            ))}
            <span className="quadsubnav__meta">
              {role === "student"
                ? `${student.session} · ${student.semester} semester`
                : meta.detail}
            </span>
          </nav>
        </header>

        <header className="mobilebar">
          <button className="iconbtn" onClick={() => setDrawer(true)} aria-label="Open menu">
            <Menu />
          </button>
          <div className="mobilebar__copy">
            <div className="mobilebar__brand">Chrisland University</div>
            <div className="mobilebar__sub">
              {role === "student" ? "Student portal" : `${meta.short} portal`}
            </div>
          </div>
          <button className="iconbtn" onClick={toggleTheme} aria-label="Toggle theme">
            {theme === "dark" ? <Sun /> : <Moon />}
          </button>
          <button
            className="mobilebar__me"
            onClick={() => setDrawer(true)}
            aria-label="Open account menu"
          >
            <Avatar name={meta.name} photo={meta.photo} size={28} />
          </button>
        </header>

        {children}

        <nav className="tabbar" aria-label="Primary">
          {mobileTabs.map((tab) => (
            <button
              key={tab.id}
              className={cx(
                "tabbar__item",
                (route === tab.id || route.startsWith(tab.id + "/")) && "is-active"
              )}
              onClick={() => go(tab.id)}
            >
              {tab.icon}
              {tab.label}
            </button>
          ))}
          <button className="tabbar__item" onClick={() => setDrawer(true)}>
            <Menu />
            More
          </button>
        </nav>
      </div>

      {drawer && (
        <div className="scrimdrawer" onClick={() => setDrawer(false)}>
          <DrawerNav
            groups={groups}
            route={route}
            go={go}
            meta={meta}
            role={role}
            theme={theme}
            onToggleTheme={toggleTheme}
            onSignOut={handleSignOut}
            onClose={() => setDrawer(false)}
          />
        </div>
      )}
    </div>
  );
}
