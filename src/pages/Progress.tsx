import { TrendingUp, GraduationCap, Trophy, Target, CheckCircle2, Clock, PlayCircle, Calendar, ChevronRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useStore } from "@/store/useStore";
import { chapters } from "@/data/chapters";
import { formatDate } from "@/utils/helpers";
import ProgressBar from "@/components/ProgressBar";
import { cn } from "@/lib/utils";

const statusLabel: Record<string, { label: string; className: string; icon: typeof Clock }> = {
  "not-started": { label: "未开始", className: "bg-gray-100 text-gray-600", icon: Clock },
  "in-progress": { label: "学习中", className: "bg-primary-50 text-primary-700", icon: PlayCircle },
  completed: { label: "已完成", className: "bg-accent-50 text-accent-700", icon: CheckCircle2 },
};

export default function Progress() {
  const navigate = useNavigate();
  const { learningProgress, quizHistory } = useStore();

  const totalChapters = chapters.length;
  const completedChapters = learningProgress.filter((p) => p.status === "completed").length;
  const inProgressChapters = learningProgress.filter((p) => p.status === "in-progress").length;
  const notStartedChapters = totalChapters - completedChapters - inProgressChapters;

  const totalQuizzes = quizHistory.length;
  const avgScore =
    totalQuizzes > 0
      ? Math.round(
          quizHistory.reduce((sum, q) => sum + (q.score / q.totalQuestions) * 100, 0) / totalQuizzes
        )
      : 0;
  const bestScore =
    totalQuizzes > 0
      ? Math.max(...quizHistory.map((q) => Math.round((q.score / q.totalQuestions) * 100)))
      : 0;

  const overallProgress = totalChapters > 0 ? (completedChapters / totalChapters) * 100 : 0;

  const getProgress = (chapterId: string) => {
    return learningProgress.find((p) => p.chapterId === chapterId);
  };

  const stats = [
    {
      label: "章节完成率",
      value: `${completedChapters}/${totalChapters}`,
      progress: overallProgress,
      icon: GraduationCap,
      color: "primary",
      bg: "bg-primary-50",
      iconColor: "text-primary-600",
    },
    {
      label: "测验次数",
      value: totalQuizzes,
      icon: Target,
      color: "accent",
      bg: "bg-accent-50",
      iconColor: "text-accent-600",
    },
    {
      label: "平均得分",
      value: `${avgScore}%`,
      icon: Trophy,
      color: "warning",
      bg: "bg-warning-50",
      iconColor: "text-warning-600",
    },
    {
      label: "最高分",
      value: `${bestScore}%`,
      icon: TrendingUp,
      color: "accent",
      bg: "bg-accent-50",
      iconColor: "text-accent-600",
    },
  ];

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="flex items-center gap-3">
        <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center shadow-lg">
          <TrendingUp className="w-6 h-6 text-white" />
        </div>
        <div>
          <h1 className="text-3xl font-bold text-gray-900 font-serif">我的学习进度</h1>
          <p className="text-sm text-gray-500 mt-1">追踪你的学习旅程和成长记录</p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div
              key={stat.label}
              className="bg-white rounded-2xl border border-gray-100 p-5 hover:shadow-md transition-all duration-300 animate-slide-up"
              style={{ animationDelay: `${index * 80}ms` }}
            >
              <div className="flex items-center justify-between mb-4">
                <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center", stat.bg)}>
                  <Icon className={cn("w-5 h-5", stat.iconColor)} />
                </div>
              </div>
              <div className="text-2xl font-bold text-gray-900 mb-1">{stat.value}</div>
              <div className="text-sm text-gray-500 mb-3">{stat.label}</div>
              {stat.progress !== undefined && (
                <ProgressBar progress={stat.progress} size="sm" color={stat.color as "primary" | "accent" | "warning"} />
              )}
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white rounded-2xl border border-gray-100 p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-primary-50 flex items-center justify-center">
                <GraduationCap className="w-5 h-5 text-primary-600" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-900">章节学习进度</h2>
                <p className="text-sm text-gray-500">已完成 {completedChapters} 章，进行中 {inProgressChapters} 章，未开始 {notStartedChapters} 章</p>
              </div>
            </div>
          </div>

          <div className="space-y-3">
            {chapters.map((chapter, index) => {
              const progress = getProgress(chapter.id);
              const status = progress?.status || "not-started";
              const config = statusLabel[status];
              const StatusIcon = config.icon;
              const score = progress?.score;

              return (
                <div
                  key={chapter.id}
                  onClick={() => navigate(`/learn/${chapter.id}`)}
                  className="group flex items-center gap-4 p-4 rounded-xl border border-gray-100 hover:bg-gray-50 hover:border-primary-200 cursor-pointer transition-all duration-200 animate-slide-up"
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center flex-shrink-0 shadow-sm">
                    <span className="text-white font-semibold text-sm">{chapter.order}</span>
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1.5">
                      <h3 className="font-semibold text-gray-900 group-hover:text-primary-600 transition-colors truncate">
                        {chapter.title}
                      </h3>
                      <span className={cn("inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium", config.className)}>
                        <StatusIcon className="w-3 h-3" />
                        {config.label}
                      </span>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="flex-1 max-w-xs">
                        <ProgressBar
                          progress={status === "completed" ? 100 : status === "in-progress" ? 50 : 0}
                          size="sm"
                          showPercentage={false}
                          color={status === "completed" ? "accent" : status === "in-progress" ? "primary" : "warning"}
                        />
                      </div>
                      {status === "completed" && score !== undefined && (
                        <span className="text-xs font-medium text-accent-600">得分 {score}%</span>
                      )}
                      {progress?.completedDate && (
                        <span className="text-xs text-gray-400 flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          {formatDate(progress.completedDate).split(" ")[0]}
                        </span>
                      )}
                    </div>
                  </div>

                  <ChevronRight className="w-5 h-5 text-gray-300 group-hover:text-primary-500 group-hover:translate-x-0.5 transition-all" />
                </div>
              );
            })}
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-gray-100 p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-xl bg-accent-50 flex items-center justify-center">
              <Trophy className="w-5 h-5 text-accent-600" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">最近测验</h2>
              <p className="text-sm text-gray-500">共完成 {totalQuizzes} 次测验</p>
            </div>
          </div>

          {quizHistory.length === 0 ? (
            <div className="text-center py-12">
              <Target className="w-12 h-12 text-gray-300 mx-auto mb-3" />
              <p className="text-gray-500 text-sm">暂无测验记录</p>
              <button
                onClick={() => navigate("/quiz")}
                className="mt-4 text-primary-600 hover:text-primary-700 font-medium text-sm"
              >
                去做测验 →
              </button>
            </div>
          ) : (
            <div className="space-y-3">
              {quizHistory.slice(0, 8).map((record, index) => {
                const percentage = Math.round((record.score / record.totalQuestions) * 100);
                const grade =
                  percentage >= 90
                    ? { label: "优秀", color: "text-accent-600", bg: "bg-accent-50" }
                    : percentage >= 70
                    ? { label: "良好", color: "text-primary-600", bg: "bg-primary-50" }
                    : percentage >= 60
                    ? { label: "及格", color: "text-warning-600", bg: "bg-warning-50" }
                    : { label: "加油", color: "text-rose-600", bg: "bg-rose-50" };

                return (
                  <div
                    key={record.id}
                    className="p-4 rounded-xl border border-gray-100 hover:bg-gray-50 transition-colors animate-slide-up"
                    style={{ animationDelay: `${index * 50}ms` }}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs text-gray-500">{formatDate(record.date)}</span>
                      <span className={cn("inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium", grade.bg, grade.color)}>
                        {grade.label}
                      </span>
                    </div>
                    <div className="flex items-end justify-between">
                      <div>
                        <span className="text-2xl font-bold text-gray-900">{record.score}</span>
                        <span className="text-sm text-gray-400">/{record.totalQuestions}</span>
                      </div>
                      <ProgressBar
                        progress={percentage}
                        size="sm"
                        showPercentage={false}
                        color={percentage >= 60 ? "accent" : "warning"}
                        className="w-24"
                      />
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
