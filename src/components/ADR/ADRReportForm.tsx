import { ADRCase, ADRSeverity, CausalityAssessment } from "@/types";

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

export default function ADRReportForm({ currentCase, userAnswer }: Props) {
  const today = new Date();
  const reportDate = `${today.getFullYear()}年${today.getMonth() + 1}月${today.getDate()}日`;
  const reportId = `ADR-${currentCase.id.toUpperCase()}-${today.getTime().toString().slice(-6)}`;
  const patientInitials = currentCase.patientInfo.gender === "male" ? "某男" : "某女";

  const suspectedMedications = currentCase.medicationsTaken.filter((m) =>
    userAnswer.suspectedDrugs.includes(m.name)
  );

  const outcomeMap: Record<ADRSeverity, string> = {
    mild: "症状消失，无需特殊处理",
    moderate: "经治疗后好转，无后遗症",
    severe: "经抢救治疗后恢复，住院治疗",
    death: "抢救无效死亡",
  };

  const displaySeverity = userAnswer.severity || currentCase.correctAnswer.severity;
  const displayCausality = userAnswer.causality || currentCase.correctAnswer.causality;

  return (
    <div className="p-6 md:p-10 bg-white" id="adr-report-form">
      <div className="text-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-1" style={{ fontFamily: "SimSun, serif" }}>
          药品不良反应/事件报告表
        </h1>
        <p className="text-sm text-gray-500">Adverse Drug Reaction / Event Report Form</p>
        <div className="mt-3 flex justify-center items-center gap-8 text-xs text-gray-600">
          <span>
            报告编码：<span className="font-mono">{reportId}</span>
          </span>
          <span>报告日期：{reportDate}</span>
        </div>
      </div>

      <div className="border-t-2 border-b border-gray-400 py-2 mb-4">
        <h2 className="text-base font-bold text-gray-900" style={{ fontFamily: "SimSun, serif" }}>
          一、报告人信息
        </h2>
      </div>
      <table className="w-full mb-6" style={{ borderCollapse: "collapse" }}>
        <tbody>
          <tr>
            <td
              className="border border-gray-400 px-3 py-2 text-sm bg-gray-50 w-24"
              style={{ fontFamily: "SimSun, serif" }}
            >
              报告人
            </td>
            <td className="border border-gray-400 px-3 py-2 text-sm" style={{ fontFamily: "SimSun, serif" }}>
              ______________（学习模拟）
            </td>
            <td
              className="border border-gray-400 px-3 py-2 text-sm bg-gray-50 w-24"
              style={{ fontFamily: "SimSun, serif" }}
            >
              职业
            </td>
            <td className="border border-gray-400 px-3 py-2 text-sm" style={{ fontFamily: "SimSun, serif" }}>
              药师/医师/护士
            </td>
          </tr>
          <tr>
            <td
              className="border border-gray-400 px-3 py-2 text-sm bg-gray-50"
              style={{ fontFamily: "SimSun, serif" }}
            >
              医疗机构
            </td>
            <td className="border border-gray-400 px-3 py-2 text-sm" style={{ fontFamily: "SimSun, serif" }}>
              ______________（学习模拟）
            </td>
            <td
              className="border border-gray-400 px-3 py-2 text-sm bg-gray-50"
              style={{ fontFamily: "SimSun, serif" }}
            >
              联系电话
            </td>
            <td className="border border-gray-400 px-3 py-2 text-sm" style={{ fontFamily: "SimSun, serif" }}>
              ______________
            </td>
          </tr>
          <tr>
            <td
              className="border border-gray-400 px-3 py-2 text-sm bg-gray-50"
              style={{ fontFamily: "SimSun, serif" }}
            >
              报告类型
            </td>
            <td colSpan={3} className="border border-gray-400 px-3 py-2 text-sm" style={{ fontFamily: "SimSun, serif" }}>
              □ 新的 □ 严重 □ 一般 □ 群体 □ 定期汇总 &nbsp;&nbsp;&nbsp;
              {displaySeverity === "severe" || displaySeverity === "death" ? "☑ 严重" : "☑ 一般"}
            </td>
          </tr>
        </tbody>
      </table>

      <div className="border-t-2 border-b border-gray-400 py-2 mb-4">
        <h2 className="text-base font-bold text-gray-900" style={{ fontFamily: "SimSun, serif" }}>
          二、患者基本信息
        </h2>
      </div>
      <table className="w-full mb-6" style={{ borderCollapse: "collapse" }}>
        <tbody>
          <tr>
            <td
              className="border border-gray-400 px-3 py-2 text-sm bg-gray-50 w-24"
              style={{ fontFamily: "SimSun, serif" }}
            >
              患者姓名
            </td>
            <td className="border border-gray-400 px-3 py-2 text-sm" style={{ fontFamily: "SimSun, serif" }}>
              {patientInitials}
            </td>
            <td
              className="border border-gray-400 px-3 py-2 text-sm bg-gray-50 w-20"
              style={{ fontFamily: "SimSun, serif" }}
            >
              性别
            </td>
            <td className="border border-gray-400 px-3 py-2 text-sm" style={{ fontFamily: "SimSun, serif" }}>
              {currentCase.patientInfo.gender === "male" ? "☑ 男  □ 女" : "□ 男  ☑ 女"}
            </td>
            <td
              className="border border-gray-400 px-3 py-2 text-sm bg-gray-50 w-20"
              style={{ fontFamily: "SimSun, serif" }}
            >
              年龄
            </td>
            <td className="border border-gray-400 px-3 py-2 text-sm" style={{ fontFamily: "SimSun, serif" }}>
              {currentCase.patientInfo.age}岁
            </td>
          </tr>
          <tr>
            <td
              className="border border-gray-400 px-3 py-2 text-sm bg-gray-50"
              style={{ fontFamily: "SimSun, serif" }}
            >
              体重
            </td>
            <td className="border border-gray-400 px-3 py-2 text-sm" style={{ fontFamily: "SimSun, serif" }}>
              {currentCase.patientInfo.weight ? `${currentCase.patientInfo.weight} kg` : "不详"}
            </td>
            <td
              className="border border-gray-400 px-3 py-2 text-sm bg-gray-50"
              style={{ fontFamily: "SimSun, serif" }}
            >
              身高
            </td>
            <td className="border border-gray-400 px-3 py-2 text-sm" style={{ fontFamily: "SimSun, serif" }}>
              不详
            </td>
            <td
              className="border border-gray-400 px-3 py-2 text-sm bg-gray-50"
              style={{ fontFamily: "SimSun, serif" }}
            >
              民族
            </td>
            <td className="border border-gray-400 px-3 py-2 text-sm" style={{ fontFamily: "SimSun, serif" }}>
              汉
            </td>
          </tr>
          <tr>
            <td
              className="border border-gray-400 px-3 py-2 text-sm bg-gray-50"
              style={{ fontFamily: "SimSun, serif" }}
            >
              既往病史
            </td>
            <td colSpan={5} className="border border-gray-400 px-3 py-2 text-sm" style={{ fontFamily: "SimSun, serif" }}>
              {currentCase.patientInfo.medicalHistory && currentCase.patientInfo.medicalHistory.length > 0
                ? currentCase.patientInfo.medicalHistory.join("；")
                : "无特殊"}
            </td>
          </tr>
          <tr>
            <td
              className="border border-gray-400 px-3 py-2 text-sm bg-gray-50"
              style={{ fontFamily: "SimSun, serif" }}
            >
              家族药品不良反应/事件史
            </td>
            <td colSpan={2} className="border border-gray-400 px-3 py-2 text-sm" style={{ fontFamily: "SimSun, serif" }}>
              □ 有  ☑ 无  □ 不详
            </td>
            <td
              className="border border-gray-400 px-3 py-2 text-sm bg-gray-50"
              style={{ fontFamily: "SimSun, serif" }}
            >
              个人药品不良反应/事件史
            </td>
            <td colSpan={2} className="border border-gray-400 px-3 py-2 text-sm" style={{ fontFamily: "SimSun, serif" }}>
              {currentCase.patientInfo.allergies && currentCase.patientInfo.allergies.length > 0
                ? `☑ 有：${currentCase.patientInfo.allergies.join("；")}`
                : "□ 有  ☑ 无  □ 不详"}
            </td>
          </tr>
        </tbody>
      </table>

      <div className="border-t-2 border-b border-gray-400 py-2 mb-4">
        <h2 className="text-base font-bold text-gray-900" style={{ fontFamily: "SimSun, serif" }}>
          三、不良反应/事件信息
        </h2>
      </div>
      <table className="w-full mb-6" style={{ borderCollapse: "collapse" }}>
        <tbody>
          <tr>
            <td
              className="border border-gray-400 px-3 py-2 text-sm bg-gray-50 w-32"
              style={{ fontFamily: "SimSun, serif" }}
            >
              不良反应/事件名称
            </td>
            <td className="border border-gray-400 px-3 py-2 text-sm" style={{ fontFamily: "SimSun, serif" }}>
              {currentCase.title}
            </td>
          </tr>
          <tr>
            <td
              className="border border-gray-400 px-3 py-2 text-sm bg-gray-50"
              style={{ fontFamily: "SimSun, serif" }}
            >
              不良反应/事件发生时间
            </td>
            <td className="border border-gray-400 px-3 py-2 text-sm" style={{ fontFamily: "SimSun, serif" }}>
              ____________（用药后数分钟/数天/数周）
            </td>
          </tr>
          <tr>
            <td
              className="border border-gray-400 px-3 py-2 text-sm bg-gray-50"
              style={{ fontFamily: "SimSun, serif" }}
            >
              不良反应/事件表现
            </td>
            <td className="border border-gray-400 px-3 py-2 text-sm leading-relaxed" style={{ fontFamily: "SimSun, serif" }}>
              {currentCase.symptoms.join("；")}
            </td>
          </tr>
          <tr>
            <td
              className="border border-gray-400 px-3 py-2 text-sm bg-gray-50"
              style={{ fontFamily: "SimSun, serif" }}
            >
              不良反应/事件的严重程度
            </td>
            <td className="border border-gray-400 px-3 py-2 text-sm" style={{ fontFamily: "SimSun, serif" }}>
              □ 轻度（轻微症状，无需治疗） &nbsp;
              □ 中度（症状明显，需一般处理） &nbsp;
              ☑ {severityLabels[displaySeverity]}（{displaySeverity === "death" ? "导致死亡" : displaySeverity === "severe" ? "危及生命，需紧急抢救" : displaySeverity === "moderate" ? "症状明显，需要一般处理" : "症状轻微，无需特殊治疗"}）
            </td>
          </tr>
          <tr>
            <td
              className="border border-gray-400 px-3 py-2 text-sm bg-gray-50"
              style={{ fontFamily: "SimSun, serif" }}
            >
              采取措施
            </td>
            <td className="border border-gray-400 px-3 py-2 text-sm" style={{ fontFamily: "SimSun, serif" }}>
              □ 停药 &nbsp;☑ 停药 &nbsp;
              □ 减量 &nbsp;
              □ 继续用药 &nbsp;
              □ 对症治疗 &nbsp;☑ 对症治疗 &nbsp;
              □ 其他 ________
            </td>
          </tr>
          <tr>
            <td
              className="border border-gray-400 px-3 py-2 text-sm bg-gray-50"
              style={{ fontFamily: "SimSun, serif" }}
            >
              不良反应/事件的结果
            </td>
            <td className="border border-gray-400 px-3 py-2 text-sm" style={{ fontFamily: "SimSun, serif" }}>
              ☑ 痊愈 □ 好转 □ 未好转 □ 后遗症 □ 死亡 &nbsp;&nbsp; 具体表现：
              {outcomeMap[displaySeverity]}
            </td>
          </tr>
          <tr>
            <td
              className="border border-gray-400 px-3 py-2 text-sm bg-gray-50"
              style={{ fontFamily: "SimSun, serif" }}
            >
              原患疾病
            </td>
            <td className="border border-gray-400 px-3 py-2 text-sm" style={{ fontFamily: "SimSun, serif" }}>
              {currentCase.medicationsTaken.map((m) => m.indication).join("；")}
            </td>
          </tr>
        </tbody>
      </table>

      <div className="border-t-2 border-b border-gray-400 py-2 mb-4">
        <h2 className="text-base font-bold text-gray-900" style={{ fontFamily: "SimSun, serif" }}>
          四、怀疑用药信息
        </h2>
      </div>
      <table className="w-full mb-6" style={{ borderCollapse: "collapse" }}>
        <thead>
          <tr>
            <th className="border border-gray-400 px-2 py-2 text-xs bg-gray-50" style={{ fontFamily: "SimSun, serif" }}>
              序号
            </th>
            <th className="border border-gray-400 px-2 py-2 text-xs bg-gray-50" style={{ fontFamily: "SimSun, serif" }}>
              怀疑药品名称（商品名/通用名）
            </th>
            <th className="border border-gray-400 px-2 py-2 text-xs bg-gray-50" style={{ fontFamily: "SimSun, serif" }}>
              剂量
            </th>
            <th className="border border-gray-400 px-2 py-2 text-xs bg-gray-50" style={{ fontFamily: "SimSun, serif" }}>
              用药频次
            </th>
            <th className="border border-gray-400 px-2 py-2 text-xs bg-gray-50" style={{ fontFamily: "SimSun, serif" }}>
              给药途径
            </th>
            <th className="border border-gray-400 px-2 py-2 text-xs bg-gray-50" style={{ fontFamily: "SimSun, serif" }}>
              用药起止时间
            </th>
            <th className="border border-gray-400 px-2 py-2 text-xs bg-gray-50" style={{ fontFamily: "SimSun, serif" }}>
              用药原因
            </th>
          </tr>
        </thead>
        <tbody>
          {suspectedMedications.length > 0
            ? suspectedMedications.map((med, idx) => (
                <tr key={idx}>
                  <td className="border border-gray-400 px-2 py-2 text-sm text-center" style={{ fontFamily: "SimSun, serif" }}>
                    {idx + 1}
                  </td>
                  <td className="border border-gray-400 px-2 py-2 text-sm" style={{ fontFamily: "SimSun, serif" }}>
                    {med.name}
                  </td>
                  <td className="border border-gray-400 px-2 py-2 text-sm" style={{ fontFamily: "SimSun, serif" }}>
                    {med.dose}
                  </td>
                  <td className="border border-gray-400 px-2 py-2 text-sm" style={{ fontFamily: "SimSun, serif" }}>
                    {med.frequency}
                  </td>
                  <td className="border border-gray-400 px-2 py-2 text-sm" style={{ fontFamily: "SimSun, serif" }}>
                    口服/静脉滴注
                  </td>
                  <td className="border border-gray-400 px-2 py-2 text-sm" style={{ fontFamily: "SimSun, serif" }}>
                    {med.duration}
                  </td>
                  <td className="border border-gray-400 px-2 py-2 text-sm" style={{ fontFamily: "SimSun, serif" }}>
                    {med.indication}
                  </td>
                </tr>
              ))
            : currentCase.medicationsTaken.map((med, idx) => (
                <tr key={idx}>
                  <td className="border border-gray-400 px-2 py-2 text-sm text-center" style={{ fontFamily: "SimSun, serif" }}>
                    {idx + 1}
                  </td>
                  <td className="border border-gray-400 px-2 py-2 text-sm" style={{ fontFamily: "SimSun, serif" }}>
                    {med.name}（合并用药）
                  </td>
                  <td className="border border-gray-400 px-2 py-2 text-sm" style={{ fontFamily: "SimSun, serif" }}>
                    {med.dose}
                  </td>
                  <td className="border border-gray-400 px-2 py-2 text-sm" style={{ fontFamily: "SimSun, serif" }}>
                    {med.frequency}
                  </td>
                  <td className="border border-gray-400 px-2 py-2 text-sm" style={{ fontFamily: "SimSun, serif" }}>
                    口服
                  </td>
                  <td className="border border-gray-400 px-2 py-2 text-sm" style={{ fontFamily: "SimSun, serif" }}>
                    {med.duration}
                  </td>
                  <td className="border border-gray-400 px-2 py-2 text-sm" style={{ fontFamily: "SimSun, serif" }}>
                    {med.indication}
                  </td>
                </tr>
              ))}
        </tbody>
      </table>

      <div className="border-t-2 border-b border-gray-400 py-2 mb-4">
        <h2 className="text-base font-bold text-gray-900" style={{ fontFamily: "SimSun, serif" }}>
          五、关联性评价
        </h2>
      </div>
      <table className="w-full mb-6" style={{ borderCollapse: "collapse" }}>
        <tbody>
          <tr>
            <td
              className="border border-gray-400 px-3 py-2 text-sm bg-gray-50 w-32"
              style={{ fontFamily: "SimSun, serif" }}
            >
              报告人评价
            </td>
            <td className="border border-gray-400 px-3 py-2 text-sm" style={{ fontFamily: "SimSun, serif" }}>
              因果关系评价结果：☑ <strong>{causalityLabels[displayCausality]}</strong>
              （□ 肯定 □ 很可能 □ 可能 □ 可能无关 □ 待评价 □ 无法评价）
            </td>
          </tr>
          <tr>
            <td
              className="border border-gray-400 px-3 py-2 text-sm bg-gray-50 align-top"
              style={{ fontFamily: "SimSun, serif" }}
            >
              评价依据（WHO-UMC）
            </td>
            <td className="border border-gray-400 px-3 py-2 text-sm leading-relaxed" style={{ fontFamily: "SimSun, serif" }}>
              {currentCase.explanation.causalityReason}
            </td>
          </tr>
        </tbody>
      </table>

      <div className="border-t-2 border-b border-gray-400 py-2 mb-4">
        <h2 className="text-base font-bold text-gray-900" style={{ fontFamily: "SimSun, serif" }}>
          六、报告人意见及其他
        </h2>
      </div>
      <table className="w-full mb-6" style={{ borderCollapse: "collapse" }}>
        <tbody>
          <tr>
            <td
              className="border border-gray-400 px-3 py-2 text-sm bg-gray-50 w-24 align-top"
              style={{ fontFamily: "SimSun, serif" }}
            >
              事件描述
            </td>
            <td
              className="border border-gray-400 px-3 py-2 text-sm leading-relaxed"
              style={{ fontFamily: "SimSun, serif", height: "100px", verticalAlign: "top" }}
            >
              {userAnswer.summary && userAnswer.summary.trim().length > 0
                ? userAnswer.summary
                : currentCase.explanation.summaryExample}
            </td>
          </tr>
          <tr>
            <td
              className="border border-gray-400 px-3 py-2 text-sm bg-gray-50"
              style={{ fontFamily: "SimSun, serif" }}
            >
              备注
            </td>
            <td className="border border-gray-400 px-3 py-2 text-sm" style={{ fontFamily: "SimSun, serif" }}>
              本报告由学习模拟系统生成，仅供教学培训使用。
              参考Naranjo评分：{currentCase.correctAnswer.naranjoScore !== undefined ? `${currentCase.correctAnswer.naranjoScore}分` : "未评定"}。
            </td>
          </tr>
        </tbody>
      </table>

      <div className="text-center text-xs text-gray-500 mt-8 pt-4 border-t border-gray-200">
        <p style={{ fontFamily: "SimSun, serif" }}>
          本报告表参照《国家药品不良反应监测中心药品不良反应/事件报告表》样式制作，仅供学习模拟使用。
        </p>
        <p className="mt-1" style={{ fontFamily: "SimSun, serif" }}>
          报告编号：{reportId} &nbsp;|&nbsp; 生成日期：{reportDate} &nbsp;|&nbsp; 学习模拟专用
        </p>
      </div>
    </div>
  );
}
