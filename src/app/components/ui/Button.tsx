import * as React from "react";

type Props = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "secondary" | "ghost";
};

export function Button({ variant = "primary", className = "", ...props }: Props) {
  const base =
    "inline-flex items-center justify-center rounded-full px-5 py-2.5 text-sm font-semibold " +
    "transition shadow-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 " +
    "disabled:opacity-50 disabled:cursor-not-allowed";

  const v =
    variant === "primary"
      ? "bg-[var(--ink)] text-white hover:opacity-90 focus-visible:ring-[var(--ink)]"
      : variant === "secondary"
      ? "bg-white text-[var(--ink)] border border-[var(--line)] hover:bg-neutral-50 focus-visible:ring-[var(--ink)]"
      : "bg-transparent text-[var(--ink)] hover:bg-neutral-100 focus-visible:ring-[var(--ink)]";

  return <button type={props.type ?? "button"} className={`${base} ${v} ${className}`} {...props} />;
}