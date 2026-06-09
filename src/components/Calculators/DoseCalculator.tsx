import { useState } from "react";
import { Syringe, Calculator, Info } from "lucide-react";
import {
  ResultItem,
  CopyableResult,
  FormulaDerivation,
  ClinicalExampleCard,
} from "./Shared";
import { calculateDoses, formatNumber } from "@/utils/calculators";
import { doseCalculationExamples } from "@/data/tdmDrugs";
import { cn } from "@/lib/utils";

export default function DoseCalculator() {
  const [targetConcentration, setTargetConcentration] = useState<string>("20");
  const [volumeOfDistribution, setVolumeOfDistribution] = useState<string>("49");
  const [clearance, setClearance] = useState<string>("3.5");
  const [bioavailability, setBioavailability] = useState<string>("1");
  const [dosingInterval, setDosingInterval] = useState<string>("12");
  const [showLoading, setShowLoading] = useState(true);
  const [result, setResult] = useState<ReturnType<typeof calculateDoses> | null>(null);

  const handleCalculate = () => {
    const tc = parseFloat(targetConcentration);
    const vd = parseFloat(volumeOfDistribution);
    const cl = parseFloat(clearance);
    const f = parseFloat(bioavailability);
    const tau = parseFloat(dosingInterval);

    if (
      isNaN(tc) || isNaN(vd) || isNaN(cl) || isNaN(f) || isNaN(tau) ||
      tc <= 0 || vd <= 0 || cl <= 0 || f <= 0 || f > 1 || tau <= 0
    ) {
      return;
    }

    setResult(
      calculateDoses(
        { targetConcentration: tc, volumeOfDistribution: vd, bioavailability: f },
        { targetConcentration: tc, clearance: cl, bioavailability: f, dosingInterval: tau }
      )
    );
  };

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
      <div className="p-5 bg-gradient-to-r from-emerald-50 to-green-50 border-b border-gray-100">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-500 to-green-500 flex items-center justify-center shadow-md">
            <Syringe className="w-6 h-6 text-white" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-900">
              负荷剂量与维持剂量计算
            </h2>
            <p className="text-sm text-gray-500 mt-0.5">
              基于药代动力学参数计算个体化给药方案
            </p>
          </div>
        </div>
      </div>

      <div className="p-5 space-y-5">
        <div className="p-3 bg-blue-50 rounded-lg border border-blue-100 flex items-start gap-2">
          <Info className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
          <p className="text-xs text-blue-800 leading-relaxed">
            负荷剂量（LD）快速达到治疗浓度；维持剂量（MD）持续维持目标浓度。常用药物的Vd和Cl可查阅临床药理学资料。
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              目标稳态浓度 (mg/L 或 μg/mL)
            </label>
            <input
              type="number"
              value={targetConcentration}
              onChange={(e) => setTargetConcentration(e.target.value)}
              placeholder="目标血药浓度"
              className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:border-transparent transition-all"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              分布容积 Vd (L)
            </label>
            <input
              type="number"
              value={volumeOfDistribution}
              onChange={(e) => setVolumeOfDistribution(e.target.value)}
              placeholder="总体分布容积"
              className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:border-transparent transition-all"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              清除率 Cl (L/h)
            </label>
            <input
              type="number"
              value={clearance}
              onChange={(e) => setClearance(e.target.value)}
              placeholder="总清除率"
              className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:border-transparent transition-all"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              生物利用度 F (0-1)
            </label>
            <input
              type="number"
              value={bioavailability}
              onChange={(e) => setBioavailability(e.target.value)}
              placeholder="1=静脉给药"
              step="0.01"
              className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:border-transparent transition-all"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              给药间隔 τ (h)
            </label>
            <input
              type="number"
              value={dosingInterval}
              onChange={(e) => setDosingInterval(e.target.value)}
              placeholder="每几小时"
              className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:border-transparent transition-all"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            计算选项
          </label>
          <button
            onClick={() => setShowLoading(!showLoading)}
            className={cn(
              "flex items-center gap-2 px-4 py-2.5 rounded-xl border transition-all text-sm",
              showLoading
                ? "bg-emerald-50 border-emerald-300 text-emerald-700"
                : "bg-gray-50 border-gray-200 text-gray-600 hover:border-gray-300"
            )}
          >
            <span className={cn(
              "w-4 h-4 rounded border-2 flex items-center justify-center",
              showLoading ? "border-emerald-500 bg-emerald-500" : "border-gray-300"
            )}>
              {showLoading && <span className="w-2 h-2 bg-white rounded-sm" />}
            </span>
            同时计算负荷剂量
          </button>
        </div>

        <button
          onClick={handleCalculate}
          className="w-full flex items-center justify-center gap-2 px-6 py-3.5 bg-gradient-to-r from-emerald-500 to-green-500 text-white font-semibold rounded-xl shadow-md hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300"
        >
          <Calculator className="w-5 h-5" />
          开始计算
        </button>

        {result && (
          <div className="space-y-4 pt-2">
            <div className="p-4 bg-gray-50 rounded-xl space-y-3">
              {showLoading && result.loadingDose !== undefined && (
                <CopyableResult
                  label="负荷剂量 LD"
                  value={`${formatNumber(result.loadingDose)} mg`}
                />
              )}
              <CopyableResult
                label="维持剂量 MD"
                value={`${formatNumber(result.maintenanceDose)} mg / 次`}
              />
              <div className="grid grid-cols-2 gap-3">
                <ResultItem
                  label="日总剂量"
                  value={formatNumber(result.dailyDose)}
                  unit="mg/日"
                  highlight
                  colorClass="bg-emerald-50"
                />
                <ResultItem
                  label="给药频次"
                  value={`每${dosingInterval}h`}
                />
              </div>
            </div>

            <FormulaDerivation
              formula={result.formula}
              derivation={result.derivation}
            />

            <div className="p-3 bg-amber-50 rounded-lg border border-amber-200">
              <p className="text-xs text-amber-800 leading-relaxed">
                <span className="font-semibold">温馨提示：</span>
                以上为理论计算值，实际临床需结合患者肝肾功能、合并用药、血药浓度监测结果综合判断。推荐从低剂量开始，根据疗效和耐受性逐步调整。
              </p>
            </div>

            <div className="pt-2 border-t border-gray-100">
              <h3 className="text-sm font-semibold text-gray-700 mb-3">临床例题</h3>
              <div className="space-y-3">
                {doseCalculationExamples.map((example, index) => (
                  <ClinicalExampleCard key={index} example={example} />
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
