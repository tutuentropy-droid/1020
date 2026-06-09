import { CheckCircle2, XCircle, Lightbulb, Circle } from "lucide-react";
import { cn } from "@/lib/utils";

interface QuestionCardProps {
  question: string;
  options: string[];
  selectedAnswer?: number | null;
  onSelect?: (index: number) => void;
  showResult?: boolean;
  correctAnswer?: number;
  explanation?: string;
  questionNumber?: number;
  totalQuestions?: number;
  disabled?: boolean;
}

const optionLabels = ["A", "B", "C", "D", "E", "F"];

export default function QuestionCard({
  question,
  options,
  selectedAnswer,
  onSelect,
  showResult = false,
  correctAnswer,
  explanation,
  questionNumber,
  totalQuestions,
  disabled = false,
}: QuestionCardProps) {
  const getOptionStyle = (index: number) => {
    if (!showResult) {
      if (selectedAnswer === index) {
        return "border-primary-400 bg-primary-50 ring-2 ring-primary-200";
      }
      return "border-gray-200 hover:border-primary-300 hover:bg-primary-50/50";
    }

    if (index === correctAnswer) {
      return "border-accent-400 bg-accent-50 ring-2 ring-accent-200";
    }

    if (selectedAnswer === index && index !== correctAnswer) {
      return "border-rose-400 bg-rose-50 ring-2 ring-rose-200";
    }

    return "border-gray-200 bg-gray-50 opacity-60";
  };

  const getOptionIcon = (index: number) => {
    if (!showResult) {
      if (selectedAnswer === index) {
        return (
          <div className="w-6 h-6 rounded-full bg-primary-500 flex items-center justify-center flex-shrink-0">
            <span className="text-xs font-bold text-white">{optionLabels[index]}</span>
          </div>
        );
      }
      return (
        <div className="w-6 h-6 rounded-full border-2 border-gray-300 flex items-center justify-center flex-shrink-0 group-hover:border-primary-400 transition-colors">
          <span className="text-xs font-semibold text-gray-500 group-hover:text-primary-500 transition-colors">
            {optionLabels[index]}
          </span>
        </div>
      );
    }

    if (index === correctAnswer) {
      return (
        <div className="w-6 h-6 rounded-full bg-accent-500 flex items-center justify-center flex-shrink-0">
          <CheckCircle2 className="w-4 h-4 text-white" />
        </div>
      );
    }

    if (selectedAnswer === index && index !== correctAnswer) {
      return (
        <div className="w-6 h-6 rounded-full bg-rose-500 flex items-center justify-center flex-shrink-0">
          <XCircle className="w-4 h-4 text-white" />
        </div>
      );
    }

    return (
      <div className="w-6 h-6 rounded-full border-2 border-gray-300 flex items-center justify-center flex-shrink-0">
        <Circle className="w-3 h-3 text-gray-300" />
      </div>
    );
  };

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
      <div className="p-6 border-b border-gray-50">
        <div className="flex items-start justify-between gap-4 mb-4">
          {questionNumber !== undefined && (
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center px-3 py-1 rounded-full bg-primary-50 text-primary-700 text-sm font-medium">
                第 {questionNumber} 题
                {totalQuestions !== undefined && ` / ${totalQuestions}`}
              </span>
            </div>
          )}
        </div>

        <h3 className="text-lg font-semibold text-gray-900 leading-relaxed">
          {question}
        </h3>
      </div>

      <div className="p-6 space-y-3">
        {options.map((option, index) => {
          const isSelected = selectedAnswer === index;
          const isCorrect = showResult && index === correctAnswer;
          const isWrong = showResult && isSelected && index !== correctAnswer;

          return (
            <button
              key={index}
              onClick={() => !disabled && !showResult && onSelect?.(index)}
              disabled={disabled || showResult}
              className={cn(
                "group w-full flex items-start gap-3 p-4 rounded-xl border-2 text-left",
                "transition-all duration-200 ease-out",
                getOptionStyle(index),
                !disabled && !showResult && "cursor-pointer active:scale-[0.99]",
                (disabled || showResult) && "cursor-not-allowed"
              )}
            >
              <div className="mt-0.5">{getOptionIcon(index)}</div>
              <div className="flex-1 min-w-0">
                <p
                  className={cn(
                    "text-base leading-relaxed",
                    isCorrect && "text-accent-800 font-medium",
                    isWrong && "text-rose-800 font-medium",
                    !showResult && isSelected && "text-primary-800 font-medium",
                    !showResult && !isSelected && "text-gray-700"
                  )}
                >
                  {option}
                </p>
              </div>
              {isCorrect && (
                <span className="text-xs font-medium text-accent-600 bg-accent-100 px-2 py-0.5 rounded">
                  正确答案
                </span>
              )}
              {isWrong && (
                <span className="text-xs font-medium text-rose-600 bg-rose-100 px-2 py-0.5 rounded">
                  回答错误
                </span>
              )}
            </button>
          );
        })}
      </div>

      {showResult && explanation && (
        <div className="px-6 pb-6">
          <div className="rounded-xl bg-warning-50 border border-warning-200 p-4">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-lg bg-warning-100 flex items-center justify-center flex-shrink-0">
                <Lightbulb className="w-4 h-4 text-warning-600" />
              </div>
              <div>
                <h4 className="text-sm font-semibold text-warning-800 mb-1">
                  答案解析
                </h4>
                <p className="text-sm text-warning-700 leading-relaxed">
                  {explanation}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
