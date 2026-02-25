"use client";

import Link from "next/link";
import * as React from "react";
import { useStudents } from "@/features/students/queries";
import { useCohorts } from "@/features/cohorts/queries";
import { Card } from "@/app/components/ui/Card";
import { Progress } from "@/app/components/ui/Progress";
import { Badge } from "@/app/components/ui/Badge";
import { Skeleton } from "@/app/components/ui/Skeleton";

function initials(name: string) {
  const parts = name.trim().split(/\s+/);
  return (parts[0]?.[0] ?? "").toUpperCase() + (parts[1]?.[0] ?? "").toUpperCase();
}

export default function StudentsPage() {
  const studentsQ = useStudents();
  const cohortsQ = useCohorts();

  const [q, setQ] = React.useState("");
  const [cohortId, setCohortId] = React.useState<string>("all");

  const searchId = React.useId();
  const cohortSelectId = React.useId();

  const students = studentsQ.data ?? [];
  const cohorts = cohortsQ.data ?? [];

  const filtered = students
    .filter((s) => (cohortId === "all" ? true : s.cohortId === cohortId))
    .filter((s) => s.name.toLowerCase().includes(q.toLowerCase()));

    
  if (studentsQ.isLoading) {
    return (
      <main className="grid gap-3">
        <Skeleton className="h-[90px]" />

        <Card className="p-3">
          <div className="grid gap-2">
            {Array.from({ length: 8 }).map((_, i) => (
              <Skeleton key={i} className="h-[64px]" />
            ))}
          </div>
        </Card>
      </main>
    );
  }

  if (studentsQ.isError) {
    return (
      <main className="grid gap-3">
        <Card className="p-6">
          <div className="text-sm font-semibold text-[var(--ink)]">
            Impossible de charger les étudiants
          </div>
          <p className="mt-1 text-sm text-neutral-600">
            Vérifie ta connexion ou réessaie.
          </p>
        </Card>
      </main>
    );
  }

  return (
    <main className="grid gap-4">
      <Card className="p-6 card-hover">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <h1 className="text-sm font-semibold text-[var(--ink)]">
              Students
            </h1>
            <p className="mt-1 text-sm text-neutral-600">
              Search & filter by cohort.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <Badge tone="sun">{filtered.length} shown</Badge>
            <Badge tone="neutral">{students.length} total</Badge>
          </div>
        </div>

        <div className="mt-5 grid gap-3 md:grid-cols-[1fr_220px]">
          <div className="grid gap-1">
            <label htmlFor={searchId} className="text-xs text-neutral-600">
              Search
            </label>
            <input
              id={searchId}
              value={q}
              onChange={(e) => setQ(e.target.value)}
              className="h-11 rounded-2xl border border-[var(--line)] bg-white/70 px-4 outline-none focus:ring-2 focus:ring-[var(--ink)]"
              placeholder="Search student…"
              autoComplete="off"
            />
          </div>

          <div className="grid gap-1">
            <label htmlFor={cohortSelectId} className="text-xs text-neutral-600">
              Cohort
            </label>
            <select
              id={cohortSelectId}
              value={cohortId}
              onChange={(e) => setCohortId(e.target.value)}
              className="h-11 rounded-2xl border border-[var(--line)] bg-white/70 px-3 outline-none focus:ring-2 focus:ring-[var(--ink)]"
            >
              <option value="all">All cohorts</option>
              {cohorts.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>
        </div>
      </Card>

      <Card className="p-3">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <caption className="sr-only">
              Students list with cohort, completion and score
            </caption>

            <thead className="text-left text-neutral-600">
              <tr className="border-b border-[var(--line)]">
                <th className="p-4">Student</th>
                <th className="p-4">Cohort</th>
                <th className="p-4">Completion</th>
                <th className="p-4">Score</th>
                <th className="p-4" />
              </tr>
            </thead>

            <tbody>
              {filtered.map((s) => (
                <tr
                  key={s.id}
                  className="border-b border-[var(--line)] last:border-b-0 hover:bg-white/50"
                >
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <div
                        className="h-10 w-10 rounded-2xl bg-[var(--teal)]/15 text-[var(--ink)] grid place-items-center font-semibold"
                        aria-hidden="true"
                      >
                        {initials(s.name)}
                      </div>
                      <div>
                        <div className="font-semibold text-[var(--ink)]">
                          {s.name}
                        </div>
                        <div className="text-xs text-neutral-600">
                          ID #{s.id}
                        </div>
                      </div>
                    </div>
                  </td>

                  <td className="p-4">
                    <Badge tone="teal">{s.cohortId}</Badge>
                  </td>

                  <td className="p-4">
                    <div className="min-w-[180px]">
                      <div className="flex items-center justify-between text-xs text-neutral-600">
                        <span>Completion</span>
                        <span className="font-medium text-[var(--ink)]">
                          {s.completion}%
                        </span>
                      </div>

                      <div className="mt-2">
                        <Progress
                          value={s.completion}
                          barClassName="bg-[var(--sun)]"
                          label="Completion"
                        />
                      </div>
                    </div>
                  </td>

                  <td className="p-4">
                    <div className="font-semibold text-[var(--ink)]">
                      {s.score}
                    </div>
                    <div className="text-xs text-neutral-600">/100</div>
                  </td>

                  <td className="p-4 text-right">
                    <Link
                      className="text-sm font-semibold text-[var(--ink)] hover:underline"
                      href={`/console/students/${s.id}`}
                      aria-label={`View details for ${s.name}`}
                    >
                      View →
                    </Link>
                  </td>
                </tr>
              ))}

              {filtered.length === 0 && (
                <tr>
                  <td
                    className="p-8 text-center text-sm text-neutral-600"
                    colSpan={5}
                  >
                    No students match your search.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </Card>
    </main>
  );
}