import { TDMDrugParam, ClinicalExample } from "@/types";

export const tdmDrugs: TDMDrugParam[] = [
  {
    id: "1",
    name: "万古霉素",
    category: "糖肽类抗生素",
    therapeuticRange: "15-20",
    therapeuticMin: 15,
    therapeuticMax: 20,
    toxicLevel: 25,
    volumeOfDistribution: 0.7,
    clearance: 0.05,
    halfLife: 6,
    bioavailability: 1,
    unit: "μg/mL",
    description:
      "万古霉素是治疗耐甲氧西林金黄色葡萄球菌（MRSA）等革兰阳性菌感染的一线药物，治疗窗窄，需常规进行谷浓度监测。",
    monitoringPoints: [
      "谷浓度：下次给药前30分钟内采样",
      "推荐稳态谷浓度：15-20 μg/mL（重症感染）",
      "常规感染谷浓度：10-15 μg/mL",
      "给药后第3-4剂开始监测",
    ],
  },
  {
    id: "2",
    name: "地高辛",
    category: "强心苷类",
    therapeuticRange: "0.8-2.0",
    therapeuticMin: 0.8,
    therapeuticMax: 2.0,
    toxicLevel: 2.4,
    volumeOfDistribution: 7.3,
    clearance: 0.004,
    halfLife: 40,
    bioavailability: 0.75,
    unit: "ng/mL",
    description:
      "地高辛用于心力衰竭和心房颤动的治疗，治疗窗极窄，个体差异大，易发生中毒，需严格监测血药浓度。",
    monitoringPoints: [
      "给药后6-8小时采样（分布平衡后）",
      "稳态后监测，通常给药后5-7天",
      "心房颤动患者目标浓度可略高（1.0-2.0 ng/mL）",
      "心力衰竭患者目标浓度宜低（0.5-0.9 ng/mL）",
    ],
  },
  {
    id: "3",
    name: "茶碱",
    category: "黄嘌呤类",
    therapeuticRange: "10-20",
    therapeuticMin: 10,
    therapeuticMax: 20,
    toxicLevel: 25,
    volumeOfDistribution: 0.5,
    clearance: 0.04,
    halfLife: 8,
    bioavailability: 1,
    unit: "μg/mL",
    description:
      "茶碱用于支气管哮喘和COPD的治疗，治疗窗窄，代谢受多种因素（吸烟、合并用药、肝肾功能）影响。",
    monitoringPoints: [
      "缓释制剂：谷浓度采样",
      "静脉给药：给药结束后30分钟采样",
      "吸烟者清除率增加50-100%",
      "充血性心力衰竭、肝硬化患者清除率降低",
    ],
  },
  {
    id: "4",
    name: "庆大霉素",
    category: "氨基糖苷类抗生素",
    therapeuticRange: "5-10",
    therapeuticMin: 5,
    therapeuticMax: 10,
    toxicLevel: 12,
    volumeOfDistribution: 0.25,
    clearance: 0.09,
    halfLife: 2.5,
    bioavailability: 1,
    unit: "μg/mL",
    description:
      "庆大霉素为浓度依赖性抗生素，峰浓度决定杀菌效果，谷浓度与肾毒性和耳毒性相关。",
    monitoringPoints: [
      "峰浓度：静脉滴注结束后30分钟",
      "谷浓度：下次给药前",
      "目标峰浓度：6-10 μg/mL（传统给药）",
      "目标谷浓度：<1 μg/mL（避免蓄积毒性）",
    ],
  },
  {
    id: "5",
    name: "苯妥英钠",
    category: "抗癫痫药",
    therapeuticRange: "10-20",
    therapeuticMin: 10,
    therapeuticMax: 20,
    toxicLevel: 30,
    volumeOfDistribution: 0.65,
    clearance: 0.01,
    halfLife: 24,
    bioavailability: 0.9,
    unit: "μg/mL",
    description:
      "苯妥英钠为零级动力学消除的经典药物，剂量稍有增加即可导致血药浓度显著升高，具有非线性药代动力学特征。",
    monitoringPoints: [
      "稳态后采样（给药后7-10天）",
      "静脉给药后1-2小时采样",
      "口服给药后3-12小时采样",
      "低蛋白血症患者需监测游离药物浓度",
    ],
  },
  {
    id: "6",
    name: "卡马西平",
    category: "抗癫痫药",
    therapeuticRange: "4-12",
    therapeuticMin: 4,
    therapeuticMax: 12,
    toxicLevel: 15,
    volumeOfDistribution: 1.4,
    clearance: 0.001,
    halfLife: 30,
    bioavailability: 0.8,
    unit: "μg/mL",
    description:
      "卡马西平具有自身诱导代谢作用，初始给药后半衰期逐渐缩短，需在用药数周后重新评估剂量。",
    monitoringPoints: [
      "稳态谷浓度采样",
      "初始治疗后2周、1个月、3个月监测",
      "加用酶诱导剂后需增加剂量",
      "注意监测白细胞、肝功能",
    ],
  },
  {
    id: "7",
    name: "环孢素",
    category: "免疫抑制剂",
    therapeuticRange: "100-400",
    therapeuticMin: 100,
    therapeuticMax: 400,
    toxicLevel: 500,
    volumeOfDistribution: 4.5,
    clearance: 0.006,
    halfLife: 12,
    bioavailability: 0.3,
    unit: "ng/mL",
    description:
      "环孢素为器官移植后抗排异的关键药物，生物利用度个体差异极大，与多种药物存在相互作用。",
    monitoringPoints: [
      "谷浓度采样（C0）：下次给药前",
      "2小时浓度（C2）：给药后2小时",
      "不同移植类型目标浓度不同",
      "需监测肾功能、血压、血药浓度",
    ],
  },
  {
    id: "8",
    name: "华法林",
    category: "口服抗凝药",
    therapeuticRange: "1.0-3.0",
    therapeuticMin: 2,
    therapeuticMax: 3,
    toxicLevel: 4,
    volumeOfDistribution: 0.14,
    clearance: 0.002,
    halfLife: 40,
    bioavailability: 1,
    unit: "INR",
    description:
      "华法林通过抑制维生素K依赖性凝血因子发挥抗凝作用，治疗窗窄，个体差异大，需通过INR监测调整剂量。",
    monitoringPoints: [
      "监测指标：INR（国际标准化比值）",
      "起始治疗：每日或隔日监测",
      "稳定期：每4周监测1次",
      "目标INR：2.0-3.0（多数适应症）",
    ],
  },
];

export const pediatricDoseExamples: ClinicalExample[] = [
  {
    title: "阿莫西林儿童剂量计算",
    scenario:
      "一名5岁男童，体重18kg，诊断为急性扁桃体炎，需给予阿莫西林口服治疗。成人常规剂量为500mg/次，每日3次。",
    given: {
      成人剂量: "500 mg/次",
      儿童体重: "18 kg",
    },
    question: "请计算该患儿的每次给药剂量为多少？",
    solution: [
      "使用按体重比例计算法（Clark法则简化版）：",
      "儿童剂量 = 成人剂量 × 儿童体重(kg) / 70",
      "儿童剂量 = 500 mg × 18 / 70",
      "儿童剂量 = 500 × 0.257 = 128.6 mg",
      "根据临床实际，可调整为125 mg/次，每日3次。",
    ],
    answer: "约125-150 mg/次，每日3次口服",
    learningPoint:
      "儿童用药剂量通常不建议简单按比例换算，更推荐使用mg/kg剂量法。阿莫西林儿童常规剂量为每日20-40mg/kg，分3次。本例中18kg×30mg/kg=540mg/日，分3次即180mg/次，与计算值接近，说明两种方法具有一致性。",
  },
];

export const creatinineClearanceExamples: ClinicalExample[] = [
  {
    title: "老年患者肾功能评估",
    scenario:
      "一名72岁女性，体重55kg，因肺部感染入院，实验室检查血清肌酐为1.2 mg/dL，需使用经肾排泄的抗生素。",
    given: {
      年龄: "72 岁",
      体重: "55 kg",
      性别: "女性",
      血清肌酐: "1.2 mg/dL",
    },
    question: "请计算该患者的肌酐清除率并评估肾功能分期。",
    solution: [
      "使用Cockcroft-Gault公式：",
      "男性: CrCl = (140 - 年龄) × 体重 / (72 × SCr)",
      "女性: CrCl = 男性值 × 0.85",
      "代入数值：",
      "基础值 = (140 - 72) × 55 / (72 × 1.2)",
      "基础值 = 68 × 55 / 86.4",
      "基础值 = 3740 / 86.4 = 43.3 mL/min",
      "女性校正 = 43.3 × 0.85 = 36.8 mL/min",
    ],
    answer: "CrCl ≈ 36.8 mL/min，慢性肾脏病3b期（中重度肾功能损害）",
    learningPoint:
      "Cockcroft-Gault公式是临床最常用的肾功能估算公式。老年患者即使血清肌酐在「正常」范围内，肾功能也可能已明显下降。本例中患者使用经肾排泄药物时需调整剂量，通常减至常规剂量的1/2，并建议监测血药浓度。",
  },
  {
    title: "μmol/L单位换算计算",
    scenario:
      "一名58岁男性，体重70kg，血清肌酐值为132 μmol/L（中国常用单位），需要换算为mg/dL并计算CrCl。",
    given: {
      年龄: "58 岁",
      体重: "70 kg",
      性别: "男性",
      血清肌酐: "132 μmol/L",
    },
    question: "将肌酐值单位换算后计算肌酐清除率。",
    solution: [
      "第一步：单位换算",
      "1 mg/dL = 88.4 μmol/L",
      "132 μmol/L ÷ 88.4 = 1.49 mg/dL ≈ 1.5 mg/dL",
      "第二步：代入Cockcroft-Gault公式",
      "CrCl = (140 - 58) × 70 / (72 × 1.5)",
      "CrCl = 82 × 70 / 108",
      "CrCl = 5740 / 108 = 53.1 mL/min",
    ],
    answer: "CrCl ≈ 53.1 mL/min，慢性肾脏病3a期",
    learningPoint:
      "国内实验室常用μmol/L作为肌酐单位，使用Cockcroft-Gault公式前需先转换为mg/dL。记住换算系数88.4很重要。CKD 3a期患者使用大部分药物无需大幅调整剂量，但需避免肾毒性药物。",
  },
];

export const bodySurfaceAreaExamples: ClinicalExample[] = [
  {
    title: "化疗药物剂量计算",
    scenario:
      "一名45岁女性，身高160cm，体重58kg，拟接受顺铂化疗，顺铂推荐剂量为75 mg/m²。",
    given: {
      身高: "160 cm",
      体重: "58 kg",
      药物剂量: "75 mg/m²",
    },
    question: "请计算该患者的体表面积和实际给药剂量。",
    solution: [
      "使用Du Bois公式（最常用）：",
      "BSA (m²) = 0.007184 × 身高(cm)^0.725 × 体重(kg)^0.425",
      "代入数值：",
      "身高^0.725 = 160^0.725 ≈ 41.07",
      "体重^0.425 = 58^0.425 ≈ 6.44",
      "BSA = 0.007184 × 41.07 × 6.44",
      "BSA = 0.007184 × 264.5 = 1.90 m²",
      "顺铂剂量 = 75 mg/m² × 1.90 m² = 142.5 mg",
    ],
    answer: "BSA ≈ 1.90 m²，顺铂剂量 ≈ 142.5 mg（可调整为140 mg）",
    learningPoint:
      "体表面积是化疗药物、生物制剂剂量计算的金标准，因为其与代谢速率、心输出量等生理学参数相关性更好。Du Bois公式是最经典的BSA计算公式，此外Mosteller公式（√(身高×体重/3600)）更便于记忆，结果接近。",
  },
];

export const doseCalculationExamples: ClinicalExample[] = [
  {
    title: "万古霉素负荷剂量计算",
    scenario:
      "一名65岁男性，体重70kg，诊断为MRSA肺炎，需给予万古霉素治疗。目标谷浓度15-20 μg/mL，万古霉素Vd约0.7 L/kg，口服生物利用度极低（静脉给药F=1）。",
    given: {
      患者体重: "70 kg",
      目标浓度: "20 μg/mL",
      Vd: "0.7 L/kg",
      生物利用度F: "1（静脉给药）",
    },
    question: "请计算该患者的万古霉素负荷剂量。",
    solution: [
      "负荷剂量公式：LD = Cmax × Vd / F",
      "其中：Cmax = 目标峰浓度，Vd = 分布容积，F = 生物利用度",
      "总体Vd = 0.7 L/kg × 70 kg = 49 L",
      "考虑谷浓度15-20对应的峰浓度约30-40 μg/mL，取目标浓度30 μg/mL",
      "LD = 30 mg/L × 49 L / 1",
      "LD = 1470 mg ≈ 1500 mg",
    ],
    answer: "万古霉素负荷剂量约1500 mg，静脉滴注",
    learningPoint:
      "负荷剂量的目的是迅速达到治疗浓度，特别适用于时间窗窄的严重感染。负荷剂量仅与Vd和目标浓度有关，不受清除率影响。临床实践中万古霉素常规负荷剂量为20-30 mg/kg，本例中21.4 mg/kg在推荐范围内。",
  },
];

export const tdmSimulationExamples: ClinicalExample[] = [
  {
    title: "地高辛血药浓度监测",
    scenario:
      "一名70岁女性，体重55kg，心房颤动，给予地高辛0.125 mg口服每日一次，已连续服药2周。今日8:00服药，计划16:00采血测定地高辛浓度。",
    given: {
      剂量: "0.125 mg/日",
      给药间隔: "24 小时",
      采样时间: "给药后8小时",
      地高辛Vd: "7.3 L/kg",
      生物利用度: "0.75",
    },
    question: "预测该患者的地高辛血药浓度并解读结果。",
    solution: [
      "稳态谷浓度（Cmin）估算公式：",
      "Cmin = (F × D) / (Cl × τ)",
      "地高辛清除率 Cl ≈ 肌酐清除率 × 0.8 + 0.33 mL/min/kg",
      "老年患者假设CrCl≈40 mL/min",
      "Cl = 40 × 0.8 + 0.33 × 55 = 32 + 18.15 = 50.15 mL/min ≈ 3.01 L/h",
      "Cmin = (0.75 × 0.125 mg) / (3.01 L/h × 24 h)",
      "Cmin = 0.09375 mg / 72.24 L ≈ 0.0013 mg/L = 1.3 ng/mL",
      "给药后8小时浓度约为谷浓度的1.2倍：1.56 ng/mL",
    ],
    answer: "预测浓度约1.3-1.6 ng/mL，处于治疗窗（0.8-2.0 ng/mL）内",
    learningPoint:
      "地高辛监测应在给药后6-8小时采样，此时药物已完成分布相进入消除相。若采样过早（如2小时内），浓度会偏高（可达治疗浓度的2-3倍），导致误判为中毒。老年患者、肾功能减退者应使用较低剂量，目标浓度0.8-1.2 ng/mL即可。",
  },
];
