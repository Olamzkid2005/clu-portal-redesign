import { useEffect, useRef } from "react";

/**
 * A decorative, silent hero animation.
 *
 * The source files are bundled locally so the portal never waits on an
 * external CDN. The poster frame is the first frame of the video; browsers
 * that cannot autoplay (or visitors who ask for reduced motion) still get a
 * useful illustration instead of an empty box.
 */
export default function HeroAnimation({
  src,
  poster,
  label,
  className,
}: {
  src: string;
  poster: string;
  label: string;
  className?: string;
}) {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const motion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const sync = () => {
      if (motion.matches) {
        video.pause();
      } else {
        void video.play().catch(() => {
          // Autoplay can be blocked by the browser; the poster remains visible.
        });
      }
    };

    sync();
    motion.addEventListener?.("change", sync);

    return () => {
      motion.removeEventListener?.("change", sync);
    };
  }, []);

  const frameClass = ["hero-animation", className].filter(Boolean).join(" ");

  return (
    <div className={frameClass} role="img" aria-label={label}>
      <video
        ref={videoRef}
        className="hero-animation__video"
        src={src}
        poster={poster}
        autoPlay
        loop
        muted
        playsInline
        preload="metadata"
        aria-hidden="true"
        tabIndex={-1}
      />
    </div>
  );
}
