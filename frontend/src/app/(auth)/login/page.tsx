import Link from "next/link";
import { AppShell } from "@/components/layout/app-shell";

const navItems = [
  { href: "/", label: "Overview" },
  { href: "/reviewer/dashboard", label: "Reviewer" },
  { href: "/candidate/dashboard", label: "Candidate" },
];

export default function LoginPage() {
  return (
    <AppShell
      title="Login"
      subtitle="Keep authentication simple for the hackathon: one login page, role-aware redirect, and seeded demo users."
      badge="Auth"
      navItems={navItems}
    >
      <div className="grid gap-4 md:grid-cols-2">
        <Link
          href="/reviewer/dashboard"
          className="glass-panel rounded-[28px] p-6 transition hover:-translate-y-1"
        >
          <p className="font-mono text-xs uppercase tracking-[0.24em] text-accent">
            AAAA
          </p>
          <h2 className="mt-3 text-2xl font-semibold text-slate-900">
            Reviewer login
          </h2>
          <p className="mt-2 text-sm leading-6 text-ink-soft">
            Use this role to create exams, assign candidates, review manual
            answers, and monitor reports.
          </p>
        </Link>

        <Link
          href="/candidate/dashboard"
          className="glass-panel rounded-[28px] p-6 transition hover:-translate-y-1"
        >
          <p className="font-mono text-xs uppercase tracking-[0.24em] text-accent">
            BBBB
          </p>
          <h2 className="mt-3 text-2xl font-semibold text-slate-900">
            Candidate login
          </h2>
          <p className="mt-2 text-sm leading-6 text-ink-soft">
            Use this role to see assigned exams, take them, submit, and review
            pass or fail results.
          </p>
        </Link>
      </div>
    </AppShell>
  );
}
