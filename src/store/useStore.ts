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
  Note,
  JournalComment,
  CommentReply,
  GameState,
  GameResult,
  GameHistory,
  GameStageId,
} from "@/types";
import { generateId, shuffleArray } from "@/utils/helpers";
import { quizQuestions } from "@/data/questions";
import { initialComments } from "@/data/journalClub";
import { gameAchievements, gameStages, getDecisionsByStage } from "@/data/drugDevGame";

type Store = AppState & AppActions;

const DEFAULT_SMART_CONFIG: SmartQuizConfig = {
  wrongQuestionRatio: 0.7,
  totalQuestions: 10,
};

const INITIAL_GAME_STATE: GameState = {
  currentStage: null,
  currentDecisionIndex: 0,
  funds: 1000,
  totalTime: 0,
  currentSuccessRate: 50,
  decisionsMade: [],
  unlockedAchievements: [],
  gameActive: false,
  drugName: "",
  drugCategory: "",
};

const INITIAL_KNOWLEDGE_VIEWED: string[] = [];

export const useStore = create<Store>()(
  persist(
    (set, get) => ({
      learningProgress: [],
      quizHistory: [],
      currentQuiz: null,
      wrongQuestions: [],
      questionStats: [],
      notes: [],
      journalComments: initialComments,
      currentUserName: "访客用户",
      currentUserId: "current-user",
      gameState: INITIAL_GAME_STATE,
      gameHistory: [],
      gameAchievements: gameAchievements.map((a) => ({ ...a })),
      viewedKnowledgePopups: INITIAL_KNOWLEDGE_VIEWED,

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

      addNote: (note: Omit<Note, "id" | "createdAt" | "updatedAt">): Note => {
        const now = new Date().toISOString();
        const newNote: Note = {
          ...note,
          id: generateId(),
          createdAt: now,
          updatedAt: now,
        };
        set((state) => ({
          notes: [newNote, ...state.notes],
        }));
        return newNote;
      },

      updateNote: (id: string, updates: Partial<Note>) => {
        set((state) => ({
          notes: state.notes.map((note) =>
            note.id === id
              ? { ...note, ...updates, updatedAt: new Date().toISOString() }
              : note
          ),
        }));
      },

      deleteNote: (id: string) => {
        set((state) => ({
          notes: state.notes.filter((note) => note.id !== id),
        }));
      },

      getNote: (id: string): Note | undefined => {
        return get().notes.find((note) => note.id === id);
      },

      getArticleComments: (articleId: string): JournalComment[] => {
        return get()
          .journalComments.filter((c) => c.articleId === articleId)
          .sort(
            (a, b) =>
              new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
          );
      },

      addJournalComment: (
        articleId: string,
        comment: Omit<
          JournalComment,
          | "id"
          | "articleId"
          | "authorId"
          | "authorName"
          | "createdAt"
          | "likes"
          | "likedByUser"
          | "replies"
        >
      ): JournalComment => {
        const state = get();
        const newComment: JournalComment = {
          ...comment,
          id: generateId(),
          articleId,
          authorId: state.currentUserId,
          authorName: state.currentUserName,
          createdAt: new Date().toISOString(),
          likes: 0,
          likedByUser: false,
          replies: [],
        };
        set((state) => ({
          journalComments: [newComment, ...state.journalComments],
        }));
        return newComment;
      },

      likeJournalComment: (commentId: string) => {
        set((state) => ({
          journalComments: state.journalComments.map((c) => {
            if (c.id === commentId) {
              return {
                ...c,
                likes: c.likedByUser ? c.likes - 1 : c.likes + 1,
                likedByUser: !c.likedByUser,
              };
            }
            return c;
          }),
        }));
      },

      replyToJournalComment: (
        commentId: string,
        content: string
      ): CommentReply => {
        const state = get();
        const newReply: CommentReply = {
          id: generateId(),
          authorId: state.currentUserId,
          authorName: state.currentUserName,
          content,
          createdAt: new Date().toISOString(),
          likes: 0,
          likedByUser: false,
        };
        set((state) => ({
          journalComments: state.journalComments.map((c) => {
            if (c.id === commentId) {
              return {
                ...c,
                replies: [...c.replies, newReply],
              };
            }
            return c;
          }),
        }));
        return newReply;
      },

      likeCommentReply: (commentId: string, replyId: string) => {
        set((state) => ({
          journalComments: state.journalComments.map((c) => {
            if (c.id === commentId) {
              return {
                ...c,
                replies: c.replies.map((r) => {
                  if (r.id === replyId) {
                    return {
                      ...r,
                      likes: r.likedByUser ? r.likes - 1 : r.likes + 1,
                      likedByUser: !r.likedByUser,
                    };
                  }
                  return r;
                }),
              };
            }
            return c;
          }),
        }));
      },

      startGame: (drugName: string, drugCategory: string) => {
        set({
          gameState: {
            ...INITIAL_GAME_STATE,
            currentStage: "target-discovery",
            gameActive: true,
            drugName,
            drugCategory,
            funds: 1000,
            currentSuccessRate: gameStages[0].baseSuccessRate,
          },
        });
      },

      makeDecision: (optionId: string, costModifier: number, timeModifier: number, successRateModifier: number) => {
        set((state) => {
          if (!state.gameState.gameActive || !state.gameState.currentStage) return state;

          const newFunds = Math.max(0, state.gameState.funds - costModifier);
          const newTime = state.gameState.totalTime + timeModifier;
          const newSuccessRate = Math.max(0, Math.min(100, state.gameState.currentSuccessRate + successRateModifier));

          return {
            gameState: {
              ...state.gameState,
              funds: newFunds,
              totalTime: newTime,
              currentSuccessRate: newSuccessRate,
              decisionsMade: [...state.gameState.decisionsMade, optionId],
              currentDecisionIndex: state.gameState.currentDecisionIndex + 1,
            },
          };
        });
      },

      advanceStage: () => {
        set((state) => {
          if (!state.gameState.gameActive || !state.gameState.currentStage) return state;

          const currentStageIndex = gameStages.findIndex((s) => s.id === state.gameState.currentStage);
          if (currentStageIndex >= gameStages.length - 1) {
            return state;
          }

          const nextStage = gameStages[currentStageIndex + 1];
          return {
            gameState: {
              ...state.gameState,
              currentStage: nextStage.id,
              currentDecisionIndex: 0,
              currentSuccessRate: Math.max(0, Math.min(100, nextStage.baseSuccessRate + (state.gameState.currentSuccessRate - 50) * 0.3)),
            },
          };
        });
      },

      finishGame: (result: GameResult) => {
        const state = get();
        if (!state.gameState.gameActive) return;

        const newUnlocked: string[] = [];
        const now = new Date().toISOString();
        const history: GameHistory = {
          id: generateId(),
          date: now,
          result,
          finalFunds: state.gameState.funds,
          totalTime: state.gameState.totalTime,
          finalSuccessRate: state.gameState.currentSuccessRate,
          unlockedAchievementIds: [],
          decisionsMade: state.gameState.decisionsMade,
          drugName: state.gameState.drugName,
          drugCategory: state.gameState.drugCategory,
        };

        const successCount = state.gameHistory.filter((h) => h.result === "success").length;
        const failCount = state.gameHistory.filter((h) => h.result === "failed").length;
        const viewedKnowledge = state.viewedKnowledgePopups?.length || 0;

        const checkAchievement = (id: string, condition: boolean) => {
          const achievement = state.gameAchievements.find((a) => a.id === id);
          if (achievement && !achievement.unlocked && condition) {
            newUnlocked.push(id);
          }
        };

        checkAchievement("ach-first-game", true);
        checkAchievement("ach-first-success", result === "success");
        checkAchievement("ach-five-success", result === "success" && successCount + 1 >= 5);
        checkAchievement("ach-ten-success", result === "success" && successCount + 1 >= 10);
        checkAchievement("ach-low-cost", result === "success" && state.gameState.funds < 500);
        checkAchievement("ach-high-speed", result === "success" && state.gameState.totalTime < 100);
        checkAchievement("ach-perfect", result === "success" && state.gameState.currentSuccessRate >= 90);
        checkAchievement("ach-risk-taker", result === "success" && state.gameState.currentSuccessRate < 30);
        checkAchievement("ach-knowledge-seeker", viewedKnowledge >= 20);
        checkAchievement("ach-all-knowledge", viewedKnowledge >= 28);
        checkAchievement("ach-never-give-up", result === "success" && failCount >= 5);
        checkAchievement("ach-all-stages", state.gameState.decisionsMade.length >= 10);

        history.unlockedAchievementIds = newUnlocked;

        set((state) => ({
          gameHistory: [history, ...state.gameHistory],
          gameState: {
            ...state.gameState,
            gameActive: false,
            unlockedAchievements: [...state.gameState.unlockedAchievements, ...newUnlocked],
          },
          gameAchievements: state.gameAchievements.map((a) =>
            newUnlocked.includes(a.id) ? { ...a, unlocked: true, unlockedAt: now } : a
          ),
        }));
      },

      resetGame: () => {
        set({
          gameState: INITIAL_GAME_STATE,
        });
      },

      unlockAchievement: (achievementId: string) => {
        set((state) => {
          const achievement = state.gameAchievements.find((a) => a.id === achievementId);
          if (!achievement || achievement.unlocked) return state;

          return {
            gameAchievements: state.gameAchievements.map((a) =>
              a.id === achievementId ? { ...a, unlocked: true, unlockedAt: new Date().toISOString() } : a
            ),
          };
        });
      },

      markKnowledgeViewed: (knowledgeId: string) => {
        set((state) => {
          const viewed = state.viewedKnowledgePopups || [];
          if (viewed.includes(knowledgeId)) return state;
          return {
            viewedKnowledgePopups: [...viewed, knowledgeId],
          };
        });
      },

      checkStageSuccess: (): boolean => {
        const state = get();
        if (!state.gameState.currentStage) return false;
        const stage = gameStages.find((s) => s.id === state.gameState.currentStage);
        if (!stage) return false;
        const successChance = state.gameState.currentSuccessRate;
        return Math.random() * 100 < successChance;
      },
    }),
    {
      name: "drug-learning-storage",
    }
  )
);
