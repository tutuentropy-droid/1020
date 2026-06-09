import { useState, useEffect } from "react";
import {
  ArrowLeft, Tag, BookOpen, CheckCircle2, AlertCircle } from "lucide-react";
import { useParams, useNavigate } from "react-router-dom";
import QuestionCard from "@/components/QuestionCard";
import { chapters } from "@/data/chapters";
import { useStore } from "@/store/useStore";
import { cn } from "@/lib/utils";

function parseMarkdown(content: string): string {
  let html = content.trim();

  html = html.replace(/^######\s+(.+?)$/gm, '<h4>$1</h4>');
  html = html.replace(/^###\s+(.+?)$/gm, '<h3>$1</h3>');
  html = html.replace(/^##\s+(.+?)$/gm, '<h2>$1</h2>');

  html = html.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');

  html = html.replace(/\|(.+)\|/g, (match) => {
    if (match.includes("---")) return match;
    const cells = match.split("|").slice(1, -1).map((c) => c.trim());
    return "<tr>" + cells.map((c) => `<td>${c}</td>`).join("") + "</tr>";
  });

  html = html.replace(/^\|[\s\S]*?<\/tr>\s*\|.*?<\/tr>/g, (match) => {
    if (match.includes("---")) {
      const rows = match.split("\n").filter((line) => line.trim().startsWith("<tr>"));
      return "<table>" + rows.join("") + "</table>";
    }
    return match;
  });

  const lines = html.split("\n");
  let inList = false;
  let listItems: string[] = [];
  const result: string[] = [];

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line) {
      if (inList) {
        result.push("<ul>" + listItems.join("") + "</ul>");
        listItems = [];
        inList = false;
      }
      continue;
    }
    if (line.startsWith("- ")) {
      inList = true;
      listItems.push("<li>" + line.substring(2) + "</li>");
    } else if (line.startsWith("  - ")) {
      inList = true;
      listItems.push("<li>" + line.substring(4) + "</li>");
    } else if (
      !line.startsWith("<h") &&
      !line.startsWith("<t") &&
      !line.startsWith("</t") &&
      !line.startsWith("<ul") &&
      !line.startsWith("</ul")
    ) {
      if (inList) {
        result.push("<ul>" + listItems.join("") + "</ul>");
        listItems = [];
        inList = false;
      }
      if (!line.match(/^\d+\./)) {
        result.push("<p>" + line + "</p>");
      } else {
        result.push("<p>" + line + "</p>");
      }
    } else {
      if (inList) {
        result.push("<ul>" + listItems.join("") + "</ul>");
        listItems = [];
        inList = false;
      }
      result.push(line);
    }
  }
  if (inList) {
    result.push("<ul>" + listItems.join("") + "</ul>");
  }

  return result.join("\n");
}

export default function LearnDetail() {
  const { chapterId } = useParams<{ chapterId: string }>();
  const navigate = useNavigate();
  const { updateChapterProgress } = useStore();

  const chapter = chapters.find((c) => c.id === chapterId);

  const [quizAnswers, setQuizAnswers] = useState<(number | null)[]>(
    chapter ? chapter.quizzes.map(() => null) : []
  );
  const [showResults, setShowResults] = useState(false);

  useEffect(() => {
    if (chapter) {
      setQuizAnswers(chapter.quizzes.map(() => null));
      setShowResults(false);
    }
  }, [chapterId, chapter]);

  if (!chapter) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-700 mb-2">章节未找到</h2>
          <button
            onClick={() => navigate("/learn")}
            className="btn-primary mt-4"
          >
            返回章节列表
          </button>
        </div>
      </div>
    );
  }

  const allAnswered = quizAnswers.every((a) => a !== null);
  const correctCount = quizAnswers.filter(
    (a, i) => a === chapter.quizzes[i].correctAnswer
  ).length;

  const handleSelectAnswer = (quizIndex: number, answerIndex: number) => {
    if (showResults) return;
    const newAnswers = [...quizAnswers];
    newAnswers[quizIndex] = answerIndex;
    setQuizAnswers(newAnswers);
  };

  const handleSubmit = () => {
    if (!allAnswered) return;
    setShowResults(true);
    const score = Math.round((correctCount / chapter.quizzes.length) * 100);
    updateChapterProgress(chapter.id, "completed", score);
  };

  const contentHtml = parseMarkdown(chapter.content);

  return (
    <div className="min-h-screen py-6 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <button
          onClick={() => navigate("/learn")}
          className="inline-flex items-center gap-2 text-gray-600 hover:text-primary-600 mb-6 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>返回章节列表</span>
        </button>

        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden mb-8">
          <div className="relative aspect-[21/9] overflow-hidden bg-gray-100">
            <img
              src={chapter.imageUrl}
              alt={chapter.title}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/20 to-transparent" />
            <div className="absolute bottom-0 left-0 right-0 p-6 sm:p-8">
              <div className="flex items-center gap-2 mb-3">
                <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-white/20 backdrop-blur-sm text-white text-sm font-medium">
                  <Tag className="w-3.5 h-3.5" />
                  {chapter.category}
                </span>
                <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-white/20 backdrop-blur-sm text-white text-sm font-medium">
                  <BookOpen className="w-3.5 h-3.5" />
                  第 {chapter.order} 章
                </span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-bold text-white">
                {chapter.title}
              </h1>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <div className="hidden lg:block">
            <div className="sticky top-6">
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4">
                <h3 className="font-semibold text-gray-800 mb-3">章节目录</h3>
                <div className="space-y-1">
                  {chapters.map((c, idx) => (
                    <button
                      key={c.id}
                      onClick={() => navigate(`/learn/${c.id}`)}
                      className={cn(
                        "w-full text-left px-3 py-2 rounded-lg text-sm transition-colors",
                        c.id === chapter.id
                          ? "bg-primary-50 text-primary-700 font-medium"
                          : "text-gray-600 hover:bg-gray-50"
                      )}
                    >
                      {idx + 1}. {c.title}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-3 space-y-8">
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 sm:p-8">
              <div
                className="prose-medical max-w-none"
                dangerouslySetInnerHTML={{ __html: contentHtml }}
              />
            </div>

            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 sm:p-8">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-900">随堂练习</h2>
                {showResults && (
                  <span className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full bg-accent-50 text-accent-700 text-sm font-medium">
                  <CheckCircle2 className="w-4 h-4" />
                  得分：{correctCount}/{chapter.quizzes.length}
                </span>
                )}
              </div>

              <div className="space-y-6">
                {chapter.quizzes.map((quiz, index) => (
                  <QuestionCard
                    key={index}
                    question={quiz.question}
                    options={quiz.options}
                    selectedAnswer={quizAnswers[index]}
                    onSelect={(answerIndex) =>
                      handleSelectAnswer(index, answerIndex)
                    }
                    showResult={showResults}
                    correctAnswer={quiz.correctAnswer}
                    explanation={quiz.explanation}
                    questionNumber={index + 1}
                    totalQuestions={chapter.quizzes.length}
                  />
                ))}
              </div>

              {!showResults ? (
                <button
                  onClick={handleSubmit}
                  disabled={!allAnswered}
                  className={cn(
                    "mt-8 w-full py-3 rounded-xl font-semibold text-white transition-all duration-200",
                    allAnswered
                      ? "bg-primary-600 hover:bg-primary-700 shadow-md hover:shadow-lg active:scale-[0.99]"
                      : "bg-gray-300 cursor-not-allowed"
                  )}
                >
                  {allAnswered ? "提交答案并完成学习" : "请先完成所有题目"}
                </button>
              ) : (
                <div className="mt-8 flex flex-col sm:flex-row gap-3">
                  <button
                    onClick={() => navigate("/learn")}
                    className="btn-secondary flex-1"
                  >
                    返回章节列表
                  </button>
                  <button
                    onClick={() => {
                      setQuizAnswers(chapter.quizzes.map(() => null));
                      setShowResults(false);
                    }}
                    className="btn-primary flex-1"
                  >
                    重新练习
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
