import { useState, useMemo, useRef } from "react";
import {
  AlertTriangle,
  User,
  Pill,
  Stethoscope,
  FileText,
  CheckCircle2,
  XCircle,
  RefreshCw,
  Download,
  BookOpen,
  Award,
  ChevronRight,
  Printer,
} from "lucide-react";
import { adrCases } from "@/data/adrCases";
import { ADRCase, ADRSeverity, CausalityAssessment } from "@/types";
import ADRReportForm from "@/components/ADR/ADRReportForm";
import ADRScoringResult from "@/components/ADR/ADRScoringResult";

const severityOptions: { value: ADRSeverity; label: string; description: string }[] = [
  { value: "mild", label: "轻度", description: "症状轻微，无需特殊治疗" },
  { value: "moderate", label: "中度", description: "症状明显，需要一般处理" },
  { value: "severe", label: "重度", description: "症状严重，危及生命或致残" },
  { value: "death", label: "死亡", description: "直接或间接导致患者死亡" },
];

const causalityOptions: { value: CausalityAssessment; label: string; description: string }[] = [
  { value: "definite", label: "肯定", description: "时间合理，反应类型已知，停药后缓解，再用药重现" },
  { value: "probable", label: "很可能", description: "时间合理，反应类型已知，停药后缓解，无再用药" },
  { value: "possible", label: "可能", description: "时间合理，反应类型已知，可能由患者疾病或其他药物引起" },
  { value: "conditional", label: "条件/待评价", description: "时间合理，但反应类型不明确，有待更多数据" },
  { value: "unlikely", label: "可能无关", description: "时间不合理，反应类型不符合，更可能由其他因素引起" },
  { value: "unassessable", label: "无法评价", description: "资料不全，无法判断因果关系" },
];

export default function ADRSimulation() {
  const [currentCase, setCurrentCase] = useState<ADRCase | null>(() => {
    const idx = Math.floor(Math.random() * adrCases.length);
    return adrCases[idx];
  });
  const [step, setStep] = useState<"learn" | "fill" | "result">("learn");
  const [userAnswer, setUserAnswer] = useState<{
    isADR: boolean | null;
    suspectedDrugs: string[];
    severity: ADRSeverity | null;
    causality: CausalityAssessment | null;
    summary: string;
  }>({
    isADR: null,
    suspectedDrugs: [],
    severity: null,
    causality: null,
    summary: "",
  });
  const [showForm, setShowForm] = useState(false);
  const formPrintRef = useRef<HTMLDivElement>(null);

  const randomizeCase = () => {
    const availableCases = adrCases.filter((c) => c.id !== currentCase?.id);
    const idx = Math.floor(Math.random() * availableCases.length);
    setCurrentCase(availableCases[idx]);
    setStep("learn");
    setUserAnswer({
      isADR: null,
      suspectedDrugs: [],
      severity: null,
      causality: null,
      summary: "",
    });
  };

  const toggleDrug = (drugName: string) => {
    setUserAnswer((prev) => ({
      ...prev,
      suspectedDrugs: prev.suspectedDrugs.includes(drugName)
        ? prev.suspectedDrugs.filter((d) => d !== drugName)
        : [...prev.suspectedDrugs, drugName],
    }));
  };

  const canSubmit = useMemo(() => {
    if (userAnswer.isADR === null) return false;
    if (userAnswer.isADR === true) {
      return (
        userAnswer.suspectedDrugs.length > 0 &&
        userAnswer.severity !== null &&
        userAnswer.causality !== null &&
        userAnswer.summary.trim().length > 10
      );
    }
    return userAnswer.causality !== null && userAnswer.summary.trim().length > 10;
  }, [userAnswer]);

  const handlePrintForm = () => {
    if (formPrintRef.current) {
      const printWindow = window.open("", "_blank");
      if (printWindow) {
        printWindow.document.write(`
          <!DOCTYPE html>
          <html>
          <head>
            <title>药物不良反应/事件报告表</title>
            <meta charset="UTF-8">
            <style>
              body { font-family: SimSun, serif; padding: 20px; }
              table { width: 100%; border-collapse: collapse; margin-bottom: 20px; }
              th, td { border: 1px solid #000; padding: 8px 12px; text-align: left; }
              th { background: #f0f0f0; }
              h1 { text-align: center; font-size: 22px; }
              h2 { font-size: 16px; margin: 20px 0 10px 0; border-left: 4px solid #333; padding-left: 10px; }
              .header-table td { border: none; }
              @media print { body { -webkit-print-color-adjust: exact; } }
            </style>
          </head>
          <body>
            ${formPrintRef.current.innerHTML}
            <script>
              window.onload = function() { window.print(); window.close(); }
            </script>
          </body>
          </html>
        `);
        printWindow.document.close();
      }
    }
  };

  if (!currentCase) return null;

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-rose-500 to-red-600 flex items-center justify-center shadow-lg">
            <AlertTriangle className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">药物不良反应（ADR）上报模拟</h1>
            <p className="text-gray-500 text-sm">培养识别和上报ADR的能力</p>
          </div>
        </div>
        <button
          onClick={randomizeCase}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white border border-gray-200 text-gray-700 hover:bg-gray-50 hover:border-gray-300 transition-all"
        >
          <RefreshCw className="w-4 h-4" />
          <span>换一个病例</span>
        </button>
      </div>

      <div className="flex items-center gap-4">
        {[
          { key: "learn", label: "病例研读", icon: BookOpen },
          { key: "fill", label: "填写上报", icon: FileText },
          { key: "result", label: "评分结果", icon: Award },
        ].map((s, idx) => {
          const Icon = s.icon;
          const isActive = step === s.key;
          const isPast =
            (s.key === "learn" && step !== "learn") ||
            (s.key === "fill" && step === "result");
          return (
            <div key={s.key} className="flex items-center gap-2 flex-1">
              <div
                className={`flex items-center gap-2 flex-1 px-4 py-3 rounded-xl transition-all ${
                  isActive
                    ? "bg-primary-50 text-primary-700 border-2 border-primary-300"
                    : isPast
                    ? "bg-green-50 text-green-700 border border-green-200"
                    : "bg-gray-50 text-gray-500 border border-gray-200"
                }`}
              >
                <div
                  className={`w-7 h-7 rounded-full flex items-center justify-center text-sm font-bold ${
                    isActive
                      ? "bg-primary-500 text-white"
                      : isPast
                      ? "bg-green-500 text-white"
                      : "bg-gray-200 text-gray-600"
                  }`}
                >
                  {isPast ? <CheckCircle2 className="w-4 h-4" /> : idx + 1}
                </div>
                <Icon className="w-4 h-4" />
                <span className="font-medium">{s.label}</span>
              </div>
              {idx < 2 && <ChevronRight className="w-5 h-5 text-gray-300" />}
            </div>
          );
        })}
      </div>

      {step === "learn" && (
        <div className="space-y-6">
          <div className="bg-white rounded-2xl border border-gray-100 p-6 md:p-8 shadow-sm">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl bg-rose-50 flex items-center justify-center">
                <Stethoscope className="w-5 h-5 text-rose-600" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-900">{currentCase.title}</h2>
                <p className="text-sm text-gray-500">请仔细阅读以下病例描述</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <div className="bg-gray-50 rounded-xl p-4">
                <div className="flex items-center gap-2 mb-2">
                  <User className="w-4 h-4 text-gray-500" />
                  <span className="text-sm font-medium text-gray-600">患者信息</span>
                </div>
                <div className="space-y-1 text-sm text-gray-700">
                  <p>
                    年龄：<span className="font-medium">{currentCase.patientInfo.age}岁</span>
                  </p>
                  <p>
                    性别：<span className="font-medium">{currentCase.patientInfo.gender === "male" ? "男" : "女"}</span>
                  </p>
                  {currentCase.patientInfo.weight && (
                    <p>
                      体重：<span className="font-medium">{currentCase.patientInfo.weight}kg</span>
                    </p>
                  )}
                </div>
              </div>
              <div className="bg-gray-50 rounded-xl p-4">
                <div className="flex items-center gap-2 mb-2">
                  <AlertTriangle className="w-4 h-4 text-gray-500" />
                  <span className="text-sm font-medium text-gray-600">过敏史</span>
                </div>
                <p className="text-sm text-gray-700">
                  {currentCase.patientInfo.allergies && currentCase.patientInfo.allergies.length > 0
                    ? currentCase.patientInfo.allergies.join("、")
                    : "无"}
                </p>
              </div>
              <div className="bg-gray-50 rounded-xl p-4">
                <div className="flex items-center gap-2 mb-2">
                  <BookOpen className="w-4 h-4 text-gray-500" />
                  <span className="text-sm font-medium text-gray-600">既往病史</span>
                </div>
                <p className="text-sm text-gray-700">
                  {currentCase.patientInfo.medicalHistory && currentCase.patientInfo.medicalHistory.length > 0
                    ? currentCase.patientInfo.medicalHistory.join("、")
                    : "无特殊"}
                </p>
              </div>
            </div>

            <div className="mb-6">
              <h3 className="text-sm font-semibold text-gray-800 mb-2">病例描述</h3>
              <div className="bg-gradient-to-br from-gray-50 to-white rounded-xl p-5 border border-gray-100">
                <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                  {currentCase.caseDescription}
                </p>
              </div>
            </div>

            <div className="mb-6">
              <h3 className="text-sm font-semibold text-gray-800 mb-3">主要症状/体征</h3>
              <div className="flex flex-wrap gap-2">
                {currentCase.symptoms.map((symptom, idx) => (
                  <span
                    key={idx}
                    className="inline-flex items-center px-3 py-1.5 rounded-full text-sm bg-rose-50 text-rose-700 border border-rose-100"
                  >
                    {symptom}
                  </span>
                ))}
              </div>
            </div>

            <div>
              <h3 className="text-sm font-semibold text-gray-800 mb-3">用药情况</h3>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-gray-50">
                      <th className="text-left px-4 py-3 font-semibold text-gray-700 rounded-l-xl">药物名称</th>
                      <th className="text-left px-4 py-3 font-semibold text-gray-700">剂量</th>
                      <th className="text-left px-4 py-3 font-semibold text-gray-700">频次</th>
                      <th className="text-left px-4 py-3 font-semibold text-gray-700">疗程</th>
                      <th className="text-left px-4 py-3 font-semibold text-gray-700 rounded-r-xl">适应症</th>
                    </tr>
                  </thead>
                  <tbody>
                    {currentCase.medicationsTaken.map((med, idx) => (
                      <tr key={idx} className="border-t border-gray-100 hover:bg-gray-50 transition-colors">
                        <td className="px-4 py-3 font-medium text-gray-900">
                          <div className="flex items-center gap-2">
                            <Pill className="w-4 h-4 text-primary-500" />
                            {med.name}
                          </div>
                        </td>
                        <td className="px-4 py-3 text-gray-700">{med.dose}</td>
                        <td className="px-4 py-3 text-gray-700">{med.frequency}</td>
                        <td className="px-4 py-3 text-gray-700">{med.duration}</td>
                        <td className="px-4 py-3 text-gray-700">{med.indication}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          <div className="flex justify-end">
            <button
              onClick={() => setStep("fill")}
              className="flex items-center gap-2 px-8 py-3.5 rounded-xl bg-gradient-to-r from-primary-500 to-accent-500 text-white font-semibold shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all"
            >
              <FileText className="w-5 h-5" />
              开始填写上报
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      )}

      {step === "fill" && (
        <div className="space-y-6">
          <div className="bg-white rounded-2xl border border-gray-100 p-6 md:p-8 shadow-sm space-y-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 rounded-lg bg-primary-500 text-white flex items-center justify-center text-sm font-bold">
                  1
                </div>
                <h3 className="text-lg font-bold text-gray-900">是否为药物不良反应？</h3>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <button
                  onClick={() =>
                    setUserAnswer((prev) => ({ ...prev, isADR: true }))
                  }
                  className={`relative p-5 rounded-xl border-2 text-left transition-all ${
                    userAnswer.isADR === true
                      ? "border-green-500 bg-green-50"
                      : "border-gray-200 hover:border-gray-300 bg-white"
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <CheckCircle2
                      className={`w-6 h-6 flex-shrink-0 ${
                        userAnswer.isADR === true ? "text-green-600" : "text-gray-400"
                      }`}
                    />
                    <div>
                      <p
                        className={`font-semibold ${
                          userAnswer.isADR === true ? "text-green-700" : "text-gray-800"
                        }`}
                      >
                        是，判断为ADR
                      </p>
                      <p className="text-sm text-gray-500 mt-1">
                        该事件与药物使用存在合理关联
                      </p>
                    </div>
                  </div>
                </button>
                <button
                  onClick={() =>
                    setUserAnswer((prev) => ({
                      ...prev,
                      isADR: false,
                      suspectedDrugs: [],
                      severity: null,
                    }))
                  }
                  className={`relative p-5 rounded-xl border-2 text-left transition-all ${
                    userAnswer.isADR === false
                      ? "border-orange-500 bg-orange-50"
                      : "border-gray-200 hover:border-gray-300 bg-white"
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <XCircle
                      className={`w-6 h-6 flex-shrink-0 ${
                        userAnswer.isADR === false ? "text-orange-600" : "text-gray-400"
                      }`}
                    />
                    <div>
                      <p
                        className={`font-semibold ${
                          userAnswer.isADR === false ? "text-orange-700" : "text-gray-800"
                        }`}
                      >
                        否，非药物所致
                      </p>
                      <p className="text-sm text-gray-500 mt-1">
                        更可能由疾病进展、其他因素引起
                      </p>
                    </div>
                  </div>
                </button>
              </div>
            </div>

            {userAnswer.isADR === true && (
              <>
                <div>
                  <div className="flex items-center gap-2 mb-4">
                    <div className="w-8 h-8 rounded-lg bg-primary-500 text-white flex items-center justify-center text-sm font-bold">
                      2
                    </div>
                    <h3 className="text-lg font-bold text-gray-900">可疑药物（可多选）</h3>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {currentCase.medicationsTaken.map((med, idx) => {
                      const checked = userAnswer.suspectedDrugs.includes(med.name);
                      return (
                        <button
                          key={idx}
                          onClick={() => toggleDrug(med.name)}
                          className={`flex items-start gap-3 p-4 rounded-xl border-2 text-left transition-all ${
                            checked
                              ? "border-primary-500 bg-primary-50"
                              : "border-gray-200 hover:border-gray-300"
                          }`}
                        >
                          <div
                            className={`w-5 h-5 rounded border-2 flex items-center justify-center flex-shrink-0 mt-0.5 ${
                              checked ? "bg-primary-500 border-primary-500" : "border-gray-300"
                            }`}
                          >
                            {checked && <CheckCircle2 className="w-3.5 h-3.5 text-white" />}
                          </div>
                          <div>
                            <p
                              className={`font-medium ${
                                checked ? "text-primary-700" : "text-gray-800"
                              }`}
                            >
                              {med.name}
                            </p>
                            <p className="text-sm text-gray-500 mt-0.5">
                              {med.dose} / {med.frequency} / {med.duration}
                            </p>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div>
                  <div className="flex items-center gap-2 mb-4">
                    <div className="w-8 h-8 rounded-lg bg-primary-500 text-white flex items-center justify-center text-sm font-bold">
                      3
                    </div>
                    <h3 className="text-lg font-bold text-gray-900">严重程度分级</h3>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                    {severityOptions.map((opt) => {
                      const checked = userAnswer.severity === opt.value;
                      return (
                        <button
                          key={opt.value}
                          onClick={() =>
                            setUserAnswer((prev) => ({ ...prev, severity: opt.value }))
                          }
                          className={`p-4 rounded-xl border-2 text-left transition-all ${
                            checked
                              ? opt.value === "death"
                                ? "border-red-500 bg-red-50"
                                : opt.value === "severe"
                                ? "border-orange-500 bg-orange-50"
                                : opt.value === "moderate"
                                ? "border-amber-500 bg-amber-50"
                                : "border-green-500 bg-green-50"
                              : "border-gray-200 hover:border-gray-300"
                          }`}
                        >
                          <p
                            className={`font-semibold ${
                              checked
                                ? opt.value === "death"
                                  ? "text-red-700"
                                  : opt.value === "severe"
                                  ? "text-orange-700"
                                  : opt.value === "moderate"
                                  ? "text-amber-700"
                                  : "text-green-700"
                                : "text-gray-800"
                            }`}
                          >
                            {opt.label}
                          </p>
                          <p className="text-xs text-gray-500 mt-1">{opt.description}</p>
                        </button>
                      );
                    })}
                  </div>
                </div>
              </>
            )}

            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 rounded-lg bg-primary-500 text-white flex items-center justify-center text-sm font-bold">
                  {userAnswer.isADR === true ? 4 : 2}
                </div>
                <h3 className="text-lg font-bold text-gray-900">因果关系评价（WHO-UMC标准）</h3>
              </div>
              <div className="space-y-3">
                {causalityOptions.map((opt) => {
                  const checked = userAnswer.causality === opt.value;
                  return (
                    <button
                      key={opt.value}
                      onClick={() =>
                        setUserAnswer((prev) => ({ ...prev, causality: opt.value }))
                      }
                      className={`flex items-start gap-3 p-4 rounded-xl border-2 text-left w-full transition-all ${
                        checked ? "border-primary-500 bg-primary-50" : "border-gray-200 hover:border-gray-300"
                      }`}
                    >
                      <div
                        className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 mt-0.5 ${
                          checked ? "bg-primary-500 border-primary-500" : "border-gray-300"
                        }`}
                      >
                        {checked && <div className="w-2 h-2 rounded-full bg-white" />}
                      </div>
                      <div>
                        <p
                          className={`font-semibold ${
                            checked ? "text-primary-700" : "text-gray-800"
                          }`}
                        >
                          {opt.label}
                        </p>
                        <p className="text-sm text-gray-500 mt-0.5">{opt.description}</p>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 rounded-lg bg-primary-500 text-white flex items-center justify-center text-sm font-bold">
                  {userAnswer.isADR === true ? 5 : 3}
                </div>
                <h3 className="text-lg font-bold text-gray-900">上报摘要</h3>
              </div>
              <textarea
                value={userAnswer.summary}
                onChange={(e) =>
                  setUserAnswer((prev) => ({ ...prev, summary: e.target.value }))
                }
                placeholder="请简要描述事件经过、患者情况、用药情况、处理措施及结果（不少于10字）"
                rows={6}
                className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 resize-none transition-all text-gray-800"
              />
              <p className="text-xs text-gray-500 mt-2 text-right">
                已输入 {userAnswer.summary.length} 字
              </p>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <button
              onClick={() => setStep("learn")}
              className="flex items-center gap-2 px-6 py-3 rounded-xl bg-white border border-gray-200 text-gray-700 hover:bg-gray-50 transition-all"
            >
              返回研读病例
            </button>
            <button
              onClick={() => setStep("result")}
              disabled={!canSubmit}
              className={`flex items-center gap-2 px-8 py-3.5 rounded-xl font-semibold shadow-lg transition-all ${
                canSubmit
                  ? "bg-gradient-to-r from-primary-500 to-accent-500 text-white hover:shadow-xl hover:-translate-y-0.5"
                  : "bg-gray-200 text-gray-500 cursor-not-allowed"
              }`}
            >
              <Award className="w-5 h-5" />
              提交并查看评分
            </button>
          </div>
        </div>
      )}

      {step === "result" && (
        <div className="space-y-6">
          <ADRScoringResult currentCase={currentCase} userAnswer={userAnswer} />

          <div className="flex gap-4">
            <button
              onClick={() => setShowForm(true)}
              className="flex-1 flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-gradient-to-r from-sky-500 to-blue-600 text-white font-semibold shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all"
            >
              <FileText className="w-5 h-5" />
              生成正式ADR上报表格
            </button>
            <button
              onClick={randomizeCase}
              className="flex-1 flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-white border border-gray-200 text-gray-700 hover:bg-gray-50 transition-all"
            >
              <RefreshCw className="w-5 h-5" />
              下一病例
            </button>
          </div>
        </div>
      )}

      {showForm && currentCase && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-5xl w-full max-h-[90vh] overflow-hidden">
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
              <div>
                <h3 className="text-xl font-bold text-gray-900">药物不良反应/事件报告表</h3>
                <p className="text-sm text-gray-500">参照国家药品不良反应监测中心标准格式</p>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={handlePrintForm}
                  className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r from-blue-500 to-blue-600 text-white font-medium hover:shadow-lg transition-all"
                >
                  <Download className="w-4 h-4" />
                  下载 / 打印PDF
                </button>
                <button
                  onClick={() => setShowForm(false)}
                  className="p-2 rounded-lg text-gray-500 hover:bg-gray-100 transition-colors"
                >
                  <XCircle className="w-5 h-5" />
                </button>
              </div>
            </div>
            <div className="overflow-y-auto max-h-[calc(90vh-80px)]">
              <div ref={formPrintRef}>
                <ADRReportForm currentCase={currentCase} userAnswer={userAnswer} />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
