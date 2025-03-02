import Link from "next/link";
import { Mail, Github, Send } from "lucide-react";

export function Footer() {
  return (
    <footer className="mt-24 pb-12 border-t border-slate-200 dark:border-slate-700">
      <div className="max-w-7xl mx-auto px-4 xl:px-0">
        <div className="flex flex-col lg:flex-row justify-between gap-8 lg:gap-16 py-12">
          {/* Contact info */}
          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400">
              <Mail className="w-6 h-6" />
              <a
                href="mailto:r.y.volkov@gmail.com"
                className="hover:text-blue-600 transition-colors"
              >
                r.y.volkov@gmail.com
              </a>
            </div>
          </div>

          {/* Social links */}
          <div className="flex gap-4">
            <a
              href="https://github.com/codecoredev"
              target="_blank"
              rel="noopener noreferrer"
              className="w-12 h-12 rounded-full flex items-center justify-center bg-white dark:bg-slate-900 
                         hover:bg-slate-50 dark:hover:bg-slate-800 transition-all"
            >
              <Github className="w-6 h-6 text-slate-900 dark:text-slate-200" />
            </a>
            <a
              href="https://t.me/code_core_dev"
              target="_blank"
              rel="noopener noreferrer"
              className="w-12 h-12 rounded-full flex items-center justify-center bg-white dark:bg-slate-900
                         hover:bg-green-500 dark:hover:bg-green-600 transition-all"
            >
              <Send className="w-6 h-6 text-slate-900 dark:text-slate-200 hover:text-white transition-colors" />
            </a>
          </div>

          {/* Copyright */}
          <div className="text-sm text-slate-500 dark:text-slate-400">
            Разработано на Next.js &copy; {new Date().getFullYear()}
          </div>
        </div>
      </div>
    </footer>
  );
}
