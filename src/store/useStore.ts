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
  LearningSession,
  LearningActivityType,
  DashboardAnalytics,
  ChapterMastery,
  DailyStudyRecord,
  ErrorTypeDistribution,
  ErrorCategory,
  WeakPoint,
} from "@/types";
import { generateId, shuffleArray } from "@/utils/helpers";
import { quizQuestions } from "@/data/questions";
import { initialComments } from "@/data/journalClub";
import { gameAchievements, gameStages } from "@/data/drugDevGame";
import { chapters } from "@/data/chapters";

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
      learningSessions: [],

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

      startLearningSession: (
        type: LearningActivityType,
        metadata?: { chapterId?: string; quizId?: string; caseId?: string }
      ): string => {
        const sessionId = generateId();
        const now = new Date().toISOString();
        const session: LearningSession = {
          id: sessionId,
          type,
          startTime: now,
          endTime: now,
          durationMinutes: 0,
          ...metadata,
        };
        set((state) => ({
          learningSessions: [...state.learningSessions, session],
        }));
        return sessionId;
      },

      endLearningSession: (sessionId: string) => {
        set((state) => {
          const updated = state.learningSessions.map((s) => {
            if (s.id === sessionId) {
              const end = new Date();
              const start = new Date(s.startTime);
              const durationMinutes = Math.max(
                1,
                Math.round((end.getTime() - start.getTime()) / 60000)
              );
              return {
                ...s,
                endTime: end.toISOString(),
                durationMinutes,
              };
            }
            return s;
          });
          return { learningSessions: updated };
        });
      },

      addLearningSession: (session: Omit<LearningSession, "id">) => {
        set((state) => ({
          learningSessions: [
            ...state.learningSessions,
            { ...session, id: generateId() },
          ],
        }));
      },

      getDashboardAnalytics: (): DashboardAnalytics => {
        const state = get();

        const errorCategoryLabels: Record<ErrorCategory, string> = {
          mechanism: "作用机制",
          indication: "适应症",
          dosage: "剂量用法",
          "adverse-reaction": "不良反应",
          contraindication: "禁忌症",
          interaction: "药物相互作用",
          pharmacokinetics: "药代动力学",
          "clinical-application": "临床应用",
          calculation: "计算问题",
          other: "其他",
        };

        const classifyError = (question: QuizQuestion): ErrorCategory => {
          const text = question.question.toLowerCase() + " " + question.explanation.toLowerCase();
          if (text.includes("机制") || text.includes("作用") || text.includes("原理")) return "mechanism";
          if (text.includes("适应症") || text.includes("用于") || text.includes("治疗")) return "indication";
          if (text.includes("剂量") || text.includes("用法") || text.includes("mg") || text.includes("给药")) return "dosage";
          if (text.includes("不良反应") || text.includes("副作用") || text.includes("毒性")) return "adverse-reaction";
          if (text.includes("禁忌") || text.includes("禁用") || text.includes("慎用")) return "contraindication";
          if (text.includes("相互作用") || text.includes("合用") || text.includes("联合")) return "interaction";
          if (text.includes("药代") || text.includes("半衰期") || text.includes("代谢") || text.includes("排泄")) return "pharmacokinetics";
          if (text.includes("临床") || text.includes("患者") || text.includes("病例")) return "clinical-application";
          if (text.includes("计算") || text.includes("清除率") || text.includes("浓度")) return "calculation";
          return "other";
        };

        const chapterMasteryList: ChapterMastery[] = chapters.map((chapter) => {
          const chapterQuestions = quizQuestions.filter((q) => q.category === chapter.category);
          const chapterProgress = state.learningProgress.find((p) => p.chapterId === chapter.id);
          const chapterQuizHistory = state.quizHistory.filter((qh) =>
            qh.questionIds.some((qid) => chapterQuestions.find((cq) => cq.id === qid))
          );

          let correctCount = 0;
          let totalAttempts = 0;
          let wrongCount = 0;

          chapterQuestions.forEach((q) => {
            const stats = state.questionStats.find((s) => s.questionId === q.id);
            if (stats) {
              totalAttempts += stats.totalAttempts;
              correctCount += stats.correctAttempts;
              wrongCount += stats.totalAttempts - stats.correctAttempts;
            }
            const wrong = state.wrongQuestions.find((w) => w.questionId === q.id);
            if (wrong && !stats) {
              wrongCount += wrong.wrongCount;
              totalAttempts += wrong.wrongCount;
            }
          });

          const masteryRate =
            totalAttempts > 0
              ? Math.round((correctCount / totalAttempts) * 100)
              : chapterProgress?.status === "completed"
              ? chapterProgress.score
              : chapterProgress?.status === "in-progress"
              ? 50
              : 0;

          const totalScores = chapterQuizHistory.reduce(
            (sum, qh) => sum + (qh.score / qh.totalQuestions) * 100,
            0
          );
          const avgScore =
            chapterQuizHistory.length > 0
              ? Math.round(totalScores / chapterQuizHistory.length)
              : 0;

          return {
            chapterId: chapter.id,
            chapterTitle: chapter.title,
            category: chapter.category,
            masteryRate,
            totalQuestions: chapterQuestions.length,
            correctCount,
            wrongCount,
            quizAttempts: chapterQuizHistory.length,
            avgScore,
          };
        });

        const dailyMap = new Map<string, DailyStudyRecord>();
        const defaultActivities: Record<LearningActivityType, number> = {
          chapter: 0,
          quiz: 0,
          case: 0,
          tdm: 0,
          adr: 0,
          consultation: 0,
          notes: 0,
          game: 0,
        };

        state.learningSessions.forEach((session) => {
          const date = session.startTime.split("T")[0];
          if (!dailyMap.has(date)) {
            dailyMap.set(date, {
              date,
              totalMinutes: 0,
              activities: { ...defaultActivities },
            });
          }
          const record = dailyMap.get(date)!;
          record.totalMinutes += session.durationMinutes;
          record.activities[session.type] =
            (record.activities[session.type] || 0) + session.durationMinutes;
        });

        state.quizHistory.forEach((qh) => {
          const date = qh.date.split("T")[0];
          if (!dailyMap.has(date)) {
            dailyMap.set(date, {
              date,
              totalMinutes: 0,
              activities: { ...defaultActivities },
            });
          }
          const record = dailyMap.get(date)!;
          record.totalMinutes += 5;
          record.activities.quiz += 5;
        });

        const today = new Date();
        for (let i = 29; i >= 0; i--) {
          const d = new Date(today);
          d.setDate(d.getDate() - i);
          const dateStr = d.toISOString().split("T")[0];
          if (!dailyMap.has(dateStr)) {
            dailyMap.set(dateStr, {
              date: dateStr,
              totalMinutes: 0,
              activities: { ...defaultActivities },
            });
          }
        }

        const dailyStudyRecords = Array.from(dailyMap.values()).sort((a, b) =>
          a.date.localeCompare(b.date)
        );

        const totalStudyDays = dailyStudyRecords.filter((d) => d.totalMinutes > 0).length;
        const totalStudyMinutes = dailyStudyRecords.reduce(
          (sum, d) => sum + d.totalMinutes,
          0
        );
        const avgDailyMinutes =
          totalStudyDays > 0 ? Math.round(totalStudyMinutes / totalStudyDays) : 0;

        let streakDays = 0;
        const sortedDates = dailyStudyRecords
          .filter((d) => d.totalMinutes > 0)
          .map((d) => d.date)
          .sort((a, b) => b.localeCompare(a));
        if (sortedDates.length > 0) {
          const yesterday = new Date();
          yesterday.setDate(yesterday.getDate() - 1);
          let currentCheckTime = Math.max(
            new Date(sortedDates[0]).getTime(),
            yesterday.getTime()
          );
          for (const d of sortedDates) {
            const recordDate = new Date(d);
            recordDate.setHours(0, 0, 0, 0);
            const checkDate = new Date(currentCheckTime);
            checkDate.setHours(0, 0, 0, 0);
            if (
              recordDate.getTime() === checkDate.getTime() ||
              (streakDays === 0 && recordDate <= checkDate)
            ) {
              streakDays++;
              currentCheckTime = checkDate.setDate(checkDate.getDate() - 1);
            } else if (streakDays > 0) {
              break;
            }
          }
          if (streakDays === 0 && sortedDates.length > 0) {
            streakDays = 1;
          }
        }

        const errorCounts = new Map<ErrorCategory, number>();
        const totalErrors = state.wrongQuestions.reduce(
          (sum, w) => sum + w.wrongCount,
          0
        );

        state.wrongQuestions.forEach((w) => {
          const question = quizQuestions.find((q) => q.id === w.questionId);
          if (question) {
            const category = classifyError(question);
            errorCounts.set(
              category,
              (errorCounts.get(category) || 0) + w.wrongCount
            );
          }
        });

        const errorTypeDistribution: ErrorTypeDistribution[] = (
          Object.keys(errorCategoryLabels) as ErrorCategory[]
        ).map((cat) => ({
          category: cat,
          categoryLabel: errorCategoryLabels[cat],
          count: errorCounts.get(cat) || 0,
          percentage:
            totalErrors > 0
              ? Math.round(((errorCounts.get(cat) || 0) / totalErrors) * 100)
              : 0,
        }));

        const weakPoints: WeakPoint[] = [];

        const categoryStats = new Map<string, { correct: number; total: number; questionIds: string[] }>();
        quizQuestions.forEach((q) => {
          if (!categoryStats.has(q.category)) {
            categoryStats.set(q.category, { correct: 0, total: 0, questionIds: [] });
          }
          const stats = state.questionStats.find((s) => s.questionId === q.id);
          const catStat = categoryStats.get(q.category)!;
          catStat.questionIds.push(q.id);
          if (stats) {
            catStat.total += stats.totalAttempts;
            catStat.correct += stats.correctAttempts;
          }
          const wrong = state.wrongQuestions.find((w) => w.questionId === q.id);
          if (wrong) {
            catStat.total += wrong.wrongCount;
          }
        });

        categoryStats.forEach((stat, category) => {
          if (stat.total > 0) {
            const accuracy = Math.round((stat.correct / stat.total) * 100);
            if (accuracy < 70) {
              const priority = accuracy < 40 ? "high" : accuracy < 60 ? "medium" : "low";
              const chapter = chapters.find((c) => c.category === category);
              weakPoints.push({
                id: `cat-${category}`,
                type: "category",
                name: category,
                description: `${category}相关知识点正确率较低，建议重点复习${chapter?.title || ""}章节`,
                errorCount: stat.total - stat.correct,
                totalAttempts: stat.total,
                accuracy,
                priority,
                relatedQuestionIds: stat.questionIds,
              });
            }
          }
        });

        chapterMasteryList.forEach((cm) => {
          if (cm.masteryRate < 60 && cm.totalQuestions > 0) {
            const existing = weakPoints.find((w) => w.name === cm.category);
            if (!existing) {
              const priority = cm.masteryRate < 30 ? "high" : cm.masteryRate < 50 ? "medium" : "low";
              weakPoints.push({
                id: `chap-${cm.chapterId}`,
                type: "chapter",
                name: cm.chapterTitle,
                description: `章节掌握度仅 ${cm.masteryRate}%，建议回顾章节内容并加强练习`,
                errorCount: cm.wrongCount,
                totalAttempts: cm.correctCount + cm.wrongCount,
                accuracy: cm.masteryRate,
                priority,
                relatedQuestionIds: quizQuestions
                  .filter((q) => q.category === cm.category)
                  .map((q) => q.id),
              });
            }
          }
        });

        weakPoints.sort((a, b) => {
          const priorityOrder = { high: 0, medium: 1, low: 2 };
          return priorityOrder[a.priority] - priorityOrder[b.priority] || a.accuracy - b.accuracy;
        });

        const overallMasteryRate =
          chapterMasteryList.length > 0
            ? Math.round(
                chapterMasteryList.reduce((sum, cm) => sum + cm.masteryRate, 0) /
                  chapterMasteryList.length
              )
            : 0;

        return {
          totalStudyDays,
          totalStudyMinutes,
          avgDailyMinutes,
          streakDays,
          chapterMasteryList,
          dailyStudyRecords,
          errorTypeDistribution,
          weakPoints: weakPoints.slice(0, 5),
          overallMasteryRate,
        };
      },
    }),
    {
      name: "drug-learning-storage",
    }
  )
);
