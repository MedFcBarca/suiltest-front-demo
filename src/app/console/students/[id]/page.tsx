"use client";

import Link from "next/link";
import { notFound, useParams } from "next/navigation";
import * as React from "react";
import { Card } from "@/app/components/ui/Card";
import { Badge } from "@/app/components/ui/Badge";
import { Progress } from "@/app/components/ui/Progress";
import { Button } from "@/app/components/ui/Button";
import { useStudents } from "@/features/students/queries";

type ThemeKey = "earthSystem" | "humanWelfare" | "transitions";

const THEME_LABEL: Record<ThemeKey, string> = {
  earthSystem: "Earth system",
  humanWelfare: "Human welfare",
  transitions: "Transitions",
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

function avgThemeScore(themes: Record<ThemeKey, number>) {
  const vals = Object.values(themes);
  return Math.round(vals.reduce((a, b) => a + b, 0) / vals.length);
}

function weakestThemes(themes: Record<ThemeKey, number>, n = 2): ThemeKey[] {
  return (Object.entries(themes) as [ThemeKey, number][])
    .sort((a, b) => a[1] - b[1])
    .slice(0, n)
    .map(([k]) => k);
}

function toneForScore(v: number) {
  if (v < 50) return { badge: "sun" as const, label: "Needs focus" };
  if (v < 70) return { badge: "neutral" as const, label: "Developing" };
  return { badge: "teal" as const, label: "Strong" };
}

function riskForStudent(completion: number, score: number) {
  const atRisk = completion < 55 || score < 50;
  return atRisk
    ? { tone: "sun" as const, label: "At risk" }
    : { tone: "teal" as const, label: "On track" };
}

function Stat({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="rounded-2xl border border-[var(--line)] bg-white/70 px-4 py-3">
      <div className="text-xs text-neutral-600">{label}</div>
      <div className="mt-1 text-sm font-semibold text-[var(--ink)]">{value}</div>
    </div>
  );
}

export default function StudentDetail() {
  const params = useParams<{ id: string }>();
  const id = params?.id;

  const q = useStudents();
  const s = q.data?.find((x) => x.id === id);

  if (!q.isLoading && id && !s) return notFound();

  if (!s) {
    return (
      <main className="grid gap-4">
        <Card className="p-6 card-hover">
          <div className="animate-pulse grid gap-4">
            <div className="h-5 w-40 rounded bg-neutral-200" />
            <div className="h-8 w-72 rounded bg-neutral-200" />
            <div className="grid grid-cols-2 gap-3">
              <div className="h-12 rounded-2xl bg-neutral-200" />
              <div className="h-12 rounded-2xl bg-neutral-200" />
            </div>
          </div>
        </Card>
      </main>
    );
  }

  const meanTheme = avgThemeScore(s.themes);
  const weak = weakestThemes(s.themes, 2);
  const risk = riskForStudent(s.completion, s.score);

  const recommended = [
    { title: "How to read your TASK results", minutes: 8, tag: "Basics" },
    ...weak.flatMap((k) =>
      GUIDE_BY_THEME[k].map((g) => ({
        title: g.title,
        minutes: g.minutes,
        tag: THEME_LABEL[k],
      }))
    ),
  ].slice(0, 5);

  const totalMinutes = recommended.reduce((a, g) => a + g.minutes, 0);

  return (
    <main className="grid gap-4 fade-in">
      <Card className="p-6 card-hover">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="min-w-[260px]">
            <div className="flex items-center gap-2">
              <div className="text-xs text-neutral-600">Student</div>
              <Badge tone={risk.tone}>{risk.label}</Badge>
            </div>

            <div className="mt-1 text-2xl font-semibold text-[var(--ink)]">{s.name}</div>

            <div className="mt-2 flex flex-wrap gap-2">
              <Badge tone="teal">{s.cohortId}</Badge>
              <Badge tone="neutral">ID #{s.id}</Badge>
            </div>

            <div className="mt-4 flex flex-wrap gap-2">
              <Button variant="secondary" className="rounded-2xl h-9 px-3 text-sm">
                Message
              </Button>
              <Button variant="ghost" className="rounded-2xl h-9 px-3 text-sm">
                Assign guide
              </Button>
            </div>
          </div>

          <div className="grid gap-3 min-w-[280px]">
            <div className="grid grid-cols-2 gap-3">
              <Stat label="Completion" value={`${s.completion}%`} />
              <Stat label="Overall score" value={`${s.score}/100`} />
            </div>

            <div className="rounded-2xl border border-[var(--line)] bg-white/70 p-4">
              <div className="flex items-center justify-between text-xs text-neutral-600">
                <span>Completion</span>
                <span className="font-semibold text-[var(--ink)]">{s.completion}%</span>
              </div>
              <div className="mt-2">
                <Progress value={s.completion} barClassName="bg-[var(--sun)]" label="Completion" />
              </div>
            </div>
          </div>
        </div>
      </Card>

      <section className="grid gap-4 md:grid-cols-3">
        {(Object.entries(s.themes) as [ThemeKey, number][]).map(([k, v]) => {
          const t = toneForScore(v);
          const isPriority = weak.includes(k);

          return (
            <Card key={k} className="p-6 card-hover">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <div className="text-sm font-semibold text-[var(--ink)]">{THEME_LABEL[k]}</div>
                  <div className="mt-1 text-xs text-neutral-600">{t.label}</div>
                </div>

                <div className="flex items-center gap-2">
                  {isPriority && <Badge tone="sun">Priority</Badge>}
                  <Badge tone={t.badge}>{v}</Badge>
                </div>
              </div>

              <div className="mt-4">
                <div className="flex items-center justify-between text-xs text-neutral-600">
                  <span>Score</span>
                  <span className="font-semibold text-[var(--ink)]">{v}/100</span>
                </div>
                <div className="mt-2">
                  <Progress value={v} />
                </div>
              </div>
            </Card>
          );
        })}
      </section>

      <Card className="p-6 card-hover">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <div className="text-sm font-semibold text-[var(--ink)]">Recommended Study Guides</div>
            <p className="mt-1 text-sm text-neutral-600">
              Based on weakest themes (avg themes: {meanTheme}/100) • ~{totalMinutes} min total
            </p>
          </div>

          <Link href="/console/guides" className="text-sm font-semibold text-[var(--ink)] hover:underline">
            Browse all →
          </Link>
        </div>

        <div className="mt-5 grid gap-2">
          {recommended.map((g) => (
            <div
              key={g.title}
              className="rounded-3xl border border-[var(--line)] bg-white p-4 hover:bg-neutral-50 smooth"
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <div className="font-semibold text-[var(--ink)]">{g.title}</div>
                  <div className="mt-1 text-xs text-neutral-600">
                    {g.minutes} min • reading + quiz
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <Badge tone={g.tag === "Basics" ? "sun" : "neutral"}>{g.tag}</Badge>
                  <Button variant="ghost" className="h-9 px-3 rounded-2xl text-sm">
                    Assign
                  </Button>
                </div>
              </div>
            </div>
          ))}

          {recommended.length === 0 && (
            <div className="rounded-3xl border border-[var(--line)] bg-white p-6 text-sm text-neutral-600">
              No recommendations right now.
            </div>
          )}
        </div>
      </Card>

      <div className="text-sm">
        <Link className="font-semibold text-[var(--ink)] hover:underline" href="/console/students">
          ← Back to students
        </Link>
      </div>
    </main>
  );
}