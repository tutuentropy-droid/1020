import { Trophy, XCircle, Coins, Clock, Target, Award, RotateCcw, Home } from "lucide-react";
import { GameResult, GameAchievement, GameHistory } from "@/types";
import AchievementBadge from "./AchievementBadge";

interface GameResultModalProps {
  result: GameResult;
  drugName: string;
  drugCategory: string;
  finalFunds: number;
  totalTime: number;
  finalSuccessRate: number;
  newAchievements: GameAchievement[];
  history?: GameHistory;
  onPlayAgain: () => void;
  onBackToHome: () => void;
}

export default function GameResultModal({
  result,
  drugName,
  drugCategory,
  finalFunds,
  totalTime,
  finalSuccessRate,
  newAchievements,
  onPlayAgain,
  onBackToHome,
}: GameResultModalProps) {
  const isSuccess = result === "success";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm animate-fade-in p-4">
      <div className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl overflow-hidden animate-scale-in max-h-[90vh] overflow-y-auto">
        <div
          className={`p-8 text-white ${
            isSuccess
              ? "bg-gradient-to-br from-emerald-500 via-green-500 to-teal-500"
              : "bg-gradient-to-br from-orange-500 via-red-500 to-rose-500"
          }`}
        >
          <div className="flex flex-col items-center text-center">
            <div
              className={`w-24 h-24 rounded-full flex items-center justify-center mb-6 ${
                isSuccess ? "bg-white/20" : "bg-white/20"
              } animate-bounce-slow`}
            >
              {isSuccess ? (
                <Trophy className="w-12 h-12 text-white" />
              ) : (
                <XCircle className="w-12 h-12 text-white" />
              )}
            </div>
            <h2 className="text-4xl font-bold mb-2">
              {isSuccess ? "研发成功！" : "研发终止"}
            </h2>
            <p className="text-xl opacity-90 mb-2">
              {drugName}
            </p>
            <p className="text-sm opacity-80">
              {drugCategory}
            </p>
          </div>
        </div>

        <div className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <Award className="w-5 h-5 text-primary-500" />
            研发统计
          </h3>
          <div className="grid grid-cols-3 gap-4 mb-6">
            <div className="bg-amber-50 rounded-2xl p-4 text-center">
              <div className="w-10 h-10 bg-amber-100 rounded-xl flex items-center justify-center mx-auto mb-2">
                <Coins className="w-5 h-5 text-amber-600" />
              </div>
              <p className="text-2xl font-bold text-gray-900">{finalFunds}</p>
              <p className="text-xs text-gray-500">剩余资金（万）</p>
            </div>
            <div className="bg-blue-50 rounded-2xl p-4 text-center">
              <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center mx-auto mb-2">
                <Clock className="w-5 h-5 text-blue-600" />
              </div>
              <p className="text-2xl font-bold text-gray-900">{totalTime}</p>
              <p className="text-xs text-gray-500">研发周期（月）</p>
            </div>
            <div className="bg-green-50 rounded-2xl p-4 text-center">
              <div className="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center mx-auto mb-2">
                <Target className="w-5 h-5 text-green-600" />
              </div>
              <p className="text-2xl font-bold text-gray-900">{finalSuccessRate}%</p>
              <p className="text-xs text-gray-500">最终成功率</p>
            </div>
          </div>

          {newAchievements.length > 0 && (
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <Trophy className="w-5 h-5 text-amber-500" />
                解锁成就
              </h3>
              <div className="flex flex-wrap gap-6 justify-center p-4 bg-gradient-to-br from-amber-50 to-orange-50 rounded-2xl">
                {newAchievements.map((achievement) => (
                  <AchievementBadge
                    key={achievement.id}
                    achievement={achievement}
                    size="lg"
                    showDetails
                  />
                ))}
              </div>
            </div>
          )}

          <div className="flex gap-3">
            <button
              onClick={onPlayAgain}
              className="flex-1 py-4 bg-gradient-to-r from-primary-500 to-primary-600 text-white font-semibold rounded-xl hover:shadow-lg transition-all duration-300 flex items-center justify-center gap-2"
            >
              <RotateCcw className="w-5 h-5" />
              再来一局
            </button>
            <button
              onClick={onBackToHome}
              className="flex-1 py-4 bg-gray-100 text-gray-700 font-semibold rounded-xl hover:bg-gray-200 transition-all duration-300 flex items-center justify-center gap-2"
            >
              <Home className="w-5 h-5" />
              返回首页
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
