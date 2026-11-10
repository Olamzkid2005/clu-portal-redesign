import { Download, GraduationCap, IdCard, Mail, MapPin, Pencil, Phone, ShieldCheck, User } from "lucide-react";
import { cgpa, fees, naira, student } from "../data";
import { Button, Card, CardHead, Pill, useToast } from "../components/ui";
import { Avatar } from "../components/Avatar";
import { exportExamCard, exportRegistrationSlip, exportStatement } from "../exports";

export default function ProfilePage() {
  const toast = useToast();

  return (
    <>
      <div className="page__head">
        <div>
          <div className="eyebrow">Account</div>
          <h1 className="page__title">Profile</h1>
          <p className="page__sub">
            Your record as held by the registry. Changes to name, programme or date of birth must be
            requested in writing.
          </p>
        </div>
        <div className="page__actions">
          <Button onClick={() => toast("Profile editing is handled by the registry in this demo.")}>
            <Pencil /> Request a change
          </Button>
          <Button
            variant="primary"
            onClick={() => {
              const filename = exportExamCard();
              toast(`Downloaded ${filename}.`);
            }}
          >
            <Download /> Exam card
          </Button>
        </div>
      </div>

      <div className="bento">
        <Card className="s8">
          <div
            className="card__bd"
            style={{ display: "flex", gap: 16, alignItems: "center", flexWrap: "wrap" }}
          >
            <Avatar name={student.name} photo={student.photo} size={64} className="avatar--lg" />
            <div style={{ minWidth: 0, flex: 1 }}>
              <div style={{ fontSize: 21, fontWeight: 600, letterSpacing: "-0.025em" }}>
                {student.name}
              </div>
              <div className="small muted">
                {student.programme} · Level {student.level}
              </div>
              <div style={{ display: "flex", gap: 6, marginTop: 8, flexWrap: "wrap" }}>
                <Pill tone="brand">{student.matric}</Pill>
                <Pill tone="green">Active</Pill>
                <Pill tone="outline">{student.session}</Pill>
              </div>
            </div>
          </div>
          <div className="card__bd" style={{ paddingTop: 0 }}>
            <div className="kv">
              <div className="kv__item">
                <div className="kv__k">CGPA</div>
                <div className="kv__v tnum">{cgpa.toFixed(2)} / 5.00</div>
              </div>
              <div className="kv__item">
                <div className="kv__k">Fee balance</div>
                <div className="kv__v tnum">{naira(fees.outstanding)}</div>
              </div>
              <div className="kv__item">
                <div className="kv__k">School</div>
                <div className="kv__v">{student.school}</div>
              </div>
              <div className="kv__item">
                <div className="kv__k">Department</div>
                <div className="kv__v">{student.department}</div>
              </div>
            </div>
          </div>
        </Card>

        <Card className="s4">
          <CardHead title="Downloads" sub="Official documents" />
          <div className="card__bd" style={{ display: "grid", gap: 8 }}>
            <Button
              onClick={() => {
                const filename = exportExamCard();
                toast(`Downloaded ${filename}.`);
              }}
            >
              <IdCard /> Exam card
            </Button>
            <Button
              onClick={() => {
                const filename = exportRegistrationSlip();
                toast(`Downloaded ${filename}.`);
              }}
            >
              <Download /> Registration slip
            </Button>
            <Button
              onClick={() => {
                const filename = exportStatement();
                toast(`Downloaded ${filename}.`);
              }}
            >
              <GraduationCap /> Statement of result
            </Button>
            <div className="tiny muted" style={{ marginTop: 4 }}>
              Documents are signed digitally and carry a verification code.
            </div>
          </div>
        </Card>

        <Card className="s6">
          <CardHead title="Personal information" icon={<User size={15} style={{ color: "var(--muted)" }} />} />
          <div className="card__bd">
            <div className="kv">
              <div className="kv__item">
                <div className="kv__k">Gender</div>
                <div className="kv__v">{student.gender}</div>
              </div>
              <div className="kv__item">
                <div className="kv__k">Date of birth</div>
                <div className="kv__v">{student.dob}</div>
              </div>
              <div className="kv__item">
                <div className="kv__k">State of origin</div>
                <div className="kv__v">{student.state}</div>
              </div>
              <div className="kv__item">
                <div className="kv__k">Phone</div>
                <div className="kv__v">{student.phone}</div>
              </div>
              <div className="kv__item" style={{ gridColumn: "1 / -1" }}>
                <div className="kv__k">Address</div>
                <div className="kv__v">{student.address}</div>
              </div>
              <div className="kv__item" style={{ gridColumn: "1 / -1" }}>
                <div className="kv__k">Email</div>
                <div className="kv__v">{student.email}</div>
              </div>
            </div>
          </div>
        </Card>

        <Card className="s6">
          <CardHead
            title="Guardian information"
            icon={<ShieldCheck size={15} style={{ color: "var(--muted)" }} />}
            action={<Pill tone="outline">Next of kin</Pill>}
          />
          <div className="card__bd">
            <div className="kv">
              <div className="kv__item">
                <div className="kv__k">Guardian</div>
                <div className="kv__v">{student.guardian.name}</div>
              </div>
              <div className="kv__item">
                <div className="kv__k">Relationship</div>
                <div className="kv__v">Father</div>
              </div>
              <div className="kv__item">
                <div className="kv__k">Email</div>
                <div className="kv__v">{student.guardian.email}</div>
              </div>
              <div className="kv__item">
                <div className="kv__k">Phone</div>
                <div className="kv__v">{student.guardian.phone}</div>
              </div>
              <div className="kv__item" style={{ gridColumn: "1 / -1" }}>
                <div className="kv__k">Address</div>
                <div className="kv__v">{student.guardian.address}</div>
              </div>
            </div>
            <div className="alert alert--info" style={{ marginTop: 12 }}>
              <Mail size={14} />
              <span>Result notifications are copied to your guardian's email each semester.</span>
            </div>
          </div>
        </Card>

        <Card className="s12">
          <div
            className="card__bd"
            style={{ display: "flex", gap: 10, alignItems: "center", flexWrap: "wrap" }}
          >
            <MapPin size={15} style={{ color: "var(--muted)" }} />
            <span className="tiny muted">
              Chrisland University, Km 5, Abeokuta–Ibadan Expressway, Abeokuta, Ogun State.
            </span>
            <span style={{ marginLeft: "auto", display: "inline-flex", gap: 14 }}>
              <span className="tiny muted" style={{ display: "inline-flex", gap: 5, alignItems: "center" }}>
                <Phone size={12} /> +234 800 000 0000
              </span>
              <span className="tiny muted" style={{ display: "inline-flex", gap: 5, alignItems: "center" }}>
                <Mail size={12} /> registry@chrislanduniversity.edu.ng
              </span>
            </span>
          </div>
        </Card>
      </div>
    </>
  );
}
