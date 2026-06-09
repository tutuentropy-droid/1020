import { useEffect, useRef, useCallback, forwardRef, useImperativeHandle } from "react";
import * as echarts from "echarts";
import type { EChartsOption } from "echarts";
import { KnowledgeGraphData, GraphNode } from "@/types";
import { nodeTypeConfig, edgeTypeConfig } from "@/data/pharmaGraph";

interface KnowledgeGraphProps {
  data: KnowledgeGraphData;
  onNodeClick?: (node: GraphNode) => void;
  highlightedNodeIds?: Set<string>;
  highlightedEdgeIds?: Set<string>;
}

export interface KnowledgeGraphRef {
  exportImage: () => void;
  resize: () => void;
  getChartInstance: () => echarts.ECharts | null;
}

interface EChartNode {
  id: string;
  name: string;
  category: string;
  symbolSize: number;
  value: string;
  itemStyle: {
    color: string;
    opacity: number;
    borderColor: string;
    borderWidth: number;
    shadowBlur: number;
    shadowColor: string;
  };
  label: {
    show: boolean;
    position: "top" | "left" | "right" | "bottom" | "inside" | "insideLeft" | "insideRight" | "insideTop" | "insideBottom" | "insideTopLeft" | "insideBottomLeft" | "insideTopRight" | "insideBottomRight";
    distance: number;
    fontSize: number;
    fontWeight: "normal" | "bold" | "bolder" | "lighter" | 100 | 200 | 300 | 400 | 500 | 600 | 700 | 800 | 900;
    color: string;
    opacity: number;
  };
}

interface EChartEdge {
  id: string;
  source: string;
  target: string;
  lineStyle: {
    color: string;
    width: number;
    opacity: number;
    curveness: number;
  };
  label: {
    show: boolean;
    formatter: string;
    fontSize: number;
    color: string;
    backgroundColor: string;
    padding: number[];
    borderRadius: number;
  };
}

interface TooltipParams {
  dataType: string;
  name: string;
  data: {
    id: string;
    source?: string;
    target?: string;
  };
}

interface ClickParams {
  dataType: string;
  data: {
    id: string;
  };
}

const KnowledgeGraph = forwardRef<KnowledgeGraphRef, KnowledgeGraphProps>(
  ({ data, onNodeClick, highlightedNodeIds, highlightedEdgeIds }, ref) => {
    const chartRef = useRef<HTMLDivElement>(null);
    const chartInstance = useRef<echarts.ECharts | null>(null);

    const buildOption = useCallback((): EChartsOption => {
      const nodes: EChartNode[] = data.nodes.map((node) => {
        const config = nodeTypeConfig[node.type];
        const isHighlighted = highlightedNodeIds?.has(node.id);
        const isDimmed = highlightedNodeIds && highlightedNodeIds.size > 0 && !isHighlighted;

        return {
          id: node.id,
          name: node.name,
          category: node.type,
          symbolSize: node.type === "drug" ? 60 : node.type === "target" ? 50 : 40,
          value: node.name,
          itemStyle: {
            color: config.color,
            opacity: isDimmed ? 0.15 : isHighlighted ? 1 : 0.9,
            borderColor: isHighlighted ? "#FBBF24" : "#ffffff",
            borderWidth: isHighlighted ? 4 : 2,
            shadowBlur: isHighlighted ? 20 : 0,
            shadowColor: isHighlighted ? "#FBBF24" : "transparent",
          },
          label: {
            show: true,
            position: "bottom",
            distance: 8,
            fontSize: node.type === "drug" ? 13 : 11,
            fontWeight: (node.type === "drug" ? "bold" : "normal") as EChartNode["label"]["fontWeight"],
            color: isDimmed ? "#9CA3AF" : "#1F2937",
            opacity: isDimmed ? 0.3 : 1,
          },
        };
      });

      const edges: EChartEdge[] = data.edges.map((edge) => {
        const config = edgeTypeConfig[edge.type];
        const isHighlighted = highlightedEdgeIds?.has(edge.id);
        const isDimmed = highlightedEdgeIds && highlightedEdgeIds.size > 0 && !isHighlighted;

        return {
          id: edge.id,
          source: edge.source,
          target: edge.target,
          lineStyle: {
            color: config.color,
            width: isHighlighted ? 3.5 : edge.type === "interactsWith" ? 2.5 : 1.5,
            opacity: isDimmed ? 0.1 : isHighlighted ? 1 : 0.5,
            curveness: edge.type === "interactsWith" ? 0.2 : 0.1,
          },
          label: {
            show: isHighlighted,
            formatter: edge.label,
            fontSize: 10,
            color: "#374151",
            backgroundColor: "#ffffff",
            padding: [2, 6],
            borderRadius: 4,
          },
        };
      });

      const categories = Object.entries(nodeTypeConfig).map(([key, config]) => ({
        name: key,
        itemStyle: { color: config.color },
      }));

      return {
        backgroundColor: "#FAFBFC",
        tooltip: {
          trigger: "item",
          backgroundColor: "rgba(255, 255, 255, 0.98)",
          borderColor: "#E5E7EB",
          borderWidth: 1,
          padding: [12, 16],
          textStyle: {
            color: "#1F2937",
            fontSize: 13,
          },
          formatter: (params: unknown) => {
            const p = params as TooltipParams;
            if (p.dataType === "node") {
              const node = data.nodes.find((n) => n.id === p.data.id);
              const config = nodeTypeConfig[node?.type || "drug"];
              const typeLabel = config?.label || node?.type;
              return `<div style="font-weight: 600; font-size: 14px; margin-bottom: 6px;">${p.name}</div>
                      <div style="color: #6B7280; font-size: 12px;">类型：<span style="color: ${config?.color}; font-weight: 500;">${typeLabel}</span></div>
                      ${node?.description ? `<div style="color: #6B7280; font-size: 12px; margin-top: 4px;">${node.description}</div>` : ""}
                      ${node?.category ? `<div style="color: #6B7280; font-size: 12px; margin-top: 4px;">分类：${node.category}</div>` : ""}`;
            } else if (p.dataType === "edge") {
              const edge = data.edges.find((e) => e.id === p.data.id);
              const sourceNode = data.nodes.find((n) => n.id === p.data.source);
              const targetNode = data.nodes.find((n) => n.id === p.data.target);
              return `<div style="font-weight: 600; font-size: 14px; margin-bottom: 6px;">${edge?.label || "关系"}</div>
                      <div style="color: #6B7280; font-size: 12px;">${sourceNode?.name} → ${targetNode?.name}</div>`;
            }
            return "";
          },
        },
        legend: [
          {
            data: categories.map((c) => c.name),
            orient: "vertical",
            left: 16,
            top: 16,
            itemGap: 12,
            textStyle: {
              fontSize: 12,
              color: "#4B5563",
            },
            formatter: (name: string) => nodeTypeConfig[name]?.label || name,
          },
        ],
        series: [
          {
            type: "graph",
            layout: "force",
            roam: true,
            draggable: true,
            focusNodeAdjacency: true,
            data: nodes,
            links: edges,
            categories: categories,
            force: {
              repulsion: 800,
              edgeLength: [120, 200],
              gravity: 0.12,
              layoutAnimation: true,
            },
            emphasis: {
              focus: "adjacency",
              lineStyle: {
                width: 4,
              },
              label: {
                fontSize: 14,
                fontWeight: "bold",
              },
            },
            select: {
              itemStyle: {
                borderColor: "#FBBF24",
                borderWidth: 4,
              },
            },
            animationDuration: 1500,
            animationEasingUpdate: "quinticInOut",
          },
        ],
      };
    }, [data, highlightedNodeIds, highlightedEdgeIds]);

    useEffect(() => {
      if (!chartRef.current) return;

      chartInstance.current = echarts.init(chartRef.current);
      chartInstance.current.setOption(buildOption());

      chartInstance.current.on("click", (params: unknown) => {
        const p = params as ClickParams;
        if (p.dataType === "node" && onNodeClick) {
          const node = data.nodes.find((n) => n.id === p.data.id);
          if (node) {
            onNodeClick(node);
          }
        }
      });

      const handleResize = () => {
        chartInstance.current?.resize();
      };
      window.addEventListener("resize", handleResize);

      return () => {
        window.removeEventListener("resize", handleResize);
        chartInstance.current?.dispose();
        chartInstance.current = null;
      };
    }, [data, buildOption, onNodeClick]);

    useEffect(() => {
      if (chartInstance.current) {
        chartInstance.current.setOption(buildOption());
      }
    }, [buildOption]);

    useImperativeHandle(ref, () => ({
      exportImage: () => {
        if (!chartInstance.current) return;
        const url = chartInstance.current.getDataURL({
          type: "png",
          pixelRatio: 2,
          backgroundColor: "#FAFBFC",
        });
        const link = document.createElement("a");
        link.download = `药理知识图谱_${new Date().toLocaleDateString()}.png`;
        link.href = url;
        link.click();
      },
      resize: () => {
        chartInstance.current?.resize();
      },
      getChartInstance: () => chartInstance.current,
    }));

    return (
      <div
        ref={chartRef}
        className="w-full h-full min-h-[600px] rounded-2xl border border-gray-100 bg-white shadow-inner"
      />
    );
  }
);

KnowledgeGraph.displayName = "KnowledgeGraph";

export default KnowledgeGraph;
