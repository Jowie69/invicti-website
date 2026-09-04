import { useEffect, useRef, type CSSProperties } from "react";

interface PreloaderProps {
  onComplete: () => void;
}

const TOTAL_STEPS = 8;
const STEP_DELAY_MS = 55;
const HOLD_MS = 500;
const EXIT_MS = 400;
const TOTAL_MS =
  STEP_DELAY_MS * (TOTAL_STEPS - 1) +
  HOLD_MS +
  EXIT_MS;

export function Preloader({ onComplete }: PreloaderProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    document.body.style.overflow = "hidden";

    const timer = setTimeout(() => {
      if (ref.current) {
        ref.current.classList.add("preloader--exit");
      }
      setTimeout(() => {
        document.body.style.overflow = "";
        onComplete();
      }, EXIT_MS + 80);
    }, TOTAL_MS - EXIT_MS);

    return () => {
      clearTimeout(timer);
      document.body.style.overflow = "";
    };
  }, [onComplete]);

  const stairs = Array.from({ length: TOTAL_STEPS }, (_, i) => i);

  return (
    <div className="preloader" ref={ref} aria-label="Loading INVICTI" role="status">
      <div className="preloader__stairs preloader__stairs--top">
        {stairs.map((i) => (
          <div
            key={i}
            className="preloader__step preloader__step--top"
            style={{ "--step-delay": `${i * STEP_DELAY_MS}ms` } as CSSProperties}
          />
        ))}
      </div>

      <div className="preloader__stairs preloader__stairs--bottom">
        {stairs.map((i) => (
          <div
            key={i}
            className="preloader__step preloader__step--bottom"
            style={{ "--step-delay": `${i * STEP_DELAY_MS}ms` } as CSSProperties}
          />
        ))}
      </div>

      <div className="preloader__logo-wrap" aria-hidden="true">
        <img
          src="/logo-favicon.svg"
          alt=""
          className="preloader__logo"
          width="96"
          height="96"
        />
      </div>
    </div>
  );
}
