import { Link } from "react-router-dom";


export default function Footer() {
  return (
    <footer className="mt-16 text-sm text-zinc-500 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 py-8 border-t border-black/[0.05] dark:border-white/[0.05]">
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
      <p className="text-zinc-400 dark:text-zinc-600">
        © {new Date().getFullYear()} Pratik Thombare
      </p>
    </footer>
  );
}
