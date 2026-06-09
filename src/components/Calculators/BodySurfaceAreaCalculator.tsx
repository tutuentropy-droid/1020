import { useState } from "react";
import { Ruler, Calculator } from "lucide-react";
import {
  ResultItem,
  CopyableResult,
  FormulaDerivation,
  ClinicalExampleCard,
} from "./Shared";
import { calculateBodySurfaceArea, formatNumber } from "@/utils/calculators";
import { bodySurfaceAreaExamples } from "@/data/tdmDrugs";

export default function BodySurfaceAreaCalculator() {
  const [height, setHeight] = useState<string>("160");
  const [weight, setWeight] = useState<string>("58");
  const [result, setResult] = useState<ReturnType<
    typeof calculateBodySurfaceArea
  > | null>(null);

  const handleCalculate = () => {
    const h = parseFloat(height);
    const w = parseFloat(weight);
    if (isNaN(h) || isNaN(w) || h <= 0 || w <= 0) {
      return;
    }
    setResult(calculateBodySurfaceArea({ height: h, weight: w }));
  };

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
      <div className="p-5 bg-gradient-to-r from-cyan-50 to-teal-50 border-b border-gray-100">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-cyan-500 to-teal-500 flex items-center justify-center shadow-md">
            <Ruler className="w-6 h-6 text-white" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-900">
              体表面积计算器
            </h2>
            <p className="text-sm text-gray-500 mt-0.5">
              Du Bois公式，用于化疗药、生物制剂剂量计算
            </p>
          </div>
        </div>
      </div>

      <div className="p-5 space-y-5">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              身高 (cm)
            </label>
            <input
              type="number"
              value={height}
              onChange={(e) => setHeight(e.target.value)}
              placeholder="输入身高"
              className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-transparent transition-all"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              体重 (kg)
            </label>
            <input
              type="number"
              value={weight}
              onChange={(e) => setWeight(e.target.value)}
              placeholder="输入体重"
              className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-transparent transition-all"
            />
          </div>
        </div>

        <button
          onClick={handleCalculate}
          className="w-full flex items-center justify-center gap-2 px-6 py-3.5 bg-gradient-to-r from-cyan-500 to-teal-500 text-white font-semibold rounded-xl shadow-md hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300"
        >
          <Calculator className="w-5 h-5" />
          开始计算
        </button>

        {result && (
          <div className="space-y-4 pt-2">
            <div className="p-4 bg-gray-50 rounded-xl space-y-3">
              <CopyableResult
                label="体表面积 (BSA)"
                value={`${formatNumber(result.bsa)} m²`}
              />
              <div className="grid grid-cols-2 gap-3">
                <ResultItem label="计算方法" value={result.method} />
                <ResultItem
                  label="Mosteller验证"
                  value={formatNumber(
                    Math.sqrt(
                      (parseFloat(height) * parseFloat(weight)) / 3600
                    )
                  )}
                  unit="m²"
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
                体表面积与代谢速率、心输出量等生理参数相关性优于体重，是化疗药物、生物制剂、免疫抑制剂等剂量计算的金标准。BSA异常高/低时需结合临床情况调整剂量。
              </p>
            </div>

            <div className="pt-2 border-t border-gray-100">
              <h3 className="text-sm font-semibold text-gray-700 mb-3">临床例题</h3>
              <div className="space-y-3">
                {bodySurfaceAreaExamples.map((example, index) => (
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
