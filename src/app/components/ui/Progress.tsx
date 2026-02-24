import * as React from "react";

export function Progress({
  value,
  className = "",
  barClassName = "",
}: {
  value: number;
  className?: string;
  barClassName?: string;
}) {
  const v = Math.max(0, Math.min(100, value));
  return (
    <div className={["h-2 rounded-full bg-neutral-100 overflow-hidden", className].join(" ")}>
      <div
        className={["h-full rounded-full", barClassName || "bg-[var(--teal)]/70"].join(" ")}
        style={{ width: `${v}%` }}
        aria-hidden="true"
      />
    </div>
  );
}