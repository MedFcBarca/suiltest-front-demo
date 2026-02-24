"use client";

import { Card } from "@/app/components/ui/Card";
import { Skeleton } from "@/app/components/ui/Skeleton";
import { useCohorts } from "@/features/cohorts/queries";
import { useStudents } from "@/features/students/queries";

export default function DashboardPage() {
  const cohorts = useCohorts();
  const students = useStudents();

  const total = students.data?.length ?? 0;

  const avgScore = total
    ? Math.round((students.data!.reduce((a, s) => a + s.score, 0) / total) * 10) / 10
    : 0;

  const avgCompletion = total
    ? Math.round(students.data!.reduce((a, s) => a + s.completion, 0) / total)
    : 0;

    if (students.isLoading || cohorts.isLoading) {
  return (
    <main className="grid gap-4">
      <div className="grid gap-4 md:grid-cols-4">
        <Skeleton className="h-[110px]" />
        <Skeleton className="h-[110px]" />
        <Skeleton className="h-[110px]" />
        <Skeleton className="h-[110px]" />
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Skeleton className="h-[260px]" />
        <Skeleton className="h-[260px]" />
      </div>
    </main>
  );
}
  return (
    <main className="grid gap-4">
      <section className="grid gap-4 md:grid-cols-4">
        <Kpi title="Students" value={String(total)} hint="Total learners" />
        <Kpi title="Avg score" value={String(avgScore)} hint="Across all results" />
        <Kpi title="Avg completion" value={`${avgCompletion}%`} hint="Participation rate" />
        <Kpi title="Cohorts" value={String(cohorts.data?.length ?? 0)} hint="Active groups" />
      </section>

      <section className="grid gap-4 md:grid-cols-2">
        <Card className="p-6 card-hover">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm font-semibold text-[var(--ink)]">Score distribution</div>
              <p className="mt-1 text-sm text-neutral-600">Quickly spot performance levels.</p>
            </div>
            <span className="rounded-full bg-[var(--sun)] px-3 py-1 text-xs font-semibold text-[var(--ink)]">
              demo
            </span>
          </div>

          <div className="mt-6 grid grid-cols-5 gap-2">
            {[
              { label: "38–45", value: 17 },
              { label: "45–52", value: 3 },
              { label: "53–60", value: 8 },
              { label: "61–68", value: 18 },
              { label: "68–75", value: 19 },
            ].map((b) => (
              <div key={b.label} className="rounded-2xl border border-[var(--line)] bg-white p-3">
                <div className="text-xs text-neutral-600">{b.label}</div>
                <div className="mt-2 h-2 rounded-full bg-neutral-100 overflow-hidden">
                  <div
                    className="h-full rounded-full bg-[var(--teal)]/70"
                    style={{ width: `${Math.min(100, b.value * 5)}%` }}
                    aria-hidden="true"
                  />
                </div>
                <div className="mt-2 text-sm font-semibold text-[var(--ink)]">{b.value}</div>
              </div>
            ))}
          </div>
        </Card>

        <Card className="p-6 card-hover">
          <div>
            <div className="text-sm font-semibold text-[var(--ink)]">Cohorts overview</div>
            <p className="mt-1 text-sm text-neutral-600">Completion & average score.</p>
          </div>

          <div className="mt-6 grid gap-3">
            {(cohorts.data ?? []).map((c) => (
              <div
                key={c.id}
                className="rounded-3xl border border-[var(--line)] bg-white p-4"
              >
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <div className="text-sm font-semibold text-[var(--ink)]">{c.name}</div>
                    <div className="mt-1 text-xs text-neutral-600">{c.size} learners</div>
                  </div>

                  <div className="text-right">
                    <div className="text-lg font-semibold text-[var(--ink)]">{c.avgScore}</div>
                    <div className="text-xs text-neutral-600">avg score</div>
                  </div>
                </div>

                <div className="mt-4">
                  <div className="flex items-center justify-between text-xs text-neutral-600">
                    <span>Completion</span>
                    <span className="font-medium text-[var(--ink)]">{c.completion}%</span>
                  </div>
                  <div className="mt-2 h-2 rounded-full bg-neutral-100 overflow-hidden">
                    <div
                      className="h-full rounded-full bg-[var(--sun)]"
                      style={{ width: `${c.completion}%` }}
                      aria-hidden="true"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </section>
    </main>
  );
}

function Kpi({ title, value, hint }: { title: string; value: string; hint: string }) {
  return (
    <Card className="p-5">
      <div className="text-xs text-neutral-600">{title}</div>
      <div className="mt-2 text-3xl font-semibold tracking-tight text-[var(--ink)]">{value}</div>
      <div className="mt-1 text-xs text-neutral-500">{hint}</div>
      <div className="mt-4 h-1.5 rounded-full bg-neutral-100 overflow-hidden">
        <div className="h-full w-2/3 rounded-full bg-[var(--teal)]/60" aria-hidden="true" />
      </div>
    </Card>
  );
}