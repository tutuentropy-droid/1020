import {
  Target,
  FlaskConical,
  Stethoscope,
  FileCheck,
  LucideIcon,
  Check,
} from "lucide-react";
import { GameStage } from "@/types";

const iconMap: Record<string, LucideIcon> = {
  Target,
  FlaskConical,
  Stethoscope,
  FileCheck,
};

interface GameStageCardProps {
  stage: GameStage;
  isActive: boolean;
  isCompleted: boolean;
  isLocked: boolean;
  onClick?: () => void;
}

export default function GameStageCard({
  stage,
  isActive,
  isCompleted,
  isLocked,
  onClick,
}: GameStageCardProps) {
  const Icon = iconMap[stage.icon] || Target;

  return (
    <button
      onClick={onClick}
      disabled={isLocked && !isActive}
      className={`relative flex-1 p-4 rounded-2xl border-2 transition-all duration-300 ${
        isActive
          ? `border-transparent bg-gradient-to-br ${stage.color} text-white shadow-lg scale-105`
          : isCompleted
          ? "border-green-400 bg-green-50"
          : "border-gray-200 bg-gray-50"
      } ${isLocked && !isActive ? "opacity-50 cursor-not-allowed" : "cursor-pointer hover:shadow-md"}`}
    >
      {isCompleted && (
        <div className="absolute -top-2 -right-2 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center border-2 border-white shadow">
          <Check className="w-3 h-3 text-white" />
        </div>
      )}
      <div className="flex flex-col items-center gap-2">
        <div
          className={`w-12 h-12 rounded-xl flex items-center justify-center ${
            isActive
              ? "bg-white/20"
              : isCompleted
              ? "bg-green-100"
              : "bg-gray-100"
          }`}
        >
          <Icon
            className={`w-6 h-6 ${
              isActive
                ? "text-white"
                : isCompleted
                ? "text-green-600"
                : "text-gray-400"
            }`}
          />
        </div>
        <span
          className={`text-sm font-medium text-center ${
            isActive
              ? "text-white"
              : isCompleted
              ? "text-green-700"
              : "text-gray-500"
          }`}
        >
          {stage.name}
        </span>
      </div>
    </button>
  );
}
