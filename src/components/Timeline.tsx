import { useState, useMemo } from "react";
import {
  Beaker,
  FlaskConical,
  CheckCircle2,
  AlertOctagon,
  BookOpen,
  Star,
  ChevronDown,
  ChevronUp,
  ExternalLink,
  Filter,
  Maximize2,
  Minimize2,
  Calendar,
} from "lucide-react";
import { TimelineEvent, TimelineEventType } from "@/types";
import { cn } from "@/lib/utils";

interface TimelineProps {
  events: TimelineEvent[];
  showHeader?: boolean;
}

const typeConfig: Record<
  TimelineEventType,
  {
    icon: React.ElementType;
    label: string;
    dotBg: string;
    dotBorder: string;
    iconColor: string;
    badgeBg: string;
    badgeText: string;
  }
> = {
  discovery: {
    icon: FlaskConical,
    label: "发现",
    dotBg: "bg-primary-500",
    dotBorder: "border-primary-200",
    iconColor: "text-white",
    badgeBg: "bg-primary-50",
    badgeText: "text-primary-700",
  },
  "clinical-trial": {
    icon: Beaker,
    label: "临床试验",
    dotBg: "bg-violet-500",
    dotBorder: "border-violet-200",
    iconColor: "text-white",
    badgeBg: "bg-violet-50",
    badgeText: "text-violet-700",
  },
  approval: {
    icon: CheckCircle2,
    label: "批准上市",
    dotBg: "bg-accent-500",
    dotBorder: "border-accent-200",
    iconColor: "text-white",
    badgeBg: "bg-accent-50",
    badgeText: "text-accent-700",
  },
  "safety-event": {
    icon: AlertOctagon,
    label: "安全事件",
    dotBg: "bg-rose-500",
    dotBorder: "border-rose-200",
    iconColor: "text-white",
    badgeBg: "bg-rose-50",
    badgeText: "text-rose-700",
  },
  guideline: {
    icon: BookOpen,
    label: "指南更新",
    dotBg: "bg-cyan-500",
    dotBorder: "border-cyan-200",
    iconColor: "text-white",
    badgeBg: "bg-cyan-50",
    badgeText: "text-cyan-700",
  },
  milestone: {
    icon: Star,
    label: "重要里程碑",
    dotBg: "bg-warning-500",
    dotBorder: "border-warning-200",
    iconColor: "text-white",
    badgeBg: "bg-warning-50",
    badgeText: "text-warning-700",
  },
};

interface TimelineItemProps {
  event: TimelineEvent;
  isLast: boolean;
  index: number;
  isExpanded: boolean;
  onToggle: () => void;
}

function TimelineItem({ event, isLast, index, isExpanded, onToggle }: TimelineItemProps) {
  const config = typeConfig[event.type];
  const Icon = config.icon;

  return (
    <div className="relative pl-10 pb-8 animate-slide-up" style={{ animationDelay: `${index * 80}ms` }}>
      {!isLast && (
        <div className="absolute left-[15px] top-10 bottom-0 w-0.5 bg-gradient-to-b from-gray-200 to-gray-100" />
      )}

      <div
        className={cn(
          "absolute left-0 top-0 w-8 h-8 rounded-full flex items-center justify-center border-4 shadow-md z-10 transition-all duration-300",
          config.dotBg,
          config.dotBorder,
          isExpanded && "scale-110 shadow-lg"
        )}
      >
        <Icon className={cn("w-4 h-4", config.iconColor)} />
      </div>

      <div
        className={cn(
          "bg-white rounded-2xl border border-gray-100 overflow-hidden transition-all duration-300",
          "hover:shadow-md cursor-pointer",
          isExpanded && "shadow-md border-gray-200"
        )}
        onClick={onToggle}
      >
        <div className="p-5">
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <span className="text-lg font-bold text-gray-900 font-serif">
                  {event.year}
                </span>
                <span
                  className={cn(
                    "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium",
                    config.badgeBg,
                    config.badgeText
                  )}
                >
                  <Icon className="w-3 h-3 mr-1" />
                  {config.label}
                </span>
              </div>
              <h4 className="text-base font-semibold text-gray-800 mb-2">
                {event.title}
              </h4>
              <p className="text-sm text-gray-600 leading-relaxed">
                {event.summary}
              </p>
            </div>
            <div className="flex-shrink-0 mt-1">
              {isExpanded ? (
                <ChevronUp className="w-5 h-5 text-gray-400" />
              ) : (
                <ChevronDown className="w-5 h-5 text-gray-400" />
              )}
            </div>
          </div>
        </div>

        <div
          className={cn(
            "overflow-hidden transition-all duration-300 ease-in-out",
            isExpanded ? "max-h-[800px] opacity-100" : "max-h-0 opacity-0"
          )}
        >
          <div className="px-5 pb-5 border-t border-gray-50">
            {event.imageUrl && (
              <div className="mt-4 mb-4">
                <img
                  src={event.imageUrl}
                  alt={event.title}
                  className="w-full h-48 object-cover rounded-xl border border-gray-100"
                />
              </div>
            )}

            {event.details && (
              <div className="mt-4">
                <h5 className="text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                  <BookOpen className="w-4 h-4 text-primary-500" />
                  详细说明
                </h5>
                <p className="text-sm text-gray-600 leading-relaxed whitespace-pre-line">
                  {event.details}
                </p>
              </div>
            )}

            {event.references && event.references.length > 0 && (
              <div className="mt-4">
                <h5 className="text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                  <ExternalLink className="w-4 h-4 text-primary-500" />
                  参考资料
                </h5>
                <ul className="space-y-1">
                  {event.references.map((ref, i) => (
                    <li
                      key={i}
                      className="text-xs text-gray-500 flex items-start gap-2"
                    >
                      <span className="text-gray-400 mt-0.5">[{i + 1}]</span>
                      <span>{ref}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function Timeline({ events, showHeader = true }: TimelineProps) {
  const [activeFilters, setActiveFilters] = useState<Set<TimelineEventType>>(new Set());
  const [allExpanded, setAllExpanded] = useState(false);
  const [expandedIds, setExpandedIds] = useState<Set<string>>(new Set());

  const sortedEvents = useMemo(
    () => [...events].sort((a, b) => a.year - b.year),
    [events]
  );

  const filteredEvents = useMemo(() => {
    if (activeFilters.size === 0) return sortedEvents;
    return sortedEvents.filter((event) => activeFilters.has(event.type));
  }, [sortedEvents, activeFilters]);

  const typeCounts = useMemo(() => {
    return sortedEvents.reduce((acc, event) => {
      acc[event.type] = (acc[event.type] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
  }, [sortedEvents]);

  const toggleFilter = (type: TimelineEventType) => {
    setActiveFilters((prev) => {
      const next = new Set(prev);
      if (next.has(type)) {
        next.delete(type);
      } else {
        next.add(type);
      }
      return next;
    });
  };

  const clearFilters = () => {
    setActiveFilters(new Set());
  };

  const toggleAllExpand = () => {
    if (allExpanded) {
      setExpandedIds(new Set());
    } else {
      setExpandedIds(new Set(filteredEvents.map((e) => e.id)));
    }
    setAllExpanded(!allExpanded);
  };

  const toggleExpand = (id: string) => {
    setExpandedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  const timeRange = useMemo(() => {
    if (sortedEvents.length === 0) return null;
    const startYear = sortedEvents[0].year;
    const endYear = sortedEvents[sortedEvents.length - 1].year;
    return { startYear, endYear, span: endYear - startYear };
  }, [sortedEvents]);

  return (
    <div className="space-y-5">
      {showHeader && (
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Calendar className="w-5 h-5 text-primary-500" />
            {timeRange && (
              <span className="text-sm text-gray-600">
                共 <span className="font-semibold text-gray-900">{sortedEvents.length}</span> 个重要事件
                <span className="mx-1 text-gray-300">·</span>
                跨越 <span className="font-semibold text-gray-900">{timeRange.span}</span> 年
                <span className="mx-1 text-gray-300">·</span>
                {timeRange.startYear} - {timeRange.endYear}
              </span>
            )}
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={toggleAllExpand}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
            >
              {allExpanded ? (
                <>
                  <Minimize2 className="w-3.5 h-3.5" />
                  全部收起
                </>
              ) : (
                <>
                  <Maximize2 className="w-3.5 h-3.5" />
                  全部展开
                </>
              )}
            </button>
          </div>
        </div>
      )}

      <div className="flex flex-wrap items-center gap-2">
        <div className="flex items-center gap-1.5 text-xs text-gray-500 mr-1">
          <Filter className="w-3.5 h-3.5" />
          <span>筛选：</span>
        </div>
        {Object.entries(typeCounts).map(([type, count]) => {
          const config = typeConfig[type as TimelineEventType];
          const Icon = config.icon;
          const isActive = activeFilters.has(type as TimelineEventType);
          return (
            <button
              key={type}
              onClick={() => toggleFilter(type as TimelineEventType)}
              className={cn(
                "inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs font-medium transition-all duration-200",
                isActive
                  ? `${config.badgeBg} ${config.badgeText} border-current shadow-sm scale-105`
                  : "bg-gray-50 text-gray-500 border-gray-200 hover:bg-gray-100 hover:text-gray-700"
              )}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{config.label}</span>
              <span
                className={cn(
                  "px-1.5 py-0.5 rounded text-[10px]",
                  isActive ? "bg-white/60" : "bg-gray-200 text-gray-500"
                )}
              >
                {count}
              </span>
            </button>
          );
        })}
        {activeFilters.size > 0 && (
          <button
            onClick={clearFilters}
            className="text-xs text-gray-500 hover:text-gray-700 underline underline-offset-2 ml-1"
          >
            清除筛选
          </button>
        )}
      </div>

      {activeFilters.size > 0 && filteredEvents.length === 0 ? (
        <div className="py-12 text-center">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gray-100 flex items-center justify-center">
            <Filter className="w-8 h-8 text-gray-400" />
          </div>
          <p className="text-gray-500 text-sm">当前筛选条件下暂无事件</p>
          <button
            onClick={clearFilters}
            className="mt-3 text-primary-600 hover:text-primary-700 text-sm font-medium"
          >
            清除筛选条件
          </button>
        </div>
      ) : (
        <div className="pt-2">
          {filteredEvents.map((event, index) => (
            <TimelineItem
              key={event.id}
              event={event}
              isLast={index === filteredEvents.length - 1}
              index={index}
              isExpanded={expandedIds.has(event.id)}
              onToggle={() => toggleExpand(event.id)}
            />
          ))}
        </div>
      )}
    </div>
  );
}
