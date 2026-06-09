import { QuizQuestion } from "@/types";

export function shuffleArray<T>(array: T[]): T[] {
  const result = [...array];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}

export function getRandomQuestions(
  questions: QuizQuestion[],
  count: number,
  category?: string,
  difficulty?: string
): QuizQuestion[] {
  let filtered = questions;
  if (category && category !== "all") {
    filtered = filtered.filter((q) => q.category === category);
  }
  if (difficulty && difficulty !== "all") {
    filtered = filtered.filter((q) => q.difficulty === difficulty);
  }
  const shuffled = shuffleArray(filtered);
  return shuffled.slice(0, Math.min(count, shuffled.length));
}

export function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString("zh-CN", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}
