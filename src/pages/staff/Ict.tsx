import { useMemo, useState } from "react";
import {
  AlertTriangle,
  ChevronRight,
  Download,
  HardDrive,
  ScrollText,
  ServerCog,
  ShieldCheck,
  UserX,
  Users,
} from "lucide-react";
import {
  auditLog,
  ictKpis,
  services,
  systemUsers,
  type SystemUser,
} from "../../staffData";
import {
  Button,
  Card,
  CardHead,
  CardLink,
  Empty,
  Kpi,
  Pill,
  SearchField,
  WorkspaceHero,
  cx,
  useToast,
} from "../../components/ui";
import { saveCsv } from "../../download";
import { useNav } from "../../nav";

export function IctOverview() {
  const toast = useToast();
  const { go } = useNav();

  const exportReport = () => {
    const filename = "clu-ict-system-report.csv";
    saveCsv(filename, [
      ["Chrisland University — ICT system report"],
      ["Generated", new Date().toLocaleString("en-GB")],
      [],
      ["Metric", "Value"],
      ["Uptime (%)", ictKpis.uptime],
      ["Active sessions", ictKpis.activeSessions],
      ["Failed logins (24h)", ictKpis.failedLogins],
      ["Storage used (%)", ictKpis.storage],
      [],
      ["Service", "Status", "Latency"],
      ...services.map((s) => [s.name, s.status, s.latency]),
    ]);
    toast(`Downloaded ${filename}.`);
  };

  return (
    <>
      <WorkspaceHero
        eyebrow="Systems workspace · 2025/2026"
        title="ICT overview"
        sub="Portal availability, active sessions and security signals right now."
        mark={<ServerCog />}
        actions={
          <Button variant="heroSolid" onClick={exportReport}>
            <Download /> Export report
          </Button>
        }
      />

      <div className="bento">
        <div className="statgrid s12">
          <Kpi icon={<ServerCog />} label="Uptime" value={`${ictKpis.uptime}%`} meta="Last 30 days" tone="green" />
          <Kpi icon={<Users />} label="Active sessions" value={ictKpis.activeSessions.toLocaleString("en-NG")} meta="Staff and students" />
          <Kpi icon={<AlertTriangle />} label="Failed logins" value={ictKpis.failedLogins} meta="Throttled in the last hour" tone="rose" />
          <Kpi icon={<HardDrive />} label="Storage used" value={`${ictKpis.storage}%`} meta="of 2 TB portal database" />
        </div>

        <Card className="s7">
          <CardHead title="Service health" sub="Checked every 30 seconds" icon={<ServerCog />} />
          <div className="rows">
            {services.map((service) => (
              <div className="rowitem" key={service.name}>
                <div className="rowitem__main">
                  <div className="rowitem__title">{service.name}</div>
                  <div className="rowitem__meta">Latency {service.latency}</div>
                </div>
                <div className="rowitem__side">
                  <Pill tone={service.status === "Operational" ? "green" : "amber"} dot>
                    {service.status}
                  </Pill>
                </div>
              </div>
            ))}
          </div>
        </Card>

        <Card className="s5">
          <CardHead title="Security signals" sub="Last 24 hours" icon={<ShieldCheck />} />
          <div className="card__bd">
            <div className="signals">
              <div className="signal">
                <span className="signal__icon">
                  <AlertTriangle />
                </span>
                <div className="signal__body">
                  <div className="signal__title">{ictKpis.failedLogins} failed sign-ins</div>
                  <div className="signal__meta">Throttled in the last hour</div>
                </div>
                <Pill tone="amber" dot>
                  Monitor
                </Pill>
              </div>
              <div className="signal signal--red">
                <span className="signal__icon">
                  <UserX />
                </span>
                <div className="signal__body">
                  <div className="signal__title">1 account suspended</div>
                  <div className="signal__meta">Pending a security review</div>
                </div>
                <Pill tone="red" dot>
                  Suspended
                </Pill>
              </div>
              <div className="signal signal--green">
                <span className="signal__icon">
                  <ShieldCheck />
                </span>
                <div className="signal__body">
                  <div className="signal__title">Nightly backup verified</div>
                  <div className="signal__meta">4.2 GB · no data exfiltration detected</div>
                </div>
                <Pill tone="green" dot>
                  Secure
                </Pill>
              </div>
            </div>
            <div className="alert alert--ok" style={{ marginTop: 12 }}>
              <ShieldCheck />
              <span>Backups completed last night — 4.2 GB, verified.</span>
            </div>
          </div>
        </Card>

        <Card className="s12" flush>
          <CardHead
            title="Recent audit activity"
            sub="Every privileged action is recorded"
            icon={<ScrollText />}
            action={
              <CardLink onClick={() => go("ict/audit")}>
                Open log <ChevronRight />
              </CardLink>
            }
          />
          <div className="tablewrap">
            <table className="table table--stack table--compact">
              <thead>
                <tr>
                  <th>Time</th>
                  <th>Actor</th>
                  <th>Action</th>
                  <th>Target</th>
                </tr>
              </thead>
              <tbody>
                {auditLog.slice(0, 4).map((entry) => (
                  <tr key={entry.id}>
                    <td data-label="Time" className="nowrap mono">
                      {entry.time}
                    </td>
                    <td data-label="Actor">{entry.actor}</td>
                    <td data-label="Action">{entry.action}</td>
                    <td data-label="Target" className="tiny muted">
                      {entry.target}
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

export function IctUsers() {
  const toast = useToast();
  const [users, setUsers] = useState<SystemUser[]>(systemUsers);
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<"All" | "Students" | "Staff">("All");

  const rows = useMemo(() => {
    const q = query.trim().toLowerCase();
    return users.filter((user) => {
      const matchesFilter =
        filter === "All" ||
        (filter === "Students" && user.role === "Student") ||
        (filter === "Staff" && user.role !== "Student");
      const matchesQuery =
        !q ||
        user.name.toLowerCase().includes(q) ||
        user.email.toLowerCase().includes(q) ||
        user.role.toLowerCase().includes(q);
      return matchesFilter && matchesQuery;
    });
  }, [users, query, filter]);

  const toggle = (user: SystemUser) => {
    const next = user.status === "Active" ? "Suspended" : "Active";
    setUsers((list) =>
      list.map((u) => (u.id === user.id ? { ...u, status: next as SystemUser["status"] } : u))
    );
    toast(`${user.name} is now ${next.toLowerCase()}.`);
  };

  const exportUsers = () => {
    const filename = "clu-user-accounts.csv";
    saveCsv(filename, [
      ["Chrisland University — portal accounts"],
      ["Filter", filter],
      ["Generated", new Date().toLocaleString("en-GB")],
      [],
      ["Name", "Email", "Role", "Status", "Last login"],
      ...rows.map((u) => [u.name, u.email, u.role, u.status, u.lastLogin]),
    ]);
    toast(`Downloaded ${filename} — ${rows.length} accounts.`);
  };

  return (
    <>
      <div className="page__head">
        <div>
          <div className="eyebrow">Systems</div>
          <h1 className="page__title">User accounts</h1>
          <p className="page__sub">
            Provision, suspend and reset portal accounts. Changes are written to the audit log.
          </p>
        </div>
        <div className="page__actions">
          <Button onClick={exportUsers}>
            <Download /> Export accounts
          </Button>
        </div>
      </div>

      <Card flush>
        <div className="card__hd card__hd--filters">
          <SearchField
            value={query}
            onChange={setQuery}
            placeholder="Search name, email or role"
            label="Search accounts"
          />
          <div className="seg">
            {(["All", "Students", "Staff"] as const).map((f) => (
              <button
                key={f}
                className={cx("seg__btn", filter === f && "is-active")}
                onClick={() => setFilter(f)}
              >
                {f}
              </button>
            ))}
          </div>
          <span className="toolbar__count">
            <b>{rows.length}</b> accounts
          </span>
        </div>

        {rows.length === 0 ? (
          <Empty
            icon={<Users />}
            title="No accounts match"
            body="Adjust the search or filter."
            action={
              <Button
                size="sm"
                onClick={() => {
                  setQuery("");
                  setFilter("All");
                }}
              >
                Clear filters
              </Button>
            }
          />
        ) : (
          <div className="tablewrap">
            <table className="table table--stack">
              <thead>
                <tr>
                  <th>Account</th>
                  <th>Role</th>
                  <th>Last login</th>
                  <th className="t-right">Status</th>
                  <th className="t-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((user) => (
                  <tr key={user.id}>
                    <td data-label="Account">
                      <div className="table__strong">{user.name}</div>
                      <div className="table__sub">{user.email}</div>
                    </td>
                    <td data-label="Role">{user.role}</td>
                    <td data-label="Last login" className="nowrap">
                      {user.lastLogin}
                    </td>
                    <td data-label="Status" className="t-right">
                      <Pill tone={user.status === "Active" ? "green" : "red"} dot>
                        {user.status}
                      </Pill>
                    </td>
                    <td data-label="Actions" className="t-right">
                      <span className="rowactions">
                        <button
                          className={cx(
                            "rowbtn",
                            user.status === "Active" ? "rowbtn--danger" : "rowbtn--ok"
                          )}
                          onClick={() => toggle(user)}
                        >
                          {user.status === "Active" ? "Suspend" : "Activate"}
                        </button>
                        <button
                          className="rowbtn rowbtn--muted"
                          onClick={() => toast(`Password reset link sent to ${user.email}.`)}
                        >
                          Reset
                        </button>
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        <div className="unitbar">
          <div className="unitbar__num">
            <b>{rows.length}</b> accounts shown
          </div>
        </div>
      </Card>
    </>
  );
}

export function IctAudit() {
  const toast = useToast();

  const exportAudit = () => {
    const filename = "clu-audit-log.csv";
    saveCsv(filename, [
      ["Chrisland University — audit log"],
      ["Generated", new Date().toLocaleString("en-GB")],
      [],
      ["Time", "Actor", "Action", "Target", "IP address"],
      ...auditLog.map((entry) => [entry.time, entry.actor, entry.action, entry.target, entry.ip]),
    ]);
    toast(`Downloaded ${filename} — ${auditLog.length} entries.`);
  };

  return (
    <>
      <div className="page__head">
        <div>
          <div className="eyebrow">Systems</div>
          <h1 className="page__title">Audit log</h1>
          <p className="page__sub">
            Immutable record of privileged actions across the portal.
          </p>
        </div>
        <div className="page__actions">
          <Button onClick={exportAudit}>
            <Download /> Export log
          </Button>
        </div>
      </div>

      <Card flush>
        <CardHead
          title="Audit trail"
          sub="Newest first · every privileged action"
          icon={<ScrollText />}
          action={<Pill tone="outline">Append-only</Pill>}
        />
        <div className="tablewrap">
          <table className="table table--stack">
            <thead>
              <tr>
                <th>Time</th>
                <th>Actor</th>
                <th>Action</th>
                <th>Target</th>
                <th>IP</th>
              </tr>
            </thead>
            <tbody>
              {auditLog.map((entry) => (
                <tr key={entry.id}>
                  <td data-label="Time" className="nowrap mono">
                    {entry.time}
                  </td>
                  <td data-label="Actor">
                    <span className="table__strong">{entry.actor}</span>
                  </td>
                  <td data-label="Action">{entry.action}</td>
                  <td data-label="Target" className="tiny muted">
                    {entry.target}
                  </td>
                  <td data-label="IP" className="tiny muted tnum mono">
                    {entry.ip}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="unitbar">
          <div className="unitbar__num">
            <b>{auditLog.length}</b> entries · immutable record
          </div>
        </div>
      </Card>
    </>
  );
}
