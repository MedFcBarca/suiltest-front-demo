"use client";

import Link from "next/link";
import * as React from "react";
import { Card } from "@/app/components/ui/Card";
import { Badge } from "@/app/components/ui/Badge";
import { Button } from "@/app/components/ui/Button";
import { Progress } from "@/app/components/ui/Progress";
import { THEME_LABEL, ThemeKey } from "@/features/task/questions";

type Result = {
  finishedAt: string;
  score: number;
  themes: Record<ThemeKey, number>;
};

const GUIDE_BY_THEME: Record<ThemeKey, { title: string; minutes: number }[]> = {
  earthSystem: [
    { title: "Planetary boundaries essentials", minutes: 12 },
    { title: "Climate basics & tipping points", minutes: 15 },
  ],
  humanWelfare: [
    { title: "Social foundations & equity", minutes: 14 },
    { title: "Health, education & SDGs", minutes: 10 },
  ],
  transitions: [
    { title: "Business & policy transitions", minutes: 12 },
    { title: "Decarbonization levers", minutes: 11 },
  ],
};

function weakestThemes(themes: Record<ThemeKey, number>, n = 2): ThemeKey[] {
  return (Object.entries(themes) as [ThemeKey, number][])
    .sort((a, b) => a[1] - b[1])
    .slice(0, n)
    .map(([k]) => k);
}

function formatDate(iso: string) {
  try {
    const d = new Date(iso);
    return d.toLocaleString(undefined, { dateStyle: "medium", timeStyle: "short" });
  } catch {
    return iso;
  }
}

export default function StudentDashboardPage() {
  const [result, setResult] = React.useState<Result | null>(null);

  React.useEffect(() => {
    const raw = sessionStorage.getItem("task:lastResult");
    if (!raw) return;
    try {
      setResult(JSON.parse(raw));
    } catch {
      // ignore
    }
  }, []);

  const hasResult = Boolean(result);
  const score = result?.score ?? 0;

  const weak = result ? weakestThemes(result.themes, 2) : (["earthSystem", "humanWelfare"] as ThemeKey[]);
  const recommended = result
    ? [
        { title: "How to read your TASK results", minutes: 8, tag: "Basics" as const },
        ...weak.flatMap((k) =>
          GUIDE_BY_THEME[k].map((g) => ({
            ...g,
            tag: THEME_LABEL[k],
          }))
        ),
      ].slice(0, 5)
    : [
        { title: "How to read your TASK results", minutes: 8, tag: "Basics" as const },
        { title: "Planetary boundaries essentials", minutes: 12, tag: "Earth system" as const },
        { title: "Social foundations & equity", minutes: 14, tag: "Human welfare" as const },
      ];

  return (
    <div className="min-h-screen flex flex-col bg-[var(--bg,transparent)]">
      <Navbar hasResult={hasResult} />

      <main className="mx-auto w-full max-w-5xl px-6 py-8 md:py-10 grid gap-4 flex-1">
        <Card className="p-6 card-hover">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <div className="text-xs text-neutral-600">Student space</div>
              <h1 className="mt-1 text-2xl font-semibold tracking-tight text-[var(--ink)]">
                My sustainability profile
              </h1>
              <p className="mt-2 text-sm text-neutral-700">
                Review your latest TASK demo result and continue learning.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <Badge tone="teal">Student</Badge>
              <Badge tone="sun">demo</Badge>
              <Link href="/task">
                <Button>{hasResult ? "Retake TASK" : "Start TASK"}</Button>
              </Link>
            </div>
          </div>
        </Card>

        <section className="grid gap-4 md:grid-cols-3">
          <Card className="p-6 md:col-span-2">
            <div className="flex items-start justify-between gap-4">
              <div>
                <div className="text-sm font-semibold text-[var(--ink)]">Latest result</div>
                <p className="mt-1 text-sm text-neutral-600">
                  {hasResult ? `Completed ${formatDate(result!.finishedAt)}` : "No assessment completed yet."}
                </p>
                <div className="mt-3 flex flex-wrap gap-2">
                  <Badge tone="sun">{hasResult ? `Score ${score}/100` : "Score —"}</Badge>
                  <Badge tone="neutral">{hasResult ? "Stored locally" : "Ready when you are"}</Badge>
                </div>
              </div>

              <div className="min-w-[220px]">
                <div className="flex items-center justify-between text-xs text-neutral-600">
                  <span>Overall</span>
                  <span className="font-semibold text-[var(--ink)]">{hasResult ? `${score}%` : "—"}</span>
                </div>
                <div className="mt-2">
                  <Progress value={hasResult ? score : 0} barClassName="bg-[var(--sun)]" />
                </div>
              </div>
            </div>

            {hasResult && (
              <div className="mt-6 grid gap-3 sm:grid-cols-3">
                {(Object.entries(result!.themes) as [ThemeKey, number][]).map(([k, v]) => (
                  <div key={k} className="rounded-3xl border border-[var(--line)] bg-white p-4">
                    <div className="flex items-center justify-between">
                      <div className="text-sm font-semibold text-[var(--ink)]">{THEME_LABEL[k]}</div>
                      {v < 60 ? <Badge tone="sun">Focus</Badge> : <Badge tone="neutral">OK</Badge>}
                    </div>
                    <div className="mt-3 text-2xl font-semibold text-[var(--ink)]">{v}</div>
                    <div className="mt-1 text-xs text-neutral-600">/100</div>
                    <div className="mt-3">
                      <Progress value={v} />
                    </div>
                  </div>
                ))}
              </div>
            )}

            {!hasResult && (
              <div className="mt-6 rounded-3xl border border-[var(--line)] bg-white p-5 text-sm text-neutral-700">
                Take the TASK demo to generate your first result. Your breakdown by theme will appear here.
              </div>
            )}
          </Card>

          <Card className="p-6 card-hover">
            <div className="text-sm font-semibold text-[var(--ink)]">Next steps</div>
            <div className="mt-4 grid gap-2">
              <Step
                n="1"
                title={hasResult ? "Review your weakest themes" : "Start with a baseline"}
                desc={hasResult ? "Focus on the themes with the lowest score." : "Take the demo assessment to get a score."}
              />
              <Step
                n="2"
                title="Study recommended guides"
                desc="Short, targeted resources to improve your understanding."
              />
              <Step
                n="3"
                title="Retake the assessment"
                desc="See how your score evolves over time."
              />
            </div>

            <div className="mt-6 flex flex-col gap-2">
              <Link href="/task">
                <Button className="w-full">{hasResult ? "Retake TASK" : "Start TASK"}</Button>
              </Link>
              <Link href="/console/dashboard">
                <Button variant="secondary" className="w-full">
                  Teacher console (demo)
                </Button>
              </Link>
            </div>
          </Card>
        </section>

        <Card className="p-6 card-hover">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <div className="text-sm font-semibold text-[var(--ink)]">Recommended study guides</div>
              <p className="mt-1 text-sm text-neutral-600">
                Personalized suggestions (demo) based on your weakest themes.
              </p>
            </div>
            <Link href="/console/guides" className="text-sm font-semibold text-[var(--ink)] hover:underline">
              Browse all →
            </Link>
          </div>

          <div className="mt-5 grid gap-2 md:grid-cols-2">
            {recommended.map((g) => (
              <div
                key={g.title}
                className="rounded-3xl border border-[var(--line)] bg-white p-4 hover:bg-neutral-50 smooth"
              >
                <div className="flex items-center justify-between gap-3">
                  <div className="font-semibold text-[var(--ink)]">{g.title}</div>
                  <Badge tone={g.tag === "Basics" ? "sun" : "neutral"}>{g.tag}</Badge>
                </div>
                <div className="mt-1 text-xs text-neutral-600">{g.minutes} min • reading + quiz</div>
              </div>
            ))}
          </div>
        </Card>
      </main>

      <Footer />
    </div>
  );
}

function Navbar({ hasResult }: { hasResult: boolean }) {
  return (
    <header className="sticky top-0 z-30 border-b border-[var(--line)] bg-white/75 backdrop-blur">
      <div className="mx-auto max-w-5xl px-6 h-14 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <div className="h-9 w-9 rounded-2xl bg-[var(--teal)]/15 grid place-items-center font-semibold text-[var(--ink)]">
            T
          </div>
          <div className="leading-tight">
            <div className="text-sm font-semibold text-[var(--ink)]">TASK</div>
            <div className="text-[11px] text-neutral-600">Student dashboard</div>
          </div>
        </Link>

        <nav className="hidden md:flex items-center gap-1">
          <NavLink href="/task">Assessment</NavLink>
          <NavLink href="/console/guides">Guides</NavLink>
          <NavLink href="/console/dashboard">Teacher</NavLink>
        </nav>

        <div className="flex items-center gap-2">
          <Badge tone="neutral" className="hidden sm:inline-flex">
            {hasResult ? "Result saved" : "No result yet"}
          </Badge>
          <Link href="/task">
            <Button className="h-9 px-3 rounded-2xl">{hasResult ? "Retake" : "Start"}</Button>
          </Link>
        </div>
      </div>
    </header>
  );
}

function NavLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <Link
      href={href}
      className="px-3 h-9 inline-flex items-center rounded-2xl text-sm font-semibold text-[var(--ink)] hover:bg-neutral-100 smooth"
    >
      {children}
    </Link>
  );
}

function Footer() {
  return (
    <footer className="border-t border-[var(--line)] bg-white">
      <div className="mx-auto max-w-5xl px-6 py-8">
        <div className="flex flex-wrap items-start justify-between gap-6">
          <div>
            <div className="text-sm font-semibold text-[var(--ink)]">TASK demo</div>
            <div className="mt-1 text-sm text-neutral-600 max-w-[52ch]">
              This is a demo student dashboard. Results are stored locally in your browser (sessionStorage).
            </div>
          </div>

          <div className="grid gap-2 text-sm">
            <Link href="/task" className="font-semibold text-[var(--ink)] hover:underline">
              Take assessment
            </Link>
            <Link href="/console/guides" className="font-semibold text-[var(--ink)] hover:underline">
              Study guides
            </Link>
            <Link href="/console/dashboard" className="font-semibold text-[var(--ink)] hover:underline">
              Teacher console
            </Link>
          </div>
        </div>

        <div className="mt-6 flex flex-wrap items-center justify-between gap-3 text-xs text-neutral-600">
          <span>© {new Date().getFullYear()} TASK • Demo experience</span>
          <div className="flex items-center gap-3">
            <span className="hover:underline cursor-default">Privacy</span>
            <span className="hover:underline cursor-default">Terms</span>
          </div>
        </div>
      </div>
    </footer>
  );
}

function Step({ n, title, desc }: { n: string; title: string; desc: string }) {
  return (
    <div className="rounded-3xl border border-[var(--line)] bg-white p-4">
      <div className="flex items-start gap-3">
        <div className="h-9 w-9 rounded-2xl bg-[var(--teal)]/15 grid place-items-center font-semibold text-[var(--ink)]">
          {n}
        </div>
        <div>
          <div className="text-sm font-semibold text-[var(--ink)]">{title}</div>
          <div className="mt-1 text-xs text-neutral-600">{desc}</div>
        </div>
      </div>
    </div>
  );
}