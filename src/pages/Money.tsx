import { useState } from "react";
import {
  BedDouble,
  Building2,
  CheckCircle2,
  CreditCard,
  Download,
  Info,
  ShieldCheck,
  Wallet,
} from "lucide-react";
import {
  fees,
  naira,
  paymentTypes,
  payments as seedPayments,
  student,
  type Payment,
} from "../data";
import { Button, Card, CardHead, Empty, Field, Modal, Pill, cx, useToast } from "../components/ui";
import { exportPayments } from "../exports";

/* ---------------------------------------------------------------- payments */

export function PaymentsPage() {
  const toast = useToast();
  const [history, setHistory] = useState<Payment[]>(seedPayments);
  const [type, setType] = useState(paymentTypes[0].label);
  const [amount, setAmount] = useState(String(paymentTypes[0].amount));
  const [error, setError] = useState<string | null>(null);
  const [extraPaid, setExtraPaid] = useState(0);
  const [filter, setFilter] = useState("all");

  const outstanding = Math.max(0, fees.billed - fees.paid - extraPaid);
  const paid = fees.paid + extraPaid;
  const sessions = Array.from(new Set(history.map((p) => p.session)));
  const visible = history.filter((p) => filter === "all" || p.session === filter);

  const pay = () => {
    const value = Number(amount);
    if (!value || value <= 0) {
      setError("Enter an amount greater than zero.");
      return;
    }
    const reference = "T" + Math.floor(100000000000000 + Math.random() * 899999999999999);
    const entry: Payment = {
      id: String(Date.now()),
      date: new Date().toISOString(),
      session: student.session,
      type,
      amount: value,
      channel: "Online",
      reference,
    };
    setHistory((h) => [entry, ...h]);
    setExtraPaid((p) => p + value);
    setError(null);
    toast(`Payment of ${naira(value)} received — reference ${reference}.`);
  };

  return (
    <>
      <div className="page__head">
        <div>
          <div className="eyebrow">Money</div>
          <h1 className="page__title">Payments</h1>
          <p className="page__sub">
            Pay fees securely and keep every receipt in one place. Payments post to your account
            immediately.
          </p>
        </div>
        <div className="page__actions">
          <Button
            onClick={() => {
              const scope = filter === "all" ? "all" : filter.replace("/", "-");
              const filename = exportPayments(visible, scope);
              toast(`Downloaded ${filename} — ${visible.length} payment${visible.length === 1 ? "" : "s"}.`);
            }}
          >
            <Download /> Export statement
          </Button>
        </div>
      </div>

      <div className="bento">
        <Card className="s7">
          <CardHead
            title="Account balance"
            sub={`${student.session} session`}
            action={
              outstanding === 0 ? (
                <Pill tone="green">
                  <CheckCircle2 /> Cleared
                </Pill>
              ) : (
                <Pill tone="red">Payment due</Pill>
              )
            }
          />
          <div className="card__bd">
            <div className="tiny muted">Outstanding</div>
            <div
              className="tnum"
              style={{ fontSize: 40, fontWeight: 500, lineHeight: 1.05, letterSpacing: "-0.035em" }}
            >
              {naira(outstanding)}
            </div>
            <div className="progress mt12">
              <div
                className="progress__bar"
                style={{ width: `${Math.min(100, (paid / fees.billed) * 100)}%` }}
              />
            </div>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                gap: 12,
                marginTop: 8,
              }}
            >
              <span className="tiny muted tnum">{naira(paid)} paid</span>
              <span className="tiny muted tnum">{naira(fees.billed)} billed</span>
            </div>

            <div className="divider" />

            <div style={{ display: "flex", gap: 20, flexWrap: "wrap" }}>
              <div>
                <div className="kv__k">Last payment</div>
                <div className="small strong">13 Oct 2025 · School fee</div>
              </div>
              <div>
                <div className="kv__k">Channel</div>
                <div className="small strong">Paystack · card</div>
              </div>
              <div>
                <div className="kv__k">Receipts</div>
                <div className="small strong tnum">{history.length} on file</div>
              </div>
            </div>
          </div>
        </Card>

        <Card className="s5">
          <CardHead title="Make a payment" sub="Card, transfer or USSD via Paystack" />
          <div className="card__bd">
            <div className="form">
              <Field label="What are you paying for?" required>
                <select
                  className="select"
                  value={type}
                  onChange={(e) => {
                    setType(e.target.value);
                    const match = paymentTypes.find((p) => p.label === e.target.value);
                    if (match) setAmount(String(match.amount));
                  }}
                >
                  {paymentTypes.map((p) => (
                    <option key={p.label} value={p.label}>
                      {p.label}
                    </option>
                  ))}
                </select>
              </Field>

              <Field
                label="Amount"
                required
                error={error ?? undefined}
                hint="Amount is fixed by the bursary for most items."
              >
                <div style={{ position: "relative" }}>
                  <span
                    style={{
                      position: "absolute",
                      left: 12,
                      top: "50%",
                      transform: "translateY(-50%)",
                      color: "var(--muted)",
                      fontSize: 13,
                    }}
                  >
                    ₦
                  </span>
                  <input
                    className="input tnum"
                    style={{ paddingLeft: 26 }}
                    inputMode="numeric"
                    aria-label="Amount in naira"
                    value={amount === "" ? "" : Number(amount).toLocaleString("en-NG")}
                    onChange={(e) => setAmount(e.target.value.replace(/[^\d]/g, ""))}
                  />
                </div>
              </Field>

              <Button variant="primary" block onClick={pay}>
                <CreditCard /> Pay {naira(Number(amount) || 0)} via Paystack
              </Button>
              <div className="tiny muted" style={{ display: "flex", gap: 6, alignItems: "center" }}>
                <ShieldCheck size={13} /> Secured by Paystack. The university never stores your card.
              </div>
            </div>
          </div>
        </Card>

        <Card className="s12" flush>
          <CardHead
            title="Payment history"
            sub={`${history.length} transactions`}
            action={
              <div className="seg">
                <button
                  className={cx("seg__btn", filter === "all" && "is-active")}
                  onClick={() => setFilter("all")}
                >
                  All
                </button>
                {sessions.slice(0, 2).map((s) => (
                  <button
                    key={s}
                    className={cx("seg__btn", filter === s && "is-active")}
                    onClick={() => setFilter(s)}
                  >
                    {s}
                  </button>
                ))}
              </div>
            }
          />
          {visible.length === 0 ? (
            <Empty
              icon={<Wallet />}
              title="No payments in this session"
              body="Transactions appear here as soon as Paystack confirms them."
            />
          ) : (
            <div className="tablewrap">
              <table className="table table--stack">
                <thead>
                  <tr>
                    <th>Date</th>
                    <th>Payment for</th>
                    <th>Session</th>
                    <th className="t-right">Amount</th>
                    <th>Channel</th>
                    <th>Reference</th>
                  </tr>
                </thead>
                <tbody>
                  {visible.map((p) => (
                    <tr key={p.id}>
                      <td data-label="Date" className="nowrap">
                        {new Date(p.date).toLocaleDateString("en-GB", {
                          day: "2-digit",
                          month: "short",
                          year: "numeric",
                        })}
                        <div className="table__sub">
                          {new Date(p.date).toLocaleTimeString("en-GB", {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </div>
                      </td>
                      <td data-label="Payment for">
                        <span className="table__strong">{p.type}</span>
                      </td>
                      <td data-label="Session">{p.session}</td>
                      <td data-label="Amount" className="t-right tnum strong">
                        {naira(p.amount)}
                      </td>
                      <td data-label="Channel">
                        <Pill tone={p.channel === "Online" ? "green" : "outline"}>{p.channel}</Pill>
                      </td>
                      <td data-label="Reference" className="tiny muted nowrap">
                        {p.reference}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </Card>
      </div>
    </>
  );
}

/* ----------------------------------------------------------- accommodation */

const hostels = [
  { name: "Queen Esther Hall", gender: "Female", beds: 4, price: 85_000 },
  { name: "Deborah Hall", gender: "Female", beds: 6, price: 62_000 },
  { name: "Zion Court (premium)", gender: "Female", beds: 2, price: 140_000 },
];

export function AccommodationPage() {
  const toast = useToast();
  const [open, setOpen] = useState(false);
  const [choice, setChoice] = useState(hostels[0].name);
  const [applied, setApplied] = useState(false);

  return (
    <>
      <div className="page__head">
        <div>
          <div className="eyebrow">Campus</div>
          <h1 className="page__title">Accommodation</h1>
          <p className="page__sub">
            Hostel allocation for {student.session}. Allocation is confirmed by the student affairs
            office after payment.
          </p>
        </div>
      </div>

      <div className="bento">
        <Card className="s8">
          <CardHead
            title="Hostel allocation"
            action={
              applied ? (
                <Pill tone="amber">Application received</Pill>
              ) : (
                <Pill tone="outline">Not allocated</Pill>
              )
            }
          />
          <div className="card__bd">
            {applied ? (
              <div className="empty" style={{ padding: "20px 0" }}>
                <div className="empty__icon" style={{ background: "var(--green-soft)", color: "var(--green)" }}>
                  <CheckCircle2 />
                </div>
                <div className="empty__title">Application submitted</div>
                <p className="empty__body">
                  You applied for {choice}. Student affairs will confirm your bed space within five
                  working days — you will get a notification here.
                </p>
                <Button size="sm" onClick={() => setApplied(false)}>
                  Change preference
                </Button>
              </div>
            ) : (
              <Empty
                icon={<BedDouble />}
                title="You do not have a hostel allocation for this session"
                body="Beds are allocated on a first-come basis. Apply now and pay the accommodation fee to secure a space."
                action={
                  <Button variant="primary" onClick={() => setOpen(true)}>
                    Apply for a hostel
                  </Button>
                }
              />
            )}
          </div>
        </Card>

        <Card className="s4">
          <CardHead title="Academic information" sub="From the registry" />
          <div className="card__bd">
            <div className="kv">
              <div className="kv__item">
                <div className="kv__k">School</div>
                <div className="kv__v">{student.school}</div>
              </div>
              <div className="kv__item">
                <div className="kv__k">Department</div>
                <div className="kv__v">{student.department}</div>
              </div>
              <div className="kv__item">
                <div className="kv__k">Programme</div>
                <div className="kv__v">{student.programme}</div>
              </div>
              <div className="kv__item">
                <div className="kv__k">Level</div>
                <div className="kv__v">{student.level}</div>
              </div>
            </div>
            <div className="alert alert--info" style={{ marginTop: 12 }}>
              <Info />
              <span>Report any discrepancy to the registry before registration closes.</span>
            </div>
          </div>
        </Card>
      </div>

      <Modal
        open={open}
        onClose={() => setOpen(false)}
        title="Apply for accommodation"
        sub="Choose a hall. You can change your preference before payment."
        footer={
          <>
            <Button onClick={() => setOpen(false)}>Cancel</Button>
            <Button
              variant="primary"
              onClick={() => {
                setApplied(true);
                setOpen(false);
                toast(`Hostel application submitted for ${choice}.`);
              }}
            >
              Submit application
            </Button>
          </>
        }
      >
        <div style={{ display: "grid", gap: 10 }}>
          {hostels.map((h) => (
            <label
              key={h.name}
              className={cx("pick", choice === h.name && "is-on")}
              style={{
                border: "1px solid " + (choice === h.name ? "var(--brand-2)" : "var(--line)"),
                borderRadius: 3,
              }}
            >
              <input
                type="radio"
                name="hostel"
                checked={choice === h.name}
                onChange={() => setChoice(h.name)}
              />
              <span className="pick__main">
                <span className="pick__title" style={{ display: "block" }}>
                  {h.name}
                </span>
                <span className="pick__meta" style={{ display: "block" }}>
                  <Building2 size={11} /> {h.gender} · {h.beds} in a room
                </span>
              </span>
              <span className="pick__units tnum">{naira(h.price)}</span>
            </label>
          ))}
        </div>
      </Modal>
    </>
  );
}
