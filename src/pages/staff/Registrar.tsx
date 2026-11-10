import { useMemo, useState } from "react";
import { Clock, Download, FileCheck2, FileText, Wallet } from "lucide-react";
import { naira } from "../../data";
import { registryQueue, type RegistryRequest } from "../../staffData";
import {
  Button,
  Card,
  Empty,
  Kpi,
  Pill,
  SearchField,
  WorkspaceHero,
  cx,
  useToast,
} from "../../components/ui";
import { saveCsv } from "../../download";

const tone = (status: RegistryRequest["status"]): "green" | "blue" | "amber" =>
  status === "Completed" ? "green" : status === "In review" ? "blue" : "amber";

export function RegistrarQueue() {
  const toast = useToast();
  const [rows, setRows] = useState<RegistryRequest[]>(registryQueue);
  const [filter, setFilter] = useState<"All" | RegistryRequest["status"]>("All");
  const [query, setQuery] = useState("");

  const visible = useMemo(() => {
    const q = query.trim().toLowerCase();
    return rows.filter(
      (row) =>
        (filter === "All" || row.status === filter) &&
        (!q ||
          row.student.toLowerCase().includes(q) ||
          row.matric.toLowerCase().includes(q) ||
          row.type.toLowerCase().includes(q))
    );
  }, [rows, filter, query]);

  const open = rows.filter((row) => row.status !== "Completed");
  const fees = rows.reduce((sum, row) => sum + row.fee, 0);

  const advance = (row: RegistryRequest) => {
    const next: RegistryRequest["status"] =
      row.status === "New" ? "In review" : "Completed";
    setRows((list) =>
      list.map((item) => (item.id === row.id ? { ...item, status: next } : item))
    );
    toast(`${row.type} for ${row.student} moved to ${next.toLowerCase()}.`);
  };

  const exportQueue = () => {
    const filename = "clu-registry-requests.csv";
    saveCsv(filename, [
      ["Chrisland University — registry request queue"],
      ["Filter", filter],
      ["Generated", new Date().toLocaleString("en-GB")],
      [],
      ["Type", "Student", "Matric number", "Submitted", "Fee (NGN)", "Status"],
      ...visible.map((row) => [
        row.type,
        row.student,
        row.matric,
        row.submitted,
        row.fee,
        row.status,
      ]),
    ]);
    toast(`Downloaded ${filename} — ${visible.length} requests.`);
  };

  return (
    <>
      <WorkspaceHero
        eyebrow="Registry workspace · 2025/2026"
        title="Request queue"
        sub="Transcripts, proficiency letters and certificate verifications from students."
        mark={<FileCheck2 />}
        actions={
          <Button variant="heroSolid" onClick={exportQueue}>
            <Download /> Export queue
          </Button>
        }
      />

      <div className="statgrid mb12">
        <Kpi icon={<FileText />} label="Open requests" value={open.length} meta="New and in review" tone="amber" />
        <Kpi icon={<FileCheck2 />} label="Completed" value={rows.filter((r) => r.status === "Completed").length} meta="This week" tone="green" />
        <Kpi icon={<Clock />} label="Average turnaround" value="3.4 days" meta="Target is 5 working days" />
        <Kpi icon={<Wallet />} label="Fees collected" value={naira(fees)} meta="Across all requests" tone="green" />
      </div>

      <Card flush>
        <div className="card__hd card__hd--filters">
          <SearchField
            value={query}
            onChange={setQuery}
            placeholder="Search student, matric or request type"
            label="Search requests"
          />
          <div className="seg">
            {(["All", "New", "In review", "Completed"] as const).map((f) => (
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
            <b>{visible.length}</b> requests
          </span>
        </div>

        {visible.length === 0 ? (
          <Empty
            icon={<FileText />}
            title="No requests in this view"
            body="Try another status or clear the search."
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
                  <th>Request</th>
                  <th>Student</th>
                  <th>Submitted</th>
                  <th className="t-right">Fee</th>
                  <th className="t-right">Status</th>
                  <th className="t-right">Action</th>
                </tr>
              </thead>
              <tbody>
                {visible.map((row) => (
                  <tr key={row.id}>
                    <td data-label="Request">
                      <span className="table__strong">{row.type}</span>
                    </td>
                    <td data-label="Student">
                      <div>{row.student}</div>
                      <div className="table__sub">{row.matric}</div>
                    </td>
                    <td data-label="Submitted" className="nowrap">
                      {row.submitted}
                    </td>
                    <td data-label="Fee" className="t-right tnum">
                      {naira(row.fee)}
                    </td>
                    <td data-label="Status" className="t-right">
                      <Pill tone={tone(row.status)} dot>
                        {row.status}
                      </Pill>
                    </td>
                    <td data-label="Action" className="t-right">
                      {row.status === "Completed" ? (
                        <span className="tiny muted">Closed</span>
                      ) : (
                        <button className="rowbtn" onClick={() => advance(row)}>
                          {row.status === "New" ? "Start review" : "Complete"}
                        </button>
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
            <b>{visible.length}</b> requests ·{" "}
            {naira(visible.reduce((sum, row) => sum + row.fee, 0))} in fees
          </div>
        </div>
      </Card>
    </>
  );
}
