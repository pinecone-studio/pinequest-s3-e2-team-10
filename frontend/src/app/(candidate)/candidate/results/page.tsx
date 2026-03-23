import { AppShell } from "@/components/layout/app-shell";

export default function CandidateResultsPage() {
  return (
    <AppShell
      title="Results"
      subtitle="Keep results easy to understand: score, pass or fail status, and attempt history."
      badge="Candidate"
      navItems={[
        { href: "/candidate/dashboard", label: "Dashboard" },
        { href: "/candidate/exams/demo-exam", label: "Take exam" },
        { href: "/login", label: "Logout" },
      ]}
    >
      <div className="grid gap-4 md:grid-cols-3">
        {[
          { label: "Score", value: "82 / 100" },
          { label: "Status", value: "Passed" },
          { label: "Attempts", value: "1 / 1" },
        ].map((item) => (
          <article key={item.label} className="glass-panel rounded-[24px] p-5">
            <p className="font-mono text-xs uppercase tracking-[0.24em] text-accent">
              {item.label}
            </p>
            <h2 className="mt-3 text-2xl font-semibold text-slate-900">
              {item.value}
            </h2>
          </article>
        ))}
      </div>
    </AppShell>
  );
}
