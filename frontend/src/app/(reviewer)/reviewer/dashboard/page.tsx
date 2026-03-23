import { AppShell } from "@/components/layout/app-shell";

const navItems = [
  { href: "/reviewer/assessments", label: "Assessments" },
  { href: "/reviewer/assignments", label: "Assignments" },
  { href: "/reviewer/reports", label: "Reports" },
];

export default function ReviewerDashboardPage() {
  return (
    <AppShell
      title="Reviewer Dashboard"
      subtitle="This area owns creation, assignment, grading, and reporting. It should be the operational center for your judges demo."
      badge="Reviewer"
      navItems={navItems}
    >
      <div className="grid gap-4 lg:grid-cols-3">
        {[
          {
            title: "Create exam",
            text: "Build one strong exam form with title, description, duration, attempts, and pass score.",
          },
          {
            title: "Assign candidates",
            text: "Show candidate list selection and publish exams cleanly with status badges.",
          },
          {
            title: "Track outcomes",
            text: "Surface assigned, in-progress, submitted, passed, and failed counts in one glance.",
          },
        ].map((card) => (
          <article
            key={card.title}
            className="glass-panel rounded-[28px] p-6"
          >
            <h2 className="text-xl font-semibold text-slate-900">
              {card.title}
            </h2>
            <p className="mt-2 text-sm leading-6 text-ink-soft">{card.text}</p>
          </article>
        ))}
      </div>

      <div className="mt-6 rounded-[28px] border border-border bg-white/80 p-6">
        <h2 className="text-xl font-semibold text-slate-900">
          Recommended reviewer backlog
        </h2>
        <ol className="mt-4 space-y-3 text-sm leading-6 text-slate-700">
          <li>1. Assessment form and question builder</li>
          <li>2. Assignment table with candidate selector</li>
          <li>3. Submission review list for manual checking</li>
          <li>4. Report dashboard with completion and average score</li>
        </ol>
      </div>
    </AppShell>
  );
}
