import { FeatureCard, PlatformStep } from "@/types/lms";

export const platformSteps: PlatformStep[] = [
  {
    id: 1,
    title: "Login",
    owner: "All",
    description:
      "The system identifies whether the user is a reviewer or candidate and routes them to the right dashboard.",
  },
  {
    id: 2,
    title: "Create training or exam",
    owner: "Reviewer",
    description:
      "Reviewers prepare questions, attach learning materials, and configure time, attempts, and pass score.",
  },
  {
    id: 3,
    title: "Assign learners",
    owner: "Reviewer",
    description:
      "Assignments publish exams or training items to specific candidates and make them visible in their queue.",
  },
  {
    id: 4,
    title: "Take exam",
    owner: "Candidate",
    description:
      "Candidates answer questions while the system tracks progress and optionally enforces time limits.",
  },
  {
    id: 5,
    title: "Submit",
    owner: "Candidate",
    description:
      "Submissions are stored together with timing and status, ready for automatic or manual grading.",
  },
  {
    id: 6,
    title: "Grade",
    owner: "System",
    description:
      "Objective questions are scored automatically, while reviewers can check essay or manual tasks.",
  },
  {
    id: 7,
    title: "View results",
    owner: "All",
    description:
      "Candidates see their score and pass status. Reviewers see overall progress, detailed attempts, and outcomes.",
  },
  {
    id: 8,
    title: "Reports",
    owner: "System",
    description:
      "The platform summarizes completion rate, coverage, average score, and team-level performance signals.",
  },
];

export const architectureCards: FeatureCard[] = [
  {
    title: "Frontend",
    description:
      "Keep routes simple and map them directly to real screens the demo will need.",
    items: [
      "auth/login",
      "reviewer/dashboard, assessments, assignments, reports",
      "candidate/dashboard, exams/[examId], results",
    ],
  },
  {
    title: "Backend",
    description:
      "Use lightweight feature modules so 9 team members can work in parallel without stepping on each other.",
    items: [
      "auth, users",
      "courses, assessments, assignments",
      "submissions, results, reports",
    ],
  },
  {
    title: "Hackathon focus",
    description:
      "Build only what the judges can see: role-based flow, assignment, attempt, score, and reports.",
    items: [
      "Role-based dashboards",
      "One exam flow end to end",
      "One report page with clear metrics",
    ],
  },
];
