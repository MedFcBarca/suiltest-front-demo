"use client";

import Link from "next/link";
import { notFound, useParams } from "next/navigation";
import * as React from "react";
import { Card } from "@/app/components/ui/Card";
import { Badge } from "@/app/components/ui/Badge";
import { Progress } from "@/app/components/ui/Progress";
import { Button } from "@/app/components/ui/Button";
import { useCohorts } from "@/features/cohorts/queries";
import { useStudents } from "@/features/students/queries";

type MetricMode = "score" | "completion";

function bucketForScore(v: number) {
  if (v < 45) return 0;
  if (v < 55) return 1;
  if (v < 65) return 2;
  if (v < 75) return 3;
  return 4;
}
const SCORE_BUCKET_LABELS = ["<45", "45–54", "55–64", "65–74", "75+"];

function bucketForCompletion(v: number) {
  if (v < 40) return 0;
  if (v < 55) return 1;
  if (v < 70) return 2;
  if (v < 85) return 3;
  return 4;
}
const COMPLETION_BUCKET_LABELS = ["<40", "40–54", "55–69", "70–84", "85+"];

export default function CohortDetail() {
  const params = useParams<{ id: string }>();
  const id = params?.id;

  const cohortsQ = useCohorts();
  const studentsQ = useStudents();

  const cohort = cohortsQ.data?.find((c) => c.id === id);
  if (!cohortsQ.isLoading && id && !cohort) return notFound();

  const students = React.useMemo(() => {
    return (studentsQ.data ?? []).filter((s) => s.cohortId === id);
  }, [studentsQ.data, id]);

  const [mode, setMode] = React.useState<MetricMode>("score");
  const [hoverIndex, setHoverIndex] = React.useState<number | null>(null);
  const [animate, setAnimate] = React.useState(false);

  const distribution = React.useMemo(() => {
    const counts = [0, 0, 0, 0, 0];
    for (const s of students) {
      const v = mode === "score" ? s.score : s.completion;
      const b = mode === "score" ? bucketForScore(v) : bucketForCompletion(v);
      counts[b]++;
    }
    return counts;
  }, [students, mode]);

  const bucketLabels = mode === "score" ? SCORE_BUCKET_LABELS : COMPLETION_BUCKET_LABELS;

  React.useEffect(() => {
    setAnimate(false);
    const t = window.setTimeout(() => setAnimate(true), 30);
    return () => window.clearTimeout(t);
  }, [id, mode, distribution.join("|")]);

  const max = Math.max(...distribution, 1);

  const atRisk = React.useMemo(() => {
    return students
      .filter((s) => s.completion < 55 || s.score < 50)
      .sort((a, b) => a.score - b.score)
      .slice(0, 8);
  }, [students]);

  const avgCompletion =
    students.length === 0 ? 0 : Math.round(students.reduce((a, s) => a + s.completion, 0) / students.length);

  const avgScore =
    students.length === 0 ? 0 : Math.round((students.reduce((a, s) => a + s.score, 0) / students.length) * 10 / students.length) * 10 / 10;

  return (
    <main className="grid gap-4 fade-in">
      <Card className="p-6 card-hover">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <div className="text-xs text-neutral-600">Cohort</div>
            <div className="mt-1 text-2xl font-semibold text-[var(--ink)]">
              {cohort?.name ?? "Loading…"}
            </div>
            <div className="mt-2 flex flex-wrap gap-2">
              <Badge tone="teal">{id ?? "…"}</Badge>
              <Badge tone="neutral">{cohort?.size ?? students.length} learners</Badge>
              <Badge tone="sun">{students.length ? `${avgScore} avg score` : "— avg score"}</Badge>
            </div>
          </div>

          <div className="grid gap-3 min-w-[280px]">
            <div className="flex items-center justify-between text-xs text-neutral-600">
              <span>Completion</span>
              <span className="font-semibold text-[var(--ink)]">{cohort?.completion ?? avgCompletion}%</span>
            </div>
            <Progress value={cohort?.completion ?? avgCompletion} barClassName="bg-[var(--sun)]" />

            <div className="flex items-center justify-between text-xs text-neutral-600 mt-1">
              <span>Avg score</span>
              <span className="font-semibold text-[var(--ink)]">{cohort?.avgScore ?? avgScore}</span>
            </div>
          </div>
        </div>
      </Card>

      <section className="grid gap-4 md:grid-cols-2">
        <Card className="p-6 card-hover">
          <div className="flex items-start justify-between gap-4">
            <div>
              <div className="text-sm font-semibold text-[var(--ink)]">
                Distribution by {mode === "score" ? "score" : "completion"}
              </div>
              <p className="mt-1 text-sm text-neutral-600">
                Hover bars to inspect. Animated, no heavy chart library.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <Segmented
                value={mode}
                onChange={setMode}
                items={[
                  { key: "score", label: "Score" },
                  { key: "completion", label: "Completion" },
                ]}
              />
            </div>
          </div>

          <div className="mt-6">
            <div className="relative h-[200px] rounded-3xl border border-[var(--line)] bg-white p-4 overflow-hidden">
              <div className="absolute inset-0 pointer-events-none opacity-[0.35]">
                <div className="h-full w-full grid grid-rows-4">
                  <div className="border-b border-[var(--line)]" />
                  <div className="border-b border-[var(--line)]" />
                  <div className="border-b border-[var(--line)]" />
                  <div />
                </div>
              </div>

              <div className="relative h-full grid grid-cols-5 gap-3 items-end">
                {distribution.map((count, i) => {
                  const pct = (count / max) * 100;

                  return (
                    <button
                      key={i}
                      type="button"
                      onMouseEnter={() => setHoverIndex(i)}
                      onMouseLeave={() => setHoverIndex(null)}
                      className="group relative h-full flex flex-col justify-end focus:outline-none"
                    >
                      {hoverIndex === i && (
                        <div className="absolute -top-3 left-1/2 -translate-x-1/2 -translate-y-full z-10">
                          <div className="rounded-2xl border border-[var(--line)] bg-white/90 backdrop-blur px-3 py-2 shadow-sm">
                            <div className="text-xs text-neutral-600">{bucketLabels[i]}</div>
                            <div className="text-sm font-semibold text-[var(--ink)]">{count} learners</div>
                          </div>
                        </div>
                      )}

                      <div className="relative w-full flex-1 flex items-end">
                        <div
                        className={[
                          "w-full h-full rounded-2xl border border-[var(--line)] bg-[var(--teal)]/15 overflow-hidden flex flex-col justify-end",
                          "transition-transform duration-200 ease-out",
                          hoverIndex === i ? "scale-[1.02]" : "scale-100",
                        ].join(" ")}
                        >
                          <div
                            className={[
                              "w-full rounded-2xl bg-[var(--teal)]/70",
                              "transition-[height] duration-700 ease-out",
                              hoverIndex === i ? "bg-[var(--teal)]" : "",
                            ].join(" ")}
                            style={{ height: animate ? `${pct}%` : "0%" }}
                            aria-hidden="true"
                          />
                        </div>
                      </div>

                      <div className="mt-3 text-center">
                        <div className="text-xs text-neutral-600">{bucketLabels[i]}</div>
                        <div className="mt-1 text-sm font-semibold text-[var(--ink)]">{count}</div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="mt-3 flex items-center justify-between text-xs text-neutral-600">
              <span>Lower</span>
              <span>Higher</span>
            </div>

            <Sparkline values={distribution} label="Trend (demo)" />
          </div>
        </Card>

        <Card className="p-6 card-hover">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm font-semibold text-[var(--ink)]">At-risk learners</div>
              <p className="mt-1 text-sm text-neutral-600">
                Completion &lt; 55% or score &lt; 50.
              </p>
            </div>
            <Badge tone="sun">{atRisk.length}</Badge>
          </div>

          <div className="mt-6 grid gap-2">
            {atRisk.map((s) => (
              <Link
                key={s.id}
                href={`/console/students/${s.id}`}
                className="rounded-3xl border border-[var(--line)] bg-white p-4 hover:bg-neutral-50 smooth"
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="font-semibold text-[var(--ink)]">{s.name}</div>
                    <div className="mt-1 text-xs text-neutral-600">ID #{s.id}</div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-semibold text-[var(--ink)]">{s.score}/100</div>
                    <div className="text-xs text-neutral-600">{s.completion}% completion</div>
                  </div>
                </div>
              </Link>
            ))}

            {atRisk.length === 0 && (
              <div className="rounded-3xl border border-[var(--line)] bg-white p-6 text-sm text-neutral-600">
                No at-risk learners in this cohort.
              </div>
            )}
          </div>
        </Card>
      </section>

      <Card className="p-3 card-hover">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="text-left text-neutral-600">
              <tr className="border-b border-[var(--line)]">
                <th className="p-4">Student</th>
                <th className="p-4">Completion</th>
                <th className="p-4">Score</th>
                <th className="p-4" />
              </tr>
            </thead>

            <tbody>
              {students.map((s) => (
                <tr
                  key={s.id}
                  className="border-b border-[var(--line)] last:border-b-0 hover:bg-white/50 smooth"
                >
                  <td className="p-4 font-semibold text-[var(--ink)]">{s.name}</td>
                  <td className="p-4">
                    <div className="min-w-[180px]">
                      <div className="flex items-center justify-between text-xs text-neutral-600">
                        <span>Progress</span>
                        <span className="font-medium text-[var(--ink)]">{s.completion}%</span>
                      </div>
                      <div className="mt-2">
                        <Progress value={s.completion} barClassName="bg-[var(--sun)]" label="Completion" />
                      </div>
                    </div>
                  </td>
                  <td className="p-4">
                    <div className="font-semibold text-[var(--ink)]">{s.score}</div>
                    <div className="text-xs text-neutral-600">/100</div>
                  </td>
                  <td className="p-4 text-right">
                    <Link className="font-semibold text-[var(--ink)] hover:underline" href={`/console/students/${s.id}`}>
                      View →
                    </Link>
                  </td>
                </tr>
              ))}

              {students.length === 0 && (
                <tr>
                  <td colSpan={4} className="p-8 text-center text-sm text-neutral-600">
                    No students in this cohort.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </Card>

      <div className="text-sm">
        <Link className="font-semibold text-[var(--ink)] hover:underline" href="/console/cohorts">
          ← Back to cohorts
        </Link>
      </div>
    </main>
  );
}

function Segmented<T extends string>({
  value,
  onChange,
  items,
}: {
  value: T;
  onChange: (v: T) => void;
  items: { key: T; label: string }[];
}) {
  return (
    <div className="rounded-2xl border border-[var(--line)] bg-white/70 p-1 flex items-center gap-1">
      {items.map((it) => {
        const active = it.key === value;
        return (
          <Button
            key={it.key}
            type="button"
            variant={active ? "primary" : "ghost"}
            className={[
              "h-9 px-3 rounded-xl text-sm",
              active ? "" : "text-neutral-700 hover:bg-white",
            ].join(" ")}
            onClick={() => onChange(it.key)}
          >
            {it.label}
          </Button>
        );
      })}
    </div>
  );
}

function Sparkline({ values, label }: { values: number[]; label?: string }) {
  const w = 260;
  const h = 52;
  const max = Math.max(...values, 1);

  const pts = values
    .map((v, i) => {
      const x = (i / Math.max(values.length - 1, 1)) * w;
      const y = h - (v / max) * h;
      return `${x.toFixed(1)},${y.toFixed(1)}`;
    })
    .join(" ");

  const area = `0,${h} ${pts} ${w},${h}`;

  return (
    <div className="mt-4 rounded-2xl border border-[var(--line)] bg-white px-4 py-3 card-hover">
      {label && <div className="text-xs text-neutral-600">{label}</div>}
      <svg viewBox={`0 0 ${w} ${h}`} className="mt-2 w-full h-12">
        <polygon points={area} fill="currentColor" className="text-[var(--teal)]/15" />
        <polyline
          points={pts}
          fill="none"
          stroke="currentColor"
          strokeWidth="3"
          className="text-[var(--teal)]"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </div>
  );
}