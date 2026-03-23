import { AppShell } from "@/components/layout/app-shell";

export default function ReviewerReportsPage() {
  return (
    <AppShell
      title="Reports"
      subtitle="Judges need instant clarity, so this page should visualize participation, average score, pass rate, and outstanding reviews."
      badge="Reviewer"
      navItems={[
        { href: "/reviewer/dashboard", label: "Dashboard" },
        { href: "/reviewer/assessments", label: "Assessments" },
        { href: "/reviewer/assignments", label: "Assignments" },
      ]}
    >
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {["Completion", "Coverage", "Average score", "Pass rate"].map(
          (metric) => (
            <article
              key={metric}
              className="glass-panel rounded-[24px] p-5 text-center"
            >
              <p className="font-mono text-xs uppercase tracking-[0.24em] text-accent">
                Metric
              </p>
              <h2 className="mt-3 text-lg font-semibold text-slate-900">
                {metric}
              </h2>
              <p className="mt-2 text-sm text-ink-soft">Ready for charts</p>
            </article>
          ),
        )}
      </div>
    </AppShell>
  );
}
