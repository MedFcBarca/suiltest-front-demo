"use client";

import Link from "next/link";
import * as React from "react";
import { useRouter } from "next/navigation";
import { Card } from "@/app/components/ui/Card";
import { Badge } from "@/app/components/ui/Badge";
import { Button } from "@/app/components/ui/Button";
import { Progress } from "@/app/components/ui/Progress";
import { THEME_LABEL, ThemeKey } from "@/features/task/questions";
import { useToast } from "@/app/components/ui/Toast";

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

export default function TaskResultPage() {
  const router = useRouter();
  const { show } = useToast();

  const [result, setResult] = React.useState<Result | null>(null);
  const [sending, setSending] = React.useState(false);
  const [sent, setSent] = React.useState("");

  React.useEffect(() => {
    const raw = sessionStorage.getItem("task:lastResult");
    if (!raw) return;
    try {
      setResult(JSON.parse(raw));
    } catch {
      // ignore
    }
  }, []);

  async function sendToConsole() {
    if (!result) return;

    setSending(true);
    setSent("");

    try {
      const res = await fetch("/api/results", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: "Demo Student",
          cohortId: "mba-2026",
          completion: 100,
          score: result.score,
          themes: result.themes,
        }),
      });

      if (!res.ok) throw new Error("Failed");

      show("Result sent to teacher console ✅");
      setSent("Sent! Open the console to see the updated student.");
    } catch {
      show("Error sending result ❌");
      setSent("Error sending result.");
    } finally {
      setSending(false);
    }
  }

  if (!result) {
    return (
      <main className="mx-auto max-w-3xl px-6 py-10 grid gap-4 fade-in">
        <Card className="p-6 card-hover">
          <div className="text-sm text-neutral-600">No result found.</div>
          <div className="mt-4 flex gap-2">
            <Button onClick={() => router.push("/task")}>Go to TASK</Button>
            <Link href="/console/dashboard">
              <Button variant="secondary">Back to console</Button>
            </Link>
          </div>
        </Card>
      </main>
    );
  }

  const weak = weakestThemes(result.themes, 2);
  const recommended = weak.flatMap((k) =>
    GUIDE_BY_THEME[k].map((g) => ({ ...g, tag: THEME_LABEL[k] }))
  );

  return (
    <main className="mx-auto max-w-3xl px-6 py-10 grid gap-4 fade-in">
      <Card className="p-6 card-hover">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <div className="text-xs text-neutral-600">TASK™ demo</div>
            <div className="mt-1 text-2xl font-semibold text-[var(--ink)]">
              Your results
            </div>
            <div className="mt-2 flex flex-wrap gap-2">
              <Badge tone="sun">Score {result.score}/100</Badge>
              <Badge tone="neutral">Finished</Badge>
            </div>
          </div>

          <div className="min-w-[240px]">
            <div className="flex items-center justify-between text-xs text-neutral-600">
              <span>Overall</span>
              <span className="font-semibold text-[var(--ink)]">{result.score}%</span>
            </div>
            <div className="mt-2">
              <Progress value={result.score} barClassName="bg-[var(--sun)]" />
            </div>

            <div className="mt-4 flex flex-wrap gap-2 justify-end">
              <Button onClick={sendToConsole} disabled={sending}>
                {sending ? "Sending…" : "Send to console"}
              </Button>
            </div>

            {sent && (
              <div className="mt-3 text-sm text-neutral-700">
                <span className="font-semibold text-[var(--ink)]">✓</span> {sent}
              </div>
            )}
          </div>
        </div>
      </Card>

      <section className="grid gap-4 md:grid-cols-3">
        {(Object.entries(result.themes) as [ThemeKey, number][]).map(([k, v]) => (
          <Card key={k} className="p-6 card-hover">
            <div className="flex items-center justify-between">
              <div className="text-sm font-semibold text-[var(--ink)]">{THEME_LABEL[k]}</div>
              {v < 60 ? <Badge tone="sun">Focus</Badge> : <Badge tone="neutral">OK</Badge>}
            </div>
            <div className="mt-4 text-3xl font-semibold text-[var(--ink)]">{v}</div>
            <div className="mt-1 text-xs text-neutral-600">/100</div>
            <div className="mt-4">
              <Progress value={v} />
            </div>
          </Card>
        ))}
      </section>

      <Card className="p-6 card-hover">
        <div className="flex items-center justify-between gap-3">
          <div>
            <div className="text-sm font-semibold text-[var(--ink)]">Recommended study guides</div>
            <p className="mt-1 text-sm text-neutral-600">Suggested based on your weakest themes.</p>
          </div>
          <Link href="/console/guides" className="text-sm font-semibold text-[var(--ink)] hover:underline">
            Browse all →
          </Link>
        </div>

        <div className="mt-5 grid gap-2">
          {recommended.slice(0, 5).map((g) => (
            <div key={g.title} className="rounded-3xl border border-[var(--line)] bg-white p-4 card-hover">
              <div className="flex items-center justify-between gap-3">
                <div className="font-semibold text-[var(--ink)]">{g.title}</div>
                <Badge tone="neutral">{g.tag}</Badge>
              </div>
              <div className="mt-1 text-xs text-neutral-600">{g.minutes} min • reading + quiz</div>
            </div>
          ))}
        </div>

        <div className="mt-6 flex flex-wrap gap-3">
          <Link href="/task/run">
            <Button>Retake assessment</Button>
          </Link>
          <Link href="/console/dashboard">
            <Button variant="secondary">Back to console</Button>
          </Link>
        </div>
      </Card>
    </main>
  );
}