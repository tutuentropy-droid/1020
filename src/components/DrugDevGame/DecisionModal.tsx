import { X, Coins, Clock, TrendingUp, TrendingDown, Info } from "lucide-react";
import { GameDecision, GameDecisionOption } from "@/types";

interface DecisionModalProps {
  decision: GameDecision;
  onSelect: (option: GameDecisionOption) => void;
  onClose: () => void;
}

export default function DecisionModal({ decision, onSelect, onClose }: DecisionModalProps) {
  const formatModifier = (value: number, type: "cost" | "time" | "success") => {
    const isPositive = value > 0;
    const prefix = isPositive ? "+" : "";
    
    if (type === "cost") {
      return `${prefix}${value} 万`;
    } else if (type === "time") {
      return `${prefix}${value} 月`;
    } else {
      return `${prefix}${value}%`;
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-2xl mx-4 bg-white rounded-2xl shadow-2xl overflow-hidden animate-scale-in max-h-[90vh] overflow-y-auto">
        <div className="bg-gradient-to-r from-primary-600 to-primary-500 p-6 text-white sticky top-0 z-10">
          <div className="flex items-center justify-between">
            <div className="max-w-xl">
              <p className="text-sm opacity-80 mb-1">关键决策点</p>
              <h3 className="text-2xl font-bold">{decision.title}</h3>
            </div>
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center hover:bg-white/30 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
          <p className="mt-3 text-white/90">{decision.description}</p>
        </div>

        <div className="p-6 space-y-4">
          {decision.options.map((option, index) => (
            <button
              key={option.id}
              onClick={() => onSelect(option)}
              className="w-full text-left p-5 rounded-xl border-2 border-gray-100 hover:border-primary-300 hover:bg-primary-50 transition-all duration-300 group"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className="flex items-start justify-between mb-3">
                <h4 className="text-lg font-semibold text-gray-900 group-hover:text-primary-600 transition-colors">
                  {String.fromCharCode(65 + index)}. {option.label}
                </h4>
                <div className="w-6 h-6 rounded-full bg-gray-100 group-hover:bg-primary-100 flex items-center justify-center transition-colors">
                  <Info className="w-3 h-3 text-gray-400 group-hover:text-primary-500" />
                </div>
              </div>

              <p className="text-gray-600 mb-4 text-sm leading-relaxed">
                {option.description}
              </p>

              <div className="flex flex-wrap gap-3">
                <div className="flex items-center gap-1.5 px-3 py-1.5 bg-amber-50 rounded-lg">
                  <Coins className="w-4 h-4 text-amber-500" />
                  <span className={`text-sm font-medium ${
                    option.costModifier > 0 ? "text-red-500" : "text-green-500"
                  }`}>
                    {formatModifier(option.costModifier, "cost")}
                  </span>
                </div>
                <div className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-50 rounded-lg">
                  <Clock className="w-4 h-4 text-blue-500" />
                  <span className={`text-sm font-medium ${
                    option.timeModifier > 0 ? "text-red-500" : "text-green-500"
                  }`}>
                    {formatModifier(option.timeModifier, "time")}
                  </span>
                </div>
                <div className="flex items-center gap-1.5 px-3 py-1.5 bg-green-50 rounded-lg">
                  {option.successRateModifier >= 0 ? (
                    <TrendingUp className="w-4 h-4 text-green-500" />
                  ) : (
                    <TrendingDown className="w-4 h-4 text-red-500" />
                  )}
                  <span className={`text-sm font-medium ${
                    option.successRateModifier >= 0 ? "text-green-600" : "text-red-500"
                  }`}>
                    {formatModifier(option.successRateModifier, "success")}
                  </span>
                </div>
              </div>
            </button>
          ))}
        </div>

        <div className="p-4 bg-gray-50 border-t border-gray-100">
          <button
            onClick={onClose}
            className="w-full py-3 bg-gray-100 text-gray-600 font-medium rounded-xl hover:bg-gray-200 transition-colors"
          >
            稍后再选
          </button>
        </div>
      </div>
    </div>
  );
}
