import Link from "next/link";
import { Button } from "./components/ui/Button";
import { Card } from "./components/ui/Card";

export default function HomePage() {
  return (
    <main className="min-h-screen">
      <div className="absolute inset-0 -z-10 bg-gradient-to-br from-[var(--mint)] via-white to-white" />
      <div className="absolute -z-10 right-[-120px] top-[-120px] h-[380px] w-[380px] rounded-full bg-[var(--teal)]/20 blur-3xl" />
      <div className="absolute -z-10 left-[-120px] bottom-[-120px] h-[420px] w-[420px] rounded-full bg-[var(--sun)]/20 blur-3xl" />

      <header className="mx-auto max-w-6xl px-6 py-6 flex items-center justify-between">
        <div className="font-semibold tracking-tight text-[var(--ink)]">
          Sulitest
          <span className="text-neutral-500"> • Demo</span>
        </div>
        <div className="flex gap-2">
          <Link href="/login"><Button variant="secondary">Login</Button></Link>
          <Link href="/console/dashboard"><Button>Open Console</Button></Link>
        </div>
      </header>

      <section className="mx-auto max-w-6xl px-6 pt-10 pb-16">
        <div className="grid gap-8 lg:grid-cols-[1.2fr_.8fr] items-start">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-[var(--line)] bg-white/70 px-4 py-2 text-sm">
              <span className="h-2 w-2 rounded-full bg-[var(--sun)]" />
              <span className="text-neutral-700">TASK™ • Sustainability knowledge</span>
            </div>

            <h1 className="mt-5 text-5xl font-semibold tracking-tight text-[var(--ink)]">
              Making sustainability a universal language.
            </h1>

            <p className="mt-5 max-w-xl text-neutral-700 leading-relaxed">
              A teacher and administrator console inspired by TASK™, designed to monitor cohorts, track results, and deliver targeted learning resources.
            </p>

            <div className="mt-8 flex flex-wrap gap-3">
              <Link href="/console/dashboard"><Button>Explore dashboard</Button></Link>
              <Link href="/student"><Button>Explore student</Button></Link>
              <Link href="/login"><Button variant="ghost">Login</Button></Link>
            </div>

            <div className="mt-10 grid gap-3 md:grid-cols-3">
              <Mini title="Measure" desc="Scores & completion." />
              <Mini title="Benchmark" desc="Compare cohorts." />
              <Mini title="Improve" desc="Study guides." />
            </div>
          </div>

          <div className="grid gap-4">
          <Card className="p-3 bg-white/40 backdrop-blur">
            <div className="rounded-3xl overflow-hidden border border-[var(--line)] shadow-sm">
             <img src="https://images.unsplash.com/photo-1472214103451-9374bd1c798e?q=80&w=1600&auto=format&fit=crop"      
             alt="Planet Earth"
             className="w-full h-[260px] object-cover"
             />
            </div>
          </Card>
               <Card className="p-6 bg-white/70">
                  <div className="text-sm font-semibold text-[var(--ink)]">
                  Sustainability Knowledge Snapshot
                  </div>

                  <div className="mt-4 grid gap-3">
                    <Metric label="Earth system" value={72} />
                    <Metric label="Human welfare" value={64} />
                    <Metric label="Transitions" value={58} />
                  </div>

                  <div className="mt-5 rounded-2xl bg-[var(--mint)]/60 p-4">
                    <div className="text-xs text-neutral-600">
                      Demo learner profile
                    </div>
                    <div className="mt-1 text-lg font-semibold text-[var(--ink)]">
                      Score 61 / 100
                    </div>
                  </div>
              </Card>
          </div>
        </div>
      </section>
    </main>
  );
}

function Mini({ title, desc }: { title: string; desc: string }) {
  return (
    <div className="rounded-3xl border border-[var(--line)] bg-white/70 p-5">
      <div className="text-sm font-semibold text-[var(--ink)]">{title}</div>
      <div className="mt-1 text-sm text-neutral-700">{desc}</div>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl bg-white/10 px-4 py-3">
      <div className="text-xs opacity-80">{label}</div>
      <div className="mt-1 text-lg font-semibold">{value}</div>
    </div>
  );
}

function Metric({ label, value }: { label: string; value: number }) {
  return (
    <div>
      <div className="flex items-center justify-between text-xs text-neutral-600">
        <span>{label}</span>
        <span className="font-semibold text-[var(--ink)]">{value}</span>
      </div>

      <div className="mt-1 h-2 rounded-full bg-neutral-100 overflow-hidden">
        <div
          className="h-full rounded-full bg-[var(--teal)]/70"
          style={{ width: `${value}%` }}
        />
      </div>
    </div>
  );
}