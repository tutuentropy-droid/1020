import { ADRCase } from "@/types";

export const adrCases: ADRCase[] = [
  {
    id: "adr-001",
    title: "青霉素致过敏性休克",
    patientInfo: {
      age: 28,
      gender: "female",
      weight: 58,
      allergies: ["青霉素类药物过敏史（自述）"],
      medicalHistory: ["无特殊病史"],
    },
    caseDescription:
      "患者，女，28岁，因急性扁桃体炎就诊。既往自述青霉素过敏，但本次皮试结果显示阴性。给予注射用青霉素钠800万单位静脉滴注，滴注约5分钟后，患者突然出现胸闷、呼吸困难、面色苍白、出冷汗、血压降至70/40mmHg，脉搏120次/分，意识模糊。立即停药，给予肾上腺素、地塞米松等抢救治疗，30分钟后症状逐渐缓解。",
    symptoms: ["胸闷", "呼吸困难", "面色苍白", "出冷汗", "血压骤降", "意识模糊", "心动过速"],
    medicationsTaken: [
      {
        name: "注射用青霉素钠",
        dose: "800万单位",
        frequency: "每日1次",
        duration: "首次用药",
        indication: "急性扁桃体炎",
      },
    ],
    correctAnswer: {
      isADR: true,
      suspectedDrugs: ["注射用青霉素钠"],
      severity: "severe",
      causality: "definite",
      summary:
        "患者静脉滴注青霉素钠5分钟后出现过敏性休克症状，停药并经抗休克治疗后缓解，高度怀疑为青霉素所致严重过敏反应。",
      naranjoScore: 9,
    },
    explanation: {
      isADRReason:
        "这是典型的药物不良反应。患者在用药后极短时间内出现过敏性休克表现，符合药物不良反应的时间相关性和临床表现。",
      suspectedDrugsReason:
        "高度怀疑注射用青霉素钠。虽然皮试阴性，但患者有青霉素过敏史，且症状出现在用药后5分钟，具有明确的时间关联性。青霉素是引起过敏性休克最常见的药物之一。",
      severityReason:
        "严重（Severe）。患者出现血压骤降（70/40mmHg）、意识模糊、呼吸困难等危及生命的症状，需要紧急抢救处理，符合严重不良反应的定义。",
      causalityReason:
        "根据WHO-UMC标准，评定为'肯定（Definite）'。依据：①用药与不良反应的出现有合理的时间关系（5分钟）；②反应符合该药已知的不良反应类型（青霉素过敏性休克）；③停药后反应停止或缓解；④不能用患者的临床状态或其他疗法来解释。",
      summaryExample:
        "患者女性，28岁，因急性扁桃体炎予青霉素钠800万单位静脉滴注，用药约5分钟后出现胸闷、呼吸困难、血压下降至70/40mmHg、意识模糊等过敏性休克表现。立即停药并予肾上腺素等抗过敏抗休克治疗，30分钟后症状缓解。既往有青霉素过敏史。综合判断为青霉素所致过敏性休克，因果关系评价为肯定。",
    },
    learningPoints: [
      "即使皮试阴性，有青霉素过敏史的患者仍可能发生过敏反应",
      "过敏性休克属于严重不良反应，必须立即上报",
      "青霉素类药物使用前必须详细询问过敏史",
      "WHO-UMC因果关系评价标准中，'肯定'需要满足时间合理、反应类型已知、停药后缓解、无法用其他因素解释",
    ],
  },
  {
    id: "adr-002",
    title: "阿托伐他汀致横纹肌溶解",
    patientInfo: {
      age: 65,
      gender: "male",
      weight: 75,
      allergies: [],
      medicalHistory: ["高脂血症", "高血压", "2型糖尿病"],
    },
    caseDescription:
      "患者，男，65岁，因高脂血症服用阿托伐他汀钙片20mg qn，已用药2个月。近1周出现全身肌肉酸痛、乏力，伴尿色加深呈茶色。查体：四肢肌肉压痛明显。实验室检查：肌酸激酶（CK）15,800 U/L（正常参考值26-140 U/L），肌红蛋白阳性，肌酐156 μmol/L。考虑为药物所致横纹肌溶解，立即停用阿托伐他汀，给予补液、碱化尿液等治疗，2周后CK恢复正常。",
    symptoms: ["全身肌肉酸痛", "乏力", "尿色加深（茶色尿）", "肌肉压痛", "肾功能异常"],
    medicationsTaken: [
      {
        name: "阿托伐他汀钙片",
        dose: "20mg",
        frequency: "每晚1次",
        duration: "2个月",
        indication: "高脂血症",
      },
      {
        name: "苯磺酸氨氯地平片",
        dose: "5mg",
        frequency: "每日1次",
        duration: "1年",
        indication: "高血压",
      },
      {
        name: "盐酸二甲双胍片",
        dose: "500mg",
        frequency: "每日2次",
        duration: "1年",
        indication: "2型糖尿病",
      },
    ],
    correctAnswer: {
      isADR: true,
      suspectedDrugs: ["阿托伐他汀钙片"],
      severity: "severe",
      causality: "probable",
      summary:
        "患者服用阿托伐他汀2个月后出现肌肉酸痛、茶色尿，实验室检查提示横纹肌溶解，停用阿托伐他汀并予对症治疗后恢复，考虑为阿托伐他汀所致横纹肌溶解症。",
      naranjoScore: 7,
    },
    explanation: {
      isADRReason:
        "这是明确的药物不良反应。横纹肌溶解是他汀类药物已知的严重不良反应，用药2个月后出现典型症状，停药后恢复，符合ADR特征。",
      suspectedDrugsReason:
        "主要怀疑阿托伐他汀钙片。他汀类药物是横纹肌溶解最常见的致病药物。氨氯地平和二甲双胍一般不引起横纹肌溶解，且患者已长期服用未出现症状。",
      severityReason:
        "严重（Severe）。横纹肌溶解可导致急性肾衰竭等严重后果，CK超过正常值100倍以上，已出现肾功能异常，符合严重不良反应标准。",
      causalityReason:
        "根据WHO-UMC标准，评定为'很可能（Probable）'。依据：①用药与反应出现有合理时间关系（2个月）；②反应符合该药已知不良反应类型（他汀类致肌病）；③停药后症状改善；④但缺乏再次用药的验证，故为'很可能'而非'肯定'。",
      summaryExample:
        "患者男性，65岁，高脂血症病史，服用阿托伐他汀20mg qn 2个月后出现全身肌肉酸痛、茶色尿，查CK 15800 U/L，肌红蛋白阳性，肌酐升高。停用阿托伐他汀并予补液碱化尿液等治疗后，2周CK恢复正常。考虑为阿托伐他汀所致横纹肌溶解症，因果关系评价为很可能。",
    },
    learningPoints: [
      "他汀类药物的严重不良反应包括肌痛、肌病、横纹肌溶解",
      "用药期间应监测CK，如出现肌肉症状应及时检测",
      "横纹肌溶解可导致急性肾衰竭，属于严重不良反应需立即上报",
      "Naranjo评分7分以上提示因果关系为很可能或肯定",
    ],
  },
  {
    id: "adr-003",
    title: "华法林致消化道出血",
    patientInfo: {
      age: 72,
      gender: "female",
      weight: 52,
      allergies: [],
      medicalHistory: ["心房颤动", "胃溃疡病史"],
    },
    caseDescription:
      "患者，女，72岁，因心房颤动服用华法林钠片2.5mg qd，定期监测INR（国际标准化比值）维持在2.0-2.5之间。3天前因头痛自行服用布洛芬缓释胶囊0.3g bid，今日出现黑便、呕血，伴头晕、乏力。查体：血压95/60mmHg，心率105次/分，贫血貌。实验室检查：Hb 72g/L，INR 5.8。胃镜示胃黏膜弥漫性出血。立即停用华法林和布洛芬，给予维生素K1、质子泵抑制剂、输血等治疗，出血停止。",
    symptoms: ["黑便", "呕血", "头晕", "乏力", "贫血貌", "血压下降", "心率增快"],
    medicationsTaken: [
      {
        name: "华法林钠片",
        dose: "2.5mg",
        frequency: "每日1次",
        duration: "1年",
        indication: "心房颤动抗凝治疗",
      },
      {
        name: "布洛芬缓释胶囊",
        dose: "0.3g",
        frequency: "每日2次",
        duration: "3天",
        indication: "头痛（自行服用）",
      },
    ],
    correctAnswer: {
      isADR: true,
      suspectedDrugs: ["华法林钠片", "布洛芬缓释胶囊"],
      severity: "severe",
      causality: "probable",
      summary:
        "患者长期服用华法林抗凝，INR控制良好，加用布洛芬3天后出现消化道大出血，INR显著升高至5.8，考虑为华法林与布洛芬联用导致的严重药物不良反应。",
      naranjoScore: 8,
    },
    explanation: {
      isADRReason:
        "这是明确的药物不良反应，且为药物相互作用所致。华法林和NSAIDs（布洛芬）联用可显著增加出血风险。",
      suspectedDrugsReason:
        "怀疑两种药物：①华法林钠片：作为抗凝剂，INR升高至5.8是出血的直接原因；②布洛芬缓释胶囊：NSAIDs可抑制血小板功能、损伤胃黏膜，并可能与华法林发生相互作用增强抗凝效果。患者服用布洛芬前INR控制良好，加用后迅速出血，两者均为可疑药物。",
      severityReason:
        "严重（Severe）。患者出现呕血、黑便，血红蛋白显著下降（72g/L），血流动力学不稳定（血压下降），需要输血等紧急处理，符合严重不良反应定义。",
      causalityReason:
        "根据WHO-UMC标准，评定为'很可能（Probable）'。依据：①加用布洛芬后3天出现出血，时间合理；②符合已知的药物相互作用（华法林+NSAIDs增加出血风险）；③停用两药并予拮抗治疗后出血停止；④患者有胃溃疡病史为危险因素。",
      summaryExample:
        "患者女性，72岁，因房颤服用华法林2.5mg qd 1年，INR维持在2.0-2.5。3天前因头痛自行加服布洛芬0.3g bid，随后出现黑便、呕血，查Hb 72g/L，INR 5.8。经停药、维生素K1、输血等治疗后出血停止。考虑为华法林与布洛芬联用所致消化道大出血，因果关系评价为很可能。",
    },
    learningPoints: [
      "华法林与NSAIDs联用可显著增加出血风险，属于严重药物相互作用",
      "服用华法林的患者应避免自行服用其他药物，尤其是NSAIDs",
      "华法林治疗期间应密切监测INR",
      "有胃溃疡病史的患者使用NSAIDs和抗凝剂风险更高",
    ],
  },
  {
    id: "adr-004",
    title: "急性胃肠炎（非ADR病例）",
    patientInfo: {
      age: 35,
      gender: "male",
      weight: 70,
      allergies: [],
      medicalHistory: [],
    },
    caseDescription:
      "患者，男，35岁，因急性支气管炎就诊，予头孢克肟胶囊0.2g bid口服。服药第2天，患者出现恶心、呕吐、腹痛、腹泻水样便（每日5-6次），伴低热（37.8℃）。追问病史，患者发病前一天在外就餐食用过海鲜，同餐者中2人也出现类似胃肠道症状。查体：腹软，脐周轻压痛，无反跳痛。实验室检查：血常规WBC 10.2×10^9/L，中性粒细胞75%，便常规白细胞（+）。予口服补液、蒙脱石散等对症处理，3天后症状缓解，未停用头孢克肟完成疗程。",
    symptoms: ["恶心", "呕吐", "腹痛", "腹泻（水样便）", "低热"],
    medicationsTaken: [
      {
        name: "头孢克肟胶囊",
        dose: "0.2g",
        frequency: "每日2次",
        duration: "2天",
        indication: "急性支气管炎",
      },
    ],
    correctAnswer: {
      isADR: false,
      suspectedDrugs: [],
      severity: "moderate",
      causality: "unlikely",
      summary:
        "患者服用头孢克肟2天后出现胃肠道症状，但同餐者有类似症状，更可能为急性食物中毒/感染性胃肠炎，不考虑为药物不良反应。",
      naranjoScore: 1,
    },
    explanation: {
      isADRReason:
        "本例不应判断为药物不良反应。虽然头孢克肟也可能引起胃肠道反应，但有更明确的病因——食物中毒/感染性胃肠炎。",
      suspectedDrugsReason:
        "不怀疑药物。虽然头孢类抗生素可能引起腹泻、恶心等胃肠道反应，但本例存在明显的流行病学线索（不洁饮食史、同餐者多人发病），更符合感染性胃肠炎。",
      severityReason:
        "如果按患者当前症状评估，属于中度（Moderate）。但本症状并非药物所致，因此严重程度不用于ADR分级。",
      causalityReason:
        "根据WHO-UMC标准，评定为'可能无关（Unlikely）'。依据：①虽然症状出现时间看似与用药相关，但有明确的替代病因（不洁饮食史，同餐者发病）；②症状不符合典型的抗生素相关性腹泻特点（一般出现较晚，多在用药后5-10天）；③不太可能是药物所致。",
      summaryExample:
        "患者男性，35岁，因急性支气管炎予头孢克肟0.2g bid口服2天后出现恶心、呕吐、腹痛、水样腹泻。追问病史，发病前1天在外就餐且同餐者2人有类似症状，便常规白细胞（+），考虑为急性感染性胃肠炎/食物中毒，与药物关系不大。予对症处理后缓解，继续完成抗生素疗程。",
    },
    learningPoints: [
      "判断ADR时需要详细问诊，排除其他可能病因",
      "有共同暴露史（如不洁饮食）且多人发病时，应首先考虑感染/中毒而非ADR",
      "抗生素相关性腹泻通常在用药后5-10天出现，本例时间过早",
      "鉴别诊断是ADR判断中的重要环节",
    ],
  },
  {
    id: "adr-005",
    title: "卡托普利致干咳",
    patientInfo: {
      age: 56,
      gender: "female",
      weight: 62,
      allergies: [],
      medicalHistory: ["高血压"],
    },
    caseDescription:
      "患者，女，56岁，因高血压开始服用卡托普利片25mg tid，用药1个月后出现刺激性干咳，夜间为甚，无咳痰、发热、胸闷。胸片未见异常，血常规嗜酸性粒细胞正常，肺功能正常。患者自行服用止咳药物无效。考虑为卡托普利所致咳嗽，更换为缬沙坦胶囊80mg qd，1周后咳嗽完全消失。",
    symptoms: ["刺激性干咳", "夜间加重"],
    medicationsTaken: [
      {
        name: "卡托普利片",
        dose: "25mg",
        frequency: "每日3次",
        duration: "1个月",
        indication: "高血压",
      },
    ],
    correctAnswer: {
      isADR: true,
      suspectedDrugs: ["卡托普利片"],
      severity: "mild",
      causality: "probable",
      summary:
        "患者服用卡托普利1个月后出现刺激性干咳，各项检查排除其他病因，停药更换为ARB后咳嗽消失，考虑为ACEI类药物所致的典型不良反应。",
      naranjoScore: 6,
    },
    explanation: {
      isADRReason:
        "这是典型的药物不良反应。ACEI类药物引起的干咳发生率约10%-20%，机制与缓激肽积聚有关。",
      suspectedDrugsReason:
        "高度怀疑卡托普利片。ACEI类药物引起干咳是其最常见的不良反应之一，更换为ARB类药物后症状消失，进一步证实。",
      severityReason:
        "轻度（Mild）。干咳虽影响生活质量，但未造成器质性损害，无需特殊治疗，仅需换药即可缓解。",
      causalityReason:
        "根据WHO-UMC标准，评定为'很可能（Probable）'。依据：①用药1个月后出现咳嗽，时间合理；②符合ACEI已知的不良反应类型；③停药（换药）后咳嗽消失；④各项检查排除了其他引起咳嗽的原因。",
      summaryExample:
        "患者女性，56岁，高血压病史，服用卡托普利25mg tid 1个月后出现刺激性干咳，夜间明显，胸片及肺功能正常。更换为缬沙坦后1周咳嗽完全消失。考虑为卡托普利所致干咳，因果关系评价为很可能。",
    },
    learningPoints: [
      "ACEI类药物最常见的不良反应是干咳，发生率约10%-20%",
      "ACEI引起的干咳机制与缓激肽积聚有关，ARB类一般不引起干咳",
      "轻度不良反应虽不危及生命，但也需按规定上报",
      "换药后症状缓解是支持药物因果关系的重要证据",
    ],
  },
  {
    id: "adr-006",
    title: "别嘌醇致重症药疹（Stevens-Johnson综合征）",
    patientInfo: {
      age: 48,
      gender: "male",
      weight: 80,
      allergies: [],
      medicalHistory: ["痛风", "慢性肾功能不全（CKD 3期）"],
    },
    caseDescription:
      "患者，男，48岁，因痛风高尿酸血症服用别嘌醇片0.1g tid（未根据肾功能调整剂量），用药3周后出现发热（39.2℃）、全身皮疹，伴口腔黏膜溃疡、眼结膜充血、皮肤水疱。皮疹从面部蔓延至全身，部分区域出现表皮剥脱。查体：T 39.5℃，全身皮肤可见广泛红斑、丘疹、水疱，尼氏征阳性，口腔、眼结膜、生殖器黏膜均见糜烂。实验室检查：WBC 12.5×10^9/L，嗜酸粒细胞升高，肝酶轻度升高。诊断为Stevens-Johnson综合征（重症药疹）。立即停用别嘌醇，给予大剂量糖皮质激素、静脉用免疫球蛋白、皮肤黏膜护理等综合治疗，1个月后逐渐好转，遗留皮肤色素沉着。",
    symptoms: [
      "高热",
      "全身广泛红斑、丘疹、水疱",
      "表皮剥脱",
      "口腔黏膜溃疡",
      "眼结膜充血",
      "生殖器黏膜糜烂",
      "嗜酸粒细胞升高",
    ],
    medicationsTaken: [
      {
        name: "别嘌醇片",
        dose: "0.1g",
        frequency: "每日3次",
        duration: "3周",
        indication: "痛风（高尿酸血症）",
      },
    ],
    correctAnswer: {
      isADR: true,
      suspectedDrugs: ["别嘌醇片"],
      severity: "severe",
      causality: "definite",
      summary:
        "患者服用别嘌醇3周后出现重症药疹（Stevens-Johnson综合征），累及全身皮肤黏膜，经大剂量激素等治疗后好转，考虑为别嘌醇所致严重皮肤不良反应。",
      naranjoScore: 9,
    },
    explanation: {
      isADRReason:
        "这是明确的严重药物不良反应。Stevens-Johnson综合征（SJS）和中毒性表皮坏死松解症（TEN）是最严重的药物不良反应之一，死亡率高。",
      suspectedDrugsReason:
        "高度怀疑别嘌醇片。别嘌醇是引起重症药疹的常见药物，尤其是HLA-B*5801阳性患者和肾功能不全患者风险更高。本例患者有CKD 3期且未调整剂量，为高危因素。",
      severityReason:
        "严重（Severe）。Stevens-Johnson综合征属于严重不良反应，可危及生命，死亡率约5%-10%，本例累及全身皮肤黏膜，需住院进行重症治疗。",
      causalityReason:
        "根据WHO-UMC标准，评定为'肯定（Definite）'。依据：①用药3周后出现重症药疹，时间关系合理（别嘌醇药疹多在用药后数周出现）；②符合别嘌醇已知的严重不良反应类型；③停药后经治疗逐渐好转；④症状和体征典型，无其他更合理的病因。",
      summaryExample:
        "患者男性，48岁，痛风病史伴CKD 3期，服用别嘌醇0.1g tid 3周后出现高热、全身广泛皮疹水疱、口腔眼生殖器黏膜糜烂，诊断为Stevens-Johnson综合征。停药后予大剂量糖皮质激素、IVIG等治疗1个月后好转。考虑为别嘌醇所致重症药疹，因果关系评价为肯定。HLA-B*5801基因检测建议必要时进行。",
    },
    learningPoints: [
      "别嘌醇是引起重症药疹（SJS/TEN）的常见药物",
      "肾功能不全患者使用别嘌醇应调整剂量",
      "亚裔人群使用别嘌醇前建议检测HLA-B*5801基因",
      "重症药疹属于严重不良反应，必须立即停药并积极治疗",
    ],
  },
];
