import { useState } from "react";
import { FlaskConical, Calculator, User, UserRound } from "lucide-react";
import {
  ResultItem,
  CopyableResult,
  FormulaDerivation,
  ClinicalExampleCard,
} from "./Shared";
import { calculateCreatinineClearance, formatNumber } from "@/utils/calculators";
import { creatinineClearanceExamples } from "@/data/tdmDrugs";
import { Gender, CreatinineUnit } from "@/types";
import { cn } from "@/lib/utils";

export default function CreatinineClearanceCalculator() {
  const [age, setAge] = useState<string>("72");
  const [weight, setWeight] = useState<string>("55");
  const [gender, setGender] = useState<Gender>("female");
  const [creatinine, setCreatinine] = useState<string>("1.2");
  const [unit, setUnit] = useState<CreatinineUnit>("mg/dL");
  const [result, setResult] = useState<ReturnType<
    typeof calculateCreatinineClearance
  > | null>(null);

  const handleCalculate = () => {
    const a = parseFloat(age);
    const w = parseFloat(weight);
    const c = parseFloat(creatinine);
    if (isNaN(a) || isNaN(w) || isNaN(c) || a <= 0 || w <= 0 || c <= 0) {
      return;
    }
    setResult(
      calculateCreatinineClearance({
        age: a,
        weight: w,
        gender,
        creatinine: c,
        unit,
      })
    );
  };

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
      <div className="p-5 bg-gradient-to-r from-violet-50 to-purple-50 border-b border-gray-100">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-violet-500 to-purple-500 flex items-center justify-center shadow-md">
            <FlaskConical className="w-6 h-6 text-white" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-900">
              肌酐清除率估算
            </h2>
            <p className="text-sm text-gray-500 mt-0.5">
              Cockcroft-Gault公式，评估肾功能指导用药
            </p>
          </div>
        </div>
      </div>

      <div className="p-5 space-y-5">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              年龄 (岁)
            </label>
            <input
              type="number"
              value={age}
              onChange={(e) => setAge(e.target.value)}
              placeholder="输入年龄"
              className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-violet-400 focus:border-transparent transition-all"
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
              className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-violet-400 focus:border-transparent transition-all"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            性别
          </label>
          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={() => setGender("male")}
              className={cn(
                "flex items-center justify-center gap-2 px-4 py-3 rounded-xl border-2 transition-all",
                gender === "male"
                  ? "border-violet-500 bg-violet-50 text-violet-700"
                  : "border-gray-200 bg-gray-50 text-gray-600 hover:border-gray-300"
              )}
            >
              <User className="w-5 h-5" />
              <span className="font-medium">男性</span>
            </button>
            <button
              onClick={() => setGender("female")}
              className={cn(
                "flex items-center justify-center gap-2 px-4 py-3 rounded-xl border-2 transition-all",
                gender === "female"
                  ? "border-violet-500 bg-violet-50 text-violet-700"
                  : "border-gray-200 bg-gray-50 text-gray-600 hover:border-gray-300"
              )}
            >
              <UserRound className="w-5 h-5" />
              <span className="font-medium">女性 (×0.85)</span>
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              血清肌酐值
            </label>
            <input
              type="number"
              value={creatinine}
              onChange={(e) => setCreatinine(e.target.value)}
              placeholder="输入肌酐值"
              className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-violet-400 focus:border-transparent transition-all"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              单位
            </label>
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => setUnit("mg/dL")}
                className={cn(
                  "px-4 py-3 rounded-xl border-2 text-sm font-medium transition-all",
                  unit === "mg/dL"
                    ? "border-violet-500 bg-violet-50 text-violet-700"
                    : "border-gray-200 bg-gray-50 text-gray-600 hover:border-gray-300"
                )}
              >
                mg/dL
              </button>
              <button
                onClick={() => setUnit("μmol/L")}
                className={cn(
                  "px-4 py-3 rounded-xl border-2 text-sm font-medium transition-all",
                  unit === "μmol/L"
                    ? "border-violet-500 bg-violet-50 text-violet-700"
                    : "border-gray-200 bg-gray-50 text-gray-600 hover:border-gray-300"
                )}
              >
                μmol/L
              </button>
            </div>
          </div>
        </div>

        <button
          onClick={handleCalculate}
          className="w-full flex items-center justify-center gap-2 px-6 py-3.5 bg-gradient-to-r from-violet-500 to-purple-500 text-white font-semibold rounded-xl shadow-md hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300"
        >
          <Calculator className="w-5 h-5" />
          开始计算
        </button>

        {result && (
          <div className="space-y-4 pt-2">
            <div className="p-4 bg-gray-50 rounded-xl space-y-3">
              <CopyableResult
                label="肌酐清除率 (CrCl)"
                value={`${formatNumber(result.crcl)} mL/min`}
              />
              <div className="grid grid-cols-2 gap-3">
                <ResultItem
                  label="估算肾小球滤过率"
                  value={formatNumber(result.egfr)}
                  unit="mL/min/1.73m²"
                />
                <ResultItem label="性别校正系数" value={gender === "female" ? "0.85" : "1.00"} />
              </div>
              <div className={cn(
                "px-4 py-3 rounded-xl border text-center",
                result.stageColor
              )}>
                <div className="text-sm font-bold">{result.stage}</div>
              </div>
            </div>

            <FormulaDerivation
              formula={result.formula}
              derivation={result.derivation}
            />

            <div className="p-3 bg-amber-50 rounded-lg border border-amber-200">
              <p className="text-xs text-amber-800 leading-relaxed">
                <span className="font-semibold">温馨提示：</span>
                Cockcroft-Gault公式适用于体型稳定、肌肉量正常的患者。对于肥胖、水肿、肌肉萎缩患者，建议使用理想体重或校正体重。单位换算：1 mg/dL = 88.4 μmol/L。
              </p>
            </div>

            <div className="pt-2 border-t border-gray-100">
              <h3 className="text-sm font-semibold text-gray-700 mb-3">临床例题</h3>
              <div className="space-y-3">
                {creatinineClearanceExamples.map((example, index) => (
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
