import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  type ButtonHTMLAttributes,
  type ReactNode,
} from "react";
import { CheckCircle2, Search, X } from "lucide-react";
import HeroAnimation from "./HeroAnimation";

export const cx = (...parts: Array<string | false | null | undefined>) =>
  parts.filter(Boolean).join(" ");

/* ------------------------------------------------------------------ button */

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "outline" | "ghost" | "hero" | "heroSolid" | "ok" | "danger";
  size?: "sm";
  block?: boolean;
};

export function Button({
  variant = "outline",
  size,
  block,
  className,
  children,
  ...rest
}: ButtonProps) {
  return (
    <button
      className={cx(
        "btn",
        variant === "primary" && "btn--primary",
        variant === "ghost" && "btn--ghost",
        variant === "hero" && "btn--hero",
        variant === "heroSolid" && "btn--hero-solid",
        variant === "ok" && "btn--ok",
        variant === "danger" && "btn--danger",
        size === "sm" && "btn--sm",
        block && "btn--block",
        className
      )}
      {...rest}
    >
      {children}
    </button>
  );
}

/* -------------------------------------------------------------------- card */

export function Card({
  children,
  className,
  flush,
}: {
  children: ReactNode;
  className?: string;
  flush?: boolean;
}) {
  return <section className={cx("card", flush && "card--flush", className)}>{children}</section>;
}

export function CardHead({
  title,
  sub,
  action,
  icon,
}: {
  title: string;
  sub?: string;
  action?: ReactNode;
  icon?: ReactNode;
}) {
  return (
    <div className="card__hd">
      {icon && <span className="card__ico">{icon}</span>}
      <div className="card__hd__copy">
        <div className="card__title">{title}</div>
        {sub && <div className="card__sub">{sub}</div>}
      </div>
      {action}
    </div>
  );
}

export function CardLink({
  children,
  onClick,
}: {
  children: ReactNode;
  onClick?: () => void;
}) {
  return (
    <button className="card__link" onClick={onClick}>
      {children}
    </button>
  );
}

/* --------------------------------------------------------- workspace hero */

export function WorkspaceHero({
  eyebrow,
  title,
  sub,
  actions,
  mark,
  media,
}: {
  eyebrow: string;
  title: ReactNode;
  sub: ReactNode;
  actions?: ReactNode;
  mark?: ReactNode;
  media?: { src: string; label: string };
}) {
  return (
    <section className={cx("hero workspace-hero", media && "workspace-hero--media")}>
      <div className="workspace-hero__body">
        <div className="eyebrow">{eyebrow}</div>
        <h1 className="hero__greet serif">{title}</h1>
        <div className="hero__meta">{sub}</div>
        {media && actions && <div className="workspace-hero__actions">{actions}</div>}
      </div>
      {!media && actions && <div className="workspace-hero__actions">{actions}</div>}
      {media && (
        <HeroAnimation
          className="workspace-hero__media"
          src={media.src}
          label={media.label}
        />
      )}
      {mark ? <span className="workspace-hero__mark" aria-hidden="true">{mark}</span> : null}
    </section>
  );
}

/* -------------------------------------------------------------- search box */

export function SearchField({
  value,
  onChange,
  placeholder,
  label,
}: {
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
  label: string;
}) {
  return (
    <div className="searchfield">
      <Search className="searchfield__icon" aria-hidden="true" />
      <input
        className="searchfield__input"
        value={value}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
        aria-label={label}
        spellCheck={false}
      />
      {value && (
        <button
          className="searchfield__clear"
          onClick={() => onChange("")}
          aria-label="Clear search"
          type="button"
        >
          <X />
        </button>
      )}
    </div>
  );
}

/* -------------------------------------------------------------------- pill */

type Tone = "green" | "amber" | "red" | "blue" | "brand" | "outline";

export function Pill({
  tone,
  dot,
  children,
}: {
  tone?: Tone;
  dot?: boolean;
  children: ReactNode;
}) {
  return (
    <span className={cx("pill", tone && `pill--${tone}`)}>
      {dot && <span className="dot" aria-hidden="true" />}
      {children}
    </span>
  );
}

/* -------------------------------------------------------------------- stat */

export function Stat({
  icon,
  label,
  value,
  meta,
  tone,
  onClick,
}: {
  icon: ReactNode;
  label: string;
  value: ReactNode;
  meta: ReactNode;
  tone?: "green" | "amber" | "rose" | "blue";
  onClick?: () => void;
}) {
  return (
    <button
      className={cx("stat", tone && `stat--${tone}`)}
      onClick={onClick}
      style={{ border: undefined }}
    >
      <div className="stat__top">
        <span className="stat__icon">{icon}</span>
        <span className="stat__label">{label}</span>
      </div>
      <div className="stat__value">{value}</div>
      <div className="stat__meta">{meta}</div>
    </button>
  );
}

/* ------------------------------------------------------------------- empty */

export function Kpi({
  icon,
  label,
  value,
  meta,
  tone,
}: {
  icon: ReactNode;
  label: string;
  value: ReactNode;
  meta: ReactNode;
  tone?: "green" | "amber" | "rose" | "blue";
}) {
  return (
    <div className={cx("stat stat--static", tone && `stat--${tone}`)}>
      <div className="stat__top">
        <span className="stat__icon">{icon}</span>
        <span className="stat__label">{label}</span>
      </div>
      <div className="stat__value">{value}</div>
      <div className="stat__meta">{meta}</div>
    </div>
  );
}

export function Empty({
  icon,
  title,
  body,
  action,
}: {
  icon?: ReactNode;
  title: string;
  body?: string;
  action?: ReactNode;
}) {
  return (
    <div className="empty">
      {icon && <div className="empty__icon">{icon}</div>}
      <div className="empty__title">{title}</div>
      {body && <p className="empty__body">{body}</p>}
      {action}
    </div>
  );
}

/* ------------------------------------------------------------------- field */

export function Field({
  label,
  required,
  hint,
  error,
  full,
  children,
}: {
  label: string;
  required?: boolean;
  hint?: string;
  error?: string;
  full?: boolean;
  children: ReactNode;
}) {
  return (
    <label className={cx("field", full && "field--full")}>
      <span className="label">
        {label}
        {required && <span> *</span>}
      </span>
      {children}
      {error ? (
        <span className="hint hint--error">{error}</span>
      ) : (
        hint && <span className="hint">{hint}</span>
      )}
    </label>
  );
}

/* -------------------------------------------------------------------- ring */

export function Ring({
  value,
  max = 100,
  label,
  text,
  size = 116,
}: {
  value: number;
  max?: number;
  label: string;
  text?: string;
  size?: number;
}) {
  const radius = 50;
  const circumference = 2 * Math.PI * radius;
  const pct = Math.max(0, Math.min(1, value / max));
  return (
    <div className="ring" style={{ width: size, height: size }}>
      <svg width={size} height={size} viewBox="0 0 116 116" aria-hidden="true">
        <circle className="ring__track" cx="58" cy="58" r={radius} fill="none" strokeWidth="9" />
        <circle
          className="ring__fg"
          cx="58"
          cy="58"
          r={radius}
          fill="none"
          strokeWidth="9"
          stroke="currentColor"
          strokeDasharray={circumference}
          strokeDashoffset={circumference * (1 - pct)}
        />
      </svg>
      <div className="ring__center">
        <div className="ring__value">{text ?? `${Math.round(pct * 100)}%`}</div>
        <div className="ring__label">{label}</div>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------- modal */

export function Modal({
  open,
  onClose,
  title,
  sub,
  children,
  footer,
}: {
  open: boolean;
  onClose: () => void;
  title: string;
  sub?: string;
  children: ReactNode;
  footer?: ReactNode;
}) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="scrim" onClick={onClose}>
      <div
        className="modal"
        role="dialog"
        aria-modal="true"
        aria-label={title}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="modal__hd">
          <div style={{ flex: 1, minWidth: 0 }}>
            <div className="modal__title">{title}</div>
            {sub && <div className="modal__sub">{sub}</div>}
          </div>
          <button className="iconbtn" onClick={onClose} aria-label="Close">
            <X />
          </button>
        </div>
        <div className="modal__bd">{children}</div>
        {footer && <div className="modal__ft">{footer}</div>}
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------- toast */

type ToastItem = { id: number; message: string };
const ToastCtx = createContext<(message: string) => void>(() => {});

export function ToastProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<ToastItem[]>([]);

  const push = useCallback((message: string) => {
    const id = Date.now() + Math.random();
    setItems((list) => [...list, { id, message }]);
    window.setTimeout(() => {
      setItems((list) => list.filter((t) => t.id !== id));
    }, 4600);
  }, []);

  return (
    <ToastCtx.Provider value={push}>
      {children}
      <div className="toaster" role="status" aria-live="polite">
        {items.map((t) => (
          <div className="toast" key={t.id}>
            <CheckCircle2 />
            <span>{t.message}</span>
          </div>
        ))}
      </div>
    </ToastCtx.Provider>
  );
}

export const useToast = () => useContext(ToastCtx);
