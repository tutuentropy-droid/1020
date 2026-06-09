import { useState, useMemo } from "react";
import {
  BookX,
  ChevronRight,
  Trash2,
  CheckCircle,
  Filter,
  Play,
  Lightbulb,
  AlertCircle,
  BarChart3,
  RefreshCw,
  LayoutGrid,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useStore } from "@/store/useStore";
import { quizQuestions } from "@/data/questions";
import { formatDate } from "@/utils/helpers";
import QuestionCard from "@/components/QuestionCard";
import Empty from "@/components/Empty";
import { cn } from "@/lib/utils";

const categories = [
  { value: "all", label: "全部分类" },
  { value: "抗生素", label: "抗生素" },
  { value: "心血管药物", label: "心血管药物" },
  { value: "消化系统药物", label: "消化系统药物" },
  { value: "呼吸系统药物", label: "呼吸系统药物" },
  { value: "神经系统药物", label: "神经系统药物" },
  { value: "内分泌系统药物", label: "内分泌系统药物" },
];

export default function WrongBook() {
  const navigate = useNavigate();
  const {
    wrongQuestions,
    questionStats,
    removeWrongQuestion,
    markWrongQuestionMastered,
    getSmartQuizQuestions,
    startQuiz,
    getQuestionAccuracy,
    clearWrongQuestions,
  } = useStore();

  const [selectedCategory, setSelectedCategory] = useState("all");
  const [showMastered, setShowMastered] = useState(false);
  const [expandedQuestion, setExpandedQuestion] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<"list" | "grouped">("grouped");

  const wrongQuestionsWithDetails = useMemo(() => {
    return wrongQuestions
      .map((wq) => {
        const question = quizQuestions.find((q) => q.id === wq.questionId);
        const stats = questionStats.find((s) => s.questionId === wq.questionId);
        const accuracy = getQuestionAccuracy(wq.questionId);
        return { ...wq, question, stats, accuracy };
      })
      .filter((item) => item.question !== undefined);
  }, [wrongQuestions, questionStats, getQuestionAccuracy]);

  const filteredWrongQuestions = useMemo(() => {
    let filtered = wrongQuestionsWithDetails;
    if (selectedCategory !== "all") {
      filtered = filtered.filter((wq) => wq.question!.category === selectedCategory);
    }
    if (!showMastered) {
      filtered = filtered.filter((wq) => !wq.mastered);
    }
    return filtered;
  }, [wrongQuestionsWithDetails, selectedCategory, showMastered]);

  const groupedByCategory = useMemo(() => {
    const groups: Record<string, typeof filteredWrongQuestions> = {};
    filteredWrongQuestions.forEach((wq) => {
      const cat = wq.question!.category;
      if (!groups[cat]) {
        groups[cat] = [];
      }
      groups[cat].push(wq);
    });
    return groups;
  }, [filteredWrongQuestions]);

  const activeCount = wrongQuestions.filter((wq) => !wq.mastered).length;
  const masteredCount = wrongQuestions.filter((wq) => wq.mastered).length;

  const handleSmartPractice = () => {
    if (activeCount === 0) {
      alert("错题本为空，无法开始智能重练");
      return;
    }
    const questions = getSmartQuizQuestions(
      { totalQuestions: Math.min(10, activeCount + 5) },
      selectedCategory !== "all" ? selectedCategory : undefined
    );
    if (questions.length === 0) {
      alert("暂无可用题目");
      return;
    }
    startQuiz(questions);
    navigate("/quiz/active");
  };

  const handleClearAll = () => {
    if (confirm("确定要清空所有错题吗？此操作不可撤销。")) {
      clearWrongQuestions();
    }
  };

  if (wrongQuestionsWithDetails.length === 0) {
    return (
      <div className="min-h-screen py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-10">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-rose-100 mb-4">
              <BookX className="w-8 h-8 text-rose-600" />
            </div>
            <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-3">
              错题本
            </h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              自动收录答错的题目，帮你针对性复习薄弱知识点
            </p>
          </div>
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-12">
            <div className="text-center">
              <BookX className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-700 mb-2">
                暂无错题记录
              </h3>
              <p className="text-gray-500 mb-6">
                完成测验后，答错的题目会自动收录到这里
              </p>
              <button
                onClick={() => navigate("/quiz")}
                className="btn-primary inline-flex items-center gap-2"
              >
                <Play className="w-4 h-4" />
                去做测验
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-rose-100 mb-4">
            <BookX className="w-8 h-8 text-rose-600" />
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-3">
            错题本
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            自动收录答错的题目，帮你针对性复习薄弱知识点
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-rose-50 flex items-center justify-center">
              <AlertCircle className="w-6 h-6 text-rose-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">待复习</p>
              <p className="text-2xl font-bold text-gray-900">{activeCount}</p>
            </div>
          </div>
          <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-accent-50 flex items-center justify-center">
              <CheckCircle className="w-6 h-6 text-accent-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">已掌握</p>
              <p className="text-2xl font-bold text-gray-900">{masteredCount}</p>
            </div>
          </div>
          <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-primary-50 flex items-center justify-center">
              <BarChart3 className="w-6 h-6 text-primary-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">累计错题</p>
              <p className="text-2xl font-bold text-gray-900">{wrongQuestions.length}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 mb-6">
          <div className="flex flex-col sm:flex-row sm:items-center gap-4 justify-between mb-4">
            <div className="flex flex-wrap items-center gap-3">
              <div className="flex items-center gap-2">
                <Filter className="w-4 h-4 text-gray-500" />
                <label className="text-sm font-medium text-gray-700">分类筛选</label>
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="input-field py-2 text-sm"
                >
                  {categories.map((c) => (
                    <option key={c.value} value={c.value}>
                      {c.label}
                    </option>
                  ))}
                </select>
              </div>
              <label className="inline-flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={showMastered}
                  onChange={(e) => setShowMastered(e.target.checked)}
                  className="w-4 h-4 rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                />
                <span className="text-sm text-gray-700">显示已掌握</span>
              </label>
              <div className="flex items-center gap-1 p-1 bg-gray-100 rounded-lg">
                <button
                  onClick={() => setViewMode("grouped")}
                  className={cn(
                    "inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm font-medium transition-all",
                    viewMode === "grouped"
                      ? "bg-white text-gray-900 shadow-sm"
                      : "text-gray-600 hover:text-gray-900"
                  )}
                >
                  <LayoutGrid className="w-4 h-4" />
                  分类
                </button>
                <button
                  onClick={() => setViewMode("list")}
                  className={cn(
                    "inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm font-medium transition-all",
                    viewMode === "list"
                      ? "bg-white text-gray-900 shadow-sm"
                      : "text-gray-600 hover:text-gray-900"
                  )}
                >
                  <BarChart3 className="w-4 h-4" />
                  列表
                </button>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={handleClearAll}
                className="btn-secondary inline-flex items-center gap-1.5 text-sm"
              >
                <Trash2 className="w-4 h-4" />
                清空
              </button>
              <button
                onClick={handleSmartPractice}
                disabled={activeCount === 0}
                className="btn-primary inline-flex items-center gap-1.5 text-sm disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <RefreshCw className="w-4 h-4" />
                智能重练
              </button>
            </div>
          </div>

          {filteredWrongQuestions.length === 0 ? (
            <div className="py-12">
              <Empty />
            </div>
          ) : viewMode === "grouped" ? (
            <div className="space-y-6">
              {Object.entries(groupedByCategory).map(([category, questions]) => (
                <div key={category}>
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-base font-semibold text-gray-900 flex items-center gap-2">
                      <span className="w-1 h-5 rounded-full bg-primary-500"></span>
                      {category}
                      <span className="text-sm font-normal text-gray-500">
                        ({questions.length} 题)
                      </span>
                    </h3>
                  </div>
                  <div className="space-y-3">
                    {questions.map((wq) => (
                      <WrongQuestionItem
                        key={wq.questionId}
                        item={wq}
                        expanded={expandedQuestion === wq.questionId}
                        onToggle={() =>
                          setExpandedQuestion(
                            expandedQuestion === wq.questionId ? null : wq.questionId
                          )
                        }
                        onMastered={() => markWrongQuestionMastered(wq.questionId)}
                        onRemove={() => removeWrongQuestion(wq.questionId)}
                      />
                    ))}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="space-y-3">
              {filteredWrongQuestions.map((wq) => (
                <WrongQuestionItem
                  key={wq.questionId}
                  item={wq}
                  expanded={expandedQuestion === wq.questionId}
                  onToggle={() =>
                    setExpandedQuestion(
                      expandedQuestion === wq.questionId ? null : wq.questionId
                    )
                  }
                  onMastered={() => markWrongQuestionMastered(wq.questionId)}
                  onRemove={() => removeWrongQuestion(wq.questionId)}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

interface WrongQuestionItemProps {
  item: any;
  expanded: boolean;
  onToggle: () => void;
  onMastered: () => void;
  onRemove: () => void;
}

function WrongQuestionItem({
  item,
  expanded,
  onToggle,
  onMastered,
  onRemove,
}: WrongQuestionItemProps) {
  const { question, wrongCount, lastWrongDate, accuracy, mastered } = item;

  return (
    <div
      className={cn(
        "rounded-xl border transition-all duration-200 overflow-hidden",
        expanded ? "border-primary-200 shadow-md" : "border-gray-100 hover:border-gray-200"
      )}
    >
      <div
        className="p-4 flex items-center gap-4 cursor-pointer hover:bg-gray-50/50 transition-colors"
        onClick={onToggle}
      >
        <div
          className={cn(
            "w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0",
            mastered ? "bg-accent-50" : "bg-rose-50"
          )}
        >
          {mastered ? (
            <CheckCircle className="w-5 h-5 text-accent-600" />
          ) : (
            <AlertCircle className="w-5 h-5 text-rose-600" />
          )}
        </div>
        <div className="flex-1 min-w-0">
          <p className="font-medium text-gray-900 line-clamp-1 mb-1">
            {question.question}
          </p>
          <div className="flex flex-wrap items-center gap-3 text-xs text-gray-500">
            <span>错误 {wrongCount} 次</span>
            <span>·</span>
            <span>最近：{formatDate(lastWrongDate)}</span>
            {accuracy >= 0 && (
              <>
                <span>·</span>
                <span
                  className={cn(
                    "font-medium",
                    accuracy >= 0.6 ? "text-accent-600" : "text-rose-600"
                  )}
                >
                  正确率 {Math.round(accuracy * 100)}%
                </span>
              </>
            )}
            {mastered && (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-accent-50 text-accent-700">
                <CheckCircle className="w-3 h-3" />
                已掌握
              </span>
            )}
          </div>
        </div>
        <div className="flex items-center gap-1 flex-shrink-0">
          {!mastered && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onMastered();
              }}
              className="p-2 rounded-lg hover:bg-accent-50 text-gray-400 hover:text-accent-600 transition-colors"
              title="标记为已掌握"
            >
              <CheckCircle className="w-4 h-4" />
            </button>
          )}
          <button
            onClick={(e) => {
              e.stopPropagation();
              if (confirm("确定要从错题本中移除这道题吗？")) onRemove();
            }}
            className="p-2 rounded-lg hover:bg-rose-50 text-gray-400 hover:text-rose-600 transition-colors"
            title="移除错题"
          >
            <Trash2 className="w-4 h-4" />
          </button>
          <ChevronRight
            className={cn(
              "w-5 h-5 text-gray-400 transition-transform duration-200",
              expanded && "rotate-90"
            )}
          />
        </div>
      </div>
      {expanded && (
        <div className="px-4 pb-4 border-t border-gray-50 pt-4 animate-fade-in">
          <QuestionCard
            question={question.question}
            options={question.options}
            selectedAnswer={item.wrongAnswers[item.wrongAnswers.length - 1]}
            showResult={true}
            correctAnswer={question.correctAnswer}
            explanation={question.explanation}
            disabled={true}
          />
        </div>
      )}
    </div>
  );
}
