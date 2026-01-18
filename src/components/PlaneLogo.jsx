"use client";
import { DotLottieReact } from "@lottiefiles/dotlottie-react";

const PlaneLogo = () => {
  return (
    <div>
      <DotLottieReact
        src='plane.json'
        loop
        autoplay
        style={{ width: "400px", height: "400px" }}
      />
    </div>
  );
};

export default PlaneLogo;
