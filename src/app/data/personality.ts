// import { selectRandomElements } from "@/app/data/utils"; 
import { selectRandomElements, groupByCategory } from "./utils";
// import personData from "@/PersonalityData.json";

// Define types for the question data structure
export type PersonalityTrait = {
  question: string;
  test: Test;
  type: Type;
  category: Category;
  field: string | null;
}

// Enums for Category, Test, and Type to provide type safety
export enum Category {
  Agreeableness = "agreeableness",
  Conscientiousness = "conscientiousness",
  Dominance = "dominance",
  Influence = "influence",
  InterpersonalSkills = "interpersonal_skills",
  Leadership = "leadership",
  Openness = "openness",
  StressHandling = "stress_handling",
}

export enum Test {
  Personality = "personality",
}

export enum Type {
  Extrovert = "Extrovert",
  Introvert = "Introvert",
}

// Define the interface for the question structure
interface Question {
  question: string;
  test: Test;
  type: Type;
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
