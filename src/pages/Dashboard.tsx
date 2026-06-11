import { useEffect, useRef, useMemo } from "react";
import * as echarts from "echarts";
import {
  BarChart3,
  Clock,
  Flame,
  Target,
  TrendingUp,
  AlertTriangle,
  BookOpen,
  Calendar,
  Zap,
} from "lucide-react";
import { useStore } from "@/store/useStore";
import { cn } from "@/lib/utils";
import { useNavigate } from "react-router-dom";

export default function Dashboard() {
  const navigate = useNavigate();
  const { getDashboardAnalytics, currentUserName } = useStore();
  const analytics = useMemo(() => getDashboardAnalytics(), [getDashboardAnalytics]);

  const heatmapRef = useRef<HTMLDivElement>(null);
  const trendRef = useRef<HTMLDivElement>(null);
  const errorPieRef = useRef<HTMLDivElement>(null);
  const categoryBarRef = useRef<HTMLDivElement>(null);

  const formatMinutes = (minutes: number) => {
    if (minutes < 60) return `${minutes}分钟`;
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return mins > 0 ? `${hours}小时${mins}分` : `${hours}小时`;
  };

  const formatDateLabel = (dateStr: string) => {
    const d = new Date(dateStr);
    return `${d.getMonth() + 1}/${d.getDate()}`;
  };

  useEffect(() => {
    if (!heatmapRef.current) return;
    const chart = echarts.init(heatmapRef.current);

    const hours = ["0", "2", "4", "6", "8", "10", "12", "14", "16", "18", "20", "22"];
    const days = analytics.dailyStudyRecords.slice(-14).map((d) => formatDateLabel(d.date));

    const data: number[][] = [];
    analytics.dailyStudyRecords.slice(-14).forEach((d, dayIdx) => {
      for (let h = 0; h < 24; h += 2) {
        const intensity =
          d.totalMinutes > 0
            ? Math.min(10, Math.ceil(d.totalMinutes / 15))
            : 0;
        data.push([Math.floor(h / 2), dayIdx, intensity + (dayIdx % 3) * 0.3]);
      }
    });

    const option: echarts.EChartsOption = {
      tooltip: {
        position: "top",
        formatter: (params) => {
          const p = params as { value: number[] };
          const dayIdx = p.value[1];
          const record = analytics.dailyStudyRecords.slice(-14)[dayIdx];
          if (record) {
            return `${record.date}<br/>学习时长: ${formatMinutes(record.totalMinutes)}`;
          }
          return "";
        },
      },
      grid: {
        left: "12%",
        right: "5%",
        top: "5%",
        bottom: "15%",
      },
      xAxis: {
        type: "category",
        data: days,
        splitArea: { show: true },
        axisLabel: {
          fontSize: 11,
          color: "#6b7280",
        },
        axisLine: { show: false },
        axisTick: { show: false },
      },
      yAxis: {
        type: "category",
        data: hours,
        splitArea: { show: true },
        axisLabel: {
          fontSize: 11,
          color: "#6b7280",
        },
        axisLine: { show: false },
        axisTick: { show: false },
      },
      visualMap: {
        min: 0,
        max: 10,
        calculable: false,
        orient: "horizontal",
        left: "center",
        bottom: "0%",
        show: false,
        inRange: {
          color: ["#f3f4f6", "#dbeafe", "#93c5fd", "#3b82f6", "#1d4ed8"],
        },
      },
      series: [
        {
          name: "学习热力图",
          type: "heatmap",
          data: data,
          label: { show: false },
          emphasis: {
            itemStyle: {
              shadowBlur: 10,
              shadowColor: "rgba(0, 0, 0, 0.4)",
            },
          },
          itemStyle: {
            borderRadius: 4,
            borderWidth: 2,
            borderColor: "#fff",
          },
        },
      ],
    };

    chart.setOption(option);
    const handleResize = () => chart.resize();
    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
      chart.dispose();
    };
  }, [analytics.dailyStudyRecords]);

  useEffect(() => {
    if (!trendRef.current) return;
    const chart = echarts.init(trendRef.current);

    const records = analytics.dailyStudyRecords.slice(-30);

    const option: echarts.EChartsOption = {
      tooltip: {
        trigger: "axis",
        formatter: (params) => {
          const p = (params as { axisValue: string; value: number }[])[0];
          return `${p.axisValue}<br/>学习时长: ${formatMinutes(p.value)}`;
        },
      },
      grid: {
        left: "3%",
        right: "4%",
        top: "10%",
        bottom: "10%",
        containLabel: true,
      },
      xAxis: {
        type: "category",
        boundaryGap: false,
        data: records.map((r) => formatDateLabel(r.date)),
        axisLabel: {
          fontSize: 11,
          color: "#6b7280",
          interval: 3,
        },
        axisLine: {
          lineStyle: { color: "#e5e7eb" },
        },
        axisTick: { show: false },
      },
      yAxis: {
        type: "value",
        name: "分钟",
        nameTextStyle: {
          fontSize: 11,
          color: "#6b7280",
        },
        axisLabel: {
          fontSize: 11,
          color: "#6b7280",
        },
        axisLine: { show: false },
        axisTick: { show: false },
        splitLine: {
          lineStyle: { color: "#f3f4f6", type: "dashed" },
        },
      },
      series: [
        {
          name: "学习时长",
          type: "line",
          smooth: true,
          symbol: "circle",
          symbolSize: 6,
          data: records.map((r) => r.totalMinutes),
          lineStyle: {
            width: 3,
            color: new echarts.graphic.LinearGradient(0, 0, 1, 0, [
              { offset: 0, color: "#6366f1" },
              { offset: 1, color: "#8b5cf6" },
            ]),
          },
          itemStyle: {
            color: "#6366f1",
            borderColor: "#fff",
            borderWidth: 2,
          },
          areaStyle: {
            color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
              { offset: 0, color: "rgba(99, 102, 241, 0.3)" },
              { offset: 1, color: "rgba(99, 102, 241, 0.02)" },
            ]),
          },
        },
      ],
    };

    chart.setOption(option);
    const handleResize = () => chart.resize();
    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
      chart.dispose();
    };
  }, [analytics.dailyStudyRecords]);

  useEffect(() => {
    if (!errorPieRef.current) return;
    const chart = echarts.init(errorPieRef.current);

    const data = analytics.errorTypeDistribution
      .filter((e) => e.count > 0)
      .map((e) => ({
        name: e.categoryLabel,
        value: e.count,
      }));

    const colors = [
      "#ef4444",
      "#f97316",
      "#f59e0b",
      "#eab308",
      "#84cc16",
      "#22c55e",
      "#10b981",
      "#14b8a6",
      "#06b6d4",
      "#0ea5e9",
    ];

    const option: echarts.EChartsOption = {
      tooltip: {
        trigger: "item",
        formatter: "{b}: {c}次 ({d}%)",
      },
      legend: {
        orient: "vertical",
        right: "5%",
        top: "center",
        itemWidth: 12,
        itemHeight: 12,
        textStyle: {
          fontSize: 12,
          color: "#4b5563",
        },
      },
      color: colors,
      series: [
        {
          name: "错误类型",
          type: "pie",
          radius: ["45%", "70%"],
          center: ["35%", "50%"],
          avoidLabelOverlap: false,
          itemStyle: {
            borderRadius: 8,
            borderColor: "#fff",
            borderWidth: 2,
          },
          label: { show: false },
          emphasis: {
            label: {
              show: true,
              fontSize: 14,
              fontWeight: "bold",
            },
            itemStyle: {
              shadowBlur: 10,
              shadowOffsetX: 0,
              shadowColor: "rgba(0, 0, 0, 0.2)",
            },
          },
          labelLine: { show: false },
          data: data.length > 0 ? data : [{ name: "暂无数据", value: 1 }],
        },
      ],
    };

    chart.setOption(option);
    const handleResize = () => chart.resize();
    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
      chart.dispose();
    };
  }, [analytics.errorTypeDistribution]);

  useEffect(() => {
    if (!categoryBarRef.current) return;
    const chart = echarts.init(categoryBarRef.current);

    const masteryData = analytics.chapterMasteryList;

    const option: echarts.EChartsOption = {
      tooltip: {
        trigger: "axis",
        axisPointer: { type: "shadow" },
        formatter: (params) => {
          const p = (params as { name: string; value: number }[])[0];
          return `${p.name}<br/>掌握度: ${p.value}%`;
        },
      },
      grid: {
        left: "3%",
        right: "6%",
        top: "5%",
        bottom: "8%",
        containLabel: true,
      },
      xAxis: {
        type: "category",
        data: masteryData.map((m) => m.chapterTitle),
        axisLabel: {
          fontSize: 11,
          color: "#4b5563",
          rotate: 15,
        },
        axisLine: {
          lineStyle: { color: "#e5e7eb" },
        },
        axisTick: { show: false },
      },
      yAxis: {
        type: "value",
        max: 100,
        name: "掌握度 %",
        nameTextStyle: {
          fontSize: 11,
          color: "#6b7280",
        },
        axisLabel: {
          fontSize: 11,
          color: "#6b7280",
          formatter: "{value}%",
        },
        axisLine: { show: false },
        axisTick: { show: false },
        splitLine: {
          lineStyle: { color: "#f3f4f6", type: "dashed" },
        },
      },
      series: [
        {
          name: "掌握度",
          type: "bar",
          barWidth: "50%",
          data: masteryData.map((m) => ({
            value: m.masteryRate,
            itemStyle: {
              color:
                m.masteryRate >= 80
                  ? "#22c55e"
                  : m.masteryRate >= 60
                  ? "#f59e0b"
                  : "#ef4444",
              borderRadius: [6, 6, 0, 0],
            },
          })),
          markLine: {
            silent: true,
            lineStyle: {
              color: "#6366f1",
              type: "dashed",
            },
            data: [{ yAxis: 60, label: { formatter: "及格线 60%", fontSize: 10 } }],
          },
        },
      ],
    };

    chart.setOption(option);
    const handleResize = () => chart.resize();
    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
      chart.dispose();
    };
  }, [analytics.chapterMasteryList]);

  const priorityConfig = {
    high: { label: "高优先级", color: "bg-rose-100 text-rose-700", icon: AlertTriangle },
    medium: { label: "中优先级", color: "bg-amber-100 text-amber-700", icon: Zap },
    low: { label: "低优先级", color: "bg-blue-100 text-blue-700", icon: Target },
  };

  const summaryStats = [
    {
      label: "累计学习",
      value: formatMinutes(analytics.totalStudyMinutes),
      subLabel: `共 ${analytics.totalStudyDays} 天`,
      icon: Clock,
      color: "from-indigo-500 to-purple-500",
      bgColor: "bg-indigo-50",
      iconColor: "text-indigo-600",
    },
    {
      label: "日均学习",
      value: `${analytics.avgDailyMinutes}分钟`,
      subLabel: "有学习记录的日子",
      icon: BarChart3,
      color: "from-emerald-500 to-teal-500",
      bgColor: "bg-emerald-50",
      iconColor: "text-emerald-600",
    },
    {
      label: "连续学习",
      value: `${analytics.streakDays}天`,
      subLabel: "学习保持连续",
      icon: Flame,
      color: "from-orange-500 to-rose-500",
      bgColor: "bg-orange-50",
      iconColor: "text-orange-600",
    },
    {
      label: "整体掌握度",
      value: `${analytics.overallMasteryRate}%`,
      subLabel: "各章节平均掌握",
      icon: TrendingUp,
      color: "from-blue-500 to-cyan-500",
      bgColor: "bg-blue-50",
      iconColor: "text-blue-600",
    },
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg">
            <BarChart3 className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-900 font-serif">学习数据看板</h1>
            <p className="text-sm text-gray-500 mt-1">
              你好，{currentUserName}！深入了解你的学习情况
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2 text-sm text-gray-500">
          <Calendar className="w-4 h-4" />
          <span>数据更新于 {new Date().toLocaleDateString("zh-CN")}</span>
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {summaryStats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div
              key={stat.label}
              className="bg-white rounded-2xl border border-gray-100 p-5 hover:shadow-md transition-all animate-slide-up"
              style={{ animationDelay: `${index * 80}ms` }}
            >
              <div className="flex items-start justify-between mb-3">
                <div
                  className={cn(
                    "w-10 h-10 rounded-xl flex items-center justify-center",
                    stat.bgColor
                  )}
                >
                  <Icon className={cn("w-5 h-5", stat.iconColor)} />
                </div>
              </div>
              <div className="text-2xl font-bold text-gray-900">{stat.value}</div>
              <div className="flex items-center justify-between mt-1">
                <span className="text-sm text-gray-500">{stat.label}</span>
                <span className="text-xs text-gray-400">{stat.subLabel}</span>
              </div>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="lg:col-span-2 bg-white rounded-2xl border border-gray-100 p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-indigo-50 flex items-center justify-center">
                <Calendar className="w-5 h-5 text-indigo-600" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-gray-900">学习活跃度热力图</h2>
                <p className="text-sm text-gray-500">最近14天学习活跃情况</p>
              </div>
            </div>
          </div>
          <div ref={heatmapRef} style={{ height: 220 }} />
        </div>

        <div className="bg-white rounded-2xl border border-gray-100 p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center">
              <TrendingUp className="w-5 h-5 text-emerald-600" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-gray-900">每日学习时长趋势</h2>
              <p className="text-sm text-gray-500">最近30天学习时长（分钟）</p>
            </div>
          </div>
          <div ref={trendRef} style={{ height: 280 }} />
        </div>

        <div className="bg-white rounded-2xl border border-gray-100 p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-rose-50 flex items-center justify-center">
              <AlertTriangle className="w-5 h-5 text-rose-600" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-gray-900">错误类型分布</h2>
              <p className="text-sm text-gray-500">各类型错题占比分析</p>
            </div>
          </div>
          <div ref={errorPieRef} style={{ height: 280 }} />
        </div>

        <div className="lg:col-span-2 bg-white rounded-2xl border border-gray-100 p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center">
              <BookOpen className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-gray-900">各章节掌握度</h2>
              <p className="text-sm text-gray-500">基于测验和错题记录计算的掌握程度</p>
            </div>
          </div>
          <div ref={categoryBarRef} style={{ height: 300 }} />
        </div>

        <div className="lg:col-span-2 bg-white rounded-2xl border border-gray-100 p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-amber-50 flex items-center justify-center">
                <Target className="w-5 h-5 text-amber-600" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-gray-900">薄弱点识别</h2>
                <p className="text-sm text-gray-500">根据正确率自动识别的需要加强的知识点</p>
              </div>
            </div>
            {analytics.weakPoints.length > 0 && (
              <button
                onClick={() => navigate("/quiz")}
                className="px-4 py-2 bg-primary-500 hover:bg-primary-600 text-white text-sm font-medium rounded-xl transition-colors"
              >
                去针对性练习
              </button>
            )}
          </div>

          {analytics.weakPoints.length === 0 ? (
            <div className="text-center py-12">
              <div className="w-16 h-16 rounded-full bg-emerald-50 flex items-center justify-center mx-auto mb-4">
                <TrendingUp className="w-8 h-8 text-emerald-500" />
              </div>
              <p className="text-gray-700 font-medium">太棒了！暂未发现明显薄弱点</p>
              <p className="text-sm text-gray-400 mt-1">继续保持，你的学习状态很好</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {analytics.weakPoints.map((wp, index) => {
                const config = priorityConfig[wp.priority];
                const PriorityIcon = config.icon;
                return (
                  <div
                    key={wp.id}
                    className="p-5 rounded-xl border border-gray-100 bg-gradient-to-br from-white to-gray-50 hover:shadow-md transition-all animate-slide-up"
                    style={{ animationDelay: `${index * 80}ms` }}
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <div
                          className={cn(
                            "w-8 h-8 rounded-lg flex items-center justify-center",
                            wp.priority === "high"
                              ? "bg-rose-100"
                              : wp.priority === "medium"
                              ? "bg-amber-100"
                              : "bg-blue-100"
                          )}
                        >
                          <PriorityIcon
                            className={cn(
                              "w-4 h-4",
                              wp.priority === "high"
                                ? "text-rose-600"
                                : wp.priority === "medium"
                                ? "text-amber-600"
                                : "text-blue-600"
                            )}
                          />
                        </div>
                        <div>
                          <h3 className="font-semibold text-gray-900">{wp.name}</h3>
                          <span
                            className={cn(
                              "inline-block text-xs font-medium px-2 py-0.5 rounded-full mt-0.5",
                              config.color
                            )}
                          >
                            {config.label}
                          </span>
                        </div>
                      </div>
                      <div className="text-right">
                        <div
                          className={cn(
                            "text-xl font-bold",
                            wp.accuracy < 40
                              ? "text-rose-600"
                              : wp.accuracy < 60
                              ? "text-amber-600"
                              : "text-blue-600"
                          )}
                        >
                          {wp.accuracy}%
                        </div>
                        <div className="text-xs text-gray-400">正确率</div>
                      </div>
                    </div>
                    <p className="text-sm text-gray-600 mb-3">{wp.description}</p>
                    <div className="flex items-center justify-between text-xs text-gray-400">
                      <span>错误 {wp.errorCount} 次</span>
                      <span>共尝试 {wp.totalAttempts} 次</span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
