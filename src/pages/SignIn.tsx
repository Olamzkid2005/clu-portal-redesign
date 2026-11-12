import { useRef, useState, type FormEvent } from "react";
import {
  AlertCircle,
  ArrowRight,
  ArrowUpRight,
  Eye,
  EyeOff,
  Loader2,
} from "lucide-react";
import { Avatar } from "../components/Avatar";
import HeroAnimation from "../components/HeroAnimation";
import { cx } from "../components/ui";
import { ROLE_META, ROLE_ORDER, useRole, type Role } from "../roles";

type FieldErrors = {
  email?: string;
  password?: string;
};

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const validateEmail = (value: string) => {
  const email = value.trim();
  if (!email) return "Enter your university email address.";
  if (/\s/.test(value)) return "Remove the spaces from your email address.";
  if (!emailPattern.test(email)) {
    return "Use the format name@chrislanduniversity.edu.ng.";
  }
  return undefined;
};

const validatePassword = (value: string) => {
  if (!value) return "Enter your portal password to continue.";
  return undefined;
};

export default function SignIn() {
  const { role, signIn } = useRole();
  const [selected, setSelected] = useState<Role>(role);
  const [email, setEmail] = useState(ROLE_META[role].email);
  const [password, setPassword] = useState("chrisland");
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<FieldErrors>({});
  const [formError, setFormError] = useState<string | null>(null);
  const [status, setStatus] = useState<"idle" | "loading">("idle");
  const emailRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);

  const meta = ROLE_META[selected];
  const loading = status === "loading";

  const chooseRole = (next: Role) => {
    if (loading) return;
    setSelected(next);
    setEmail(ROLE_META[next].email);
    setErrors({});
    setFormError(null);
  };

  const validateOnBlur = (field: "email" | "password") => {
    setErrors((current) => ({
      ...current,
      [field]: field === "email" ? validateEmail(email) : validatePassword(password),
    }));
  };

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (loading) return;

    const nextErrors: FieldErrors = {
      email: validateEmail(email),
      password: validatePassword(password),
    };
    setErrors(nextErrors);
    setFormError(null);

    if (nextErrors.email) {
      emailRef.current?.focus();
      return;
    }
    if (nextErrors.password) {
      passwordRef.current?.focus();
      return;
    }

    setStatus("loading");
    try {
      // Give the loading state one visible beat while the local demo auth resolves.
      await new Promise<void>((resolve) => window.setTimeout(resolve, 450));
      signIn(selected);
      window.location.hash = `#/${meta.home}`;
    } catch {
      setStatus("idle");
      setFormError(
        "We couldn’t sign you in. Check your email and password, then try again."
      );
    }
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

          <div className="signin__animation">
            <HeroAnimation
              src="/animations/signin.mp4"
              label="Two students waving to each other on campus"
            />
            <p className="signin__animationcaption">
              One portal for every part of campus life.
            </p>
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
                disabled={loading}
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

          <form
            className="signin__form"
            onSubmit={submit}
            noValidate
            aria-busy={loading}
          >
            <div className={cx("signin__field", errors.email && "signin__field--invalid")}>
              <label className="signin__label" htmlFor="signin-email">
                University email
              </label>
              <input
                ref={emailRef}
                id="signin-email"
                type="email"
                name="email"
                autoComplete="username"
                inputMode="email"
                autoCapitalize="none"
                spellCheck={false}
                value={email}
                onChange={(event) => {
                  setEmail(event.target.value);
                  setFormError(null);
                }}
                onBlur={() => validateOnBlur("email")}
                aria-invalid={Boolean(errors.email)}
                aria-describedby={errors.email ? "signin-email-error" : undefined}
                aria-required="true"
                disabled={loading}
                required
              />
              {errors.email && (
                <p className="signin__fielderror" id="signin-email-error" role="alert">
                  <AlertCircle aria-hidden="true" />
                  <span>{errors.email}</span>
                </p>
              )}
            </div>

            <div
              className={cx(
                "signin__field",
                errors.password && "signin__field--invalid"
              )}
            >
              <label className="signin__label" htmlFor="signin-password">
                Password
              </label>
              <span className="signin__password">
                <input
                  ref={passwordRef}
                  id="signin-password"
                  type={showPassword ? "text" : "password"}
                  name="password"
                  autoComplete="current-password"
                  value={password}
                  onChange={(event) => {
                    setPassword(event.target.value);
                    setFormError(null);
                  }}
                  onBlur={() => validateOnBlur("password")}
                  aria-invalid={Boolean(errors.password)}
                  aria-describedby={errors.password ? "signin-password-error" : undefined}
                  aria-required="true"
                  disabled={loading}
                  required
                />
                <button
                  type="button"
                  className="signin__reveal"
                  onClick={() => setShowPassword((visible) => !visible)}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                  disabled={loading}
                >
                  {showPassword ? <EyeOff /> : <Eye />}
                  {showPassword ? "Hide" : "Show"}
                </button>
              </span>
              {errors.password && (
                <p className="signin__fielderror" id="signin-password-error" role="alert">
                  <AlertCircle aria-hidden="true" />
                  <span>{errors.password}</span>
                </p>
              )}
            </div>

            <div className="signin__row">
              <span className="signin__sessionnote">Session ends with this tab</span>
              <a className="signin__help" href="mailto:ict@chrislanduniversity.edu.ng">
                Need help?
              </a>
            </div>

            {formError && (
              <div className="signin__error" role="alert">
                <AlertCircle aria-hidden="true" />
                <span>{formError}</span>
              </div>
            )}

            <button
              className={cx("btn btn--primary signin__submit", loading && "is-loading")}
              type="submit"
              disabled={loading}
              aria-disabled={loading}
            >
              {loading ? (
                <>
                  <span className="signin__submitlabel">
                    <Loader2 className="signin__spinner" aria-hidden="true" />
                    Signing you in…
                  </span>
                  <span className="signin__submitmeta" aria-hidden="true">
                    Please wait
                  </span>
                </>
              ) : (
                <>
                  <span className="signin__submitlabel">
                    Sign in as {meta.label.toLowerCase()}
                  </span>
                  <ArrowRight aria-hidden="true" />
                </>
              )}
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
