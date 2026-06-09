import { useState } from "react";
import { Copy, Check, FileText, Lightbulb, ChevronDown, ChevronUp } from "lucide-react";
import { ClinicalExample } from "@/types";
import { cn } from "@/lib/utils";

interface ResultItemProps {
  label: string;
  value: string;
  unit?: string;
  highlight?: boolean;
  colorClass?: string;
}

export function ResultItem({ label, value, unit, highlight, colorClass }: ResultItemProps) {
  return (
    <div className={cn(
      "flex items-center justify-between py-3 px-4 rounded-xl",
      highlight ? colorClass || "bg-primary-50" : "bg-gray-50"
    )}>
      <span className={cn("text-sm font-medium", highlight ? "text-gray-900" : "text-gray-600")}>
        {label}
      </span>
      <div className="flex items-baseline gap-1">
        <span className={cn(
          "text-xl font-bold",
          highlight ? "text-primary-700" : "text-gray-900"
        )}>
          {value}
        </span>
        {unit && (
          <span className={cn("text-sm", highlight ? "text-primary-600" : "text-gray-500")}>
            {unit}
          </span>
        )}
      </div>
    </div>
  );
}

interface CopyableResultProps {
  value: string;
  label: string;
}

export function CopyableResult({ value, label }: CopyableResultProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("复制失败:", err);
    }
  };

  return (
    <div className="flex items-center gap-2 p-3 bg-gradient-to-r from-primary-50 to-accent-50 rounded-xl border border-primary-100">
      <div className="flex-1 min-w-0">
        <div className="text-xs text-gray-500 mb-0.5">{label}</div>
        <div className="text-lg font-bold text-primary-700 truncate">{value}</div>
      </div>
      <button
        onClick={handleCopy}
        className={cn(
          "flex items-center gap-1 px-3 py-2 rounded-lg text-sm font-medium transition-all",
          copied
            ? "bg-green-500 text-white"
            : "bg-white text-primary-600 border border-primary-200 hover:bg-primary-50"
        )}
      >
        {copied ? (
          <>
            <Check className="w-4 h-4" />
            已复制
          </>
        ) : (
          <>
            <Copy className="w-4 h-4" />
            复制
          </>
        )}
      </button>
    </div>
  );
}

interface FormulaDerivationProps {
  formula: string;
  derivation: string[];
  defaultExpanded?: boolean;
}

export function FormulaDerivation({ formula, derivation, defaultExpanded = false }: FormulaDerivationProps) {
  const [expanded, setExpanded] = useState(defaultExpanded);

  return (
    <div className="border border-gray-200 rounded-xl overflow-hidden">
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full flex items-center justify-between px-4 py-3 bg-gray-50 hover:bg-gray-100 transition-colors"
      >
        <div className="flex items-center gap-2">
          <FileText className="w-4 h-4 text-gray-600" />
          <span className="text-sm font-semibold text-gray-800">公式与推导过程</span>
        </div>
        {expanded ? (
          <ChevronUp className="w-5 h-5 text-gray-500" />
        ) : (
          <ChevronDown className="w-5 h-5 text-gray-500" />
        )}
      </button>
      {expanded && (
        <div className="p-4 space-y-3">
          <div className="p-3 bg-blue-50 rounded-lg border border-blue-100">
            <div className="text-xs text-blue-600 font-medium mb-1">计算公式</div>
            <div className="text-sm font-mono text-blue-900 whitespace-pre-wrap">{formula}</div>
          </div>
          <div className="space-y-2">
            <div className="text-xs text-gray-500 font-medium">推导步骤</div>
            <ol className="space-y-1.5">
              {derivation.map((step, index) => (
                <li key={index} className="text-sm text-gray-700 flex gap-2">
                  <span className="flex-shrink-0 w-5 h-5 rounded-full bg-gray-100 text-gray-600 text-xs flex items-center justify-center font-medium">
                    {index + 1}
                  </span>
                  <span className="leading-relaxed">{step}</span>
                </li>
              ))}
            </ol>
          </div>
        </div>
      )}
    </div>
  );
}

interface ClinicalExampleCardProps {
  example: ClinicalExample;
}

export function ClinicalExampleCard({ example }: ClinicalExampleCardProps) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="border border-amber-200 rounded-xl overflow-hidden bg-gradient-to-br from-amber-50/50 to-orange-50/50">
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full flex items-start justify-between px-4 py-3 hover:bg-amber-50 transition-colors text-left"
      >
        <div className="flex items-start gap-2">
          <Lightbulb className="w-5 h-5 text-amber-600 mt-0.5 flex-shrink-0" />
          <div>
            <div className="text-sm font-semibold text-amber-800">
              临床例题：{example.title}
            </div>
            <div className="text-xs text-amber-600 mt-0.5 line-clamp-2">
              {example.scenario}
            </div>
          </div>
        </div>
        {expanded ? (
          <ChevronUp className="w-5 h-5 text-amber-500 flex-shrink-0 mt-1" />
        ) : (
          <ChevronDown className="w-5 h-5 text-amber-500 flex-shrink-0 mt-1" />
        )}
      </button>
      {expanded && (
        <div className="px-4 pb-4 space-y-4 border-t border-amber-100">
          <div className="pt-3">
            <div className="text-xs font-medium text-gray-500 mb-1.5">病例情景</div>
            <p className="text-sm text-gray-700 leading-relaxed">{example.scenario}</p>
          </div>
          <div>
            <div className="text-xs font-medium text-gray-500 mb-1.5">已知条件</div>
            <div className="grid grid-cols-2 gap-2">
              {Object.entries(example.given).map(([key, value]) => (
                <div key={key} className="text-sm text-gray-700 bg-white px-3 py-2 rounded-lg border border-gray-100">
                  <span className="text-gray-500">{key}：</span>
                  <span className="font-medium">{value}</span>
                </div>
              ))}
            </div>
          </div>
          <div>
            <div className="text-xs font-medium text-gray-500 mb-1.5">问题</div>
            <p className="text-sm text-gray-800 font-medium">{example.question}</p>
          </div>
          <div>
            <div className="text-xs font-medium text-gray-500 mb-1.5">解答过程</div>
            <ol className="space-y-1.5 bg-white p-3 rounded-lg border border-gray-100">
              {example.solution.map((step, index) => (
                <li key={index} className="text-sm text-gray-700 flex gap-2">
                  <span className="flex-shrink-0 text-primary-600 font-medium">{index + 1}.</span>
                  <span className="leading-relaxed">{step}</span>
                </li>
              ))}
            </ol>
          </div>
          <div className="p-3 bg-green-50 rounded-lg border border-green-200">
            <div className="text-xs font-medium text-green-700 mb-1">参考答案</div>
            <p className="text-sm text-green-800 font-medium">{example.answer}</p>
          </div>
          <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
            <div className="flex items-center gap-1.5 text-xs font-medium text-blue-700 mb-1">
              <Lightbulb className="w-3.5 h-3.5" />
              学习要点
            </div>
            <p className="text-sm text-blue-800 leading-relaxed">{example.learningPoint}</p>
          </div>
        </div>
      )}
    </div>
  );
}
