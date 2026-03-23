import Link from "next/link";
import { AppShell } from "@/components/layout/app-shell";

export default function CandidateDashboardPage() {
  return (
    <AppShell
      title="Candidate Dashboard"
      subtitle="This side should feel very lightweight: assigned exams, due dates, progress, and one clear path to start."
      badge="Candidate"
      navItems={[
        { href: "/candidate/results", label: "Results" },
        { href: "/candidate/exams/demo-exam", label: "Take exam" },
        { href: "/login", label: "Switch role" },
      ]}
    >
      <div className="grid gap-4 lg:grid-cols-[1.2fr_0.8fr]">
        <div className="glass-panel rounded-[28px] p-6">
          <p className="font-mono text-xs uppercase tracking-[0.24em] text-accent">
            Assigned exam
          </p>
          <h2 className="mt-3 text-2xl font-semibold text-slate-900">
            Workplace Safety Basics
          </h2>
          <p className="mt-2 text-sm leading-6 text-ink-soft">
            20 minutes, 1 attempt, pass score 70%. Keep the candidate view calm
            and obvious.
          </p>
          <Link
            href="/candidate/exams/demo-exam"
            className="mt-6 inline-flex rounded-full bg-slate-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-700"
          >
            Start exam
          </Link>
        </div>

        <div className="glass-panel rounded-[28px] p-6">
          <h2 className="text-xl font-semibold text-slate-900">What matters</h2>
          <ul className="mt-4 space-y-3 text-sm leading-6 text-slate-700">
            <li>Visible due date and time limit</li>
            <li>Auto-save progress</li>
            <li>Clear submit button and final confirmation</li>
          </ul>
        </div>
      </div>
    </AppShell>
  );
}
