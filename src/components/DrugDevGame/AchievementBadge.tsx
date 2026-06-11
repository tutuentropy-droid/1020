import { GameAchievement } from "@/types";
import {
  Sprout,
  Award,
  Trophy,
  Crown,
  Coins,
  Zap,
  Star,
  TrendingUp,
  BookOpen,
  GraduationCap,
  RefreshCw,
  Target,
  LucideIcon,
} from "lucide-react";

const iconMap: Record<string, LucideIcon> = {
  Sprout,
  Award,
  Trophy,
  Crown,
  Coins,
  Zap,
  Star,
  TrendingUp,
  BookOpen,
  GraduationCap,
  RefreshCw,
  Target,
};

const rarityColors: Record<string, { bg: string; border: string; text: string; glow: string }> = {
  common: {
    bg: "bg-gray-100",
    border: "border-gray-300",
    text: "text-gray-600",
    glow: "",
  },
  rare: {
    bg: "bg-blue-100",
    border: "border-blue-400",
    text: "text-blue-600",
    glow: "shadow-blue-200",
  },
  epic: {
    bg: "bg-purple-100",
    border: "border-purple-400",
    text: "text-purple-600",
    glow: "shadow-purple-300",
  },
};

const rarityLabels: Record<string, string> = {
  common: "普通",
  rare: "稀有",
  epic: "史诗",
};

interface AchievementBadgeProps {
  achievement: GameAchievement;
  size?: "sm" | "md" | "lg";
  showDetails?: boolean;
  onClick?: () => void;
}

export default function AchievementBadge({
  achievement,
  size = "md",
  showDetails = false,
  onClick,
}: AchievementBadgeProps) {
  const Icon = iconMap[achievement.icon] || Award;
  const colors = rarityColors[achievement.rarity];
  const sizeClasses = {
    sm: "w-10 h-10",
    md: "w-14 h-14",
    lg: "w-20 h-20",
  };
  const iconSizeClasses = {
    sm: "w-5 h-5",
    md: "w-7 h-7",
    lg: "w-10 h-10",
  };

  return (
    <div
      className={`flex flex-col items-center ${onClick ? "cursor-pointer hover:scale-105 transition-transform" : ""}`}
      onClick={onClick}
    >
      <div
        className={`${sizeClasses[size]} rounded-full ${colors.bg} ${
          achievement.unlocked ? colors.border : "border-gray-200"
        } border-2 flex items-center justify-center ${
          achievement.unlocked ? `shadow-lg ${colors.glow}` : "opacity-40"
        } transition-all duration-300`}
      >
        <Icon
          className={`${iconSizeClasses[size]} ${
            achievement.unlocked ? colors.text : "text-gray-400"
          }`}
        />
      </div>
      {showDetails && (
        <div className="mt-2 text-center max-w-24">
          <p
            className={`text-sm font-medium ${
              achievement.unlocked ? "text-gray-900" : "text-gray-400"
            }`}
          >
            {achievement.name}
          </p>
          <span
            className={`text-xs ${
              achievement.unlocked ? colors.text : "text-gray-300"
            }`}
          >
            {rarityLabels[achievement.rarity]}
          </span>
        </div>
      )}
    </div>
  );
}
