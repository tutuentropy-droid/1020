import { useParams, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Stethoscope,
  Microscope,
  AlertTriangle,
  Ban,
  Pill,
  Info,
} from "lucide-react";
import { drugs } from "@/data/drugs";
import { cn } from "@/lib/utils";

const categoryColors: Record<string, string> = {
  抗生素: "bg-blue-50 text-blue-700 border-blue-200",
  心血管药物: "bg-rose-50 text-rose-700 border-rose-200",
  消化系统药物: "bg-amber-50 text-amber-700 border-amber-200",
  呼吸系统药物: "bg-cyan-50 text-cyan-700 border-cyan-200",
  神经系统药物: "bg-violet-50 text-violet-700 border-violet-200",
  内分泌系统药物: "bg-emerald-50 text-emerald-700 border-emerald-200",
};

interface SectionProps {
  icon: React.ElementType;
  title: string;
  iconBg: string;
  iconColor: string;
  children: React.ReactNode;
}

function Section({ icon: Icon, title, iconBg, iconColor, children }: SectionProps) {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-6 hover:shadow-md transition-shadow animate-slide-up">
      <div className="flex items-center gap-3 mb-4">
        <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center", iconBg)}>
          <Icon className={cn("w-5 h-5", iconColor)} />
        </div>
        <h3 className="text-lg font-bold text-gray-900">{title}</h3>
      </div>
      <div className="text-gray-600 leading-relaxed">{children}</div>
    </div>
  );
}

export default function DrugDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const drug = drugs.find((d) => d.id === id);

  if (!drug) {
    return (
      <div className="py-20 text-center animate-fade-in">
        <h3 className="text-xl font-semibold text-gray-700 mb-2">药物未找到</h3>
        <button
          onClick={() => navigate("/drugs")}
          className="text-primary-600 hover:text-primary-700 font-medium"
        >
          返回药物列表
        </button>
      </div>
    );
  }

  const colorClass =
    categoryColors[drug.category] || "bg-gray-50 text-gray-700 border-gray-200";

  const sections: Omit<SectionProps, "children">[] = [
    {
      icon: Stethoscope,
      title: "适应症",
      iconBg: "bg-primary-50",
      iconColor: "text-primary-600",
    },
    {
      icon: Microscope,
      title: "作用机制",
      iconBg: "bg-accent-50",
      iconColor: "text-accent-600",
    },
    {
      icon: AlertTriangle,
      title: "不良反应",
      iconBg: "bg-warning-50",
      iconColor: "text-warning-600",
    },
    {
      icon: Ban,
      title: "禁忌症",
      iconBg: "bg-rose-50",
      iconColor: "text-rose-600",
    },
    {
      icon: Pill,
      title: "常用剂量",
      iconBg: "bg-violet-50",
      iconColor: "text-violet-600",
    },
    {
      icon: Info,
      title: "简介",
      iconBg: "bg-gray-100",
      iconColor: "text-gray-600",
    },
  ];

  const renderSectionContent = (index: number) => {
    switch (index) {
      case 0:
        return (
          <ul className="space-y-2">
            {drug.indications.map((item, i) => (
              <li key={i} className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-primary-500 mt-2 flex-shrink-0" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        );
      case 1:
        return <p>{drug.mechanism}</p>;
      case 2:
        return (
          <ul className="space-y-2">
            {drug.adverseReactions.map((item, i) => (
              <li key={i} className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-warning-500 mt-2 flex-shrink-0" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        );
      case 3:
        return (
          <ul className="space-y-2">
            {drug.contraindications.map((item, i) => (
              <li key={i} className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-rose-500 mt-2 flex-shrink-0" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        );
      case 4:
        return <p>{drug.dosage}</p>;
      case 5:
        return <p>{drug.description}</p>;
      default:
        return null;
    }
  };

  return (
    <div className="space-y-8 animate-fade-in">
      <button
        onClick={() => navigate("/drugs")}
        className="inline-flex items-center gap-2 text-gray-600 hover:text-primary-600 font-medium transition-colors group"
      >
        <ArrowLeft className="w-5 h-5 group-hover:-translate-x-0.5 transition-transform" />
        <span>返回药物列表</span>
      </button>

      <div className="bg-gradient-to-br from-primary-500 via-primary-600 to-accent-500 rounded-3xl p-8 text-white shadow-xl">
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div>
            <div className="flex items-center gap-3 mb-3">
              <div className="w-14 h-14 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center">
                <Pill className="w-7 h-7 text-white" />
              </div>
              <div>
                <h1 className="text-3xl md:text-4xl font-bold font-serif">{drug.name}</h1>
              </div>
            </div>
            <span
              className={cn(
                "inline-flex items-center px-4 py-1.5 rounded-full text-sm font-medium border",
                colorClass
              )}
            >
              {drug.category}
            </span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {sections.map((section, index) => (
          <div key={section.title} style={{ animationDelay: `${index * 60}ms` }}>
            <Section
              icon={section.icon}
              title={section.title}
              iconBg={section.iconBg}
              iconColor={section.iconColor}
            >
              {renderSectionContent(index)}
            </Section>
          </div>
        ))}
      </div>
    </div>
  );
}
