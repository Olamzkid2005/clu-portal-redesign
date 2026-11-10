import { useState } from "react";
import {
  AlertTriangle,
  CheckCircle2,
  FileText,
  HeartPulse,
  Info,
  Lock,
  Mail,
  Megaphone,
  Send,
  ShieldCheck,
} from "lucide-react";
import {
  medicalRecords,
  naira,
  requestTypes,
  student,
  type RequestKey,
} from "../data";
import { Button, Card, CardHead, Empty, Field, Modal, Pill, cx, useToast } from "../components/ui";
import { useNav } from "../nav";
import { exportRequestReceipt } from "../exports";

/* --------------------------------------------------------------- requests */

type FormField = {
  name: string;
  label: string;
  type: string;
  required?: boolean;
  options?: readonly string[];
};

const requestList: { key: RequestKey; label: string }[] = [
  { key: "transcript", label: "Transcript" },
  { key: "proficiency", label: "Proficiency letter" },
  { key: "verification", label: "Certificate verification" },
];

export function RequestsPage({ type }: { type: RequestKey }) {
  const { go } = useNav();
  const config = requestTypes[type];
  const fields = config.fields as unknown as FormField[];
  const [values, setValues] = useState<Record<string, string>>({});
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [receipt, setReceipt] = useState<string | null>(null);
  const toast = useToast();

  const set = (name: string, value: string) =>
    setValues((v) => ({ ...v, [name]: value }));

  const submit = () => {
    const next: Record<string, string> = {};
    fields.forEach((f) => {
      if (f.required && !(values[f.name] ?? "").trim()) next[f.name] = "This field is required.";
    });
    setErrors(next);
    if (Object.keys(next).length > 0) return;
    const reference = "T" + Math.floor(100000000000000 + Math.random() * 899999999999999);
    setReceipt(reference);
  };

  return (
    <>
      <div className="page__head">
        <div>
          <div className="eyebrow">Services</div>
          <h1 className="page__title">{config.title}</h1>
          <p className="page__sub">{config.description}</p>
        </div>
        <div className="page__actions">
          <Pill tone="brand">{naira(config.fee)} processing fee</Pill>
        </div>
      </div>

      <div className="seg mb12" style={{ flexWrap: "wrap" }}>
        {requestList.map((r) => (
          <button
            key={r.key}
            className={cx("seg__btn", r.key === type && "is-active")}
            onClick={() => go(`requests/${r.key}`)}
          >
            {r.label}
          </button>
        ))}
      </div>

      <div className="bento">
        <Card className="s7">
          <CardHead title="Request details" sub="Identity details are pulled from your record" />
          <div className="card__bd">
            <div className="kv mb12">
              <div className="kv__item">
                <div className="kv__k">Full name</div>
                <div className="kv__v">{student.name}</div>
              </div>
              <div className="kv__item">
                <div className="kv__k">Matric number</div>
                <div className="kv__v">{student.matric}</div>
              </div>
              <div className="kv__item">
                <div className="kv__k">Email</div>
                <div className="kv__v">{student.email}</div>
              </div>
              <div className="kv__item">
                <div className="kv__k">Programme</div>
                <div className="kv__v">{student.programme}</div>
              </div>
            </div>

            <div className="alert alert--info mb12">
              <Info />
              <span>
                These fields are read-only. Contact the registry if anything is out of date — you
                will not be asked to retype your identity on this form.
              </span>
            </div>

            <div className="form">
              <div className="fieldgrid">
                {fields.map((f) => (
                  <Field
                    key={f.name}
                    label={f.label}
                    required={f.required}
                    error={errors[f.name]}
                    full={f.type === "textarea"}
                  >
                    {f.type === "textarea" ? (
                      <textarea
                        className="textarea"
                        value={values[f.name] ?? ""}
                        onChange={(e) => set(f.name, e.target.value)}
                      />
                    ) : f.type === "select" ? (
                      <select
                        className="select"
                        value={values[f.name] ?? f.options?.[0] ?? ""}
                        onChange={(e) => set(f.name, e.target.value)}
                      >
                        {(f.options ?? []).map((o) => (
                          <option key={o} value={o}>
                            {o}
                          </option>
                        ))}
                      </select>
                    ) : (
                      <input
                        className="input"
                        type={f.type}
                        value={values[f.name] ?? ""}
                        onChange={(e) => set(f.name, e.target.value)}
                      />
                    )}
                  </Field>
                ))}
              </div>

              <Button variant="primary" onClick={submit}>
                <Send /> Pay {naira(config.fee)} & submit request
              </Button>
            </div>
          </div>
        </Card>

        <div className="s5 stack">
          <Card>
            <CardHead title="What happens next" />
            <div className="card__bd">
              <ol
                style={{
                  margin: 0,
                  paddingLeft: 18,
                  display: "grid",
                  gap: 10,
                  fontSize: 12.5,
                  color: "var(--muted)",
                }}
              >
                <li>
                  <b style={{ color: "var(--ink)" }}>Pay the {naira(config.fee)} fee.</b> Payment
                  confirms the request instantly.
                </li>
                <li>
                  <b style={{ color: "var(--ink)" }}>Academic affairs reviews it.</b> Standard
                  turnaround is five working days.
                </li>
                <li>
                  <b style={{ color: "var(--ink)" }}>Delivery.</b> You get an email copy and can
                  track the status from this page.
                </li>
              </ol>
            </div>
          </Card>

          <Card>
            <CardHead title="Fee summary" />
            <div className="card__bd">
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  gap: 10,
                  fontSize: 13,
                  marginBottom: 8,
                }}
              >
                <span className="muted">{config.title}</span>
                <span className="tnum strong">{naira(config.fee)}</span>
              </div>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  gap: 10,
                  fontSize: 13,
                  marginBottom: 12,
                }}
              >
                <span className="muted">Processing</span>
                <span className="strong">5 working days</span>
              </div>
              <div className="divider" />
              <div
                style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}
              >
                <span className="small muted">Total due</span>
                <span className="tnum" style={{ fontSize: 20, fontWeight: 600 }}>
                  {naira(config.fee)}
                </span>
              </div>
            </div>
          </Card>

          <Card>
            <div className="card__bd" style={{ display: "flex", gap: 10 }}>
              <Mail size={16} style={{ color: "var(--brand-2)", flex: "none", marginTop: 2 }} />
              <div className="tiny muted">
                Questions? Academic affairs replies within one working day at{" "}
                <b style={{ color: "var(--ink)" }}>academicaffairs@chrislanduniversity.edu.ng</b>.
              </div>
            </div>
          </Card>
        </div>
      </div>

      <Modal
        open={!!receipt}
        onClose={() => setReceipt(null)}
        title="Request submitted"
        sub={`Reference ${receipt}`}
        footer={
          <>
            <Button onClick={() => setReceipt(null)}>Close</Button>
            <Button
              variant="primary"
              onClick={() => {
                const filename = exportRequestReceipt(config.title, receipt ?? "", config.fee);
                setReceipt(null);
                toast(`Downloaded ${filename}.`);
              }}
            >
              Download receipt
            </Button>
          </>
        }
      >
        <div className="alert alert--ok">
          <CheckCircle2 />
          <span>
            <b>{naira(config.fee)} received.</b> Your {config.title.toLowerCase()} is now with
            academic affairs. Track it under Requests at any time.
          </span>
        </div>
        <div className="kv" style={{ marginTop: 12 }}>
          <div className="kv__item">
            <div className="kv__k">Request</div>
            <div className="kv__v">{config.title}</div>
          </div>
          <div className="kv__item">
            <div className="kv__k">Status</div>
            <div className="kv__v">Queued for review</div>
          </div>
        </div>
      </Modal>
    </>
  );
}

/* --------------------------------------------------------------- medicals */

export function MedicalsPage() {
  const toast = useToast();
  const [records, setRecords] = useState(medicalRecords);
  const [open, setOpen] = useState(false);
  const [complaint, setComplaint] = useState("");

  return (
    <>
      <div className="page__head">
        <div>
          <div className="eyebrow">Campus</div>
          <h1 className="page__title">Medicals</h1>
          <p className="page__sub">
            Your clinic visits. Records are visible only to you and the university health centre.
          </p>
        </div>
        <div className="page__actions">
          <Button variant="primary" onClick={() => setOpen(true)}>
            <HeartPulse /> Report a complaint
          </Button>
        </div>
      </div>

      <Card flush>
        <CardHead title="Medical history" sub={`${records.length} recorded visits`} />
        {records.length === 0 ? (
          <Empty
            icon={<HeartPulse />}
            title="No medical records"
            body="Visits to the university clinic will appear here."
          />
        ) : (
          <div className="tablewrap">
            <table className="table table--stack">
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Complaint</th>
                  <th>Diagnosis</th>
                  <th>Treatment</th>
                  <th>Seen by</th>
                </tr>
              </thead>
              <tbody>
                {records.map((r) => (
                  <tr key={r.id}>
                    <td data-label="Date" className="nowrap strong">
                      {r.date}
                    </td>
                    <td data-label="Complaint">{r.complaint}</td>
                    <td data-label="Diagnosis">{r.diagnosis}</td>
                    <td data-label="Treatment">{r.treatment}</td>
                    <td data-label="Seen by">{r.seenBy}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>

      <div className="alert alert--info mt12">
        <Lock />
        <span>
          Medical records are confidential. In an emergency call the clinic on{" "}
          <b>0800 000 1122</b> instead of using this form.
        </span>
      </div>

      <Modal
        open={open}
        onClose={() => setOpen(false)}
        title="Report a complaint"
        sub="The clinic will contact you to book an appointment."
        footer={
          <>
            <Button onClick={() => setOpen(false)}>Cancel</Button>
            <Button
              variant="primary"
              onClick={() => {
                if (!complaint.trim()) return;
                setRecords((r) => [
                  {
                    id: String(Date.now()),
                    date: new Date().toLocaleDateString("en-GB", {
                      day: "2-digit",
                      month: "short",
                      year: "numeric",
                    }),
                    complaint,
                    diagnosis: "Pending review",
                    treatment: "Awaiting appointment",
                    seenBy: "—",
                  },
                  ...r,
                ]);
                setComplaint("");
                setOpen(false);
                toast("Complaint logged. The clinic will contact you.");
              }}
            >
              Submit to clinic
            </Button>
          </>
        }
      >
        <Field label="What are you experiencing?" required>
          <textarea
            className="textarea"
            value={complaint}
            onChange={(e) => setComplaint(e.target.value)}
            placeholder="Symptoms, how long they have lasted, any medication taken…"
          />
        </Field>
      </Modal>
    </>
  );
}

/* --------------------------------------------------------------- feedback */

export function FeedbackPage() {
  const toast = useToast();
  const [category, setCategory] = useState("Teaching & learning");
  const [message, setMessage] = useState("");
  const [anonymous, setAnonymous] = useState(true);
  const [sent, setSent] = useState(false);

  return (
    <>
      <div className="page__head">
        <div>
          <div className="eyebrow">Services</div>
          <h1 className="page__title">Student feedback</h1>
          <p className="page__sub">
            Tell the university what is working and what is not. Feedback goes to the quality
            assurance unit.
          </p>
        </div>
      </div>

      <div className="bento">
        <Card className="s7">
          <CardHead title="Send feedback" />
          <div className="card__bd">
            {sent ? (
              <div className="empty" style={{ padding: "24px 0" }}>
                <div
                  className="empty__icon"
                  style={{ background: "var(--green-soft)", color: "var(--green)" }}
                >
                  <CheckCircle2 />
                </div>
                <div className="empty__title">Feedback received</div>
                <p className="empty__body">
                  Thank you. Quality assurance reads every response and publishes a summary each
                  semester.
                </p>
                <Button size="sm" onClick={() => setSent(false)}>
                  Send another
                </Button>
              </div>
            ) : (
              <div className="form">
                <div className="fieldgrid">
                  <Field label="Category">
                    <select
                      className="select"
                      value={category}
                      onChange={(e) => setCategory(e.target.value)}
                    >
                      {[
                        "Teaching & learning",
                        "Facilities",
                        "Portal & technology",
                        "Hostel & welfare",
                        "Examinations",
                        "Other",
                      ].map((c) => (
                        <option key={c}>{c}</option>
                      ))}
                    </select>
                  </Field>
                  <Field label="Send as">
                    <label
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 9,
                        height: 38,
                        fontSize: 13,
                      }}
                    >
                      <input
                        type="checkbox"
                        checked={anonymous}
                        onChange={(e) => setAnonymous(e.target.checked)}
                        style={{ width: 16, height: 16, accentColor: "var(--brand)" }}
                      />
                      Keep my feedback anonymous
                    </label>
                  </Field>
                </div>
                <Field label="Your message" required hint="Be specific — dates and course codes help.">
                  <textarea
                    className="textarea"
                    style={{ minHeight: 150 }}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="What happened, and what would make it better?"
                  />
                </Field>
                <Button
                  variant="primary"
                  onClick={() => {
                    if (!message.trim()) {
                      toast("Write a message before sending.");
                      return;
                    }
                    setSent(true);
                    setMessage("");
                    toast("Feedback sent to quality assurance.");
                  }}
                >
                  <Send /> Send feedback
                </Button>
              </div>
            )}
          </div>
        </Card>

        <div className="s5 stack">
          <Card>
            <CardHead title="How feedback is handled" />
            <div className="card__bd">
              <div style={{ display: "grid", gap: 12, fontSize: 12.5, color: "var(--muted)" }}>
                <div style={{ display: "flex", gap: 10 }}>
                  <Megaphone size={15} style={{ color: "var(--brand-2)", flex: "none", marginTop: 2 }} />
                  <span>Every submission is tagged and routed to the responsible unit.</span>
                </div>
                <div style={{ display: "flex", gap: 10 }}>
                  <ShieldCheck size={15} style={{ color: "var(--brand-2)", flex: "none", marginTop: 2 }} />
                  <span>Anonymous submissions cannot be traced to your account.</span>
                </div>
                <div style={{ display: "flex", gap: 10 }}>
                  <FileText size={15} style={{ color: "var(--brand-2)", flex: "none", marginTop: 2 }} />
                  <span>A summary of actions taken is published before exams.</span>
                </div>
              </div>
            </div>
          </Card>
          <div className="alert alert--warn">
            <AlertTriangle />
            <span>
              For grades, registration or fees, contact your department directly — feedback is not
              a support ticket.
            </span>
          </div>
        </div>
      </div>
    </>
  );
}

/* --------------------------------------------------------------- settings */

export function SettingsPage() {
  const toast = useToast();
  const [current, setCurrent] = useState("");
  const [next, setNext] = useState("");
  const [confirm, setConfirm] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [emailAlerts, setEmailAlerts] = useState(true);
  const [smsAlerts, setSmsAlerts] = useState(false);

  const save = () => {
    const e: Record<string, string> = {};
    if (!current) e.current = "Enter your current password.";
    if (next.length < 8) e.next = "Use at least 8 characters.";
    if (next !== confirm) e.confirm = "Passwords do not match.";
    setErrors(e);
    if (Object.keys(e).length > 0) return;
    setCurrent("");
    setNext("");
    setConfirm("");
    toast("Password updated. Other sessions have been signed out.");
  };

  return (
    <>
      <div className="page__head">
        <div>
          <div className="eyebrow">Account</div>
          <h1 className="page__title">Settings</h1>
          <p className="page__sub">Security and notification preferences for your portal account.</p>
        </div>
      </div>

      <div className="bento">
        <Card className="s7">
          <CardHead title="Change password" sub="Use a password you do not use elsewhere" />
          <div className="card__bd">
            <div className="form">
              <Field label="Current password" required error={errors.current}>
                <input
                  className="input"
                  type="password"
                  value={current}
                  onChange={(e) => setCurrent(e.target.value)}
                  autoComplete="current-password"
                />
              </Field>
              <div className="fieldgrid">
                <Field
                  label="New password"
                  required
                  error={errors.next}
                  hint="At least 8 characters."
                >
                  <input
                    className="input"
                    type="password"
                    value={next}
                    onChange={(e) => setNext(e.target.value)}
                    autoComplete="new-password"
                  />
                </Field>
                <Field label="Confirm new password" required error={errors.confirm}>
                  <input
                    className="input"
                    type="password"
                    value={confirm}
                    onChange={(e) => setConfirm(e.target.value)}
                    autoComplete="new-password"
                  />
                </Field>
              </div>
              <Button variant="primary" onClick={save} style={{ alignSelf: "flex-start" }}>
                <Lock /> Update password
              </Button>
            </div>
          </div>
        </Card>

        <div className="s5 stack">
          <Card>
            <CardHead title="Notifications" sub="How we reach you" />
            <div className="card__bd" style={{ display: "grid", gap: 14 }}>
              {[
                {
                  label: "Email alerts",
                  hint: "Results, payment receipts and registration decisions.",
                  value: emailAlerts,
                  set: setEmailAlerts,
                },
                {
                  label: "SMS alerts",
                  hint: "Only for exam timetable changes and fee deadlines.",
                  value: smsAlerts,
                  set: setSmsAlerts,
                },
              ].map((n) => (
                <label
                  key={n.label}
                  style={{ display: "flex", gap: 12, alignItems: "flex-start", cursor: "pointer" }}
                >
                  <input
                    type="checkbox"
                    checked={n.value}
                    onChange={(e) => n.set(e.target.checked)}
                    style={{ width: 16, height: 16, accentColor: "var(--brand)", marginTop: 3 }}
                  />
                  <span>
                    <span className="small strong" style={{ display: "block" }}>
                      {n.label}
                    </span>
                    <span className="tiny muted">{n.hint}</span>
                  </span>
                </label>
              ))}
            </div>
          </Card>

          <Card>
            <CardHead title="Signed-in device" />
            <div className="card__bd">
              <div className="small strong">Chrome · Android</div>
              <div className="tiny muted">Abeokuta, NG · active now</div>
              <div className="alert alert--info" style={{ marginTop: 12 }}>
                <ShieldCheck />
                <span>Only one device is signed in. Changing your password signs out others.</span>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </>
  );
}
