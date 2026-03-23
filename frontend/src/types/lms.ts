export type UserRole = "reviewer" | "candidate";

export type PlatformStep = {
  id: number;
  title: string;
  owner: "All" | "Reviewer" | "Candidate" | "System";
  description: string;
};

export type FeatureCard = {
  title: string;
  description: string;
  items: string[];
};
