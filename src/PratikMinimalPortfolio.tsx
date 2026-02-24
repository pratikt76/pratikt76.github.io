import React, { Fragment, useState, useEffect, useRef } from 'react';
import { ArrowUpRight, Github, Linkedin, Mail, FileText, MapPin, Briefcase, GraduationCap, Sun, Moon, Phone, ExternalLink, Instagram } from 'lucide-react';
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion';
import Footer from "./Footer";
import SpotifyRecentlyPlayed from "./SpotifyRecentlyPlayed";

/* ─── Data ─── */
const greetings = [
    'hey', 'hola', 'hallo', 'hi', 'yo', 'sup', 'ciao', 'namaste',
    'bonjour', 'olá', 'guten tag', 'konnichiwa', 'ni hao', 'annyeong',
    'ssup', 'ahoy', 'aloha', 'howdy', 'gday'
];

const ABOUT_ITEMS = [
    {
        icon: <GraduationCap className="w-4 h-4" />,
        text: (
            <>
                <span className="font-medium text-zinc-800 dark:text-zinc-200">College of Engineering Pune</span> — Electronics & Telecommunication
            </>
        ),
    },
    {
        icon: <Briefcase className="w-4 h-4" />,
        text: (
            <>
                SDE <span className="font-medium text-zinc-800 dark:text-zinc-200">@Bajaj Finserv</span> — building backend systems that actually stay up
            </>
        ),
    },
    {
        icon: <MapPin className="w-4 h-4" />,
        text: <>Based in <span className="font-medium text-zinc-800 dark:text-zinc-200">Pune, India</span></>,
    },
];

const INTERESTS = [
    { emoji: '🏎️', label: 'F1 Strategy', color: 'from-red-500/20 to-red-500/5' },
    { emoji: '🏏', label: 'Cricket', color: 'from-green-500/20 to-green-500/5' },
    { emoji: '🍿', label: 'Cinema', color: 'from-yellow-500/20 to-yellow-500/5', href: 'https://app.tvtime.com/user/51516957' },
    { emoji: <Instagram className="w-4 h-4" />, label: 'Instagram', color: 'from-purple-500/20 to-purple-500/5', href: 'https://instagram.com/pratik.76' },
];

const PROJECTS = [
    {
        title: "Parkin",
        desc: "Smart parking management system — optimizing slot allocation and availability tracking.",
        tags: ["Java", "Spring Boot", "REST API"],
        github: "https://github.com/pratikt76/Parkin",
        demo: "https://github.com/pratikt76/Parkin/blob/main/README.md",
    },
    {
        title: "VelocityCSS",
        desc: "Lightweight CSS utility framework — faster styling without unnecessary bloat.",
        tags: ["CSS", "JavaScript", "Framework"],
        github: "https://github.com/pratikt76/VelocityCSS",
        demo: "https://pratikt76.github.io/VelocityCSS/",
    },
];

const LINKS = [
    { label: 'GitHub', href: 'https://github.com/pratikt76', icon: <Github className="w-4 h-4" /> },
    { label: 'LinkedIn', href: 'https://linkedin.com/in/pratikt76', icon: <Linkedin className="w-4 h-4" /> },
    { label: 'Email', href: 'mailto:psthombare03@gmail.com', icon: <Mail className="w-4 h-4" /> },
    { label: 'Resume', href: 'https://usflwosegyavcshohacz.supabase.co/storage/v1/object/public/Pratik_Thombare_Resume/Pratik_Thombare.pdf', icon: <FileText className="w-4 h-4" /> },
];

/* ─── Hooks ─── */
const useEpochTime = () => {
    const [epoch, setEpoch] = useState(() => Math.floor(Date.now() / 1000));
    useEffect(() => {
        const interval = setInterval(() => setEpoch(Math.floor(Date.now() / 1000)), 1000);
        return () => clearInterval(interval);
    }, []);
    return epoch;
};

const useMousePosition = () => {
    const [pos, setPos] = useState({ x: 0, y: 0 });
    useEffect(() => {
        const handler = (e: MouseEvent) => setPos({ x: e.clientX, y: e.clientY });
        window.addEventListener("mousemove", handler);
        return () => window.removeEventListener("mousemove", handler);
    }, []);
    return pos;
};

const useTheme = () => {
    const [isDark, setIsDark] = useState(() => {
        if (typeof window === 'undefined') return true;
        const saved = localStorage.getItem('theme');
        if (saved) return saved === 'dark';
        return window.matchMedia('(prefers-color-scheme: dark)').matches;
    });

    useEffect(() => {
        const root = document.documentElement;
        if (isDark) {
            root.classList.add('dark');
        } else {
            root.classList.remove('dark');
        }
        localStorage.setItem('theme', isDark ? 'dark' : 'light');
    }, [isDark]);

    return { isDark, toggle: () => setIsDark((prev) => !prev) };
};

/* ─── Section heading ─── */
function SectionHeading({ label }: { label: string }) {
    return (
        <div className="flex items-center gap-4 mb-10">
            <span className="text-[10px] font-bold tracking-[0.25em] uppercase text-zinc-400 dark:text-zinc-600 shrink-0">{label}</span>
            <span className="h-px flex-1 bg-gradient-to-r from-zinc-300 dark:from-zinc-800 to-transparent" />
        </div>
    );
}

/* ─── Theme toggle button ─── */
function ThemeToggle({ isDark, toggle }: { isDark: boolean; toggle: () => void }) {
    return (
        <button
            onClick={toggle}
            className="p-2 rounded-lg text-zinc-500 hover:text-zinc-900 dark:hover:text-white hover:bg-black/[0.06] dark:hover:bg-white/[0.06] transition-all duration-200"
            title={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
            aria-label="Toggle theme"
        >
            <AnimatePresence mode="wait" initial={false}>
                <motion.span
                    key={isDark ? 'moon' : 'sun'}
                    initial={{ opacity: 0, rotate: -90, scale: 0 }}
                    animate={{ opacity: 1, rotate: 0, scale: 1 }}
                    exit={{ opacity: 0, rotate: 90, scale: 0 }}
                    transition={{ duration: 0.2 }}
                    className="block"
                >
                    {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
                </motion.span>
            </AnimatePresence>
        </button>
    );
}

/* ─── Main ─── */
export default function PratikMinimalPortfolio(): JSX.Element {
    const [greeting, setGreeting] = useState(greetings[0]);
    const [isTimeHovered, setIsTimeHovered] = useState(false);
    const epochTime = useEpochTime();
    const { x, y } = useMousePosition();
    const { isDark, toggle } = useTheme();
    const heroRef = useRef<HTMLDivElement>(null);
    const { scrollYProgress } = useScroll();
    const heroOpacity = useTransform(scrollYProgress, [0, 0.15], [1, 0]);
    const heroScale = useTransform(scrollYProgress, [0, 0.15], [1, 0.97]);

    useEffect(() => {
        setGreeting(greetings[Math.floor(Math.random() * greetings.length)]);
    }, []);

    const container = {
        hidden: { opacity: 0 },
        show: { opacity: 1, transition: { staggerChildren: 0.08, delayChildren: 0.1 } },
    };

    const fadeUp = {
        hidden: { opacity: 0, y: 20 },
        show: { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.25, 0.4, 0.25, 1] as [number, number, number, number] } },
    };

    return (
        <Fragment>
            <main className="min-h-screen relative overflow-hidden transition-colors duration-300 bg-[#fafafa] dark:bg-[#030303] text-zinc-900 dark:text-zinc-100 selection:bg-blue-500/30 selection:text-white">

                {/* Ambient glow (dark mode only) */}
                <div
                    className="fixed inset-0 pointer-events-none z-0 transition-opacity duration-700 opacity-0 dark:opacity-100"
                    style={{
                        background: `
                            radial-gradient(800px circle at ${x}px ${y}px, rgba(59, 130, 246, 0.06), transparent 60%),
                            radial-gradient(600px circle at ${x * 0.5}px ${y * 0.5}px, rgba(139, 92, 246, 0.04), transparent 60%)
                        `,
                    }}
                />

                {/* Light mode subtle glow */}
                <div
                    className="fixed inset-0 pointer-events-none z-0 transition-opacity duration-700 opacity-100 dark:opacity-0"
                    style={{
                        background: `radial-gradient(800px circle at ${x}px ${y}px, rgba(59, 130, 246, 0.04), transparent 60%)`,
                    }}
                />

                {/* Grain overlay (dark only) */}
                <div className="fixed inset-0 pointer-events-none z-[1] opacity-0 dark:opacity-[0.015]"
                    style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 256 256\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'noise\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.9\' numOctaves=\'4\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23noise)\'/%3E%3C/svg%3E")' }}
                />

                {/* Navbar */}
                <motion.nav
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.3 }}
                    className="fixed top-0 left-0 right-0 z-50 backdrop-blur-xl bg-white/80 dark:bg-[#030303]/70 border-b border-black/[0.06] dark:border-white/[0.04] transition-colors duration-300"
                >
                    <div className="max-w-5xl mx-auto px-6 h-14 flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <div
                                onMouseEnter={() => setIsTimeHovered(true)}
                                onMouseLeave={() => setIsTimeHovered(false)}
                                className="text-sm font-mono font-semibold tracking-tight tabular-nums inline-flex items-center overflow-hidden h-5 cursor-pointer text-zinc-500 dark:text-zinc-400"
                                title={isTimeHovered ? "Current Local Time" : "Current Unix Epoch Time"}
                            >
                                <AnimatePresence mode="wait" initial={false}>
                                    {isTimeHovered ? (
                                        <motion.span
                                            key="realtime"
                                            initial={{ y: 20, opacity: 0 }}
                                            animate={{ y: 0, opacity: 1 }}
                                            exit={{ y: -20, opacity: 0 }}
                                            transition={{ duration: 0.2 }}
                                        >
                                            {new Date(epochTime * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true })}
                                        </motion.span>
                                    ) : (
                                        <motion.a
                                            key="epoch"
                                            href="https://www.epochconverter.com/"
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            initial={{ y: -20, opacity: 0 }}
                                            animate={{ y: 0, opacity: 1 }}
                                            exit={{ y: 20, opacity: 0 }}
                                            transition={{ duration: 0.2 }}
                                            className="flex items-center"
                                        >
                                            <span className="text-blue-500 dark:text-blue-400 opacity-70">$</span>
                                            <span>{String(epochTime).slice(0, -1)}</span>
                                            <div className="relative w-[1ch] h-5 overflow-hidden flex flex-col items-center">
                                                <AnimatePresence mode="popLayout" initial={false}>
                                                    <motion.span
                                                        key={epochTime}
                                                        initial={{ y: 20 }}
                                                        animate={{ y: 0 }}
                                                        exit={{ y: -20 }}
                                                        transition={{ duration: 0.25, ease: 'easeOut' }}
                                                        className="absolute inset-0 flex items-center justify-center text-center w-full h-full"
                                                    >
                                                        {String(epochTime).slice(-1)}
                                                    </motion.span>
                                                </AnimatePresence>
                                            </div>
                                        </motion.a>
                                    )}
                                </AnimatePresence>
                            </div>
                        </div>
                        <div className="flex items-center gap-1">
                            {LINKS.map((l) => (
                                <a
                                    key={l.label}
                                    href={l.href}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="p-2 rounded-lg text-zinc-400 dark:text-zinc-500 hover:text-zinc-900 dark:hover:text-white hover:bg-black/[0.06] dark:hover:bg-white/[0.06] transition-all duration-200"
                                    title={l.label}
                                >
                                    {l.icon}
                                </a>
                            ))}
                            <div className="w-px h-5 bg-zinc-200 dark:bg-zinc-800 mx-1" />
                            <ThemeToggle isDark={isDark} toggle={toggle} />
                        </div>
                    </div>
                </motion.nav>

                <motion.div
                    variants={container}
                    initial="hidden"
                    animate="show"
                    className="max-w-5xl mx-auto px-6 pt-28 sm:pt-36 pb-20 relative z-10"
                >
                    {/* ── Hero ── */}
                    <motion.div ref={heroRef} style={{ opacity: heroOpacity, scale: heroScale }}>
                        <motion.header variants={fadeUp} className="mb-20">
                            {/* Role badge */}
                            <motion.div
                                variants={fadeUp}
                                className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-black/[0.04] dark:bg-white/[0.04] border border-black/[0.08] dark:border-white/[0.08] mb-8 transition-colors duration-300"
                            >
                                <span className="relative flex h-1.5 w-1.5">
                                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                                    <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-500" />
                                </span>
                                <span className="text-[11px] font-semibold tracking-[0.15em] uppercase text-zinc-500 dark:text-zinc-400">
                                    Open to opportunities
                                </span>
                            </motion.div>

                            {/* Name */}
                            <h1 className="mb-6">
                                <motion.span
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ duration: 0.6, delay: 0.2 }}
                                    className="block text-lg sm:text-xl text-zinc-400 dark:text-zinc-500 font-medium mb-3 tracking-wide"
                                >
                                    {greeting}, i'm
                                </motion.span>
                                <motion.span
                                    initial={{ opacity: 0, y: 30 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.8, delay: 0.4, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] }}
                                    className="block text-6xl sm:text-8xl lg:text-9xl font-extrabold tracking-tighter leading-none"
                                >
                                    <span className="relative">
                                        <span className="bg-gradient-to-r from-zinc-900 via-blue-800 to-blue-500 dark:from-white dark:via-blue-100 dark:to-blue-400 bg-clip-text text-transparent">
                                            Pratik
                                        </span>
                                        <motion.span
                                            initial={{ scaleX: 0 }}
                                            animate={{ scaleX: 1 }}
                                            transition={{ duration: 0.8, delay: 1.2, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] }}
                                            className="absolute -bottom-2 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full origin-left"
                                        />
                                    </span>
                                    <span className="text-zinc-300 dark:text-zinc-700">.</span>
                                </motion.span>
                            </h1>

                            {/* Subtitle */}
                            <motion.p
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ duration: 0.8, delay: 0.8 }}
                                className="text-base sm:text-lg text-zinc-500 max-w-lg leading-relaxed"
                            >
                                Crafting <span className="text-zinc-700 dark:text-zinc-300 font-medium">backend systems</span> with
                                Spring Boot & Java — with a touch of
                                frontend know-how<span className="animate-pulse text-blue-500 dark:text-blue-400">_</span>
                            </motion.p>
                        </motion.header>
                    </motion.div>

                    {/* ── About ── */}
                    <motion.section variants={fadeUp}>
                        <SectionHeading label="01 — About" />
                        <div className="space-y-3 mb-10">
                            {ABOUT_ITEMS.map((item, i) => (
                                <motion.div
                                    key={i}
                                    variants={fadeUp}
                                    className="flex items-start gap-3 p-3 rounded-xl hover:bg-black/[0.03] dark:hover:bg-white/[0.02] transition-colors group"
                                >
                                    <span className="mt-0.5 text-zinc-400 dark:text-zinc-600 group-hover:text-blue-500 dark:group-hover:text-blue-400 transition-colors shrink-0">
                                        {item.icon}
                                    </span>
                                    <span className="text-zinc-500 dark:text-zinc-400 text-[15px] leading-relaxed">{item.text}</span>
                                </motion.div>
                            ))}
                        </div>

                        {/* Interest pills */}
                        <div className="flex flex-wrap gap-2.5">
                            {INTERESTS.map((item) => {
                                const pill = (
                                    <motion.span
                                        key={item.label}
                                        whileHover={{ scale: 1.05, y: -2 }}
                                        className={`inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r ${item.color} border border-black/[0.06] dark:border-white/[0.06] text-sm text-zinc-600 dark:text-zinc-300 cursor-default select-none backdrop-blur-sm transition-colors hover:border-black/[0.12] dark:hover:border-white/[0.12]`}
                                    >
                                        <span className="text-base">{item.emoji}</span>
                                        {item.label}
                                        {item.href && <ArrowUpRight className="w-3 h-3 text-zinc-400 dark:text-zinc-500" />}
                                    </motion.span>
                                );
                                return item.href ? (
                                    <a key={item.label} href={item.href} target="_blank" rel="noopener noreferrer">
                                        {pill}
                                    </a>
                                ) : pill;
                            })}
                        </div>
                    </motion.section>

                    <div className="my-20" />

                    {/* ── Projects ── */}
                    <motion.section variants={fadeUp}>
                        <SectionHeading label="02 — Work" />
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                            {PROJECTS.map((proj) => (
                                <motion.article
                                    key={proj.title}
                                    whileHover={{ y: -4 }}
                                    className="group relative bg-black/[0.02] dark:bg-white/[0.02] border border-black/[0.06] dark:border-white/[0.06] rounded-2xl p-7 hover:bg-black/[0.04] dark:hover:bg-white/[0.04] hover:border-black/[0.12] dark:hover:border-white/[0.12] transition-all duration-500"
                                >
                                    {/* Glow on hover */}
                                    <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-blue-500/[0.05] to-purple-500/[0.05] opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                                    <div className="relative z-10">
                                        <div className="flex justify-between items-start mb-3">
                                            <h3 className="text-lg font-semibold transition-colors text-zinc-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-300">
                                                {proj.title}
                                            </h3>
                                            <div className="flex gap-2">
                                                <div className="flex gap-2">
                                                    <a
                                                        href={proj.github}
                                                        target="_blank"
                                                        rel="noreferrer"
                                                        className="p-1.5 rounded-lg text-zinc-400 dark:text-zinc-600 hover:text-zinc-900 dark:hover:text-white hover:bg-black/[0.06] dark:hover:bg-white/[0.08] transition-all"
                                                    >
                                                        <Github className="w-4 h-4" />
                                                    </a>
                                                    <a
                                                        href={proj.demo}
                                                        target="_blank"
                                                        rel="noreferrer"
                                                        className="p-1.5 rounded-lg text-zinc-400 dark:text-zinc-600 hover:text-zinc-900 dark:hover:text-white hover:bg-black/[0.06] dark:hover:bg-white/[0.08] transition-all"
                                                    >
                                                        <ArrowUpRight className="w-4 h-4" />
                                                    </a>
                                                </div>
                                            </div>
                                        </div>
                                        <p className="text-sm leading-relaxed mb-5 text-zinc-500">{proj.desc}</p>
                                        <div className="flex flex-wrap gap-1.5">
                                            {proj.tags.map((tag) => (
                                                <span
                                                    key={tag}
                                                    className="px-2.5 py-0.5 text-[11px] font-medium tracking-wide uppercase rounded-md border transition-colors bg-black/[0.04] dark:bg-white/[0.04] text-zinc-500 border-black/[0.06] dark:border-white/[0.05]"
                                                >
                                                    {tag}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                </motion.article>
                            ))}
                        </div>
                    </motion.section>

                    <div className="my-20" />

                    {/* ── Spotify ── */}
                    <motion.section variants={fadeUp}>
                        <SectionHeading label="03 — Vibes" />
                        <SpotifyRecentlyPlayed />
                    </motion.section>

                    <div className="my-20" />

                    {/* ── Connect ── */}
                    <motion.section variants={fadeUp}>
                        <SectionHeading label="04 — Connect" />
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                            {/* Left — Map */}
                            <motion.div
                                whileHover={{ y: -2 }}
                                className="relative rounded-2xl overflow-hidden border border-black/[0.06] dark:border-white/[0.06] hover:border-black/[0.12] dark:hover:border-white/[0.12] transition-all duration-500 group"
                            >
                                <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-blue-500/[0.05] to-purple-500/[0.05] opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-10 pointer-events-none" />
                                <iframe
                                    title="Location — Pune, India"
                                    src="https://maps.google.com/maps?q=18.56308,73.90906&z=15&output=embed"
                                    className="w-full h-52 lg:h-full min-h-[220px] transition-all duration-700"
                                    style={{ border: 0, filter: 'invert(90%) hue-rotate(180deg)' }}
                                    allowFullScreen
                                    loading="lazy"
                                    referrerPolicy="no-referrer-when-downgrade"
                                />
                                <div className="absolute bottom-3 left-3 z-20 flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/90 dark:bg-zinc-900/90 backdrop-blur-sm border border-black/[0.08] dark:border-white/[0.08] shadow-lg">
                                    <MapPin className="w-3.5 h-3.5 text-blue-500" />
                                    <span className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">Pune, India</span>
                                </div>
                            </motion.div>

                            {/* Right — Contact info + Links */}
                            <div className="flex flex-col gap-4">
                                {/* Phone */}
                                <motion.a
                                    href="tel:+918411069640"
                                    whileHover={{ y: -3, scale: 1.02 }}
                                    className="group flex items-center gap-4 p-5 rounded-2xl bg-black/[0.02] dark:bg-white/[0.02] border border-black/[0.06] dark:border-white/[0.06] hover:bg-black/[0.05] dark:hover:bg-white/[0.05] hover:border-black/[0.12] dark:hover:border-white/[0.12] transition-all duration-300"
                                >
                                    <span className="flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500/20 to-emerald-500/5 border border-emerald-500/10 text-emerald-500 group-hover:scale-110 transition-transform duration-300">
                                        <Phone className="w-4 h-4" />
                                    </span>
                                    <div className="flex flex-col">
                                        <span className="text-[10px] font-bold tracking-[0.2em] uppercase text-zinc-400 dark:text-zinc-600">Phone</span>
                                        <span className="text-sm font-medium text-zinc-700 dark:text-zinc-300 group-hover:text-zinc-900 dark:group-hover:text-white transition-colors">+91 84110 69640</span>
                                    </div>
                                    <ExternalLink className="w-3.5 h-3.5 text-zinc-300 dark:text-zinc-700 ml-auto group-hover:text-zinc-500 dark:group-hover:text-zinc-400 transition-colors" />
                                </motion.a>

                                {/* Links grid */}
                                <div className="grid grid-cols-2 gap-3 flex-1">
                                    {LINKS.map((l) => (
                                        <motion.a
                                            key={l.label}
                                            href={l.href}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            whileHover={{ y: -3, scale: 1.02 }}
                                            className="group flex flex-col items-center justify-center gap-3 p-5 rounded-2xl bg-black/[0.02] dark:bg-white/[0.02] border border-black/[0.06] dark:border-white/[0.06] hover:bg-black/[0.05] dark:hover:bg-white/[0.05] hover:border-black/[0.12] dark:hover:border-white/[0.12] transition-all duration-300"
                                        >
                                            <span className="text-zinc-400 dark:text-zinc-500 group-hover:text-zinc-900 dark:group-hover:text-white transition-colors">
                                                {l.icon}
                                            </span>
                                            <span className="text-xs font-bold tracking-[0.15em] uppercase text-zinc-400 dark:text-zinc-600 group-hover:text-zinc-700 dark:group-hover:text-zinc-300 transition-colors">
                                                {l.label}
                                            </span>
                                        </motion.a>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </motion.section>

                    <motion.div variants={fadeUp}>
                        <Footer />
                    </motion.div>
                </motion.div>
            </main>
        </Fragment>
    );
}
