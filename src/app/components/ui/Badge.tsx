import * as React from "react";

type Props = React.HTMLAttributes<HTMLSpanElement> & {
  tone?: "sun" | "teal" | "neutral";
};

export function Badge({ tone = "neutral", className = "", ...props }: Props) {
  const toneClass =
    tone === "sun"
      ? "bg-[var(--sun)] text-[var(--ink)]"
      : tone === "teal"
      ? "bg-[var(--teal)]/15 text-[var(--ink)]"
      : "bg-neutral-100 text-neutral-700";

  return (
    <span
      className={[
        "inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold",
        toneClass,
        className,
      ].join(" ")}
      {...props}
    />
  );
}