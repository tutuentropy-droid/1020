import { Link, useLocation } from "react-router-dom";
import { Home, BookOpen, Pill, FileQuestion, TrendingUp, AlertTriangle, Library, BookX, Network, Calculator, ShieldAlert, Stethoscope } from "lucide-react";

const navItems = [
  { path: "/", label: "首页", icon: Home },
  { path: "/drugs", label: "药物知识库", icon: Pill },
  { path: "/knowledge-graph", label: "知识图谱", icon: Network },
  { path: "/interactions", label: "相互作用查询", icon: AlertTriangle },
  { path: "/calculators", label: "药理计算器", icon: Calculator },
  { path: "/adr-simulation", label: "ADR上报模拟", icon: ShieldAlert },
  { path: "/case-consultation", label: "病例模拟会诊", icon: Stethoscope },
  { path: "/cases", label: "典型案例库", icon: Library },
  { path: "/learn", label: "学习模块", icon: BookOpen },
  { path: "/quiz", label: "测验系统", icon: FileQuestion },
  { path: "/wrong-book", label: "错题本", icon: BookX },
  { path: "/progress", label: "我的进度", icon: TrendingUp },
];

export default function Navbar() {
  const location = useLocation();

  return (
    <nav className="bg-white/90 backdrop-blur-md border-b border-gray-100 sticky top-0 z-50 shadow-sm">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center space-x-2">
            <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-accent-500 rounded-xl flex items-center justify-center shadow-md">
              <Pill className="w-6 h-6 text-white" />
            </div>
            <span className="font-serif text-xl font-bold text-gray-800">
              你的药你知道
            </span>
          </Link>

          <div className="hidden md:flex items-center space-x-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive =
                location.pathname === item.path ||
                (item.path !== "/" && location.pathname.startsWith(item.path));
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all duration-200 ${
                    isActive
                      ? "bg-primary-50 text-primary-600 font-medium"
                      : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </div>

          <div className="md:hidden flex items-center space-x-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive =
                location.pathname === item.path ||
                (item.path !== "/" && location.pathname.startsWith(item.path));
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`p-2 rounded-lg transition-all duration-200 ${
                    isActive
                      ? "bg-primary-50 text-primary-600"
                      : "text-gray-600 hover:bg-gray-50"
                  }`}
                  title={item.label}
                >
                  <Icon className="w-5 h-5" />
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    </nav>
  );
}
