import { useState, useMemo } from "react";
import {
  BookOpen,
  Search,
  ThumbsUp,
  MessageSquare,
  Tag,
  ChevronDown,
  ChevronUp,
  Clock,
  Calendar,
  FileText,
  Users,
  Sparkles,
  Trophy,
  Send,
  User,
  Heart,
  MessageCircle,
  ExternalLink,
} from "lucide-react";
import { useStore } from "@/store/useStore";
import { journalArticles, commentTagLabels, commentTagColors } from "@/data/journalClub";
import { JournalArticle, JournalComment, CommentTag } from "@/types";
import { cn } from "@/lib/utils";
import { formatDate } from "@/utils/helpers";

type CategoryFilter = "all" | "classic" | "cutting-edge";

function ArticleCard({
  article,
  isActive,
  onClick,
}: {
  article: JournalArticle;
  isActive: boolean;
  onClick: () => void;
}) {
  return (
    <div
      onClick={onClick}
      className={cn(
        "p-5 rounded-2xl border cursor-pointer transition-all duration-300",
        isActive
          ? "bg-gradient-to-br from-primary-50 to-accent-50 border-primary-300 shadow-md"
          : "bg-white border-gray-200 hover:border-primary-200 hover:shadow-md"
      )}
    >
      <div className="flex items-start gap-3">
        <div
          className={cn(
            "w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0",
            article.category === "classic"
              ? "bg-gradient-to-br from-amber-400 to-orange-500"
              : "bg-gradient-to-br from-violet-500 to-purple-600"
          )}
        >
          <BookOpen className="w-5 h-5 text-white" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-2 flex-wrap">
            <span
              className={cn(
                "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold",
                article.category === "classic"
                  ? "bg-amber-100 text-amber-700"
                  : "bg-violet-100 text-violet-700"
              )}
            >
              {article.category === "classic" ? "经典文献" : "前沿研究"}
            </span>
            <span className="text-xs text-gray-500">
              第 {article.weekNumber} 周
            </span>
          </div>
          <h3 className="font-semibold text-gray-900 text-sm line-clamp-2 mb-1.5">
            {article.title}
          </h3>
          <p className="text-xs text-gray-500">
            {article.journal} · {article.year}
          </p>
        </div>
      </div>
    </div>
  );
}

function CommentForm({
  articleId,
  onSubmit,
}: {
  articleId: string;
  onSubmit: () => void;
}) {
  const { addJournalComment } = useStore();
  const [researchQuestion, setResearchQuestion] = useState("");
  const [methodsConclusions, setMethodsConclusions] = useState("");
  const [clinicalSignificance, setClinicalSignificance] = useState("");
  const [myQuestions, setMyQuestions] = useState("");
  const [selectedTags, setSelectedTags] = useState<CommentTag[]>([]);

  const handleTagToggle = (tag: CommentTag) => {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  };

  const handleSubmit = () => {
    if (
      !researchQuestion.trim() &&
      !methodsConclusions.trim() &&
      !clinicalSignificance.trim() &&
      !myQuestions.trim()
    ) {
      return;
    }
    addJournalComment(articleId, {
      researchQuestion: researchQuestion.trim(),
      methodsConclusions: methodsConclusions.trim(),
      clinicalSignificance: clinicalSignificance.trim(),
      myQuestions: myQuestions.trim(),
      tags: selectedTags,
    });
    setResearchQuestion("");
    setMethodsConclusions("");
    setClinicalSignificance("");
    setMyQuestions("");
    setSelectedTags([]);
    onSubmit();
  };

  const isFormValid =
    researchQuestion.trim() ||
    methodsConclusions.trim() ||
    clinicalSignificance.trim() ||
    myQuestions.trim();

  return (
    <div className="bg-white rounded-2xl border border-gray-200 p-5 shadow-sm">
      <div className="flex items-center gap-2 mb-4">
        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center">
          <MessageSquare className="w-4 h-4 text-white" />
        </div>
        <h3 className="font-bold text-gray-900">发表结构化评论</h3>
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">
            🎯 研究问题
          </label>
          <textarea
            value={researchQuestion}
            onChange={(e) => setResearchQuestion(e.target.value)}
            placeholder="这篇文献要解决的核心研究问题是什么？"
            rows={2}
            className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm text-gray-700 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-400 focus:border-transparent transition-all resize-none"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">
            🔬 方法与结论
          </label>
          <textarea
            value={methodsConclusions}
            onChange={(e) => setMethodsConclusions(e.target.value)}
            placeholder="研究采用了什么方法？得出了哪些主要结论？"
            rows={2}
            className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm text-gray-700 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-400 focus:border-transparent transition-all resize-none"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">
            💊 临床意义
          </label>
          <textarea
            value={clinicalSignificance}
            onChange={(e) => setClinicalSignificance(e.target.value)}
            placeholder="这项研究对临床实践有什么指导意义？"
            rows={2}
            className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm text-gray-700 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-400 focus:border-transparent transition-all resize-none"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">
            ❓ 我的疑问
          </label>
          <textarea
            value={myQuestions}
            onChange={(e) => setMyQuestions(e.target.value)}
            placeholder="读完这篇文献，你还有哪些疑问或思考？"
            rows={2}
            className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm text-gray-700 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-400 focus:border-transparent transition-all resize-none"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            🏷️ 添加标签
          </label>
          <div className="flex flex-wrap gap-2">
            {(Object.keys(commentTagLabels) as CommentTag[]).map((tag) => (
              <button
                key={tag}
                onClick={() => handleTagToggle(tag)}
                className={cn(
                  "px-3 py-1.5 rounded-full text-xs font-medium transition-all",
                  selectedTags.includes(tag)
                    ? commentTagColors[tag] + " ring-2 ring-offset-1"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                )}
              >
                {commentTagLabels[tag]}
              </button>
            ))}
          </div>
        </div>

        <div className="flex justify-end pt-2">
          <button
            onClick={handleSubmit}
            disabled={!isFormValid}
            className={cn(
              "inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-medium transition-all",
              isFormValid
                ? "bg-gradient-to-r from-primary-500 to-accent-500 text-white shadow-md hover:shadow-lg hover:-translate-y-0.5"
                : "bg-gray-200 text-gray-400 cursor-not-allowed"
            )}
          >
            <Send className="w-4 h-4" />
            发布评论
          </button>
        </div>
      </div>
    </div>
  );
}

function ReplyForm({
  onSubmit,
  onCancel,
}: {
  onSubmit: (content: string) => void;
  onCancel: () => void;
}) {
  const [content, setContent] = useState("");

  const handleSubmit = () => {
    if (!content.trim()) return;
    onSubmit(content.trim());
    setContent("");
  };

  return (
    <div className="mt-3 pl-10">
      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="写下你的回复..."
        rows={2}
        className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm text-gray-700 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-400 focus:border-transparent transition-all resize-none"
        autoFocus
      />
      <div className="flex justify-end gap-2 mt-2">
        <button
          onClick={onCancel}
          className="px-3 py-1.5 rounded-lg text-xs font-medium text-gray-600 bg-gray-100 hover:bg-gray-200 transition-colors"
        >
          取消
        </button>
        <button
          onClick={handleSubmit}
          disabled={!content.trim()}
          className={cn(
            "px-3 py-1.5 rounded-lg text-xs font-medium transition-colors",
            content.trim()
              ? "bg-primary-500 text-white hover:bg-primary-600"
              : "bg-gray-200 text-gray-400 cursor-not-allowed"
          )}
        >
          回复
        </button>
      </div>
    </div>
  );
}

function CommentItem({ comment }: { comment: JournalComment }) {
  const { likeJournalComment, replyToJournalComment, likeCommentReply } = useStore();
  const [showReplies, setShowReplies] = useState(true);
  const [isReplying, setIsReplying] = useState(false);

  const handleReply = (content: string) => {
    replyToJournalComment(comment.id, content);
    setIsReplying(false);
  };

  return (
    <div className="bg-white rounded-2xl border border-gray-200 p-5 shadow-sm">
      <div className="flex items-start gap-3 mb-4">
        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary-400 to-accent-400 flex items-center justify-center flex-shrink-0">
          <User className="w-5 h-5 text-white" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap mb-1">
            <span className="font-semibold text-gray-900 text-sm">
              {comment.authorName}
            </span>
            <span className="text-xs text-gray-400">
              {formatDate(comment.createdAt)}
            </span>
          </div>
          {comment.tags.length > 0 && (
            <div className="flex flex-wrap gap-1.5">
              {comment.tags.map((tag) => (
                <span
                  key={tag}
                  className={cn(
                    "inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium",
                    commentTagColors[tag]
                  )}
                >
                  <Tag className="w-3 h-3 mr-1" />
                  {commentTagLabels[tag]}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="space-y-3 pl-13">
        {comment.researchQuestion && (
          <div className="bg-blue-50/50 rounded-xl p-3 border border-blue-100">
            <div className="flex items-center gap-1.5 mb-1.5">
              <span className="text-xs font-semibold text-blue-700">🎯 研究问题</span>
            </div>
            <p className="text-sm text-gray-700 leading-relaxed">
              {comment.researchQuestion}
            </p>
          </div>
        )}

        {comment.methodsConclusions && (
          <div className="bg-purple-50/50 rounded-xl p-3 border border-purple-100">
            <div className="flex items-center gap-1.5 mb-1.5">
              <span className="text-xs font-semibold text-purple-700">🔬 方法与结论</span>
            </div>
            <p className="text-sm text-gray-700 leading-relaxed">
              {comment.methodsConclusions}
            </p>
          </div>
        )}

        {comment.clinicalSignificance && (
          <div className="bg-green-50/50 rounded-xl p-3 border border-green-100">
            <div className="flex items-center gap-1.5 mb-1.5">
              <span className="text-xs font-semibold text-green-700">💊 临床意义</span>
            </div>
            <p className="text-sm text-gray-700 leading-relaxed">
              {comment.clinicalSignificance}
            </p>
          </div>
        )}

        {comment.myQuestions && (
          <div className="bg-amber-50/50 rounded-xl p-3 border border-amber-100">
            <div className="flex items-center gap-1.5 mb-1.5">
              <span className="text-xs font-semibold text-amber-700">❓ 我的疑问</span>
            </div>
            <p className="text-sm text-gray-700 leading-relaxed">
              {comment.myQuestions}
            </p>
          </div>
        )}
      </div>

      <div className="flex items-center gap-4 mt-4 pt-4 border-t border-gray-100">
        <button
          onClick={() => likeJournalComment(comment.id)}
          className={cn(
            "inline-flex items-center gap-1.5 text-sm transition-colors",
            comment.likedByUser
              ? "text-red-500"
              : "text-gray-500 hover:text-red-500"
          )}
        >
          {comment.likedByUser ? (
            <Heart className="w-4 h-4 fill-current" />
          ) : (
            <Heart className="w-4 h-4" />
          )}
          <span>{comment.likes}</span>
        </button>
        <button
          onClick={() => setIsReplying(!isReplying)}
          className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-primary-600 transition-colors"
        >
          <MessageCircle className="w-4 h-4" />
          <span>回复</span>
        </button>
        {comment.replies.length > 0 && (
          <button
            onClick={() => setShowReplies(!showReplies)}
            className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-700 transition-colors"
          >
            {showReplies ? (
              <ChevronUp className="w-4 h-4" />
            ) : (
              <ChevronDown className="w-4 h-4" />
            )}
            <span>{comment.replies.length} 条回复</span>
          </button>
        )}
      </div>

      {isReplying && (
        <ReplyForm onSubmit={handleReply} onCancel={() => setIsReplying(false)} />
      )}

      {showReplies && comment.replies.length > 0 && (
        <div className="mt-4 space-y-3 pl-10">
          {comment.replies.map((reply) => (
            <div
              key={reply.id}
              className="bg-gray-50 rounded-xl p-3 border border-gray-100"
            >
              <div className="flex items-start gap-2.5">
                <div className="w-7 h-7 rounded-full bg-gradient-to-br from-gray-400 to-gray-500 flex items-center justify-center flex-shrink-0">
                  <User className="w-3.5 h-3.5 text-white" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-medium text-gray-900 text-xs">
                      {reply.authorName}
                    </span>
                    <span className="text-[10px] text-gray-400">
                      {formatDate(reply.createdAt)}
                    </span>
                  </div>
                  <p className="text-sm text-gray-700 leading-relaxed">
                    {reply.content}
                  </p>
                  <div className="flex items-center gap-3 mt-2">
                    <button
                      onClick={() => likeCommentReply(comment.id, reply.id)}
                      className={cn(
                        "inline-flex items-center gap-1 text-xs transition-colors",
                        reply.likedByUser
                          ? "text-red-500"
                          : "text-gray-400 hover:text-red-500"
                      )}
                    >
                      {reply.likedByUser ? (
                        <ThumbsUp className="w-3 h-3 fill-current" />
                      ) : (
                        <ThumbsUp className="w-3 h-3" />
                      )}
                      <span>{reply.likes}</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function ArticleDetail({ article }: { article: JournalArticle }) {
  const { getArticleComments } = useStore();
  const comments = getArticleComments(article.id);

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm">
        <div className="p-6 bg-gradient-to-r from-primary-500 to-accent-500">
          <div className="flex items-center gap-2 mb-3">
            <span
              className={cn(
                "inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold",
                article.category === "classic"
                  ? "bg-white/20 text-white"
                  : "bg-white/20 text-white"
              )}
            >
              {article.category === "classic" ? (
                <>
                  <Trophy className="w-3 h-3 mr-1" />
                  经典文献
                </>
              ) : (
                <>
                  <Sparkles className="w-3 h-3 mr-1" />
                  前沿研究
                </>
              )}
            </span>
            <span className="text-white/80 text-xs flex items-center gap-1">
              <Calendar className="w-3 h-3" />
              第 {article.weekNumber} 周推荐
            </span>
          </div>
          <h2 className="text-xl font-bold text-white font-serif leading-tight mb-3">
            {article.title}
          </h2>
          <div className="flex flex-wrap items-center gap-3 text-white/80 text-sm">
            <span className="flex items-center gap-1">
              <Users className="w-4 h-4" />
              {article.authors.slice(0, 3).join(", ")}
              {article.authors.length > 3 && " 等"}
            </span>
            <span className="flex items-center gap-1">
              <BookOpen className="w-4 h-4" />
              {article.journal}
            </span>
            <span className="flex items-center gap-1">
              <Calendar className="w-4 h-4" />
              {article.year}
            </span>
          </div>
        </div>

        <div className="p-6 space-y-5">
          {article.summary && (
            <div className="p-4 bg-gradient-to-r from-amber-50 to-orange-50 rounded-xl border border-amber-200">
              <div className="flex items-center gap-2 mb-2">
                <Sparkles className="w-4 h-4 text-amber-600" />
                <span className="font-semibold text-amber-800 text-sm">编辑推荐</span>
              </div>
              <p className="text-sm text-amber-900 leading-relaxed">
                {article.summary}
              </p>
            </div>
          )}

          <div>
            <h3 className="font-bold text-gray-900 mb-2 flex items-center gap-2">
              <FileText className="w-4 h-4 text-primary-500" />
              摘要
            </h3>
            <p className="text-sm text-gray-600 leading-relaxed">
              {article.abstract}
            </p>
          </div>

          <div>
            <h3 className="font-bold text-gray-900 mb-3 flex items-center gap-2">
              <Trophy className="w-4 h-4 text-amber-500" />
              关键发现
            </h3>
            <ul className="space-y-2">
              {article.keyFindings.map((finding, idx) => (
                <li key={idx} className="flex items-start gap-2">
                  <span className="flex-shrink-0 w-5 h-5 rounded-full bg-primary-100 text-primary-700 flex items-center justify-center text-xs font-bold mt-0.5">
                    {idx + 1}
                  </span>
                  <span className="text-sm text-gray-700 leading-relaxed">
                    {finding}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="bg-gray-50 rounded-xl p-3 text-center">
              <p className="text-xs text-gray-500 mb-1">研究类型</p>
              <p className="text-sm font-semibold text-gray-900">
                {article.studyType}
              </p>
            </div>
            {article.sampleSize && (
              <div className="bg-gray-50 rounded-xl p-3 text-center">
                <p className="text-xs text-gray-500 mb-1">样本量</p>
                <p className="text-sm font-semibold text-gray-900">
                  {article.sampleSize.toLocaleString()}
                </p>
              </div>
            )}
            <div className="bg-gray-50 rounded-xl p-3 text-center">
              <p className="text-xs text-gray-500 mb-1">发表年份</p>
              <p className="text-sm font-semibold text-gray-900">
                {article.year}
              </p>
            </div>
            <div className="bg-gray-50 rounded-xl p-3 text-center">
              <p className="text-xs text-gray-500 mb-1">期刊</p>
              <p className="text-sm font-semibold text-gray-900 truncate">
                {article.journal}
              </p>
            </div>
          </div>

          {article.keywords.length > 0 && (
            <div>
              <h3 className="font-bold text-gray-900 mb-2 flex items-center gap-2">
                <Tag className="w-4 h-4 text-primary-500" />
                关键词
              </h3>
              <div className="flex flex-wrap gap-2">
                {article.keywords.map((keyword, idx) => (
                  <span
                    key={idx}
                    className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-xs"
                  >
                    {keyword}
                  </span>
                ))}
              </div>
            </div>
          )}

          {article.doi && (
            <div className="pt-3 border-t border-gray-100">
              <a
                href={`https://doi.org/${article.doi}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-sm text-primary-600 hover:text-primary-700 font-medium"
              >
                <ExternalLink className="w-4 h-4" />
                查看原文 (DOI: {article.doi})
              </a>
            </div>
          )}
        </div>
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="font-bold text-gray-900 flex items-center gap-2">
            <MessageSquare className="w-5 h-5 text-primary-500" />
            评论讨论
            <span className="text-sm font-normal text-gray-500">
              ({comments.length})
            </span>
          </h3>
        </div>

        <CommentForm articleId={article.id} onSubmit={() => {}} />

        <div className="space-y-4">
          {comments.length > 0 ? (
            comments.map((comment, idx) => (
              <div
                key={comment.id}
                className="animate-slide-up"
                style={{ animationDelay: `${idx * 50}ms` }}
              >
                <CommentItem comment={comment} />
              </div>
            ))
          ) : (
            <div className="py-12 text-center bg-gray-50 rounded-2xl border-2 border-dashed border-gray-200">
              <div className="w-14 h-14 mx-auto mb-3 rounded-2xl bg-gray-100 flex items-center justify-center">
                <MessageSquare className="w-7 h-7 text-gray-400" />
              </div>
              <h4 className="font-semibold text-gray-700 mb-1">暂无评论</h4>
              <p className="text-sm text-gray-500">
                成为第一个发表评论的人吧！
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function JournalClub() {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState<CategoryFilter>("all");
  const [selectedArticle, setSelectedArticle] = useState<JournalArticle | null>(
    journalArticles[0] || null
  );

  const filteredArticles = useMemo(() => {
    return journalArticles.filter((article) => {
      const matchesCategory =
        activeCategory === "all" || article.category === activeCategory;
      const query = searchQuery.trim().toLowerCase();
      const matchesSearch =
        query === "" ||
        article.title.toLowerCase().includes(query) ||
        article.authors.some((a) => a.toLowerCase().includes(query)) ||
        article.journal.toLowerCase().includes(query) ||
        article.abstract.toLowerCase().includes(query) ||
        article.keywords.some((k) => k.toLowerCase().includes(query));
      return matchesCategory && matchesSearch;
    });
  }, [searchQuery, activeCategory]);

  const classicCount = journalArticles.filter((a) => a.category === "classic").length;
  const cuttingEdgeCount = journalArticles.filter(
    (a) => a.category === "cutting-edge"
  ).length;

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center gap-3">
        <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center shadow-lg">
          <BookOpen className="w-6 h-6 text-white" />
        </div>
        <div>
          <h1 className="text-3xl font-bold text-gray-900 font-serif">
            期刊俱乐部
          </h1>
          <p className="text-sm text-gray-500 mt-1 flex items-center gap-2">
            <Clock className="w-4 h-4" />
            每周一篇经典或前沿药理学文献，与同行一起深度讨论
          </p>
        </div>
      </div>

      <div className="bg-gradient-to-br from-violet-50 to-purple-50 rounded-2xl p-6 border border-violet-100">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-violet-500 to-purple-500 flex items-center justify-center flex-shrink-0 shadow-md">
            <Sparkles className="w-6 h-6 text-white" />
          </div>
          <div>
            <h3 className="font-bold text-gray-900 mb-2">参与方法</h3>
            <p className="text-sm text-gray-600 leading-relaxed">
              每周我们精选一篇药理学经典文献或前沿研究。阅读后，使用结构化评论模板分享你的见解：
              研究问题、方法结论、临床意义、我的疑问。通过点赞、回复和标签，与其他学习者深度交流。
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1 space-y-4">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="搜索文献标题、作者、关键词..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-5 py-3 bg-white border border-gray-200 rounded-2xl text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-400 focus:border-transparent shadow-sm transition-all"
            />
          </div>

          <div className="flex gap-2">
            {[
              { value: "all", label: "全部", count: journalArticles.length },
              { value: "classic", label: "经典文献", count: classicCount },
              {
                value: "cutting-edge",
                label: "前沿研究",
                count: cuttingEdgeCount,
              },
            ].map((filter) => (
              <button
                key={filter.value}
                onClick={() =>
                  setActiveCategory(filter.value as CategoryFilter)
                }
                className={cn(
                  "flex-1 px-3 py-2 rounded-xl text-xs font-medium transition-all duration-200",
                  activeCategory === filter.value
                    ? "bg-gradient-to-r from-primary-500 to-primary-600 text-white shadow-md"
                    : "bg-white text-gray-600 border border-gray-200 hover:border-primary-300 hover:text-primary-600"
                )}
              >
                {filter.label} ({filter.count})
              </button>
            ))}
          </div>

          <div className="space-y-3 max-h-[calc(100vh-340px)] overflow-y-auto pr-1">
            {filteredArticles.length > 0 ? (
              filteredArticles.map((article) => (
                <ArticleCard
                  key={article.id}
                  article={article}
                  isActive={selectedArticle?.id === article.id}
                  onClick={() => setSelectedArticle(article)}
                />
              ))
            ) : (
              <div className="py-12 text-center">
                <div className="w-12 h-12 mx-auto mb-3 rounded-xl bg-gray-100 flex items-center justify-center">
                  <Search className="w-6 h-6 text-gray-400" />
                </div>
                <p className="text-sm text-gray-500">未找到匹配的文献</p>
              </div>
            )}
          </div>
        </div>

        <div className="lg:col-span-2 max-h-[calc(100vh-220px)] overflow-y-auto pr-1">
          {selectedArticle ? (
            <ArticleDetail article={selectedArticle} />
          ) : (
            <div className="flex flex-col items-center justify-center py-20 bg-white rounded-2xl border border-gray-200">
              <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center mb-4">
                <BookOpen className="w-10 h-10 text-gray-400" />
              </div>
              <h3 className="text-lg font-bold text-gray-700 mb-2">选择一篇文献</h3>
              <p className="text-sm text-gray-500 text-center max-w-xs">
                从左侧列表选择一篇文献开始阅读和讨论
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
