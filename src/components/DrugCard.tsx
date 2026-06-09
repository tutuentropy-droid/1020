import { Pill, ChevronRight, Stethoscope } from "lucide-react";
import { Drug } from "@/types";
import { cn } from "@/lib/utils";

interface DrugCardProps {
  drug: Drug;
  onClick?: () => void;
}

const categoryColors: Record<string, string> = {
  抗生素: "bg-blue-50 text-blue-700 border-blue-200",
  心血管药物: "bg-rose-50 text-rose-700 border-rose-200",
  消化系统药物: "bg-amber-50 text-amber-700 border-amber-200",
  呼吸系统药物: "bg-cyan-50 text-cyan-700 border-cyan-200",
  神经系统药物: "bg-violet-50 text-violet-700 border-violet-200",
  内分泌系统药物: "bg-emerald-50 text-emerald-700 border-emerald-200",
};

export default function DrugCard({ drug, onClick }: DrugCardProps) {
  const colorClass = categoryColors[drug.category] || "bg-gray-50 text-gray-700 border-gray-200";

  return (
    <div
      onClick={onClick}
      className={cn(
        "group relative bg-white rounded-2xl border border-gray-100 p-5 cursor-pointer",
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
      <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
        <div className="w-8 h-8 rounded-full bg-primary-500 flex items-center justify-center text-white shadow-md">
          <ChevronRight className="w-4 h-4" />
        </div>
      </div>

      <div className="flex items-start gap-4">
        <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center shadow-md group-hover:scale-110 transition-transform duration-300">
          <Pill className="w-6 h-6 text-white" />
        </div>

        <div className="flex-1 min-w-0">
          <h3 className="text-lg font-semibold text-gray-900 group-hover:text-primary-600 transition-colors duration-200 truncate">
            {drug.name}
          </h3>

          <div className="mt-2 flex flex-wrap gap-2">
            <span
              className={cn(
                "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border",
                colorClass
              )}
            >
              {drug.category}
            </span>
          </div>

          <div className="mt-3 flex items-start gap-2">
            <Stethoscope className="w-4 h-4 text-gray-400 mt-0.5 flex-shrink-0" />
            <p className="text-sm text-gray-500 line-clamp-2 leading-relaxed">
              {drug.indications.slice(0, 2).join("；")}
              {drug.indications.length > 2 && "等"}
            </p>
          </div>
        </div>
      </div>

      <div className="mt-4 pt-4 border-t border-gray-50">
        <p className="text-xs text-gray-400 line-clamp-2">
          {drug.description}
        </p>
      </div>
    </div>
  );
}
