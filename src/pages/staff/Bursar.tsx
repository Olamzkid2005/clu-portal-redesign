import { useMemo, useState } from "react";
import {
  ChevronRight,
  Download,
  Landmark,
  ReceiptText,
  Scale,
  TrendingUp,
  Wallet,
} from "lucide-react";
import {
  bursarKpis,
  bursarMonthly,
  feeSchedule,
  ledger,
  type LedgerRow,
} from "../../staffData";
import { naira } from "../../data";
import {
  Button,
  Card,
  CardHead,
  CardLink,
  Empty,
  Kpi,
  Pill,
  Ring,
  SearchField,
  WorkspaceHero,
  cx,
  useToast,
} from "../../components/ui";
import { saveCsv } from "../../download";
import { useNav } from "../../nav";

const compact = (value: number) =>
  value >= 1_000_000_000
    ? `₦${(value / 1_000_000_000).toFixed(2)}b`
    : value >= 1_000_000
    ? `₦${(value / 1_000_000).toFixed(1)}m`
    : naira(value);

const statusTone = (status: LedgerRow["status"]): "green" | "amber" | "red" =>
  status === "Confirmed" ? "green" : status === "Pending" ? "amber" : "red";

export function BursarOverview() {
  const toast = useToast();
  const { go } = useNav();
  const recent = ledger.slice(0, 6);

  const exportSummary = () => {
    const filename = "clu-bursary-summary.csv";
    saveCsv(filename, [
      ["Chrisland University — bursary summary"],
      ["Session", "2025/2026"],
      ["Generated", new Date().toLocaleString("en-GB")],
      [],
      ["Metric", "Value"],
      ["Fees collected (NGN)", bursarKpis.collected],
      ["Outstanding (NGN)", bursarKpis.outstanding],
      ["Transactions", bursarKpis.transactions],
      ["Reconciliation (%)", bursarKpis.reconciliation],
    ]);
    toast(`Downloaded ${filename}.`);
  };

  return (
    <>
      <WorkspaceHero
        eyebrow="Finance workspace · 2025/2026"
        title="Bursary overview"
        sub="Student accounts, receipts and reconciliation."
        mark={<Landmark />}
        actions={
          <Button variant="heroSolid" onClick={exportSummary}>
            <Download /> Export summary
          </Button>
        }
      />

      <div className="bento">
        <div className="statgrid s12">
          <Kpi icon={<Wallet />} label="Collected" value={compact(bursarKpis.collected)} meta="Fees and services" tone="green" />
          <Kpi icon={<Scale />} label="Outstanding" value={compact(bursarKpis.outstanding)} meta="Across 214 students" tone="amber" />
          <Kpi icon={<ReceiptText />} label="Transactions" value={bursarKpis.transactions.toLocaleString("en-NG")} meta="This session" />
          <Kpi icon={<Landmark />} label="Reconciliation" value={`${bursarKpis.reconciliation}%`} meta="Bank vs ledger" tone="green" />
        </div>

        <Card className="s7">
          <CardHead
            title="Collections by month"
            sub="Percentage of monthly target collected"
            icon={<TrendingUp />}
            action={
              <CardLink onClick={() => go("bursar/ledger")}>
                View ledger <ChevronRight />
              </CardLink>
            }
          />
          <div className="card__bd">
            <div className="chartplot__bars">
              {bursarMonthly.map((m) => (
                <div className="chartplot__col" key={m.label}>
                  <div
                    className={cx("chartplot__bar", m.value < 45 && "is-soft")}
                    style={{ height: `${m.value}%` }}
                    title={`${m.label} — ${m.value}% of target`}
                  >
                    <span className="chartplot__val tnum">{m.value}%</span>
                  </div>
                </div>
              ))}
            </div>
            <div className="chartplot__axis">
              {bursarMonthly.map((m) => (
                <span key={m.label}>{m.label}</span>
              ))}
            </div>
            <div className="chartnote">
              September peak <b>96%</b> of target · current month still open
            </div>
          </div>
        </Card>

        <Card className="s5">
          <CardHead
            title="Reconciliation status"
            sub="Cashbook vs bank statement"
            icon={<Scale />}
            action={<Pill tone="green" dot>Matched</Pill>}
          />
          <div className="card__bd">
            <div className="ringrow">
              <Ring
                value={bursarKpis.reconciliation}
                label="matched"
                text={`${bursarKpis.reconciliation}%`}
                size={124}
              />
              <div className="ringrow__body">
                <div className="tiny muted">Unmatched receipts</div>
                <div className="ringrow__amount">{naira(240_000)}</div>
                <div className="tiny muted">
                  3 receipts awaiting bank confirmation. Debtors schedule is generated on the last
                  working day of each month.
                </div>
              </div>
            </div>
            <div className="alert alert--info" style={{ marginTop: 14 }}>
              <Scale />
              <span>Bank feeds are imported twice daily; the ledger closes at 17:00.</span>
            </div>
          </div>
        </Card>

        <Card className="s12" flush>
          <CardHead
            title="Latest receipts"
            sub="Most recent student payments"
            icon={<ReceiptText />}
            action={
              <CardLink onClick={() => go("bursar/ledger")}>
                Full ledger <ChevronRight />
              </CardLink>
            }
          />
          <div className="tablewrap">
            <table className="table table--stack table--compact">
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Student</th>
                  <th>Item</th>
                  <th className="t-right">Amount</th>
                  <th className="t-right">Status</th>
                </tr>
              </thead>
              <tbody>
                {recent.map((row) => (
                  <tr key={row.id}>
                    <td data-label="Date" className="nowrap">
                      {row.date}
                    </td>
                    <td data-label="Student">
                      <div className="table__strong">{row.student}</div>
                      <div className="table__sub">{row.matric}</div>
                    </td>
                    <td data-label="Item">{row.item}</td>
                    <td data-label="Amount" className="t-right tnum strong">
                      {naira(row.amount)}
                    </td>
                    <td data-label="Status" className="t-right">
                      <Pill tone={statusTone(row.status)} dot>
              {row.status}
            </Pill>
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

export function BursarLedger() {
  const toast = useToast();
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState<"All" | LedgerRow["status"]>("All");

  const rows = useMemo(() => {
    const q = query.trim().toLowerCase();
    return ledger.filter(
      (row) =>
        (status === "All" || row.status === status) &&
        (!q ||
          row.student.toLowerCase().includes(q) ||
          row.matric.toLowerCase().includes(q) ||
          row.reference.toLowerCase().includes(q) ||
          row.item.toLowerCase().includes(q))
    );
  }, [query, status]);

  const total = rows.reduce((sum, row) => sum + row.amount, 0);

  const exportRows = () => {
    const filename = `clu-ledger-${status.toLowerCase()}.csv`;
    saveCsv(filename, [
      ["Chrisland University — payments ledger"],
      ["Filter", status],
      ["Generated", new Date().toLocaleString("en-GB")],
      [],
      ["Date", "Student", "Matric number", "Item", "Amount (NGN)", "Channel", "Status", "Reference"],
      ...rows.map((row) => [
        row.date,
        row.student,
        row.matric,
        row.item,
        row.amount,
        row.channel,
        row.status,
        row.reference,
      ]),
      [],
      ["Total", "", "", `${rows.length} rows`, total],
    ]);
    toast(`Downloaded ${filename} — ${rows.length} rows.`);
  };

  return (
    <>
      <div className="page__head">
        <div>
          <div className="eyebrow">Finance</div>
          <h1 className="page__title">Payments ledger</h1>
          <p className="page__sub">
            Every receipt posted to student accounts. Export what you are looking at.
          </p>
        </div>
        <div className="page__actions">
          <Button onClick={exportRows}>
            <Download /> Export view
          </Button>
        </div>
      </div>

      <Card flush>
        <div className="card__hd card__hd--filters">
          <SearchField
            value={query}
            onChange={setQuery}
            placeholder="Search student or reference"
            label="Search ledger"
          />
          <div className="seg">
            {(["All", "Confirmed", "Pending", "Failed"] as const).map((s) => (
              <button
                key={s}
                className={cx("seg__btn", status === s && "is-active")}
                onClick={() => setStatus(s)}
              >
                {s}
              </button>
            ))}
          </div>
          <span className="toolbar__count">
            <b>{rows.length}</b> receipts
          </span>
        </div>

        {rows.length === 0 ? (
          <Empty
            icon={<ReceiptText />}
            title="No matching receipts"
            body="Try a different student, reference or status."
            action={
              <Button
                size="sm"
                onClick={() => {
                  setQuery("");
                  setStatus("All");
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
                  <th>Date</th>
                  <th>Student</th>
                  <th>Item</th>
                  <th className="t-right">Amount</th>
                  <th>Channel</th>
                  <th>Reference</th>
                  <th className="t-right">Status</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((row) => (
                  <tr key={row.id}>
                    <td data-label="Date" className="nowrap">
                      {row.date}
                    </td>
                    <td data-label="Student">
                      <div className="table__strong">{row.student}</div>
                      <div className="table__sub">{row.matric}</div>
                    </td>
                    <td data-label="Item">{row.item}</td>
                    <td data-label="Amount" className="t-right tnum strong">
                      {naira(row.amount)}
                    </td>
                    <td data-label="Channel">
                      <Pill tone="outline">{row.channel}</Pill>
                    </td>
                    <td data-label="Reference" className="tiny muted nowrap mono">
                      {row.reference}
                    </td>
                    <td data-label="Status" className="t-right">
                      <Pill tone={statusTone(row.status)} dot>
              {row.status}
            </Pill>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        <div className="unitbar">
          <div className="unitbar__num">
            <b>{rows.length}</b> receipts · {naira(total)}
          </div>
        </div>
      </Card>
    </>
  );
}

export function BursarFees() {
  const toast = useToast();

  const exportFees = () => {
    const filename = "clu-fee-schedule-2025-2026.csv";
    saveCsv(filename, [
      ["Chrisland University — approved fee schedule"],
      ["Session", "2025/2026"],
      [],
      ["Level", "Tuition (NGN)", "Hostel (NGN)", "ICT (NGN)", "Total (NGN)"],
      ...feeSchedule.map((row) => [row.level, row.tuition, row.hostel, row.ict, row.total]),
    ]);
    toast(`Downloaded ${filename}.`);
  };

  return (
    <>
      <div className="page__head">
        <div>
          <div className="eyebrow">Finance</div>
          <h1 className="page__title">Fee schedule</h1>
          <p className="page__sub">
            Approved by council for 2025/2026. Changes require a council resolution.
          </p>
        </div>
        <div className="page__actions">
          <Button onClick={exportFees}>
            <Download /> Export schedule
          </Button>
        </div>
      </div>

      <Card flush>
        <CardHead
          title="Fees by level"
          sub="Per session, Nigerian naira"
          action={<Pill tone="brand">Council approved</Pill>}
        />
        <div className="tablewrap">
          <table className="table table--stack">
            <thead>
              <tr>
                <th>Level</th>
                <th className="t-right">Tuition</th>
                <th className="t-right">Hostel</th>
                <th className="t-right">ICT</th>
                <th className="t-right">Total</th>
              </tr>
            </thead>
            <tbody>
              {feeSchedule.map((row) => (
                <tr key={row.level}>
                  <td data-label="Level">
                    <span className="table__strong">{row.level} level</span>
                  </td>
                  <td data-label="Tuition" className="t-right tnum">
                    {naira(row.tuition)}
                  </td>
                  <td data-label="Hostel" className="t-right tnum">
                    {naira(row.hostel)}
                  </td>
                  <td data-label="ICT" className="t-right tnum">
                    {naira(row.ict)}
                  </td>
                  <td data-label="Total" className="t-right tnum strong">
                    {naira(row.total)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      <div className="alert alert--info mt12">
        <Landmark />
        <span>
          Transcripts (₦5,000), certificate verification (₦10,000) and proficiency letters
          (₦7,500) are charged separately at the point of request.
        </span>
      </div>
    </>
  );
}
