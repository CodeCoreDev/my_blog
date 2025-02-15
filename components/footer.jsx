// components/footer.jsx

import Link from "next/link";
import { Mail, Github, Linkedin } from "lucide-react";

export function Footer() {
  return (
    <footer className="mt-16 pt-16 pb-12 sm:pt-24 sm:pb-16 border-t border-slate-200 dark:border-slate-700">
      <div className="max-w-6xl mx-auto px-4 space-y-8">
        {/* Горизонтальная строка с контактами и соцсетями */}
        <div className="flex justify-between items-center flex-wrap gap-4">
          {/* Email */}
          <div className="flex items-center gap-2">
            <Mail className="w-5 h-5 text-slate-500" />
            <a
              href="mailto:r.y.volkov@gmail.com"
              className="hover:text-blue-600 text-sm"
            >
              r.y.volkov@gmail.com
            </a>
          </div>

          {/* Социальные сети */}
          <div className="flex items-center gap-3">
            <a
              href="https://github.com/your-username"
              target="_blank"
              rel="noopener"
              className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg"
            >
              <Github className="w-6 h-6" />
            </a>
            <a
              href="https://www.linkedin.com/in/your-profile"
              target="_blank"
              rel="noopener"
              className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg"
            >
              <Linkedin className="w-6 h-6" />
            </a>
          </div>
        </div>

        {/* Копирайт справа */}
        <div className="flex justify-end">
          <span className="text-sm text-slate-500 dark:text-slate-400">
            Copyright &copy; {new Date().getFullYear()}
          </span>
        </div>
      </div>
    </footer>
  );
}
