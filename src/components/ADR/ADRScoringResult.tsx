import { ADRCase, ADRSeverity, CausalityAssessment } from "@/types";
import { CheckCircle2, XCircle, Award, Target, FileText, BookOpen, Lightbulb } from "lucide-react";

interface Props {
  currentCase: ADRCase;
  userAnswer: {
    isADR: boolean | null;
    suspectedDrugs: string[];
    severity: ADRSeverity | null;
    causality: CausalityAssessment | null;
    summary: string;
  };
}

const severityLabels: Record<ADRSeverity, string> = {
  mild: "轻度",
  moderate: "中度",
  severe: "重度",
  death: "死亡",
};

const causalityLabels: Record<CausalityAssessment, string> = {
  definite: "肯定",
  probable: "很可能",
  possible: "可能",
  conditional: "条件/待评价",
  unlikely: "可能无关",
  unassessable: "无法评价",
};

export default function ADRScoringResult({ currentCase, userAnswer }: Props) {
  const correct = currentCase.correctAnswer;

  const isADRCorrect = userAnswer.isADR === correct.isADR;

  const suspectedDrugsCorrect =
    userAnswer.suspectedDrugs.length === correct.suspectedDrugs.length &&
    userAnswer.suspectedDrugs.every((d) => correct.suspectedDrugs.includes(d));

  const severityCorrect = userAnswer.severity === correct.severity;

  const causalityCorrect = userAnswer.causality === correct.causality;

  const isADRScore = isADRCorrect ? 20 : 0;
  const drugsScore = suspectedDrugsCorrect ? 25 : correct.suspectedDrugs.length > 0
    ? Math.round(
        (userAnswer.suspectedDrugs.filter((d) => correct.suspectedDrugs.includes(d)).length /
          Math.max(correct.suspectedDrugs.length, userAnswer.suspectedDrugs.length)) *
          25
      )
    : userAnswer.suspectedDrugs.length === 0
    ? 25
    : 0;
  const severityScore = severityCorrect ? 20 : 0;
  const causalityScore = causalityCorrect ? 20 : 0;

  const summaryKeywords = [
    "时间",
    "用药",
    "症状",
    "处理",
    "停药",
    "缓解",
    "因果",
    "患者",
  ];
  const keywordHits = summaryKeywords.filter((k) => userAnswer.summary.includes(k)).length;
  const summaryScore = Math.min(15, Math.round((keywordHits / 5) * 15) + (userAnswer.summary.length > 50 ? 5 : 0));

  const totalScore = isADRScore + drugsScore + severityScore + causalityScore + summaryScore;

  const scoreColor =
    totalScore >= 85
      ? "text-green-600"
      : totalScore >= 70
      ? "text-primary-600"
      : totalScore >= 60
      ? "text-amber-600"
      : "text-red-600";
  const scoreBg =
    totalScore >= 85
      ? "from-green-500 to-emerald-600"
      : totalScore >= 70
      ? "from-primary-500 to-accent-500"
      : totalScore >= 60
      ? "from-amber-500 to-orange-600"
      : "from-red-500 to-rose-600";

  const scoreComment =
    totalScore >= 85
      ? "非常优秀！ADR识别与上报能力很强"
      : totalScore >= 70
      ? "良好，继续加强练习"
      : totalScore >= 60
      ? "及格，部分知识点需要巩固"
      : "需要加强学习，建议复习ADR相关知识";

  const scoringItems = [
    {
      title: "是否为ADR判断",
      subtitle: "正确识别不良反应性质",
      userValue: userAnswer.isADR === null ? "未作答" : userAnswer.isADR ? "是" : "否",
      correctValue: correct.isADR ? "是" : "否",
      correct: isADRCorrect,
      score: isADRScore,
      maxScore: 20,
      explanation: currentCase.explanation.isADRReason,
    },
    {
      title: "可疑药物识别",
      subtitle: "准确锁定可疑药物",
      userValue:
        userAnswer.suspectedDrugs.length > 0 ? userAnswer.suspectedDrugs.join("、") : "无",
      correctValue:
        correct.suspectedDrugs.length > 0 ? correct.suspectedDrugs.join("、") : "无",
      correct: suspectedDrugsCorrect,
      score: drugsScore,
      maxScore: 25,
      explanation: currentCase.explanation.suspectedDrugsReason,
    },
    ...(correct.isADR
      ? [
          {
            title: "严重程度分级",
            subtitle: "按规范划分严重等级",
            userValue: userAnswer.severity ? severityLabels[userAnswer.severity] : "未作答",
            correctValue: severityLabels[correct.severity],
            correct: severityCorrect,
            score: severityScore,
            maxScore: 20,
            explanation: currentCase.explanation.severityReason,
          },
        ]
      : []),
    {
      title: "因果关系评价",
      subtitle: "基于WHO-UMC标准评定",
      userValue: userAnswer.causality ? causalityLabels[userAnswer.causality] : "未作答",
      correctValue: causalityLabels[correct.causality],
      correct: causalityCorrect,
      score: causalityScore,
      maxScore: 20,
      explanation: currentCase.explanation.causalityReason,
    },
    {
      title: "上报摘要撰写",
      subtitle: "要素完整、表达清晰",
      userValue: userAnswer.summary || "未填写",
      correctValue: currentCase.explanation.summaryExample,
      correct: false,
      score: summaryScore,
      maxScore: 15,
      explanation: `摘要应包含：患者基本情况、用药时间与名称、不良反应出现时间与表现、处理措施与转归、因果关系判断。建议参照上方参考答案。`,
    },
  ];

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-2xl border border-gray-100 p-6 md:p-8 shadow-sm">
        <div className="flex flex-col md:flex-row items-center gap-6 mb-6">
          <div
            className={`w-32 h-32 rounded-full bg-gradient-to-br ${scoreBg} flex items-center justify-center shadow-lg`}
          >
            <div className="text-center">
              <div className="text-4xl font-bold text-white">{totalScore}</div>
              <div className="text-sm text-white/80">/ 100分</div>
            </div>
          </div>
          <div className="flex-1 text-center md:text-left">
            <div className="flex items-center justify-center md:justify-start gap-2 mb-2">
              <Award className={`w-6 h-6 ${scoreColor}`} />
              <h2 className={`text-2xl font-bold ${scoreColor}`}>{scoreComment}</h2>
            </div>
            <p className="text-gray-500 mb-4">
              病例：{currentCase.title}
              {correct.naranjoScore !== undefined && (
                <span className="ml-2 px-2 py-0.5 bg-gray-100 text-gray-600 rounded text-sm">
                  Naranjo参考评分：{correct.naranjoScore}分
                </span>
              )}
            </p>
            <div className="flex flex-wrap justify-center md:justify-start gap-3">
              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-gray-50 text-sm">
                <Target className="w-4 h-4 text-gray-500" />
                <span className="text-gray-600">
                  正确{" "}
                  <span className="font-bold text-green-600">
                    {[isADRCorrect, suspectedDrugsCorrect, severityCorrect, causalityCorrect].filter(Boolean).length}
                  </span>
                  /4 项
                </span>
              </div>
              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-gray-50 text-sm">
                <FileText className="w-4 h-4 text-gray-500" />
                <span className="text-gray-600">
                  摘要 {userAnswer.summary.length} 字
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="h-3 bg-gray-100 rounded-full overflow-hidden mb-8">
          <div
            className={`h-full bg-gradient-to-r ${scoreBg} transition-all duration-1000 ease-out`}
            style={{ width: `${totalScore}%` }}
          />
        </div>

        <div className="space-y-4">
          {scoringItems.map((item, idx) => (
            <div
              key={idx}
              className={`rounded-xl border transition-all ${
                item.correct
                  ? "border-green-200 bg-green-50/50"
                  : "border-gray-200 bg-white"
              }`}
            >
              <div className="p-5">
                <div className="flex items-start justify-between gap-4 mb-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      {item.correct ? (
                        <CheckCircle2 className="w-5 h-5 text-green-600" />
                      ) : (
                        <XCircle className="w-5 h-5 text-red-500" />
                      )}
                      <h3 className="font-bold text-gray-900">{item.title}</h3>
                      <span className="text-sm text-gray-500">· {item.subtitle}</span>
                    </div>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <span
                      className={`text-xl font-bold ${
                        item.score === item.maxScore ? "text-green-600" : "text-amber-600"
                      }`}
                    >
                      {item.score}
                    </span>
                    <span className="text-gray-400 text-sm"> / {item.maxScore}</span>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-3">
                  <div className="bg-white rounded-lg p-3 border border-gray-100">
                    <p className="text-xs font-medium text-gray-500 mb-1">你的答案</p>
                    <p
                      className={`text-sm ${
                        item.correct ? "text-gray-700" : "text-red-700"
                      }`}
                    >
                      {item.userValue}
                    </p>
                  </div>
                  <div className="bg-green-50 rounded-lg p-3 border border-green-100">
                    <p className="text-xs font-medium text-green-600 mb-1">标准答案</p>
                    <p className="text-sm text-green-800">{item.correctValue}</p>
                  </div>
                </div>

                <div className="bg-gray-50 rounded-lg p-3">
                  <div className="flex items-start gap-2">
                    <Lightbulb className="w-4 h-4 text-amber-500 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="text-xs font-medium text-gray-500 mb-1">解析</p>
                      <p className="text-sm text-gray-700 leading-relaxed">{item.explanation}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 p-6 md:p-8 shadow-sm">
        <div className="flex items-center gap-3 mb-5">
          <div className="w-10 h-10 rounded-xl bg-violet-50 flex items-center justify-center">
            <BookOpen className="w-5 h-5 text-violet-600" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-gray-900">学习要点</h3>
            <p className="text-sm text-gray-500">通过本病例需要掌握的关键知识点</p>
          </div>
        </div>
        <div className="space-y-2">
          {currentCase.learningPoints.map((point, idx) => (
            <div
              key={idx}
              className="flex items-start gap-3 p-3 rounded-lg bg-gradient-to-r from-violet-50 to-transparent"
            >
              <div className="w-6 h-6 rounded-full bg-violet-100 text-violet-700 flex items-center justify-center text-sm font-bold flex-shrink-0">
                {idx + 1}
              </div>
              <p className="text-gray-700 leading-relaxed">{point}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
