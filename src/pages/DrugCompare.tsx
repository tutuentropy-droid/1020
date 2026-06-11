import { useState, useMemo } from "react";
import {
  Search,
  X,
  Pill,
  GitCompare,
  Save,
  Check,
  AlertCircle,
  Sparkles,
  BookMarked,
} from "lucide-react";
import { drugs, drugCategories } from "@/data/drugs";
import { Drug } from "@/types";
import { useStore } from "@/store/useStore";
import { cn } from "@/lib/utils";

const categoryColors: Record<string, string> = {
  抗生素: "bg-blue-50 text-blue-700 border-blue-200",
  心血管药物: "bg-rose-50 text-rose-700 border-rose-200",
  消化系统药物: "bg-amber-50 text-amber-700 border-amber-200",
  呼吸系统药物: "bg-cyan-50 text-cyan-700 border-cyan-200",
  神经系统药物: "bg-violet-50 text-violet-700 border-violet-200",
  内分泌系统药物: "bg-emerald-50 text-emerald-700 border-emerald-200",
};

const allCategory = "全部";

interface CompareField {
  key: string;
  label: string;
  isArray?: boolean;
}

const compareFields: CompareField[] = [
  { key: "category", label: "药物分类" },
  { key: "indications", label: "适应症", isArray: true },
  { key: "mechanism", label: "作用机制" },
  { key: "halfLife", label: "半衰期" },
  { key: "metabolism", label: "代谢途径" },
  { key: "adverseReactions", label: "不良反应", isArray: true },
  { key: "contraindications", label: "禁忌症", isArray: true },
  { key: "dosage", label: "用法用量" },
];

function arraysEqual(a: string[], b: string[]): boolean {
  if (a.length !== b.length) return false;
  const sortedA = [...a].sort();
  const sortedB = [...b].sort();
  return sortedA.every((val, idx) => val === sortedB[idx]);
}

function getFieldValue(drug: Drug, key: string): string | string[] {
  return (drug as any)[key];
}

function isFieldDifferent(drugs: Drug[], key: string, isArray?: boolean): boolean {
  if (drugs.length < 2) return false;
  const firstValue = getFieldValue(drugs[0], key);
  for (let i = 1; i < drugs.length; i++) {
    const currentValue = getFieldValue(drugs[i], key);
    if (isArray) {
      if (!arraysEqual(firstValue as string[], currentValue as string[])) {
        return true;
      }
    } else {
      if (firstValue !== currentValue) {
        return true;
      }
    }
  }
  return false;
}

export default function DrugCompare() {
  const [selectedDrugIds, setSelectedDrugIds] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState(allCategory);
  const [showSaveSuccess, setShowSaveSuccess] = useState(false);
  const { addNote } = useStore();

  const selectedDrugs = useMemo(() => {
    return selectedDrugIds
      .map((id) => drugs.find((d) => d.id === id))
      .filter((d): d is Drug => d !== undefined);
  }, [selectedDrugIds]);

  const filteredDrugs = useMemo(() => {
    return drugs.filter((drug) => {
      const matchesCategory =
        activeCategory === allCategory || drug.category === activeCategory;
      const matchesSearch =
        searchQuery.trim() === "" ||
        drug.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        drug.indications.some((ind) =>
          ind.toLowerCase().includes(searchQuery.toLowerCase())
        );
      const notSelected = !selectedDrugIds.includes(drug.id);
      return matchesCategory && matchesSearch && notSelected;
    });
  }, [searchQuery, activeCategory, selectedDrugIds]);

  const categories = [allCategory, ...drugCategories];

  const handleSelectDrug = (drugId: string) => {
    if (selectedDrugIds.length >= 4) return;
    setSelectedDrugIds([...selectedDrugIds, drugId]);
  };

  const handleRemoveDrug = (drugId: string) => {
    setSelectedDrugIds(selectedDrugIds.filter((id) => id !== drugId));
  };

  const handleSaveToNotes = () => {
    if (selectedDrugs.length < 2) return;

    const title = `药物对比：${selectedDrugs.map((d) => d.name).join(" vs ")}`;
    
    let content = `## 药物对比结果\n\n`;
    content += `对比药物：${selectedDrugs.map((d) => d.name).join("、")}\n\n`;

    const differentFields: string[] = [];
    compareFields.forEach((field) => {
      if (isFieldDifferent(selectedDrugs, field.key, field.isArray)) {
        differentFields.push(field.label);
      }
    });
    if (differentFields.length > 0) {
      content += `存在差异的属性：${differentFields.join("、")}\n\n`;
    } else {
      content += `所有属性均一致\n\n`;
    }
    content += `---\n\n`;

    compareFields.forEach((field) => {
      const isDifferent = isFieldDifferent(selectedDrugs, field.key, field.isArray);
      content += `### ${field.label}${isDifferent ? " 🔴（存在差异）" : " ✅（一致）"}\n\n`;
      selectedDrugs.forEach((drug) => {
        const value = getFieldValue(drug, field.key);
        content += `**${drug.name}**：`;
        if (field.isArray && Array.isArray(value)) {
          content += value.map((item, idx) => {
            if (isDifferent) {
              const otherDrugs = selectedDrugs.filter((d) => d.id !== drug.id);
              const isUniqueItem = !otherDrugs.some((od) => {
                const otherValue = getFieldValue(od, field.key) as string[];
                return otherValue.includes(item);
              });
              return isUniqueItem ? `\`${item}\`（${drug.name}独有）` : item;
            }
            return item;
          }).join("；");
        } else {
          content += value;
        }
        content += "\n\n";
      });
      content += `---\n\n`;
    });

    content += `> 说明：🔴标注的属性表示药物间存在差异；标有(药物名独有的内容为该药物独有内容`;

    addNote({
      title,
      content,
      type: "drug-compare",
      drugIds: selectedDrugIds,
    });

    setShowSaveSuccess(true);
    setTimeout(() => setShowSaveSuccess(false), 3000);
  };

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center shadow-lg">
            <GitCompare className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-900 font-serif">药物对比</h1>
            <p className="text-sm text-gray-500 mt-1">
              选择2-4种药物，对比其关键属性，高亮显示差异
            </p>
          </div>
        </div>
        {selectedDrugs.length >= 2 && (
          <button
            onClick={handleSaveToNotes}
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-primary-500 to-accent-500 text-white font-medium rounded-xl shadow-md hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200"
          >
            <Save className="w-4 h-4" />
            保存到笔记
          </button>
        )}
      </div>

      {showSaveSuccess && (
        <div className="fixed top-24 right-6 z-50 animate-slide-up">
          <div className="flex items-center gap-3 px-5 py-3 bg-emerald-500 text-white rounded-xl shadow-lg">
            <Check className="w-5 h-5" />
            <span className="font-medium">已保存到个人笔记</span>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1 space-y-4">
          <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm">
            <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <Pill className="w-5 h-5 text-primary-500" />
              选择药物
              <span className="text-sm font-normal text-gray-500">
                （{selectedDrugIds.length}/4）
              </span>
            </h3>

            {selectedDrugIds.length < 2 && (
              <div className="flex items-center gap-2 px-3 py-2 bg-amber-50 border border-amber-200 rounded-lg mb-4">
                <AlertCircle className="w-4 h-4 text-amber-500 flex-shrink-0" />
                <p className="text-xs text-amber-700">
                  请至少选择2种药物进行对比
                </p>
              </div>
            )}

            {selectedDrugs.length > 0 && (
              <div className="space-y-3 mb-4">
                {selectedDrugs.map((drug) => {
                  const colorClass =
                    categoryColors[drug.category] ||
                    "bg-gray-50 text-gray-700 border-gray-200";
                  return (
                    <div
                      key={drug.id}
                      className="relative bg-gradient-to-r from-primary-50 to-accent-50 rounded-xl p-3 border border-primary-100"
                    >
                      <button
                        onClick={() => handleRemoveDrug(drug.id)}
                        className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-red-500 text-white flex items-center justify-center hover:bg-red-600 transition-colors shadow-md"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center flex-shrink-0">
                          <Pill className="w-4.5 h-4.5 text-white" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="font-semibold text-gray-900 text-sm truncate">
                            {drug.name}
                          </h4>
                          <span
                            className={cn(
                              "inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium border",
                              colorClass
                            )}
                          >
                            {drug.category}
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            <div className="relative mb-3">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="w-4 h-4 text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="搜索药物..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-400 focus:border-transparent transition-all"
              />
            </div>

            <div className="flex flex-wrap gap-1.5 mb-4">
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => setActiveCategory(category)}
                  className={cn(
                    "px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-200",
                    activeCategory === category
                      ? "bg-primary-500 text-white shadow-sm"
                      : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                  )}
                >
                  {category}
                </button>
              ))}
            </div>

            <div className="max-h-80 overflow-y-auto space-y-1 pr-1">
              {filteredDrugs.length > 0 ? (
                filteredDrugs.map((drug) => {
                  const colorClass =
                    categoryColors[drug.category] ||
                    "bg-gray-50 text-gray-700 border-gray-200";
                  const disabled = selectedDrugIds.length >= 4;
                  return (
                    <div
                      key={drug.id}
                      onClick={() => !disabled && handleSelectDrug(drug.id)}
                      className={cn(
                        "flex items-center gap-3 p-2.5 rounded-lg transition-all",
                        disabled
                          ? "bg-gray-50 opacity-50 cursor-not-allowed"
                          : "cursor-pointer hover:bg-primary-50"
                      )}
                    >
                      <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary-400 to-accent-400 flex items-center justify-center flex-shrink-0">
                        <Pill className="w-4 h-4 text-white" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h5 className="font-medium text-gray-900 text-sm truncate">
                          {drug.name}
                        </h5>
                        <span
                          className={cn(
                            "inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-medium border",
                            colorClass
                          )}
                        >
                          {drug.category}
                        </span>
                      </div>
                    </div>
                  );
                })
              ) : (
                <div className="py-8 text-center">
                  <p className="text-sm text-gray-400">未找到相关药物</p>
                </div>
              )}
            </div>
          </div>

          {selectedDrugs.length >= 2 && (
            <div className="bg-gradient-to-br from-primary-50 to-accent-50 rounded-2xl border border-primary-100 p-5">
              <div className="flex items-center gap-2 mb-3">
                <Sparkles className="w-5 h-5 text-primary-500" />
                <h4 className="font-semibold text-gray-900">对比提示</h4>
              </div>
              <ul className="space-y-2 text-sm text-gray-600">
                <li className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-primary-400 mt-1.5 flex-shrink-0" />
                  <span>高亮背景的属性表示药物间存在差异</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-primary-400 mt-1.5 flex-shrink-0" />
                  <span>点击「保存到笔记」可永久保存对比结果</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-primary-400 mt-1.5 flex-shrink-0" />
                  <span>最多可同时对比4种药物</span>
                </li>
              </ul>
            </div>
          )}
        </div>

        <div className="lg:col-span-2">
          {selectedDrugs.length >= 2 ? (
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="text-left py-4 px-5 bg-gray-50 w-32 font-semibold text-gray-700 text-sm sticky left-0 bg-gray-50 z-10">
                        属性
                      </th>
                      {selectedDrugs.map((drug, index) => (
                        <th
                          key={drug.id}
                          className={cn(
                            "text-center py-4 px-4 font-semibold text-gray-900 min-w-[180px]",
                            index === 0 ? "bg-primary-50/50" : "bg-accent-50/50"
                          )}
                        >
                          <div className="flex flex-col items-center gap-2">
                            <div
                              className={cn(
                                "w-10 h-10 rounded-xl flex items-center justify-center",
                                index === 0
                                  ? "bg-gradient-to-br from-primary-500 to-primary-600"
                                  : "bg-gradient-to-br from-accent-500 to-accent-600"
                              )}
                            >
                              <Pill className="w-5 h-5 text-white" />
                            </div>
                            <span className="text-base">{drug.name}</span>
                            <span
                              className={cn(
                                "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border",
                                categoryColors[drug.category] ||
                                  "bg-gray-50 text-gray-700 border-gray-200"
                              )}
                            >
                              {drug.category}
                            </span>
                          </div>
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {compareFields.map((field) => {
                      const isDifferent = isFieldDifferent(
                        selectedDrugs,
                        field.key,
                        field.isArray
                      );
                      return (
                        <tr
                          key={field.key}
                          className={cn(
                            "border-b border-gray-100 last:border-b-0 transition-colors",
                            isDifferent ? "bg-amber-50/60" : "hover:bg-gray-50"
                          )}
                        >
                          <td className="py-4 px-5 text-sm font-medium text-gray-700 sticky left-0 bg-inherit z-10">
                            <div className="flex items-center gap-2">
                              {isDifferent && (
                                <span className="w-2 h-2 rounded-full bg-amber-400 flex-shrink-0" />
                              )}
                              {field.label}
                            </div>
                          </td>
                          {selectedDrugs.map((drug, idx) => {
                            const value = getFieldValue(drug, field.key);
                            return (
                              <td
                                key={drug.id}
                                className={cn(
                                  "py-4 px-4 text-sm text-gray-600 align-top",
                                  idx === 0 ? "bg-primary-50/20" : "bg-accent-50/20"
                                )}
                              >
                                {field.isArray && Array.isArray(value) ? (
                                  <ul className="space-y-1.5">
                                    {value.map((item, i) => (
                                      <li
                                        key={i}
                                        className="flex items-start gap-2"
                                      >
                                        <span className="w-1 h-1 rounded-full bg-gray-400 mt-2 flex-shrink-0" />
                                        <span>{item}</span>
                                      </li>
                                    ))}
                                  </ul>
                                ) : (
                                  <p className="leading-relaxed">{value}</p>
                                )}
                              </td>
                            );
                          })}
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-2xl border border-gray-100 p-16 shadow-sm text-center">
              <div className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
                <GitCompare className="w-10 h-10 text-gray-400" />
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-3">
                选择药物开始对比
              </h3>
              <p className="text-gray-500 max-w-md mx-auto">
                从左侧列表中选择2-4种药物，系统将以表格形式并排显示其关键属性，
                并高亮显示存在差异的项目，帮助你理解同类药物的异同。
              </p>
              <div className="flex items-center justify-center gap-6 mt-8">
                <div className="flex items-center gap-2 text-sm text-gray-500">
                  <BookMarked className="w-4 h-4" />
                  <span>支持保存对比结果到个人笔记</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
