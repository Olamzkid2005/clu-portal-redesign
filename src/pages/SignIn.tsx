import { useState, type FormEvent } from "react";
import { ArrowRight, ArrowUpRight, Eye, EyeOff } from "lucide-react";
import { Avatar } from "../components/Avatar";
import { cx } from "../components/ui";
import { ROLE_META, ROLE_ORDER, useRole, type Role } from "../roles";

export default function SignIn() {
  const { role, signIn } = useRole();
  const [selected, setSelected] = useState<Role>(role);
  const [email, setEmail] = useState(ROLE_META[role].email);
  const [password, setPassword] = useState("chrisland");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const meta = ROLE_META[selected];

  const chooseRole = (next: Role) => {
    setSelected(next);
    setEmail(ROLE_META[next].email);
    setError(null);
  };

  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      setError("Enter a valid university email address.");
      return;
    }
    if (password.length === 0) {
      setError("Enter your portal password.");
      return;
    }
    setError(null);
    signIn(selected);
    window.location.hash = `#/${meta.home}`;
  };

  return (
    <div className="signin">
      <header className="signin__top">
        <a className="signin__brand" href="#/dashboard" aria-label="Chrisland University portal">
          <span className="quadbrand__mark">CLU</span>
          <span className="signin__brandcopy">
            <b>Chrisland University</b>
            <small>Student and staff portal</small>
          </span>
        </a>
        <a className="signin__study" href="mailto:ict@chrislanduniversity.edu.ng">
          Portal help <ArrowUpRight />
        </a>
      </header>

      <main className="signin__body">
        <section className="signin__intro">
          <div className="signin__kicker">Portal access · 2025/2026</div>
          <h1>Sign in to your portal.</h1>
          <p className="signin__lede">
            Timetable, registration, results and fees for students. Teaching, finance, registry and
            systems for staff.
          </p>

          <div className="signin__meta">
            <span>Student and staff</span>
            <span>First semester</span>
            <span>Portal support</span>
          </div>

          <div className="signin__facts">
            <div>
              <b>Students</b>
              <p>Timetable, registration, results, fees and campus services.</p>
            </div>
            <div>
              <b>Staff</b>
              <p>Teaching, finance, registry and systems workspaces.</p>
            </div>
          </div>
        </section>

        <section className="signin__panel" aria-labelledby="signin-heading">
          <div className="signin__panelhead">
            <span className="signin__kicker">Sign in</span>
            <h2 id="signin-heading">Choose your workspace.</h2>
            <p>Select a role to open its portal. The account details change with the role.</p>
          </div>

          <div className="signin__roles" role="tablist" aria-label="Portal role">
            {ROLE_ORDER.map((item) => (
              <button
                key={item}
                type="button"
                role="tab"
                aria-selected={selected === item}
                className={cx("signin__role", selected === item && "is-active")}
                onClick={() => chooseRole(item)}
              >
                <b>{ROLE_META[item].label}</b>
              </button>
            ))}
          </div>

          <div className="signin__identity">
            <Avatar name={meta.name} photo={meta.photo} size={40} />
            <div>
              <b>{meta.name}</b>
              <span>
                {meta.label} · {meta.detail}
              </span>
            </div>
          </div>

          <form className="signin__form" onSubmit={submit} noValidate>
            <label className="signin__field">
              <span>University email</span>
              <input
                type="email"
                name="email"
                autoComplete="username"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                aria-invalid={!!error}
              />
            </label>

            <label className="signin__field">
              <span>Password</span>
              <span className="signin__password">
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  autoComplete="current-password"
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                />
                <button
                  type="button"
                  className="signin__reveal"
                  onClick={() => setShowPassword((visible) => !visible)}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <EyeOff /> : <Eye />}
                  {showPassword ? "Hide" : "Show"}
                </button>
              </span>
            </label>

            <div className="signin__row">
              <span className="signin__sessionnote">Session ends with this tab</span>
              <a className="signin__help" href="mailto:ict@chrislanduniversity.edu.ng">
                Need help?
              </a>
            </div>

            {error && (
              <div className="signin__error" role="alert">
                {error}
              </div>
            )}

            <button className="btn btn--primary signin__submit" type="submit">
              Sign in as {meta.label.toLowerCase()}
              <ArrowRight />
            </button>
          </form>

          <p className="signin__note">
            <b>Design preview.</b> All six workspaces are open. The account is pre-filled and any
            password will enter this preview. Sign in again after signing out to open another role.
          </p>
        </section>
      </main>

      <footer className="signin__foot">
        <span>© 2026 Chrisland University</span>
        <span>Registry · Academic Affairs</span>
        <span>Portal support: ict@chrislanduniversity.edu.ng</span>
      </footer>
    </div>
  );
}
