import { useState, useMemo } from "react";
import {
  Search,
  Plus,
  X,
  AlertTriangle,
  Pill,
  Info,
  ShieldAlert,
  Activity,
  BookOpen,
  ChevronDown,
  ChevronUp,
  ArrowRight,
} from "lucide-react";
import { drugs } from "@/data/drugs";
import {
  drugInteractions,
  getSeverityLabel,
  getSeverityColor,
  getSeverityBgGradient,
} from "@/data/drugInteractions";
import { Drug, DrugInteraction as DrugInteractionType } from "@/types";
import { cn } from "@/lib/utils";

const categoryColors: Record<string, string> = {
  抗生素: "bg-blue-50 text-blue-700 border-blue-200",
  心血管药物: "bg-rose-50 text-rose-700 border-rose-200",
  消化系统药物: "bg-amber-50 text-amber-700 border-amber-200",
  呼吸系统药物: "bg-cyan-50 text-cyan-700 border-cyan-200",
  神经系统药物: "bg-violet-50 text-violet-700 border-violet-200",
  内分泌系统药物: "bg-emerald-50 text-emerald-700 border-emerald-200",
};

const severityOrder = ["contraindicated", "severe", "moderate", "mild"];

interface SelectedDrugCardProps {
  drug: Drug;
  onRemove: () => void;
}

function SelectedDrugCard({ drug, onRemove }: SelectedDrugCardProps) {
  const colorClass =
    categoryColors[drug.category] ||
    "bg-gray-50 text-gray-700 border-gray-200";

  return (
    <div className="relative bg-white rounded-xl border border-gray-200 p-4 shadow-sm hover:shadow-md transition-shadow">
      <button
        onClick={onRemove}
        className="absolute -top-2 -right-2 w-7 h-7 rounded-full bg-red-500 text-white flex items-center justify-center hover:bg-red-600 transition-colors shadow-md"
      >
        <X className="w-4 h-4" />
      </button>
      <div className="flex items-start gap-3">
        <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center flex-shrink-0">
          <Pill className="w-5 h-5 text-white" />
        </div>
        <div className="flex-1 min-w-0">
          <h4 className="font-semibold text-gray-900 truncate">{drug.name}</h4>
          <span
            className={cn(
              "inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium border mt-1",
              colorClass
            )}
          >
            {drug.category}
          </span>
        </div>
      </div>
    </div>
  );
}

interface DrugOptionProps {
  drug: Drug;
  onSelect: () => void;
  isSelected: boolean;
}

function DrugOption({ drug, onSelect, isSelected }: DrugOptionProps) {
  const colorClass =
    categoryColors[drug.category] ||
    "bg-gray-50 text-gray-700 border-gray-200";

  return (
    <div
      onClick={isSelected ? undefined : onSelect}
      className={cn(
        "flex items-center gap-3 p-3 rounded-lg transition-all cursor-pointer",
        isSelected
          ? "bg-gray-100 opacity-60 cursor-not-allowed"
          : "hover:bg-primary-50"
      )}
    >
      <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary-400 to-accent-400 flex items-center justify-center flex-shrink-0">
        <Pill className="w-4 h-4 text-white" />
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <h5 className="font-medium text-gray-900 truncate">{drug.name}</h5>
          {isSelected && (
            <span className="text-xs text-gray-500">已添加</span>
          )}
        </div>
        <span
          className={cn(
            "inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium border mt-0.5",
            colorClass
          )}
        >
          {drug.category}
        </span>
      </div>
    </div>
  );
}

interface InteractionResultCardProps {
  interaction: DrugInteractionType;
  drugA: Drug | undefined;
  drugB: Drug | undefined;
}

function InteractionResultCard({
  interaction,
  drugA,
  drugB,
}: InteractionResultCardProps) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm hover:shadow-md transition-shadow">
      <div
        className={cn(
          "p-5 cursor-pointer flex items-start gap-4",
          interaction.severity === "contraindicated" &&
            "bg-red-50/50",
          interaction.severity === "severe" && "bg-orange-50/50",
          interaction.severity === "moderate" && "bg-yellow-50/50",
          interaction.severity === "mild" && "bg-green-50/50"
        )}
        onClick={() => setExpanded(!expanded)}
      >
        <div
          className={cn(
            "w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 bg-gradient-to-br shadow-md",
            getSeverityBgGradient(interaction.severity)
          )}
        >
          <AlertTriangle className="w-6 h-6 text-white" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-2 flex-wrap">
            <h4 className="font-semibold text-gray-900">
              {drugA?.name || "药物A"}{" "}
              <ArrowRight className="inline w-4 h-4 text-gray-400" />{" "}
              {drugB?.name || "药物B"}
            </h4>
            <span
              className={cn(
                "inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold border",
                getSeverityColor(interaction.severity)
              )}
            >
              {getSeverityLabel(interaction.severity)}
            </span>
          </div>
          <p className="text-sm text-gray-600 leading-relaxed">
            {interaction.description}
          </p>
        </div>
        <div className="flex-shrink-0 pt-1">
          {expanded ? (
            <ChevronUp className="w-5 h-5 text-gray-400" />
          ) : (
            <ChevronDown className="w-5 h-5 text-gray-400" />
          )}
        </div>
      </div>
      {expanded && (
        <div className="px-5 pb-5 space-y-4 border-t border-gray-100 pt-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 bg-blue-50/50 rounded-xl">
              <div className="flex items-center gap-2 mb-2">
                <Activity className="w-4 h-4 text-blue-600" />
                <h5 className="text-sm font-semibold text-gray-900">
                  作用机制
                </h5>
              </div>
              <p className="text-sm text-gray-600 leading-relaxed">
                {interaction.mechanism}
              </p>
            </div>
            <div className="p-4 bg-purple-50/50 rounded-xl">
              <div className="flex items-center gap-2 mb-2">
                <ShieldAlert className="w-4 h-4 text-purple-600" />
                <h5 className="text-sm font-semibold text-gray-900">
                  临床意义
                </h5>
              </div>
              <p className="text-sm text-gray-600 leading-relaxed">
                {interaction.clinicalSignificance}
              </p>
            </div>
          </div>
          <div className="p-4 bg-primary-50/50 rounded-xl">
            <div className="flex items-center gap-2 mb-2">
              <Info className="w-4 h-4 text-primary-600" />
              <h5 className="text-sm font-semibold text-gray-900">处理建议</h5>
            </div>
            <p className="text-sm text-gray-600 leading-relaxed">
              {interaction.recommendation}
            </p>
          </div>
          <div className="flex items-start gap-2 text-xs text-gray-500">
            <BookOpen className="w-4 h-4 flex-shrink-0 mt-0.5" />
            <div>
              <span className="font-medium">参考文献：</span>
              {interaction.references.join("；")}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function DrugInteractionPage() {
  const [selectedDrugIds, setSelectedDrugIds] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);

  const selectedDrugs = useMemo(
    () =>
      selectedDrugIds
        .map((id) => drugs.find((d) => d.id === id))
        .filter(Boolean) as Drug[],
    [selectedDrugIds]
  );

  const filteredDrugs = useMemo(() => {
    if (searchQuery.trim() === "") return drugs;
    const query = searchQuery.toLowerCase();
    return drugs.filter(
      (drug) =>
        drug.name.toLowerCase().includes(query) ||
        drug.category.toLowerCase().includes(query) ||
        drug.indications.some((i) => i.toLowerCase().includes(query))
    );
  }, [searchQuery]);

  const foundInteractions = useMemo(() => {
    if (selectedDrugIds.length < 2) return [];
    const interactions: DrugInteractionType[] = [];
    for (let i = 0; i < selectedDrugIds.length; i++) {
      for (let j = i + 1; j < selectedDrugIds.length; j++) {
        const idA = selectedDrugIds[i];
        const idB = selectedDrugIds[j];
        const found = drugInteractions.find(
          (di) =>
            (di.drugAId === idA && di.drugBId === idB) ||
            (di.drugAId === idB && di.drugBId === idA)
        );
        if (found) interactions.push(found);
      }
    }
    interactions.sort(
      (a, b) =>
        severityOrder.indexOf(a.severity) - severityOrder.indexOf(b.severity)
    );
    return interactions;
  }, [selectedDrugIds]);

  const addDrug = (drugId: string) => {
    if (!selectedDrugIds.includes(drugId)) {
      setSelectedDrugIds([...selectedDrugIds, drugId]);
    }
    setSearchQuery("");
    setShowDropdown(false);
  };

  const removeDrug = (drugId: string) => {
    setSelectedDrugIds(selectedDrugIds.filter((id) => id !== drugId));
  };

  const maxSeverity =
    foundInteractions.length > 0
      ? foundInteractions.reduce(
          (max, curr) =>
            severityOrder.indexOf(curr.severity) < severityOrder.indexOf(max)
              ? curr.severity
              : max,
          foundInteractions[0].severity
        )
      : null;

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="flex items-center gap-3">
        <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-orange-500 to-red-500 flex items-center justify-center shadow-lg">
          <AlertTriangle className="w-6 h-6 text-white" />
        </div>
        <div>
          <h1 className="text-3xl font-bold text-gray-900 font-serif">
            药物相互作用查询
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            添加两种或多种药物，查询潜在的相互作用风险
          </p>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">
          添加待查询药物
        </h2>
        <div className="relative">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="输入药物名称搜索（商品名或通用名）..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setShowDropdown(true);
              }}
              onFocus={() => setShowDropdown(true)}
              onBlur={() => setTimeout(() => setShowDropdown(false), 200)}
              className="w-full pl-12 pr-12 py-4 bg-white border border-gray-200 rounded-2xl text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-400 focus:border-transparent shadow-sm transition-all"
            />
            <button
              onClick={() => selectedDrugIds.length < 5 && setShowDropdown(true)}
              disabled={selectedDrugIds.length >= 5}
              className={cn(
                "absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1 px-4 py-2 rounded-xl text-sm font-medium transition-all",
                selectedDrugIds.length >= 5
                  ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                  : "bg-primary-500 text-white hover:bg-primary-600"
              )}
            >
              <Plus className="w-4 h-4" />
              添加
            </button>
          </div>

          {showDropdown && (
            <div className="absolute z-20 w-full mt-2 bg-white border border-gray-200 rounded-2xl shadow-lg max-h-80 overflow-y-auto">
              {filteredDrugs.length > 0 ? (
                <div className="p-2">
                  {filteredDrugs.map((drug) => (
                    <DrugOption
                      key={drug.id}
                      drug={drug}
                      onSelect={() => addDrug(drug.id)}
                      isSelected={selectedDrugIds.includes(drug.id)}
                    />
                  ))}
                </div>
              ) : (
                <div className="p-8 text-center">
                  <p className="text-gray-500">未找到匹配的药物</p>
                </div>
              )}
            </div>
          )}
        </div>

        {selectedDrugIds.length > 0 && (
          <div className="mt-6">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-medium text-gray-700">
                已选药物 ({selectedDrugIds.length})
              </h3>
              {selectedDrugIds.length >= 5 && (
                <span className="text-xs text-amber-600 bg-amber-50 px-2 py-1 rounded-md">
                  最多添加5种药物
                </span>
              )}
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
              {selectedDrugs.map((drug) => (
                <SelectedDrugCard
                  key={drug.id}
                  drug={drug}
                  onRemove={() => removeDrug(drug.id)}
                />
              ))}
            </div>
          </div>
        )}
      </div>

      {selectedDrugIds.length < 2 && (
        <div className="bg-gray-50 rounded-2xl p-10 text-center border-2 border-dashed border-gray-200">
          <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-primary-100 flex items-center justify-center">
            <Pill className="w-8 h-8 text-primary-600" />
          </div>
          <h3 className="text-lg font-semibold text-gray-700 mb-2">
            请至少添加两种药物
          </h3>
          <p className="text-sm text-gray-500">
            添加两种或多种药物后，系统将自动检测并展示相互作用信息
          </p>
        </div>
      )}

      {selectedDrugIds.length >= 2 && (
        <div className="space-y-6">
          {maxSeverity && (
            <div
              className={cn(
                "rounded-2xl p-6 flex items-center gap-4 border-2",
                getSeverityColor(maxSeverity)
              )}
            >
              <div
                className={cn(
                  "w-12 h-12 rounded-xl flex items-center justify-center bg-gradient-to-br shadow-md",
                  getSeverityBgGradient(maxSeverity)
                )}
              >
                <AlertTriangle className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="text-lg font-bold">
                  检测到
                  {foundInteractions.length}
                  项相互作用
                  {maxSeverity && (
                    <>
                      ，最高风险等级：
                      <span className="underline ml-1">
                        {getSeverityLabel(maxSeverity)}
                      </span>
                    </>
                  )}
                </h3>
                <p className="text-sm opacity-80 mt-1">
                  请仔细查看以下详细信息，必要时咨询医师或药师
                </p>
              </div>
            </div>
          )}

          {foundInteractions.length > 0 ? (
            <div className="space-y-4">
              {foundInteractions.map((interaction) => (
                <InteractionResultCard
                  key={interaction.id}
                  interaction={interaction}
                  drugA={drugs.find((d) => d.id === interaction.drugAId)}
                  drugB={drugs.find((d) => d.id === interaction.drugBId)}
                />
              ))}
            </div>
          ) : (
            <div className="bg-green-50 rounded-2xl p-10 text-center border-2 border-green-200">
              <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-green-100 flex items-center justify-center">
                <ShieldAlert className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="text-lg font-semibold text-green-800 mb-2">
                未发现明显的相互作用
              </h3>
              <p className="text-sm text-green-700">
                当前所选药物组合在我们的数据库中未发现已知的严重相互作用。
                但请仍遵医嘱用药，如有疑问请咨询专业医师。
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
