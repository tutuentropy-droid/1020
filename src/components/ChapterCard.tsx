import { BookOpen, ChevronRight, Clock, CheckCircle2, PlayCircle } from "lucide-react";
import { Chapter, LearningStatus } from "@/types";
import { cn } from "@/lib/utils";

interface ChapterCardProps {
  chapter: Chapter;
  onClick?: () => void;
  status?: LearningStatus;
  progress?: number;
}

const statusConfig: Record<LearningStatus, { label: string; className: string; icon: typeof Clock }> = {
  "not-started": {
    label: "未开始",
    className: "bg-gray-100 text-gray-600",
    icon: Clock,
  },
  "in-progress": {
    label: "学习中",
    className: "bg-primary-50 text-primary-700",
    icon: PlayCircle,
  },
  completed: {
    label: "已完成",
    className: "bg-accent-50 text-accent-700",
    icon: CheckCircle2,
  },
};

export default function ChapterCard({ chapter, onClick, status = "not-started", progress = 0 }: ChapterCardProps) {
  const config = statusConfig[status];
  const StatusIcon = config.icon;

  return (
    <div
      onClick={onClick}
      className={cn(
        "group relative bg-white rounded-2xl border border-gray-100 overflow-hidden cursor-pointer",
        "transition-all duration-300 ease-out",
        "hover:shadow-xl hover:-translate-y-1 hover:border-primary-200",
        "focus:outline-none focus:ring-2 focus:ring-primary-400 focus:ring-offset-2"
      )}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onClick?.();
        }
      }}
    >
      <div className="relative aspect-video overflow-hidden bg-gray-100">
        <img
          src={chapter.imageUrl}
          alt={chapter.title}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/10 to-transparent" />

        <div className="absolute top-3 left-3">
          <span
            className={cn(
              "inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium",
              config.className
            )}
          >
            <StatusIcon className="w-3 h-3" />
            {config.label}
          </span>
        </div>

        <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-x-2 group-hover:translate-x-0">
          <div className="w-9 h-9 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center shadow-lg">
            <ChevronRight className="w-5 h-5 text-primary-600" />
          </div>
        </div>

        <div className="absolute bottom-3 left-3 right-3">
          <h3 className="text-lg font-semibold text-white drop-shadow-md line-clamp-1">
            {chapter.title}
          </h3>
        </div>
      </div>

      <div className="p-4">
        <div className="flex items-center gap-2 mb-3">
          <div className="w-8 h-8 rounded-lg bg-primary-50 flex items-center justify-center">
            <BookOpen className="w-4 h-4 text-primary-600" />
          </div>
          <div>
            <p className="text-xs text-gray-400">第 {chapter.order} 章</p>
            <p className="text-sm font-medium text-gray-700">{chapter.category}</p>
          </div>
        </div>

        <p className="text-sm text-gray-500 line-clamp-2 leading-relaxed mb-4">
          {chapter.description}
        </p>

        {status === "in-progress" && progress > 0 && (
          <div className="space-y-1.5">
            <div className="flex justify-between text-xs">
              <span className="text-gray-500">学习进度</span>
              <span className="font-medium text-primary-600">{Math.round(progress)}%</span>
            </div>
            <div className="w-full h-1.5 bg-gray-100 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-primary-500 to-accent-500 rounded-full transition-all duration-500"
                style={{ width: `${Math.min(progress, 100)}%` }}
              />
            </div>
          </div>
        )}

        {status === "completed" && (
          <div className="flex items-center gap-2 text-accent-600">
            <CheckCircle2 className="w-4 h-4" />
            <span className="text-sm font-medium">学习完成，继续加油！</span>
          </div>
        )}
      </div>
    </div>
  );
}
