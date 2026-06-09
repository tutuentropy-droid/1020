import { Pill, Heart, Mail, Github } from "lucide-react";
import { Link } from "react-router-dom";
import Navbar from "./Navbar";

interface LayoutProps {
  children: React.ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-gray-50 via-white to-primary-50/30">
      <Navbar />

      <main className="flex-1">
        <div className="container mx-auto px-4 py-8">
          {children}
        </div>
      </main>

      <footer className="bg-white border-t border-gray-100 mt-auto">
        <div className="container mx-auto px-4 py-10">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-accent-500 rounded-xl flex items-center justify-center shadow-md">
                  <Pill className="w-5 h-5 text-white" />
                </div>
                <span className="font-serif text-xl font-bold text-gray-800">
                  你的药你知道
                </span>
              </div>
              <p className="text-sm text-gray-500 leading-relaxed">
                专业的药理学学习平台，帮助你系统掌握常用药物知识，
                提升临床用药素养。
              </p>
            </div>

            <div className="space-y-4">
              <h4 className="font-semibold text-gray-800">快速链接</h4>
              <ul className="space-y-2 text-sm text-gray-500">
                <li>
                  <Link to="/drugs" className="hover:text-primary-600 transition-colors">
                    药物知识库
                  </Link>
                </li>
                <li>
                  <Link to="/learn" className="hover:text-primary-600 transition-colors">
                    学习模块
                  </Link>
                </li>
                <li>
                  <Link to="/quiz" className="hover:text-primary-600 transition-colors">
                    测验系统
                  </Link>
                </li>
                <li>
                  <Link to="/progress" className="hover:text-primary-600 transition-colors">
                    学习进度
                  </Link>
                </li>
              </ul>
            </div>

            <div className="space-y-4">
              <h4 className="font-semibold text-gray-800">联系我们</h4>
              <div className="space-y-3">
                <div className="flex items-center gap-2 text-sm text-gray-500">
                  <Mail className="w-4 h-4 text-primary-500" />
                  <span>support@yaowuzhidao.com</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-500">
                  <Heart className="w-4 h-4 text-rose-500" />
                  <span>用心做医学教育</span>
                </div>
                <div className="flex items-center gap-3 pt-2">
                  <a
                    href="#"
                    className="w-9 h-9 rounded-lg bg-gray-100 flex items-center justify-center text-gray-500 hover:bg-primary-50 hover:text-primary-600 transition-colors"
                  >
                    <Github className="w-4 h-4" />
                  </a>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-10 pt-6 border-t border-gray-100 flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-xs text-gray-400">
              © {new Date().getFullYear()} 你的药你知道. 仅供学习参考，不作为临床用药依据。
            </p>
            <div className="flex items-center gap-4 text-xs text-gray-400">
              <span className="hover:text-primary-600 transition-colors cursor-pointer">
                隐私政策
              </span>
              <span className="hover:text-primary-600 transition-colors cursor-pointer">
                使用条款
              </span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
