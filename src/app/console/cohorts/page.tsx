"use client";

import Link from "next/link";
import { Card } from "@/app/components/ui/Card";
import { Badge } from "@/app/components/ui/Badge";
import { Progress } from "@/app/components/ui/Progress";
import { Skeleton } from "@/app/components/ui/Skeleton";
import { useCohorts } from "@/features/cohorts/queries";

export default function CohortsPage() {
  const q = useCohorts();

  if (q.isLoading) {
    return (
      <main className="grid gap-3">
        <Skeleton className="h-[90px]" />
        <Card className="p-3">
          <div className="grid gap-2">
            {Array.from({ length: 6 }).map((_, i) => (
              <Skeleton key={i} className="h-[84px]" />
            ))}
          </div>
        </Card>
      </main>
    );
  }
  
    if (q.isError) {
    return (
      <main className="grid gap-3">
        <Card className="p-6">
          <div className="text-sm font-semibold text-[var(--ink)]">
            Impossible de charger les cohortes
          </div>
          <p className="mt-1 text-sm text-neutral-600">
            Vérifie ta connexion ou réessaie.
          </p>

          <div className="mt-4 flex gap-2">
            <button
              onClick={() => q.refetch()}
              className="rounded-xl border border-[var(--line)] px-3 py-2 text-sm font-semibold hover:bg-neutral-50"
            >
              Retry
            </button>
          </div>
        </Card>
      </main>
    );
  }

  const cohorts = q.data ?? [];

  return (
    <main className="grid gap-4">
      <Card className="p-6 card-hover">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <div className="text-sm font-semibold text-[var(--ink)]">Cohorts</div>
            <p className="mt-1 text-sm text-neutral-600">
              Group overview: participation and average score.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <Badge tone="sun">{cohorts.length} cohorts</Badge>
            <Badge tone="neutral">demo</Badge>
          </div>
        </div>
      </Card>

      <div className="grid gap-3 md:grid-cols-2">
        {cohorts.map((c) => (
          <Link key={c.id} href={`/console/cohorts/${c.id}`} className="group">
            <Card className="p-6 transition hover:shadow-md hover:bg-white/80">
              <div className="flex items-start justify-between gap-4">
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <div className="text-sm font-semibold text-[var(--ink)] truncate">
                      {c.name}
                    </div>
                    <Badge tone="teal">{c.size} learners</Badge>
                  </div>

                  <div className="mt-3 grid gap-2">
                    <div className="flex items-center justify-between text-xs text-neutral-600">
                      <span>Completion</span>
                      <span className="font-medium text-[var(--ink)]">{c.completion}%</span>
                    </div>
                    <Progress value={c.completion} barClassName="bg-[var(--sun)]" />
                  </div>
                </div>

                <div className="text-right shrink-0">
                  <div className="text-xs text-neutral-600">Avg score</div>
                  <div className="mt-1 text-3xl font-semibold tracking-tight text-[var(--ink)]">
                    {c.avgScore}
                  </div>

                  <div className="mt-3 inline-flex items-center gap-2 text-sm font-semibold text-[var(--ink)]">
                    View
                    <span className="transition-transform group-hover:translate-x-0.5">→</span>
                  </div>
                </div>
              </div>

              <div className="mt-5 rounded-2xl border border-[var(--line)] bg-white p-3">
                <div className="flex items-center justify-between text-xs text-neutral-600">
                  <span>ID</span>
                  <span className="font-mono text-[var(--ink)]">{c.id}</span>
                </div>
              </div>
            </Card>
          </Link>
        ))}

        {cohorts.length === 0 && (
          <Card className="p-8 text-sm text-neutral-600">
            No cohorts found.
          </Card>
        )}
      </div>
    </main>
  );
}