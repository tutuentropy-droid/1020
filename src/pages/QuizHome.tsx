import { useState, useMemo } from "react";
import { ClipboardList, Clock, Trophy, ChevronRight, Target, History, Sparkles, AlertTriangle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { quizQuestions } from "@/data/questions";
import { useStore } from "@/store/useStore";
import { getRandomQuestions, formatDate } from "@/utils/helpers";

const categories = [
  { value: "all", label: "全部分类" },
  { value: "抗生素", label: "抗生素" },
  { value: "心血管药物", label: "心血管药物" },
  { value: "消化系统药物", label: "消化系统药物" },
  { value: "呼吸系统药物", label: "呼吸系统药物" },
  { value: "神经系统药物", label: "神经系统药物" },
  { value: "内分泌系统药物", label: "内分泌系统药物" },
];

const difficulties = [
  { value: "all", label: "全部难度" },
  { value: "easy", label: "简单" },
  { value: "medium", label: "中等" },
  { value: "hard", label: "困难" },
];

const QUIZ_COUNT = 10;

export default function QuizHome() {
  const navigate = useNavigate();
  const { startQuiz, quizHistory } = useStore();

  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedDifficulty, setSelectedDifficulty] = useState("all");

  const availableQuestions = useMemo(() => {
    let filtered = quizQuestions;
    if (selectedCategory !== "all") {
      filtered = filtered.filter((q) => q.category === selectedCategory);
    }
    if (selectedDifficulty !== "all") {
      filtered = filtered.filter((q) => q.difficulty === selectedDifficulty);
    }
    return filtered;
  }, [selectedCategory, selectedDifficulty]);

  const actualQuestionCount = Math.min(QUIZ_COUNT, availableQuestions.length);
  const hasInsufficientQuestions = availableQuestions.length < QUIZ_COUNT;

  const handleStartQuiz = () => {
    const questions = getRandomQuestions(
      availableQuestions,
      QUIZ_COUNT
    );
    if (questions.length === 0) {
      alert("暂无符合条件的题目，请调整筛选条件");
      return;
    }
    startQuiz(questions);
    navigate("/quiz/active");
  };

  return (
    <div className="min-h-screen py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-accent-100 mb-4">
            <ClipboardList className="w-8 h-8 text-accent-600" />
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-3">
            药学知识测验
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            检验你的药学知识掌握程度，随机抽取题目进行限时练习
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-primary-50 flex items-center justify-center">
              <Target className="w-6 h-6 text-primary-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">题库总量</p>
              <p className="text-2xl font-bold text-gray-900">{quizQuestions.length}</p>
            </div>
          </div>
          <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-accent-50 flex items-center justify-center">
              <History className="w-6 h-6 text-accent-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">测验次数</p>
              <p className="text-2xl font-bold text-gray-900">{quizHistory.length}</p>
            </div>
          </div>
          <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-warning-50 flex items-center justify-center">
              <Trophy className="w-6 h-6 text-warning-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">最高分</p>
              <p className="text-2xl font-bold text-gray-900">
                {quizHistory.length > 0
                  ? `${Math.max(...quizHistory.map((h) => h.score))}/${quizHistory[0]?.totalQuestions || 10}`
                  : "-"}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 sm:p-8 mb-8">
          <div className="flex items-center gap-2 mb-6">
            <Sparkles className="w-5 h-5 text-primary-600" />
            <h2 className="text-lg font-semibold text-gray-900">测验配置</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                选择分类
              </label>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="input-field"
              >
                {categories.map((c) => (
                  <option key={c.value} value={c.value}>
                    {c.label}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                选择难度
              </label>
              <select
                value={selectedDifficulty}
                onChange={(e) => setSelectedDifficulty(e.target.value)}
                className="input-field"
              >
                {difficulties.map((d) => (
                  <option key={d.value} value={d.value}>
                    {d.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="flex items-center justify-between p-4 rounded-xl bg-gray-50 border border-gray-100 mb-3">
            <div className="flex items-center gap-2">
              <Clock className="w-5 h-5 text-gray-500" />
              <span className="text-gray-700">题目数量</span>
            </div>
            <span className="font-semibold text-gray-900">{actualQuestionCount} 道</span>
          </div>

          {hasInsufficientQuestions && (
            <div className="flex items-start gap-2 p-4 rounded-xl bg-warning-50 border border-warning-200 mb-6 animate-fade-in">
              <AlertTriangle className="w-5 h-5 text-warning-600 mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-sm font-medium text-warning-800">
                  当前筛选条件下只有 {availableQuestions.length} 道题
                </p>
                <p className="text-xs text-warning-600 mt-0.5">
                  已自动调整为可用数量，可切换分类或难度以获得更多题目
                </p>
              </div>
            </div>
          )}

          <button
            onClick={handleStartQuiz}
            className="w-full py-4 rounded-xl bg-gradient-to-r from-accent-600 to-primary-600 hover:from-accent-700 hover:to-primary-700 text-white font-semibold text-lg shadow-lg hover:shadow-xl transition-all duration-200 active:scale-[0.99]"
          >
            开始测验
          </button>
        </div>

        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 sm:p-8">
          <h2 className="text-lg font-semibold text-gray-900 mb-5">测验历史</h2>

          {quizHistory.length === 0 ? (
            <div className="text-center py-10">
              <History className="w-12 h-12 text-gray-300 mx-auto mb-3" />
              <p className="text-gray-500">暂无测验记录，开始你的第一次测验吧！</p>
            </div>
          ) : (
            <div className="space-y-3">
              {quizHistory.slice(0, 10).map((record, index) => {
                const percentage = Math.round((record.score / record.totalQuestions) * 100);
                return (
                  <div
                    key={record.id}
                    className="flex items-center justify-between p-4 rounded-xl border border-gray-100 hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex items-center gap-4">
                      <div
                        className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold text-sm ${
                          percentage >= 80
                            ? "bg-accent-50 text-accent-700"
                            : percentage >= 60
                            ? "bg-warning-50 text-warning-700"
                            : "bg-rose-50 text-rose-700"
                        }`}
                      >
                        {index + 1}
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">
                          {formatDate(record.date)}
                        </p>
                        <p className="text-sm text-gray-500">
                          {record.totalQuestions} 道题
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <span
                        className={`font-bold text-lg ${
                          percentage >= 80
                            ? "text-accent-600"
                            : percentage >= 60
                            ? "text-warning-600"
                            : "text-rose-600"
                        }`}
                      >
                        {record.score}/{record.totalQuestions}
                      </span>
                      <ChevronRight className="w-5 h-5 text-gray-400" />
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
