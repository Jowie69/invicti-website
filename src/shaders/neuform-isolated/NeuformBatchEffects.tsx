import type { CSSProperties } from "react";

export type NeuformBatchEffectProps = {
  variant?: string;
  mode?: "dark" | "light" | "auto";
  speed?: number;
  size?: number;
  gap?: number;
  length?: number;
  density?: number;
  strokeWidth?: number;
  opacity?: number;
  hue?: number;
  saturation?: number;
  brightness?: number;
  className?: string;
  style?: CSSProperties;
};

export function MatrixField(_props: NeuformBatchEffectProps) {
  return <div className="threeui-background laser-variant" style={{ background: "#000000" }} />;
}
