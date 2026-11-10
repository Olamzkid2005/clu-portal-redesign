import { initialsFor } from "../roles";
import { cx } from "./ui";

/**
 * Responsive identity mark: the photograph is used in the desktop chrome,
 * while compact screens fall back to the person's initials.
 */
export function Avatar({
  name,
  photo,
  size = 28,
  className,
}: {
  name: string;
  photo?: string;
  size?: number;
  className?: string;
}) {
  return (
    <span
      className={cx("avatar", photo && "avatar--photo", className)}
      style={{ width: size, height: size }}
      aria-hidden="true"
    >
      <span className="avatar__initials" style={{ fontSize: Math.max(9, Math.round(size * 0.34)) }}>
        {initialsFor(name)}
      </span>
      {photo && <img className="avatar__photo" src={photo} alt="" />}
    </span>
  );
}
