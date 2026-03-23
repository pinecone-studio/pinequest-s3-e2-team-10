import { AppShell } from "@/components/layout/app-shell";

type ExamPageProps = {
  params: Promise<{
    examId: string;
  }>;
};

export default async function CandidateExamPage({ params }: ExamPageProps) {
  const { examId } = await params;

  return (
    <AppShell
      title={`Exam Attempt: ${examId}`}
      subtitle="This screen should focus on answering questions, autosaving progress, showing time left, and making submission trustworthy."
      badge="Candidate"
      navItems={[
        { href: "/candidate/dashboard", label: "Dashboard" },
        { href: "/candidate/results", label: "Results" },
        { href: "/login", label: "Logout" },
      ]}
    >
      <div className="grid gap-4 lg:grid-cols-[1.3fr_0.7fr]">
        <div className="glass-panel rounded-[28px] p-6">
          <h2 className="text-xl font-semibold text-slate-900">
            Question area
          </h2>
          <ul className="mt-4 space-y-3 text-sm leading-6 text-slate-700">
            <li>Question stem and answer choices</li>
            <li>Autosave on change</li>
            <li>Submit action with confirmation modal</li>
          </ul>
        </div>

        <div className="glass-panel rounded-[28px] p-6">
          <h2 className="text-xl font-semibold text-slate-900">
            Attempt summary
          </h2>
          <ul className="mt-4 space-y-3 text-sm leading-6 text-slate-700">
            <li>Timer</li>
            <li>Answered count</li>
            <li>Status: in progress</li>
          </ul>
        </div>
      </div>
    </AppShell>
  );
}
