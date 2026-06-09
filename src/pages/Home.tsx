import { Link } from "react-router-dom";
import { Pill, BookOpen, FileQuestion, TrendingUp, ArrowRight, GraduationCap, Target, Award, AlertTriangle, Library, BookX, Zap, Network, Calculator, ShieldAlert } from "lucide-react";
import { useStore } from "@/store/useStore";

const featureCards = [
  {
    title: "药物知识库",
    description: "系统学习各类常用药物的适应症、作用机制、不良反应等核心知识",
    icon: Pill,
    link: "/drugs",
    gradient: "from-blue-500 to-indigo-600",
    bgLight: "bg-blue-50",
  },
  {
    title: "药理知识图谱",
    description: "可视化探索药物、靶点、疾病、副作用之间的关联网络，辅助理解药物作用机制",
    icon: Network,
    link: "/knowledge-graph",
    gradient: "from-indigo-500 to-purple-600",
    bgLight: "bg-indigo-50",
  },
  {
    title: "相互作用查询",
    description: "快速查询两种或多种药物之间的相互作用风险等级和详细解释",
    icon: AlertTriangle,
    link: "/interactions",
    gradient: "from-orange-500 to-red-600",
    bgLight: "bg-orange-50",
  },
  {
    title: "药理计算器",
    description: "儿童剂量、肌酐清除率、体表面积、负荷/维持剂量、TDM模拟等临床计算工具集",
    icon: Calculator,
    link: "/calculators",
    gradient: "from-sky-500 to-blue-600",
    bgLight: "bg-sky-50",
  },
  {
    title: "ADR上报模拟",
    description: "系统随机生成病例，练习ADR识别、严重程度分级、因果关系评价及规范上报流程",
    icon: ShieldAlert,
    link: "/adr-simulation",
    gradient: "from-rose-500 to-red-600",
    bgLight: "bg-rose-50",
  },
  {
    title: "典型案例库",
    description: "学习常见错误配伍的真实临床案例，掌握高危药物组合的识别与处理",
    icon: Library,
    link: "/cases",
    gradient: "from-violet-500 to-purple-600",
    bgLight: "bg-violet-50",
  },
  {
    title: "学习模块",
    description: "分章节、分系统的结构化学习内容，循序渐进掌握药理学知识",
    icon: BookOpen,
    link: "/learn",
    gradient: "from-emerald-500 to-teal-600",
    bgLight: "bg-emerald-50",
  },
  {
    title: "测验系统",
    description: "丰富的题库资源，智能组卷，即时反馈，巩固学习效果",
    icon: FileQuestion,
    link: "/quiz",
    gradient: "from-amber-500 to-orange-600",
    bgLight: "bg-amber-50",
  },
  {
    title: "错题本",
    description: "自动收录答错题目，智能重练模式优先攻克薄弱知识点",
    icon: BookX,
    link: "/wrong-book",
    gradient: "from-rose-500 to-red-600",
    bgLight: "bg-rose-50",
  },
  {
    title: "个人进度",
    description: "实时追踪学习进度、测验成绩，可视化展示成长轨迹",
    icon: TrendingUp,
    link: "/progress",
    gradient: "from-fuchsia-500 to-pink-600",
    bgLight: "bg-rose-50",
  },
];

export default function Home() {
  const { learningProgress, quizHistory, wrongQuestions, questionStats } = useStore();

  const completedChapters = learningProgress.filter((p) => p.status === "completed").length;
  const totalQuizzes = quizHistory.length;
  const avgScore =
    totalQuizzes > 0
      ? Math.round(
          quizHistory.reduce((sum, q) => sum + (q.score / q.totalQuestions) * 100, 0) / totalQuizzes
        )
      : 0;
  const activeWrongCount = wrongQuestions.filter((w) => !w.mastered).length;
  const totalAttempts = questionStats.reduce((sum, s) => sum + s.totalAttempts, 0);
  const totalCorrect = questionStats.reduce((sum, s) => sum + s.correctAttempts, 0);
  const overallAccuracy = totalAttempts > 0 ? Math.round((totalCorrect / totalAttempts) * 100) : 0;

  const stats = [
    {
      label: "已完成章节",
      value: completedChapters,
      icon: GraduationCap,
      color: "text-primary-600",
      bg: "bg-primary-50",
    },
    {
      label: "测验次数",
      value: totalQuizzes,
      icon: Target,
      color: "text-accent-600",
      bg: "bg-accent-50",
    },
    {
      label: "平均得分",
      value: `${avgScore}%`,
      icon: Award,
      color: "text-warning-600",
      bg: "bg-warning-50",
    },
    {
      label: "待复习错题",
      value: activeWrongCount,
      icon: BookX,
      color: "text-rose-600",
      bg: "bg-rose-50",
    },
  ];

  return (
    <div className="space-y-16 animate-fade-in">
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-primary-600 via-primary-500 to-accent-500 p-8 md:p-14 shadow-2xl">
        <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
        <div className="absolute bottom-0 left-0 w-72 h-72 bg-accent-400/20 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />
        <div className="relative z-10 max-w-3xl">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-white/20 backdrop-blur-sm rounded-full text-white/90 text-sm font-medium mb-6">
            <Pill className="w-4 h-4" />
            <span>专业药理学学习平台</span>
          </div>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight mb-6 font-serif">
            你的药你知道
          </h1>
          <p className="text-lg md:text-xl text-white/90 leading-relaxed mb-8">
            系统掌握常用药物知识，提升临床用药素养。从药物分类到作用机制，
            从适应症到不良反应，助你成为用药达人。
          </p>
          <div className="flex flex-wrap gap-4">
            <Link
              to="/learn"
              className="inline-flex items-center gap-2 px-7 py-3.5 bg-white text-primary-600 font-semibold rounded-xl shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300"
            >
              开始学习
              <ArrowRight className="w-5 h-5" />
            </Link>
            <Link
              to="/drugs"
              className="inline-flex items-center gap-2 px-7 py-3.5 bg-white/15 backdrop-blur-sm text-white font-semibold rounded-xl border border-white/30 hover:bg-white/25 transition-all duration-300"
            >
              浏览药物库
            </Link>
            {activeWrongCount > 0 && (
              <Link
                to="/wrong-book"
                className="inline-flex items-center gap-2 px-7 py-3.5 bg-rose-500 hover:bg-rose-600 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300"
              >
                <Zap className="w-5 h-5" />
                智能重练 ({activeWrongCount} 道错题)
              </Link>
            )}
          </div>
          {overallAccuracy > 0 && (
            <div className="mt-6 inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full text-white/80 text-sm">
              <Target className="w-4 h-4" />
              <span>整体答题正确率：{overallAccuracy}%</span>
            </div>
          )}
        </div>
      </section>

      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {featureCards.map((card, index) => {
          const Icon = card.icon;
          return (
            <Link
              key={card.title}
              to={card.link}
              className="group relative bg-white rounded-2xl p-6 border border-gray-100 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 animate-slide-up"
              style={{ animationDelay: `${index * 80}ms` }}
            >
              <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${card.gradient} flex items-center justify-center mb-5 shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                <Icon className="w-7 h-7 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-primary-600 transition-colors">
                {card.title}
              </h3>
              <p className="text-sm text-gray-500 leading-relaxed mb-5">
                {card.description}
              </p>
              <div className="flex items-center gap-1.5 text-primary-600 font-medium text-sm group-hover:gap-2.5 transition-all">
                <span>进入</span>
                <ArrowRight className="w-4 h-4" />
              </div>
            </Link>
          );
        })}
      </section>

      <section className="bg-white rounded-2xl border border-gray-100 p-6 md:p-8">
        <div className="flex items-center gap-3 mb-8">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center">
            <TrendingUp className="w-5 h-5 text-white" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-900">学习进度概览</h2>
            <p className="text-sm text-gray-500">追踪你的学习旅程</p>
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <div
                key={stat.label}
                className="relative rounded-2xl p-6 bg-gradient-to-br from-gray-50 to-white border border-gray-100 hover:shadow-md transition-all duration-300 animate-slide-up"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className={`w-12 h-12 rounded-xl ${stat.bg} flex items-center justify-center mb-4`}>
                  <Icon className={`w-6 h-6 ${stat.color}`} />
                </div>
                <div className="text-3xl font-bold text-gray-900 mb-1">
                  {stat.value}
                </div>
                <div className="text-sm text-gray-500">{stat.label}</div>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
}
