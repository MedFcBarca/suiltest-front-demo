"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function ConsoleLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative min-h-screen overflow-hidden">
      <div className="absolute inset-0 -z-10 bg-gradient-to-br from-[var(--mint)]/60 via-white to-white" />
      <div className="absolute -z-10 right-[-140px] top-[-140px] h-[420px] w-[420px] rounded-full bg-[var(--teal)]/18 blur-3xl" />
      <div className="absolute -z-10 left-[-140px] bottom-[-140px] h-[460px] w-[460px] rounded-full bg-[var(--sun)]/18 blur-3xl" />

      <div className="mx-auto max-w-7xl px-4 py-6 grid gap-6 md:grid-cols-[280px_1fr]">
        <aside className="rounded-3xl bg-[var(--navy)] text-white shadow-sm border border-white/10">
          <div className="p-5">
            <div className="flex items-center justify-between">
              <div className="text-sm font-semibold tracking-tight">
                TASK™ Console
              </div>

              <span className="rounded-full bg-[var(--sun)] px-2.5 py-1 text-xs font-semibold text-[var(--ink)]">
                demo
              </span>
            </div>

            <div className="mt-4 rounded-2xl bg-white/10 p-3">
              <div className="text-xs text-white/60">Workspace</div>
              <div className="mt-1 text-sm font-medium">Sulitest Impact</div>
            </div>

            <nav className="mt-6 grid gap-1">
              <Nav href="/console/dashboard" label="Dashboard" />
              <Nav href="/console/cohorts" label="Cohorts" />
              <Nav href="/console/students" label="Students" />
              <Nav href="/console/guides" label="Study Guides" />

              <div className="my-2 border-t border-white/10" />

              <Nav href="/task" label="TASK demo" subtle />
              <Nav href="/student" label="Student" subtle />
            </nav>
          </div>
        </aside>

        <div className="grid gap-4 fade-in">
          <header className="rounded-3xl border border-[var(--line)] bg-white/70 backdrop-blur px-5 py-4 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-xs text-neutral-600">
                  Admin • Teacher
                </div>
                <div className="text-sm font-semibold text-[var(--ink)]">
                  Teacher Dashboard
                </div>
              </div>

              <Link
                className="text-sm font-semibold text-[var(--ink)] hover:underline smooth"
                href="/"
              >
                Sulitest Demo
              </Link>
            </div>
          </header>

          {children}
        </div>
      </div>
    </div>
  );
}

function Nav({
  href,
  label,
  subtle,
}: {
  href: string;
  label: string;
  subtle?: boolean;
}) {
  const pathname = usePathname();

  const active =
    pathname === href ||
    (href !== "/console/dashboard" && pathname.startsWith(href));

  return (
    <Link
      href={href}
      className={[
        "flex items-center justify-between rounded-2xl px-4 py-2.5 text-sm smooth",
        subtle
          ? "text-white/55 hover:text-white/80 hover:bg-white/5"
          : active
          ? "bg-white/10 text-white"
          : "text-white/75 hover:text-white hover:bg-white/10",
      ].join(" ")}
    >
      <span className="font-medium">{label}</span>

      {active && (
        <span className="h-1.5 w-1.5 rounded-full bg-[var(--sun)]" />
      )}
    </Link>
  );
}