import { Trophy, Home, RefreshCw, CheckCircle2, XCircle, AlertCircle, BookX, Zap } from "lucide-react";
import { useNavigate } from "react-router-dom";
import QuestionCard from "@/components/QuestionCard";
import ProgressBar from "@/components/ProgressBar";
import { quizQuestions } from "@/data/questions";
import { useStore } from "@/store/useStore";
import { cn } from "@/lib/utils";

export default function QuizResult() {
  const navigate = useNavigate();
  const {
    quizHistory,
    startQuiz,
    wrongQuestions,
    getSmartQuizQuestions,
    getQuestionAccuracy,
  } = useStore();

  const latestResult = quizHistory[0];

  if (!latestResult) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-700 mb-2">暂无测验结果</h2>
          <button
            onClick={() => navigate("/quiz")}
            className="btn-primary mt-4"
          >
            去做测验
          </button>
        </div>
      </div>
    );
  }

  const percentage = Math.round((latestResult.score / latestResult.totalQuestions) * 100);

  const questionsWithAnswers = latestResult.questionIds.map((qId, index) => {
    const question = quizQuestions.find((q) => q.id === qId);
    const userAnswer = latestResult.userAnswers[index];
    const isCorrect = question !== undefined && userAnswer === question.correctAnswer;
    const accuracy = question ? getQuestionAccuracy(question.id) : -1;
    return {
      question,
      userAnswer,
      isCorrect,
      index,
      accuracy,
    };
  });

  const correctCount = questionsWithAnswers.filter((q) => q.isCorrect).length;
  const wrongCount = questionsWithAnswers.filter((q) => !q.isCorrect).length;
  const activeWrongCount = wrongQuestions.filter((w) => !w.mastered).length;

  const getResultGrade = () => {
    if (percentage >= 90)
      return { label: "优秀", color: "text-accent-600", bg: "bg-accent-50", border: "border-accent-200" };
    if (percentage >= 70)
      return { label: "良好", color: "text-primary-600", bg: "bg-primary-50", border: "border-primary-200" };
    if (percentage >= 60)
      return { label: "及格", color: "text-warning-600", bg: "bg-warning-50", border: "border-warning-200" };
    return { label: "需要加油", color: "text-rose-600", bg: "bg-rose-50", border: "border-rose-200" };
  };

  const grade = getResultGrade();

  const handleRetry = () => {
    const questions = quizQuestions.filter((q) => latestResult.questionIds.includes(q.id));
    startQuiz(questions);
    navigate("/quiz/active");
  };

  const handleSmartPractice = () => {
    if (activeWrongCount === 0) {
      alert("错题本为空，无法开始智能重练");
      return;
    }
    const questions = getSmartQuizQuestions({ totalQuestions: Math.min(10, activeWrongCount + 5) });
    if (questions.length === 0) {
      alert("暂无可用题目");
      return;
    }
    startQuiz(questions);
    navigate("/quiz/active");
  };

  return (
    <div className="min-h-screen py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div
          className={cn(
            "bg-white rounded-2xl border shadow-sm overflow-hidden mb-8",
            grade.border
          )}
        >
          <div className={cn("p-8 text-center", grade.bg)}>
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-white shadow-md mb-4">
              <Trophy className={cn("w-10 h-10", grade.color)} />
            </div>

            <div className="mb-4">
              <span
                className={cn(
                  "inline-block px-4 py-1.5 rounded-full text-sm font-semibold",
                  grade.bg,
                  grade.color,
                  grade.border,
                  "border"
                )}
              >
                {grade.label}
              </span>
            </div>

            <div className="mb-6">
              <div className="flex items-baseline justify-center gap-2">
                <span className="text-6xl font-bold text-gray-900">{latestResult.score}</span>
                <span className="text-3xl text-gray-400">/ {latestResult.totalQuestions}</span>
              </div>
              <p className="text-2xl font-semibold text-gray-600 mt-2">{percentage} 分</p>
            </div>

            <div className="max-w-md mx-auto">
              <ProgressBar
                progress={percentage}
                size="lg"
                color={percentage >= 60 ? "accent" : "warning"}
              />
            </div>

            <div className="flex items-center justify-center gap-8 mt-6">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-accent-600" />
                <span className="text-gray-700">
                  答对 <strong className="text-accent-600">{correctCount}</strong> 题
                </span>
              </div>
              <div className="flex items-center gap-2">
                <XCircle className="w-5 h-5 text-rose-600" />
                <span className="text-gray-700">
                  答错 <strong className="text-rose-600">{wrongCount}</strong> 题
                </span>
              </div>
            </div>

            {wrongCount > 0 && (
              <div className="mt-6 text-sm text-gray-600">
                <p>
                  答错的题目已自动收录到
                  <button
                    onClick={() => navigate("/wrong-book")}
                    className="mx-1 text-primary-600 hover:underline font-medium inline-flex items-center gap-0.5"
                  >
                    <BookX className="w-3.5 h-3.5" />
                    错题本
                  </button>
                  ，可随时复习！
                </p>
              </div>
            )}
          </div>

          <div className="p-6 bg-white flex flex-col sm:flex-row sm:flex-wrap gap-3">
            <button
              onClick={() => navigate("/quiz")}
              className="btn-secondary flex-1 min-w-[140px] inline-flex items-center justify-center gap-2"
            >
              <Home className="w-4 h-4" />
              返回首页
            </button>
            <button
              onClick={() => navigate("/wrong-book")}
              className="btn-secondary flex-1 min-w-[140px] inline-flex items-center justify-center gap-2"
            >
              <BookX className="w-4 h-4" />
              查看错题本
            </button>
            <button
              onClick={handleRetry}
              className="btn-secondary flex-1 min-w-[140px] inline-flex items-center justify-center gap-2"
            >
              <RefreshCw className="w-4 h-4" />
              再来一次
            </button>
            {activeWrongCount > 0 && (
              <button
                onClick={handleSmartPractice}
                className="btn-primary flex-1 min-w-[140px] inline-flex items-center justify-center gap-2"
              >
                <Zap className="w-4 h-4" />
                智能重练
              </button>
            )}
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 sm:p-8">
          <h2 className="text-xl font-bold text-gray-900 mb-6">答题详情</h2>

          <div className="space-y-6">
            {questionsWithAnswers.map((item) => {
              if (!item.question) return null;
              return (
                <div key={item.question.id}>
                  <div className="flex flex-wrap items-center gap-2 mb-3">
                    <span
                      className={cn(
                        "inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium",
                        item.isCorrect
                          ? "bg-accent-50 text-accent-700"
                          : "bg-rose-50 text-rose-700"
                      )}
                    >
                      {item.isCorrect ? (
                        <CheckCircle2 className="w-3.5 h-3.5" />
                      ) : (
                        <XCircle className="w-3.5 h-3.5" />
                      )}
                      第 {item.index + 1} 题 {item.isCorrect ? "答对" : "答错"}
                    </span>
                    <span className="text-xs text-gray-500">
                      {item.question.category} ·
                      {item.question.difficulty === "easy"
                        ? "简单"
                        : item.question.difficulty === "medium"
                        ? "中等"
                        : "困难"}
                    </span>
                    {item.accuracy >= 0 && (
                      <span
                        className={cn(
                          "inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium",
                          item.accuracy >= 0.6
                            ? "bg-primary-50 text-primary-700"
                            : "bg-warning-50 text-warning-700"
                        )}
                      >
                        历史正确率 {Math.round(item.accuracy * 100)}%
                      </span>
                    )}
                  </div>
                  <QuestionCard
                    question={item.question.question}
                    options={item.question.options}
                    selectedAnswer={item.userAnswer ?? null}
                    showResult={true}
                    correctAnswer={item.question.correctAnswer}
                    explanation={item.question.explanation}
                    disabled={true}
                  />
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
