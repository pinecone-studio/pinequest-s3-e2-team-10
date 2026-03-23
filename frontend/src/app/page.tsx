import Link from "next/link";
import { AppShell } from "@/components/layout/app-shell";
import { architectureCards, platformSteps } from "@/services/mock-data";

const navItems = [
  { href: "/login", label: "Login" },
  { href: "/reviewer/dashboard", label: "Reviewer" },
  { href: "/candidate/dashboard", label: "Candidate" },
];

export default function HomePage() {
  return (
    <AppShell
      title="PineQuest LMS Blueprint"
      subtitle="A simple, hackathon-friendly structure for your LMS: reviewer creates and assigns, candidate takes and submits, system grades and reports."
      badge="2-week build"
      navItems={navItems}
    >
      <section className="hero-grid glass-panel overflow-hidden rounded-[32px] p-6 sm:p-8">
        <div className="grid gap-8 lg:grid-cols-[1.4fr_0.9fr]">
          <div className="space-y-6">
            <div className="space-y-3">
              <p className="font-mono text-xs uppercase tracking-[0.3em] text-accent">
                Recommended scope
              </p>
              <h2 className="max-w-2xl text-4xl font-semibold tracking-tight text-slate-900">
                Simple is the right choice here, but only if the structure
                matches your flow.
              </h2>
              <p className="max-w-2xl text-base leading-7 text-ink-soft">
                For a 9-member team in a 2-week hackathon, the winning move is a
                thin architecture, clear ownership, and a strong end-to-end demo.
              </p>
            </div>

            <div className="flex flex-wrap gap-3">
              <Link
                href="/reviewer/dashboard"
                className="rounded-full bg-slate-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-700"
              >
                Open reviewer flow
              </Link>
              <Link
                href="/candidate/dashboard"
                className="rounded-full border border-border bg-white/70 px-5 py-3 text-sm font-semibold text-slate-900 transition hover:border-accent hover:text-accent"
              >
                Open candidate flow
              </Link>
            </div>
          </div>

          <div className="rounded-[28px] border border-white/60 bg-white/80 p-5">
            <p className="font-mono text-xs uppercase tracking-[0.28em] text-accent">
              Lean delivery checklist
            </p>
            <ul className="mt-4 space-y-3 text-sm leading-6 text-slate-700">
              <li>Role-based login for reviewer and candidate</li>
              <li>Exam creation with title, time, attempts, pass score</li>
              <li>Assignment page for candidate selection</li>
              <li>Candidate exam-taking page with submit action</li>
              <li>Results page with pass or fail</li>
              <li>One report dashboard judges can understand fast</li>
            </ul>
          </div>
        </div>
      </section>

      <section className="mt-6 grid gap-4 lg:grid-cols-3">
        {architectureCards.map((card) => (
          <article
            key={card.title}
            className="glass-panel rounded-[28px] p-6 transition hover:-translate-y-1"
          >
            <h3 className="text-xl font-semibold text-slate-900">
              {card.title}
            </h3>
            <p className="mt-2 text-sm leading-6 text-ink-soft">
              {card.description}
            </p>
            <ul className="mt-4 space-y-2 text-sm text-slate-700">
              {card.items.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </article>
        ))}
      </section>

      <section className="mt-6 glass-panel rounded-[32px] p-6 sm:p-8">
        <div className="flex flex-col gap-2">
          <p className="font-mono text-xs uppercase tracking-[0.28em] text-accent">
            Core flow
          </p>
          <h2 className="text-2xl font-semibold text-slate-900">
            LMS system sequence
          </h2>
        </div>

        <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {platformSteps.map((step) => (
            <article
              key={step.id}
              className="rounded-[24px] border border-border bg-white/80 p-5"
            >
              <div className="flex items-center justify-between">
                <span className="text-3xl font-semibold text-slate-900">
                  {step.id}
                </span>
                <span className="rounded-full bg-accent-soft px-3 py-1 font-mono text-[11px] uppercase tracking-[0.2em] text-accent">
                  {step.owner}
                </span>
              </div>
              <h3 className="mt-4 text-lg font-semibold text-slate-900">
                {step.title}
              </h3>
              <p className="mt-2 text-sm leading-6 text-ink-soft">
                {step.description}
              </p>
            </article>
          ))}
        </div>
      </section>
    </AppShell>
  );
}
