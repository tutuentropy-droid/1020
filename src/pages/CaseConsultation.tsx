import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import {
  Stethoscope,
  User,
  Pill,
  Activity,
  HeartPulse,
  Award,
  CheckCircle2,
  XCircle,
  RefreshCw,
  Lightbulb,
  ChevronRight,
  ChevronLeft,
  Search,
  AlertTriangle,
  ExternalLink,
  BookOpen,
  Target,
  FlaskConical,
  ShieldAlert,
} from "lucide-react";
import {
  consultationCases,
  getDifficultyLabel,
  getDifficultyColor,
  getStepTypeLabel,
  getScoreLevel,
} from "@/data/caseConsultation";
import {
  ConsultationCase,
  ConsultationReference,
  UserConsultationAnswer,
} from "@/types";
import { cn } from "@/lib/utils";

type ConsultationView = "list" | "case";
type StepPhase = "question" | "feedback";

export default function CaseConsultation() {
  const navigate = useNavigate();
  const [view, setView] = useState<ConsultationView>("list");
  const [currentCase, setCurrentCase] = useState<ConsultationCase | null>(null);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [selectedOptionId, setSelectedOptionId] = useState<string | null>(null);
  const [stepPhase, setStepPhase] = useState<StepPhase>("question");
  const [answers, setAnswers] = useState<UserConsultationAnswer[]>([]);
  const [showFinal, setShowFinal] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [difficultyFilter, setDifficultyFilter] = useState<string>("all");

  const filteredCases = useMemo(() => {
    return consultationCases.filter((c) => {
      const matchesDifficulty = difficultyFilter === "all" || c.difficulty === difficultyFilter;
      const query = searchQuery.trim().toLowerCase();
      const matchesSearch =
        query === "" ||
        c.title.toLowerCase().includes(query) ||
        c.category.toLowerCase().includes(query) ||
        c.chiefComplaint.toLowerCase().includes(query) ||
        c.learningPoints.some((lp) => lp.toLowerCase().includes(query));
      return matchesDifficulty && matchesSearch;
    });
  }, [searchQuery, difficultyFilter]);

  const totalScore = useMemo(() => {
    return answers.reduce((sum, a) => sum + a.score, 0);
  }, [answers]);

  const startCase = (caseData: ConsultationCase) => {
    setCurrentCase(caseData);
    setCurrentStepIndex(0);
    setSelectedOptionId(null);
    setStepPhase("question");
    setAnswers([]);
    setShowFinal(false);
    setView("case");
  };

  const resetCase = () => {
    if (currentCase) {
      setCurrentStepIndex(0);
      setSelectedOptionId(null);
      setStepPhase("question");
      setAnswers([]);
      setShowFinal(false);
    }
  };

  const backToList = () => {
    setView("list");
    setCurrentCase(null);
  };

  const handleOptionSelect = (optionId: string) => {
    if (stepPhase === "question") {
      setSelectedOptionId(optionId);
    }
  };

  const submitAnswer = () => {
    if (!selectedOptionId || !currentCase) return;
    const currentStep = currentCase.steps[currentStepIndex];
    const option = currentStep.options.find((o) => o.id === selectedOptionId);
    if (option) {
      setAnswers((prev) => [
        ...prev,
        {
          stepId: currentStep.id,
          selectedOptionId: option.id,
          score: option.score,
        },
      ]);
      setStepPhase("feedback");
    }
  };

  const goToNextStep = () => {
    if (!currentCase) return;
    if (currentStepIndex < currentCase.steps.length - 1) {
      setCurrentStepIndex((prev) => prev + 1);
      setSelectedOptionId(null);
      setStepPhase("question");
    } else {
      setShowFinal(true);
    }
  };

  const navigateToReference = (ref: ConsultationReference) => {
    if (ref.type === "chapter") {
      navigate(`/learn/${ref.targetId}`);
    } else if (ref.type === "drug") {
      navigate(`/drugs/${ref.targetId}`);
    } else if (ref.type === "interaction") {
      navigate("/interactions");
    }
  };

  const ReferenceLinks = ({ references }: { references?: ConsultationReference[] }) => {
    if (!references || references.length === 0) return null;
    return (
      <div className="mt-4 pt-4 border-t border-gray-100">
        <div className="flex items-center gap-2 mb-2">
          <BookOpen className="w-4 h-4 text-primary-500" />
          <span className="text-sm font-medium text-gray-700">参考资料</span>
        </div>
        <div className="flex flex-wrap gap-2">
          {references.map((ref, idx) => (
            <button
              key={idx}
              onClick={() => navigateToReference(ref)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-primary-50 text-primary-700 text-sm hover:bg-primary-100 transition-colors border border-primary-100"
            >
              <ExternalLink className="w-3 h-3" />
              {ref.title}
            </button>
          ))}
        </div>
      </div>
    );
  };

  if (view === "list") {
    return (
      <div className="space-y-8 animate-fade-in">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center shadow-lg">
            <Stethoscope className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">病例模拟会诊</h1>
            <p className="text-sm text-gray-500 mt-1">
              针对复杂临床病例进行分步决策训练，培养临床用药思维
            </p>
          </div>
        </div>

        <div className="bg-gradient-to-br from-indigo-50 to-violet-50 rounded-2xl p-6 border border-indigo-100">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-500 to-violet-500 flex items-center justify-center flex-shrink-0 shadow-md">
              <Lightbulb className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="font-bold text-gray-900 mb-2">学习方法</h3>
              <p className="text-sm text-gray-600 leading-relaxed">
                每个病例均来自真实临床场景，包含患者基本信息、现病史、实验室检查等完整资料。
                您需要完成四个决策步骤：
                <span className="font-semibold text-indigo-700">①识别主要治疗问题</span>、
                <span className="font-semibold text-indigo-700">②选择初始药物方案</span>、
                <span className="font-semibold text-indigo-700">③调整剂量或换药</span>、
                <span className="font-semibold text-indigo-700">④处理不良反应</span>。
                每步选择后会获得即时反馈和专家解读，最终给出综合评分。
              </p>
            </div>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="搜索病例标题、类别或关键词..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-5 py-3.5 bg-white border border-gray-200 rounded-2xl text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-transparent shadow-sm transition-all"
            />
          </div>
          <div className="flex flex-wrap gap-2">
            {[
              { value: "all", label: "全部" },
              { value: "easy", label: "初级" },
              { value: "medium", label: "中级" },
              { value: "hard", label: "高级" },
            ].map((filter) => (
              <button
                key={filter.value}
                onClick={() => setDifficultyFilter(filter.value)}
                className={cn(
                  "px-5 py-3 rounded-xl text-sm font-medium transition-all duration-200",
                  difficultyFilter === filter.value
                    ? "bg-gradient-to-r from-indigo-500 to-violet-500 text-white shadow-md shadow-indigo-500/25"
                    : "bg-white text-gray-600 border border-gray-200 hover:border-indigo-300 hover:text-indigo-600"
                )}
              >
                {filter.label}
                {filter.value !== "all" && (
                  <span className="ml-1 opacity-80">
                    ({consultationCases.filter((c) => c.difficulty === filter.value).length})
                  </span>
                )}
                {filter.value === "all" && (
                  <span className="ml-1 opacity-80">({consultationCases.length})</span>
                )}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          {filteredCases.map((caseData, index) => (
            <div
              key={caseData.id}
              className="animate-slide-up"
              style={{ animationDelay: `${index * 80}ms` }}
            >
              <div
                className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300 cursor-pointer"
                onClick={() => startCase(caseData)}
              >
                <div className="p-6">
                  <div className="flex items-start gap-4 mb-4">
                    <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-indigo-500 to-violet-500 flex items-center justify-center flex-shrink-0 shadow-lg">
                      <Stethoscope className="w-7 h-7 text-white" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-2 flex-wrap">
                        <h3 className="text-lg font-bold text-gray-900">{caseData.title}</h3>
                        <span
                          className={cn(
                            "inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold border",
                            getDifficultyColor(caseData.difficulty)
                          )}
                        >
                          {getDifficultyLabel(caseData.difficulty)}
                        </span>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {caseData.category.split("+").map((cat, idx) => (
                          <span
                            key={idx}
                            className="inline-flex items-center px-2.5 py-1 bg-gray-50 border border-gray-200 rounded-full text-xs text-gray-600"
                          >
                            {cat}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                  <div className="bg-gray-50 rounded-xl p-4 mb-4">
                    <div className="flex items-center gap-2 mb-2">
                      <AlertTriangle className="w-4 h-4 text-rose-500" />
                      <span className="text-sm font-medium text-gray-700">主诉</span>
                    </div>
                    <p className="text-sm text-gray-600 leading-relaxed">
                      {caseData.chiefComplaint}
                    </p>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4 text-sm text-gray-500">
                      <span className="flex items-center gap-1">
                        <User className="w-4 h-4" />
                        {caseData.patientInfo.age}岁
                        {caseData.patientInfo.gender === "male" ? "男" : "女"}
                      </span>
                      <span className="flex items-center gap-1">
                        <Target className="w-4 h-4" />
                        {caseData.steps.length}个决策步骤
                      </span>
                      <span className="flex items-center gap-1">
                        <Award className="w-4 h-4" />
                        满分{caseData.totalMaxScore}分
                      </span>
                    </div>
                    <div className="flex items-center gap-1 text-indigo-600 font-medium text-sm">
                      开始会诊
                      <ChevronRight className="w-4 h-4" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredCases.length === 0 && (
          <div className="py-20 text-center bg-gray-50 rounded-2xl border-2 border-dashed border-gray-200">
            <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gray-100 flex items-center justify-center">
              <AlertTriangle className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-semibold text-gray-700 mb-2">未找到匹配的病例</h3>
            <p className="text-sm text-gray-500">试试更换搜索关键词或选择其他难度筛选</p>
          </div>
        )}
      </div>
    );
  }

  if (!currentCase) return null;

  const currentStep = currentCase.steps[currentStepIndex];
  const currentAnswer = answers.find((a) => a.stepId === currentStep.id);
  const selectedOption = currentAnswer
    ? currentStep.options.find((o) => o.id === currentAnswer.selectedOptionId)
    : currentStep.options.find((o) => o.id === selectedOptionId);

  if (showFinal) {
    const scoreLevel = getScoreLevel(totalScore, currentCase.totalMaxScore);
    return (
      <div className="space-y-6 animate-fade-in">
        <div className="flex items-center justify-between">
          <button
            onClick={backToList}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white border border-gray-200 text-gray-700 hover:bg-gray-50 transition-all"
          >
            <ChevronLeft className="w-4 h-4" />
            返回病例列表
          </button>
          <div className="flex items-center gap-3">
            <button
              onClick={resetCase}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white border border-gray-200 text-gray-700 hover:bg-gray-50 transition-all"
            >
              <RefreshCw className="w-4 h-4" />
              重新挑战
            </button>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-gray-100 p-8 shadow-sm">
          <div className="text-center mb-8">
            <div
              className={cn(
                "w-24 h-24 rounded-full mx-auto mb-4 flex items-center justify-center",
                scoreLevel.bg
              )}
            >
              <Award className={cn("w-12 h-12", scoreLevel.color)} />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">{currentCase.title}</h2>
            <p className="text-gray-500 mb-4">综合决策评分</p>
            <div className="inline-flex items-baseline gap-2">
              <span className={cn("text-5xl font-bold", scoreLevel.color)}>{totalScore}</span>
              <span className="text-2xl text-gray-400">/ {currentCase.totalMaxScore}</span>
            </div>
            <div className="mt-3">
              <span
                className={cn(
                  "inline-flex items-center px-4 py-1.5 rounded-full text-sm font-semibold",
                  scoreLevel.bg,
                  scoreLevel.color
                )}
              >
                {scoreLevel.label}
              </span>
            </div>
          </div>

          <div className="max-w-2xl mx-auto mb-8">
            <div className="h-3 bg-gray-100 rounded-full overflow-hidden">
              <div
                className={cn(
                  "h-full rounded-full transition-all duration-1000",
                  scoreLevel.color.includes("emerald")
                    ? "bg-gradient-to-r from-emerald-400 to-emerald-600"
                    : scoreLevel.color.includes("blue")
                    ? "bg-gradient-to-r from-blue-400 to-blue-600"
                    : scoreLevel.color.includes("amber")
                    ? "bg-gradient-to-r from-amber-400 to-amber-600"
                    : "bg-gradient-to-r from-rose-400 to-rose-600"
                )}
                style={{
                  width: `${Math.min(100, (totalScore / currentCase.totalMaxScore) * 100)}%`,
                }}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            {currentCase.steps.map((step, idx) => {
              const answer = answers.find((a) => a.stepId === step.id);
              const maxScoreForStep = Math.max(...step.options.map((o) => o.score));
              const level = answer
                ? getScoreLevel(answer.score, maxScoreForStep)
                : { label: "-", color: "text-gray-400", bg: "bg-gray-50" };
              return (
                <div key={step.id} className={cn("rounded-xl p-4 border text-center", level.bg)}>
                  <div className="text-xs text-gray-500 mb-1">步骤{idx + 1}</div>
                  <div className={cn("text-xs font-medium mb-2", level.color)}>
                    {getStepTypeLabel(step.type)}
                  </div>
                  <div className={cn("text-2xl font-bold", level.color)}>
                    {answer?.score ?? 0}
                  </div>
                  <div className="text-xs text-gray-400">/ {maxScoreForStep}</div>
                </div>
              );
            })}
          </div>

          <div className="bg-gradient-to-br from-indigo-50 to-violet-50 rounded-2xl p-6 border border-indigo-100 mb-8">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-violet-500 flex items-center justify-center">
                <Activity className="w-5 h-5 text-white" />
              </div>
              <h3 className="text-lg font-bold text-gray-900">病例总结</h3>
            </div>
            <p className="text-gray-700 leading-relaxed">{currentCase.finalSummary}</p>
          </div>

          <div className="p-6 bg-gradient-to-br from-amber-50 to-orange-50 rounded-2xl border border-amber-200">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500 to-orange-500 flex items-center justify-center">
                <Lightbulb className="w-5 h-5 text-white" />
              </div>
              <h3 className="text-lg font-bold text-gray-900">核心学习要点</h3>
            </div>
            <ul className="space-y-3">
              {currentCase.learningPoints.map((point, idx) => (
                <li key={idx} className="flex items-start gap-3">
                  <span className="flex-shrink-0 w-6 h-6 rounded-full bg-amber-200 text-amber-800 flex items-center justify-center text-xs font-bold mt-0.5">
                    {idx + 1}
                  </span>
                  <span className="text-gray-700 leading-relaxed">{point}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <button
          onClick={backToList}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white border border-gray-200 text-gray-700 hover:bg-gray-50 transition-all"
        >
          <ChevronLeft className="w-4 h-4" />
          返回病例列表
        </button>
        <div className="flex items-center gap-3">
          <span className="text-sm text-gray-500">
            已得分：
            <span className="font-bold text-indigo-600">{totalScore}</span> /{" "}
            {currentCase.totalMaxScore}
          </span>
          <button
            onClick={resetCase}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white border border-gray-200 text-gray-700 hover:bg-gray-50 transition-all"
          >
            <RefreshCw className="w-4 h-4" />
            重置病例
          </button>
        </div>
      </div>

      <div className="bg-gradient-to-br from-indigo-500 to-violet-600 rounded-2xl p-6 md:p-8 shadow-lg text-white">
        <div className="flex items-start gap-4 mb-4">
          <div className="w-12 h-12 rounded-xl bg-white/20 flex items-center justify-center flex-shrink-0">
            <Stethoscope className="w-6 h-6" />
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1 flex-wrap">
              <h2 className="text-xl md:text-2xl font-bold">{currentCase.title}</h2>
              <span
                className={cn(
                  "inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold border",
                  getDifficultyColor(currentCase.difficulty).replace(
                    "bg-",
                    "bg-white/"
                  )
                )}
                style={{ background: "rgba(255,255,255,0.2)", borderColor: "rgba(255,255,255,0.3)", color: "white" }}
              >
                {getDifficultyLabel(currentCase.difficulty)}
              </span>
            </div>
            <p className="text-indigo-100 text-sm">
              类别：{currentCase.category}
            </p>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-4">
        {currentCase.steps.map((step, idx) => {
          const isActive = idx === currentStepIndex;
          const isPast = idx < currentStepIndex;
          const answer = answers.find((a) => a.stepId === step.id);
          return (
            <div key={step.id} className="flex items-center gap-2 flex-1">
              <div
                className={cn(
                  "flex items-center gap-2 flex-1 px-3 py-3 rounded-xl transition-all",
                  isActive
                    ? "bg-white text-indigo-700 border-2 border-indigo-300 shadow-md"
                    : isPast
                    ? "bg-green-50 text-green-700 border border-green-200"
                    : "bg-gray-50 text-gray-500 border border-gray-200"
                )}
              >
                <div
                  className={cn(
                    "w-7 h-7 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0",
                    isActive
                      ? "bg-indigo-500 text-white"
                      : isPast
                      ? "bg-green-500 text-white"
                      : "bg-gray-200 text-gray-600"
                  )}
                >
                  {isPast && answer ? (
                    <CheckCircle2 className="w-4 h-4" />
                  ) : (
                    idx + 1
                  )}
                </div>
                <div className="min-w-0 flex-1 hidden sm:block">
                  <div className="text-xs font-medium truncate">
                    {getStepTypeLabel(step.type)}
                  </div>
                  {isPast && answer && (
                    <div className="text-xs opacity-75">{answer.score}分</div>
                  )}
                </div>
              </div>
              {idx < currentCase.steps.length - 1 && (
                <ChevronRight className="w-4 h-4 text-gray-300 flex-shrink-0" />
              )}
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
            <div className="flex items-center gap-3 mb-5">
              <div
                className={cn(
                  "w-10 h-10 rounded-xl flex items-center justify-center",
                  currentStep.type === "identify" && "bg-blue-50",
                  currentStep.type === "initial-therapy" && "bg-emerald-50",
                  currentStep.type === "adjustment" && "bg-amber-50",
                  currentStep.type === "adr-management" && "bg-rose-50"
                )}
              >
                {currentStep.type === "identify" && (
                  <Target className="w-5 h-5 text-blue-600" />
                )}
                {currentStep.type === "initial-therapy" && (
                  <Pill className="w-5 h-5 text-emerald-600" />
                )}
                {currentStep.type === "adjustment" && (
                  <Activity className="w-5 h-5 text-amber-600" />
                )}
                {currentStep.type === "adr-management" && (
                  <ShieldAlert className="w-5 h-5 text-rose-600" />
                )}
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-900">{currentStep.title}</h3>
                <p className="text-sm text-gray-500">{currentStep.description}</p>
              </div>
            </div>

            <div className="bg-gray-50 rounded-xl p-5 mb-6 border border-gray-100">
              <p className="text-gray-800 leading-relaxed font-medium">
                {currentStep.question}
              </p>
            </div>

            <div className="space-y-3">
              {currentStep.options.map((option) => {
                const isSelected =
                  (stepPhase === "question" && selectedOptionId === option.id) ||
                  (stepPhase === "feedback" && selectedOption?.id === option.id);
                const showResult = stepPhase === "feedback";
                const isCorrect = option.isOptimal;
                return (
                  <button
                    key={option.id}
                    onClick={() => handleOptionSelect(option.id)}
                    disabled={stepPhase === "feedback"}
                    className={cn(
                      "w-full text-left p-5 rounded-xl border-2 transition-all",
                      showResult
                        ? isCorrect
                          ? "border-green-500 bg-green-50"
                          : isSelected
                          ? "border-rose-500 bg-rose-50"
                          : "border-gray-100 bg-white opacity-75"
                        : isSelected
                        ? "border-indigo-500 bg-indigo-50"
                        : "border-gray-200 bg-white hover:border-gray-300 hover:bg-gray-50",
                      stepPhase === "feedback" && "cursor-default"
                    )}
                  >
                    <div className="flex items-start gap-3">
                      <div
                        className={cn(
                          "w-6 h-6 rounded-full border-2 flex items-center justify-center flex-shrink-0 mt-0.5",
                          showResult
                            ? isCorrect
                              ? "border-green-500 bg-green-500"
                              : isSelected
                              ? "border-rose-500 bg-rose-500"
                              : "border-gray-200"
                            : isSelected
                            ? "border-indigo-500 bg-indigo-500"
                            : "border-gray-300"
                        )}
                      >
                        {showResult && isCorrect && (
                          <CheckCircle2 className="w-4 h-4 text-white" />
                        )}
                        {showResult && !isCorrect && isSelected && (
                          <XCircle className="w-4 h-4 text-white" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p
                          className={cn(
                            "font-semibold",
                            showResult
                              ? isCorrect
                                ? "text-green-800"
                                : isSelected
                                ? "text-rose-800"
                                : "text-gray-600"
                              : isSelected
                              ? "text-indigo-800"
                              : "text-gray-800"
                          )}
                        >
                          {option.label}
                        </p>
                        {option.description && (
                          <p
                            className={cn(
                              "text-sm mt-1",
                              showResult
                                ? isCorrect
                                  ? "text-green-600"
                                  : isSelected
                                  ? "text-rose-600"
                                  : "text-gray-400"
                                : isSelected
                                ? "text-indigo-600"
                                : "text-gray-500"
                            )}
                          >
                            {option.description}
                          </p>
                        )}
                        {showResult && (
                          <div className="mt-2">
                            <span
                              className={cn(
                                "inline-flex items-center px-2 py-0.5 rounded text-xs font-medium",
                                isCorrect
                                  ? "bg-green-100 text-green-700"
                                  : "bg-gray-100 text-gray-600"
                              )}
                            >
                              +{option.score}分
                              {isCorrect && " · 最优选择"}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>

            {stepPhase === "feedback" && selectedOption && (
              <div className="mt-6 space-y-4">
                <div
                  className={cn(
                    "rounded-xl p-5 border",
                    selectedOption.isOptimal
                      ? "bg-green-50 border-green-200"
                      : "bg-amber-50 border-amber-200"
                  )}
                >
                  <div className="flex items-center gap-2 mb-2">
                    {selectedOption.isOptimal ? (
                      <CheckCircle2 className="w-5 h-5 text-green-600" />
                    ) : (
                      <AlertTriangle className="w-5 h-5 text-amber-600" />
                    )}
                    <span
                      className={cn(
                        "font-semibold",
                        selectedOption.isOptimal ? "text-green-800" : "text-amber-800"
                      )}
                    >
                      决策反馈
                    </span>
                  </div>
                  <p
                    className={cn(
                      "leading-relaxed",
                      selectedOption.isOptimal ? "text-green-700" : "text-amber-700"
                    )}
                  >
                    {selectedOption.feedback}
                  </p>
                  <ReferenceLinks references={selectedOption.references} />
                </div>

                <div className="bg-gradient-to-br from-indigo-50 to-violet-50 rounded-xl p-5 border border-indigo-100">
                  <div className="flex items-center gap-2 mb-3">
                    <HeartPulse className="w-5 h-5 text-indigo-600" />
                    <span className="font-semibold text-indigo-800">专家解读</span>
                  </div>
                  <p className="text-gray-700 leading-relaxed">
                    {currentStep.expertExplanation}
                  </p>
                  <ReferenceLinks references={currentStep.references} />
                </div>
              </div>
            )}

            <div className="mt-6 flex items-center justify-between">
              {stepPhase === "question" ? (
                <>
                  <div />
                  <button
                    onClick={submitAnswer}
                    disabled={!selectedOptionId}
                    className={cn(
                      "flex items-center gap-2 px-8 py-3.5 rounded-xl font-semibold shadow-lg transition-all",
                      selectedOptionId
                        ? "bg-gradient-to-r from-indigo-500 to-violet-500 text-white hover:shadow-xl hover:-translate-y-0.5"
                        : "bg-gray-200 text-gray-500 cursor-not-allowed"
                    )}
                  >
                    确认决策
                    <ChevronRight className="w-5 h-5" />
                  </button>
                </>
              ) : (
                <>
                  <div />
                  <button
                    onClick={goToNextStep}
                    className="flex items-center gap-2 px-8 py-3.5 rounded-xl bg-gradient-to-r from-indigo-500 to-violet-500 text-white font-semibold shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all"
                  >
                    {currentStepIndex < currentCase.steps.length - 1
                      ? "进入下一步"
                      : "查看最终结果"}
                    <ChevronRight className="w-5 h-5" />
                  </button>
                </>
              )}
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm">
            <div className="flex items-center gap-2 mb-4">
              <User className="w-5 h-5 text-indigo-600" />
              <h4 className="font-semibold text-gray-900">患者基本信息</h4>
            </div>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-500">年龄性别</span>
                <span className="font-medium text-gray-800">
                  {currentCase.patientInfo.age}岁 /{" "}
                  {currentCase.patientInfo.gender === "male" ? "男" : "女"}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">体重</span>
                <span className="font-medium text-gray-800">
                  {currentCase.patientInfo.weight}kg
                  {currentCase.patientInfo.height &&
                    ` / ${currentCase.patientInfo.height}cm`}
                </span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm">
            <div className="flex items-center gap-2 mb-4">
              <AlertTriangle className="w-5 h-5 text-rose-600" />
              <h4 className="font-semibold text-gray-900">过敏史</h4>
            </div>
            <div className="flex flex-wrap gap-2">
              {currentCase.patientInfo.allergies.length > 0 ? (
                currentCase.patientInfo.allergies.map((a, idx) => (
                  <span
                    key={idx}
                    className="inline-flex items-center px-3 py-1.5 rounded-full text-sm bg-rose-50 text-rose-700 border border-rose-100"
                  >
                    {a}
                  </span>
                ))
              ) : (
                <span className="text-sm text-gray-500">无</span>
              )}
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm">
            <div className="flex items-center gap-2 mb-4">
              <HeartPulse className="w-5 h-5 text-blue-600" />
              <h4 className="font-semibold text-gray-900">既往病史</h4>
            </div>
            <ul className="space-y-1.5 text-sm">
              {currentCase.patientInfo.medicalHistory.map((h, idx) => (
                <li key={idx} className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-blue-400 mt-2 flex-shrink-0" />
                  <span className="text-gray-700">{h}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm">
            <div className="flex items-center gap-2 mb-4">
              <Activity className="w-5 h-5 text-violet-600" />
              <h4 className="font-semibold text-gray-900">生命体征</h4>
            </div>
            <div className="grid grid-cols-1 gap-2 text-sm">
              {currentCase.patientInfo.vitalSigns.map((v, idx) => (
                <div
                  key={idx}
                  className={cn(
                    "flex justify-between px-3 py-2 rounded-lg",
                    v.status === "abnormal" ? "bg-rose-50" : "bg-gray-50"
                  )}
                >
                  <span className="text-gray-500">{v.name}</span>
                  <span
                    className={cn(
                      "font-medium",
                      v.status === "abnormal" ? "text-rose-700" : "text-gray-800"
                    )}
                  >
                    {v.value}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm">
            <div className="flex items-center gap-2 mb-4">
              <FlaskConical className="w-5 h-5 text-emerald-600" />
              <h4 className="font-semibold text-gray-900">实验室检查</h4>
            </div>
            <div className="space-y-2 text-sm max-h-64 overflow-y-auto">
              {currentCase.patientInfo.labResults.map((l, idx) => (
                <div
                  key={idx}
                  className={cn(
                    "px-3 py-2 rounded-lg",
                    l.status === "abnormal" ? "bg-amber-50" : "bg-gray-50"
                  )}
                >
                  <div className="flex justify-between items-center">
                    <span
                      className={cn(
                        "font-medium",
                        l.status === "abnormal" ? "text-amber-800" : "text-gray-800"
                      )}
                    >
                      {l.test}
                    </span>
                    <span
                      className={cn(
                        l.status === "abnormal" ? "text-amber-700" : "text-gray-700"
                      )}
                    >
                      {l.value}
                    </span>
                  </div>
                  <div className="text-xs text-gray-400 mt-0.5">参考: {l.reference}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm">
            <div className="flex items-center gap-2 mb-4">
              <Pill className="w-5 h-5 text-primary-600" />
              <h4 className="font-semibold text-gray-900">目前用药</h4>
            </div>
            <div className="space-y-3 text-sm">
              {currentCase.patientInfo.currentMedications.map((m, idx) => (
                <div key={idx} className="p-3 bg-gray-50 rounded-lg">
                  <div className="font-medium text-gray-800 flex items-center gap-2">
                    <Pill className="w-3.5 h-3.5 text-primary-500" />
                    {m.name}
                  </div>
                  <div className="text-gray-500 text-xs mt-1">
                    {m.dose} / {m.frequency} / {m.duration}
                  </div>
                  <div className="text-gray-400 text-xs mt-0.5">适应症: {m.indication}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-gradient-to-br from-indigo-50 to-violet-50 rounded-2xl p-5 border border-indigo-100">
            <div className="flex items-center gap-2 mb-3">
              <BookOpen className="w-5 h-5 text-indigo-600" />
              <h4 className="font-semibold text-gray-900">病例简介</h4>
            </div>
            <p className="text-sm text-gray-600 leading-relaxed">
              {currentCase.presentIllness}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
