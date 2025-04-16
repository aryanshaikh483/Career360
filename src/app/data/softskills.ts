import { selectRandomElements, groupByCategory } from "./utils";
// import softData from "@/SoftSkillData.json";

// Define types for the question data structure
export type SoftSkillsStructure = {
  question: string;
  test: Test;
  type: string | null;
  category: Category;
  field: string | null;
}

export enum Category {
  AdaptabilityAndFlexibility = "Adaptability_and_Flexibility",
  Communication = "Communication",
  ConflictResolution = "Conflict_Resolution",
  EmotionalIntelligence = "Emotional_Intelligence",
  InterpersonalSkills = "Interpersonal_Skills",
  Leadership = "Leadership",
  ProblemSolving = "Problem_Solving",
  TeamworkAndCollaboration = "Teamwork_and_Collaboration",
  TimeManagement = "Time_Management",
  WorkEthic = "Work_Ethic",
}

export enum Test {
  SoftSkills = "soft_skills",
}

// Define the interface for the question structure
interface Question {
  question: string;
  test: Test;
  type: string | null;
  category: Category;
  field: string | null;
}

// Main function to fetch and process
export async function fetchAndProcessQuestions(): Promise<
  Record<string, Question[]>
> {
  const res = await fetch("/api/personality-data"); // instead of S3 directly

  if (!res.ok) throw new Error("Failed to fetch data from S3");

  const data: Question[] = await res.json();

  const grouped = groupByCategory(data);

  // Select 5 random questions per category
  const selected: Record<string, Question[]> = {};

  for (const category in grouped) {
    selected[category] = selectRandomElements(grouped[category], 5);
  }

  return selected;
}
