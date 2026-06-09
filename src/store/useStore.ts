import { create } from "zustand";
import { persist } from "zustand/middleware";
import {
  AppState,
  AppActions,
  LearningProgress,
  QuizHistory,
  QuizQuestion,
  LearningStatus,
} from "@/types";
import { generateId } from "@/utils/helpers";

type Store = AppState & AppActions;

export const useStore = create<Store>()(
  persist(
    (set, get) => ({
      learningProgress: [],
      quizHistory: [],
      currentQuiz: null,

      updateChapterProgress: (
        chapterId: string,
        status: LearningStatus,
        score?: number
      ) => {
        set((state) => {
          const existingIndex = state.learningProgress.findIndex(
            (p) => p.chapterId === chapterId
          );
          const newProgress: LearningProgress = {
            chapterId,
            status,
            score: score ?? state.learningProgress[existingIndex]?.score ?? 0,
            completedDate:
              status === "completed"
                ? new Date().toISOString()
                : state.learningProgress[existingIndex]?.completedDate,
          };

          if (existingIndex >= 0) {
            const updated = [...state.learningProgress];
            updated[existingIndex] = newProgress;
            return { learningProgress: updated };
          } else {
            return {
              learningProgress: [...state.learningProgress, newProgress],
            };
          }
        });
      },

      startQuiz: (questions: QuizQuestion[]) => {
        set({
          currentQuiz: {
            questions,
            currentIndex: 0,
            userAnswers: new Array(questions.length).fill(undefined),
          },
        });
      },

      answerCurrentQuestion: (answerIndex: number) => {
        set((state) => {
          if (!state.currentQuiz) return state;
          const userAnswers = [...state.currentQuiz.userAnswers];
          userAnswers[state.currentQuiz.currentIndex] = answerIndex;
          return {
            currentQuiz: {
              ...state.currentQuiz,
              userAnswers,
            },
          };
        });
      },

      nextQuestion: () => {
        set((state) => {
          if (!state.currentQuiz) return state;
          if (state.currentQuiz.currentIndex >= state.currentQuiz.questions.length - 1) {
            return state;
          }
          return {
            currentQuiz: {
              ...state.currentQuiz,
              currentIndex: state.currentQuiz.currentIndex + 1,
            },
          };
        });
      },

      finishQuiz: (): QuizHistory => {
        const state = get();
        if (!state.currentQuiz) {
          throw new Error("No active quiz");
        }

        let score = 0;
        state.currentQuiz.questions.forEach((q, index) => {
          if (state.currentQuiz!.userAnswers[index] === q.correctAnswer) {
            score++;
          }
        });

        const history: QuizHistory = {
          id: generateId(),
          date: new Date().toISOString(),
          score,
          totalQuestions: state.currentQuiz.questions.length,
          questionIds: state.currentQuiz.questions.map((q) => q.id),
          userAnswers: state.currentQuiz.userAnswers,
        };

        set((prev) => ({
          quizHistory: [history, ...prev.quizHistory],
          currentQuiz: null,
        }));

        return history;
      },

      clearCurrentQuiz: () => {
        set({ currentQuiz: null });
      },
    }),
    {
      name: "drug-learning-storage",
    }
  )
);
