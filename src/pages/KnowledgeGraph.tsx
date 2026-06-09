import { useState, useMemo, useRef } from "react";
import { Search, Download, X, Network, Info, Pill, Target, Activity, AlertTriangle, FlaskConical, RefreshCw } from "lucide-react";
import KnowledgeGraph, { KnowledgeGraphRef } from "@/components/KnowledgeGraph";
import { pharmaGraphData, nodeTypeConfig, edgeTypeConfig } from "@/data/pharmaGraph";
import { GraphNode, GraphEdge } from "@/types";
import { findRelatedNodesAndEdges } from "@/utils/helpers";

export default function KnowledgeGraphPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedNode, setSelectedNode] = useState<GraphNode | null>(null);
  const [highlightedNodeIds, setHighlightedNodeIds] = useState<Set<string>>(new Set());
  const [highlightedEdgeIds, setHighlightedEdgeIds] = useState<Set<string>>(new Set());
  const [showSuggestions, setShowSuggestions] = useState(false);
  const chartRef = useRef<KnowledgeGraphRef>(null);

  const suggestions = useMemo(() => {
    if (!searchQuery.trim()) return [];
    const query = searchQuery.toLowerCase();
    return pharmaGraphData.nodes
      .filter((node) => node.name.toLowerCase().includes(query))
      .slice(0, 10);
  }, [searchQuery]);

  const handleSearch = (node: GraphNode) => {
    setSearchQuery(node.name);
    setShowSuggestions(false);
    setSelectedNode(node);
    const { nodes, edges } = findRelatedNodesAndEdges(node.id, pharmaGraphData, 2);
    setHighlightedNodeIds(nodes);
    setHighlightedEdgeIds(edges);
  };

  const handleNodeClick = (node: GraphNode) => {
    setSelectedNode(node);
    const { nodes, edges } = findRelatedNodesAndEdges(node.id, pharmaGraphData, 2);
    setHighlightedNodeIds(nodes);
    setHighlightedEdgeIds(edges);
  };

  const clearHighlight = () => {
    setSearchQuery("");
    setSelectedNode(null);
    setHighlightedNodeIds(new Set());
    setHighlightedEdgeIds(new Set());
  };

  const handleExport = () => {
    chartRef.current?.exportImage();
  };

  const handleReset = () => {
    clearHighlight();
  };

  const relatedNodes = useMemo(() => {
    if (!selectedNode) return { targets: [], diseases: [], sideEffects: [], enzymes: [], interactions: [] };
    const targets: { node: GraphNode; edge: GraphEdge }[] = [];
    const diseases: { node: GraphNode; edge: GraphEdge }[] = [];
    const sideEffects: { node: GraphNode; edge: GraphEdge }[] = [];
    const enzymes: { node: GraphNode; edge: GraphEdge }[] = [];
    const interactions: { node: GraphNode; edge: GraphEdge }[] = [];

    for (const edge of pharmaGraphData.edges) {
      if (edge.source === selectedNode.id || edge.target === selectedNode.id) {
        const otherId = edge.source === selectedNode.id ? edge.target : edge.source;
        const otherNode = pharmaGraphData.nodes.find((n) => n.id === otherId);
        if (!otherNode) continue;

        switch (otherNode.type) {
          case "target":
            targets.push({ node: otherNode, edge });
            break;
          case "disease":
            diseases.push({ node: otherNode, edge });
            break;
          case "sideEffect":
            sideEffects.push({ node: otherNode, edge });
            break;
          case "enzyme":
            enzymes.push({ node: otherNode, edge });
            break;
          case "drug":
            interactions.push({ node: otherNode, edge });
            break;
        }
      }
    }

    return { targets, diseases, sideEffects, enzymes, interactions };
  }, [selectedNode]);

  const getNodeIcon = (type: string) => {
    switch (type) {
      case "drug":
        return <Pill className="w-4 h-4" />;
      case "target":
        return <Target className="w-4 h-4" />;
      case "disease":
        return <Activity className="w-4 h-4" />;
      case "sideEffect":
        return <AlertTriangle className="w-4 h-4" />;
      case "enzyme":
        return <FlaskConical className="w-4 h-4" />;
      default:
        return <Info className="w-4 h-4" />;
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-md">
              <Network className="w-5 h-5 text-white" />
            </div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900 font-serif">药理知识图谱</h1>
          </div>
          <p className="text-gray-500 text-sm md:text-base">
            可视化探索药物、靶点、疾病、副作用之间的关联关系，辅助理解药物作用机制
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={handleReset}
            className="inline-flex items-center gap-2 px-4 py-2.5 bg-white border border-gray-200 text-gray-700 rounded-xl font-medium hover:bg-gray-50 transition-all"
          >
            <RefreshCw className="w-4 h-4" />
            重置视图
          </button>
          <button
            onClick={handleExport}
            className="inline-flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-primary-500 to-accent-500 text-white rounded-xl font-medium hover:shadow-lg hover:-translate-y-0.5 transition-all"
          >
            <Download className="w-4 h-4" />
            导出图片
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-6">
        <div className="space-y-4">
          <div className="relative">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setShowSuggestions(true);
                }}
                onFocus={() => setShowSuggestions(true)}
                placeholder="搜索药物、靶点、疾病、副作用..."
                className="w-full pl-12 pr-12 py-3.5 bg-white border border-gray-200 rounded-2xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500/30 focus:border-primary-500 transition-all text-base"
              />
              {searchQuery && (
                <button
                  onClick={clearHighlight}
                  className="absolute right-4 top-1/2 -translate-y-1/2 p-1 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              )}
            </div>
            {showSuggestions && suggestions.length > 0 && (
              <div className="absolute z-20 w-full mt-2 bg-white border border-gray-200 rounded-2xl shadow-xl overflow-hidden max-h-80 overflow-y-auto">
                {suggestions.map((node) => {
                  const config = nodeTypeConfig[node.type];
                  return (
                    <button
                      key={node.id}
                      onClick={() => handleSearch(node)}
                      className="w-full px-4 py-3 flex items-center gap-3 hover:bg-gray-50 transition-colors text-left border-b border-gray-50 last:border-0"
                    >
                      <div
                        className="w-8 h-8 rounded-lg flex items-center justify-center text-white"
                        style={{ backgroundColor: config.color }}
                      >
                        {getNodeIcon(node.type)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="font-medium text-gray-900 truncate">{node.name}</div>
                        <div className="text-xs text-gray-500">{config.label}{node.category ? ` · ${node.category}` : ""}</div>
                      </div>
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          {showSuggestions && (
            <div onClick={() => setShowSuggestions(false)} className="fixed inset-0 z-10" style={{ display: showSuggestions && suggestions.length > 0 ? "block" : "none" }} />
          )}

          <div className="relative">
            <KnowledgeGraph
              ref={chartRef}
              data={pharmaGraphData}
              onNodeClick={handleNodeClick}
              highlightedNodeIds={highlightedNodeIds}
              highlightedEdgeIds={highlightedEdgeIds}
            />
            <div className="absolute bottom-4 right-4 bg-white/90 backdrop-blur-sm rounded-xl px-3 py-2 border border-gray-200 text-xs text-gray-500 shadow-sm">
              拖拽画布移动 · 滚轮缩放 · 点击节点查看详情
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-gray-100 p-5">
            <h3 className="text-sm font-semibold text-gray-700 mb-4 flex items-center gap-2">
              <Info className="w-4 h-4 text-gray-400" />
              图例说明
            </h3>
            <div className="flex flex-wrap gap-4">
              {Object.entries(nodeTypeConfig).map(([type, config]) => (
                <div key={type} className="flex items-center gap-2">
                  <div
                    className="w-4 h-4 rounded-sm"
                    style={{ backgroundColor: config.color }}
                  />
                  <span className="text-sm text-gray-600">{config.label}</span>
                </div>
              ))}
            </div>
            <div className="mt-4 pt-4 border-t border-gray-50 flex flex-wrap gap-4">
              {Object.entries(edgeTypeConfig).map(([type, config]) => (
                <div key={type} className="flex items-center gap-2">
                  <div
                    className="w-8 h-0.5"
                    style={{ backgroundColor: config.color }}
                  />
                  <span className="text-sm text-gray-600">{config.label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
            {selectedNode ? (
              <div className="animate-fade-in">
                <div
                  className="p-5 text-white"
                  style={{ backgroundColor: nodeTypeConfig[selectedNode.type].color }}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center">
                        {getNodeIcon(selectedNode.type)}
                      </div>
                      <div>
                        <h2 className="text-xl font-bold">{selectedNode.name}</h2>
                        <p className="text-white/80 text-sm mt-0.5">
                          {nodeTypeConfig[selectedNode.type].label}
                          {selectedNode.category && ` · ${selectedNode.category}`}
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={clearHighlight}
                      className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 transition-colors"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                  {selectedNode.description && (
                    <p className="mt-4 text-sm text-white/90 leading-relaxed">
                      {selectedNode.description}
                    </p>
                  )}
                </div>

                <div className="p-5 space-y-5 max-h-[600px] overflow-y-auto">
                  {relatedNodes.targets.length > 0 && (
                    <div>
                      <h4 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
                        <Target className="w-4 h-4 text-emerald-500" />
                        作用靶点
                      </h4>
                      <div className="space-y-2">
                        {relatedNodes.targets.map(({ node, edge }) => (
                          <button
                            key={node.id}
                            onClick={() => handleNodeClick(node)}
                            className="w-full text-left p-3 rounded-xl bg-emerald-50 border border-emerald-100 hover:border-emerald-200 hover:bg-emerald-100/50 transition-all group"
                          >
                            <div className="flex items-center justify-between">
                              <span className="font-medium text-gray-800">{node.name}</span>
                              <span className="text-xs text-emerald-600 bg-emerald-100 px-2 py-0.5 rounded-full">
                                {edge.label}
                              </span>
                            </div>
                            {node.description && (
                              <p className="text-xs text-gray-500 mt-1">{node.description}</p>
                            )}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {relatedNodes.diseases.length > 0 && (
                    <div>
                      <h4 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
                        <Activity className="w-4 h-4 text-amber-500" />
                        相关疾病
                      </h4>
                      <div className="space-y-2">
                        {relatedNodes.diseases.map(({ node, edge }) => (
                          <button
                            key={node.id}
                            onClick={() => handleNodeClick(node)}
                            className="w-full text-left p-3 rounded-xl bg-amber-50 border border-amber-100 hover:border-amber-200 hover:bg-amber-100/50 transition-all group"
                          >
                            <div className="flex items-center justify-between">
                              <span className="font-medium text-gray-800">{node.name}</span>
                              <span className="text-xs text-amber-600 bg-amber-100 px-2 py-0.5 rounded-full">
                                {edge.label}
                              </span>
                            </div>
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {relatedNodes.sideEffects.length > 0 && (
                    <div>
                      <h4 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
                        <AlertTriangle className="w-4 h-4 text-red-500" />
                        不良反应
                      </h4>
                      <div className="space-y-2">
                        {relatedNodes.sideEffects.map(({ node, edge }) => (
                          <button
                            key={node.id}
                            onClick={() => handleNodeClick(node)}
                            className="w-full text-left p-3 rounded-xl bg-red-50 border border-red-100 hover:border-red-200 hover:bg-red-100/50 transition-all group"
                          >
                            <div className="flex items-center justify-between">
                              <span className="font-medium text-gray-800">{node.name}</span>
                              <span className="text-xs text-red-600 bg-red-100 px-2 py-0.5 rounded-full">
                                {edge.label}
                              </span>
                            </div>
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {relatedNodes.enzymes.length > 0 && (
                    <div>
                      <h4 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
                        <FlaskConical className="w-4 h-4 text-violet-500" />
                        代谢酶/转运体
                      </h4>
                      <div className="space-y-2">
                        {relatedNodes.enzymes.map(({ node, edge }) => (
                          <button
                            key={node.id}
                            onClick={() => handleNodeClick(node)}
                            className="w-full text-left p-3 rounded-xl bg-violet-50 border border-violet-100 hover:border-violet-200 hover:bg-violet-100/50 transition-all group"
                          >
                            <div className="flex items-center justify-between">
                              <span className="font-medium text-gray-800">{node.name}</span>
                              <span className="text-xs text-violet-600 bg-violet-100 px-2 py-0.5 rounded-full">
                                {edge.label}
                              </span>
                            </div>
                            {node.description && (
                              <p className="text-xs text-gray-500 mt-1">{node.description}</p>
                            )}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {relatedNodes.interactions.length > 0 && (
                    <div>
                      <h4 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
                        <Pill className="w-4 h-4 text-orange-500" />
                        药物相互作用
                      </h4>
                      <div className="space-y-2">
                        {relatedNodes.interactions.map(({ node, edge }) => (
                          <button
                            key={node.id}
                            onClick={() => handleNodeClick(node)}
                            className="w-full text-left p-3 rounded-xl bg-orange-50 border border-orange-100 hover:border-orange-200 hover:bg-orange-100/50 transition-all group"
                          >
                            <div className="flex items-center justify-between">
                              <span className="font-medium text-gray-800">{node.name}</span>
                              <span className="text-xs text-orange-600 bg-orange-100 px-2 py-0.5 rounded-full">
                                {edge.label}
                              </span>
                            </div>
                            {node.category && (
                              <p className="text-xs text-gray-500 mt-1">{node.category}</p>
                            )}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="p-8 text-center">
                <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gray-50 flex items-center justify-center">
                  <Network className="w-8 h-8 text-gray-300" />
                </div>
                <h3 className="text-lg font-medium text-gray-700 mb-2">选择一个节点</h3>
                <p className="text-sm text-gray-500 leading-relaxed">
                  在搜索框输入关键词，或点击图谱中的任意节点，查看其关联的靶点、疾病、副作用和药物相互作用
                </p>
              </div>
            )}
          </div>

          <div className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-2xl p-5 border border-indigo-100">
            <h3 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
              <Info className="w-4 h-4 text-indigo-500" />
              使用指南
            </h3>
            <ul className="space-y-2 text-sm text-gray-600">
              <li className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 mt-1.5 shrink-0" />
                <span>在搜索框输入药物名称快速定位</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 mt-1.5 shrink-0" />
                <span>点击节点查看两度内的关联网络</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 mt-1.5 shrink-0" />
                <span>不同颜色代表不同类型的节点和关系</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 mt-1.5 shrink-0" />
                <span>点击右上角可导出图谱为高清图片</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
