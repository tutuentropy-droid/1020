import { create } from "zustand";
import { persist } from "zustand/middleware";
import {
  AppState,
  AppActions,
  LearningProgress,
  QuizHistory,
  QuizQuestion,
  LearningStatus,
  WrongQuestion,
  QuestionStats,
  SmartQuizConfig,
} from "@/types";
import { generateId, shuffleArray } from "@/utils/helpers";
import { quizQuestions } from "@/data/questions";

type Store = AppState & AppActions;

const DEFAULT_SMART_CONFIG: SmartQuizConfig = {
  wrongQuestionRatio: 0.7,
  totalQuestions: 10,
};

export const useStore = create<Store>()(
  persist(
    (set, get) => ({
      learningProgress: [],
      quizHistory: [],
      currentQuiz: null,
      wrongQuestions: [],
      questionStats: [],

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
          const userAnswer = state.currentQuiz!.userAnswers[index];
          const isCorrect = userAnswer === q.correctAnswer;
          if (isCorrect) {
            score++;
          }

          get().updateQuestionStats(q.id, isCorrect);

          if (!isCorrect && userAnswer !== undefined) {
            get().addWrongQuestion(q.id, userAnswer);
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

      addWrongQuestion: (questionId: string, userAnswer: number) => {
        set((state) => {
          const existingIndex = state.wrongQuestions.findIndex(
            (w) => w.questionId === questionId
          );
          const now = new Date().toISOString();

          if (existingIndex >= 0) {
            const updated = [...state.wrongQuestions];
            const existing = updated[existingIndex];
            updated[existingIndex] = {
              ...existing,
              wrongCount: existing.wrongCount + 1,
              lastWrongDate: now,
              wrongAnswers: [...existing.wrongAnswers, userAnswer],
              mastered: false,
            };
            return { wrongQuestions: updated };
          } else {
            const newWrong: WrongQuestion = {
              questionId,
              wrongCount: 1,
              lastWrongDate: now,
              wrongAnswers: [userAnswer],
              mastered: false,
            };
            return { wrongQuestions: [...state.wrongQuestions, newWrong] };
          }
        });
      },

      removeWrongQuestion: (questionId: string) => {
        set((state) => ({
          wrongQuestions: state.wrongQuestions.filter(
            (w) => w.questionId !== questionId
          ),
        }));
      },

      markWrongQuestionMastered: (questionId: string) => {
        set((state) => {
          const updated = state.wrongQuestions.map((w) =>
            w.questionId === questionId ? { ...w, mastered: true } : w
          );
          return { wrongQuestions: updated };
        });
      },

      updateQuestionStats: (questionId: string, isCorrect: boolean) => {
        set((state) => {
          const existingIndex = state.questionStats.findIndex(
            (s) => s.questionId === questionId
          );
          const now = new Date().toISOString();

          if (existingIndex >= 0) {
            const updated = [...state.questionStats];
            const existing = updated[existingIndex];
            updated[existingIndex] = {
              ...existing,
              totalAttempts: existing.totalAttempts + 1,
              correctAttempts: existing.correctAttempts + (isCorrect ? 1 : 0),
              lastAttemptDate: now,
            };
            return { questionStats: updated };
          } else {
            const newStats: QuestionStats = {
              questionId,
              totalAttempts: 1,
              correctAttempts: isCorrect ? 1 : 0,
              lastAttemptDate: now,
            };
            return { questionStats: [...state.questionStats, newStats] };
          }
        });
      },

      getQuestionAccuracy: (questionId: string): number => {
        const state = get();
        const stats = state.questionStats.find(
          (s) => s.questionId === questionId
        );
        if (!stats || stats.totalAttempts === 0) return -1;
        return stats.correctAttempts / stats.totalAttempts;
      },

      getSmartQuizQuestions: (
        config?: Partial<SmartQuizConfig>,
        category?: string
      ): QuizQuestion[] => {
        const state = get();
        const mergedConfig: SmartQuizConfig = {
          ...DEFAULT_SMART_CONFIG,
          ...config,
        };

        const wrongQuestionsList = state.wrongQuestions.filter((w) => !w.mastered);
        let wrongQuestionObjs = wrongQuestionsList
          .map((w) => quizQuestions.find((q) => q.id === w.questionId))
          .filter((q): q is QuizQuestion => q !== undefined);

        if (category && category !== "all") {
          wrongQuestionObjs = wrongQuestionObjs.filter(
            (q) => q.category === category
          );
        }

        wrongQuestionObjs.sort((a, b) => {
          const aStats = state.wrongQuestions.find((w) => w.questionId === a.id);
          const bStats = state.wrongQuestions.find((w) => w.questionId === b.id);
          return (bStats?.wrongCount || 0) - (aStats?.wrongCount || 0);
        });

        let availablePool = [...quizQuestions];
        if (category && category !== "all") {
          availablePool = availablePool.filter((q) => q.category === category);
        }
        const wrongIds = new Set(wrongQuestionObjs.map((q) => q.id));
        let nonWrongQuestions = availablePool.filter(
          (q) => !wrongIds.has(q.id)
        );

        const wrongCount = Math.min(
          Math.ceil(mergedConfig.totalQuestions * mergedConfig.wrongQuestionRatio),
          wrongQuestionObjs.length
        );
        const nonWrongCount = mergedConfig.totalQuestions - wrongCount;

        const selectedWrong = shuffleArray(wrongQuestionObjs).slice(0, wrongCount);
        const selectedNonWrong = shuffleArray(nonWrongQuestions).slice(0, nonWrongCount);

        let result = [...selectedWrong, ...selectedNonWrong];

        if (result.length < mergedConfig.totalQuestions) {
          const fillPool = availablePool.filter(
            (q) => !result.find((r) => r.id === q.id)
          );
          const fillNeeded = mergedConfig.totalQuestions - result.length;
          result = [...result, ...shuffleArray(fillPool).slice(0, fillNeeded)];
        }

        return shuffleArray(result).slice(0, mergedConfig.totalQuestions);
      },

      clearWrongQuestions: () => {
        set({ wrongQuestions: [] });
      },
    }),
    {
      name: "drug-learning-storage",
    }
  )
);
