import { useEffect } from "react";
import { ChevronLeft, ChevronRight, Send, AlertCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import QuestionCard from "@/components/QuestionCard";
import ProgressBar from "@/components/ProgressBar";
import { useStore } from "@/store/useStore";

export default function QuizActive() {
  const navigate = useNavigate();
  const {
    currentQuiz,
    answerCurrentQuestion,
    nextQuestion,
    finishQuiz,
    clearCurrentQuiz,
  } = useStore();

  useEffect(() => {
    if (!currentQuiz) {
      navigate("/quiz");
    }
  }, [currentQuiz, navigate]);

  if (!currentQuiz) {
    return null;
  }

  const { questions, currentIndex, userAnswers } = currentQuiz;
  const totalQuestions = questions.length;
  const currentQuestion = questions[currentIndex];
  const currentAnswer = userAnswers[currentIndex];
  const isLastQuestion = currentIndex === totalQuestions - 1;
  const isFirstQuestion = currentIndex === 0;
  const allAnswered = userAnswers.filter((a) => a !== undefined).length === totalQuestions;
  const answeredCount = userAnswers.filter((a) => a !== undefined).length;
  const progress = (answeredCount / totalQuestions) * 100;

  const handlePrev = () => {
    if (isFirstQuestion) return;
    useStore.setState((state) => ({
      currentQuiz: state.currentQuiz
        ? { ...state.currentQuiz, currentIndex: state.currentQuiz.currentIndex - 1 }
        : null,
    }));
  };

  const handleNext = () => {
    if (isLastQuestion) return;
    nextQuestion();
  };

  const handleSubmit = () => {
    if (!allAnswered) {
      if (!confirm(`还有 ${totalQuestions - answeredCount} 道题未作答，确定要提交吗？`)) {
        return;
      }
    }
    finishQuiz();
    navigate("/quiz/result");
  };

  const handleQuit = () => {
    if (confirm("确定要退出测验吗？当前答题进度将不会保存。")) {
      clearCurrentQuiz();
      navigate("/quiz");
    }
  };

  return (
    <div className="min-h-screen py-6 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 mb-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <span className="text-lg font-semibold text-gray-900">
                第 {currentIndex + 1} 题
              </span>
              <span className="text-gray-400">/</span>
              <span className="text-gray-500">共 {totalQuestions} 题</span>
            </div>
            <button
              onClick={handleQuit}
              className="text-sm text-gray-500 hover:text-rose-600 transition-colors"
            >
              退出测验
            </button>
          </div>
          <ProgressBar
            progress={progress}
            label="答题进度"
            showPercentage={false}
            size="lg"
          />
        </div>

        <div className="mb-6">
          <QuestionCard
            question={currentQuestion.question}
            options={currentQuestion.options}
            selectedAnswer={currentAnswer ?? null}
            onSelect={(index) => answerCurrentQuestion(index)}
            questionNumber={currentIndex + 1}
            totalQuestions={totalQuestions}
          />

          <div className="mt-4 flex items-start gap-2">
            <AlertCircle className="w-4 h-4 text-gray-400 mt-0.5 flex-shrink-0" />
            <p className="text-sm text-gray-500">
              分类：{currentQuestion.category} · 难度：
              {currentQuestion.difficulty === "easy"
                ? "简单"
                : currentQuestion.difficulty === "medium"
                ? "中等"
                : "困难"}
            </p>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4">
          <div className="flex flex-wrap gap-2 mb-4">
            {questions.map((_, index) => (
              <button
                key={index}
                onClick={() => {
                  useStore.setState((state) => ({
                    currentQuiz: state.currentQuiz
                      ? { ...state.currentQuiz, currentIndex: index }
                      : null,
                  }));
                }}
                className={`w-9 h-9 rounded-lg text-sm font-medium transition-all duration-200 ${
                  index === currentIndex
                    ? "bg-primary-600 text-white shadow-md"
                    : userAnswers[index] !== undefined
                    ? "bg-primary-50 text-primary-700 border border-primary-200 hover:bg-primary-100"
                    : "bg-gray-50 text-gray-600 border border-gray-200 hover:bg-gray-100"
                }`}
              >
                {index + 1}
              </button>
            ))}
          </div>

          <div className="flex items-center justify-between gap-3">
            <button
              onClick={handlePrev}
              disabled={isFirstQuestion}
              className={`inline-flex items-center gap-1.5 px-5 py-2.5 rounded-lg font-medium transition-all duration-200 ${
                isFirstQuestion
                  ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                  : "bg-white text-gray-700 border border-gray-200 hover:bg-gray-50"
              }`}
            >
              <ChevronLeft className="w-4 h-4" />
              上一题
            </button>

            {isLastQuestion ? (
              <button
                onClick={handleSubmit}
                className="inline-flex items-center gap-1.5 px-6 py-2.5 rounded-lg bg-accent-600 hover:bg-accent-700 text-white font-medium shadow-md hover:shadow-lg transition-all duration-200 active:scale-[0.99]"
              >
                <Send className="w-4 h-4" />
                提交测验
              </button>
            ) : (
              <button
                onClick={handleNext}
                className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-lg bg-primary-600 hover:bg-primary-700 text-white font-medium shadow-md hover:shadow-lg transition-all duration-200 active:scale-[0.99]"
              >
                下一题
                <ChevronRight className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
