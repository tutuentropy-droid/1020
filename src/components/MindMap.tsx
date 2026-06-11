import { useEffect, useRef, useCallback, forwardRef, useImperativeHandle, useState } from "react";
import * as echarts from "echarts";
import type { EChartsOption } from "echarts";
import { MindMapData, MindMapNode, MindMapNodeType } from "@/types";
import { mindMapNodeTypeConfig, flattenMindMapNodes } from "@/utils/mindMapGenerator";
import { Edit3, Plus, Trash2, StickyNote, X, Check } from "lucide-react";

interface MindMapProps {
  data: MindMapData;
  onDataChange?: (data: MindMapData) => void;
}

export interface MindMapRef {
  exportImage: (format: "png" | "pdf") => void;
  resize: () => void;
  getChartInstance: () => echarts.ECharts | null;
}

interface EChartTreeNode {
  id: string;
  name: string;
  value: string;
  type: MindMapNodeType;
  description?: string;
  note?: string;
  itemStyle: {
    color: string;
    borderColor: string;
    borderWidth: number;
  };
  label: {
    backgroundColor: string;
    color: string;
    fontSize: number;
    fontWeight: "normal" | "bold" | "bolder" | "lighter" | 100 | 200 | 300 | 400 | 500 | 600 | 700 | 800 | 900;
    padding: number[];
    borderRadius: number;
    width?: number;
    overflow?: "none" | "truncate" | "break" | "breakAll";
  };
  children?: EChartTreeNode[];
}

const nodeToEChartTree = (node: MindMapNode, depth: number = 0): EChartTreeNode => {
  const config = mindMapNodeTypeConfig[node.type];
  const isRoot = node.type === "root";
  const fontSize = isRoot ? 16 : depth === 1 ? 14 : 12;
  const fontWeight = (isRoot ? "bold" : depth === 1 ? 600 : "normal") as EChartTreeNode["label"]["fontWeight"];

  let displayName = node.name;
  if (displayName.length > 15) {
    displayName = displayName.substring(0, 15) + "...";
  }

  const echartNode: EChartTreeNode = {
    id: node.id,
    name: displayName,
    value: node.name,
    type: node.type,
    description: node.description,
    note: node.note,
    itemStyle: {
      color: config.color,
      borderColor: "#ffffff",
      borderWidth: 2,
    },
    label: {
      backgroundColor: config.color,
      color: "#ffffff",
      fontSize,
      fontWeight,
      padding: [8, 12],
      borderRadius: 8,
      width: 150,
      overflow: "truncate",
    },
  };

  if (node.children && node.children.length > 0) {
    echartNode.children = node.children.map((child) => nodeToEChartTree(child, depth + 1));
  }

  return echartNode;
};

const updateNodeInTree = (
  root: MindMapNode,
  nodeId: string,
  updates: Partial<MindMapNode>
): MindMapNode => {
  if (root.id === nodeId) {
    return { ...root, ...updates };
  }
  if (root.children) {
    return {
      ...root,
      children: root.children.map((child) => updateNodeInTree(child, nodeId, updates)),
    };
  }
  return root;
};

const addChildToNode = (
  root: MindMapNode,
  parentId: string,
  newNode: MindMapNode
): MindMapNode => {
  if (root.id === parentId) {
    return {
      ...root,
      children: [...(root.children || []), newNode],
    };
  }
  if (root.children) {
    return {
      ...root,
      children: root.children.map((child) => addChildToNode(child, parentId, newNode)),
    };
  }
  return root;
};

const deleteNodeFromTree = (root: MindMapNode, nodeId: string): MindMapNode => {
  if (root.children) {
    return {
      ...root,
      children: root.children
        .filter((child) => child.id !== nodeId)
        .map((child) => deleteNodeFromTree(child, nodeId)),
    };
  }
  return root;
};

const MindMap = forwardRef<MindMapRef, MindMapProps>(({ data, onDataChange }, ref) => {
  const chartRef = useRef<HTMLDivElement>(null);
  const chartInstance = useRef<echarts.ECharts | null>(null);
  const [selectedNode, setSelectedNode] = useState<MindMapNode | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState("");
  const [editNote, setEditNote] = useState("");
  const [mindMapData, setMindMapData] = useState<MindMapData>(data);

  useEffect(() => {
    setMindMapData(data);
  }, [data]);

  const findNodeById = (root: MindMapNode, nodeId: string): MindMapNode | null => {
    if (root.id === nodeId) return root;
    if (root.children) {
      for (const child of root.children) {
        const found = findNodeById(child, nodeId);
        if (found) return found;
      }
    }
    return null;
  };

  const handleNodeClick = useCallback(
    (nodeId: string) => {
      const node = findNodeById(mindMapData.rootNode, nodeId);
      if (node) {
        setSelectedNode(node);
        setEditName(node.name);
        setEditNote(node.note || "");
        setIsEditing(false);
      }
    },
    [mindMapData]
  );

  const handleUpdateNode = useCallback(() => {
    if (!selectedNode) return;
    const updatedRoot = updateNodeInTree(mindMapData.rootNode, selectedNode.id, {
      name: editName,
      note: editNote,
    });
    const updatedData: MindMapData = {
      ...mindMapData,
      rootNode: updatedRoot,
      updatedAt: new Date().toISOString(),
    };
    setMindMapData(updatedData);
    onDataChange?.(updatedData);
    const updatedNode = findNodeById(updatedRoot, selectedNode.id);
    setSelectedNode(updatedNode);
    setIsEditing(false);
  }, [selectedNode, editName, editNote, mindMapData, onDataChange]);

  const handleAddChild = useCallback(() => {
    if (!selectedNode) return;
    const newNode: MindMapNode = {
      id: `node_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      name: "新节点",
      type: "note",
      parentId: selectedNode.id,
      children: [],
    };
    const updatedRoot = addChildToNode(mindMapData.rootNode, selectedNode.id, newNode);
    const updatedData: MindMapData = {
      ...mindMapData,
      rootNode: updatedRoot,
      updatedAt: new Date().toISOString(),
    };
    setMindMapData(updatedData);
    onDataChange?.(updatedData);
    setSelectedNode(newNode);
    setEditName(newNode.name);
    setEditNote("");
    setIsEditing(true);
  }, [selectedNode, mindMapData, onDataChange]);

  const handleDeleteNode = useCallback(() => {
    if (!selectedNode || selectedNode.type === "root") return;
    const updatedRoot = deleteNodeFromTree(mindMapData.rootNode, selectedNode.id);
    const updatedData: MindMapData = {
      ...mindMapData,
      rootNode: updatedRoot,
      updatedAt: new Date().toISOString(),
    };
    setMindMapData(updatedData);
    onDataChange?.(updatedData);
    setSelectedNode(null);
    setIsEditing(false);
  }, [selectedNode, mindMapData, onDataChange]);

  const buildOption = useCallback((): EChartsOption => {
    const treeData = nodeToEChartTree(mindMapData.rootNode);

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
          const p = params as {
            dataType: string;
            name: string;
            data: EChartTreeNode;
          };
          if (p.dataType === "treeNode") {
            const config = mindMapNodeTypeConfig[p.data.type];
            const fullName = p.data.value;
            return `<div style="font-weight: 600; font-size: 14px; margin-bottom: 6px;">${fullName}</div>
                    <div style="color: #6B7280; font-size: 12px;">类型：<span style="color: ${config.color}; font-weight: 500;">${config.label}</span></div>
                    ${p.data.description ? `<div style="color: #6B7280; font-size: 12px; margin-top: 4px; max-width: 300px;">${p.data.description}</div>` : ""}
                    ${p.data.note ? `<div style="color: #6366F1; font-size: 12px; margin-top: 4px; border-top: 1px solid #E5E7EB; padding-top: 4px;">📝 ${p.data.note}</div>` : ""}`;
          }
          return "";
        },
      },
      series: [
        {
          type: "tree",
          id: 0,
          name: "mindmap",
          data: [treeData],
          top: "5%",
          left: "15%",
          bottom: "5%",
          right: "15%",
          symbolSize: 12,
          symbol: "circle",
          orient: "LR",
          expandAndCollapse: true,
          initialTreeDepth: 2,
          animationDuration: 550,
          animationDurationUpdate: 750,
          roam: true,
          emphasis: {
            focus: "descendant",
          },
          lineStyle: {
            color: "#CBD5E1",
            width: 2,
            curveness: 0.5,
          },
          label: {
            position: "left",
            verticalAlign: "middle",
            align: "right",
            fontFamily: "system-ui, -apple-system, sans-serif",
          },
          leaves: {
            label: {
              position: "right",
              verticalAlign: "middle",
              align: "left",
            },
          },
        },
      ],
    };
  }, [mindMapData]);

  useEffect(() => {
    if (!chartRef.current) return;

    chartInstance.current = echarts.init(chartRef.current);
    chartInstance.current.setOption(buildOption());

    chartInstance.current.on("click", (params: unknown) => {
      const p = params as {
        dataType: string;
        data: { id: string };
      };
      if (p.dataType === "treeNode") {
        handleNodeClick(p.data.id);
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
  }, []);

  useEffect(() => {
    if (chartInstance.current) {
      chartInstance.current.setOption(buildOption());
    }
  }, [buildOption]);

  useImperativeHandle(ref, () => ({
    exportImage: (format: "png" | "pdf") => {
      if (!chartInstance.current) return;
      const url = chartInstance.current.getDataURL({
        type: "png",
        pixelRatio: 2,
        backgroundColor: "#FAFBFC",
        excludeComponents: ["toolbox"],
      });

      if (format === "pdf") {
        const printWindow = window.open("", "_blank");
        if (printWindow) {
          printWindow.document.write(`
            <!DOCTYPE html>
            <html>
            <head>
              <title>${mindMapData.title}</title>
              <style>
                body { margin: 0; display: flex; flex-direction: column; align-items: center; justify-content: center; min-height: 100vh; background: #FAFBFC; }
                .header { text-align: center; margin-bottom: 20px; }
                .header h1 { font-family: system-ui, sans-serif; color: #1F2937; margin: 0; }
                .header p { font-family: system-ui, sans-serif; color: #6B7280; margin: 8px 0 0; }
                img { max-width: 100%; height: auto; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1); border-radius: 8px; }
                @media print { @page { size: landscape; margin: 20mm; } }
              </style>
            </head>
            <body>
              <div class="header">
                <h1>${mindMapData.title}</h1>
                <p>生成时间：${new Date().toLocaleString()}</p>
              </div>
              <img src="${url}" alt="${mindMapData.title}" />
            </body>
            </html>
          `);
          printWindow.document.close();
          printWindow.onload = () => {
            printWindow.print();
          };
        }
      } else {
        const link = document.createElement("a");
        link.download = `${mindMapData.title}_${new Date().toLocaleDateString()}.png`;
        link.href = url;
        link.click();
      }
    },
    resize: () => {
      chartInstance.current?.resize();
    },
    getChartInstance: () => chartInstance.current,
  }));

  const allNodes = flattenMindMapNodes(mindMapData.rootNode);
  const stats = {
    totalNodes: allNodes.length,
    categories: new Set(allNodes.map((n) => n.type)).size,
    hasNotes: allNodes.filter((n) => n.note).length,
  };

  return (
    <div className="flex h-full min-h-[700px] gap-4">
      <div className="flex-1 relative">
        <div ref={chartRef} className="w-full h-full min-h-[700px] rounded-2xl border border-gray-100 bg-white shadow-inner" />
        <div className="absolute bottom-4 left-4 flex gap-2">
          <div className="bg-white/90 backdrop-blur-sm rounded-xl px-4 py-2 text-sm text-gray-600 shadow-sm border border-gray-100">
            节点数: {stats.totalNodes} | 分类: {stats.categories} | 笔记: {stats.hasNotes}
          </div>
        </div>
      </div>

      <div className="w-80 bg-white rounded-2xl border border-gray-100 shadow-sm p-4 flex flex-col">
        <h3 className="font-bold text-gray-900 mb-4">节点编辑</h3>

        {selectedNode ? (
          <div className="flex-1 flex flex-col gap-4">
            <div className="flex items-center gap-2 p-3 rounded-xl bg-gray-50">
              <div
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: mindMapNodeTypeConfig[selectedNode.type].color }}
              />
              <span className="text-sm font-medium text-gray-700">
                {mindMapNodeTypeConfig[selectedNode.type].label}
              </span>
              {selectedNode.note && (
                <StickyNote className="w-4 h-4 text-indigo-500 ml-auto" />
              )}
            </div>

            {isEditing ? (
              <>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">节点名称</label>
                  <input
                    type="text"
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent text-sm"
                    autoFocus
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">个人笔记</label>
                  <textarea
                    value={editNote}
                    onChange={(e) => setEditNote(e.target.value)}
                    rows={4}
                    placeholder="添加你的学习笔记..."
                    className="w-full px-3 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent text-sm resize-none"
                  />
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={handleUpdateNode}
                    className="flex-1 flex items-center justify-center gap-1 py-2 px-3 bg-primary-600 text-white rounded-xl text-sm font-medium hover:bg-primary-700 transition-colors"
                  >
                    <Check className="w-4 h-4" />
                    保存
                  </button>
                  <button
                    onClick={() => {
                      setIsEditing(false);
                      if (selectedNode) {
                        setEditName(selectedNode.name);
                        setEditNote(selectedNode.note || "");
                      }
                    }}
                    className="flex items-center justify-center gap-1 py-2 px-3 bg-gray-100 text-gray-700 rounded-xl text-sm font-medium hover:bg-gray-200 transition-colors"
                  >
                    <X className="w-4 h-4" />
                    取消
                  </button>
                </div>
              </>
            ) : (
              <>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">节点名称</label>
                  <div className="p-3 bg-gray-50 rounded-xl text-sm text-gray-900">{selectedNode.name}</div>
                </div>
                {selectedNode.description && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">说明</label>
                    <div className="p-3 bg-gray-50 rounded-xl text-sm text-gray-600">{selectedNode.description}</div>
                  </div>
                )}
                {selectedNode.note && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">个人笔记</label>
                    <div className="p-3 bg-indigo-50 rounded-xl text-sm text-indigo-800">{selectedNode.note}</div>
                  </div>
                )}
                <div className="flex gap-2">
                  <button
                    onClick={() => setIsEditing(true)}
                    className="flex-1 flex items-center justify-center gap-1 py-2 px-3 bg-primary-50 text-primary-700 rounded-xl text-sm font-medium hover:bg-primary-100 transition-colors"
                  >
                    <Edit3 className="w-4 h-4" />
                    编辑
                  </button>
                  <button
                    onClick={handleAddChild}
                    className="flex-1 flex items-center justify-center gap-1 py-2 px-3 bg-emerald-50 text-emerald-700 rounded-xl text-sm font-medium hover:bg-emerald-100 transition-colors"
                  >
                    <Plus className="w-4 h-4" />
                    添加子节点
                  </button>
                </div>
                {selectedNode.type !== "root" && (
                  <button
                    onClick={handleDeleteNode}
                    className="flex items-center justify-center gap-1 py-2 px-3 bg-rose-50 text-rose-700 rounded-xl text-sm font-medium hover:bg-rose-100 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                    删除节点
                  </button>
                )}
              </>
            )}
          </div>
        ) : (
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center text-gray-400">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <Edit3 className="w-8 h-8 text-gray-300" />
              </div>
              <p className="text-sm">点击思维导图中的节点进行编辑</p>
            </div>
          </div>
        )}

        <div className="mt-4 pt-4 border-t border-gray-100">
          <h4 className="text-sm font-medium text-gray-700 mb-2">图例</h4>
          <div className="grid grid-cols-2 gap-2">
            {(Object.entries(mindMapNodeTypeConfig) as [MindMapNodeType, { color: string; label: string }][]).map(([type, config]) => (
              <div key={type} className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: config.color }} />
                <span className="text-xs text-gray-600">{config.label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
});

MindMap.displayName = "MindMap";

export default MindMap;
