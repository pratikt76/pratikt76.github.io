import { Link } from "react-router-dom";


export default function Footer() {
  return (
    <footer className="mt-16 pt-8 pb-8">
      {/* Gradient divider */}
      <div className="h-px w-full bg-gradient-to-r from-transparent via-zinc-300 dark:via-zinc-700 to-transparent mb-8" />

      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 text-sm text-zinc-500">
        <div className="flex flex-wrap items-center gap-x-6 gap-y-2">
          <a
            href="https://pratikt76.github.io/FlagMaster/"
            className="hover:text-zinc-700 dark:hover:text-zinc-300 transition-colors"
            target="_blank"
            rel="noopener noreferrer"
          >
            Play FlagMaster 🎯
          </a>
          <Link to="/notes" className="hover:text-zinc-700 dark:hover:text-zinc-300 transition-colors">
            Vault 🔒
          </Link>
        </div>
        <div className="flex flex-col sm:items-end gap-1">
          <p className="text-zinc-400 dark:text-zinc-600">
            © {new Date().getFullYear()} Pratik Thombare
          </p>
          <p className="text-[11px] text-zinc-300 dark:text-zinc-800">
            Built with React & ☕
          </p>
        </div>
      </div>
    </footer>
  );
}

