import { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import {
  BookMarked,
  Trash2,
  Edit3,
  Save,
  Plus,
  FileText,
  GitCompare,
  Search,
  ChevronRight,
  ArrowLeft,
  AlertCircle,
} from "lucide-react";
import { useStore } from "@/store/useStore";
import { Note } from "@/types";
import { cn } from "@/lib/utils";
import { formatDate } from "@/utils/helpers";
import { drugs } from "@/data/drugs";

function MarkdownRenderer({ content }: { content: string }) {
  const lines = content.split("\n");
  const elements: JSX.Element[] = [];
  let listItems: string[] = [];

  const flushList = (keyPrefix: string) => {
    if (listItems.length > 0) {
      elements.push(
        <ul key={`ul-${keyPrefix}`} className="space-y-1.5 mb-4 ml-1">
          {listItems.map((item, idx) => (
            <li key={idx} className="flex items-start gap-2 text-sm text-gray-600">
              <span className="w-1.5 h-1.5 rounded-full bg-gray-400 mt-2 flex-shrink-0" />
              <span dangerouslySetInnerHTML={{ __html: renderInline(item) }} />
            </li>
          ))}
        </ul>
      );
      listItems = [];
    }
  };

  const renderInline = (text: string): string => {
    return text
      .replace(/\*\*(.*?)\*\*/g, '<strong class="font-semibold text-gray-900">$1</strong>')
      .replace(/`([^`]+)`/g, '<code class="px-1.5 py-0.5 bg-amber-100 text-amber-800 rounded text-[0.85em] border border-amber-200">$1</code>')
      .replace(/🔴/g, '<span class="inline-flex items-center justify-center w-4 h-4 rounded-full bg-rose-100 text-rose-600 text-[10px] mr-1 border border-rose-200">!</span>')
      .replace(/✅/g, '<span class="inline-flex items-center justify-center w-4 h-4 rounded-full bg-emerald-100 text-emerald-600 text-[10px] mr-1 border border-emerald-200">✓</span>');
  };

  lines.forEach((line, index) => {
    const trimmed = line.trim();

    if (trimmed.startsWith("### ")) {
      flushList(`h3-${index}`);
      elements.push(
        <h3
          key={`h3-${index}`}
          className="text-lg font-bold text-gray-900 mt-6 mb-3 pb-2 border-b border-gray-100"
          dangerouslySetInnerHTML={{ __html: renderInline(trimmed.slice(4)) }}
        />
      );
    } else if (trimmed.startsWith("## ")) {
      flushList(`h2-${index}`);
      elements.push(
        <h2
          key={`h2-${index}`}
          className="text-xl font-bold text-gray-900 mt-4 mb-4"
          dangerouslySetInnerHTML={{ __html: renderInline(trimmed.slice(3)) }}
        />
      );
    } else if (trimmed.startsWith("---")) {
      flushList(`hr-${index}`);
      elements.push(<hr key={`hr-${index}`} className="my-5 border-t border-gray-200" />);
    } else if (trimmed.startsWith("> ")) {
      flushList(`quote-${index}`);
      elements.push(
        <blockquote
          key={`quote-${index}`}
          className="pl-4 py-2.5 my-4 bg-primary-50/50 border-l-4 border-primary-400 rounded-r-lg text-sm text-gray-600 italic"
          dangerouslySetInnerHTML={{ __html: renderInline(trimmed.slice(2)) }}
        />
      );
    } else if (trimmed === "") {
      flushList(`empty-${index}`);
    } else {
      const isListItem = /^[-*•]/.test(trimmed);
      if (isListItem) {
        listItems.push(trimmed.replace(/^[-*•]\s*/, ""));
      } else {
        flushList(`p-${index}`);
        elements.push(
          <p
            key={`p-${index}`}
            className="text-sm text-gray-700 leading-relaxed mb-3 last:mb-0"
            dangerouslySetInnerHTML={{ __html: renderInline(trimmed) }}
          />
        );
      }
    }
  });

  flushList("final");

  return <div className="prose prose-sm max-w-none">{elements}</div>;
}

type FilterType = "all" | "drug-compare" | "general";

export default function Notes() {
  const { notes, addNote, updateNote, deleteNote } = useStore();
  const [selectedNote, setSelectedNote] = useState<Note | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState("");
  const [editContent, setEditContent] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState<FilterType>("all");
  const [isCreating, setIsCreating] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<string | null>(null);

  const filteredNotes = useMemo(() => {
    return notes.filter((note) => {
      const matchesType =
        activeFilter === "all" || note.type === activeFilter;
      const matchesSearch =
        searchQuery.trim() === "" ||
        note.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        note.content.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesType && matchesSearch;
    });
  }, [notes, activeFilter, searchQuery]);

  const drugCompareNotes = notes.filter((n) => n.type === "drug-compare").length;
  const generalNotes = notes.filter((n) => n.type === "general").length;

  const handleSelectNote = (note: Note) => {
    setSelectedNote(note);
    setIsEditing(false);
    setIsCreating(false);
  };

  const handleStartEdit = () => {
    if (!selectedNote) return;
    setEditTitle(selectedNote.title);
    setEditContent(selectedNote.content);
    setIsEditing(true);
  };

  const handleSaveEdit = () => {
    if (!selectedNote || !editTitle.trim()) return;
    updateNote(selectedNote.id, {
      title: editTitle.trim(),
      content: editContent,
    });
    const updated = notes.find((n) => n.id === selectedNote.id);
    if (updated) setSelectedNote({ ...updated, title: editTitle.trim(), content: editContent });
    setIsEditing(false);
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setEditTitle("");
    setEditContent("");
  };

  const handleDelete = (id: string) => {
    deleteNote(id);
    if (selectedNote?.id === id) {
      setSelectedNote(null);
    }
    setShowDeleteConfirm(null);
  };

  const handleCreateNew = () => {
    setIsCreating(true);
    setSelectedNote(null);
    setIsEditing(false);
    setEditTitle("");
    setEditContent("");
  };

  const handleSaveNew = () => {
    if (!editTitle.trim()) return;
    const newNote = addNote({
      title: editTitle.trim(),
      content: editContent || "（暂无内容）",
      type: "general",
    });
    setSelectedNote(newNote);
    setIsCreating(false);
    setEditTitle("");
    setEditContent("");
  };

  const handleCancelNew = () => {
    setIsCreating(false);
    setEditTitle("");
    setEditContent("");
  };

  const getDrugNames = (drugIds?: string[]) => {
    if (!drugIds || drugIds.length === 0) return "";
    return drugIds
      .map((id) => drugs.find((d) => d.id === id)?.name)
      .filter(Boolean)
      .join("、");
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center shadow-lg">
            <BookMarked className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-900 font-serif">我的笔记</h1>
            <p className="text-sm text-gray-500 mt-1">
              共 {notes.length} 条笔记 · 药物对比 {drugCompareNotes} 条 · 普通笔记 {generalNotes} 条
            </p>
          </div>
        </div>
        <button
          onClick={handleCreateNew}
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-primary-500 to-accent-500 text-white font-medium rounded-xl shadow-md hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200"
        >
          <Plus className="w-4 h-4" />
          新建笔记
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 h-[calc(100vh-220px)]">
        <div className="lg:col-span-2 bg-white rounded-2xl border border-gray-100 shadow-sm flex flex-col overflow-hidden">
          <div className="p-4 border-b border-gray-100 space-y-3">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="w-4 h-4 text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="搜索笔记..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-400 focus:border-transparent transition-all"
              />
            </div>
            <div className="flex gap-2">
              {[
                { key: "all", label: "全部", count: notes.length },
                { key: "drug-compare", label: "药物对比", count: drugCompareNotes },
                { key: "general", label: "普通笔记", count: generalNotes },
              ].map((filter) => (
                <button
                  key={filter.key}
                  onClick={() => setActiveFilter(filter.key as FilterType)}
                  className={cn(
                    "flex-1 px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-200",
                    activeFilter === filter.key
                      ? "bg-primary-500 text-white shadow-sm"
                      : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                  )}
                >
                  {filter.label} ({filter.count})
                </button>
              ))}
            </div>
          </div>

          <div className="flex-1 overflow-y-auto">
            {filteredNotes.length > 0 ? (
              <div className="divide-y divide-gray-50">
                {filteredNotes.map((note) => (
                  <div
                    key={note.id}
                    onClick={() => handleSelectNote(note)}
                    className={cn(
                      "relative p-4 cursor-pointer transition-all group",
                      selectedNote?.id === note.id
                        ? "bg-gradient-to-r from-primary-50 to-accent-50 border-l-4 border-primary-500"
                        : "hover:bg-gray-50"
                    )}
                  >
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <div className="flex items-center gap-2 min-w-0">
                        {note.type === "drug-compare" ? (
                          <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-cyan-400 to-blue-500 flex items-center justify-center flex-shrink-0">
                            <GitCompare className="w-3.5 h-3.5 text-white" />
                          </div>
                        ) : (
                          <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center flex-shrink-0">
                            <FileText className="w-3.5 h-3.5 text-white" />
                          </div>
                        )}
                        <h4 className="font-semibold text-gray-900 text-sm truncate">
                          {note.title}
                        </h4>
                      </div>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setShowDeleteConfirm(note.id);
                        }}
                        className="opacity-0 group-hover:opacity-100 w-7 h-7 rounded-lg bg-red-50 text-red-500 flex items-center justify-center hover:bg-red-100 transition-all flex-shrink-0"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                    {note.type === "drug-compare" && note.drugIds && (
                      <p className="text-xs text-cyan-600 mb-1.5 ml-9">
                        📋 {getDrugNames(note.drugIds)}
                      </p>
                    )}
                    <p className="text-xs text-gray-500 line-clamp-2 ml-9">
                      {note.content.replace(/[#*`>~\-]/g, "").slice(0, 80)}...
                    </p>
                    <div className="flex items-center justify-between mt-2 ml-9">
                      <span className="text-[10px] text-gray-400">
                        {formatDate(note.updatedAt)}
                      </span>
                      <ChevronRight
                        className={cn(
                          "w-4 h-4 transition-transform",
                          selectedNote?.id === note.id
                            ? "text-primary-500 translate-x-0.5"
                            : "text-gray-300"
                        )}
                      />
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center h-full py-16 px-4 text-center">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center mb-4">
                  <BookMarked className="w-8 h-8 text-gray-400" />
                </div>
                <h4 className="font-semibold text-gray-700 mb-1">暂无笔记</h4>
                <p className="text-sm text-gray-500 max-w-xs">
                  {searchQuery
                    ? "没有找到匹配的笔记，试试其他关键词"
                    : "在药物对比页保存对比结果，或点击右上角新建笔记"}
                </p>
              </div>
            )}
          </div>
        </div>

        <div className="lg:col-span-3 bg-white rounded-2xl border border-gray-100 shadow-sm flex flex-col overflow-hidden">
          {isCreating ? (
            <div className="flex flex-col h-full">
              <div className="flex items-center justify-between p-4 border-b border-gray-100">
                <div className="flex items-center gap-2">
                  <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center">
                    <FileText className="w-4.5 h-4.5 text-white" />
                  </div>
                  <span className="font-semibold text-gray-900">新建笔记</span>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={handleCancelNew}
                    className="px-4 py-2 rounded-lg text-sm font-medium text-gray-600 bg-gray-100 hover:bg-gray-200 transition-colors"
                  >
                    取消
                  </button>
                  <button
                    onClick={handleSaveNew}
                    disabled={!editTitle.trim()}
                    className={cn(
                      "inline-flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium transition-all",
                      editTitle.trim()
                        ? "bg-primary-500 text-white hover:bg-primary-600 shadow-sm"
                        : "bg-gray-200 text-gray-400 cursor-not-allowed"
                    )}
                  >
                    <Save className="w-4 h-4" />
                    保存
                  </button>
                </div>
              </div>
              <div className="flex-1 flex flex-col p-4 space-y-4 overflow-y-auto">
                <input
                  type="text"
                  placeholder="输入笔记标题..."
                  value={editTitle}
                  onChange={(e) => setEditTitle(e.target.value)}
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-lg font-semibold text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-400 focus:border-transparent transition-all"
                />
                <textarea
                  placeholder="输入笔记内容（支持 Markdown 格式：## 标题、**加粗**、`代码`、> 引用等）..."
                  value={editContent}
                  onChange={(e) => setEditContent(e.target.value)}
                  className="flex-1 w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm text-gray-700 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-400 focus:border-transparent transition-all resize-none leading-relaxed"
                />
              </div>
            </div>
          ) : selectedNote ? (
            <div className="flex flex-col h-full">
              <div className="flex items-center justify-between p-4 border-b border-gray-100">
                <div className="flex items-center gap-3 min-w-0">
                  {selectedNote.type === "drug-compare" ? (
                    <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-cyan-400 to-blue-500 flex items-center justify-center flex-shrink-0">
                      <GitCompare className="w-4.5 h-4.5 text-white" />
                    </div>
                  ) : (
                    <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center flex-shrink-0">
                      <FileText className="w-4.5 h-4.5 text-white" />
                    </div>
                  )}
                  <div className="min-w-0">
                    {isEditing ? (
                      <input
                        type="text"
                        value={editTitle}
                        onChange={(e) => setEditTitle(e.target.value)}
                        className="w-full px-3 py-1.5 bg-gray-50 border border-gray-200 rounded-lg text-base font-semibold text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary-400 focus:border-transparent"
                      />
                    ) : (
                      <h3 className="font-bold text-gray-900 text-lg truncate">
                        {selectedNote.title}
                      </h3>
                    )}
                    <p className="text-xs text-gray-400 mt-0.5">
                      创建于 {formatDate(selectedNote.createdAt)} · 更新于{" "}
                      {formatDate(selectedNote.updatedAt)}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {isEditing ? (
                    <>
                      <button
                        onClick={handleCancelEdit}
                        className="px-4 py-2 rounded-lg text-sm font-medium text-gray-600 bg-gray-100 hover:bg-gray-200 transition-colors"
                      >
                        取消
                      </button>
                      <button
                        onClick={handleSaveEdit}
                        disabled={!editTitle.trim()}
                        className={cn(
                          "inline-flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium transition-all",
                          editTitle.trim()
                            ? "bg-primary-500 text-white hover:bg-primary-600 shadow-sm"
                            : "bg-gray-200 text-gray-400 cursor-not-allowed"
                        )}
                      >
                        <Save className="w-4 h-4" />
                        保存
                      </button>
                    </>
                  ) : (
                    <>
                      <button
                        onClick={handleStartEdit}
                        className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium text-gray-600 bg-gray-100 hover:bg-gray-200 transition-colors"
                      >
                        <Edit3 className="w-4 h-4" />
                        编辑
                      </button>
                      <button
                        onClick={() => setShowDeleteConfirm(selectedNote.id)}
                        className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium text-red-600 bg-red-50 hover:bg-red-100 transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                        删除
                      </button>
                    </>
                  )}
                </div>
              </div>

              <div className="flex-1 overflow-y-auto p-6">
                {isEditing ? (
                  <textarea
                    value={editContent}
                    onChange={(e) => setEditContent(e.target.value)}
                    className="w-full h-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-primary-400 focus:border-transparent transition-all resize-none leading-relaxed font-mono"
                  />
                ) : (
                  <MarkdownRenderer content={selectedNote.content} />
                )}
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-full py-16 px-6 text-center">
              <div className="w-24 h-24 rounded-3xl bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center mb-6">
                <FileText className="w-12 h-12 text-gray-400" />
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-2">选择笔记查看内容</h3>
              <p className="text-gray-500 max-w-sm mb-6">
                从左侧列表选择一条笔记，或点击右上角「新建笔记」按钮创建新的笔记。
                在药物对比页面保存的对比结果会自动出现在这里。
              </p>
              <div className="flex items-center gap-4 text-sm text-gray-500">
                <Link
                  to="/drug-compare"
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-primary-50 text-primary-600 font-medium hover:bg-primary-100 transition-colors"
                >
                  <GitCompare className="w-4 h-4" />
                  去做药物对比
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>

      {showDeleteConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 animate-slide-up">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-2xl bg-red-100 flex items-center justify-center flex-shrink-0">
                <AlertCircle className="w-6 h-6 text-red-600" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-gray-900">确认删除</h3>
                <p className="text-sm text-gray-500">此操作不可撤销</p>
              </div>
            </div>
            <p className="text-gray-600 mb-6">
              确定要删除这条笔记吗？删除后将无法恢复。
            </p>
            <div className="flex items-center justify-end gap-3">
              <button
                onClick={() => setShowDeleteConfirm(null)}
                className="px-5 py-2.5 rounded-xl text-sm font-medium text-gray-600 bg-gray-100 hover:bg-gray-200 transition-colors"
              >
                取消
              </button>
              <button
                onClick={() => handleDelete(showDeleteConfirm)}
                className="px-5 py-2.5 rounded-xl text-sm font-medium text-white bg-red-500 hover:bg-red-600 shadow-sm transition-colors"
              >
                确认删除
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
