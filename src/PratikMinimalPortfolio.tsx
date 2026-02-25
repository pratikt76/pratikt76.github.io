import React, { Fragment, useState, useEffect, useRef } from 'react';
import { ArrowUpRight, Github, Linkedin, Mail, FileText, MapPin, Sun, Moon, Phone, ExternalLink, Calendar, ChevronDown, Code2, Database, Cloud, Lightbulb, Layers } from 'lucide-react';
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion';
import Footer from "./Footer";
import SpotifyRecentlyPlayed from "./SpotifyRecentlyPlayed";
import ContactModal from "./ContactModal";

/* ─── Data ─── */
const greetings = [
    'hey', 'hola', 'hallo', 'hi', 'yo', 'sup', 'ciao', 'namaste',
    'bonjour', 'olá', 'guten tag', 'konnichiwa', 'ni hao', 'annyeong',
    'ssup', 'ahoy', 'aloha', 'howdy', 'gday'
];


const EXPERIENCE = [
    {
        date: 'Jul 2024 — Present',
        role: 'Software Developer',
        company: 'Bajaj Finserv',
        type: 'Full-time',
        location: 'Pune, Maharashtra · On-site',
        description: 'Building & maintaining high-availability backend systems powering financial services at scale.',
        tags: ['Java', 'Spring Boot', 'Microservices', 'REST API', 'PostgreSQL', 'Redis', 'Docker', 'Kafka', 'Git'],
        highlight: true,
    },
    {
        date: 'Jan 2024 — Jun 2024',
        role: 'SDE Intern',
        company: 'Bajaj Finserv',
        type: 'Internship',
        location: 'Pune, Maharashtra · On-site',
        description: 'Worked on backend development and API integrations for internal tools and financial products.',
        tags: ['Java', 'Spring Boot', 'REST API', 'SQL'],
        highlight: false,
    },
    {
        date: '2020 — 2024',
        role: 'BTech — Electronics & Telecommunication',
        company: 'College of Engineering Pune (COEP)',
        type: 'Education',
        location: 'Pune, Maharashtra',
        description: 'Focused on software engineering, data structures, and system design. Built multiple full-stack projects and contributed to open-source.',
        tags: ['DSA', 'Embedded Systems', 'Full-Stack', 'Open Source'],
        highlight: false,
    },
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

const LINKS: { label: string; href: string; icon: JSX.Element; isContact?: boolean }[] = [
    { label: 'GitHub', href: 'https://github.com/pratikt76', icon: <Github className="w-4 h-4" /> },
    { label: 'LinkedIn', href: 'https://linkedin.com/in/pratikt76', icon: <Linkedin className="w-4 h-4" /> },
    { label: 'Email', href: '#contact', icon: <Mail className="w-4 h-4" />, isContact: true },
    { label: 'Resume', href: 'https://drive.google.com/file/d/1VLOhNIh_EFSARD6z6wfiM8OpADZmWSq3/view?usp=sharing', icon: <FileText className="w-4 h-4" /> },
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
    const [isContactOpen, setIsContactOpen] = useState(false);
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
                                l.isContact ? (
                                    <button
                                        key={l.label}
                                        onClick={() => setIsContactOpen(true)}
                                        className="p-2 rounded-lg text-zinc-400 dark:text-zinc-500 hover:text-zinc-900 dark:hover:text-white hover:bg-black/[0.06] dark:hover:bg-white/[0.06] transition-all duration-200"
                                        title={l.label}
                                    >
                                        {l.icon}
                                    </button>
                                ) : (
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
                                )
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

                            {/* Role title */}
                            <motion.div
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.6, delay: 0.7 }}
                                className="flex items-center gap-3 mb-5"
                            >
                                <span className="text-sm sm:text-base font-medium text-zinc-600 dark:text-zinc-400">
                                    Software Developer
                                </span>
                                <span className="text-zinc-300 dark:text-zinc-700">@</span>
                                <span className="text-sm sm:text-base font-semibold bg-gradient-to-r from-blue-600 to-blue-500 dark:from-blue-400 dark:to-blue-300 bg-clip-text text-transparent">
                                    Bajaj Finserv
                                </span>
                            </motion.div>

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

                            {/* Scroll indicator */}
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ duration: 0.6, delay: 1.4 }}
                                className="mt-14 flex flex-col items-center gap-1"
                            >
                                <span className="text-[9px] font-bold tracking-[0.3em] uppercase text-zinc-300 dark:text-zinc-700">scroll</span>
                                <motion.div
                                    animate={{ y: [0, 6, 0] }}
                                    transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
                                >
                                    <ChevronDown className="w-4 h-4 text-zinc-300 dark:text-zinc-700" />
                                </motion.div>
                            </motion.div>
                        </motion.header>
                    </motion.div>

                    {/* ── Experience ── */}
                    <motion.section variants={fadeUp}>
                        <SectionHeading label="01 — Journey" />
                        <div className="relative">
                            {/* Vertical timeline line */}
                            <div className="absolute left-[7px] sm:left-[9px] top-3 bottom-3 w-px bg-gradient-to-b from-blue-500/40 via-zinc-300 dark:via-zinc-700 to-transparent" />

                            <div className="space-y-10">
                                {EXPERIENCE.map((exp, i) => (
                                    <motion.div
                                        key={i}
                                        initial={{ opacity: 0, x: -20 }}
                                        whileInView={{ opacity: 1, x: 0 }}
                                        viewport={{ once: true, margin: '-50px' }}
                                        transition={{ duration: 0.6, delay: i * 0.15, ease: [0.25, 0.4, 0.25, 1] }}
                                        className="relative pl-8 sm:pl-10 group"
                                    >
                                        {/* Timeline dot */}
                                        <div className={`absolute left-0 top-1.5 w-[15px] h-[15px] sm:w-[19px] sm:h-[19px] rounded-full border-2 transition-colors duration-300
                                            ${exp.highlight
                                                ? 'border-blue-500 bg-blue-500/20 group-hover:bg-blue-500/40 shadow-[0_0_12px_rgba(59,130,246,0.3)]'
                                                : 'border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 group-hover:border-zinc-400 dark:group-hover:border-zinc-500'
                                            }`}
                                        >
                                            {exp.highlight && (
                                                <span className="absolute inset-0 rounded-full animate-ping bg-blue-500/30" />
                                            )}
                                        </div>

                                        {/* Content card */}
                                        <div className={`p-6 sm:p-7 rounded-2xl border transition-all duration-500 group-hover:shadow-lg group-hover:backdrop-blur-sm
                                            ${exp.highlight
                                                ? 'bg-gradient-to-br from-blue-500/[0.06] to-purple-500/[0.04] border-blue-500/15 dark:border-blue-500/15 group-hover:border-blue-500/30 group-hover:shadow-blue-500/10'
                                                : 'bg-black/[0.02] dark:bg-white/[0.02] border-black/[0.06] dark:border-white/[0.06] group-hover:border-black/[0.12] dark:group-hover:border-white/[0.12]'
                                            }`}
                                        >
                                            {/* Header row */}
                                            <div className="flex flex-wrap items-center gap-2 mb-3">
                                                <Calendar className="w-3.5 h-3.5 text-zinc-400 dark:text-zinc-500" />
                                                <span className="text-[11px] font-bold tracking-[0.15em] uppercase text-zinc-400 dark:text-zinc-500">
                                                    {exp.date}
                                                </span>
                                                <span className="text-zinc-300 dark:text-zinc-700">·</span>
                                                <span className={`text-[10px] font-bold tracking-wider uppercase px-2 py-0.5 rounded-full border
                                                    ${exp.type === 'Full-time' ? 'text-emerald-500 bg-emerald-500/10 border-emerald-500/20'
                                                        : exp.type === 'Internship' ? 'text-amber-500 bg-amber-500/10 border-amber-500/20'
                                                            : 'text-purple-500 bg-purple-500/10 border-purple-500/20'
                                                    }`}
                                                >
                                                    {exp.type}
                                                </span>
                                                {exp.highlight && (
                                                    <span className="ml-auto inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-blue-500/10 border border-blue-500/20">
                                                        <span className="relative flex h-1.5 w-1.5">
                                                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75" />
                                                            <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-blue-500" />
                                                        </span>
                                                        <span className="text-[9px] font-bold tracking-wider uppercase text-blue-500">Current</span>
                                                    </span>
                                                )}
                                            </div>

                                            <h3 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100 mb-1 tracking-tight">
                                                {exp.role}
                                            </h3>
                                            <div className="flex items-center gap-2 mb-3">
                                                <p className="text-sm font-medium text-zinc-600 dark:text-zinc-300">
                                                    {exp.company}
                                                </p>
                                                <span className="text-zinc-300 dark:text-zinc-700">·</span>
                                                <p className="text-xs text-zinc-400 dark:text-zinc-500">
                                                    {exp.location}
                                                </p>
                                            </div>
                                            <p className="text-sm text-zinc-500 dark:text-zinc-400 leading-relaxed mb-5">
                                                {exp.description}
                                            </p>

                                            <div className="flex flex-wrap gap-1.5">
                                                {exp.tags.map((tag) => (
                                                    <span
                                                        key={tag}
                                                        className="px-2.5 py-0.5 text-[11px] font-medium tracking-wide uppercase rounded-md border transition-colors bg-black/[0.04] dark:bg-white/[0.04] text-zinc-500 border-black/[0.06] dark:border-white/[0.05]"
                                                    >
                                                        {tag}
                                                    </span>
                                                ))}
                                            </div>
                                        </div>
                                    </motion.div>
                                ))}
                            </div>
                        </div>
                    </motion.section>

                    <div className="my-20" />

                    {/* ── Skills ── */}
                    <motion.section variants={fadeUp}>
                        <SectionHeading label="02 — Skills" />
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            {[
                                {
                                    category: 'Languages',
                                    skills: ['Java (8/11/17)', 'Core Java', 'Collections', 'Concurrency', 'OOP', 'SOLID', 'SQL'],
                                    accent: 'from-blue-500 to-blue-600',
                                    dot: 'bg-blue-500',
                                    icon: <Code2 className="w-3.5 h-3.5" />,
                                },
                                {
                                    category: 'Frameworks & Libraries',
                                    skills: ['Spring Boot', 'Spring MVC', 'JPA / Hibernate', 'RESTful API', 'JUnit', 'Mockito', 'Cucumber'],
                                    accent: 'from-emerald-500 to-emerald-600',
                                    dot: 'bg-emerald-500',
                                    icon: <Layers className="w-3.5 h-3.5" />,
                                },
                                {
                                    category: 'Databases',
                                    skills: ['MySQL', 'PostgreSQL', 'Cosmos DB', 'MongoDB'],
                                    accent: 'from-amber-500 to-amber-600',
                                    dot: 'bg-amber-500',
                                    icon: <Database className="w-3.5 h-3.5" />,
                                },
                                {
                                    category: 'Cloud & DevOps',
                                    skills: ['Docker', 'Kubernetes', 'Azure Cloud', 'CI/CD Pipelines', 'Git', 'Maven', 'Gradle'],
                                    accent: 'from-purple-500 to-purple-600',
                                    dot: 'bg-purple-500',
                                    icon: <Cloud className="w-3.5 h-3.5" />,
                                },
                                {
                                    category: 'Concepts',
                                    skills: ['Microservices', 'API Debugging', 'Performance Optimization', 'Unit & Integration Testing', 'Agile / Scrum', 'Secure Coding'],
                                    accent: 'from-rose-500 to-rose-600',
                                    dot: 'bg-rose-500',
                                    icon: <Lightbulb className="w-3.5 h-3.5" />,
                                    span: true,
                                },
                            ].map((group) => (
                                <motion.div
                                    key={group.category}
                                    variants={fadeUp}
                                    whileHover={{ y: -4 }}
                                    className={`relative overflow-hidden p-6 rounded-2xl bg-black/[0.02] dark:bg-white/[0.02] border border-black/[0.06] dark:border-white/[0.06] hover:border-black/[0.12] dark:hover:border-white/[0.12] transition-all duration-300 hover:shadow-lg ${(group as any).span ? 'sm:col-span-2' : ''
                                        }`}
                                >
                                    {/* Top accent bar */}
                                    <div className={`absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r ${group.accent} opacity-60`} />

                                    {/* Category header */}
                                    <div className="flex items-center gap-2.5 mb-4">
                                        <span className={`flex items-center justify-center w-6 h-6 rounded-md bg-gradient-to-br ${group.accent} text-white/90`}>
                                            {(group as any).icon}
                                        </span>
                                        <h3 className="text-[12px] font-bold tracking-[0.12em] uppercase text-zinc-500 dark:text-zinc-400">
                                            {group.category}
                                        </h3>
                                    </div>

                                    {/* Skills */}
                                    <div className="flex flex-wrap gap-2">
                                        {group.skills.map((skill) => (
                                            <span
                                                key={skill}
                                                className="px-3 py-1 rounded-md text-[12px] font-medium bg-black/[0.04] dark:bg-white/[0.05] text-zinc-600 dark:text-zinc-300 border border-black/[0.04] dark:border-white/[0.04] select-none hover:bg-black/[0.08] dark:hover:bg-white/[0.08] hover:scale-[1.04] transition-all duration-200 cursor-default"
                                            >
                                                {skill}
                                            </span>
                                        ))}
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </motion.section>

                    <div className="my-20" />

                    {/* ── Projects ── */}
                    <motion.section variants={fadeUp}>
                        <SectionHeading label="03 — Work" />
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                            {PROJECTS.map((proj, i) => (
                                <motion.article
                                    key={proj.title}
                                    whileHover={{ y: -4 }}
                                    className="group relative overflow-hidden bg-black/[0.02] dark:bg-white/[0.02] border border-black/[0.06] dark:border-white/[0.06] rounded-2xl p-7 hover:bg-black/[0.04] dark:hover:bg-white/[0.04] hover:border-black/[0.12] dark:hover:border-white/[0.12] transition-all duration-500"
                                >
                                    {/* Gradient accent bar */}
                                    <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-blue-500 to-purple-500 opacity-0 group-hover:opacity-60 transition-opacity duration-500" />

                                    {/* Glow on hover */}
                                    <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-blue-500/[0.05] to-purple-500/[0.05] opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                                    <div className="relative z-10">
                                        <div className="flex justify-between items-start mb-3">
                                            <div className="flex items-center gap-3">
                                                <span className="text-[11px] font-bold tracking-[0.15em] text-zinc-300 dark:text-zinc-700 tabular-nums">0{i + 1}</span>
                                                <h3 className="text-lg font-semibold transition-colors text-zinc-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-300">
                                                    {proj.title}
                                                </h3>
                                            </div>
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
                                        <p className="text-[13px] leading-relaxed mb-5 text-zinc-500">{proj.desc}</p>
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
                                        l.isContact ? (
                                            <motion.button
                                                key={l.label}
                                                onClick={() => setIsContactOpen(true)}
                                                whileHover={{ y: -3, scale: 1.02 }}
                                                className="group flex flex-col items-center justify-center gap-3 p-5 rounded-2xl bg-black/[0.02] dark:bg-white/[0.02] border border-black/[0.06] dark:border-white/[0.06] hover:bg-black/[0.05] dark:hover:bg-white/[0.05] hover:border-black/[0.12] dark:hover:border-white/[0.12] transition-all duration-300"
                                            >
                                                <span className="text-zinc-400 dark:text-zinc-500 group-hover:text-zinc-900 dark:group-hover:text-white transition-colors">
                                                    {l.icon}
                                                </span>
                                                <span className="text-xs font-bold tracking-[0.15em] uppercase text-zinc-400 dark:text-zinc-600 group-hover:text-zinc-700 dark:group-hover:text-zinc-300 transition-colors">
                                                    {l.label}
                                                </span>
                                            </motion.button>
                                        ) : (
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
                                        )
                                    ))}
                                </div>
                            </div>
                        </div>
                    </motion.section>

                    <div className="my-20" />

                    {/* ── Spotify Marquee ── */}
                    <motion.section variants={fadeUp}>
                        <SpotifyRecentlyPlayed />
                    </motion.section>

                    <motion.div variants={fadeUp}>
                        <Footer />
                    </motion.div>
                </motion.div>
            </main>

            {/* Contact Modal */}
            <ContactModal isOpen={isContactOpen} onClose={() => setIsContactOpen(false)} />
        </Fragment>
    );
}
