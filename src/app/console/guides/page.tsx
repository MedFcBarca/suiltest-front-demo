"use client";

import * as React from "react";
import { Card } from "@/app/components/ui/Card";
import { Badge } from "@/app/components/ui/Badge";
import { Button } from "@/app/components/ui/Button";
import { useCohorts } from "@/features/cohorts/queries";
import { useToast } from "@/app/components/ui/Toast";

type Guide = {
  id: string;
  title: string;
  theme: "Earth system" | "Human welfare" | "Transitions" | "Basics";
  minutes: number;
};

const GUIDES: Guide[] = [
  { id: "g0", title: "How to read TASK results", theme: "Basics", minutes: 8 },
  { id: "g1", title: "Planetary boundaries essentials", theme: "Earth system", minutes: 12 },
  { id: "g2", title: "Climate basics & tipping points", theme: "Earth system", minutes: 15 },
  { id: "g3", title: "Social foundations & equity", theme: "Human welfare", minutes: 14 },
  { id: "g4", title: "Health, education & SDGs", theme: "Human welfare", minutes: 10 },
  { id: "g5", title: "Business & policy transitions", theme: "Transitions", minutes: 12 },
  { id: "g6", title: "Decarbonization levers", theme: "Transitions", minutes: 11 },
];

const THEMES: Guide["theme"][] = ["Basics", "Earth system", "Human welfare", "Transitions"];

export default function GuidesPage() {
  const cohortsQ = useCohorts();
  const cohorts = cohortsQ.data ?? [];
  const { show } = useToast();

  const [theme, setTheme] = React.useState<Guide["theme"] | "All">("All");
  const [q, setQ] = React.useState("");
  const [assignCohort, setAssignCohort] = React.useState<string>("");

  const filtered = GUIDES
    .filter((g) => (theme === "All" ? true : g.theme === theme))
    .filter((g) => g.title.toLowerCase().includes(q.toLowerCase()));

  function assign(guide: Guide) {
    if (!assignCohort) {
      show("Select a cohort first.");
      return;
    }
    const cohortName = cohorts.find((c) => c.id === assignCohort)?.name ?? assignCohort;
    show(`Assigned “${guide.title}” to ${cohortName} (mock).`);
  }

  return (
    <main className="grid gap-4 fade-in">
      <Card className="p-6 card-hover">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <div className="text-sm font-semibold text-[var(--ink)]">Study Guides</div>
            <p className="mt-1 text-sm text-neutral-600">
              Filter by theme + assign to a cohort.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Badge tone="sun">{filtered.length} guides</Badge>
            <Badge tone="neutral">demo</Badge>
          </div>
        </div>

        <div className="mt-5 grid gap-3 md:grid-cols-[1fr_220px_220px]">
          <label className="grid gap-1">
            <span className="text-xs text-neutral-600">Search</span>
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              className="h-11 rounded-2xl border border-[var(--line)] bg-white/70 px-4 outline-none focus:ring-2 focus:ring-[var(--ink)]"
              placeholder="Search guide…"
            />
          </label>

          <label className="grid gap-1">
            <span className="text-xs text-neutral-600">Theme</span>
            <select
              value={theme}
              onChange={(e) => setTheme(e.target.value as any)}
              className="h-11 rounded-2xl border border-[var(--line)] bg-white/70 px-3 outline-none focus:ring-2 focus:ring-[var(--ink)]"
            >
              <option value="All">All</option>
              {THEMES.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>
          </label>

          <label className="grid gap-1">
            <span className="text-xs text-neutral-600">Assign to cohort</span>
            <select
              value={assignCohort}
              onChange={(e) => setAssignCohort(e.target.value)}
              className="h-11 rounded-2xl border border-[var(--line)] bg-white/70 px-3 outline-none focus:ring-2 focus:ring-[var(--ink)]"
            >
              <option value="">Select…</option>
              {cohorts.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </label>
        </div>
      </Card>

      <div className="grid gap-3 md:grid-cols-2">
        {filtered.map((g) => (
          <Card key={g.id} className="p-6 card-hover">
            <div className="flex items-start justify-between gap-4">
              <div>
                <div className="text-sm font-semibold text-[var(--ink)]">{g.title}</div>
                <div className="mt-1 text-xs text-neutral-600">{g.minutes} min • reading + quiz</div>
                <div className="mt-3">
                  <Badge tone={g.theme === "Basics" ? "sun" : "neutral"}>{g.theme}</Badge>
                </div>
              </div>

              <Button onClick={() => assign(g)} className="shrink-0">
                Assign
              </Button>
            </div>
          </Card>
        ))}

        {filtered.length === 0 && (
          <Card className="p-8 text-sm text-neutral-600 card-hover">
            No guides match your filters.
          </Card>
        )}
      </div>
    </main>
  );
}