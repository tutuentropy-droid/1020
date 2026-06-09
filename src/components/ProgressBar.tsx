import { cn } from "@/lib/utils";

interface ProgressBarProps {
  progress: number;
  label?: string;
  size?: "sm" | "md" | "lg";
  color?: "primary" | "accent" | "warning";
  showPercentage?: boolean;
  className?: string;
}

const sizeConfig = {
  sm: {
    height: "h-1",
    text: "text-xs",
  },
  md: {
    height: "h-2",
    text: "text-sm",
  },
  lg: {
    height: "h-3",
    text: "text-base",
  },
};

const colorConfig = {
  primary: "from-primary-500 to-primary-400",
  accent: "from-accent-500 to-accent-400",
  warning: "from-warning-500 to-warning-400",
};

export default function ProgressBar({
  progress,
  label,
  size = "md",
  color = "primary",
  showPercentage = true,
  className,
}: ProgressBarProps) {
  const clampedProgress = Math.max(0, Math.min(100, progress));
  const sizeStyle = sizeConfig[size];
  const colorStyle = colorConfig[color];

  return (
    <div className={cn("w-full", className)}>
      {(label || showPercentage) && (
        <div className="flex items-center justify-between mb-1.5">
          {label && (
            <span className={cn("font-medium text-gray-700", sizeStyle.text)}>
              {label}
            </span>
          )}
          {showPercentage && (
            <span className={cn("font-semibold text-gray-900 tabular-nums", sizeStyle.text)}>
              {Math.round(clampedProgress)}%
            </span>
          )}
        </div>
      )}
      <div
        className={cn(
          "w-full bg-gray-100 rounded-full overflow-hidden",
          sizeStyle.height
        )}
        role="progressbar"
        aria-valuenow={Math.round(clampedProgress)}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label={label || "进度"}
      >
        <div
          className={cn(
            "h-full rounded-full bg-gradient-to-r transition-all duration-500 ease-out",
            colorStyle
          )}
          style={{ width: `${clampedProgress}%` }}
        />
      </div>
    </div>
  );
}
