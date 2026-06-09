import { ConsultationCase } from "@/types";

export const consultationCases: ConsultationCase[] = [
  {
    id: "case-001",
    title: "老年多重慢病患者的综合用药管理",
    difficulty: "hard",
    category: "心血管+内分泌+肾脏",
    chiefComplaint: "反复胸闷、气短2周，加重伴双下肢水肿3天",
    presentIllness:
      "患者，男，78岁，2周前劳累后出现胸闷、气短，休息后可缓解，未予重视。3天前上述症状加重，平地步行约100米即出现呼吸困难，伴夜间不能平卧、双下肢凹陷性水肿。既往有高血压病史20余年，2型糖尿病病史15年，冠心病病史8年，慢性肾功能不全病史3年。目前规律服用多种药物，血糖、血压控制不佳。",
    patientInfo: {
      age: 78,
      gender: "male",
      weight: 72,
      height: 168,
      allergies: ["青霉素过敏（皮疹）"],
      medicalHistory: [
        "原发性高血压3级（很高危）",
        "2型糖尿病",
        "冠状动脉粥样硬化性心脏病（稳定型心绞痛）",
        "慢性心力衰竭（NYHA II-III级）",
        "慢性肾脏病3期",
      ],
      currentMedications: [
        {
          name: "硝苯地平缓释片",
          dose: "30mg",
          frequency: "每日1次",
          duration: "3年",
          indication: "高血压",
        },
        {
          name: "盐酸二甲双胍片",
          dose: "0.5g",
          frequency: "每日3次",
          duration: "8年",
          indication: "2型糖尿病",
        },
        {
          name: "格列美脲片",
          dose: "2mg",
          frequency: "每日1次（早餐前）",
          duration: "5年",
          indication: "2型糖尿病",
        },
        {
          name: "阿司匹林肠溶片",
          dose: "100mg",
          frequency: "每日1次",
          duration: "8年",
          indication: "冠心病二级预防",
        },
        {
          name: "阿托伐他汀钙片",
          dose: "20mg",
          frequency: "每晚1次",
          duration: "6年",
          indication: "调脂稳定斑块",
        },
      ],
      vitalSigns: [
        { name: "体温", value: "36.5℃", status: "normal" },
        { name: "脉搏", value: "92次/分", status: "normal" },
        { name: "呼吸", value: "22次/分", status: "abnormal" },
        { name: "血压", value: "168/95mmHg", status: "abnormal" },
        { name: "血氧饱和度", value: "94%（室内空气）", status: "abnormal" },
      ],
      labResults: [
        { test: "空腹血糖", value: "9.8 mmol/L", reference: "3.9-6.1", status: "abnormal" },
        { test: "糖化血红蛋白（HbA1c）", value: "8.2%", reference: "<6.5", status: "abnormal" },
        { test: "血肌酐（Scr）", value: "168 μmol/L", reference: "57-97", status: "abnormal" },
        { test: "估算肾小球滤过率（eGFR）", value: "38 mL/min/1.73m²", reference: "≥90", status: "abnormal" },
        { test: "血钾", value: "4.8 mmol/L", reference: "3.5-5.3", status: "normal" },
        { test: "BNP", value: "865 pg/mL", reference: "<100", status: "abnormal" },
        { test: "肌钙蛋白I（cTnI）", value: "0.02 ng/mL", reference: "<0.04", status: "normal" },
        { test: "低密度脂蛋白胆固醇（LDL-C）", value: "2.8 mmol/L", reference: "<1.8（极高危）", status: "abnormal" },
        { test: "谷丙转氨酶（ALT）", value: "32 U/L", reference: "9-50", status: "normal" },
      ],
    },
    steps: [
      {
        id: "step-1",
        type: "identify",
        title: "第一步：识别主要治疗问题",
        description:
          "请仔细阅读病例资料，从以下选项中识别出该患者当前最需要优先处理的主要治疗问题。",
        question: "该患者当前最主要的治疗问题是什么？",
        options: [
          {
            id: "opt-1-1",
            label: "急性失代偿性心力衰竭",
            description: "胸闷、气短、夜间不能平卧、双下肢水肿、BNP显著升高",
            score: 25,
            isOptimal: true,
            feedback:
              "正确！患者有明确的心力衰竭症状和体征（劳力性呼吸困难、端坐呼吸、双下肢水肿），BNP 865 pg/mL显著升高，这是当前最紧急、需要优先处理的临床问题。",
            references: [
              { title: "心血管药物 - 利尿剂", type: "chapter", targetId: "chapter-2" },
            ],
          },
          {
            id: "opt-1-2",
            label: "高血压控制不佳",
            description: "血压168/95mmHg，高于目标值",
            score: 10,
            feedback:
              "高血压确实控制不佳，但这不是最紧急的问题。心衰的急性失代偿需要优先处理，血压管理可以在治疗心衰的同时进行。",
          },
          {
            id: "opt-1-3",
            label: "2型糖尿病血糖控制不佳",
            description: "空腹血糖9.8，HbA1c 8.2%",
            score: 5,
            feedback:
              "血糖控制不佳需要调整，但在急性心衰情况下，血糖管理不是首要问题。应在血流动力学稳定后优化降糖方案。",
          },
          {
            id: "opt-1-4",
            label: "慢性肾功能不全进展",
            description: "Scr 168，eGFR 38",
            score: 8,
            feedback:
              "慢性肾脏病3期是需要长期管理的问题，但当前并无急性肾损伤证据。心衰治疗中需注意肾功能变化和药物剂量调整。",
          },
        ],
        expertExplanation:
          "患者以急性失代偿性心力衰竭为主要表现，这是危及生命的临床紧急情况，需要优先处理。心力衰竭的治疗原则是：减轻容量负荷（利尿剂）、改善心室重构（ACEI/ARB/ARNI、β受体阻滞剂、MRA）、处理诱因和合并症。同时需要关注以下问题：①二甲双胍在eGFR<30时禁用，eGFR 30-45需减量；②LDL-C 2.8mmol/L对于冠心病合并糖尿病的极高危患者目标应<1.8mmol/L；③老年多重用药需关注药物相互作用和ADR风险。",
        references: [
          { title: "心血管药物", type: "chapter", targetId: "chapter-2" },
          { title: "内分泌系统药物 - 二甲双胍", type: "chapter", targetId: "chapter-6" },
        ],
      },
      {
        id: "step-2",
        type: "initial-therapy",
        title: "第二步：选择初始药物治疗方案",
        description:
          "针对已识别的主要治疗问题（急性失代偿性心力衰竭），结合患者的基础疾病和肝肾功能，选择最合适的初始药物治疗方案。",
        question: "针对该患者急性失代偿性心衰，以下哪种初始治疗方案最合理？",
        options: [
          {
            id: "opt-2-1",
            label: "静脉呋塞米 40mg + 口服培哚普利 4mg qd + 口服美托洛尔缓释片 23.75mg qd + 口服螺内酯 20mg qd",
            description: "袢利尿剂 + ACEI + β受体阻滞剂 + 醛固酮受体拮抗剂",
            score: 30,
            isOptimal: true,
            feedback:
              "优秀！这是心力衰竭的标准治疗方案（新四联中的核心三联）。呋塞米静脉给药快速减轻容量负荷，培哚普利改善心室重构，美托洛尔从小剂量起始，螺内酯在eGFR≥30且血钾正常时可安全使用。",
            references: [
              { title: "心血管药物 - ACEI", type: "chapter", targetId: "chapter-2" },
              { title: "心血管药物 - β受体阻滞剂", type: "chapter", targetId: "chapter-2" },
            ],
          },
          {
            id: "opt-2-2",
            label: "静脉呋塞米 20mg + 口服缬沙坦 80mg qd",
            description: "袢利尿剂 + ARB",
            score: 15,
            feedback:
              "利尿剂和ARB是心衰治疗的组成部分，但方案不完整。缺少β受体阻滞剂和醛固酮受体拮抗剂，未能充分覆盖改善心室重构的关键靶点。",
          },
          {
            id: "opt-2-3",
            label: "口服氢氯噻嗪 25mg qd + 口服硝苯地平缓释片 60mg qd",
            description: "噻嗪类利尿剂 + 增加CCB剂量",
            score: 5,
            feedback:
              "方案不合理。噻嗪类利尿剂在肾功能不全（eGFR<30）时效果差，应选用袢利尿剂。增加硝苯地平剂量可能加重水钠潴留，不利于心衰控制。",
          },
          {
            id: "opt-2-4",
            label: "静脉硝酸甘油 + 口服地高辛 0.25mg qd",
            description: "硝酸酯类 + 洋地黄类",
            score: 10,
            feedback:
              "硝酸甘油可减轻心脏前后负荷，地高辛可改善症状，但这两者不是心衰治疗的基石药物。缺少神经内分泌抑制治疗（ACEI/ARB、β受体阻滞剂、MRA）。",
          },
        ],
        expertExplanation:
          "根据《中国心力衰竭诊断和治疗指南》，HFrEF的治疗应遵循「新四联」方案：ACEI/ARB/ARNI + β受体阻滞剂 + MRA + SGLT2i。本患者eGFR 38，可使用ACEI/ARB（需监测肾功能和血钾），MRA在eGFR≥30、血钾≤5.0时可使用。β受体阻滞剂应在血流动力学稳定后从小剂量起始，逐渐滴定。利尿剂首选袢利尿剂（呋塞米），噻嗪类在eGFR<30时基本无效。注意：SGLT2i（如达格列净）在eGFR≥30时也推荐用于心衰，具有心血管和肾脏保护作用。",
        references: [
          { title: "心血管药物", type: "chapter", targetId: "chapter-2" },
          { title: "内分泌系统药物 - SGLT2抑制剂", type: "chapter", targetId: "chapter-6" },
        ],
      },
      {
        id: "step-3",
        type: "adjustment",
        title: "第三步：调整合并用药方案",
        description:
          "心衰治疗方案已启动，现在需要对患者的其他合并用药进行评估和调整。请关注药物相互作用、禁忌症以及特殊人群用药调整。",
        question: "针对该患者的降糖、降压等合并用药，以下哪种调整方案最合理？",
        options: [
          {
            id: "opt-3-1",
            label: "停用二甲双胍，改为皮下注射胰岛素；加用达格列净10mg qd；硝苯地平缓释片减至20mg qd",
            description: "胰岛素 + SGLT2i + 减少CCB剂量",
            score: 28,
            isOptimal: true,
            feedback:
              "非常合理！①二甲双胍在eGFR 30-45之间应减量或停用，急性心衰时建议改用胰岛素控制血糖；②达格列净（SGLT2i）具有明确的心肾保护作用，eGFR≥30可使用；③硝苯地平可能加重水钠潴留，心衰时应减量或停用。",
            references: [
              { title: "内分泌系统药物 - 二甲双胍", type: "chapter", targetId: "chapter-6" },
              { title: "内分泌系统药物 - SGLT2抑制剂", type: "chapter", targetId: "chapter-6" },
            ],
          },
          {
            id: "opt-3-2",
            label: "继续二甲双胍0.5g tid + 格列美脲2mg qd，加用阿卡波糖50mg tid；硝苯地平缓释片加至60mg qd",
            description: "维持原降糖方案+阿卡波糖 + 增加CCB剂量",
            score: 5,
            feedback:
              "方案不合理。①二甲双胍在eGFR<45时应停用或减量，急性心衰是相对禁忌症；②增加硝苯地平剂量可能加重心衰（水钠潴留）；③格列美脲有低血糖风险且无心衰获益证据。",
          },
          {
            id: "opt-3-3",
            label: "停用二甲双胍和格列美脲，改为西格列汀100mg qd；硝苯地平缓释片维持30mg qd",
            description: "DPP-4抑制剂单药 + 维持CCB",
            score: 12,
            feedback:
              "部分合理。停用二甲双胍正确，但DPP-4抑制剂总体对心衰为中性效果，部分品种（如沙格列汀）甚至增加心衰住院风险。SGLT2i和GLP-1RA是糖尿病合并心衰患者的优选。此外，西格列汀在eGFR 30-50时应减量至50mg qd。",
          },
          {
            id: "opt-3-4",
            label: "继续二甲双胍0.5g tid，加用吡格列酮15mg qd；加用氢氯噻嗪25mg qd",
            description: "维持二甲双胍+TZD + 加用噻嗪利尿剂",
            score: 3,
            feedback:
              "方案错误。①吡格列酮（TZD类）可引起水钠潴留，加重心衰，NYHA II-IV级心衰禁用；②二甲双胍在该eGFR水平下不安全；③噻嗪类利尿剂在eGFR<30时无效，且与磺脲类合用增加血糖异常风险。",
          },
        ],
        expertExplanation:
          "糖尿病合并心衰患者的降糖药物选择：①推荐：SGLT2i（I类推荐）、GLP-1RA（如利拉鲁肽、司美格鲁肽，IIa类推荐）；②中性：DPP-4抑制剂（注意沙格列汀可能增加心衰住院）、胰岛素；③不推荐/禁用：TZD（水钠潴留）、二甲双胍（eGFR<30禁用，eGFR 30-45慎用）。降压方面：二氢吡啶类CCB（尤其是硝苯地平）可扩张血管、反射性激活交感，可能加重心衰，应避免或减量使用。ACEI/ARB/ARNI、β受体阻滞剂本身就是心衰治疗的基石，也有降压作用。",
        references: [
          { title: "内分泌系统药物", type: "chapter", targetId: "chapter-6" },
          { title: "心血管药物 - CCB", type: "chapter", targetId: "chapter-2" },
        ],
      },
      {
        id: "step-4",
        type: "adr-management",
        title: "第四步：处理药物不良反应",
        description:
          "经过3天治疗，患者心衰症状明显改善，水肿消退。但在用药过程中出现了一些新的情况，需要你判断并处理。",
        question:
          "治疗第4天，患者复查血钾5.8 mmol/L（较前升高），Scr升至195 μmol/L（较前上升16%），干咳加重。以下哪种处理方式最合理？",
        options: [
          {
            id: "opt-4-1",
            label: "停用螺内酯；培哚普利减量至2mg qd并密切监测；如血钾>6.5给予聚苯乙烯磺酸钠或胰岛素+葡萄糖；继续呋塞米利尿",
            description: "停用MRA + ACEI减量 + 降钾治疗 + 继续利尿",
            score: 27,
            isOptimal: true,
            feedback:
              "处理非常规范！①螺内酯是高钾血症的常见原因，eGFR下降时应停用；②ACEI（培哚普利）可引起血钾升高和Scr轻度上升，通常Scr上升<30%可继续使用，减量+密切监测即可；③血钾>5.5需干预，>6.5需紧急处理；④继续使用袢利尿剂有助于排钾和维持容量稳定。",
            references: [
              { title: "心血管药物 - ACEI不良反应", type: "chapter", targetId: "chapter-2" },
              { title: "药理计算器 - 肌酐清除率计算", type: "calculator", targetId: "creatinine-clearance" },
            ],
          },
          {
            id: "opt-4-2",
            label: "立即停用所有心衰药物；给予血液透析治疗",
            description: "全面停药 + 紧急透析",
            score: 3,
            feedback:
              "处理过于激进。Scr上升16%在ACEI使用中是可接受的（<30%），血钾5.8属于中度升高，无需透析。盲目停用所有心衰药物可能导致心衰反弹。",
          },
          {
            id: "opt-4-3",
            label: "停用培哚普利，换为氯沙坦50mg qd；螺内酯减量至10mg qd；加用碳酸氢钠1g tid",
            description: "ACEI换ARB + MRA减量 + 碳酸氢钠",
            score: 10,
            feedback:
              "部分正确但非最优。ACEI和ARB都可能引起高钾血症和肾功能影响，换药并不能解决根本问题。螺内酯应该停用而非减量。碳酸氢钠对高钾的降钾作用有限且可能加重心衰（钠负荷）。",
          },
          {
            id: "opt-4-4",
            label: "所有药物剂量不变，加用呋塞米静脉40mg加强利尿；3天后复查",
            description: "原方案不变 + 加强利尿",
            score: 8,
            feedback:
              "加强利尿有助于排钾，但高钾血症和Scr升高的根源是螺内酯+ACEI的联合使用，仅靠利尿不够，需要调整肾素-血管紧张素-醛固酮系统（RAAS）抑制剂的用药方案。",
          },
        ],
        expertExplanation:
          "RAAS抑制剂（ACEI/ARB/ARNI + MRA）使用时最常见的不良反应是高钾血症和肾功能异常。处理原则：①血钾>5.5：考虑停用MRA，ACEI/ARB可继续或减量；②血钾>6.0：停用MRA，ACEI/ARB减量或停用，给予降钾治疗（利尿剂、聚苯乙烯磺酸钠、葡萄糖+胰岛素）；③血钾>6.5或心电图高钾表现：紧急处理，必要时透析；④Scr较基线上升<30%：可继续使用，密切监测；⑤Scr上升30%-50%：考虑减量；⑥Scr上升>50%或绝对值>265μmol/L：建议停药。本患者Scr仅上升16%，ACEI可以减量继续使用，但螺内酯应停用。",
        references: [
          { title: "心血管药物 - ACEI禁忌症和不良反应", type: "chapter", targetId: "chapter-2" },
          { title: "内分泌系统药物 - 高钾血症处理", type: "chapter", targetId: "chapter-6" },
        ],
      },
    ],
    finalSummary:
      "本病例是典型的老年多重慢病患者（高血压、糖尿病、冠心病、心衰、CKD），合并多重用药。诊治过程中需要：①优先处理最紧急的临床问题（急性失代偿性心衰）；②心衰治疗遵循「新四联」方案，注意从小剂量起始并滴定；③根据eGFR调整糖尿病用药，优选具有心肾保护证据的SGLT2i；④避免可能加重心衰的药物（TZD、大剂量CCB）；⑤RAAS抑制剂使用中密切监测肾功能和血钾，出现异常时按照指南原则调整用药。",
    learningPoints: [
      "急性失代偿性心衰的识别要点：呼吸困难、端坐呼吸、水肿、BNP升高",
      "HFrEF标准治疗：ACEI/ARB/ARNI + β受体阻滞剂 + MRA + SGLT2i（新四联）",
      "二甲双胍禁忌症：eGFR<30禁用，eGFR 30-45慎用，急性心衰时建议改用胰岛素",
      "SGLT2i具有明确的心肾保护作用，是糖尿病合并心衰/CKD患者的优选",
      "TZD类（吡格列酮、罗格列酮）可加重心衰，NYHA II-IV级禁用",
      "RAAS抑制剂使用中需密切监测血钾和Scr，掌握停药和减量指征",
      "老年多重慢病患者用药需遵循「少而精」原则，避免不必要的药物",
    ],
    totalMaxScore: 110,
  },
  {
    id: "case-002",
    title: "社区获得性肺炎合并多重基础疾病的治疗",
    difficulty: "medium",
    category: "感染+呼吸+心血管",
    chiefComplaint: "发热、咳嗽、咳痰5天，加重伴气促1天",
    presentIllness:
      "患者，女，65岁，5天前受凉后出现发热（体温最高38.8℃）、咳嗽、咳黄脓痰，伴右侧胸痛。自服「头孢拉定」和「布洛芬」治疗，症状无明显缓解。1天前出现气促，活动后加重，遂来院就诊。既往有支气管哮喘病史20年，高血压病史10年，胃溃疡病史3年。",
    patientInfo: {
      age: 65,
      gender: "female",
      weight: 65,
      height: 160,
      allergies: ["青霉素过敏（休克史）"],
      medicalHistory: [
        "支气管哮喘（中度持续）",
        "原发性高血压2级（高危）",
        "胃溃疡（H.pylori已根除）",
      ],
      currentMedications: [
        {
          name: "沙美特罗替卡松粉吸入剂",
          dose: "50/250μg",
          frequency: "每日2次吸入",
          duration: "5年",
          indication: "支气管哮喘",
        },
        {
          name: "沙丁胺醇气雾剂",
          dose: "100μg/揿",
          frequency: "按需使用",
          duration: "20年",
          indication: "哮喘急性发作",
        },
        {
          name: "缬沙坦胶囊",
          dose: "80mg",
          frequency: "每日1次",
          duration: "8年",
          indication: "高血压",
        },
        {
          name: "奥美拉唑肠溶胶囊",
          dose: "20mg",
          frequency: "每日1次",
          duration: "2年",
          indication: "胃溃疡维持治疗",
        },
      ],
      vitalSigns: [
        { name: "体温", value: "39.1℃", status: "abnormal" },
        { name: "脉搏", value: "110次/分", status: "abnormal" },
        { name: "呼吸", value: "26次/分", status: "abnormal" },
        { name: "血压", value: "135/85mmHg", status: "normal" },
        { name: "血氧饱和度", value: "91%（室内空气）", status: "abnormal" },
      ],
      labResults: [
        { test: "白细胞计数（WBC）", value: "14.2×10⁹/L", reference: "3.5-9.5", status: "abnormal" },
        { test: "中性粒细胞百分比（NEUT%）", value: "88%", reference: "40-75", status: "abnormal" },
        { test: "C反应蛋白（CRP）", value: "128 mg/L", reference: "<10", status: "abnormal" },
        { test: "降钙素原（PCT）", value: "2.5 ng/mL", reference: "<0.05", status: "abnormal" },
        { test: "动脉血气pH", value: "7.46", reference: "7.35-7.45", status: "normal" },
        { test: "PaO₂", value: "68 mmHg", reference: "80-100", status: "abnormal" },
        { test: "PaCO₂", value: "32 mmHg", reference: "35-45", status: "abnormal" },
        { test: "谷丙转氨酶（ALT）", value: "28 U/L", reference: "7-35", status: "normal" },
        { test: "血肌酐（Scr）", value: "78 μmol/L", reference: "41-73", status: "abnormal" },
        { test: "血钾", value: "4.2 mmol/L", reference: "3.5-5.3", status: "normal" },
      ],
    },
    steps: [
      {
        id: "step-1",
        type: "identify",
        title: "第一步：识别主要治疗问题",
        description:
          "分析该患者的临床表现、实验室检查和影像学资料，识别当前最主要的治疗问题和需要关注的特殊情况。",
        question: "该患者当前最主要的治疗问题和需要特别关注的因素是什么？",
        options: [
          {
            id: "opt-1-1",
            label: "社区获得性肺炎（中度）合并I型呼吸衰竭；青霉素过敏史；哮喘病史；胃溃疡病史",
            description: "肺炎+呼衰，需关注过敏史、基础疾病",
            score: 25,
            isOptimal: true,
            feedback:
              "正确识别了核心问题！患者有典型肺炎表现（发热、咳嗽、脓痰、血象高、炎症指标升高），PaO₂ 68mmHg提示I型呼吸衰竭，CURB-65评分2分（年龄>65+呼吸频率>30/分）属于中度CAP。青霉素过敏史、哮喘、胃溃疡都是抗生素选择时需要重点考虑的因素。",
            references: [
              { title: "抗生素", type: "chapter", targetId: "chapter-1" },
              { title: "呼吸系统药物 - 哮喘用药", type: "chapter", targetId: "chapter-4" },
            ],
          },
          {
            id: "opt-1-2",
            label: "支气管哮喘急性发作",
            description: "气促、呼吸频率增快",
            score: 8,
            feedback:
              "患者虽然有哮喘病史，但本次以发热、脓痰、血象高、PCT升高为主要表现，提示感染是主要矛盾。气促是肺炎导致的呼吸衰竭，而非哮喘急性发作（无喘息、无呼气相延长）。",
          },
          {
            id: "opt-1-3",
            label: "高血压急症",
            description: "血压升高",
            score: 3,
            feedback:
              "患者血压135/85mmHg，虽然略高于目标值，但不是高血压急症，与感染应激有关，不是主要治疗问题。",
          },
          {
            id: "opt-1-4",
            label: "急性呼吸窘迫综合征（ARDS）",
            description: "低氧血症、呼吸急促",
            score: 5,
            feedback:
              "诊断过度。患者虽然有低氧血症，但PaO₂/FiO₂=68/0.21≈323，不符合ARDS诊断标准（需<300）。考虑为肺炎所致的I型呼吸衰竭。",
          },
        ],
        expertExplanation:
          "该患者诊断为社区获得性肺炎（CAP），依据：①新出现的咳嗽、咳痰伴发热；②WBC及中性粒细胞升高、CRP和PCT显著升高；③低氧血症。CURB-65评分=2分（年龄65岁+呼吸频率26次/分），属于中度CAP，建议住院治疗。特殊关注点：①青霉素过敏性休克史——β-内酰胺类抗生素选择受限；②哮喘病史——喹诺酮类可能诱发CNS兴奋/癫痫，大环内酯类可能延长QTc；③胃溃疡病史——需注意药物胃肠道刺激，避免使用对胃黏膜有损伤的药物。",
        references: [
          { title: "抗生素 - β内酰胺类过敏处理", type: "chapter", targetId: "chapter-1" },
          { title: "消化系统药物 - PPI", type: "chapter", targetId: "chapter-3" },
        ],
      },
      {
        id: "step-2",
        type: "initial-therapy",
        title: "第二步：选择初始抗感染治疗方案",
        description:
          "根据患者病情严重程度、当地耐药情况、过敏史和合并疾病，选择最恰当的经验性抗感染治疗方案。",
        question: "该患者有青霉素过敏性休克史，以下哪种初始抗感染方案最合适？",
        options: [
          {
            id: "opt-2-1",
            label: "莫西沙星 400mg ivgtt qd",
            description: "呼吸喹诺酮单药治疗",
            score: 30,
            isOptimal: true,
            feedback:
              "最佳选择！莫西沙星是呼吸喹诺酮类，覆盖CAP常见病原体（肺炎链球菌、流感嗜血杆菌、非典型病原体），且对青霉素耐药肺炎链球菌有效。单药治疗适用于非ICU的中度CAP。注意：喹诺酮类在老年患者需关注QT间期延长，该患者血钾正常风险较低。",
            references: [
              { title: "抗生素 - 喹诺酮类", type: "chapter", targetId: "chapter-1" },
            ],
          },
          {
            id: "opt-2-2",
            label: "头孢曲松 2g ivgtt qd + 阿奇霉素 0.5g ivgtt qd",
            description: "第三代头孢 + 大环内酯类联合",
            score: 8,
            feedback:
              "联合方案覆盖面广，但该患者有青霉素过敏性休克史，头孢菌素与青霉素存在交叉过敏风险（约1%-5%），对于严重过敏史者应避免使用头孢曲松。",
          },
          {
            id: "opt-2-3",
            label: "美罗培南 1g ivgtt q8h",
            description: "碳青霉烯类单药",
            score: 5,
            feedback:
              "过度治疗！美罗培南是超广谱抗生素，用于重症感染或怀疑产ESBL菌株感染。社区获得性肺炎常规不需要使用碳青霉烯类，容易导致菌群失调和耐药。",
          },
          {
            id: "opt-2-4",
            label: "万古霉素 15mg/kg ivgtt q12h + 氨曲南 1g ivgtt q8h",
            description: "抗MRSA + 单环β内酰胺类",
            score: 10,
            feedback:
              "方案不合理。万古霉素覆盖MRSA，但社区获得性肺炎中MRSA并不常见，无危险因素时不需要常规覆盖。氨曲南仅覆盖革兰阴性菌，不覆盖肺炎链球菌和非典型病原体。",
          },
        ],
        expertExplanation:
          "根据《中国成人社区获得性肺炎诊断和治疗指南》，对于非ICU住院的CAP患者，经验性抗感染治疗推荐：①青霉素过敏者：呼吸喹诺酮类（莫西沙星、左氧氟沙星）单药；或氨曲南+大环内酯类。②呼吸喹诺酮类的优势：抗菌谱覆盖CAP常见病原体（肺炎链球菌、流感嗜血杆菌、卡他莫拉菌、支原体、衣原体、军团菌），口服生物利用度高，可序贯治疗。注意事项：①喹诺酮类可能延长QTc间期，与大环内酯类、抗心律失常药合用时需谨慎；②避免用于有癫痫史者；③莫西沙星经肝脏代谢，肾功能不全无需调整剂量；④左氧氟沙星主要经肾脏排泄。",
        references: [
          { title: "抗生素 - 喹诺酮类", type: "chapter", targetId: "chapter-1" },
          { title: "抗生素 - 大环内酯类", type: "chapter", targetId: "chapter-1" },
        ],
      },
      {
        id: "step-3",
        type: "adjustment",
        title: "第三步：对症支持治疗和基础疾病调整",
        description:
          "抗感染治疗启动后，还需要考虑对症支持治疗（退热、止咳化痰、氧疗、维持水电平衡）以及基础疾病的用药调整。",
        question:
          "该患者高热39.1℃，咳嗽剧烈，有哮喘病史。以下哪种对症治疗和基础疾病调整方案最合理？",
        options: [
          {
            id: "opt-3-1",
            label: "对乙酰氨基酚 0.5g po prn（体温>38.5℃）；氨溴索 30mg iv tid；布地奈德雾化吸入2mg bid；沙丁胺醇雾化吸入2.5mg q6h prn；继续缬沙坦+奥美拉唑",
            description: "对乙酰氨基酚退热 + 氨溴索祛痰 + ICS+SABA雾化 + 维持基础用药",
            score: 28,
            isOptimal: true,
            feedback:
              "方案周全合理！①对乙酰氨基酚退热对胃肠道刺激小，适合胃溃疡患者；②氨溴索促进排痰；③布地奈德（ICS）+沙丁胺醇（SABA）雾化吸入可扩张支气管、减轻气道炎症，预防哮喘发作；④缬沙坦可继续使用，奥美拉唑继续维持胃溃疡治疗。",
            references: [
              { title: "呼吸系统药物 - SABA和ICS", type: "chapter", targetId: "chapter-4" },
              { title: "神经系统药物 - 解热镇痛药", type: "chapter", targetId: "chapter-5" },
            ],
          },
          {
            id: "opt-3-2",
            label: "布洛芬 0.2g po tid；可待因 30mg po tid；氨茶碱 0.25g ivgtt bid；停用缬沙坦",
            description: "布洛芬退热 + 可待因镇咳 + 氨茶碱平喘 + 停用降压药",
            score: 5,
            feedback:
              "方案有多处问题：①布洛芬对胃肠道刺激大，胃溃疡患者应避免；②可待因抑制排痰，肺炎患者不宜使用强效镇咳药；③氨茶碱治疗窗窄，不良反应多，且与喹诺酮类（莫西沙星）合用可能增加氨茶碱血药浓度；④感染应激时血压正常或偏低无需停用缬沙坦。",
          },
          {
            id: "opt-3-3",
            label: "物理降温为主；右美沙芬 15mg po qid；口服泼尼松 10mg qd；加用头孢呋辛",
            description: "物理降温 + 右美沙芬 + 口服激素 + 加用头孢",
            score: 12,
            feedback:
              "部分合理但存在问题：①高热仅物理降温可能不够；②右美沙芬是中枢镇咳药，肺炎患者应以祛痰为主；③口服全身性激素副作用大，哮喘患者首选ICS雾化吸入；④头孢呋辛在青霉素严重过敏时风险大，且已有莫西沙星覆盖无需加用。",
          },
          {
            id: "opt-3-4",
            label: "阿司匹林 0.5g po q6h；乙酰半胱氨酸 0.6g po tid；色甘酸钠气雾剂 2揿 qid",
            description: "阿司匹林退热 + 乙酰半胱氨酸祛痰 + 色甘酸钠",
            score: 8,
            feedback:
              "方案不理想：①阿司匹林胃肠道刺激大，胃溃疡患者慎用，且可能诱发哮喘（阿司匹林哮喘）；②乙酰半胱氨酸祛痰尚可；③色甘酸钠是哮喘预防用药，对当前气道炎症控制效果差。",
          },
        ],
        expertExplanation:
          "肺炎合并哮喘患者的对症治疗要点：①退热：对乙酰氨基酚（泰诺林）胃肠道刺激小，首选；避免阿司匹林（可能诱发哮喘）和大剂量NSAIDs（刺激胃黏膜）；②祛痰排痰为主，避免强效镇咳药（如可待因）——氨溴索、乙酰半胱氨酸均可选用；③支气管扩张剂和抗炎：沙丁胺醇（SABA）按需使用，加用ICS雾化吸入（布地奈德）预防哮喘发作，比口服全身性激素副作用小；④基础疾病用药：降压药继续使用，PPI继续维持胃溃疡治疗；⑤药物相互作用提醒：喹诺酮类（莫西沙星、环丙沙星）可抑制氨茶碱代谢，增加其血药浓度和不良反应风险，应避免联用或密切监测茶碱血药浓度。",
        references: [
          { title: "呼吸系统药物", type: "chapter", targetId: "chapter-4" },
          { title: "神经系统药物 - 解热镇痛药", type: "chapter", targetId: "chapter-5" },
          { title: "消化系统药物 - PPI", type: "chapter", targetId: "chapter-3" },
        ],
      },
      {
        id: "step-4",
        type: "adr-management",
        title: "第四步：处理治疗过程中的药物不良反应",
        description:
          "经过5天治疗，患者体温恢复正常，咳嗽咳痰明显减轻，血气改善。但在治疗过程中出现了一些新的症状。",
        question:
          "治疗第5天，患者出现烦躁、失眠、双手轻微震颤，心率105次/分，心电图QTc间期480ms（基线420ms）。以下哪种处理方式最合理？",
        options: [
          {
            id: "opt-4-1",
            label: "评估沙丁胺醇使用频率；改为口服莫西沙星序贯治疗；监测血钾和QTc；必要时调整或停用喹诺酮类；给予短效苯二氮䓬类改善睡眠",
            description: "评估SABA使用 + 静脉转口服 + 监测QTc + 对症处理失眠",
            score: 27,
            isOptimal: true,
            feedback:
              "分析全面，处理合理！①烦躁、失眠、震颤、心动过速可能是沙丁胺醇（β受体激动剂）的副作用，也可能与喹诺酮类的CNS兴奋作用有关；②静脉莫西沙星转口服是标准序贯疗法；③QTc 480ms属于轻度延长（<500ms），需监测血钾（低钾会加重QT延长），如继续延长需更换抗生素；④短期使用小剂量苯二氮䓬类（如阿普唑仑）可安全改善失眠。",
            references: [
              { title: "抗生素 - 喹诺酮类不良反应", type: "chapter", targetId: "chapter-1" },
              { title: "呼吸系统药物 - SABA不良反应", type: "chapter", targetId: "chapter-4" },
            ],
          },
          {
            id: "opt-4-2",
            label: "立即停用莫西沙星，改用万古霉素+甲硝唑；给予普萘洛尔10mg tid；地西泮10mg qn",
            description: "更换抗生素 + 普萘洛尔 + 地西泮",
            score: 3,
            feedback:
              "处理过度。①万古霉素+甲硝唑完全不覆盖CAP常见病原体；②普萘洛尔是非选择性β受体阻滞剂，可能诱发支气管痉挛，哮喘患者禁用；③地西泮剂量偏大，老年人慎用长效苯二氮䓬类。",
          },
          {
            id: "opt-4-3",
            label: "加用美托洛尔缓释片47.5mg qd控制心率；奋乃静2mg qn改善失眠",
            description: "选择性β阻滞剂 + 抗精神病药",
            score: 8,
            feedback:
              "不合适。①心动过速和震颤是β受体激动剂或喹诺酮类的药物副作用，应去除诱因而不是用β阻滞剂对抗（虽然美托洛尔是选择性β1，但哮喘患者仍需谨慎）；②奋乃静是典型抗精神病药，锥体外系副作用大，不用于单纯失眠。",
          },
          {
            id: "opt-4-4",
            label: "所有药物剂量减半；观察24小时；加用氯化钾缓释片1g tid",
            description: "全面减量 + 经验性补钾",
            score: 10,
            feedback:
              "过于保守且不精确。①虽然血钾正常时补钾可预防QT延长，但经验性补钾不必要；②抗感染药物剂量减半可能导致治疗失败和耐药；③应该找出症状的具体原因（SABA？喹诺酮？）并针对性处理。",
          },
        ],
        expertExplanation:
          "本例中出现的症状需要鉴别原因：①沙丁胺醇（短效β2受体激动剂）常见不良反应：心悸、手抖、头痛、低钾血症、失眠；②喹诺酮类（莫西沙星）不良反应：CNS兴奋（失眠、烦躁、震颤）、QT间期延长。两者都可能导致相似症状，需要评估SABA的使用频率（是否过于频繁）。处理原则：①QTc<500ms且无室性心律失常：可继续使用喹诺酮类，密切监测，纠正低钾/低镁等危险因素；②QTc>500ms或较基线延长>60ms，或出现TdP：立即停用喹诺酮类；③CNS兴奋症状：轻者观察，重者可减量或换药，短期使用小剂量苯二氮䓬类是安全的；④哮喘患者避免使用非选择性β受体阻滞剂（普萘洛尔），选择性β1阻滞剂也需谨慎。",
        references: [
          { title: "抗生素 - 喹诺酮类QT间期延长", type: "chapter", targetId: "chapter-1" },
          { title: "神经系统药物 - 苯二氮䓬类", type: "chapter", targetId: "chapter-5" },
        ],
      },
    ],
    finalSummary:
      "本病例为社区获得性肺炎合并支气管哮喘、高血压、胃溃疡的多重慢病患者。诊疗要点：①准确识别CAP并评估严重程度，CURB-65评分指导治疗决策；②青霉素过敏史患者，呼吸喹诺酮类（莫西沙星）是经验性治疗的优选；③哮喘合并感染时，应加强支气管扩张剂和吸入性激素的使用，预防哮喘急性发作；④对症治疗注重药物安全性选择（对乙酰氨基酚退热、氨溴索祛痰、避免强效镇咳）；⑤治疗过程中需监测喹诺酮类和β2受体激动剂的不良反应（CNS兴奋、QTc延长、心血管症状），并按照原则进行处理。",
    learningPoints: [
      "社区获得性肺炎严重程度评估：CURB-65评分（意识、尿素、呼吸频率、血压、年龄）",
      "青霉素过敏者CAP首选：呼吸喹诺酮类（莫西沙星、左氧氟沙星）",
      "肺炎患者对症治疗原则：祛痰优先，避免强效镇咳药",
      "喹诺酮类常见不良反应：胃肠道反应、CNS兴奋、QT间期延长、肌腱炎/肌腱断裂",
      "β2受体激动剂常见不良反应：心悸、手抖、低钾血症",
      "哮喘患者避免使用阿司匹林和非选择性β受体阻滞剂",
      "静脉抗感染有效后，提倡序贯治疗（静脉转口服），缩短住院时间",
    ],
    totalMaxScore: 110,
  },
];

export const getDifficultyLabel = (difficulty: "easy" | "medium" | "hard") => {
  const map = { easy: "初级", medium: "中级", hard: "高级" };
  return map[difficulty];
};

export const getDifficultyColor = (difficulty: "easy" | "medium" | "hard") => {
  const map = {
    easy: "bg-green-50 text-green-700 border-green-200",
    medium: "bg-amber-50 text-amber-700 border-amber-200",
    hard: "bg-rose-50 text-rose-700 border-rose-200",
  };
  return map[difficulty];
};

export const getStepTypeLabel = (type: string) => {
  const map: Record<string, string> = {
    identify: "识别问题",
    "initial-therapy": "初始治疗",
    adjustment: "方案调整",
    "adr-management": "不良反应处理",
  };
  return map[type] || type;
};

export const getScoreLevel = (score: number, maxScore: number) => {
  const ratio = score / maxScore;
  if (ratio >= 0.9) return { label: "优秀", color: "text-emerald-600", bg: "bg-emerald-50" };
  if (ratio >= 0.75) return { label: "良好", color: "text-blue-600", bg: "bg-blue-50" };
  if (ratio >= 0.6) return { label: "合格", color: "text-amber-600", bg: "bg-amber-50" };
  return { label: "需加强", color: "text-rose-600", bg: "bg-rose-50" };
};
