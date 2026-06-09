import { BookOpen, GraduationCap, Trophy } from "lucide-react";
import { useNavigate } from "react-router-dom";
import ChapterCard from "@/components/ChapterCard";
import { chapters } from "@/data/chapters";
import { useStore } from "@/store/useStore";

export default function LearnList() {
  const navigate = useNavigate();
  const { learningProgress } = useStore();

  const completedCount = learningProgress.filter((p) => p.status === "completed").length;
  const inProgressCount = learningProgress.filter((p) => p.status === "in-progress").length;

  const getProgress = (chapterId: string) => {
    return learningProgress.find((p) => p.chapterId === chapterId);
  };

  return (
    <div className="min-h-screen py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-primary-100 mb-4">
            <BookOpen className="w-8 h-8 text-primary-600" />
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-3">
            药学知识学习
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            系统学习各类药物知识，掌握临床用药要点，通过随堂练习巩固记忆
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-10">
          <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-primary-50 flex items-center justify-center">
              <GraduationCap className="w-6 h-6 text-primary-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">总章节数</p>
              <p className="text-2xl font-bold text-gray-900">{chapters.length}</p>
            </div>
          </div>
          <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-warning-50 flex items-center justify-center">
              <BookOpen className="w-6 h-6 text-warning-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">学习中</p>
              <p className="text-2xl font-bold text-gray-900">{inProgressCount}</p>
            </div>
          </div>
          <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-accent-50 flex items-center justify-center">
              <Trophy className="w-6 h-6 text-accent-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">已完成</p>
              <p className="text-2xl font-bold text-gray-900">{completedCount}</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {chapters.map((chapter) => {
            const progress = getProgress(chapter.id);
            return (
              <ChapterCard
                key={chapter.id}
                chapter={chapter}
                status={progress?.status || "not-started"}
                progress={progress?.status === "in-progress" ? 50 : progress?.status === "completed" ? 100 : 0}
                onClick={() => navigate(`/learn/${chapter.id}`)}
              />
            );
          })}
        </div>
      </div>
    </div>
  );
}
