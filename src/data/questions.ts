import { QuizQuestion } from "@/types";

export const quizQuestions: QuizQuestion[] = [
  {
    id: "q1",
    question: "青霉素类抗生素的主要作用机制是？",
    options: [
      "抑制细菌蛋白质合成",
      "抑制细菌细胞壁合成",
      "抑制细菌DNA复制",
      "破坏细菌细胞膜",
    ],
    correctAnswer: 1,
    explanation:
      "青霉素类通过抑制细菌细胞壁肽聚糖合成酶（青霉素结合蛋白PBP），阻碍细胞壁合成，导致细菌渗透压改变而溶菌死亡。",
    category: "抗生素",
    difficulty: "easy",
  },
  {
    id: "q2",
    question: "下列哪种药物属于第三代头孢菌素？",
    options: ["头孢氨苄", "头孢呋辛", "头孢曲松", "头孢吡肟"],
    correctAnswer: 2,
    explanation:
      "头孢曲松属于第三代头孢菌素；头孢氨苄是第一代；头孢呋辛是第二代；头孢吡肟是第四代。",
    category: "抗生素",
    difficulty: "easy",
  },
  {
    id: "q3",
    question: "喹诺酮类药物禁用于18岁以下未成年人的主要原因是？",
    options: ["肝毒性", "肾毒性", "软骨损伤", "血液系统毒性"],
    correctAnswer: 2,
    explanation:
      "喹诺酮类药物可损伤幼年动物的软骨组织，影响骨骼发育，因此禁用于18岁以下未成年人、妊娠期和哺乳期妇女。",
    category: "抗生素",
    difficulty: "medium",
  },
  {
    id: "q4",
    question: "阿奇霉素属于哪类抗生素？",
    options: ["青霉素类", "头孢菌素类", "大环内酯类", "喹诺酮类"],
    correctAnswer: 2,
    explanation:
      "阿奇霉素是第二代大环内酯类抗生素，特点是组织浓度高、半衰期长、抗菌谱广。",
    category: "抗生素",
    difficulty: "easy",
  },
  {
    id: "q5",
    question: "关于氨基糖苷类抗生素的共同特点，下列哪项是错误的？",
    options: [
      "口服难吸收",
      "主要以原形经肾排泄",
      "对革兰阴性菌有强大抗菌活性",
      "无明显耳、肾毒性",
    ],
    correctAnswer: 3,
    explanation:
      "氨基糖苷类抗生素（如庆大霉素、阿米卡星）具有明显的耳毒性和肾毒性，这是其最主要的不良反应，临床使用时需监测肾功能和听力。",
    category: "抗生素",
    difficulty: "medium",
  },
  {
    id: "q6",
    question: "治疗和预防流行性脑脊髓膜炎的首选药物是？",
    options: ["青霉素G", "磺胺嘧啶", "氯霉素", "四环素"],
    correctAnswer: 1,
    explanation:
      "磺胺嘧啶（SD）血浆蛋白结合率低，易透过血脑屏障，在脑脊液中浓度高，是治疗和预防流行性脑脊髓膜炎的首选药物。",
    category: "抗生素",
    difficulty: "hard",
  },
  {
    id: "q7",
    question: "硝苯地平属于哪类降压药物？",
    options: ["β受体阻滞剂", "钙通道阻滞剂", "ACEI", "利尿剂"],
    correctAnswer: 1,
    explanation:
      "硝苯地平是二氢吡啶类钙通道阻滞剂，通过阻断血管平滑肌钙离子内流，扩张血管而降低血压。",
    category: "心血管药物",
    difficulty: "easy",
  },
  {
    id: "q8",
    question: "ACEI类降压药最常见的不良反应是？",
    options: ["踝部水肿", "干咳", "心动过缓", "低血钾"],
    correctAnswer: 1,
    explanation:
      "ACEI类药物抑制激肽酶，使缓激肽降解减少在肺部蓄积，刺激性干咳是其最常见的不良反应，也是停药的主要原因。",
    category: "心血管药物",
    difficulty: "easy",
  },
  {
    id: "q9",
    question: "他汀类药物主要降低的血脂指标是？",
    options: ["甘油三酯", "总胆固醇和LDL-C", "HDL-C", "脂蛋白a"],
    correctAnswer: 1,
    explanation:
      "他汀类药物通过抑制HMG-CoA还原酶，主要降低总胆固醇（TC）和低密度脂蛋白胆固醇（LDL-C），也可轻度降低甘油三酯（TG）、升高HDL-C。",
    category: "心血管药物",
    difficulty: "easy",
  },
  {
    id: "q10",
    question: "阿司匹林抗血小板聚集的常用剂量是？",
    options: ["5-10mg/日", "75-100mg/日", "500-1000mg/日", "3000-5000mg/日"],
    correctAnswer: 1,
    explanation:
      "小剂量阿司匹林（75-100mg/日）主要不可逆抑制血小板COX-1，减少血栓素A2（TXA2）生成，发挥抗血小板聚集作用。",
    category: "心血管药物",
    difficulty: "easy",
  },
  {
    id: "q11",
    question: "高血压合并支气管哮喘的患者，不宜使用下列哪类药物？",
    options: ["钙通道阻滞剂", "ACEI", "β受体阻滞剂", "ARB"],
    correctAnswer: 2,
    explanation:
      "非选择性β受体阻滞剂可阻断支气管平滑肌β2受体，诱发或加重支气管哮喘，因此高血压合并哮喘患者禁用。选择性β1受体阻滞剂也需慎用。",
    category: "心血管药物",
    difficulty: "medium",
  },
  {
    id: "q12",
    question: "急性心肌梗死早期使用链激酶或尿激酶的目的是？",
    options: [
      "解除疼痛",
      "溶解冠状动脉血栓",
      "控制休克",
      "治疗心力衰竭",
    ],
    correctAnswer: 1,
    explanation:
      "链激酶和尿激酶是常用的溶栓药物，通过激活纤溶酶原转化为纤溶酶，溶解冠状动脉内的血栓，恢复心肌血流灌注。",
    category: "心血管药物",
    difficulty: "medium",
  },
  {
    id: "q13",
    question: "质子泵抑制剂（PPI）发挥抑酸作用的靶点是？",
    options: ["H2受体", "胃泌素受体", "H+-K+-ATP酶", "M胆碱受体"],
    correctAnswer: 2,
    explanation:
      "PPI通过特异性抑制胃壁细胞上的H+-K+-ATP酶（即质子泵），阻止胃酸分泌的最后步骤，因此抑酸作用最强。",
    category: "消化系统药物",
    difficulty: "easy",
  },
  {
    id: "q14",
    question: "根除幽门螺杆菌的四联疗法通常包括？",
    options: [
      "PPI + 一种铋剂 + 一种抗生素",
      "PPI + 两种抗生素",
      "PPI + 一种铋剂 + 两种抗生素",
      "H2受体拮抗剂 + 铋剂 + 两种抗生素",
    ],
    correctAnswer: 2,
    explanation:
      "目前推荐的Hp根除方案为铋剂四联疗法：PPI（标准剂量，每日2次）+ 铋剂（标准剂量，每日2次）+ 两种抗生素，疗程10-14天。",
    category: "消化系统药物",
    difficulty: "easy",
  },
  {
    id: "q15",
    question: "蒙脱石散治疗腹泻的主要机制是？",
    options: [
      "抑制肠蠕动",
      "吸附病原体和毒素，保护肠黏膜",
      "减少肠道分泌",
      "抗菌作用",
    ],
    correctAnswer: 1,
    explanation:
      "蒙脱石散具有层纹状结构和巨大表面积及非均匀电荷分布，可吸附消化道内的病毒、细菌及其毒素，同时在黏膜表面形成保护层。",
    category: "消化系统药物",
    difficulty: "easy",
  },
  {
    id: "q16",
    question: "多潘立酮（吗丁啉）的主要作用机制是？",
    options: [
      "阻断胃肠道多巴胺受体",
      "激动5-HT4受体",
      "抑制胃酸分泌",
      "保护胃黏膜",
    ],
    correctAnswer: 0,
    explanation:
      "多潘立酮是外周多巴胺D2受体拮抗剂，通过阻断胃肠道多巴胺受体，促进胃肠蠕动和胃排空，同时具有一定止吐作用。",
    category: "消化系统药物",
    difficulty: "medium",
  },
  {
    id: "q17",
    question: "下列哪种药物导泻作用最强且起效最快？",
    options: ["乳果糖", "硫酸镁", "番泻叶", "聚乙二醇"],
    correctAnswer: 1,
    explanation:
      "硫酸镁是渗透性泻药，口服后在肠道难以吸收，形成高渗状态，阻止水分吸收，扩张肠道刺激蠕动，作用强而快。大量口服可引起剧烈腹泻。",
    category: "消化系统药物",
    difficulty: "medium",
  },
  {
    id: "q18",
    question: "缓解哮喘急性发作的首选药物是？",
    options: [
      "吸入性糖皮质激素",
      "短效β2受体激动剂",
      "长效β2受体激动剂",
      "白三烯调节剂",
    ],
    correctAnswer: 1,
    explanation:
      "短效β2受体激动剂（SABA）如沙丁胺醇，吸入后数分钟起效，维持4-6小时，是缓解哮喘急性发作症状的首选药物。",
    category: "呼吸系统药物",
    difficulty: "easy",
  },
  {
    id: "q19",
    question: "哮喘长期控制的首选药物是？",
    options: [
      "吸入性糖皮质激素",
      "短效β2受体激动剂",
      "茶碱类",
      "抗胆碱能药物",
    ],
    correctAnswer: 0,
    explanation:
      "吸入性糖皮质激素（ICS）通过抑制气道炎症细胞活化、减少炎症介质释放，是哮喘长期控制治疗的首选药物，需长期规律使用。",
    category: "呼吸系统药物",
    difficulty: "easy",
  },
  {
    id: "q20",
    question: "使用吸入性糖皮质激素后应漱口，主要是为了预防？",
    options: [
      "胃肠道反应",
      "口腔念珠菌感染和声音嘶哑",
      "骨质疏松",
      "肾上腺皮质功能抑制",
    ],
    correctAnswer: 1,
    explanation:
      "吸入后部分药物沉积在口咽部，可引起声音嘶哑和口腔念珠菌感染（鹅口疮），每次吸入后及时漱口并吐出漱口水可显著减少这些局部不良反应。",
    category: "呼吸系统药物",
    difficulty: "easy",
  },
  {
    id: "q21",
    question: "氨茶碱的平喘作用机制是？",
    options: [
      "激动β2受体",
      "抑制磷酸二酯酶",
      "阻断M胆碱受体",
      "阻断白三烯受体",
    ],
    correctAnswer: 1,
    explanation:
      "氨茶碱通过抑制磷酸二酯酶，减少cAMP降解，使细胞内cAMP水平升高，舒张支气管平滑肌。此外还具有强心、利尿、兴奋呼吸中枢等作用。",
    category: "呼吸系统药物",
    difficulty: "medium",
  },
  {
    id: "q22",
    question: "下列哪种药物属于中枢性镇咳药且有成瘾性？",
    options: ["右美沙芬", "可待因", "苯丙哌林", "氨溴索"],
    correctAnswer: 1,
    explanation:
      "可待因是阿片类生物碱，直接抑制延髓咳嗽中枢，镇咳作用强而迅速，但长期使用可产生成瘾性，仅用于各种原因引起的剧烈干咳。右美沙芬无成瘾性。",
    category: "呼吸系统药物",
    difficulty: "medium",
  },
  {
    id: "q23",
    question: "苯二氮䓬类药物中毒的特异性解救药是？",
    options: ["纳洛酮", "氟马西尼", "阿托品", "亚甲蓝"],
    correctAnswer: 1,
    explanation:
      "氟马西尼是苯二氮䓬（BZD）受体的特异性竞争性拮抗剂，可逆转BZD类药物的中枢抑制作用，用于BZD类药物过量中毒的解救。纳洛酮是阿片类中毒的解救药。",
    category: "神经系统药物",
    difficulty: "easy",
  },
  {
    id: "q24",
    question: "癫痫持续状态的首选药物是？",
    options: [
      "苯妥英钠口服",
      "地西泮静脉注射",
      "丙戊酸钠口服",
      "卡马西平口服",
    ],
    correctAnswer: 1,
    explanation:
      "地西泮静脉注射（10-20mg缓慢推注）是治疗癫痫持续状态的首选药物，起效快，作用强，可迅速控制发作。",
    category: "神经系统药物",
    difficulty: "easy",
  },
  {
    id: "q25",
    question: "癫痫小发作（失神发作）的首选药物是？",
    options: ["苯妥英钠", "卡马西平", "乙琥胺", "苯巴比妥"],
    correctAnswer: 2,
    explanation:
      "乙琥胺是琥珀酰亚胺类抗癫痫药，对小发作（失神发作）有效且疗效好，是治疗失神发作的首选药物。",
    category: "神经系统药物",
    difficulty: "medium",
  },
  {
    id: "q26",
    question: "吗啡的中毒症状不包括？",
    options: ["昏迷", "呼吸深度抑制", "瞳孔散大", "血压下降"],
    correctAnswer: 2,
    explanation:
      "吗啡急性中毒典型表现为昏迷、呼吸深度抑制、瞳孔极度缩小（针尖样瞳孔，是吗啡中毒的特征性表现）、血压下降甚至休克。瞳孔散大不是吗啡中毒表现。",
    category: "神经系统药物",
    difficulty: "medium",
  },
  {
    id: "q27",
    question: "阿片类药物急性中毒的特异性解救药是？",
    options: ["氟马西尼", "纳洛酮", "阿托品", "碘解磷定"],
    correctAnswer: 1,
    explanation:
      "纳洛酮是阿片受体的特异性拮抗剂，可竞争性阻断阿片类药物与受体结合，快速逆转阿片类药物的中毒症状，是阿片类急性中毒的首选解救药。",
    category: "神经系统药物",
    difficulty: "easy",
  },
  {
    id: "q28",
    question: "治疗帕金森病最有效的药物是？",
    options: ["苯海索", "左旋多巴", "金刚烷胺", "溴隐亭"],
    correctAnswer: 1,
    explanation:
      "左旋多巴是多巴胺的前体，可透过血脑屏障进入中枢，经多巴脱羧酶转化为多巴胺，补充纹状体中多巴胺的不足，是治疗帕金森病最有效的药物。",
    category: "神经系统药物",
    difficulty: "medium",
  },
  {
    id: "q29",
    question: "2型糖尿病的一线首选药物是？",
    options: ["胰岛素", "二甲双胍", "格列美脲", "阿卡波糖"],
    correctAnswer: 1,
    explanation:
      "二甲双胍是2型糖尿病的一线首选和全程用药，具有不增加体重、不引起低血糖、心血管保护等优点，除非有禁忌症，所有患者均应起始使用。",
    category: "内分泌系统药物",
    difficulty: "easy",
  },
  {
    id: "q30",
    question: "胰岛素最常见的不良反应是？",
    options: ["过敏反应", "低血糖反应", "注射部位脂肪萎缩", "体重增加"],
    correctAnswer: 1,
    explanation:
      "低血糖是胰岛素最常见的不良反应，多因胰岛素用量过大或未按时进食所致，表现为心悸、出汗、饥饿感、手抖，严重者可出现意识障碍甚至昏迷。",
    category: "内分泌系统药物",
    difficulty: "easy",
  },
  {
    id: "q31",
    question: "甲状腺功能减退症的替代治疗首选药物是？",
    options: ["甲巯咪唑", "丙硫氧嘧啶", "左甲状腺素钠", "碘化钾"],
    correctAnswer: 2,
    explanation:
      "左甲状腺素钠（L-T4）是甲减替代治疗的首选药物，在外周组织转化为活性T3发挥作用，需终身服用，晨起空腹服用吸收效果最佳。",
    category: "内分泌系统药物",
    difficulty: "easy",
  },
  {
    id: "q32",
    question: "硫脲类抗甲状腺药的严重不良反应是？",
    options: ["皮疹", "粒细胞缺乏症", "胃肠道反应", "头痛"],
    correctAnswer: 1,
    explanation:
      "粒细胞缺乏症是硫脲类（甲巯咪唑、丙硫氧嘧啶）最严重的不良反应，虽然发生率低（约0.1%-0.5%），但可危及生命，用药期间需定期监测血常规。",
    category: "内分泌系统药物",
    difficulty: "medium",
  },
  {
    id: "q33",
    question: "下列哪项不是糖皮质激素的药理作用？",
    options: ["抗炎作用", "抗免疫作用", "抗菌作用", "抗休克作用"],
    correctAnswer: 2,
    explanation:
      "糖皮质激素具有'四抗'作用：抗炎、抗免疫、抗毒、抗休克，但无直接抗菌作用，反而因抑制免疫功能可能诱发或加重感染。",
    category: "内分泌系统药物",
    difficulty: "easy",
  },
  {
    id: "q34",
    question: "长期大剂量使用糖皮质激素的典型不良反应不包括？",
    options: ["骨质疏松", "高血糖", "低血压", "诱发或加重感染"],
    correctAnswer: 2,
    explanation:
      "长期大剂量使用糖皮质激素可引起水钠潴留，导致高血压而非低血压。其他常见不良反应包括骨质疏松、高血糖、消化道溃疡、诱发或加重感染等。",
    category: "内分泌系统药物",
    difficulty: "easy",
  },
  {
    id: "q35",
    question: "阿卡波糖的降糖作用机制是？",
    options: [
      "刺激胰岛素分泌",
      "增加胰岛素敏感性",
      "延缓碳水化合物在肠道吸收",
      "抑制肾脏葡萄糖重吸收",
    ],
    correctAnswer: 2,
    explanation:
      "阿卡波糖是α-糖苷酶抑制剂，通过竞争性抑制小肠黏膜刷状缘的α-葡萄糖苷酶，延缓碳水化合物的消化和吸收，主要降低餐后血糖。",
    category: "内分泌系统药物",
    difficulty: "medium",
  },
  {
    id: "q36",
    question: "二甲双胍的严重但罕见的不良反应是？",
    options: ["低血糖", "乳酸酸中毒", "胃肠道反应", "维生素B12缺乏"],
    correctAnswer: 1,
    explanation:
      "乳酸酸中毒是二甲双胍最严重的不良反应，虽然罕见（发生率约0.03/1000患者年），但死亡率高，在肾功能不全、缺氧、大手术等情况下风险增加。",
    category: "内分泌系统药物",
    difficulty: "hard",
  },
  {
    id: "q37",
    question: "使用造影剂前后需要暂停的口服降糖药是？",
    options: ["格列美脲", "二甲双胍", "阿卡波糖", "西格列汀"],
    correctAnswer: 1,
    explanation:
      "造影剂可能影响肾功能，导致二甲双胍蓄积，增加乳酸酸中毒风险。因此在使用造影剂前48小时和使用后48小时需暂停二甲双胍。",
    category: "内分泌系统药物",
    difficulty: "hard",
  },
  {
    id: "q38",
    question: "长效糖皮质激素是？",
    options: ["氢化可的松", "泼尼松", "甲泼尼龙", "地塞米松"],
    correctAnswer: 3,
    explanation:
      "糖皮质激素按作用持续时间分类：短效（可的松、氢化可的松）；中效（泼尼松、泼尼松龙、甲泼尼龙）；长效（地塞米松、倍他米松）。",
    category: "内分泌系统药物",
    difficulty: "medium",
  },
  {
    id: "q39",
    question: "下列哪种药物不属于降糖药物？",
    options: ["达格列净", "西格列汀", "螺内酯", "吡格列酮"],
    correctAnswer: 2,
    explanation:
      "螺内酯是保钾利尿剂，也是醛固酮受体拮抗剂，用于心衰和高血压治疗。达格列净是SGLT-2抑制剂，西格列汀是DPP-4抑制剂，吡格列酮是TZDs，均为降糖药。",
    category: "内分泌系统药物",
    difficulty: "medium",
  },
  {
    id: "q40",
    question: "关于磺酰脲类降糖药，下列哪项是错误的？",
    options: [
      "刺激胰岛β细胞分泌胰岛素",
      "可能引起低血糖反应",
      "适用于1型糖尿病",
      "可能增加体重",
    ],
    correctAnswer: 2,
    explanation:
      "磺酰脲类通过刺激胰岛β细胞分泌胰岛素发挥作用，因此仅适用于尚存一定β细胞功能的2型糖尿病患者，1型糖尿病患者β细胞功能衰竭，磺酰脲类无效。",
    category: "内分泌系统药物",
    difficulty: "medium",
  },
  {
    id: "q41",
    question: "丙硫氧嘧啶（PTU）治疗甲状腺危象的机制是？",
    options: [
      "抑制甲状腺激素的合成和释放",
      "仅抑制甲状腺激素合成",
      "抑制甲状腺激素合成及外周T4转化为T3",
      "破坏甲状腺滤泡上皮细胞",
    ],
    correctAnswer: 2,
    explanation:
      "PTU除抑制甲状腺过氧化物酶、阻止甲状腺激素合成外，还可抑制外周组织的5'-脱碘酶，减少T4转化为活性更强的T3，因此更适用于甲状腺危象的治疗。",
    category: "内分泌系统药物",
    difficulty: "hard",
  },
  {
    id: "q42",
    question: "氯雷他定属于哪类药物？",
    options: [
      "第一代H1受体拮抗剂",
      "第二代H1受体拮抗剂",
      "H2受体拮抗剂",
      "糖皮质激素",
    ],
    correctAnswer: 1,
    explanation:
      "氯雷他定是第二代非镇静H1受体拮抗剂，选择性阻断外周H1受体，不易透过血脑屏障，无明显中枢镇静作用，广泛用于过敏性疾病。",
    category: "内分泌系统药物",
    difficulty: "easy",
  },
  {
    id: "q43",
    question: "长期使用糖皮质激素突然停药可引起？",
    options: [
      "类肾上腺皮质功能亢进症",
      "医源性肾上腺皮质功能不全",
      "甲状腺危象",
      "低血糖",
    ],
    correctAnswer: 1,
    explanation:
      "长期大剂量使用糖皮质激素，反馈性抑制下丘脑-垂体-肾上腺轴，使ACTH分泌减少，肾上腺皮质萎缩。突然停药可出现肾上腺皮质功能不全，严重者可危及生命。",
    category: "内分泌系统药物",
    difficulty: "medium",
  },
  {
    id: "q44",
    question: "SGLT-2抑制剂的降糖机制是？",
    options: [
      "刺激胰岛素分泌",
      "增加胰岛素敏感性",
      "抑制肾脏对葡萄糖的重吸收",
      "延缓碳水化合物吸收",
    ],
    correctAnswer: 2,
    explanation:
      "SGLT-2（钠-葡萄糖协同转运蛋白2）抑制剂如达格列净、恩格列净，通过抑制近端肾小管SGLT-2，减少肾脏对葡萄糖的重吸收，增加尿糖排泄而降低血糖。",
    category: "内分泌系统药物",
    difficulty: "medium",
  },
  {
    id: "q45",
    question: "关于胰岛素的使用，下列哪项是正确的？",
    options: [
      "所有胰岛素都可以静脉注射",
      "胰岛素应冷冻保存",
      "低血糖是最常见的不良反应",
      "胰岛素仅用于1型糖尿病",
    ],
    correctAnswer: 2,
    explanation:
      "低血糖反应是胰岛素最常见的不良反应。只有短效（普通）胰岛素可静脉注射，中长效胰岛素只能皮下注射；胰岛素应冷藏保存（2-8℃），不可冷冻；胰岛素也用于部分2型糖尿病患者。",
    category: "内分泌系统药物",
    difficulty: "easy",
  },
  {
    id: "q46",
    question: "阿司匹林哮喘的发生机制是？",
    options: [
      "抗原抗体反应",
      "抑制COX使白三烯合成增加",
      "直接刺激支气管平滑肌",
      "促进组胺释放",
    ],
    correctAnswer: 1,
    explanation:
      "阿司匹林等非甾体抗炎药抑制COX，使PG合成受阻，而花生四烯酸代谢转向脂氧酶途径，白三烯合成增加，白三烯是强效支气管收缩剂，诱发哮喘。",
    category: "神经系统药物",
    difficulty: "hard",
  },
  {
    id: "q47",
    question: "卡马西平除了抗癫痫外，还可用于治疗？",
    options: ["帕金森病", "三叉神经痛", "失眠", "抑郁症"],
    correctAnswer: 1,
    explanation:
      "卡马西平是部分性发作的首选抗癫痫药，同时也是治疗三叉神经痛的首选药物，疗效优于苯妥英钠。",
    category: "神经系统药物",
    difficulty: "medium",
  },
  {
    id: "q48",
    question: "肝豆状核变性（Wilson病）的首选治疗药物是？",
    options: ["左旋多巴", "青霉胺", "苯海索", "金刚烷胺"],
    correctAnswer: 1,
    explanation:
      "青霉胺是铜离子螯合剂，可结合体内过量的铜离子，增加尿铜排泄，是治疗肝豆状核变性的首选药物。",
    category: "神经系统药物",
    difficulty: "hard",
  },
  {
    id: "q49",
    question: "COPD稳定期长期维持治疗的首选支气管扩张剂是？",
    options: [
      "短效β2受体激动剂",
      "长效抗胆碱能药物",
      "吸入性糖皮质激素",
      "茶碱类",
    ],
    correctAnswer: 1,
    explanation:
      "长效抗胆碱能药物（LAMA）如噻托溴铵，作用持续24小时，是COPD稳定期长期维持治疗的首选支气管扩张剂，可显著改善肺功能和生活质量。",
    category: "呼吸系统药物",
    difficulty: "hard",
  },
  {
    id: "q50",
    question: "孟鲁司特属于哪类平喘药？",
    options: [
      "β2受体激动剂",
      "糖皮质激素",
      "白三烯调节剂",
      "抗胆碱能药物",
    ],
    correctAnswer: 2,
    explanation:
      "孟鲁司特是白三烯受体拮抗剂，通过阻断半胱氨酰白三烯受体，减轻气道炎症和痉挛，可作为轻度哮喘的替代治疗和中重度哮喘的联合治疗。",
    category: "呼吸系统药物",
    difficulty: "medium",
  },
];
