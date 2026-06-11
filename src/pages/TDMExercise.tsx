import { useState, useEffect, useRef, useMemo, useCallback } from "react";
import * as echarts from "echarts";
import type { EChartsOption } from "echarts";
import {
  Activity,
  CheckCircle2,
  XCircle,
  AlertCircle,
  ChevronRight,
  RotateCcw,
  Lightbulb,
  Pill,
  User,
  Beaker,
  Syringe,
  Clock,
  TrendingUp,
  ArrowRight,
  Target,
  BookOpen,
} from "lucide-react";
import { tdmExerciseCases } from "@/data/tdmExerciseCases";
import { tdmDrugs } from "@/data/tdmDrugs";
import { generatePKCurve, formatNumber } from "@/utils/calculators";
import { cn } from "@/lib/utils";
import type { TDMExerciseCase } from "@/types";

type ExercisePhase = "case" | "judgment" | "adjustment" | "curve" | "analysis";

export default function TDMExercise() {
  const [selectedCaseId, setSelectedCaseId] = useState<string | null>(null);
  const [phase, setPhase] = useState<ExercisePhase>("case");
  const [selectedJudgment, setSelectedJudgment] = useState<string | null>(null);
  const [judgmentSubmitted, setJudgmentSubmitted] = useState(false);
  const [selectedAdjustment, setSelectedAdjustment] = useState<string | null>(null);
  const [adjustmentSubmitted, setAdjustmentSubmitted] = useState(false);
  const [sliderDose, setSliderDose] = useState(0);
  const [sliderInterval, setSliderInterval] = useState(0);
  const chartRef = useRef<HTMLDivElement>(null);
  const chartInstance = useRef<echarts.ECharts | null>(null);

  const currentCase = tdmExerciseCases.find((c) => c.id === selectedCaseId);
  const currentDrug = currentCase
    ? tdmDrugs.find((d) => d.id === currentCase.drugId)
    : null;

  useEffect(() => {
    if (currentCase) {
      setSliderDose(currentCase.currentDose);
      setSliderInterval(currentCase.currentInterval);
    }
  }, [currentCase]);

  const curveData = useMemo(() => {
    if (!currentCase || !currentDrug) return null;
    return generatePKCurve({
      drugId: currentCase.drugId,
      dose: sliderDose,
      dosingInterval: sliderInterval,
      numDoses: 5,
      infusionDuration: currentCase.infusionDuration || 0.5,
      weight: currentCase.patient.weight,
    });
  }, [currentCase, currentDrug, sliderDose, sliderInterval]);

  const originalCurveData = useMemo(() => {
    if (!currentCase || !currentDrug) return null;
    return generatePKCurve({
      drugId: currentCase.drugId,
      dose: currentCase.currentDose,
      dosingInterval: currentCase.currentInterval,
      numDoses: 5,
      infusionDuration: currentCase.infusionDuration || 0.5,
      weight: currentCase.patient.weight,
    });
  }, [currentCase, currentDrug]);

  const renderChart = useCallback(() => {
    if (!chartRef.current || !curveData || !currentDrug || !currentCase) return;

    if (!chartInstance.current) {
      chartInstance.current = echarts.init(chartRef.current);
    }

    const isOriginal =
      sliderDose === currentCase.currentDose &&
      sliderInterval === currentCase.currentInterval;

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const series: any[] = [
      {
        name: isOriginal ? "血药浓度" : "调整后浓度",
        type: "line",
        data: curveData.points.map((p) => [p.time, p.concentration]),
        smooth: true,
        symbol: "none",
        lineStyle: {
          width: 2.5,
          color: isOriginal ? "#3b82f6" : "#f97316",
        },
        areaStyle: {
          color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
            { offset: 0, color: isOriginal ? "rgba(59,130,246,0.2)" : "rgba(249,115,22,0.2)" },
            { offset: 1, color: "rgba(255,255,255,0)" },
          ]),
        },
      },
    ];

    if (!isOriginal && originalCurveData) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      series.unshift({
        name: "原始方案",
        type: "line",
        data: originalCurveData.points.map((p) => [p.time, p.concentration]),
        smooth: true,
        symbol: "none",
        lineStyle: {
          width: 1.5,
          color: "#3b82f6",
          type: "dashed",
        },
      } as any); // eslint-disable-line @typescript-eslint/no-explicit-any
    }

    const option: EChartsOption = {
      tooltip: {
        trigger: "axis",
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        formatter: (params: any) => {
          const time = params[0].axisValue;
          let html = `<div style="font-size:12px"><b>时间：${time}h</b><br/>`;
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          params.forEach((p: any) => {
            html += `${p.marker} ${p.seriesName}：<b>${formatNumber(p.value[1], 2)}</b> ${currentDrug.unit}<br/>`;
          });
          html += "</div>";
          return html;
        },
      },
      legend: {
        data: !isOriginal ? ["原始方案", "调整后浓度"] : ["血药浓度"],
        top: 5,
        textStyle: { fontSize: 11 },
      },
      grid: {
        left: 60,
        right: 20,
        top: 40,
        bottom: 40,
      },
      xAxis: {
        type: "value",
        name: "时间 (h)",
        nameTextStyle: { fontSize: 11 },
        axisLabel: { fontSize: 10 },
        splitLine: { show: false },
      },
      yAxis: {
        type: "value",
        name: `浓度 (${currentDrug.unit})`,
        nameTextStyle: { fontSize: 11 },
        axisLabel: { fontSize: 10 },
      },
      series: series as any, // eslint-disable-line @typescript-eslint/no-explicit-any
      visualMap: {
        show: false,
        pieces: [
          {
            gt: currentDrug.toxicLevel,
            color: "#ef4444",
          },
        ],
      },
    };

    chartInstance.current.setOption(option, true);
  }, [curveData, originalCurveData, currentDrug, currentCase, sliderDose, sliderInterval]);

  useEffect(() => {
    if (phase === "curve" || phase === "analysis") {
      const timer = setTimeout(() => {
        renderChart();
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [phase, renderChart]);

  useEffect(() => {
    if (phase === "curve" || phase === "analysis") {
      renderChart();
    }
  }, [sliderDose, sliderInterval, renderChart, phase]);

  useEffect(() => {
    const handleResize = () => {
      chartInstance.current?.resize();
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const resetExercise = () => {
    setSelectedCaseId(null);
    setPhase("case");
    setSelectedJudgment(null);
    setJudgmentSubmitted(false);
    setSelectedAdjustment(null);
    setAdjustmentSubmitted(false);
    setSliderDose(0);
    setSliderInterval(0);
  };

  const startCase = (c: TDMExerciseCase) => {
    setSelectedCaseId(c.id);
    setPhase("judgment");
    setSelectedJudgment(null);
    setJudgmentSubmitted(false);
    setSelectedAdjustment(null);
    setAdjustmentSubmitted(false);
  };

  const getDifficultyColor = (d: string) => {
    if (d === "easy") return "bg-green-100 text-green-700 border-green-200";
    if (d === "medium") return "bg-amber-100 text-amber-700 border-amber-200";
    return "bg-red-100 text-red-700 border-red-200";
  };

  const getDifficultyLabel = (d: string) => {
    if (d === "easy") return "初级";
    if (d === "medium") return "中级";
    return "高级";
  };

  const getPhaseStep = () => {
    switch (phase) {
      case "judgment":
        return 1;
      case "adjustment":
        return 2;
      case "curve":
        return 3;
      case "analysis":
        return 4;
      default:
        return 0;
    }
  };

  const steps = [
    { label: "浓度判断", icon: Target },
    { label: "方案调整", icon: Syringe },
    { label: "曲线探索", icon: TrendingUp },
    { label: "专家解析", icon: BookOpen },
  ];

  if (!selectedCaseId) {
    return (
      <div className="space-y-8 animate-fade-in">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center shadow-lg">
            <Activity className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-900 font-serif">
              治疗窗窄药物模拟练习
            </h1>
            <p className="text-sm text-gray-500 mt-1">
              判断血药浓度、建议剂量调整、探索浓度-时间曲线
            </p>
          </div>
        </div>

        <div className="p-4 bg-gradient-to-r from-violet-50 to-purple-50 rounded-2xl border border-violet-100 flex items-start gap-3">
          <Lightbulb className="w-5 h-5 text-violet-600 mt-0.5 flex-shrink-0" />
          <div className="text-sm text-violet-800 leading-relaxed">
            <span className="font-semibold">练习目标：</span>
            掌握治疗窗窄药物的个体化给药原则。系统给出患者稳态血药浓度与剂量信息，你需要判断浓度是否在治疗窗内，并据此建议剂量调整方案。随后可通过交互式曲线探索不同剂量方案对血药浓度的影响。
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {tdmExerciseCases.map((c) => {
            const drug = tdmDrugs.find((d) => d.id === c.drugId);
            return (
              <button
                key={c.id}
                onClick={() => startCase(c)}
                className="text-left bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300 overflow-hidden group"
              >
                <div className="h-2 bg-gradient-to-r from-violet-500 to-purple-500" />
                <div className="p-5">
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-xs px-2 py-0.5 rounded-full border font-medium" style={{
                          backgroundColor: drug?.category.includes("抗生素") ? "rgba(249,115,22,0.1)" : "rgba(139,92,246,0.1)",
                          color: drug?.category.includes("抗生素") ? "#c2410c" : "#7c3aed",
                          borderColor: drug?.category.includes("抗生素") ? "#fed7aa" : "#ddd6fe",
                        }}>
                          {drug?.name}
                        </span>
                        <span className={cn("text-xs px-2 py-0.5 rounded-full border", getDifficultyColor(c.difficulty))}>
                          {getDifficultyLabel(c.difficulty)}
                        </span>
                      </div>
                      <h3 className="text-base font-bold text-gray-900 mt-2 group-hover:text-violet-700 transition-colors">
                        {c.title}
                      </h3>
                    </div>
                    <ChevronRight className="w-5 h-5 text-gray-300 group-hover:text-violet-500 transition-colors flex-shrink-0 mt-1" />
                  </div>
                  <p className="text-sm text-gray-600 line-clamp-2 leading-relaxed">
                    {c.scenario.slice(0, 80)}...
                  </p>
                  <div className="flex items-center gap-4 mt-3 text-xs text-gray-500">
                    <span className="flex items-center gap-1">
                      <User className="w-3.5 h-3.5" />
                      {c.patient.age}岁{c.patient.gender === "male" ? "男" : "女"}
                    </span>
                    <span className="flex items-center gap-1">
                      <Pill className="w-3.5 h-3.5" />
                      {c.currentDose}{c.administrationRoute === "oral" ? "mg po" : "mg iv"} q{c.currentInterval}h
                    </span>
                    <span className="flex items-center gap-1">
                      <Beaker className="w-3.5 h-3.5" />
                      {c.steadyStateConcentration} {drug?.unit}
                    </span>
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <button
          onClick={resetExercise}
          className="flex items-center gap-2 text-sm text-gray-500 hover:text-violet-600 transition-colors"
        >
          <RotateCcw className="w-4 h-4" />
          返回病例列表
        </button>
        <div className="flex items-center gap-1">
          {steps.map((step, i) => {
            const Icon = step.icon;
            const stepNum = i + 1;
            const currentStep = getPhaseStep();
            const isActive = stepNum === currentStep;
            const isDone = stepNum < currentStep;
            return (
              <div key={i} className="flex items-center">
                <div
                  className={cn(
                    "flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-all",
                    isActive
                      ? "bg-violet-100 text-violet-700"
                      : isDone
                      ? "bg-green-50 text-green-600"
                      : "bg-gray-50 text-gray-400"
                  )}
                >
                  <Icon className="w-3.5 h-3.5" />
                  {step.label}
                </div>
                {i < steps.length - 1 && (
                  <ArrowRight className="w-3.5 h-3.5 text-gray-300 mx-1" />
                )}
              </div>
            );
          })}
        </div>
      </div>

      {currentCase && currentDrug && (
        <>
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="p-4 bg-gradient-to-r from-violet-50 to-purple-50 border-b border-gray-100">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center shadow-md">
                  <Activity className="w-5 h-5 text-white" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <h2 className="text-lg font-bold text-gray-900">{currentCase.title}</h2>
                    <span className={cn("text-xs px-2 py-0.5 rounded-full border", getDifficultyColor(currentCase.difficulty))}>
                      {getDifficultyLabel(currentCase.difficulty)}
                    </span>
                  </div>
                  <p className="text-xs text-gray-500 mt-0.5">
                    {currentDrug.name} · 治疗窗 {currentDrug.therapeuticRange} {currentDrug.unit}
                  </p>
                </div>
              </div>
            </div>

            <div className="p-5">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <User className="w-4 h-4 text-violet-600" />
                    <span className="text-sm font-semibold text-gray-800">患者信息</span>
                  </div>
                  <div className="p-3 bg-gray-50 rounded-xl space-y-1.5 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-500">年龄/性别</span>
                      <span className="font-medium">{currentCase.patient.age}岁 {currentCase.patient.gender === "male" ? "男" : "女"}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">体重</span>
                      <span className="font-medium">{currentCase.patient.weight} kg</span>
                    </div>
                    {currentCase.patient.creatinineClearance && (
                      <div className="flex justify-between">
                        <span className="text-gray-500">肌酐清除率</span>
                        <span className="font-medium">{currentCase.patient.creatinineClearance} mL/min</span>
                      </div>
                    )}
                    <div>
                      <span className="text-gray-500">既往史</span>
                      <div className="mt-1 space-y-0.5">
                        {currentCase.patient.medicalHistory.map((h, i) => (
                          <div key={i} className="text-xs text-gray-700 pl-2 border-l-2 border-violet-200">{h}</div>
                        ))}
                      </div>
                    </div>
                    <div>
                      <span className="text-gray-500">用药方案</span>
                      <div className="mt-1 space-y-0.5">
                        {currentCase.patient.currentMedications.map((m, i) => (
                          <div key={i} className="text-xs text-gray-700 pl-2 border-l-2 border-blue-200">{m}</div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <Beaker className="w-4 h-4 text-violet-600" />
                    <span className="text-sm font-semibold text-gray-800">监测数据</span>
                  </div>
                  <div className="p-3 bg-gray-50 rounded-xl space-y-3">
                    <div className="grid grid-cols-2 gap-3">
                      <div className="p-3 bg-white rounded-lg border border-gray-100 text-center">
                        <div className="text-xs text-gray-500 mb-1">当前剂量</div>
                        <div className="text-lg font-bold text-gray-900">{currentCase.currentDose}<span className="text-xs font-normal text-gray-500 ml-1">mg</span></div>
                        <div className="text-xs text-gray-400">q{currentCase.currentInterval}h {currentCase.administrationRoute === "oral" ? "po" : "iv"}</div>
                      </div>
                      <div className="p-3 bg-white rounded-lg border border-gray-100 text-center">
                        <div className="text-xs text-gray-500 mb-1">稳态浓度</div>
                        <div className="text-lg font-bold text-violet-700">{currentCase.steadyStateConcentration}<span className="text-xs font-normal text-gray-500 ml-1">{currentDrug.unit}</span></div>
                        <div className="text-xs text-gray-400">治疗窗 {currentDrug.therapeuticRange}</div>
                      </div>
                    </div>
                    <div className="p-2 bg-violet-50 rounded-lg border border-violet-100">
                      <div className="flex items-center gap-1 mb-1">
                        <Pill className="w-3.5 h-3.5 text-violet-600" />
                        <span className="text-xs font-medium text-violet-700">药物参数</span>
                      </div>
                      <div className="grid grid-cols-2 gap-1.5 text-xs">
                        <div className="text-gray-600">半衰期：<span className="font-medium">{currentDrug.halfLife}h</span></div>
                        <div className="text-gray-600">Vd：<span className="font-medium">{currentDrug.volumeOfDistribution} L/kg</span></div>
                        <div className="text-gray-600">生物利用度：<span className="font-medium">{(currentDrug.bioavailability * 100).toFixed(0)}%</span></div>
                        <div className="text-gray-600">中毒浓度：<span className="font-medium text-red-600">{currentDrug.toxicLevel} {currentDrug.unit}</span></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-4 p-3 bg-blue-50 rounded-xl border border-blue-100">
                <div className="flex items-start gap-2">
                  <Clock className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
                  <p className="text-sm text-blue-800 leading-relaxed">{currentCase.scenario}</p>
                </div>
              </div>
            </div>
          </div>

          {phase === "judgment" && (
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
              <div className="flex items-center gap-2 mb-4">
                <Target className="w-5 h-5 text-violet-600" />
                <h3 className="text-lg font-bold text-gray-900">步骤一：判断血药浓度</h3>
              </div>
              <p className="text-sm text-gray-600 mb-4">
                根据患者稳态浓度 <span className="font-bold text-violet-700">{currentCase.steadyStateConcentration} {currentDrug.unit}</span> 和治疗窗 <span className="font-medium">{currentDrug.therapeuticRange} {currentDrug.unit}</span>，请判断该浓度是否在治疗窗内：
              </p>
              <div className="space-y-2">
                {currentCase.judgmentOptions.map((opt) => {
                  const isSelected = selectedJudgment === opt.id;
                  const showResult = judgmentSubmitted;
                  const isCorrect = opt.isCorrect;
                  let borderClass = "border-gray-200 hover:border-violet-300";
                  let bgClass = "bg-white";
                  if (showResult && isSelected && isCorrect) {
                    borderClass = "border-green-400";
                    bgClass = "bg-green-50";
                  } else if (showResult && isSelected && !isCorrect) {
                    borderClass = "border-red-400";
                    bgClass = "bg-red-50";
                  } else if (showResult && isCorrect) {
                    borderClass = "border-green-300";
                    bgClass = "bg-green-50/50";
                  } else if (isSelected) {
                    borderClass = "border-violet-400";
                    bgClass = "bg-violet-50";
                  }
                  return (
                    <button
                      key={opt.id}
                      onClick={() => !judgmentSubmitted && setSelectedJudgment(opt.id)}
                      disabled={judgmentSubmitted}
                      className={cn(
                        "w-full text-left p-4 rounded-xl border-2 transition-all",
                        borderClass,
                        bgClass,
                        judgmentSubmitted && "cursor-default"
                      )}
                    >
                      <div className="flex items-start gap-3">
                        {showResult && isSelected && isCorrect && (
                          <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                        )}
                        {showResult && isSelected && !isCorrect && (
                          <XCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                        )}
                        {showResult && !isSelected && isCorrect && (
                          <CheckCircle2 className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                        )}
                        {!showResult && isSelected && (
                          <div className="w-5 h-5 rounded-full border-2 border-violet-500 bg-violet-500 flex items-center justify-center flex-shrink-0 mt-0.5">
                            <div className="w-2 h-2 rounded-full bg-white" />
                          </div>
                        )}
                        {!showResult && !isSelected && (
                          <div className="w-5 h-5 rounded-full border-2 border-gray-300 flex-shrink-0 mt-0.5" />
                        )}
                        <div className="flex-1 min-w-0">
                          <div className="text-sm font-semibold text-gray-900">{opt.label}</div>
                          {showResult && (
                            <div className={cn("text-xs mt-1.5 leading-relaxed", isCorrect ? "text-green-700" : "text-red-700")}>
                              {opt.feedback}
                            </div>
                          )}
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
              <div className="mt-5 flex justify-end">
                {!judgmentSubmitted ? (
                  <button
                    onClick={() => {
                      if (selectedJudgment) setJudgmentSubmitted(true);
                    }}
                    disabled={!selectedJudgment}
                    className={cn(
                      "flex items-center gap-2 px-6 py-3 rounded-xl font-semibold text-sm transition-all",
                      selectedJudgment
                        ? "bg-gradient-to-r from-violet-500 to-purple-600 text-white shadow-md hover:shadow-lg hover:-translate-y-0.5"
                        : "bg-gray-100 text-gray-400 cursor-not-allowed"
                    )}
                  >
                    提交判断
                    <ChevronRight className="w-4 h-4" />
                  </button>
                ) : (
                  <button
                    onClick={() => setPhase("adjustment")}
                    className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-violet-500 to-purple-600 text-white font-semibold text-sm rounded-xl shadow-md hover:shadow-lg hover:-translate-y-0.5 transition-all"
                  >
                    下一步：建议方案调整
                    <ChevronRight className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>
          )}

          {phase === "adjustment" && (
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
              <div className="flex items-center gap-2 mb-4">
                <Syringe className="w-5 h-5 text-violet-600" />
                <h3 className="text-lg font-bold text-gray-900">步骤二：建议剂量调整方案</h3>
              </div>
              <p className="text-sm text-gray-600 mb-4">
                根据浓度判断结果，请选择你认为最合适的剂量调整方案：
              </p>
              <div className="space-y-2">
                {currentCase.adjustmentOptions.map((opt) => {
                  const isSelected = selectedAdjustment === opt.id;
                  const showResult = adjustmentSubmitted;
                  const isOptimal = opt.isOptimal;
                  let borderClass = "border-gray-200 hover:border-violet-300";
                  let bgClass = "bg-white";
                  if (showResult && isSelected && isOptimal) {
                    borderClass = "border-green-400";
                    bgClass = "bg-green-50";
                  } else if (showResult && isSelected && !isOptimal) {
                    borderClass = "border-amber-400";
                    bgClass = "bg-amber-50";
                  } else if (showResult && isOptimal) {
                    borderClass = "border-green-300";
                    bgClass = "bg-green-50/50";
                  } else if (isSelected) {
                    borderClass = "border-violet-400";
                    bgClass = "bg-violet-50";
                  }
                  return (
                    <button
                      key={opt.id}
                      onClick={() => !adjustmentSubmitted && setSelectedAdjustment(opt.id)}
                      disabled={adjustmentSubmitted}
                      className={cn(
                        "w-full text-left p-4 rounded-xl border-2 transition-all",
                        borderClass,
                        bgClass,
                        adjustmentSubmitted && "cursor-default"
                      )}
                    >
                      <div className="flex items-start gap-3">
                        {showResult && isSelected && isOptimal && (
                          <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                        )}
                        {showResult && isSelected && !isOptimal && (
                          <AlertCircle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
                        )}
                        {showResult && !isSelected && isOptimal && (
                          <CheckCircle2 className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                        )}
                        {!showResult && isSelected && (
                          <div className="w-5 h-5 rounded-full border-2 border-violet-500 bg-violet-500 flex items-center justify-center flex-shrink-0 mt-0.5">
                            <div className="w-2 h-2 rounded-full bg-white" />
                          </div>
                        )}
                        {!showResult && !isSelected && (
                          <div className="w-5 h-5 rounded-full border-2 border-gray-300 flex-shrink-0 mt-0.5" />
                        )}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-semibold text-gray-900">{opt.label}</span>
                            {opt.dose > 0 && (
                              <span className="text-xs px-2 py-0.5 rounded-full bg-gray-100 text-gray-600">
                                {opt.dose}mg q{opt.interval}h
                              </span>
                            )}
                          </div>
                          {showResult && (
                            <div className={cn("text-xs mt-1.5 leading-relaxed", isOptimal ? "text-green-700" : "text-amber-700")}>
                              {opt.feedback}
                            </div>
                          )}
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
              <div className="mt-5 flex justify-end">
                {!adjustmentSubmitted ? (
                  <button
                    onClick={() => {
                      if (selectedAdjustment) setAdjustmentSubmitted(true);
                    }}
                    disabled={!selectedAdjustment}
                    className={cn(
                      "flex items-center gap-2 px-6 py-3 rounded-xl font-semibold text-sm transition-all",
                      selectedAdjustment
                        ? "bg-gradient-to-r from-violet-500 to-purple-600 text-white shadow-md hover:shadow-lg hover:-translate-y-0.5"
                        : "bg-gray-100 text-gray-400 cursor-not-allowed"
                    )}
                  >
                    提交方案
                    <ChevronRight className="w-4 h-4" />
                  </button>
                ) : (
                  <button
                    onClick={() => setPhase("curve")}
                    className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-violet-500 to-purple-600 text-white font-semibold text-sm rounded-xl shadow-md hover:shadow-lg hover:-translate-y-0.5 transition-all"
                  >
                    下一步：探索浓度-时间曲线
                    <ChevronRight className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>
          )}

          {(phase === "curve" || phase === "analysis") && (
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
              <div className="p-4 bg-gradient-to-r from-violet-50 to-purple-50 border-b border-gray-100">
                <div className="flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-violet-600" />
                  <h3 className="text-lg font-bold text-gray-900">步骤三：浓度-时间曲线探索</h3>
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  调整剂量和给药间隔，观察曲线实时变化。蓝色虚线为原始方案，橙色实线为调整后方案。
                </p>
              </div>

              <div className="p-5">
                <div className="ref" ref={chartRef} style={{ width: "100%", height: 380 }} />

                <div className="mt-5 grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div>
                    <label className="flex items-center justify-between text-sm font-medium text-gray-700 mb-2">
                      <span>单次剂量</span>
                      <span className="text-violet-700 font-bold">{sliderDose} mg</span>
                    </label>
                    <input
                      type="range"
                      min={0}
                      max={currentCase.currentDose * 2.5}
                      step={currentCase.administrationRoute === "oral" && currentCase.currentDose < 1 ? 0.025 : currentCase.currentDose < 10 ? 0.5 : 50}
                      value={sliderDose}
                      onChange={(e) => setSliderDose(parseFloat(e.target.value))}
                      className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-violet-600"
                    />
                    <div className="flex justify-between text-xs text-gray-400 mt-1">
                      <span>0</span>
                      <span className="text-blue-600">原方案 {currentCase.currentDose}mg</span>
                      <span>{(currentCase.currentDose * 2.5).toFixed(currentCase.currentDose < 1 ? 3 : 0)}mg</span>
                    </div>
                  </div>

                  <div>
                    <label className="flex items-center justify-between text-sm font-medium text-gray-700 mb-2">
                      <span>给药间隔</span>
                      <span className="text-violet-700 font-bold">q{sliderInterval}h</span>
                    </label>
                    <input
                      type="range"
                      min={4}
                      max={currentCase.currentInterval * 3}
                      step={currentCase.currentInterval <= 12 ? 2 : 4}
                      value={sliderInterval}
                      onChange={(e) => setSliderInterval(parseFloat(e.target.value))}
                      className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-violet-600"
                    />
                    <div className="flex justify-between text-xs text-gray-400 mt-1">
                      <span>4h</span>
                      <span className="text-blue-600">原方案 q{currentCase.currentInterval}h</span>
                      <span>q{currentCase.currentInterval * 3}h</span>
                    </div>
                  </div>
                </div>

                {curveData && (
                  <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-3">
                    <div className="p-3 bg-gray-50 rounded-xl text-center">
                      <div className="text-xs text-gray-500 mb-1">稳态 Cmax</div>
                      <div className={cn(
                        "text-lg font-bold",
                        curveData.cmax > currentDrug.toxicLevel
                          ? "text-red-600"
                          : curveData.cmax > currentDrug.therapeuticMax
                          ? "text-amber-600"
                          : "text-gray-900"
                      )}>
                        {formatNumber(curveData.cmax, 2)}
                      </div>
                      <div className="text-xs text-gray-400">{currentDrug.unit}</div>
                    </div>
                    <div className="p-3 bg-gray-50 rounded-xl text-center">
                      <div className="text-xs text-gray-500 mb-1">稳态 Cmin</div>
                      <div className={cn(
                        "text-lg font-bold",
                        curveData.cmin < currentDrug.therapeuticMin
                          ? "text-blue-600"
                          : "text-gray-900"
                      )}>
                        {formatNumber(curveData.cmin, 2)}
                      </div>
                      <div className="text-xs text-gray-400">{currentDrug.unit}</div>
                    </div>
                    <div className="p-3 bg-gray-50 rounded-xl text-center">
                      <div className="text-xs text-gray-500 mb-1">平均稳态浓度</div>
                      <div className={cn(
                        "text-lg font-bold",
                        curveData.cssAvg > currentDrug.therapeuticMax
                          ? "text-amber-600"
                          : curveData.cssAvg < currentDrug.therapeuticMin
                          ? "text-blue-600"
                          : "text-green-600"
                      )}>
                        {formatNumber(curveData.cssAvg, 2)}
                      </div>
                      <div className="text-xs text-gray-400">{currentDrug.unit}</div>
                    </div>
                    <div className="p-3 bg-gray-50 rounded-xl text-center">
                      <div className="text-xs text-gray-500 mb-1">达稳态时间</div>
                      <div className="text-lg font-bold text-gray-900">
                        {formatNumber(curveData.timeToSteadyState, 1)}
                      </div>
                      <div className="text-xs text-gray-400">h（约4个t½）</div>
                    </div>
                  </div>
                )}

                <div className="mt-3 p-3 bg-violet-50 rounded-xl border border-violet-100">
                  <div className="flex items-center gap-1.5 mb-1.5">
                    <Lightbulb className="w-3.5 h-3.5 text-violet-600" />
                    <span className="text-xs font-medium text-violet-700">PK公式参考</span>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-2 text-xs">
                    <div className="p-2 bg-white rounded-lg border border-violet-100">
                      <div className="text-violet-600 font-medium mb-0.5">消除速率常数</div>
                      <div className="font-mono text-gray-800">k = 0.693 / t½ = {formatNumber(0.693 / currentDrug.halfLife, 4)} h⁻¹</div>
                    </div>
                    <div className="p-2 bg-white rounded-lg border border-violet-100">
                      <div className="text-violet-600 font-medium mb-0.5">平均稳态浓度</div>
                      <div className="font-mono text-gray-800">Css = F·D / (Cl·τ)</div>
                    </div>
                    <div className="p-2 bg-white rounded-lg border border-violet-100">
                      <div className="text-violet-600 font-medium mb-0.5">谷浓度估算</div>
                      <div className="font-mono text-gray-800">Cmin ≈ Css·e^(-k·τ/2)</div>
                    </div>
                  </div>
                </div>

                <div className="mt-5 flex justify-end">
                  <button
                    onClick={() => setPhase("analysis")}
                    className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-violet-500 to-purple-600 text-white font-semibold text-sm rounded-xl shadow-md hover:shadow-lg hover:-translate-y-0.5 transition-all"
                  >
                    查看专家解析
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          )}

          {phase === "analysis" && (
            <div className="space-y-5">
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
                <div className="flex items-center gap-2 mb-4">
                  <BookOpen className="w-5 h-5 text-violet-600" />
                  <h3 className="text-lg font-bold text-gray-900">步骤四：专家解析</h3>
                </div>
                <div className="p-4 bg-gradient-to-r from-violet-50 to-purple-50 rounded-xl border border-violet-100">
                  <p className="text-sm text-gray-800 leading-relaxed">{currentCase.expertAnalysis}</p>
                </div>
              </div>

              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
                <div className="flex items-center gap-2 mb-4">
                  <Lightbulb className="w-5 h-5 text-amber-600" />
                  <h3 className="text-lg font-bold text-gray-900">学习要点</h3>
                </div>
                <div className="space-y-3">
                  {currentCase.learningPoints.map((point, i) => (
                    <div key={i} className="flex items-start gap-3 p-3 bg-amber-50/50 rounded-xl border border-amber-100">
                      <div className="w-6 h-6 rounded-full bg-amber-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                        <span className="text-xs font-bold text-amber-700">{i + 1}</span>
                      </div>
                      <p className="text-sm text-gray-800 leading-relaxed">{point}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex justify-between items-center pt-2">
                <button
                  onClick={resetExercise}
                  className="flex items-center gap-2 px-5 py-2.5 bg-gray-100 text-gray-700 font-medium text-sm rounded-xl hover:bg-gray-200 transition-all"
                >
                  <RotateCcw className="w-4 h-4" />
                  选择其他病例
                </button>
                <button
                  onClick={() => {
                    setPhase("judgment");
                    setSelectedJudgment(null);
                    setJudgmentSubmitted(false);
                    setSelectedAdjustment(null);
                    setAdjustmentSubmitted(false);
                    setSliderDose(currentCase.currentDose);
                    setSliderInterval(currentCase.currentInterval);
                  }}
                  className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-violet-500 to-purple-600 text-white font-medium text-sm rounded-xl shadow-md hover:shadow-lg transition-all"
                >
                  <RotateCcw className="w-4 h-4" />
                  重新练习本病例
                </button>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
