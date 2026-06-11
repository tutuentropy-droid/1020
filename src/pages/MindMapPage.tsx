import { useState, useRef, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  ArrowLeft,
  Download,
  FileImage,
  FileText,
  Plus,
  Brain,
  Pill,
  BookOpen,
  RefreshCw,
  Save,
} from "lucide-react";
import MindMap, { MindMapRef } from "@/components/MindMap";
import {
  generateMindMap,
  generateDrugMindMap,
  generateChapterMindMap,
} from "@/utils/mindMapGenerator";
import { MindMapData } from "@/types";
import { drugs } from "@/data/drugs";
import { chapters } from "@/data/chapters";
import { useStore } from "@/store/useStore";
import { cn } from "@/lib/utils";

type SourceType = "drug" | "chapter";

interface SavedMindMap {
  id: string;
  title: string;
  sourceType: SourceType;
  sourceId: string;
  sourceName: string;
  data: MindMapData;
  savedAt: string;
}

export default function MindMapPage() {
  const { sourceType, sourceId } = useParams<{ sourceType?: string; sourceId?: string }>();
  const navigate = useNavigate();
  const mindMapRef = useRef<MindMapRef>(null);
  const { notes, addNote, updateNote } = useStore();

  const [currentSourceType, setCurrentSourceType] = useState<SourceType>(
    (sourceType as SourceType) || "drug"
  );
  const [selectedSourceId, setSelectedSourceId] = useState(sourceId || "");
  const [mindMapData, setMindMapData] = useState<MindMapData | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [savedMindMaps, setSavedMindMaps] = useState<SavedMindMap[]>(() => {
    const saved = localStorage.getItem("savedMindMaps");
    return saved ? JSON.parse(saved) : [];
  });
  const [showSaveDialog, setShowSaveDialog] = useState(false);
  const [noteTitle, setNoteTitle] = useState("");

  useEffect(() => {
    if (sourceType && sourceId) {
      handleGenerate();
    }
  }, [sourceType, sourceId]);

  useEffect(() => {
    localStorage.setItem("savedMindMaps", JSON.stringify(savedMindMaps));
  }, [savedMindMaps]);

  const handleGenerate = () => {
    if (!selectedSourceId && !sourceId) return;
    const id = selectedSourceId || sourceId || "";
    setIsGenerating(true);

    setTimeout(() => {
      const data = generateMindMap(currentSourceType, id);
      if (data) {
        setMindMapData(data);
      }
      setIsGenerating(false);
    }, 500);
  };

  const handleDataChange = (updatedData: MindMapData) => {
    setMindMapData(updatedData);
  };

  const handleExport = (format: "png" | "pdf") => {
    mindMapRef.current?.exportImage(format);
  };

  const handleSave = () => {
    if (!mindMapData) return;

    const existingNote = notes.find(
      (n) =>
        n.type === "drug-compare" &&
        n.drugIds?.includes(mindMapData.sourceId) &&
        n.title.includes("思维导图")
    );

    if (existingNote) {
      updateNote(existingNote.id, {
        content: JSON.stringify(mindMapData),
        updatedAt: new Date().toISOString(),
      });
    } else {
      addNote({
        title: noteTitle || mindMapData.title,
        content: JSON.stringify(mindMapData),
        type: "drug-compare",
        drugIds: [mindMapData.sourceId],
      });
    }

    const savedEntry: SavedMindMap = {
      id: mindMapData.id,
      title: mindMapData.title,
      sourceType: mindMapData.sourceType,
      sourceId: mindMapData.sourceId,
      sourceName: mindMapData.sourceName,
      data: mindMapData,
      savedAt: new Date().toISOString(),
    };

    setSavedMindMaps((prev) => [
      savedEntry,
      ...prev.filter((m) => m.id !== savedEntry.id),
    ]);
    setShowSaveDialog(false);
  };

  const handleLoadSaved = (saved: SavedMindMap) => {
    setMindMapData(saved.data);
    setCurrentSourceType(saved.sourceType);
    setSelectedSourceId(saved.sourceId);
  };

  const handleDeleteSaved = (id: string) => {
    setSavedMindMaps((prev) => prev.filter((m) => m.id !== id));
  };

  const handleRegenerate = () => {
    if (!selectedSourceId) return;
    setIsGenerating(true);

    setTimeout(() => {
      if (currentSourceType === "drug") {
        const drug = drugs.find((d) => d.id === selectedSourceId);
        if (drug) {
          const data = generateDrugMindMap(drug);
          setMindMapData(data);
        }
      } else {
        const chapter = chapters.find((c) => c.id === selectedSourceId);
        if (chapter) {
          const data = generateChapterMindMap(chapter);
          setMindMapData(data);
        }
      }
      setIsGenerating(false);
    }, 500);
  };

  const currentSourceName = currentSourceType === "drug"
    ? drugs.find((d) => d.id === selectedSourceId)?.name
    : chapters.find((c) => c.id === selectedSourceId)?.title;

  return (
    <div className="min-h-screen py-6 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center gap-4 mb-6">
          <button
            onClick={() => navigate(-1)}
            className="inline-flex items-center gap-2 text-gray-600 hover:text-primary-600 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>返回</span>
          </button>
        </div>

        <div className="bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 rounded-3xl p-8 text-white shadow-xl mb-6">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-14 h-14 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center">
              <Brain className="w-7 h-7 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold">药理思维导图</h1>
              <p className="text-white/80 text-sm mt-1">
                一键生成结构化知识框架，助力系统化学习
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <div className="lg:col-span-1 space-y-4">
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4">
              <h3 className="font-bold text-gray-900 mb-4">生成设置</h3>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    知识来源
                  </label>
                  <div className="flex gap-2">
                    <button
                      onClick={() => setCurrentSourceType("drug")}
                      className={cn(
                        "flex-1 flex items-center justify-center gap-2 py-2 px-3 rounded-xl text-sm font-medium transition-all",
                        currentSourceType === "drug"
                          ? "bg-primary-600 text-white shadow-md"
                          : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                      )}
                    >
                      <Pill className="w-4 h-4" />
                      药物
                    </button>
                    <button
                      onClick={() => setCurrentSourceType("chapter")}
                      className={cn(
                        "flex-1 flex items-center justify-center gap-2 py-2 px-3 rounded-xl text-sm font-medium transition-all",
                        currentSourceType === "chapter"
                          ? "bg-primary-600 text-white shadow-md"
                          : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                      )}
                    >
                      <BookOpen className="w-4 h-4" />
                      章节
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    选择{currentSourceType === "drug" ? "药物" : "章节"}
                  </label>
                  <select
                    value={selectedSourceId}
                    onChange={(e) => setSelectedSourceId(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  >
                    <option value="">请选择...</option>
                    {currentSourceType === "drug"
                      ? drugs.map((drug) => (
                          <option key={drug.id} value={drug.id}>
                            {drug.name} - {drug.category}
                          </option>
                        ))
                      : chapters.map((chapter) => (
                          <option key={chapter.id} value={chapter.id}>
                            第{chapter.order}章 - {chapter.title}
                          </option>
                        ))}
                  </select>
                </div>

                <button
                  onClick={handleGenerate}
                  disabled={!selectedSourceId || isGenerating}
                  className={cn(
                    "w-full flex items-center justify-center gap-2 py-3 rounded-xl font-semibold text-white transition-all",
                    selectedSourceId && !isGenerating
                      ? "bg-gradient-to-r from-primary-600 to-accent-600 hover:from-primary-700 hover:to-accent-700 shadow-md hover:shadow-lg"
                      : "bg-gray-300 cursor-not-allowed"
                  )}
                >
                  {isGenerating ? (
                    <RefreshCw className="w-5 h-5 animate-spin" />
                  ) : (
                    <Plus className="w-5 h-5" />
                  )}
                  {isGenerating ? "生成中..." : "生成思维导图"}
                </button>
              </div>
            </div>

            {mindMapData && (
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4">
                <h3 className="font-bold text-gray-900 mb-4">操作</h3>
                <div className="space-y-2">
                  <button
                    onClick={handleRegenerate}
                    disabled={isGenerating}
                    className="w-full flex items-center gap-2 py-2 px-3 bg-amber-50 text-amber-700 rounded-xl text-sm font-medium hover:bg-amber-100 transition-colors"
                  >
                    <RefreshCw className={cn("w-4 h-4", isGenerating && "animate-spin")} />
                    重新生成
                  </button>

                  <button
                    onClick={() => setShowSaveDialog(true)}
                    className="w-full flex items-center gap-2 py-2 px-3 bg-emerald-50 text-emerald-700 rounded-xl text-sm font-medium hover:bg-emerald-100 transition-colors"
                  >
                    <Save className="w-4 h-4" />
                    保存思维导图
                  </button>

                  <div className="pt-2 border-t border-gray-100">
                    <p className="text-xs text-gray-500 mb-2">导出格式</p>
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleExport("png")}
                        className="flex-1 flex items-center justify-center gap-1 py-2 px-3 bg-blue-50 text-blue-700 rounded-xl text-sm font-medium hover:bg-blue-100 transition-colors"
                      >
                        <FileImage className="w-4 h-4" />
                        图片
                      </button>
                      <button
                        onClick={() => handleExport("pdf")}
                        className="flex-1 flex items-center justify-center gap-1 py-2 px-3 bg-rose-50 text-rose-700 rounded-xl text-sm font-medium hover:bg-rose-100 transition-colors"
                      >
                        <FileText className="w-4 h-4" />
                        PDF
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {savedMindMaps.length > 0 && (
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4">
                <h3 className="font-bold text-gray-900 mb-4">已保存</h3>
                <div className="space-y-2 max-h-64 overflow-y-auto">
                  {savedMindMaps.map((saved) => (
                    <div
                      key={saved.id}
                      className="group p-3 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors cursor-pointer"
                      onClick={() => handleLoadSaved(saved)}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-gray-900 truncate">
                            {saved.title}
                          </p>
                          <p className="text-xs text-gray-500 mt-1">
                            {new Date(saved.savedAt).toLocaleString()}
                          </p>
                        </div>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeleteSaved(saved.id);
                          }}
                          className="opacity-0 group-hover:opacity-100 text-gray-400 hover:text-rose-500 transition-all"
                        >
                          <span className="text-xs">删除</span>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="lg:col-span-3">
            {mindMapData ? (
              <MindMap
                ref={mindMapRef}
                data={mindMapData}
                onDataChange={handleDataChange}
              />
            ) : (
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-12 flex items-center justify-center min-h-[600px]">
                <div className="text-center">
                  <div className="w-24 h-24 bg-gradient-to-br from-indigo-100 to-purple-100 rounded-full flex items-center justify-center mx-auto mb-6">
                    <Brain className="w-12 h-12 text-indigo-500" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">
                    生成你的第一个思维导图
                  </h3>
                  <p className="text-gray-500 max-w-md mx-auto mb-6">
                    选择药物或章节，一键自动提取分类、机制、适应症、不良反应等关键信息，
                    生成结构化的知识框架。支持手动编辑和添加个人笔记。
                  </p>
                  <div className="flex items-center justify-center gap-4 text-sm text-gray-400">
                    <div className="flex items-center gap-1">
                      <FileImage className="w-4 h-4" />
                      导出图片
                    </div>
                    <div className="w-1 h-1 rounded-full bg-gray-300" />
                    <div className="flex items-center gap-1">
                      <FileText className="w-4 h-4" />
                      导出PDF
                    </div>
                    <div className="w-1 h-1 rounded-full bg-gray-300" />
                    <div className="flex items-center gap-1">
                      <Pill className="w-4 h-4" />
                      药物知识
                    </div>
                    <div className="w-1 h-1 rounded-full bg-gray-300" />
                    <div className="flex items-center gap-1">
                      <BookOpen className="w-4 h-4" />
                      章节知识
                    </div>
                  </div>
                </div>
              </div>
            )}

            {currentSourceName && mindMapData && (
              <div className="mt-4 p-4 bg-gradient-to-r from-primary-50 to-accent-50 rounded-2xl border border-primary-100">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-primary-600 font-medium">
                      {currentSourceType === "drug" ? "当前药物" : "当前章节"}
                    </p>
                    <p className="text-lg font-bold text-gray-900">{currentSourceName}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-gray-500">
                      生成时间
                    </p>
                    <p className="text-sm font-medium text-gray-700">
                      {new Date(mindMapData.createdAt).toLocaleString()}
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {showSaveDialog && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-xl max-w-md w-full p-6">
            <h3 className="text-xl font-bold text-gray-900 mb-4">保存思维导图</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  标题
                </label>
                <input
                  type="text"
                  value={noteTitle || mindMapData?.title || ""}
                  onChange={(e) => setNoteTitle(e.target.value)}
                  placeholder="请输入思维导图标题"
                  className="w-full px-3 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  autoFocus
                />
              </div>
              <div className="flex gap-3">
                <button
                  onClick={() => setShowSaveDialog(false)}
                  className="flex-1 py-2 px-4 bg-gray-100 text-gray-700 rounded-xl font-medium hover:bg-gray-200 transition-colors"
                >
                  取消
                </button>
                <button
                  onClick={handleSave}
                  className="flex-1 py-2 px-4 bg-primary-600 text-white rounded-xl font-medium hover:bg-primary-700 transition-colors"
                >
                  保存
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
