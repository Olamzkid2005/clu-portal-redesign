import { lazy, Suspense } from "react";
import { heroAmbient } from "./heroAmbientData";

const Lottie = lazy(() => import("lottie-react"));

export default function HeroAmbient() {
  return (
    <div className="student-hero__ambient" aria-hidden="true">
      <Suspense fallback={null}>
        <Lottie
          animationData={heroAmbient}
          loop
          autoplay
          rendererSettings={{ preserveAspectRatio: "xMidYMid slice" }}
        />
      </Suspense>
    </div>
  );
}
