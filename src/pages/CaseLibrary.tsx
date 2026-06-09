import { useState, useMemo } from "react";
import {
  BookOpen,
  AlertTriangle,
  Pill,
  User,
  Activity,
  HeartPulse,
  ShieldAlert,
  Lightbulb,
  Search,
  ChevronDown,
  ChevronUp,
  Clock,
} from "lucide-react";
import { caseStudies, getSeverityLabel, getSeverityColor, getSeverityBgGradient } from "@/data/drugInteractions";
import { CaseStudy, InteractionSeverity } from "@/types";
import { cn } from "@/lib/utils";

const severityFilters: { value: string; label: string }[] = [
  { value: "all", label: "全部" },
  { value: "contraindicated", label: "禁用" },
  { value: "severe", label: "重度" },
  { value: "moderate", label: "中度" },
];

interface CaseCardProps {
  caseData: CaseStudy;
}

function CaseCard({ caseData }: CaseCardProps) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300">
      <div
        className={cn(
          "p-6 cursor-pointer",
          caseData.severity === "contraindicated" && "bg-red-50/30",
          caseData.severity === "severe" && "bg-orange-50/30",
          caseData.severity === "moderate" && "bg-yellow-50/30"
        )}
        onClick={() => setExpanded(!expanded)}
      >
        <div className="flex items-start gap-4">
          <div
            className={cn(
              "w-14 h-14 rounded-2xl flex items-center justify-center flex-shrink-0 bg-gradient-to-br shadow-lg",
              getSeverityBgGradient(caseData.severity)
            )}
          >
            <BookOpen className="w-7 h-7 text-white" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-2 flex-wrap">
              <h3 className="text-lg font-bold text-gray-900">
                {caseData.title}
              </h3>
              <span
                className={cn(
                  "inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold border",
                  getSeverityColor(caseData.severity)
                )}
              >
                {getSeverityLabel(caseData.severity)}
              </span>
            </div>
            <div className="flex flex-wrap gap-2">
              {caseData.drugCombination.map((drug, idx) => (
                <span
                  key={idx}
                  className="inline-flex items-center gap-1 px-3 py-1 bg-white border border-gray-200 rounded-full text-sm text-gray-700 shadow-sm"
                >
                  <Pill className="w-3.5 h-3.5 text-primary-500" />
                  {drug}
                </span>
              ))}
            </div>
          </div>
          <div className="flex-shrink-0 pt-1">
            {expanded ? (
              <ChevronUp className="w-6 h-6 text-gray-400" />
            ) : (
              <ChevronDown className="w-6 h-6 text-gray-400" />
            )}
          </div>
        </div>
      </div>

      {expanded && (
        <div className="px-6 pb-6 space-y-5 border-t border-gray-100">
          <div className="pt-5">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-8 h-8 rounded-lg bg-blue-100 flex items-center justify-center">
                <User className="w-4 h-4 text-blue-600" />
              </div>
              <h4 className="font-semibold text-gray-900">病例描述</h4>
            </div>
            <p className="text-gray-700 leading-relaxed pl-10">
              {caseData.caseDescription}
            </p>
          </div>

          <div>
            <div className="flex items-center gap-2 mb-3">
              <div className="w-8 h-8 rounded-lg bg-purple-100 flex items-center justify-center">
                <Activity className="w-4 h-4 text-purple-600" />
              </div>
              <h4 className="font-semibold text-gray-900">相互作用机制</h4>
            </div>
            <p className="text-gray-700 leading-relaxed pl-10">
              {caseData.interactionMechanism}
            </p>
          </div>

          <div>
            <div className="flex items-center gap-2 mb-3">
              <div className="w-8 h-8 rounded-lg bg-rose-100 flex items-center justify-center">
                <HeartPulse className="w-4 h-4 text-rose-600" />
              </div>
              <h4 className="font-semibold text-gray-900">临床结局</h4>
            </div>
            <p className="text-gray-700 leading-relaxed pl-10">
              {caseData.clinicalOutcome}
            </p>
          </div>

          <div>
            <div className="flex items-center gap-2 mb-3">
              <div className="w-8 h-8 rounded-lg bg-emerald-100 flex items-center justify-center">
                <ShieldAlert className="w-4 h-4 text-emerald-600" />
              </div>
              <h4 className="font-semibold text-gray-900">预防建议</h4>
            </div>
            <p className="text-gray-700 leading-relaxed pl-10">
              {caseData.preventionAdvice}
            </p>
          </div>

          <div className="p-5 bg-gradient-to-br from-amber-50 to-orange-50 rounded-2xl border border-amber-200">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-amber-500 to-orange-500 flex items-center justify-center">
                <Lightbulb className="w-4 h-4 text-white" />
              </div>
              <h4 className="font-bold text-gray-900">学习要点</h4>
            </div>
            <ul className="space-y-3 pl-10">
              {caseData.learningPoints.map((point, idx) => (
                <li key={idx} className="flex items-start gap-2">
                  <span className="flex-shrink-0 w-6 h-6 rounded-full bg-amber-200 text-amber-800 flex items-center justify-center text-xs font-bold mt-0.5">
                    {idx + 1}
                  </span>
                  <span className="text-gray-700 leading-relaxed">
                    {point}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
}

export default function CaseLibrary() {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeSeverity, setActiveSeverity] = useState("all");

  const filteredCases = useMemo(() => {
    return caseStudies.filter((cs) => {
      const matchesSeverity =
        activeSeverity === "all" || cs.severity === activeSeverity;
      const query = searchQuery.trim().toLowerCase();
      const matchesSearch =
        query === "" ||
        cs.title.toLowerCase().includes(query) ||
        cs.drugCombination.some((d) => d.toLowerCase().includes(query)) ||
        cs.caseDescription.toLowerCase().includes(query) ||
        cs.learningPoints.some((lp) => lp.toLowerCase().includes(query));
      return matchesSeverity && matchesSearch;
    });
  }, [searchQuery, activeSeverity]);

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="flex items-center gap-3">
        <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center shadow-lg">
          <BookOpen className="w-6 h-6 text-white" />
        </div>
        <div>
          <h1 className="text-3xl font-bold text-gray-900 font-serif">
            典型案例库
          </h1>
          <p className="text-sm text-gray-500 mt-1 flex items-center gap-2">
            <Clock className="w-4 h-4" />
            通过真实临床案例学习常见错误配伍，共收录 {caseStudies.length} 个典型案例
          </p>
        </div>
      </div>

      <div className="bg-gradient-to-br from-violet-50 to-purple-50 rounded-2xl p-6 border border-violet-100">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-violet-500 to-purple-500 flex items-center justify-center flex-shrink-0 shadow-md">
            <Lightbulb className="w-6 h-6 text-white" />
          </div>
          <div>
            <h3 className="font-bold text-gray-900 mb-2">案例学习方法</h3>
            <p className="text-sm text-gray-600 leading-relaxed">
              每个案例均来自真实临床场景，包含完整的病例描述、药物相互作用机制分析、临床结局和预防建议。
              建议按照"病例描述→机制分析→临床结局→预防要点"的顺序学习，重点掌握高危药物组合的识别与处理原则。
            </p>
          </div>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="搜索案例标题、药物名称或关键词..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-12 pr-5 py-3.5 bg-white border border-gray-200 rounded-2xl text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-400 focus:border-transparent shadow-sm transition-all"
          />
        </div>
        <div className="flex flex-wrap gap-2">
          {severityFilters.map((filter) => (
            <button
              key={filter.value}
              onClick={() => setActiveSeverity(filter.value)}
              className={cn(
                "px-5 py-3 rounded-xl text-sm font-medium transition-all duration-200",
                activeSeverity === filter.value
                  ? "bg-gradient-to-r from-primary-500 to-primary-600 text-white shadow-md shadow-primary-500/25"
                  : "bg-white text-gray-600 border border-gray-200 hover:border-primary-300 hover:text-primary-600"
              )}
            >
              {filter.label}
              {filter.value !== "all" && (
                <span className="ml-1 opacity-80">
                  ({caseStudies.filter((c) => c.severity === (filter.value as InteractionSeverity)).length})
                </span>
              )}
              {filter.value === "all" && (
                <span className="ml-1 opacity-80">({caseStudies.length})</span>
              )}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {filteredCases.map((caseData, index) => (
          <div
            key={caseData.id}
            className="animate-slide-up"
            style={{ animationDelay: `${index * 80}ms` }}
          >
            <CaseCard caseData={caseData} />
          </div>
        ))}
      </div>

      {filteredCases.length === 0 && (
        <div className="py-20 text-center bg-gray-50 rounded-2xl border-2 border-dashed border-gray-200">
          <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gray-100 flex items-center justify-center">
            <AlertTriangle className="w-8 h-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-semibold text-gray-700 mb-2">
            未找到匹配的案例
          </h3>
          <p className="text-sm text-gray-500">
            试试更换搜索关键词或选择其他严重程度筛选
          </p>
        </div>
      )}
    </div>
  );
}
