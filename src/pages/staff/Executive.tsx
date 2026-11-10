import { useMemo, useState } from "react";
import {
  Building2,
  Check,
  Download,
  GraduationCap,
  ShieldCheck,
  TrendingUp,
  Users,
  Wallet,
  X,
} from "lucide-react";
import {
  approvals as seedApprovals,
  faculties,
  institutionalKpis,
  type Approval,
} from "../../staffData";
import { naira } from "../../data";
import {
  Button,
  Card,
  CardHead,
  Empty,
  Kpi,
  Pill,
  Ring,
  WorkspaceHero,
  cx,
  useToast,
} from "../../components/ui";
import { saveCsv } from "../../download";

export function ExecutiveOverview() {
  const toast = useToast();
  const [accredited, programmes] = institutionalKpis.accreditation
    .split("/")
    .map((part) => Number(part.trim()));

  const exportReport = () => {
    const filename = "clu-institutional-report.csv";
    saveCsv(filename, [
      ["Chrisland University — institutional report"],
      ["Session", "2025/2026"],
      ["Generated", new Date().toLocaleString("en-GB")],
      [],
      ["Metric", "Value"],
      ["Students enrolled", institutionalKpis.students],
      ["Academic staff", institutionalKpis.staff],
      ["Revenue (NGN)", institutionalKpis.revenue],
      ["Average CGPA", institutionalKpis.avgCgpa],
      ["Accreditation", institutionalKpis.accreditation],
      ["Retention (%)", institutionalKpis.retention],
      [],
      ["Faculty", "Students", "Average CGPA", "Retention (%)"],
      ...faculties.map((f) => [f.name, f.students, f.cgpa, f.retention]),
    ]);
    toast(`Downloaded ${filename}.`);
  };

  return (
    <>
      <WorkspaceHero
        eyebrow="Executive workspace · 2025/2026"
        title="Institution overview"
        sub="Intake, quality, finance and accreditation readiness."
        mark={<Building2 />}
        actions={
          <Button variant="heroSolid" onClick={exportReport}>
            <Download /> Export report
          </Button>
        }
      />

      <div className="bento">
        <div className="statgrid s12">
          <Kpi icon={<Users />} label="Students" value={institutionalKpis.students.toLocaleString("en-NG")} meta="Across five faculties" />
          <Kpi icon={<GraduationCap />} label="Academic staff" value={institutionalKpis.staff} meta="1 : 12 staff-student ratio" />
          <Kpi icon={<Wallet />} label="Revenue" value={`₦${(institutionalKpis.revenue / 1_000_000_000).toFixed(2)}b`} meta="Session to date" tone="green" />
          <Kpi icon={<TrendingUp />} label="Average CGPA" value={institutionalKpis.avgCgpa.toFixed(2)} meta="All levels" tone="blue" />
        </div>

        <Card className="s7">
          <CardHead title="Faculty performance" sub="Average CGPA and retention" icon={<GraduationCap />} />
          <div className="card__bd" style={{ display: "grid", gap: 14 }}>
            {faculties.map((faculty) => (
              <div className="facrow" key={faculty.name}>
                <div className="facrow__head">
                  <span className="facrow__name">{faculty.name}</span>
                  <span className="facrow__meta">
                    <b>{faculty.cgpa.toFixed(2)}</b> CGPA · <b>{faculty.retention}%</b> retention
                  </span>
                </div>
                <div className="progress">
                  <div
                    className="progress__bar"
                    style={{ width: `${(faculty.cgpa / 5) * 100}%` }}
                  />
                </div>
                <div className="tiny muted">
                  {faculty.students.toLocaleString("en-NG")} students
                </div>
              </div>
            ))}
          </div>
        </Card>

        <div className="s5 stack">
          <Card>
            <CardHead
              title="Accreditation readiness"
              sub="NUC programmes"
              icon={<ShieldCheck />}
              action={<Pill tone="green" dot>Accredited</Pill>}
            />
            <div className="card__bd">
              <div className="ringrow">
                <Ring
                  value={accredited}
                  max={programmes}
                  label="accredited"
                  text={institutionalKpis.accreditation.replace(/\s/g, "")}
                  size={112}
                />
                <div className="ringrow__body">
                  <div className="tiny muted">Programmes current</div>
                  <div className="ringrow__amount">8 of 8</div>
                  <div className="tiny muted">
                    All programmes have current accreditation. Next visitation is March 2026.
                  </div>
                </div>
              </div>
            </div>
          </Card>

          <Card>
            <CardHead
              title="Retention"
              sub="Cohort returning this session"
              icon={<TrendingUp />}
              action={<Pill tone="brand">+2.1 pts</Pill>}
            />
            <div className="card__bd">
              <div className="ringrow">
                <Ring
                  value={institutionalKpis.retention}
                  label="retained"
                  text={`${institutionalKpis.retention}%`}
                  size={112}
                />
                <div className="ringrow__body">
                  <div className="tiny muted">University target</div>
                  <div className="ringrow__amount">95%</div>
                  <div className="tiny muted">
                    Highest in Engineering (91%) still below the university target.
                  </div>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </>
  );
}

export function ExecutiveApprovals() {
  const toast = useToast();
  const [rows, setRows] = useState<Approval[]>(seedApprovals);
  const [filter, setFilter] = useState<"All" | "Pending" | "Decided">("Pending");

  const visible = useMemo(
    () =>
      rows.filter((row) =>
        filter === "All"
          ? true
          : filter === "Pending"
          ? row.status === "Pending"
          : row.status !== "Pending"
      ),
    [rows, filter]
  );

  const decide = (row: Approval, decision: "Approved" | "Rejected") => {
    setRows((list) =>
      list.map((item) => (item.id === row.id ? { ...item, status: decision } : item))
    );
    toast(`${row.title} — ${decision.toLowerCase()}.`);
  };

  const exportRows = () => {
    const filename = "clu-approvals.csv";
    saveCsv(filename, [
      ["Chrisland University — executive approvals"],
      ["Filter", filter],
      ["Generated", new Date().toLocaleString("en-GB")],
      [],
      ["Title", "Type", "Submitted by", "Date", "Amount (NGN)", "Status"],
      ...visible.map((row) => [
        row.title,
        row.type,
        row.submittedBy,
        row.date,
        row.amount ?? "",
        row.status,
      ]),
    ]);
    toast(`Downloaded ${filename} — ${visible.length} items.`);
  };

  const tone = (status: Approval["status"]): "green" | "red" | "amber" =>
    status === "Approved" ? "green" : status === "Rejected" ? "red" : "amber";

  return (
    <>
      <div className="page__head">
        <div>
          <div className="eyebrow">Executive</div>
          <h1 className="page__title">Approvals</h1>
          <p className="page__sub">
            Items awaiting the Vice Chancellor's decision. Every action is recorded.
          </p>
        </div>
        <div className="page__actions">
          <Button onClick={exportRows}>
            <Download /> Export list
          </Button>
        </div>
      </div>

      <Card flush>
        <div className="card__hd card__hd--filters">
          <div className="seg">
            {(["Pending", "Decided", "All"] as const).map((f) => (
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
            <b>{rows.filter((r) => r.status === "Pending").length}</b> awaiting decision
          </span>
        </div>

        {visible.length === 0 ? (
          <Empty
            icon={<Check />}
            title="Nothing awaiting you"
            body="All items in this view have been decided."
            action={
              <Button size="sm" onClick={() => setFilter("All")}>
                Show all items
              </Button>
            }
          />
        ) : (
          <div className="tablewrap">
            <table className="table table--stack">
              <thead>
                <tr>
                  <th>Item</th>
                  <th>Type</th>
                  <th>Submitted by</th>
                  <th className="t-right">Amount</th>
                  <th className="t-right">Status</th>
                  <th className="t-right">Decision</th>
                </tr>
              </thead>
              <tbody>
                {visible.map((row) => (
                  <tr key={row.id}>
                    <td data-label="Item">
                      <div className="table__strong">{row.title}</div>
                      <div className="table__sub">{row.date}</div>
                    </td>
                    <td data-label="Type">{row.type}</td>
                    <td data-label="Submitted by">{row.submittedBy}</td>
                    <td data-label="Amount" className="t-right tnum">
                      {row.amount ? naira(row.amount) : "—"}
                    </td>
                    <td data-label="Status" className="t-right">
                      <Pill tone={tone(row.status)} dot>
                        {row.status}
                      </Pill>
                    </td>
                    <td data-label="Decision" className="t-right">
                      {row.status === "Pending" ? (
                        <span className="cluster" style={{ justifyContent: "flex-end" }}>
                          <Button
                            size="sm"
                            variant="ok"
                            onClick={() => decide(row, "Approved")}
                          >
                            <Check /> Approve
                          </Button>
                          <Button
                            size="sm"
                            variant="danger"
                            onClick={() => decide(row, "Rejected")}
                          >
                            <X /> Reject
                          </Button>
                        </span>
                      ) : (
                        <span className="tiny muted">Recorded</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        <div className="unitbar">
          <div className="unitbar__num">
            <b>{visible.length}</b> items ·{" "}
            {rows.filter((row) => row.status === "Pending").length} awaiting decision
          </div>
        </div>
      </Card>
    </>
  );
}
