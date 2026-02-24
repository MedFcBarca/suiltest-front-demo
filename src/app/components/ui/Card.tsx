import * as React from "react";

export function Card({
  className = "",
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={[
        "rounded-3xl border border-[var(--line)] bg-white/70 backdrop-blur shadow-sm",
        className,
      ].join(" ")}
      {...props}
    />
  );
}