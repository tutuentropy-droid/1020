import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { Search, Pill } from "lucide-react";
import { drugs, drugCategories } from "@/data/drugs";
import DrugCard from "@/components/DrugCard";
import { cn } from "@/lib/utils";

const allCategory = "全部";

export default function DrugList() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState(allCategory);

  const filteredDrugs = useMemo(() => {
    return drugs.filter((drug) => {
      const matchesCategory =
        activeCategory === allCategory || drug.category === activeCategory;
      const matchesSearch =
        searchQuery.trim() === "" ||
        drug.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        drug.indications.some((ind) =>
          ind.toLowerCase().includes(searchQuery.toLowerCase())
        );
      return matchesCategory && matchesSearch;
    });
  }, [searchQuery, activeCategory]);

  const categories = [allCategory, ...drugCategories];

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="flex items-center gap-3">
        <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center shadow-lg">
          <Pill className="w-6 h-6 text-white" />
        </div>
        <div>
          <h1 className="text-3xl font-bold text-gray-900 font-serif">药物知识库</h1>
          <p className="text-sm text-gray-500 mt-1">
            共收录 {drugs.length} 种常用药物
          </p>
        </div>
      </div>

      <div className="relative max-w-2xl">
        <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none">
          <Search className="w-5 h-5 text-gray-400" />
        </div>
        <input
          type="text"
          placeholder="搜索药物名称或适应症..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-14 pr-5 py-4 bg-white border border-gray-200 rounded-2xl text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-400 focus:border-transparent shadow-sm transition-all"
        />
      </div>

      <div className="flex flex-wrap gap-2">
        {categories.map((category) => (
          <button
            key={category}
            onClick={() => setActiveCategory(category)}
            className={cn(
              "px-5 py-2.5 rounded-xl text-sm font-medium transition-all duration-200",
              activeCategory === category
                ? "bg-gradient-to-r from-primary-500 to-primary-600 text-white shadow-md shadow-primary-500/25"
                : "bg-white text-gray-600 border border-gray-200 hover:border-primary-300 hover:text-primary-600"
            )}
          >
            {category}
          </button>
        ))}
      </div>

      {filteredDrugs.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredDrugs.map((drug, index) => (
            <div
              key={drug.id}
              className="animate-slide-up"
              style={{ animationDelay: `${index * 50}ms` }}
            >
              <DrugCard
                drug={drug}
                onClick={() => navigate(`/drugs/${drug.id}`)}
              />
            </div>
          ))}
        </div>
      ) : (
        <div className="py-20 text-center">
          <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gray-100 flex items-center justify-center">
            <Search className="w-8 h-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-semibold text-gray-700 mb-2">未找到相关药物</h3>
          <p className="text-sm text-gray-500">
            试试更换关键词或选择其他分类
          </p>
        </div>
      )}
    </div>
  );
}
