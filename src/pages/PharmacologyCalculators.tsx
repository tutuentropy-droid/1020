import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { Calculator, Baby, FlaskConical, Ruler, Syringe, Activity, Info } from "lucide-react";
import PediatricDoseCalculator from "@/components/Calculators/PediatricDoseCalculator";
import CreatinineClearanceCalculator from "@/components/Calculators/CreatinineClearanceCalculator";
import BodySurfaceAreaCalculator from "@/components/Calculators/BodySurfaceAreaCalculator";
import DoseCalculator from "@/components/Calculators/DoseCalculator";
import TDMSimulator from "@/components/Calculators/TDMSimulator";
import { CalculatorType } from "@/types";
import { cn } from "@/lib/utils";

const calculatorTabs: {
  id: CalculatorType;
  label: string;
  description: string;
  icon: typeof Calculator;
  gradient: string;
}[] = [
  {
    id: "pediatric-dose",
    label: "儿童剂量",
    description: "按体重换算儿童用药剂量",
    icon: Baby,
    gradient: "from-pink-500 to-rose-500",
  },
  {
    id: "creatinine-clearance",
    label: "肌酐清除率",
    description: "Cockcroft-Gault公式评估肾功能",
    icon: FlaskConical,
    gradient: "from-violet-500 to-purple-500",
  },
  {
    id: "body-surface-area",
    label: "体表面积",
    description: "Du Bois公式计算BSA",
    icon: Ruler,
    gradient: "from-cyan-500 to-teal-500",
  },
  {
    id: "dose-calculation",
    label: "负荷/维持剂量",
    description: "基于PK参数计算给药方案",
    icon: Syringe,
    gradient: "from-emerald-500 to-green-500",
  },
  {
    id: "tdm-simulation",
    label: "TDM模拟",
    description: "血药浓度预测与结果解读",
    icon: Activity,
    gradient: "from-orange-500 to-amber-500",
  },
];

export default function PharmacologyCalculators() {
  const [searchParams, setSearchParams] = useSearchParams();
  const tabFromUrl = searchParams.get("tab") as CalculatorType | null;
  const validTabs = calculatorTabs.map((t) => t.id);
  const initialTab = tabFromUrl && validTabs.includes(tabFromUrl) ? tabFromUrl : "pediatric-dose";
  const [activeTab, setActiveTab] = useState<CalculatorType>(initialTab);

  useEffect(() => {
    if (tabFromUrl && validTabs.includes(tabFromUrl) && tabFromUrl !== activeTab) {
      setActiveTab(tabFromUrl);
    }
  }, [tabFromUrl, activeTab, validTabs]);

  const handleTabChange = (tabId: CalculatorType) => {
    setActiveTab(tabId);
    setSearchParams({ tab: tabId });
  };

  const renderCalculator = () => {
    switch (activeTab) {
      case "pediatric-dose":
        return <PediatricDoseCalculator />;
      case "creatinine-clearance":
        return <CreatinineClearanceCalculator />;
      case "body-surface-area":
        return <BodySurfaceAreaCalculator />;
      case "dose-calculation":
        return <DoseCalculator />;
      case "tdm-simulation":
        return <TDMSimulator />;
      default:
        return <PediatricDoseCalculator />;
    }
  };

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="flex items-center gap-3">
        <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center shadow-lg">
          <Calculator className="w-6 h-6 text-white" />
        </div>
        <div>
          <h1 className="text-3xl font-bold text-gray-900 font-serif">
            药理计算器
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            常用临床药理学计算工具，支持结果一键复制
          </p>
        </div>
      </div>

      <div className="p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl border border-blue-100 flex items-start gap-3">
        <Info className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
        <div className="text-sm text-blue-800 leading-relaxed">
          <span className="font-semibold">使用说明：</span>
          本计算器基于经典药代动力学公式设计，计算结果仅供学习参考，不能替代临床判断和专业医疗建议。实际用药请务必遵医嘱，并结合患者具体情况综合判断。
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
        {calculatorTabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => handleTabChange(tab.id)}
              className={cn(
                "group relative text-left p-4 rounded-2xl border transition-all duration-300",
                isActive
                  ? "bg-white border-primary-300 shadow-lg -translate-y-0.5"
                  : "bg-white/60 border-gray-200 hover:border-gray-300 hover:bg-white hover:shadow-md"
              )}
            >
              <div
                className={cn(
                  "w-10 h-10 rounded-xl flex items-center justify-center mb-3 transition-transform duration-300 bg-gradient-to-br",
                  tab.gradient,
                  isActive ? "scale-110 shadow-md" : "group-hover:scale-105"
                )}
              >
                <Icon className="w-5 h-5 text-white" />
              </div>
              <h3
                className={cn(
                  "text-sm font-bold mb-1 transition-colors",
                  isActive ? "text-primary-700" : "text-gray-800"
                )}
              >
                {tab.label}
              </h3>
              <p className="text-xs text-gray-500 leading-relaxed">
                {tab.description}
              </p>
              {isActive && (
                <div className="absolute bottom-0 left-4 right-4 h-0.5 bg-gradient-to-r from-primary-500 to-accent-500 rounded-full" />
              )}
            </button>
          );
        })}
      </div>

      <div className="transition-all duration-300">{renderCalculator()}</div>

      <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
        <div className="flex items-center gap-3 mb-5">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-gray-500 to-gray-700 flex items-center justify-center">
            <Calculator className="w-5 h-5 text-white" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-gray-900">常用公式速查</h2>
            <p className="text-sm text-gray-500">快速查阅核心计算公式</p>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div className="p-4 bg-pink-50/50 rounded-xl border border-pink-100">
            <div className="text-xs font-semibold text-pink-700 mb-1.5">儿童剂量 (Clark法则)</div>
            <div className="text-sm font-mono text-gray-800">儿童剂量 = 成人剂量 × 体重(kg) / 70</div>
          </div>
          <div className="p-4 bg-violet-50/50 rounded-xl border border-violet-100">
            <div className="text-xs font-semibold text-violet-700 mb-1.5">肌酐清除率 (Cockcroft-Gault)</div>
            <div className="text-sm font-mono text-gray-800">CrCl = (140-年龄)×体重/(72×SCr) × 0.85(女)</div>
          </div>
          <div className="p-4 bg-cyan-50/50 rounded-xl border border-cyan-100">
            <div className="text-xs font-semibold text-cyan-700 mb-1.5">体表面积 (Du Bois)</div>
            <div className="text-sm font-mono text-gray-800">BSA = 0.007184 × H^0.725 × W^0.425</div>
          </div>
          <div className="p-4 bg-emerald-50/50 rounded-xl border border-emerald-100">
            <div className="text-xs font-semibold text-emerald-700 mb-1.5">负荷剂量</div>
            <div className="text-sm font-mono text-gray-800">LD = Ctarget × Vd / F</div>
          </div>
          <div className="p-4 bg-green-50/50 rounded-xl border border-green-100">
            <div className="text-xs font-semibold text-green-700 mb-1.5">维持剂量</div>
            <div className="text-sm font-mono text-gray-800">MD = Css × Cl × τ / F</div>
          </div>
          <div className="p-4 bg-orange-50/50 rounded-xl border border-orange-100">
            <div className="text-xs font-semibold text-orange-700 mb-1.5">稳态谷浓度</div>
            <div className="text-sm font-mono text-gray-800">Cmin = (F×D) / (Cl × τ)</div>
          </div>
        </div>
      </div>
    </div>
  );
}
