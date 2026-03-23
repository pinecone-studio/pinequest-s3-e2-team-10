import { AppShell } from "@/components/layout/app-shell";

export default function ReviewerAssignmentsPage() {
  return (
    <AppShell
      title="Assignments"
      subtitle="This page should connect a prepared exam to selected candidates and show assignment status immediately."
      badge="Reviewer"
      navItems={[
        { href: "/reviewer/dashboard", label: "Dashboard" },
        { href: "/reviewer/assessments", label: "Assessments" },
        { href: "/reviewer/reports", label: "Reports" },
      ]}
    >
      <div className="glass-panel rounded-[28px] p-6">
        <h2 className="text-xl font-semibold text-slate-900">
          Screen contract
        </h2>
        <ul className="mt-4 space-y-3 text-sm leading-6 text-slate-700">
          <li>Exam selector and candidate selector</li>
          <li>Assign action with start and due date</li>
          <li>Status table: assigned, started, submitted</li>
        </ul>
      </div>
    </AppShell>
  );
}
