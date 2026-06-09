import { useState } from "react";
import { Baby, Calculator } from "lucide-react";
import {
  ResultItem,
  CopyableResult,
  FormulaDerivation,
  ClinicalExampleCard,
} from "./Shared";
import { calculatePediatricDose, formatNumber } from "@/utils/calculators";
import { pediatricDoseExamples } from "@/data/tdmDrugs";

export default function PediatricDoseCalculator() {
  const [adultDose, setAdultDose] = useState<string>("500");
  const [childWeight, setChildWeight] = useState<string>("18");
  const [result, setResult] = useState<ReturnType<
    typeof calculatePediatricDose
  > | null>(null);

  const handleCalculate = () => {
    const ad = parseFloat(adultDose);
    const cw = parseFloat(childWeight);
    if (isNaN(ad) || isNaN(cw) || ad <= 0 || cw <= 0 || cw > 70) {
      return;
    }
    setResult(calculatePediatricDose({ adultDose: ad, childWeight: cw }));
  };

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
      <div className="p-5 bg-gradient-to-r from-pink-50 to-rose-50 border-b border-gray-100">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-pink-500 to-rose-500 flex items-center justify-center shadow-md">
            <Baby className="w-6 h-6 text-white" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-900">
              儿童剂量计算器
            </h2>
            <p className="text-sm text-gray-500 mt-0.5">
              按体重比例换算儿童用药剂量（Clark法则）
            </p>
          </div>
        </div>
      </div>

      <div className="p-5 space-y-5">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              成人剂量 (mg)
            </label>
            <input
              type="number"
              value={adultDose}
              onChange={(e) => setAdultDose(e.target.value)}
              placeholder="输入成人单次剂量"
              className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-pink-400 focus:border-transparent transition-all"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              儿童体重 (kg)
            </label>
            <input
              type="number"
              value={childWeight}
              onChange={(e) => setChildWeight(e.target.value)}
              placeholder="输入儿童体重（≤70kg）"
              className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-pink-400 focus:border-transparent transition-all"
            />
          </div>
        </div>

        <button
          onClick={handleCalculate}
          className="w-full flex items-center justify-center gap-2 px-6 py-3.5 bg-gradient-to-r from-pink-500 to-rose-500 text-white font-semibold rounded-xl shadow-md hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300"
        >
          <Calculator className="w-5 h-5" />
          开始计算
        </button>

        {result && (
          <div className="space-y-4 pt-2">
            <div className="p-4 bg-gray-50 rounded-xl space-y-3">
              <CopyableResult
                label="儿童单次剂量"
                value={`${formatNumber(result.childDose)} mg`}
              />
              <div className="grid grid-cols-2 gap-3">
                <ResultItem
                  label="换算比例"
                  value={formatNumber(parseFloat(childWeight) / 70, 3)}
                  unit="倍"
                />
                <ResultItem
                  label="成人剂量参考"
                  value={adultDose}
                  unit="mg"
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
                本计算器基于Clark法则简化换算，仅供学习参考。实际临床中应优先采用mg/kg剂量法，并根据药品说明书、儿童年龄、肝肾功能等综合判断，遵医嘱用药。
              </p>
            </div>

            <div className="pt-2 border-t border-gray-100">
              <h3 className="text-sm font-semibold text-gray-700 mb-3">临床例题</h3>
              <div className="space-y-3">
                {pediatricDoseExamples.map((example, index) => (
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
