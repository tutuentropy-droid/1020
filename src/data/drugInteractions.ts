import { DrugInteraction, CaseStudy } from "@/types";

export const drugInteractions: DrugInteraction[] = [
  {
    id: "di-001",
    drugAId: "8",
    drugBId: "1",
    severity: "moderate",
    description: "阿司匹林与阿莫西林合用可能增加出血风险",
    mechanism: "阿司匹林抑制血小板聚集，阿莫西林可能影响维生素K的肠道合成，两者合用可增加出血倾向。",
    clinicalSignificance: "可能导致牙龈出血、皮下瘀斑等出血症状，严重时可出现消化道出血。",
    recommendation: "合用时应密切监测凝血功能和出血征象，必要时调整剂量。",
    references: ["《中华人民共和国药典临床用药须知》", "马丁代尔药物大典"]
  },
  {
    id: "di-002",
    drugAId: "8",
    drugBId: "6",
    severity: "moderate",
    description: "阿司匹林与美托洛尔合用可能增强降压作用，但也增加胃肠道不良反应风险",
    mechanism: "阿司匹林与美托洛尔均有降压作用，合用可产生协同效应；同时阿司匹林可增加美托洛尔的血药浓度。",
    clinicalSignificance: "血压过度下降可能导致头晕、晕厥；NSAIDs可增加胃肠道溃疡和出血风险。",
    recommendation: "监测血压变化，注意胃肠道反应，必要时使用胃黏膜保护剂。",
    references: ["《中国高血压防治指南》", "药物相互作用分析与处理"]
  },
  {
    id: "di-003",
    drugAId: "8",
    drugBId: "16",
    severity: "severe",
    description: "阿司匹林与布洛芬合用显著增加胃肠道出血风险，且阿司匹林的心血管保护作用可能减弱",
    mechanism: "布洛芬可竞争性抑制阿司匹林对血小板COX-1的不可逆乙酰化作用，减弱其抗血小板效应；两者均为NSAIDs，对胃肠道黏膜的损害作用叠加。",
    clinicalSignificance: "可能导致严重消化道出血、溃疡穿孔；同时降低阿司匹林的心血管保护作用。",
    recommendation: "避免合用。如需镇痛，建议使用对乙酰氨基酚替代布洛芬，或与阿司匹林间隔至少2小时服用。",
    references: ["FDA安全警示", "《美国心脏病学会指南》"]
  },
  {
    id: "di-004",
    drugAId: "8",
    drugBId: "15",
    severity: "moderate",
    description: "阿司匹林与地西泮合用可增强地西泮的镇静作用",
    mechanism: "阿司匹林可置换与血浆蛋白结合的地西泮，使游离型地西泮浓度升高。",
    clinicalSignificance: "可能加重嗜睡、头晕、共济失调等中枢抑制症状。",
    recommendation: "合用时适当减少地西泮剂量，监测中枢神经系统不良反应。",
    references: ["《临床药物治疗学》"]
  },
  {
    id: "di-005",
    drugAId: "8",
    drugBId: "3",
    severity: "moderate",
    description: "阿司匹林与左氧氟沙星合用可能增加中枢神经系统刺激和抽搐风险",
    mechanism: "喹诺酮类药物可抑制GABA受体，NSAIDs可增强此作用，导致中枢神经系统兴奋性增加。",
    clinicalSignificance: "可能出现失眠、焦虑、震颤，严重时可诱发癫痫发作。",
    recommendation: "有癫痫病史者避免合用，其他患者密切观察神经系统反应。",
    references: ["喹诺酮类抗菌药物临床应用指导原则"]
  },
  {
    id: "di-006",
    drugAId: "5",
    drugBId: "9",
    severity: "moderate",
    description: "奥美拉唑可抑制硝苯地平的代谢，增强其降压作用",
    mechanism: "奥美拉唑为CYP2C19抑制剂，硝苯地平主要经CYP3A4和CYP2C19代谢，合用可导致硝苯地平血药浓度升高。",
    clinicalSignificance: "可能导致血压过度下降，出现头晕、心悸、面部潮红加重。",
    recommendation: "合用时监测血压，必要时调整硝苯地平剂量。",
    references: ["《药物代谢动力学与药物相互作用》"]
  },
  {
    id: "di-007",
    drugAId: "5",
    drugBId: "7",
    severity: "moderate",
    description: "硝苯地平与阿托伐他汀合用可能增加肌病风险",
    mechanism: "硝苯地平可抑制CYP3A4酶，减少阿托伐他汀的代谢，增加他汀类药物的血药浓度。",
    clinicalSignificance: "可能增加肌痛、肌炎甚至横纹肌溶解的风险。",
    recommendation: "监测肌酸激酶（CK）水平，注意肌肉症状，考虑降低他汀剂量。",
    references: ["《中国成人血脂异常防治指南》"]
  },
  {
    id: "di-008",
    drugAId: "5",
    drugBId: "16",
    severity: "moderate",
    description: "布洛芬可降低硝苯地平的降压效果",
    mechanism: "NSAIDs可抑制前列腺素合成，减弱钙通道阻滞剂的扩血管作用，影响血压控制。",
    clinicalSignificance: "可能导致血压升高，影响高血压治疗效果。",
    recommendation: "避免长期合用，如需短期使用应密切监测血压。",
    references: ["高血压合并用药临床指南"]
  },
  {
    id: "di-009",
    drugAId: "6",
    drugBId: "12",
    severity: "severe",
    description: "美托洛尔与氨茶碱合用存在药理拮抗，且可能增加心律失常风险",
    mechanism: "β受体阻滞剂与茶碱在支气管平滑肌和心脏作用上相互拮抗；茶碱可降低美托洛尔的血药浓度，美托洛尔可减慢茶碱代谢。",
    clinicalSignificance: "支气管扩张作用减弱，哮喘控制不佳；心率减慢，可能出现心动过缓或传导阻滞。",
    recommendation: "哮喘患者尽量避免使用非选择性β受体阻滞剂；如需合用，监测肺功能、心率和茶碱血药浓度。",
    references: ["《支气管哮喘防治指南》", "心血管药物相互作用手册"]
  },
  {
    id: "di-010",
    drugAId: "6",
    drugBId: "13",
    severity: "moderate",
    description: "美托洛尔与沙丁胺醇合用存在药理拮抗作用",
    mechanism: "美托洛尔为β受体阻滞剂，沙丁胺醇为β2受体激动剂，两者在支气管平滑肌上作用相互拮抗。",
    clinicalSignificance: "沙丁胺醇的支气管扩张作用可能被减弱，哮喘症状加重。",
    recommendation: "哮喘患者优先使用高选择性β1受体阻滞剂，使用沙丁胺醇时需增加剂量，密切监测肺功能。",
    references: ["GINA全球哮喘处理和预防策略"]
  },
  {
    id: "di-011",
    drugAId: "6",
    drugBId: "5",
    severity: "moderate",
    description: "美托洛尔与硝苯地平合用降压作用增强，但可能增加心动过缓风险",
    mechanism: "两者均有降压作用，可产生协同降压效应；同时两者对心脏传导系统的抑制作用可叠加。",
    clinicalSignificance: "可能导致低血压、心动过缓、房室传导阻滞。",
    recommendation: "从小剂量开始合用，密切监测血压和心率，避免用于已有传导阻滞的患者。",
    references: ["《中国高血压防治指南》"]
  },
  {
    id: "di-012",
    drugAId: "7",
    drugBId: "3",
    severity: "severe",
    description: "阿托伐他汀与左氧氟沙星合用显著增加横纹肌溶解风险",
    mechanism: "左氧氟沙星为CYP3A4抑制剂，可减少阿托伐他汀代谢；同时喹诺酮类药物本身也可能引起肌病和肌腱损伤，两者合用风险叠加。",
    clinicalSignificance: "可能出现严重肌肉疼痛、肌无力、肌红蛋白尿，甚至急性肾功能衰竭。",
    recommendation: "尽量避免合用。如必须使用，密切监测肌酸激酶和肾功能，出现肌肉症状立即停药。",
    references: ["FDA他汀类药物安全警示", "喹诺酮类肌腱损伤风险警示"]
  },
  {
    id: "di-013",
    drugAId: "7",
    drugBId: "4",
    severity: "severe",
    description: "阿托伐他汀与阿奇霉素合用增加横纹肌溶解风险",
    mechanism: "大环内酯类抗生素可抑制CYP3A4酶和P-糖蛋白，减少他汀类药物代谢，显著升高其血药浓度。",
    clinicalSignificance: "肌病、横纹肌溶解风险明显增加，可能导致急性肾损伤。",
    recommendation: "避免合用。如需抗感染治疗，考虑换用不影响CYP3A4的抗生素。",
    references: ["美国脂质学会他汀类药物安全工作组声明"]
  },
  {
    id: "di-014",
    drugAId: "7",
    drugBId: "9",
    severity: "mild",
    description: "奥美拉唑可能轻度影响阿托伐他汀代谢，临床意义不大",
    mechanism: "奥美拉唑为CYP2C19抑制剂，对CYP3A4影响较小，阿托伐他汀主要经CYP3A4代谢。",
    clinicalSignificance: "可能使阿托伐他汀血药浓度轻度升高，一般无明显临床症状。",
    recommendation: "通常无需调整剂量，长期合用时注意监测肌肉症状和肝功能。",
    references: ["质子泵抑制剂临床应用指导原则"]
  },
  {
    id: "di-015",
    drugAId: "7",
    drugBId: "16",
    severity: "moderate",
    description: "阿托伐他汀与布洛芬合用可能增加胃肠道和肌肉不良反应风险",
    mechanism: "NSAIDs增加胃肠道出血风险；布洛芬可能轻度抑制CYP3A4，影响他汀代谢。",
    clinicalSignificance: "胃肠道不适、消化道出血风险增加；肌痛发生率可能升高。",
    recommendation: "注意胃肠道症状，必要时联用胃黏膜保护剂；监测肌酸激酶。",
    references: ["《老年心血管疾病合并用药专家共识》"]
  },
  {
    id: "di-016",
    drugAId: "1",
    drugBId: "9",
    severity: "moderate",
    description: "奥美拉唑可提高胃内pH值，可能影响阿莫西林的吸收和疗效",
    mechanism: "阿莫西林在酸性环境中吸收较好，质子泵抑制剂升高胃内pH值可能影响其生物利用度。",
    clinicalSignificance: "但在幽门螺杆菌根除治疗中，PPI可提高胃内pH值，增强抗生素的抗菌活性，具有协同作用。",
    recommendation: "用于幽门螺杆菌根除时，PPI与阿莫西林合用是推荐方案；其他感染注意评估。",
    references: ["《第五次全国幽门螺杆菌感染处理共识报告》"]
  },
  {
    id: "di-017",
    drugAId: "1",
    drugBId: "4",
    severity: "mild",
    description: "阿莫西林与阿奇霉素合用抗菌谱扩大，但可能产生拮抗作用",
    mechanism: "阿莫西林为繁殖期杀菌剂，阿奇霉素为快速抑菌剂，理论上后者可降低前者的杀菌效果。",
    clinicalSignificance: "多数临床研究显示合用并未明显降低疗效，某些混合感染时合用可扩大抗菌谱。",
    recommendation: "一般细菌感染避免盲目合用；对于社区获得性肺炎等特殊感染可考虑合用。",
    references: ["《抗菌药物临床应用指导原则》"]
  },
  {
    id: "di-018",
    drugAId: "1",
    drugBId: "17",
    severity: "mild",
    description: "阿莫西林可能轻微影响二甲双胍的血药浓度",
    mechanism: "抗生素可能改变肠道菌群，影响二甲双胍的吸收和代谢。",
    clinicalSignificance: "可能导致血糖轻微波动，一般无明显临床意义。",
    recommendation: "注意监测血糖，短期合用通常无需调整剂量。",
    references: ["《中国2型糖尿病防治指南》"]
  },
  {
    id: "di-019",
    drugAId: "2",
    drugBId: "9",
    severity: "moderate",
    description: "奥美拉唑可能影响头孢克肟的血药浓度",
    mechanism: "胃内pH升高可能影响头孢克肟的溶解和吸收。",
    clinicalSignificance: "可能导致头孢克肟血药浓度降低，影响抗感染疗效。",
    recommendation: "如需合用，建议间隔服用，必要时监测抗感染疗效。",
    references: ["头孢菌素类抗菌药物临床应用指导原则"]
  },
  {
    id: "di-020",
    drugAId: "3",
    drugBId: "12",
    severity: "severe",
    description: "左氧氟沙星与氨茶碱合用显著增加茶碱中毒风险",
    mechanism: "喹诺酮类药物可抑制CYP1A2酶，显著减少茶碱代谢，使茶碱血药浓度升高2-3倍。",
    clinicalSignificance: "易出现恶心、呕吐、心悸、心律失常、惊厥等茶碱中毒症状，严重时可危及生命。",
    recommendation: "尽量避免合用。如必须合用，应监测茶碱血药浓度，剂量减至原剂量的1/3-1/2。",
    references: ["《支气管哮喘防治指南》", "喹诺酮类药物相互作用专家共识"]
  },
  {
    id: "di-021",
    drugAId: "3",
    drugBId: "15",
    severity: "moderate",
    description: "左氧氟沙星与地西泮合用增加中枢神经系统不良反应风险",
    mechanism: "喹诺酮类可抑制GABA受体，增强苯二氮䓬类的中枢抑制作用。",
    clinicalSignificance: "可能加重嗜睡、头晕、共济失调，偶可诱发抽搐。",
    recommendation: "有癫痫病史者禁用；其他患者密切观察，必要时减少地西泮剂量。",
    references: ["喹诺酮类抗菌药物临床应用指导原则"]
  },
  {
    id: "di-022",
    drugAId: "3",
    drugBId: "17",
    severity: "moderate",
    description: "左氧氟沙星与二甲双胍合用可能导致血糖波动",
    mechanism: "喹诺酮类药物可干扰糖代谢，引起低血糖或高血糖；与降糖药合用风险增加。",
    clinicalSignificance: "可能导致血糖异常波动，增加低血糖或高血糖风险。",
    recommendation: "合用时密切监测血糖，注意低血糖症状，及时调整降糖药物剂量。",
    references: ["糖尿病患者抗菌药物使用专家共识"]
  },
  {
    id: "di-023",
    drugAId: "3",
    drugBId: "19",
    severity: "mild",
    description: "左氧氟沙星可能影响左甲状腺素钠的吸收",
    mechanism: "喹诺酮类可与金属离子螯合，理论上可能影响甲状腺素的吸收。",
    clinicalSignificance: "临床证据有限，一般无明显甲状腺功能波动。",
    recommendation: "建议两药间隔4小时以上服用，长期合用监测甲状腺功能。",
    references: ["甲状腺疾病合理用药指南"]
  },
  {
    id: "di-024",
    drugAId: "4",
    drugBId: "12",
    severity: "moderate",
    description: "阿奇霉素与氨茶碱合用可能增加茶碱血药浓度",
    mechanism: "大环内酯类抗生素可抑制CYP1A2酶，减慢茶碱代谢，但阿奇霉素影响较红霉素轻。",
    clinicalSignificance: "可能导致茶碱血药浓度轻度升高，出现心悸、恶心等症状。",
    recommendation: "合用时监测茶碱血药浓度，必要时减少茶碱剂量。",
    references: ["大环内酯类抗菌药物临床应用指导原则"]
  },
  {
    id: "di-025",
    drugAId: "4",
    drugBId: "10",
    severity: "severe",
    description: "阿奇霉素与多潘立酮合用显著增加QT间期延长和心律失常风险",
    mechanism: "两者均可延长QT间期，合用可产生协同心脏毒性；阿奇霉素还可抑制CYP3A4，增加多潘立酮血药浓度。",
    clinicalSignificance: "可能诱发尖端扭转型室性心动过速等严重心律失常，甚至猝死。",
    recommendation: "严格禁忌合用。选择其他促胃动力药或更换抗生素。",
    references: ["FDA关于阿奇霉素心脏毒性的警示", "多潘立酮安全使用通知"]
  },
  {
    id: "di-026",
    drugAId: "4",
    drugBId: "15",
    severity: "moderate",
    description: "阿奇霉素可增加地西泮的血药浓度，增强镇静作用",
    mechanism: "阿奇霉素可抑制CYP3A4酶，减少地西泮代谢。",
    clinicalSignificance: "可能加重嗜睡、头晕、共济失调等中枢抑制症状。",
    recommendation: "适当减少地西泮剂量，密切观察中枢神经系统反应。",
    references: ["《临床药物治疗学》"]
  },
  {
    id: "di-027",
    drugAId: "9",
    drugBId: "10",
    severity: "mild",
    description: "奥美拉唑与多潘立酮合用可能增加多潘立酮血药浓度",
    mechanism: "奥美拉唑可抑制CYP3A4和CYP2C19，影响多潘立酮代谢。",
    clinicalSignificance: "可能使多潘立酮血药浓度轻度升高，增加不良反应风险。",
    recommendation: "通常可以合用，注意观察多潘立酮相关不良反应。",
    references: ["《胃食管反流病诊疗指南》"]
  },
  {
    id: "di-028",
    drugAId: "9",
    drugBId: "11",
    severity: "mild",
    description: "蒙脱石散可能吸附奥美拉唑，影响其吸收",
    mechanism: "蒙脱石散具有强吸附作用，可能吸附同服的药物分子。",
    clinicalSignificance: "可能导致奥美拉唑吸收减少，疗效降低。",
    recommendation: "两药应间隔至少2小时服用。",
    references: ["腹泻合理用药专家共识"]
  },
  {
    id: "di-029",
    drugAId: "9",
    drugBId: "17",
    severity: "moderate",
    description: "长期使用奥美拉唑可能影响二甲双胍的吸收和维生素B12水平",
    mechanism: "胃内pH升高可能影响二甲双胍的溶解吸收；PPI长期使用可导致维生素B12缺乏，加重二甲双胍对B12吸收的影响。",
    clinicalSignificance: "可能导致血糖控制不佳和维生素B12缺乏性贫血。",
    recommendation: "长期合用者监测血糖和血清维生素B12水平，必要时补充维生素B12。",
    references: ["质子泵抑制剂临床应用指导原则"]
  },
  {
    id: "di-030",
    drugAId: "9",
    drugBId: "19",
    severity: "moderate",
    description: "奥美拉唑可降低胃内酸度，影响左甲状腺素钠的吸收",
    mechanism: "左甲状腺素钠需要酸性环境才能有效溶解和吸收，PPI升高胃内pH值可影响其生物利用度。",
    clinicalSignificance: "可能导致左甲状腺素吸收减少，TSH升高，甲状腺功能减退症状加重。",
    recommendation: "左甲状腺素晨起空腹服用，PPI在早餐后服用；或增加左甲状腺素剂量，监测TSH水平。",
    references: ["《甲状腺功能减退症诊治指南》"]
  },
  {
    id: "di-031",
    drugAId: "9",
    drugBId: "20",
    severity: "mild",
    description: "奥美拉唑与氯雷他定合用无显著临床意义的相互作用",
    mechanism: "氯雷他定主要经CYP3A4和CYP2D6代谢，奥美拉唑主要影响CYP2C19，代谢途径交叉较少。",
    clinicalSignificance: "一般无明显药物相互作用的临床表现。",
    recommendation: "通常可以安全合用，无需调整剂量。",
    references: ["第二代抗组胺药临床应用专家共识"]
  },
  {
    id: "di-032",
    drugAId: "10",
    drugBId: "12",
    severity: "mild",
    description: "多潘立酮与氨茶碱合用可能增强胃肠蠕动，影响茶碱吸收",
    mechanism: "多潘立酮促进胃排空，可能加快或改变茶碱的吸收速率。",
    clinicalSignificance: "可能导致茶碱血药浓度波动，但临床意义较小。",
    recommendation: "注意监测茶碱血药浓度和哮喘控制情况。",
    references: ["止吐药物临床应用专家共识"]
  },
  {
    id: "di-033",
    drugAId: "10",
    drugBId: "6",
    severity: "moderate",
    description: "多潘立酮与美托洛尔合用可能加重QT间期延长风险",
    mechanism: "两者均有潜在的QT间期延长作用，合用可增加心脏不良反应风险。",
    clinicalSignificance: "可能增加心律失常风险，尤其在有基础心脏病的患者中。",
    recommendation: "心脏病患者避免合用，其他患者密切监测心电图和心率。",
    references: ["药物诱导QT间期延长防治专家共识"]
  },
  {
    id: "di-034",
    drugAId: "11",
    drugBId: "1",
    severity: "moderate",
    description: "蒙脱石散可吸附阿莫西林，降低其生物利用度",
    mechanism: "蒙脱石散具有巨大表面积，可吸附抗生素分子，减少肠道吸收。",
    clinicalSignificance: "可能导致阿莫西林血药浓度不足，影响抗感染疗效。",
    recommendation: "两药必须间隔至少2小时服用，蒙脱石散在两餐之间服用。",
    references: ["儿童急性腹泻病诊疗规范"]
  },
  {
    id: "di-035",
    drugAId: "11",
    drugBId: "17",
    severity: "moderate",
    description: "蒙脱石散可吸附二甲双胍，影响降糖效果",
    mechanism: "蒙脱石散的吸附作用可能减少二甲双胍的肠道吸收。",
    clinicalSignificance: "可能导致血糖升高，影响糖尿病控制。",
    recommendation: "两药间隔至少2小时服用，密切监测血糖。",
    references: ["糖尿病合并胃肠疾病用药专家共识"]
  },
  {
    id: "di-036",
    drugAId: "12",
    drugBId: "13",
    severity: "moderate",
    description: "氨茶碱与沙丁胺醇合用支气管扩张作用增强，但心脏不良反应也增加",
    mechanism: "两者通过不同途径舒张支气管平滑肌，可产生协同作用；但对心脏的兴奋作用也可叠加。",
    clinicalSignificance: "可能出现心悸、心动过速、心律失常，严重时可诱发心肌缺血。",
    recommendation: "合用时密切监测心率、心电图，适当调整剂量，避免茶碱血药浓度过高。",
    references: ["《支气管哮喘防治指南》"]
  },
  {
    id: "di-037",
    drugAId: "12",
    drugBId: "14",
    severity: "mild",
    description: "氨茶碱与布地奈德合用安全性良好，具有协同抗炎平喘作用",
    mechanism: "茶碱类与吸入性糖皮质激素作用机制不同，合用可从不同环节控制气道炎症和痉挛。",
    clinicalSignificance: "可提高哮喘控制率，无明显药代动力学相互作用。",
    recommendation: "推荐联合使用，是中重度哮喘的常用治疗方案。",
    references: ["GINA全球哮喘处理和预防策略"]
  },
  {
    id: "di-038",
    drugAId: "12",
    drugBId: "16",
    severity: "moderate",
    description: "布洛芬可降低氨茶碱清除率，增加其血药浓度",
    mechanism: "NSAIDs可能抑制CYP1A2酶活性，减慢茶碱代谢。",
    clinicalSignificance: "可能导致茶碱血药浓度升高，出现恶心、心悸等中毒症状。",
    recommendation: "合用时监测茶碱血药浓度，必要时调整剂量。",
    references: ["《临床药代动力学》"]
  },
  {
    id: "di-039",
    drugAId: "13",
    drugBId: "17",
    severity: "moderate",
    description: "沙丁胺醇可能导致血糖升高，影响二甲双胍的降糖效果",
    mechanism: "β2受体激动剂可促进糖原分解和糖异生，升高血糖水平。",
    clinicalSignificance: "可能导致血糖控制不佳，尤其大剂量使用时。",
    recommendation: "糖尿病患者使用沙丁胺醇时加强血糖监测，必要时调整降糖药物。",
    references: ["《中国2型糖尿病防治指南》"]
  },
  {
    id: "di-040",
    drugAId: "13",
    drugBId: "18",
    severity: "severe",
    description: "沙丁胺醇与胰岛素合用可导致血糖升高，需增加胰岛素用量",
    mechanism: "β2受体激动剂可促进肝糖原分解和糖异生，并降低外周组织对胰岛素的敏感性。",
    clinicalSignificance: "可能引起血糖显著升高，诱发高血糖危象。",
    recommendation: "糖尿病患者使用沙丁胺醇时密切监测血糖，临时增加胰岛素剂量。",
    references: ["糖尿病患者围手术期血糖管理专家共识"]
  },
  {
    id: "di-041",
    drugAId: "14",
    drugBId: "16",
    severity: "mild",
    description: "布地奈德与布洛芬合用无显著临床相互作用",
    mechanism: "吸入性糖皮质激素全身吸收少，与布洛芬发生药代动力学相互作用的可能性小。",
    clinicalSignificance: "一般无明显不良反应叠加。",
    recommendation: "通常可以安全合用。",
    references: ["糖皮质激素临床应用指导原则"]
  },
  {
    id: "di-042",
    drugAId: "15",
    drugBId: "16",
    severity: "severe",
    description: "地西泮与布洛芬合用增强中枢抑制作用，增加胃肠道出血风险",
    mechanism: "苯二氮䓬类与NSAIDs均有中枢抑制作用，合用可增强镇静效果；NSAIDs增加胃肠道出血风险。",
    clinicalSignificance: "嗜睡、头晕加重，操作能力下降；消化道溃疡和出血风险增加。",
    recommendation: "避免长期合用，如需合用减少剂量，避免驾驶和高空作业。",
    references: ["老年患者潜在不适当用药Beers标准"]
  },
  {
    id: "di-043",
    drugAId: "15",
    drugBId: "17",
    severity: "mild",
    description: "地西泮对二甲双胍无显著药代动力学影响",
    mechanism: "两者代谢途径不同，药代动力学相互作用证据有限。",
    clinicalSignificance: "一般无明显临床相互作用表现。",
    recommendation: "可以合用，注意观察镇静和血糖情况。",
    references: ["糖尿病合并精神疾病用药专家共识"]
  },
  {
    id: "di-044",
    drugAId: "15",
    drugBId: "20",
    severity: "moderate",
    description: "地西泮与氯雷他定合用可能增强中枢抑制作用",
    mechanism: "虽然氯雷他定为非镇静抗组胺药，但个别患者仍可能出现嗜睡，与地西泮合用可增强中枢抑制。",
    clinicalSignificance: "可能加重嗜睡、头晕等症状。",
    recommendation: "密切观察中枢抑制症状，必要时调整剂量。",
    references: ["第二代抗组胺药临床应用专家共识"]
  },
  {
    id: "di-045",
    drugAId: "16",
    drugBId: "17",
    severity: "moderate",
    description: "布洛芬可减弱二甲双胍的降糖效果，并增加肾功能损害风险",
    mechanism: "NSAIDs可抑制前列腺素合成，影响胰岛素敏感性和血糖调节；同时可减少肾血流，增加二甲双胍蓄积和乳酸酸中毒风险。",
    clinicalSignificance: "血糖控制不佳，可能诱发高血糖；肾损伤和乳酸酸中毒风险增加。",
    recommendation: "避免长期大量合用，短期使用需监测血糖和肾功能，多饮水。",
    references: ["《中国2型糖尿病防治指南》"]
  },
  {
    id: "di-046",
    drugAId: "16",
    drugBId: "18",
    severity: "moderate",
    description: "布洛芬可影响血糖调节，干扰胰岛素的降糖效果",
    mechanism: "NSAIDs可能影响胰岛素敏感性和前列腺素介导的糖代谢调节。",
    clinicalSignificance: "可能导致血糖波动，少数情况下出现低血糖或高血糖。",
    recommendation: "合用时加强血糖监测，根据血糖调整胰岛素剂量。",
    references: ["糖尿病患者镇痛药物使用专家共识"]
  },
  {
    id: "di-047",
    drugAId: "17",
    drugBId: "18",
    severity: "moderate",
    description: "二甲双胍与胰岛素合用增强降糖效果，增加低血糖风险",
    mechanism: "两者作用机制互补，合用可产生协同降糖作用。",
    clinicalSignificance: "降糖效果显著增强，低血糖风险增加。",
    recommendation: "合用时适当减少胰岛素剂量，密切监测血糖，注意低血糖症状。",
    references: ["《中国2型糖尿病防治指南》"]
  },
  {
    id: "di-048",
    drugAId: "17",
    drugBId: "19",
    severity: "mild",
    description: "二甲双胍与左甲状腺素钠合用无显著药代动力学相互作用",
    mechanism: "两者吸收和代谢途径不同，目前证据未发现明显相互作用。",
    clinicalSignificance: "一般无明显临床影响。",
    recommendation: "可以合用，甲减合并糖尿病患者同时监测甲状腺功能和血糖。",
    references: ["内分泌疾病联合用药专家共识"]
  },
  {
    id: "di-049",
    drugAId: "18",
    drugBId: "19",
    severity: "mild",
    description: "胰岛素与左甲状腺素钠合用时，甲状腺功能改善可能增加胰岛素需要量",
    mechanism: "甲状腺激素可增加糖代谢和胰岛素降解，甲减状态纠正后胰岛素需求量可能增加。",
    clinicalSignificance: "开始左甲状腺素治疗后可能需要调整胰岛素剂量。",
    recommendation: "甲减合并糖尿病患者在开始甲状腺素替代治疗时加强血糖监测。",
    references: ["糖尿病合并甲状腺疾病诊疗专家共识"]
  },
  {
    id: "di-050",
    drugAId: "19",
    drugBId: "20",
    severity: "mild",
    description: "左甲状腺素钠与氯雷他定合用无明显临床相互作用",
    mechanism: "两者代谢途径无明显交叉。",
    clinicalSignificance: "一般无显著相互作用的临床表现。",
    recommendation: "可以安全合用，无需调整剂量。",
    references: ["抗组胺药临床应用指南"]
  },
  {
    id: "di-051",
    drugAId: "3",
    drugBId: "2",
    severity: "moderate",
    description: "左氧氟沙星与头孢克肟合用可能增加中枢神经系统不良反应",
    mechanism: "β-内酰胺类与喹诺酮类合用偶见神经系统毒性增强的报道。",
    clinicalSignificance: "可能出现头痛、头晕、失眠等症状，癫痫患者风险增加。",
    recommendation: "有癫痫或中枢神经系统疾病史者避免合用，其他患者密切观察。",
    references: ["抗菌药物联合应用专家共识"]
  },
  {
    id: "di-052",
    drugAId: "7",
    drugBId: "8",
    severity: "moderate",
    description: "阿托伐他汀与阿司匹林合用增加出血和肌病风险，但临床获益大于风险",
    mechanism: "阿司匹林增加出血风险，他汀类与NSAIDs合用可能轻度增加肌病风险。",
    clinicalSignificance: "出血风险轻度增加，但心血管保护作用是明确的，临床常联合使用。",
    recommendation: "可合用，注意观察出血和肌肉症状，必要时联用胃黏膜保护剂。",
    references: ["《中国心血管病预防指南》"]
  },
  {
    id: "di-053",
    drugAId: "8",
    drugBId: "18",
    severity: "moderate",
    description: "阿司匹林可能增强胰岛素的降糖作用，增加低血糖风险",
    mechanism: "大剂量阿司匹林具有降糖作用，可增强胰岛素的降糖效应。",
    clinicalSignificance: "可能导致低血糖，尤其大剂量使用阿司匹林时。",
    recommendation: "合用时监测血糖，注意低血糖症状，必要时调整胰岛素剂量。",
    references: ["糖尿病患者抗血小板治疗专家共识"]
  }
];

export const caseStudies: CaseStudy[] = [
  {
    id: "cs-001",
    title: "华法林与阿司匹林合用致严重出血",
    drugCombination: ["华法林", "阿司匹林"],
    severity: "contraindicated",
    caseDescription: "患者男性，72岁，因房颤长期服用华法林抗凝（INR维持在2.0-3.0）。因关节疼痛自行加用阿司匹林100mg/日。服药1周后出现牙龈出血、黑便，查INR升至4.5，血红蛋白从135g/L降至88g/L，大便潜血强阳性。",
    interactionMechanism: "华法林通过抑制维生素K依赖的凝血因子合成发挥抗凝作用；阿司匹林通过不可逆抑制血小板COX-1减少血栓素A2生成，抑制血小板聚集。两者合用抗凝作用叠加，显著增加出血风险。此外，阿司匹林可损伤胃黏膜，进一步增加消化道出血风险。",
    clinicalOutcome: "立即停用两药，给予维生素K1静脉注射、质子泵抑制剂抑酸治疗，输注红细胞悬液2单位。3天后INR恢复至正常范围，出血停止，患者病情稳定。",
    preventionAdvice: "除非有明确指征（如冠脉支架术后），否则华法林与阿司匹林禁止合用。必须合用时应密切监测INR，联用质子泵抑制剂预防消化道出血，并注意观察出血征象。",
    learningPoints: [
      "华法林与抗血小板药物合用显著增加出血风险，属禁忌或需严格评估",
      "老年患者自行添加非处方药是药物相互作用的常见原因",
      "使用华法林应定期监测INR，出现出血症状立即就医",
      "应告知患者服用抗凝药期间避免自行使用阿司匹林等NSAIDs"
    ]
  },
  {
    id: "cs-002",
    title: "辛伐他汀与红霉素合用致横纹肌溶解",
    drugCombination: ["辛伐他汀", "红霉素"],
    severity: "contraindicated",
    caseDescription: "患者女性，65岁，高脂血症病史，服用辛伐他汀40mg/晚治疗3个月，血脂控制良好。因肺部感染予红霉素0.5g tid口服。用药第5天出现全身肌肉酸痛、无力，伴茶色尿。查肌酸激酶（CK）15600U/L，肌酐178μmol/L，肌红蛋白阳性。",
    interactionMechanism: "辛伐他汀为CYP3A4底物，红霉素为强CYP3A4抑制剂。红霉素显著抑制辛伐他汀的代谢，使其血药浓度升高约5-10倍，导致肌肉毒性显著增加，引起肌细胞坏死溶解。",
    clinicalOutcome: "立即停用两药，给予大量补液、碱化尿液、保肝等治疗。2周后CK降至正常，肾功能恢复。患者遗留轻度肌肉乏力。",
    preventionAdvice: "经CYP3A4代谢的他汀类（洛伐他汀、辛伐他汀、阿托伐他汀）禁止与强CYP3A4抑制剂合用。可选用普伐他汀、瑞舒伐他汀等较少依赖CYP3A4代谢的他汀，或更换抗生素。",
    learningPoints: [
      "他汀类药物与CYP3A4抑制剂合用是横纹肌溶解的重要诱因",
      "使用他汀类药物时应避免联用大环内酯类抗生素等强CYP3A4抑制剂",
      "他汀用药期间出现肌肉疼痛、无力、茶色尿应立即停药就医",
      "应熟悉常用他汀类药物的代谢酶特点，合理选择联用药物"
    ]
  },
  {
    id: "cs-003",
    title: "环丙沙星与氨茶碱合用致茶碱中毒",
    drugCombination: ["环丙沙星", "氨茶碱"],
    severity: "severe",
    caseDescription: "患者男性，58岁，慢性阻塞性肺疾病急性加重，予氨茶碱0.2g bid口服。因合并泌尿系统感染加用环丙沙星0.5g bid口服。用药48小时后出现心悸、烦躁不安、失眠、恶心呕吐，心率120次/分，查茶碱血药浓度28μg/ml（治疗范围10-20μg/ml）。",
    interactionMechanism: "环丙沙星为喹诺酮类抗菌药，可强烈抑制CYP1A2酶，而氨茶碱主要经CYP1A2代谢。合用可使茶碱清除率降低50%以上，血药浓度显著升高，导致中枢神经系统和心脏毒性。",
    clinicalOutcome: "停用两药，予对症支持治疗（β受体阻滞剂控制心率、苯二氮䓬类镇静）。36小时后茶碱血药浓度降至12μg/ml，症状逐渐缓解。",
    preventionAdvice: "喹诺酮类药物与氨茶碱合用属禁忌或需严格监测。如必须合用，茶碱剂量应减少30%-50%，并密切监测血药浓度。左氧氟沙星、莫西沙星对茶碱代谢影响较小，可考虑替代。",
    learningPoints: [
      "茶碱治疗窗窄，血药浓度超过20μg/ml即可出现中毒症状",
      "喹诺酮类中以依诺沙星、环丙沙星对CYP1A2抑制作用最强",
      "使用氨茶碱应常规监测血药浓度，加用新药前评估相互作用",
      "莫西沙星、左氧氟沙星与茶碱相互作用较轻，可优先选择"
    ]
  },
  {
    id: "cs-004",
    title: "地高辛与维拉帕米合用致严重心动过缓",
    drugCombination: ["地高辛", "维拉帕米"],
    severity: "severe",
    caseDescription: "患者女性，70岁，心衰合并房颤，长期服用地高辛0.125mg/日（血药浓度0.9ng/ml）。因血压控制不佳加用维拉帕米缓释片120mg/日。1周后出现头晕、黑朦，心率38次/分，心电图示高度房室传导阻滞，复查地高辛血药浓度2.4ng/ml。",
    interactionMechanism: "维拉帕米可抑制P-糖蛋白介导的地高辛肾小管分泌和肠道转运，减少地高辛清除，使其血药浓度升高约60%-90%。同时两者对心脏传导系统的抑制作用叠加，显著增加心动过缓和房室传导阻滞风险。",
    clinicalOutcome: "停用维拉帕米，地高辛减量，给予阿托品提升心率。48小时后心率恢复至62次/分，1周后地高辛血药浓度降至1.1ng/ml。",
    preventionAdvice: "地高辛与维拉帕米合用需将地高辛剂量减少50%，并密切监测心率、心电图和地高辛血药浓度。如非必要，避免两药合用。",
    learningPoints: [
      "P-糖蛋白是药物相互作用的重要转运蛋白，维拉帕米是其典型抑制剂",
      "地高辛治疗窗窄（0.8-2.0ng/ml），血药浓度微小变化即可产生明显临床影响",
      "老年患者心脏传导功能减退，对药物的抑制作用更敏感",
      "加用心血管药物前必须评估与地高辛的相互作用"
    ]
  },
  {
    id: "cs-005",
    title: "单胺氧化酶抑制剂与酪胺食物致高血压危象",
    drugCombination: ["苯乙肼", "奶酪"],
    severity: "contraindicated",
    caseDescription: "患者女性，45岁，抑郁症病史，服用苯乙肼（MAOI）治疗。参加朋友聚会时进食了大量奶酪和红酒。餐后1小时出现剧烈头痛、心悸、恶心、视物模糊，测血压210/130mmHg。",
    interactionMechanism: "单胺氧化酶抑制剂抑制肠道和肝脏的单胺氧化酶，使食物中的酪胺（tyramine）不能被降解而大量进入体循环，促进去甲肾上腺素大量释放，导致血压急剧升高。",
    clinicalOutcome: "给予酚妥拉明静脉滴注降压，硝苯地平舌下含服。2小时后血压降至150/90mmHg，症状缓解。",
    preventionAdvice: "服用MAOI期间严格限制含酪胺食物：奶酪、腌肉、发酵豆制品、红酒、啤酒、熟透的香蕉等。如需换用其他抗抑郁药，需有2周清洗期。",
    learningPoints: [
      "药物-食物相互作用也是临床重要问题，不可忽视",
      "MAOI与含酪胺食物合用可导致致命的高血压危象",
      "使用MAOI应进行详细的饮食宣教",
      "目前临床已较少使用MAOI，优先选择SSRI等安全性更好的抗抑郁药"
    ]
  },
  {
    id: "cs-006",
    title: "甲硝唑与酒精合用致双硫仑样反应",
    drugCombination: ["甲硝唑", "酒精"],
    severity: "severe",
    caseDescription: "患者男性，40岁，牙周炎服用甲硝唑0.4g tid。服药期间晚餐饮用白酒约100ml，约30分钟后出现面部潮红、搏动性头痛、恶心呕吐、心悸、呼吸困难，伴濒死感。",
    interactionMechanism: "甲硝唑可抑制乙醛脱氢酶，使酒精代谢产生的乙醛不能继续氧化为乙酸，导致体内乙醛大量蓄积，引发双硫仑样反应。",
    clinicalOutcome: "给予吸氧、静脉补液、维生素C、纳洛酮等治疗。2小时后症状逐渐缓解，生命体征稳定。",
    preventionAdvice: "使用甲硝唑期间及停药后7天内严禁饮酒及含酒精的饮料、药物。应告知患者明确的禁酒时间。头孢类、呋喃唑酮等也可引起类似反应。",
    learningPoints: [
      "双硫仑样反应可危及生命，必须高度重视",
      "引起双硫仑样反应的常见药物：头孢哌酮、甲硝唑、呋喃唑酮、格列本脲等",
      "用药宣教是预防双硫仑样反应的关键",
      "禁酒时间应包括用药期间和停药后足够长的时间"
    ]
  },
  {
    id: "cs-007",
    title: "布洛芬与ACEI合用致急性肾损伤",
    drugCombination: ["布洛芬", "依那普利"],
    severity: "severe",
    caseDescription: "患者男性，68岁，高血压病史，服用依那普利10mg/日，血压控制良好，肾功能正常。因腰痛自行服用布洛芬0.4g tid，连续用药5天。出现尿量减少，下肢水肿，查肌酐186μmol/L（基础值85μmol/L），尿素氮10.5mmol/L。",
    interactionMechanism: "NSAIDs抑制前列腺素合成，降低肾灌注压；ACEI抑制血管紧张素Ⅱ生成，扩张出球小动脉。两者合用可显著降低肾小球滤过压，尤其在老年、脱水、基础肾功能不全患者中更易发生急性肾损伤。",
    clinicalOutcome: "停用布洛芬，继续依那普利，给予补液等支持治疗。10天后肾功能恢复至基线水平。",
    preventionAdvice: "老年、高血压、心衰、肾功能不全患者应避免NSAIDs与ACEI/ARB合用。如需镇痛，优先选择对乙酰氨基酚，短期小剂量使用NSAIDs并密切监测肾功能。",
    learningPoints: [
      "NSAIDs与RAS抑制剂合用是老年患者急性肾损伤的重要原因",
      "维持肾小球滤过压依赖于前列腺素和血管紧张素Ⅱ的平衡",
      "老年患者应避免自行长期使用NSAIDs",
      "用药前后监测肾功能是预防药源性肾损伤的重要措施"
    ]
  },
  {
    id: "cs-008",
    title: "利福平与口服避孕药合用致避孕失败",
    drugCombination: ["利福平", "口服避孕药"],
    severity: "moderate",
    caseDescription: "患者女性，28岁，肺结核治疗方案为利福平、异烟肼、吡嗪酰胺、乙胺丁醇。同时服用复方口服避孕药避孕。治疗2个月后出现恶心、乳房胀痛，查尿HCG阳性，确认意外妊娠。",
    interactionMechanism: "利福平是强CYP3A4和CYP2C9诱导剂，可显著加速雌激素和孕激素的肝内代谢，使口服避孕药血药浓度降低约50%，导致避孕失败。",
    clinicalOutcome: "经妇科会诊和患者意愿，终止妊娠。更换为宫内节育器避孕。",
    preventionAdvice: "服用利福平期间应采用非激素类避孕方法（如避孕套、宫内节育器）。停药后至少4周内仍需采用非激素避孕措施。",
    learningPoints: [
      "利福平是强肝药酶诱导剂，可影响许多药物的疗效",
      "口服避孕药疗效依赖稳定的血药浓度，易受酶诱导剂影响",
      "育龄女性使用可能影响避孕药代谢的药物时，必须更换避孕方式",
      "抗结核治疗期间应进行充分的避孕宣教"
    ]
  }
];

export const getSeverityLabel = (severity: string): string => {
  const map: Record<string, string> = {
    contraindicated: "禁用",
    severe: "重度",
    moderate: "中度",
    mild: "轻度",
  };
  return map[severity] || "未知";
};

export const getSeverityColor = (severity: string): string => {
  const map: Record<string, string> = {
    contraindicated: "bg-red-100 text-red-700 border-red-200",
    severe: "bg-orange-100 text-orange-700 border-orange-200",
    moderate: "bg-yellow-100 text-yellow-700 border-yellow-200",
    mild: "bg-green-100 text-green-700 border-green-200",
  };
  return map[severity] || "bg-gray-100 text-gray-700 border-gray-200";
};

export const getSeverityBgGradient = (severity: string): string => {
  const map: Record<string, string> = {
    contraindicated: "from-red-500 to-red-600",
    severe: "from-orange-500 to-orange-600",
    moderate: "from-yellow-500 to-yellow-600",
    mild: "from-green-500 to-green-600",
  };
  return map[severity] || "from-gray-500 to-gray-600";
};
