import { AppShell } from "@/components/layout/app-shell";

export default function ReviewerAssessmentsPage() {
  return (
    <AppShell
      title="Assessments"
      subtitle="Keep this feature narrow: create and edit a training or exam, attach questions, and define attempts, duration, and pass score."
      badge="Reviewer"
      navItems={[
        { href: "/reviewer/dashboard", label: "Dashboard" },
        { href: "/reviewer/assignments", label: "Assignments" },
        { href: "/reviewer/reports", label: "Reports" },
      ]}
    >
      <div className="glass-panel rounded-[28px] p-6">
        <h2 className="text-xl font-semibold text-slate-900">
          Screen contract
        </h2>
        <ul className="mt-4 space-y-3 text-sm leading-6 text-slate-700">
          <li>Title, description, and material upload area</li>
          <li>Question list with type, points, and answer key</li>
          <li>Settings: time limit, attempts, and pass score</li>
        </ul>
      </div>
    </AppShell>
  );
}
