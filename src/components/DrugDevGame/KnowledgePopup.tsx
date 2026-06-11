import { X, BookOpen } from "lucide-react";
import { GameKnowledgePopup } from "@/types";

interface KnowledgePopupProps {
  popup: GameKnowledgePopup;
  onClose: () => void;
}

export default function KnowledgePopup({ popup, onClose }: KnowledgePopupProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-lg mx-4 bg-white rounded-2xl shadow-2xl overflow-hidden animate-scale-in">
        <div className="bg-gradient-to-r from-primary-500 to-accent-500 p-6 text-white">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
                <BookOpen className="w-5 h-5" />
              </div>
              <div>
                <p className="text-sm opacity-80">{popup.category}</p>
                <h3 className="text-xl font-bold">{popup.title}</h3>
              </div>
            </div>
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center hover:bg-white/30 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        <div className="p-6 max-h-96 overflow-y-auto">
          <div className="prose prose-sm max-w-none">
            <p className="text-gray-700 leading-relaxed">{popup.content}</p>
          </div>
        </div>

        <div className="p-4 bg-gray-50 border-t border-gray-100">
          <button
            onClick={onClose}
            className="w-full py-3 bg-gradient-to-r from-primary-500 to-accent-500 text-white font-semibold rounded-xl hover:shadow-lg transition-all duration-300"
          >
            我知道了
          </button>
        </div>
      </div>
    </div>
  );
}
