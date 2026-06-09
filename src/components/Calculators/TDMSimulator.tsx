import { useState } from "react";
import { Activity, Calculator, AlertCircle, CheckCircle2, XCircle, Pill } from "lucide-react";
import {
  ResultItem,
  CopyableResult,
  FormulaDerivation,
  ClinicalExampleCard,
} from "./Shared";
import { simulateTDM, formatNumber } from "@/utils/calculators";
import { tdmDrugs, tdmSimulationExamples } from "@/data/tdmDrugs";
import { cn } from "@/lib/utils";

export default function TDMSimulator() {
  const [drugId, setDrugId] = useState<string>("2");
  const [dose, setDose] = useState<string>("0.125");
  const [dosingInterval, setDosingInterval] = useState<string>("24");
  const [administrationTime, setAdministrationTime] = useState<string>("8");
  const [sampleTime, setSampleTime] = useState<string>("16");
  const [infusionDuration, setInfusionDuration] = useState<string>("0.5");
  const [dosesGiven, setDosesGiven] = useState<string>("14");
  const [result, setResult] = useState<ReturnType<typeof simulateTDM> | null>(null);

  const selectedDrug = tdmDrugs.find((d) => d.id === drugId);

  const handleCalculate = () => {
    const d = parseFloat(dose);
    const tau = parseFloat(dosingInterval);
    const at = parseFloat(administrationTime);
    const st = parseFloat(sampleTime);
    const id = parseFloat(infusionDuration);
    const dg = parseInt(dosesGiven);

    if (
      isNaN(d) || isNaN(tau) || isNaN(at) || isNaN(st) || isNaN(id) || isNaN(dg) ||
      d <= 0 || tau <= 0 || id <= 0 || dg < 1
    ) {
      return;
    }

    setResult(
      simulateTDM({
        drugId,
        dose: d,
        dosingInterval: tau,
        administrationTime: at,
        sampleTime: st,
        infusionDuration: id,
        dosesGiven: dg,
      })
    );
  };

  const getStatusIcon = () => {
    if (!result) return null;
    if (result.status === "therapeutic") {
      return <CheckCircle2 className="w-5 h-5 text-green-600" />;
    }
    if (result.status === "toxic") {
      return <XCircle className="w-5 h-5 text-red-600" />;
    }
    return <AlertCircle className="w-5 h-5 text-blue-600" />;
  };

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
      <div className="p-5 bg-gradient-to-r from-orange-50 to-amber-50 border-b border-gray-100">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-orange-500 to-amber-500 flex items-center justify-center shadow-md">
            <Activity className="w-6 h-6 text-white" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-900">
              治疗药物监测（TDM）模拟
            </h2>
            <p className="text-sm text-gray-500 mt-0.5">
              基于药代动力学参数预测血药浓度并解读监测结果
            </p>
          </div>
        </div>
      </div>

      <div className="p-5 space-y-5">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            选择药物
          </label>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
            {tdmDrugs.map((drug) => (
              <button
                key={drug.id}
                onClick={() => setDrugId(drug.id)}
                className={cn(
                  "flex items-center gap-1.5 px-3 py-2.5 rounded-xl border text-sm transition-all",
                  drugId === drug.id
                    ? "border-orange-500 bg-orange-50 text-orange-700 font-medium"
                    : "border-gray-200 bg-gray-50 text-gray-600 hover:border-gray-300"
                )}
              >
                <Pill className="w-3.5 h-3.5" />
                <span className="truncate">{drug.name}</span>
              </button>
            ))}
          </div>
          {selectedDrug && (
            <div className="mt-3 p-3 bg-gradient-to-r from-orange-50 to-amber-50 rounded-xl border border-orange-100">
              <div className="flex items-start gap-2">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-orange-400 to-amber-400 flex items-center justify-center flex-shrink-0">
                  <Pill className="w-4 h-4 text-white" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-sm font-semibold text-gray-900">
                      {selectedDrug.name}
                    </span>
                    <span className="text-xs px-2 py-0.5 rounded-full bg-white text-orange-700 border border-orange-200">
                      {selectedDrug.category}
                    </span>
                  </div>
                  <p className="text-xs text-gray-600 mt-1 leading-relaxed">
                    {selectedDrug.description}
                  </p>
                  <div className="mt-2 grid grid-cols-2 gap-2 text-xs">
                    <div className="text-gray-600">
                      治疗窗：<span className="font-medium text-orange-700">{selectedDrug.therapeuticRange} {selectedDrug.unit}</span>
                    </div>
                    <div className="text-gray-600">
                      半衰期：<span className="font-medium text-gray-900">{selectedDrug.halfLife} h</span>
                    </div>
                    <div className="text-gray-600">
                      中毒浓度：<span className="font-medium text-red-600">{selectedDrug.toxicLevel} {selectedDrug.unit}</span>
                    </div>
                    <div className="text-gray-600">
                      生物利用度：<span className="font-medium text-gray-900">{(selectedDrug.bioavailability * 100).toFixed(0)}%</span>
                    </div>
                  </div>
                  <div className="mt-2 space-y-1">
                    <div className="text-xs font-medium text-gray-700">监测要点：</div>
                    {selectedDrug.monitoringPoints.slice(0, 2).map((p, i) => (
                      <div key={i} className="text-xs text-gray-600 pl-3 border-l-2 border-orange-200">
                        {p}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              给药剂量 (mg)
            </label>
            <input
              type="number"
              value={dose}
              onChange={(e) => setDose(e.target.value)}
              placeholder="单次剂量"
              step="0.01"
              className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent transition-all"
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
              className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent transition-all"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              已给药次数
            </label>
            <input
              type="number"
              value={dosesGiven}
              onChange={(e) => setDosesGiven(e.target.value)}
              placeholder="已给多少剂"
              className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent transition-all"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              给药时间 (h，24h制)
            </label>
            <input
              type="number"
              value={administrationTime}
              onChange={(e) => setAdministrationTime(e.target.value)}
              placeholder="如8表示8:00"
              className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent transition-all"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              采血时间 (h，24h制)
            </label>
            <input
              type="number"
              value={sampleTime}
              onChange={(e) => setSampleTime(e.target.value)}
              placeholder="如16表示16:00"
              className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent transition-all"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              输注时长 (h)
            </label>
            <input
              type="number"
              value={infusionDuration}
              onChange={(e) => setInfusionDuration(e.target.value)}
              placeholder="静滴时长"
              step="0.1"
              className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent transition-all"
            />
          </div>
        </div>

        <button
          onClick={handleCalculate}
          className="w-full flex items-center justify-center gap-2 px-6 py-3.5 bg-gradient-to-r from-orange-500 to-amber-500 text-white font-semibold rounded-xl shadow-md hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300"
        >
          <Calculator className="w-5 h-5" />
          模拟预测
        </button>

        {result && (
          <div className="space-y-4 pt-2">
            <div className="p-4 bg-gray-50 rounded-xl space-y-3">
              <CopyableResult
                label="预测血药浓度"
                value={`${formatNumber(result.predictedConcentration, 2)} ${selectedDrug?.unit || ''}`}
              />
              <div className={cn(
                "px-4 py-3 rounded-xl border flex items-center gap-2",
                result.statusColor
              )}>
                {getStatusIcon()}
                <div>
                  <div className="text-sm font-bold">{result.interpretation}</div>
                  <div className="text-xs opacity-80 mt-0.5">
                    治疗窗：{selectedDrug?.therapeuticRange} {selectedDrug?.unit}
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <ResultItem label="距离给药" value={`${Math.abs(parseFloat(sampleTime) - parseFloat(administrationTime))}`} unit="h" />
                <ResultItem label="稳态判断" value={parseInt(dosesGiven) >= 4 ? "已达稳态" : "未达稳态"} />
              </div>
            </div>

            <FormulaDerivation
              formula={result.formula}
              derivation={result.derivation}
            />

            <div className="p-4 bg-gray-50 rounded-xl border border-gray-200">
              <div className="flex items-center gap-2 mb-3">
                <Activity className="w-4 h-4 text-orange-600" />
                <span className="text-sm font-semibold text-gray-800">临床建议</span>
              </div>
              <ul className="space-y-1.5">
                {result.recommendations.map((rec, index) => (
                  <li key={index} className="text-sm text-gray-700 flex items-start gap-2">
                    <span className="text-orange-500 mt-1">•</span>
                    <span>{rec}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="pt-2 border-t border-gray-100">
              <h3 className="text-sm font-semibold text-gray-700 mb-3">临床例题</h3>
              <div className="space-y-3">
                {tdmSimulationExamples.map((example, index) => (
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
