import React, { useState, useEffect, useRef, useCallback, Fragment } from 'react';

/* ═══════════════════════════════════════════════════════
   DATA
   ═══════════════════════════════════════════════════════ */

const BANNER = `
 ██████╗ ██████╗  █████╗ ████████╗██╗██╗  ██╗
 ██╔══██╗██╔══██╗██╔══██╗╚══██╔══╝██║██║ ██╔╝
 ██████╔╝██████╔╝███████║   ██║   ██║█████╔╝
 ██╔═══╝ ██╔══██╗██╔══██║   ██║   ██║██╔═██╗
 ██║     ██║  ██║██║  ██║   ██║   ██║██║  ██╗
 ╚═╝     ╚═╝  ╚═╝╚═╝  ╚═╝   ╚═╝   ╚═╝╚═╝  ╚═╝`;

const SKILLS: Record<string, string[]> = {
    'Languages': ['Java (8/11/17)', 'Core Java', 'Collections', 'Concurrency', 'OOP', 'SOLID', 'SQL'],
    'Frameworks': ['Spring Boot', 'Spring MVC', 'JPA / Hibernate', 'RESTful API', 'JUnit', 'Mockito', 'Cucumber'],
    'Databases': ['MySQL', 'PostgreSQL', 'Cosmos DB', 'MongoDB'],
    'Cloud & DevOps': ['Docker', 'Kubernetes', 'Azure Cloud', 'CI/CD', 'Git', 'Maven', 'Gradle'],
    'Concepts': ['Microservices', 'API Debugging', 'Perf Optimization', 'Testing', 'Agile/Scrum', 'Secure Coding'],
};

const EXPERIENCE = [
    {
        period: 'Jul 2024 — Present', role: 'Software Developer', company: 'Bajaj Finserv',
        type: 'Full-time', location: 'Pune, India',
        desc: 'Building & maintaining high-availability backend systems powering financial services at scale.',
        tags: ['Java', 'Spring Boot', 'Microservices', 'REST API', 'PostgreSQL', 'Redis', 'Docker', 'Kafka'],
        current: true,
    },
    {
        period: 'Jan 2024 — Jun 2024', role: 'SDE Intern', company: 'Bajaj Finserv',
        type: 'Internship', location: 'Pune, India',
        desc: 'Backend development and API integrations for internal tools and financial products.',
        tags: ['Java', 'Spring Boot', 'REST API', 'SQL'],
        current: false,
    },
    {
        period: '2020 — 2024', role: 'BTech — E&TC', company: 'College of Engineering Pune (COEP)',
        type: 'Education', location: 'Pune, India',
        desc: 'Focused on software engineering, data structures, and system design.',
        tags: ['DSA', 'Embedded Systems', 'Full-Stack', 'Open Source'],
        current: false,
    },
];

const PROJECTS = [
    {
        title: 'Parkin', desc: 'Smart parking management — optimizing slot allocation and availability tracking.',
        tags: ['Java', 'Spring Boot', 'REST API'],
        github: 'https://github.com/pratikt76/Parkin', demo: 'https://github.com/pratikt76/Parkin/blob/main/README.md'
    },
    {
        title: 'VelocityCSS', desc: 'Lightweight CSS utility framework — faster styling without bloat.',
        tags: ['CSS', 'JavaScript', 'Framework'],
        github: 'https://github.com/pratikt76/VelocityCSS', demo: 'https://pratikt76.github.io/VelocityCSS/'
    },
];

const SOCIAL = [
    { label: 'GitHub', url: 'https://github.com/pratikt76' },
    { label: 'LinkedIn', url: 'https://linkedin.com/in/pratikt76' },
    { label: 'Resume', url: 'https://drive.google.com/file/d/1VLOhNIh_EFSARD6z6wfiM8OpADZmWSq3/view?usp=sharing' },
    { label: 'Email', url: 'mailto:pratikthombare76@gmail.com' },
];

const TRIVIA = [
    { q: 'What does JVM stand for?', a: 'java virtual machine' },
    { q: 'Which company developed Spring Boot?', a: 'pivotal' },
    { q: 'What port does HTTP use by default?', a: '80' },
    { q: 'What does SQL stand for?', a: 'structured query language' },
    { q: 'In Java, what keyword is used to inherit a class?', a: 'extends' },
    { q: 'What does REST stand for?', a: 'representational state transfer' },
    { q: 'In Git, what command creates a new branch?', a: 'git branch' },
    { q: 'What is the default port for PostgreSQL?', a: '5432' },
    { q: 'What annotation marks a Spring Boot entry point?', a: '@springbootapplication' },
    { q: 'What does OOP stand for?', a: 'object oriented programming' },
];

const SPOTIFY_API = 'https://spotify-api-khaki.vercel.app/api/spotify';

const WALLPAPERS = ['city', 'mountains', 'space', 'forest', 'ocean', 'f1', 'cricket', 'none'] as const;
type WallpaperName = typeof WALLPAPERS[number];

/* ═══════════════════════════════════════════════════════
   TYPES
   ═══════════════════════════════════════════════════════ */

type LineType = 'input' | 'text' | 'error' | 'success' | 'accent' | 'ascii' | 'link' | 'muted' | 'green';

interface OutputLine { type: LineType; content: string; href?: string; }

/* Tetris types */
type TetrisBoard = number[][];
interface TetrisPiece { shape: number[][]; x: number; y: number; }

const TETRIS_PIECES = [
    [[1, 1, 1, 1]],                    // I
    [[1, 1], [1, 1]],                  // O
    [[0, 1, 0], [1, 1, 1]],              // T
    [[0, 1, 1], [1, 1, 0]],              // S
    [[1, 1, 0], [0, 1, 1]],              // Z
    [[1, 0], [1, 0], [1, 1]],            // L
    [[0, 1], [0, 1], [1, 1]],            // J
];

function createBoard(): TetrisBoard { return Array.from({ length: 20 }, () => Array(10).fill(0)); }

function randomPiece(): TetrisPiece {
    const shape = TETRIS_PIECES[Math.floor(Math.random() * TETRIS_PIECES.length)];
    return { shape, x: Math.floor((10 - shape[0].length) / 2), y: 0 };
}

function canPlace(board: TetrisBoard, piece: TetrisPiece, dx = 0, dy = 0): boolean {
    for (let r = 0; r < piece.shape.length; r++) {
        for (let c = 0; c < piece.shape[r].length; c++) {
            if (!piece.shape[r][c]) continue;
            const nr = piece.y + r + dy, nc = piece.x + c + dx;
            if (nr < 0 || nr >= 20 || nc < 0 || nc >= 10) return false;
            if (board[nr][nc]) return false;
        }
    }
    return true;
}

function rotatePiece(piece: TetrisPiece): number[][] {
    const rows = piece.shape.length, cols = piece.shape[0].length;
    const rotated: number[][] = Array.from({ length: cols }, () => Array(rows).fill(0));
    for (let r = 0; r < rows; r++) for (let c = 0; c < cols; c++) rotated[c][rows - 1 - r] = piece.shape[r][c];
    return rotated;
}

function placePiece(board: TetrisBoard, piece: TetrisPiece): TetrisBoard {
    const b = board.map(r => [...r]);
    for (let r = 0; r < piece.shape.length; r++) {
        for (let c = 0; c < piece.shape[r].length; c++) {
            if (piece.shape[r][c]) b[piece.y + r][piece.x + c] = 1;
        }
    }
    return b;
}

function clearRows(board: TetrisBoard): { board: TetrisBoard; cleared: number } {
    const kept = board.filter(r => r.some(c => c === 0));
    const cleared = 20 - kept.length;
    while (kept.length < 20) kept.unshift(Array(10).fill(0));
    return { board: kept, cleared };
}

function renderBoard(board: TetrisBoard, piece: TetrisPiece): string[] {
    const display = board.map(r => [...r]);
    for (let r = 0; r < piece.shape.length; r++) {
        for (let c = 0; c < piece.shape[r].length; c++) {
            if (piece.shape[r][c] && piece.y + r >= 0) display[piece.y + r][piece.x + c] = 2;
        }
    }
    const lines: string[] = ['  +' + '---'.repeat(10) + '+'];
    for (const row of display) {
        lines.push('  |' + row.map(c => c === 2 ? '[#]' : c === 1 ? '[=]' : ' . ').join('') + '|');
    }
    lines.push('  +' + '---'.repeat(10) + '+');
    return lines;
}

/* Interactive mode for contact form / games */
type InteractiveMode =
    | null
    | { kind: 'contact'; step: 'name' | 'email' | 'message'; name?: string; email?: string; }
    | { kind: 'games'; }
    | { kind: 'guess'; target: number; attempts: number; }
    | { kind: 'trivia'; qIndex: number; score: number; total: number; asked: number[]; }
    | { kind: 'tetris'; board: TetrisBoard; piece: TetrisPiece; score: number; linesCleared: number; gameOver: boolean; }
    | { kind: 'typingtest'; sentence: string; startTime: number; };

const THEMES = ['dark', 'light', 'monokai', 'dracula', 'nord'] as const;
type ThemeName = typeof THEMES[number];

const TYPING_SENTENCES = [
    'The quick brown fox jumps over the lazy dog.',
    'Pack my box with five dozen liquor jugs.',
    'Microservices communicate over lightweight protocols.',
    'Spring Boot simplifies Java backend development.',
    'Docker containers ensure consistent deployments.',
    'REST APIs enable seamless system integration.',
    'Kubernetes orchestrates containerized applications at scale.',
    'Clean code is not written by following rules.',
];

/* ═══════════════════════════════════════════════════════
   THEME HOOK
   ═══════════════════════════════════════════════════════ */

function useTheme() {
    const [theme, setTheme] = useState<ThemeName>(() => {
        if (typeof window === 'undefined') return 'dark';
        const saved = localStorage.getItem('terminal-theme') as ThemeName | null;
        if (saved && THEMES.includes(saved)) return saved;
        return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    });
    useEffect(() => {
        document.documentElement.setAttribute('data-theme', theme);
        localStorage.setItem('terminal-theme', theme);
    }, [theme]);
    return { theme, setTheme };
}

/* ═══════════════════════════════════════════════════════
   SOUND HELPERS (Web Audio API)
   ═══════════════════════════════════════════════════════ */

let audioCtx: AudioContext | null = null;
function getAudioCtx() {
    if (!audioCtx) audioCtx = new AudioContext();
    return audioCtx;
}

function playTone(freq: number, duration: number, vol = 0.05) {
    try {
        const ctx = getAudioCtx();
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.value = freq;
        gain.gain.value = vol;
        osc.connect(gain).connect(ctx.destination);
        osc.start();
        osc.stop(ctx.currentTime + duration / 1000);
    } catch { /* silently fail */ }
}

function playKey() { playTone(800, 2, 0.03); }
function playEnter() { playTone(600, 40, 0.04); }
function playError() { playTone(200, 80, 0.05); }

/* ═══════════════════════════════════════════════════════
   WELCOME LINES
   ═══════════════════════════════════════════════════════ */

function getWelcome(): OutputLine[] {
    return [
        { type: 'ascii', content: BANNER },
        { type: 'text', content: '' },
        { type: 'accent', content: '  Welcome to Pratik Thombare\'s terminal portfolio!' },
        { type: 'muted', content: '  Type `help` to see available commands.' },
        { type: 'text', content: '' },
    ];
}

/* ═══════════════════════════════════════════════════════
   COMMAND PROCESSOR (sync commands)
   ═══════════════════════════════════════════════════════ */

function runCommand(
    raw: string,
    theme: ThemeName,
    setTheme: (v: ThemeName) => void,
    startTime: number,
    wallpaper: WallpaperName,
    setWallpaper: (v: WallpaperName) => void,
): { lines: OutputLine[]; interactive?: InteractiveMode; fetchSpotify?: boolean } {
    const trimmed = raw.trim();
    if (!trimmed) return { lines: [] };
    const [cmd, ...args] = trimmed.split(/\s+/);
    const c = cmd.toLowerCase();

    switch (c) {
        case 'help': {
            const helpLines: OutputLine[] = [
                { type: 'text', content: '' },
                { type: 'accent', content: '  COMMANDS' },
                { type: 'muted', content: '  ────────────────────────────────────────' },
                { type: 'text', content: '' },
                { type: 'success', content: '  [profile]' },
                { type: 'text', content: '    about          who am I' },
                { type: 'text', content: '    skills         tech stack & expertise' },
                { type: 'text', content: '    experience     work & education timeline' },
                { type: 'text', content: '    social         github, linkedin, resume link' },
                { type: 'text', content: '    resume         compact text resume' },
                { type: 'text', content: '' },
                { type: 'success', content: '  [portfolio]' },
                { type: 'text', content: '    projects       things I\'ve built' },
                { type: 'text', content: '    contact        send me a message' },
                { type: 'text', content: '    spotify        recently played tracks' },
                { type: 'text', content: '' },
                { type: 'success', content: '  [tools]' },
                { type: 'text', content: '    theme <name>   switch theme (dark light monokai dracula nord)' },
                { type: 'text', content: '    sound <on|off>  toggle typing sounds' },
                { type: 'text', content: '    wallpaper <n>  set 8-bit wallpaper (city mountains space forest ocean none)' },
                { type: 'text', content: '    clear          clear the terminal' },
                { type: 'text', content: '    history        command history' },
                { type: 'text', content: '    echo <text>    echo back text' },
                { type: 'text', content: '    neofetch       system info' },
                { type: 'text', content: '    uptime         session duration' },
                { type: 'text', content: '' },
                { type: 'success', content: '  [fun]' },
                { type: 'text', content: '    games          play a game' },
                { type: 'text', content: '    typingtest     test your typing speed' },
                { type: 'text', content: '    whoami         ???' },
                { type: 'text', content: '' },
            ];

            if (args[0] === '--all') {
                helpLines.push(
                    { type: 'success', content: '  [hidden]' },
                    { type: 'text', content: '    matrix         follow the white rabbit' },
                    { type: 'text', content: '    rocket         launch sequence' },
                    { type: 'text', content: '    coffee         brew a cup' },
                    { type: 'text', content: '' },
                    { type: 'success', content: '  [unix]' },
                    { type: 'text', content: '    ls             list files' },
                    { type: 'text', content: '    cat <file>     read a file' },
                    { type: 'text', content: '    cd <dir>       change directory' },
                    { type: 'text', content: '    pwd            print working directory' },
                    { type: 'text', content: '    date           current date & time' },
                    { type: 'text', content: '    sudo           nice try' },
                    { type: 'text', content: '    rm             not happening' },
                    { type: 'text', content: '    exit           you can\'t leave' },
                    { type: 'text', content: '' },
                );
            }

            helpLines.push(
                {
                    type: 'muted', content: args[0] === '--all'
                        ? '  tab to autocomplete  ·  ctrl+c to cancel'
                        : '  tab to autocomplete  ·  ctrl+c to cancel  ·  help --all for more'
                },
                { type: 'text', content: '' },
            );

            return { lines: helpLines };
        }

        case 'about':
            return {
                lines: [
                    { type: 'text', content: '' },
                    { type: 'accent', content: '  Hey there! I\'m Pratik Thombare' },
                    { type: 'text', content: '' },
                    { type: 'text', content: '  I\'m a Software Developer at Bajaj Finserv, based in Pune, India.' },
                    { type: 'text', content: '  I spend my days crafting backend systems with Java and Spring Boot —' },
                    { type: 'text', content: '  the kind of systems that handle millions of requests and can\'t' },
                    { type: 'text', content: '  afford to go down. Think microservices, APIs, Kafka pipelines,' },
                    { type: 'text', content: '  and Dockerized deployments on Azure Cloud.' },
                    { type: 'text', content: '' },
                    { type: 'text', content: '  I graduated from COEP Pune in 2024 (BTech — E&TC), where I fell' },
                    { type: 'text', content: '  in love with clean code and scalable architecture. Before going' },
                    { type: 'text', content: '  full-time, I interned at the same company and got my hands dirty' },
                    { type: 'text', content: '  building internal tools and API integrations.' },
                    { type: 'text', content: '' },
                    { type: 'text', content: '  Outside of work, you\'ll find me watching Formula 1, following' },
                    { type: 'text', content: '  cricket, binge-watching movies, or tinkering with side' },
                    { type: 'text', content: '  projects like CSS frameworks and parking systems.' },
                    { type: 'text', content: '' },
                    { type: 'muted', content: '  Type `skills` to see my tech stack, or `projects` to see what' },
                    { type: 'muted', content: '  I\'ve been building.' },
                    { type: 'text', content: '' },
                ]
            };

        case 'skills': {
            const lines: OutputLine[] = [
                { type: 'text', content: '' },
                { type: 'success', content: '  ┌─ Skills ─────────────────────────────────────────┐' },
                { type: 'text', content: '' },
            ];
            Object.entries(SKILLS).forEach(([cat, skills]) => {
                lines.push({ type: 'accent', content: `    ▸ ${cat}` });
                lines.push({ type: 'text', content: `      ${skills.join(' · ')}` });
                lines.push({ type: 'text', content: '' });
            });
            lines.push({ type: 'success', content: '  └───────────────────────────────────────────────────┘' });
            lines.push({ type: 'text', content: '' });
            return { lines };
        }

        case 'experience': case 'exp': {
            const lines: OutputLine[] = [
                { type: 'text', content: '' },
                { type: 'success', content: '  ┌─ Experience ─────────────────────────────────────┐' },
                { type: 'text', content: '' },
            ];
            EXPERIENCE.forEach((e, i) => {
                const dot = e.current ? '●' : '○';
                lines.push({ type: 'accent', content: `    ${dot} ${e.role}` });
                lines.push({ type: 'text', content: `      ${e.company} · ${e.type}` });
                lines.push({ type: 'muted', content: `      ${e.period} · ${e.location}` });
                lines.push({ type: 'text', content: `      ${e.desc}` });
                lines.push({ type: 'muted', content: `      [${e.tags.join(', ')}]` });
                if (i < EXPERIENCE.length - 1) lines.push({ type: 'muted', content: '      │' });
            });
            lines.push({ type: 'text', content: '' });
            lines.push({ type: 'success', content: '  └───────────────────────────────────────────────────┘' });
            lines.push({ type: 'text', content: '' });
            return { lines };
        }

        case 'projects': case 'proj': {
            const lines: OutputLine[] = [
                { type: 'text', content: '' },
                { type: 'success', content: '  ┌─ Projects ───────────────────────────────────────┐' },
                { type: 'text', content: '' },
            ];
            PROJECTS.forEach((p, i) => {
                lines.push({ type: 'accent', content: `    0${i + 1} │ ${p.title}` });
                lines.push({ type: 'text', content: `       │ ${p.desc}` });
                lines.push({ type: 'muted', content: `       │ [${p.tags.join(', ')}]` });
                lines.push({ type: 'link', content: `       │ GitHub → ${p.github}`, href: p.github });
                lines.push({ type: 'link', content: `       │ Demo   → ${p.demo}`, href: p.demo });
                if (i < PROJECTS.length - 1) lines.push({ type: 'text', content: '' });
            });
            lines.push({ type: 'text', content: '' });
            lines.push({ type: 'success', content: '  └───────────────────────────────────────────────────┘' });
            lines.push({ type: 'text', content: '' });
            return { lines };
        }

        case 'social': case 'links': {
            const lines: OutputLine[] = [
                { type: 'text', content: '' },
                { type: 'success', content: '  ┌─ Social ─────────────────────────────────────────┐' },
                { type: 'text', content: '' },
            ];
            SOCIAL.forEach((s) => {
                lines.push({ type: 'link', content: `    ▸ ${s.label.padEnd(12)} → click to open`, href: s.url });
            });
            lines.push({ type: 'text', content: '' });
            lines.push({ type: 'success', content: '  └───────────────────────────────────────────────────┘' });
            lines.push({ type: 'text', content: '' });
            return { lines };
        }

        /* ── contact (start interactive mode) ── */
        case 'contact':
            return {
                lines: [
                    { type: 'text', content: '' },
                    { type: 'accent', content: '  > Contact Form' },
                    { type: 'muted', content: '  (type "cancel" at any time to exit)' },
                    { type: 'text', content: '' },
                    { type: 'success', content: '  Your name:' },
                ],
                interactive: { kind: 'contact', step: 'name' },
            };

        /* ── spotify (async fetch) ── */
        case 'spotify': case 'music':
            return {
                lines: [
                    { type: 'text', content: '' },
                    { type: 'green', content: '  >> Fetching recently played tracks...' },
                ],
                fetchSpotify: true,
            };

        /* ── theme ── */
        case 'theme': {
            const t = args[0]?.toLowerCase();
            if (t && THEMES.includes(t as ThemeName)) {
                setTheme(t as ThemeName);
                return { lines: [{ type: 'success', content: `  Theme -> ${t}` }] };
            }
            return {
                lines: [
                    { type: 'text', content: `  Current: ${theme}` },
                    { type: 'text', content: '' },
                    { type: 'muted', content: `  Available: ${THEMES.join('  ')}` },
                    { type: 'muted', content: '  Usage: theme <name>' },
                ]
            };
        }

        case 'clear': case 'cls':
            return { lines: [] }; // handled in component

        /* ── resume ── */
        case 'resume': case 'cv':
            return {
                lines: [
                    { type: 'text', content: '' },
                    { type: 'accent', content: '  PRATIK THOMBARE' },
                    { type: 'muted', content: '  Software Developer | Pune, India' },
                    { type: 'muted', content: '  pratikthombare76@gmail.com | github.com/pratikt76' },
                    { type: 'text', content: '' },
                    { type: 'success', content: '  -- EXPERIENCE --' },
                    { type: 'text', content: '' },
                    { type: 'accent', content: '  Software Developer        Bajaj Finserv     Jul 2024 - Present' },
                    { type: 'text', content: '    Backend systems for financial services at scale.' },
                    { type: 'muted', content: '    Java, Spring Boot, Microservices, PostgreSQL, Docker, Kafka' },
                    { type: 'text', content: '' },
                    { type: 'accent', content: '  SDE Intern                Bajaj Finserv     Jan 2024 - Jun 2024' },
                    { type: 'text', content: '    Backend development and API integrations.' },
                    { type: 'muted', content: '    Java, Spring Boot, REST API, SQL' },
                    { type: 'text', content: '' },
                    { type: 'success', content: '  -- EDUCATION --' },
                    { type: 'text', content: '' },
                    { type: 'accent', content: '  BTech E&TC                COEP Pune          2020 - 2024' },
                    { type: 'text', content: '' },
                    { type: 'success', content: '  -- SKILLS --' },
                    { type: 'text', content: '' },
                    { type: 'text', content: '  Languages    Java 8/11/17 · SQL · JavaScript' },
                    { type: 'text', content: '  Frameworks   Spring Boot · JPA · JUnit · REST API' },
                    { type: 'text', content: '  Databases    PostgreSQL · MySQL · MongoDB · Cosmos DB' },
                    { type: 'text', content: '  DevOps       Docker · Kubernetes · Azure · CI/CD · Git' },
                    { type: 'text', content: '' },
                    { type: 'success', content: '  -- LINKS --' },
                    { type: 'text', content: '' },
                    { type: 'link', content: '  github.com/pratikt76', href: 'https://github.com/pratikt76' },
                    { type: 'link', content: '  linkedin.com/in/pratikt76', href: 'https://linkedin.com/in/pratikt76' },
                    { type: 'link', content: '  Download PDF', href: 'https://drive.google.com/file/d/1VLOhNIh_EFSARD6z6wfiM8OpADZmWSq3/view?usp=sharing' },
                    { type: 'text', content: '' },
                ]
            };

        /* ── uptime ── */
        case 'uptime': {
            const elapsed = Math.floor((Date.now() - startTime) / 1000);
            const h = Math.floor(elapsed / 3600);
            const m = Math.floor((elapsed % 3600) / 60);
            const s = elapsed % 60;
            const parts: string[] = [];
            if (h > 0) parts.push(`${h}h`);
            parts.push(`${m}m`);
            parts.push(`${s}s`);
            return { lines: [{ type: 'text', content: `  up ${parts.join(' ')}` }] };
        }

        /* ── sound ── */
        case 'sound':
            return { lines: [] }; // handled in component

        /* ── wallpaper ── */
        case 'wallpaper': case 'wp': case 'bg': {
            const w = args[0]?.toLowerCase();
            if (w && WALLPAPERS.includes(w as WallpaperName)) {
                setWallpaper(w as WallpaperName);
                localStorage.setItem('terminal-wallpaper', w);
                return { lines: [{ type: 'success', content: `  Wallpaper -> ${w}` }] };
            }
            return {
                lines: [
                    { type: 'text', content: `  Current: ${wallpaper}` },
                    { type: 'text', content: '' },
                    { type: 'muted', content: `  Available: ${WALLPAPERS.join('  ')}` },
                    { type: 'muted', content: '  Usage: wallpaper <name>' },
                ]
            };
        }

        /* ── typing test ── */
        case 'typingtest': case 'typing': case 'wpm': {
            const sentence = TYPING_SENTENCES[Math.floor(Math.random() * TYPING_SENTENCES.length)];
            return {
                lines: [
                    { type: 'text', content: '' },
                    { type: 'accent', content: '  TYPING TEST' },
                    { type: 'muted', content: '  Type the following sentence as fast as you can:' },
                    { type: 'text', content: '' },
                    { type: 'success', content: `  >> ${sentence}` },
                    { type: 'text', content: '' },
                ],
                interactive: { kind: 'typingtest', sentence, startTime: Date.now() },
            };
        }

        case 'echo':
            return { lines: [{ type: 'text', content: `  ${args.join(' ')}` }] };

        /* ── games (chooser) ── */
        case 'games': case 'game': case 'play':
            return {
                lines: [
                    { type: 'text', content: '' },
                    { type: 'accent', content: '  -- Games Arcade --' },
                    { type: 'text', content: '' },
                    { type: 'text', content: '    1. Guess the Number  -- guess a number between 1-100' },
                    { type: 'text', content: '    2. Tech Trivia       -- 5-question quiz on tech topics' },
                    { type: 'text', content: '    3. Tetris            -- classic block-stacking game' },
                    { type: 'text', content: '' },
                    { type: 'success', content: '  Pick a game (1, 2, or 3):' },
                ],
                interactive: { kind: 'games' },
            };

        /* ── easter egg: animated art ── */
        case 'matrix':
            return {
                lines: [
                    { type: 'text', content: '' },
                    { type: 'green', content: '  ░▒▓█ THE MATRIX HAS YOU █▓▒░' },
                    { type: 'text', content: '' },
                    { type: 'green', content: '  01001000 01100101 01101100' },
                    { type: 'green', content: '  01101100 01101111 00100001' },
                    { type: 'text', content: '' },
                    { type: 'green', content: '  ╔══════════════════════════════════╗' },
                    { type: 'green', content: '  ║  Wake up, visitor...            ║' },
                    { type: 'green', content: '  ║  The Matrix has you...          ║' },
                    { type: 'green', content: '  ║  Follow the white rabbit.       ║' },
                    { type: 'green', content: '  ║                                  ║' },
                    { type: 'green', content: '  ║  Knock, knock, Neo.             ║' },
                    { type: 'green', content: '  ╚══════════════════════════════════╝' },
                    { type: 'text', content: '' },
                ]
            };

        case 'rocket': case 'launch':
            return {
                lines: [
                    { type: 'text', content: '' },
                    { type: 'accent', content: '         ^' },
                    { type: 'accent', content: '        /|\\' },
                    { type: 'accent', content: '       / | \\' },
                    { type: 'accent', content: '      /  |  \\' },
                    { type: 'accent', content: '     |   |   |' },
                    { type: 'accent', content: '     |  ===  |' },
                    { type: 'accent', content: '     | |   | |' },
                    { type: 'accent', content: '     | |   | |' },
                    { type: 'accent', content: '     | |   | |' },
                    { type: 'accent', content: '    /| |   | |\\' },
                    { type: 'accent', content: '   / | |   | | \\' },
                    { type: 'success', content: '  \\__|_|___|_|__/' },
                    { type: 'error', content: '      \\_____/' },
                    { type: 'error', content: '     ^^^' },
                    { type: 'text', content: '' },
                    { type: 'accent', content: '  3... 2... 1... LIFTOFF!' },
                    { type: 'muted', content: '  Destination: the stars' },
                    { type: 'text', content: '' },
                ]
            };

        case 'coffee': case 'brew':
            return {
                lines: [
                    { type: 'text', content: '' },
                    { type: 'muted', content: '        ( (  ' },
                    { type: 'muted', content: '         ) ) ' },
                    { type: 'muted', content: '      ........' },
                    { type: 'muted', content: '      |      |]' },
                    { type: 'muted', content: '      \\      /' },
                    { type: 'muted', content: '       `----\'' },
                    { type: 'text', content: '' },
                    { type: 'accent', content: '  Brewing coffee...' },
                    { type: 'success', content: '  Coffee is ready! Time to code.' },
                    { type: 'text', content: '' },
                ]
            };

        /* ── fun / unix ── */
        case 'whoami': return { lines: [{ type: 'accent', content: '  You are a curious visitor.' }, { type: 'text', content: '  ...and I appreciate you being here!' }] };
        case 'sudo': return { lines: [{ type: 'error', content: '  Nice try! No root access here.' }, { type: 'muted', content: '  Try `contact` to reach the admin.' }] };
        case 'rm': return { lines: [{ type: 'error', content: '  Whoa! Read-only filesystem.' }] };
        case 'ls': return { lines: [{ type: 'text', content: '  about.txt    skills.json    experience.log' }, { type: 'text', content: '  projects/    social.md      spotify.mp3' }] };
        case 'cat':
            if (args[0]) {
                const map: Record<string, string> = { 'about.txt': 'about', 'skills.json': 'skills', 'experience.log': 'experience', 'social.md': 'social' };
                if (map[args[0]]) return runCommand(map[args[0]], theme, setTheme, startTime, wallpaper, setWallpaper);
            }
            return { lines: [{ type: 'error', content: `  cat: ${args[0] || ''}: No such file` }] };
        case 'cd':
            if (args[0]?.replace('/', '') === 'projects') return runCommand('projects', theme, setTheme, startTime, wallpaper, setWallpaper);
            return { lines: [{ type: 'text', content: '  You\'re already home ~' }] };
        case 'pwd': return { lines: [{ type: 'text', content: '  /home/visitor/pratik-portfolio' }] };
        case 'date': return { lines: [{ type: 'text', content: `  ${new Date().toLocaleString()}` }] };
        case 'exit': case 'quit': return { lines: [{ type: 'accent', content: '  Thanks for visiting!' }, { type: 'muted', content: '  But this terminal never closes -- try `help`!' }] };
        case 'neofetch': return {
            lines: [
                { type: 'text', content: '' },
                { type: 'accent', content: '  pratik@portfolio' },
                { type: 'muted', content: '  ─────────────────' },
                { type: 'text', content: '  OS:       Portfolio OS v2.0' },
                { type: 'text', content: '  Host:     Vercel Edge' },
                { type: 'text', content: '  Kernel:   React 18 + Vite 5' },
                { type: 'text', content: '  Shell:    pratik-sh 1.0' },
                { type: 'text', content: `  Theme:    ${theme}` },
                { type: 'text', content: '  Font:     JetBrains Mono' },
                { type: 'text', content: '  Uptime:   since Feb 2024' },
                { type: 'text', content: '' },
            ]
        };
        case 'history': return { lines: [] }; // handled in component

        default: return {
            lines: [
                { type: 'error', content: `  Command not found: ${c}` },
                { type: 'muted', content: '  Type `help` to see available commands.' },
            ]
        };
    }
}

/* ═══════════════════════════════════════════════════════
   COMPONENT
   ═══════════════════════════════════════════════════════ */

export default function PratikMinimalPortfolio(): JSX.Element {
    const [lines, setLines] = useState<OutputLine[]>(getWelcome);
    const [input, setInput] = useState('');
    const [history, setHistory] = useState<string[]>([]);
    const [histIdx, setHistIdx] = useState(-1);
    const [interactive, setInteractive] = useState<InteractiveMode>(null);
    const [soundEnabled, setSoundEnabled] = useState(() => {
        if (typeof window === 'undefined') return false;
        return localStorage.getItem('terminal-sound') === 'on';
    });
    const { theme, setTheme } = useTheme();
    const startTimeRef = useRef(Date.now());

    /* ── Wallpaper state ── */
    const [wallpaper, setWallpaper] = useState<WallpaperName>(() => {
        if (typeof window === 'undefined') return 'city';
        return (localStorage.getItem('terminal-wallpaper') as WallpaperName) || 'city';
    });

    /* ── Preview window state ── */
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);
    const [previewTitle, setPreviewTitle] = useState('');

    /* ── Window state (normal / minimized / maximized) ── */
    const [winState, setWinState] = useState<'normal' | 'minimized' | 'maximized'>('normal');
    const savedPosRef = useRef({ x: 16, y: 16, w: 0, h: 0 });

    /* ── Clock widget ── */
    const [clockTime, setClockTime] = useState(new Date());
    useEffect(() => {
        const t = setInterval(() => setClockTime(new Date()), 1000);
        return () => clearInterval(t);
    }, []);

    /* ── Spotify widget ── */
    const [spWidget, setSpWidget] = useState<{ name: string; artist: string; art: string; url: string } | null>(null);
    useEffect(() => {
        const fetchSp = () => fetch(SPOTIFY_API).then(r => r.json()).then(d => {
            if (d.isPlaying || d.recentlyPlayed) {
                const t = d.isPlaying ? d : d.recentlyPlayed;
                setSpWidget({ name: t.title || t.name, artist: t.artist, art: t.albumImageUrl || t.albumArt || '', url: t.songUrl || '#' });
            }
        }).catch(() => { });
        fetchSp();
        const i = setInterval(fetchSp, 60000);
        return () => clearInterval(i);
    }, []);

    /* ── Boot / splash screen ── */
    const [booting, setBooting] = useState(true);
    const [bootPhase, setBootPhase] = useState(0);
    const [bootFade, setBootFade] = useState(false);
    const bootLines = [
        { text: 'Initializing system...', status: 'ok' },
        { text: 'Loading kernel modules...', status: 'ok' },
        { text: 'Mounting /dev/portfolio...', status: 'ok' },
        { text: 'Starting network services...', status: 'ok' },
        { text: 'Loading UI components...', status: 'ok' },
        { text: 'Checking coffee supply...', status: 'warn' },
        { text: 'All systems operational', status: 'ok' },
    ];
    useEffect(() => {
        if (!booting) return;
        if (bootPhase < bootLines.length) {
            const t = setTimeout(() => setBootPhase(p => p + 1), 300);
            return () => clearTimeout(t);
        } else {
            const t = setTimeout(() => setBootFade(true), 400);
            const t2 = setTimeout(() => setBooting(false), 1000);
            return () => { clearTimeout(t); clearTimeout(t2); };
        }
    }, [booting, bootPhase]);

    /* ── Right-click context menu ── */
    const [ctxMenu, setCtxMenu] = useState<{ x: number; y: number } | null>(null);
    const handleContextMenu = useCallback((e: React.MouseEvent) => {
        const target = e.target as HTMLElement;
        if (target.closest('.terminal-window') || target.closest('.context-menu') || target.closest('.widget-card')) return;
        e.preventDefault();
        setCtxMenu({ x: e.clientX, y: e.clientY });
    }, []);
    useEffect(() => {
        const close = () => setCtxMenu(null);
        window.addEventListener('click', close);
        return () => window.removeEventListener('click', close);
    }, []);

    const scrollRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);
    const bottomRef = useRef<HTMLDivElement>(null);
    const terminalRef = useRef<HTMLDivElement>(null);

    /* ── Drag & Resize state ── */
    const [winPos, setWinPos] = useState({ x: 16, y: 16 });
    const [winSize, setWinSize] = useState({ w: 0, h: 0 });
    const [isDragging, setIsDragging] = useState(false);
    const [isResizing, setIsResizing] = useState<null | 'e' | 's' | 'se'>(null);
    const dragOffsetRef = useRef({ x: 0, y: 0 });
    const resizeStartRef = useRef({ x: 0, y: 0, w: 0, h: 0 });

    useEffect(() => {
        setWinSize({ w: Math.min(900, Math.floor(window.innerWidth * 0.62)), h: window.innerHeight - 32 });
    }, []);

    const handleDragStart = useCallback((e: React.MouseEvent) => {
        if ((e.target as HTMLElement).closest('.window-btn')) return;
        e.preventDefault();
        setIsDragging(true);
        dragOffsetRef.current = { x: e.clientX - winPos.x, y: e.clientY - winPos.y };
    }, [winPos]);

    const handleResizeStart = useCallback((dir: 'e' | 's' | 'se') => (e: React.MouseEvent) => {
        e.preventDefault(); e.stopPropagation();
        setIsResizing(dir);
        resizeStartRef.current = { x: e.clientX, y: e.clientY, w: winSize.w, h: winSize.h };
    }, [winSize]);

    useEffect(() => {
        const onMove = (e: MouseEvent) => {
            if (isDragging) {
                setWinPos({ x: Math.max(0, Math.min(e.clientX - dragOffsetRef.current.x, window.innerWidth - 100)), y: Math.max(0, Math.min(e.clientY - dragOffsetRef.current.y, window.innerHeight - 40)) });
            }
            if (isResizing) {
                const dx = e.clientX - resizeStartRef.current.x;
                const dy = e.clientY - resizeStartRef.current.y;
                if (isResizing === 'e' || isResizing === 'se') setWinSize(p => ({ ...p, w: Math.max(400, resizeStartRef.current.w + dx) }));
                if (isResizing === 's' || isResizing === 'se') setWinSize(p => ({ ...p, h: Math.max(300, resizeStartRef.current.h + dy) }));
            }
        };
        const onUp = () => { setIsDragging(false); setIsResizing(null); };
        if (isDragging || isResizing) {
            document.addEventListener('mousemove', onMove);
            document.addEventListener('mouseup', onUp);
            document.body.style.userSelect = 'none';
        }
        return () => { document.removeEventListener('mousemove', onMove); document.removeEventListener('mouseup', onUp); document.body.style.userSelect = ''; };
    }, [isDragging, isResizing]);

    /* ── Contact Modal state ── */
    const [contactOpen, setContactOpen] = useState(false);
    const [contactForm, setContactForm] = useState({ name: '', email: '', message: '' });
    const [contactStatus, setContactStatus] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle');

    const handleContactSubmit = useCallback(async (e: React.FormEvent) => {
        e.preventDefault();
        setContactStatus('sending');
        try {
            const fd = new FormData();
            fd.append('name', contactForm.name);
            fd.append('email', contactForm.email);
            fd.append('message', contactForm.message);
            const res = await fetch('https://formsubmit.co/ajax/pratikthombare03@gmail.com', {
                method: 'POST', body: fd, headers: { 'Accept': 'application/json' },
            });
            const d = await res.json();
            if (d.success) {
                setContactStatus('sent');
                setTimeout(() => { setContactOpen(false); setContactForm({ name: '', email: '', message: '' }); setContactStatus('idle'); }, 2000);
            } else { setContactStatus('error'); }
        } catch { setContactStatus('error'); }
    }, [contactForm]);

    // Auto-scroll to bottom — fires after DOM paint
    useEffect(() => {
        requestAnimationFrame(() => {
            bottomRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' });
        });
    }, [lines]);

    const focus = useCallback(() => inputRef.current?.focus(), []);

    /* ── Fetch spotify and render as text ── */
    const fetchSpotify = useCallback(async () => {
        try {
            const res = await fetch(SPOTIFY_API);
            const data = await res.json();
            if (data.tracks && data.tracks.length > 0) {
                const spotLines: OutputLine[] = [{ type: 'text', content: '' }];
                const seen = new Set<string>();
                const unique = data.tracks.filter((t: any) => { if (seen.has(t.name)) return false; seen.add(t.name); return true; });
                unique.slice(0, 8).forEach((t: any, i: number) => {
                    spotLines.push({ type: 'green', content: `    ${String(i + 1).padStart(2)}. ${t.name}` });
                    spotLines.push({ type: 'muted', content: `        ${t.artist} — ${t.album}` });
                });
                spotLines.push({ type: 'text', content: '' });
                setLines(prev => [...prev, ...spotLines]);
            } else {
                setLines(prev => [...prev, { type: 'muted', content: '  No tracks found.' }, { type: 'text', content: '' }]);
            }
        } catch {
            setLines(prev => [...prev, { type: 'error', content: '  Failed to fetch Spotify data.' }, { type: 'text', content: '' }]);
        }
    }, []);

    /* ── Handle interactive mode input ── */
    const handleInteractive = useCallback((raw: string): boolean => {
        if (!interactive) return false;
        const val = raw.trim();

        if (val.toLowerCase() === 'cancel' || val.toLowerCase() === 'quit') {
            setLines(prev => [...prev,
            { type: 'input', content: val },
            { type: 'muted', content: '  Cancelled.' },
            { type: 'text', content: '' },
            ]);
            setInteractive(null);
            return true;
        }

        /* -- Games chooser -- */
        if (interactive.kind === 'games') {
            if (val === '1') {
                setLines(prev => [...prev,
                { type: 'input', content: val },
                { type: 'text', content: '' },
                { type: 'accent', content: '  Number Guessing Game' },
                { type: 'text', content: '  I\'m thinking of a number between 1 and 100.' },
                { type: 'muted', content: '  Type your guess (or Ctrl+C / "quit" to exit).' },
                { type: 'text', content: '' },
                ]);
                setInteractive({ kind: 'guess', target: Math.floor(Math.random() * 100) + 1, attempts: 0 });
            } else if (val === '2') {
                const idx = Math.floor(Math.random() * TRIVIA.length);
                setLines(prev => [...prev,
                { type: 'input', content: val },
                { type: 'text', content: '' },
                { type: 'accent', content: '  Tech Trivia Quiz (5 questions)' },
                { type: 'muted', content: '  Type your answer (or Ctrl+C / "quit" to exit).' },
                { type: 'text', content: '' },
                { type: 'success', content: `  Q1: ${TRIVIA[idx].q}` },
                ]);
                setInteractive({ kind: 'trivia', qIndex: idx, score: 0, total: 5, asked: [idx] });
            } else if (val === '3') {
                const board = createBoard();
                const piece = randomPiece();
                const boardLines = renderBoard(board, piece);
                setLines(prev => [...prev,
                { type: 'input', content: val },
                { type: 'text', content: '' },
                { type: 'accent', content: '  TETRIS' },
                { type: 'muted', content: '  Commands: a=left  d=right  w=rotate  s=drop  q=quit' },
                { type: 'muted', content: '  Type a command and press Enter.' },
                { type: 'text', content: '' },
                { type: 'text', content: '  Score: 0  |  Lines: 0' },
                ...boardLines.map(l => ({ type: 'text' as LineType, content: l })),
                { type: 'text', content: '' },
                ]);
                setInteractive({ kind: 'tetris', board, piece, score: 0, linesCleared: 0, gameOver: false });
            } else {
                setLines(prev => [...prev, { type: 'input', content: val }, { type: 'error', content: '  Please pick 1, 2, or 3.' }]);
            }
            return true;
        }

        /* ── Contact form ── */
        if (interactive.kind === 'contact') {
            const step = interactive.step;
            if (step === 'name') {
                if (!val) { setLines(prev => [...prev, { type: 'input', content: val }, { type: 'error', content: '  Name cannot be empty.' }, { type: 'success', content: '  Your name:' }]); return true; }
                setLines(prev => [...prev, { type: 'input', content: val }, { type: 'success', content: '  Your email:' }]);
                setInteractive({ ...interactive, step: 'email', name: val });
            } else if (step === 'email') {
                if (!val || !val.includes('@')) { setLines(prev => [...prev, { type: 'input', content: val }, { type: 'error', content: '  Please enter a valid email.' }, { type: 'success', content: '  Your email:' }]); return true; }
                setLines(prev => [...prev, { type: 'input', content: val }, { type: 'success', content: '  Your message:' }]);
                setInteractive({ ...interactive, step: 'message', email: val });
            } else if (step === 'message') {
                if (!val) { setLines(prev => [...prev, { type: 'input', content: val }, { type: 'error', content: '  Message cannot be empty.' }, { type: 'success', content: '  Your message:' }]); return true; }
                setLines(prev => [...prev, { type: 'input', content: val }, { type: 'muted', content: '  Sending...' }]);
                // Send via FormSubmit
                const formData = new FormData();
                formData.append('name', interactive.name || '');
                formData.append('your email', interactive.email || '');
                formData.append('message', val);
                fetch('https://formsubmit.co/ajax/pratikthombare03@gmail.com', {
                    method: 'POST', body: formData, headers: { 'Accept': 'application/json' },
                }).then(r => r.json()).then(d => {
                    if (d.success) {
                        setLines(prev => [...prev, { type: 'success', content: '  [OK] Message sent! I\'ll get back to you soon.' }, { type: 'text', content: '' }]);
                    } else {
                        setLines(prev => [...prev, { type: 'error', content: '  [ERR] Failed to send. Try again later.' }, { type: 'text', content: '' }]);
                    }
                }).catch(() => {
                    setLines(prev => [...prev, { type: 'error', content: '  [ERR] Network error. Try again later.' }, { type: 'text', content: '' }]);
                });
                setInteractive(null);
            }
            return true;
        }

        /* ── Number guessing game ── */
        if (interactive.kind === 'guess') {
            const num = parseInt(val);
            if (isNaN(num)) { setLines(prev => [...prev, { type: 'input', content: val }, { type: 'error', content: '  Please enter a number.' }]); return true; }
            const attempts = interactive.attempts + 1;
            if (num === interactive.target) {
                setLines(prev => [...prev,
                { type: 'input', content: val },
                { type: 'success', content: `  Correct! You got it in ${attempts} attempt${attempts > 1 ? 's' : ''}!` },
                { type: 'text', content: '' },
                ]);
                setInteractive(null);
            } else if (num < interactive.target) {
                setLines(prev => [...prev, { type: 'input', content: val }, { type: 'accent', content: `  Higher! (Attempt ${attempts})` }]);
                setInteractive({ ...interactive, attempts });
            } else {
                setLines(prev => [...prev, { type: 'input', content: val }, { type: 'accent', content: `  Lower! (Attempt ${attempts})` }]);
                setInteractive({ ...interactive, attempts });
            }
            return true;
        }

        /* ── Trivia quiz ── */
        if (interactive.kind === 'trivia') {
            const current = TRIVIA[interactive.qIndex];
            const correct = val.toLowerCase().trim() === current.a.toLowerCase();
            const newScore = interactive.score + (correct ? 1 : 0);
            const qNum = interactive.asked.length;

            const resultLine: OutputLine = correct
                ? { type: 'success', content: '  Correct!' }
                : { type: 'error', content: `  Wrong! Answer: ${current.a}` };

            if (qNum >= interactive.total) {
                // Quiz over
                setLines(prev => [...prev,
                { type: 'input', content: val },
                    resultLine,
                { type: 'text', content: '' },
                { type: 'accent', content: `  Quiz complete! Score: ${newScore}/${interactive.total}` },
                { type: 'text', content: newScore === interactive.total ? '  Perfect score!' : newScore >= 3 ? '  Nice work!' : '  Keep learning!' },
                { type: 'text', content: '' },
                ]);
                setInteractive(null);
            } else {
                // Next question
                const remaining = TRIVIA.map((_, i) => i).filter(i => !interactive.asked.includes(i));
                const nextIdx = remaining[Math.floor(Math.random() * remaining.length)];
                setLines(prev => [...prev,
                { type: 'input', content: val },
                    resultLine,
                { type: 'text', content: '' },
                { type: 'success', content: `  Q${qNum + 1}: ${TRIVIA[nextIdx].q}` },
                ]);
                setInteractive({ ...interactive, qIndex: nextIdx, score: newScore, asked: [...interactive.asked, nextIdx] });
            }
            return true;
        }

        /* -- Tetris -- */
        if (interactive.kind === 'tetris') {
            if (interactive.gameOver) { setInteractive(null); return true; }
            const cmd = val.toLowerCase();
            let { board, piece, score, linesCleared } = interactive;

            if (cmd === 'a' || cmd === 'left') {
                if (canPlace(board, piece, -1, 0)) piece = { ...piece, x: piece.x - 1 };
            } else if (cmd === 'd' || cmd === 'right') {
                if (canPlace(board, piece, 1, 0)) piece = { ...piece, x: piece.x + 1 };
            } else if (cmd === 'w' || cmd === 'rotate') {
                const rotated = rotatePiece(piece);
                const testPiece = { ...piece, shape: rotated };
                if (canPlace(board, testPiece)) piece = testPiece;
            } else if (cmd === 's' || cmd === 'drop') {
                while (canPlace(board, piece, 0, 1)) piece = { ...piece, y: piece.y + 1 };
            } else if (cmd === 'q' || cmd === 'quit') {
                setLines(prev => [...prev,
                { type: 'input', content: val },
                { type: 'text', content: '' },
                { type: 'muted', content: `  Game ended. Score: ${score}  |  Lines: ${linesCleared}` },
                { type: 'text', content: '' },
                ]);
                setInteractive(null);
                return true;
            } else {
                setLines(prev => [...prev, { type: 'input', content: val }, { type: 'muted', content: '  Use: a=left d=right w=rotate s=drop q=quit' }]);
                return true;
            }

            // Auto-drop one step
            if (canPlace(board, piece, 0, 1)) {
                piece = { ...piece, y: piece.y + 1 };
            } else {
                // Lock piece
                board = placePiece(board, piece);
                const result = clearRows(board);
                board = result.board;
                const pts = [0, 100, 300, 500, 800][result.cleared] || 0;
                score += pts;
                linesCleared += result.cleared;
                piece = randomPiece();
                if (!canPlace(board, piece)) {
                    // Game over
                    const boardLines = renderBoard(board, piece);
                    setLines(prev => [...prev,
                    { type: 'input', content: val },
                    { type: 'text', content: '' },
                    { type: 'text', content: `  Score: ${score}  |  Lines: ${linesCleared}` },
                    ...boardLines.map(l => ({ type: 'text' as LineType, content: l })),
                    { type: 'text', content: '' },
                    { type: 'error', content: '  GAME OVER' },
                    { type: 'text', content: `  Final Score: ${score}  |  Lines Cleared: ${linesCleared}` },
                    { type: 'text', content: '' },
                    ]);
                    setInteractive(null);
                    return true;
                }
            }

            const boardLines = renderBoard(board, piece);
            setLines(prev => [...prev,
            { type: 'input', content: val },
            { type: 'text', content: '' },
            { type: 'text', content: `  Score: ${score}  |  Lines: ${linesCleared}` },
            ...boardLines.map(l => ({ type: 'text' as LineType, content: l })),
            { type: 'text', content: '' },
            ]);
            setInteractive({ ...interactive, board, piece, score, linesCleared });
            return true;
        }

        /* ── Typing test ── */
        if (interactive.kind === 'typingtest') {
            const elapsed = (Date.now() - interactive.startTime) / 1000; // seconds
            const typed = val;
            const expected = interactive.sentence;

            // Calculate accuracy
            let correct = 0;
            for (let i = 0; i < Math.min(typed.length, expected.length); i++) {
                if (typed[i] === expected[i]) correct++;
            }
            const accuracy = expected.length > 0 ? Math.round((correct / expected.length) * 100) : 0;

            // WPM: words = chars / 5, per minute
            const words = typed.length / 5;
            const wpm = elapsed > 0 ? Math.round((words / elapsed) * 60) : 0;

            const rating = wpm >= 80 ? 'Blazing fast!' : wpm >= 60 ? 'Great speed!' : wpm >= 40 ? 'Not bad!' : 'Keep practicing!';

            setLines(prev => [...prev,
            { type: 'input', content: typed },
            { type: 'text', content: '' },
            { type: 'accent', content: '  RESULTS' },
            { type: 'text', content: `  Speed:     ${wpm} WPM` },
            { type: 'text', content: `  Accuracy:  ${accuracy}%` },
            { type: 'text', content: `  Time:      ${elapsed.toFixed(1)}s` },
            { type: 'success', content: `  ${rating}` },
            { type: 'text', content: '' },
            ]);
            setInteractive(null);
            return true;
        }

        return false;
    }, [interactive]);

    /* ── Submit handler ── */
    const handleSubmit = useCallback((e: React.FormEvent) => {
        e.preventDefault();
        const raw = input;
        setInput('');

        // Interactive mode takes priority
        if (interactive) {
            if (handleInteractive(raw)) {
                return;
            }
        }

        const trimmed = raw.trim();
        const inputLine: OutputLine = { type: 'input', content: trimmed };

        // Clear = keep banner
        if (trimmed.toLowerCase() === 'clear' || trimmed.toLowerCase() === 'cls') {
            setLines(getWelcome());
            if (trimmed) setHistory(h => [trimmed, ...h]);
            setHistIdx(-1);
            return;
        }

        // History
        if (trimmed.toLowerCase() === 'history') {
            const hLines: OutputLine[] = [inputLine, { type: 'accent', content: '  Command History:' }, { type: 'text', content: '' }];
            history.forEach((cmd, i) => hLines.push({ type: 'text', content: `  ${String(i + 1).padStart(4)}  ${cmd}` }));
            if (!history.length) hLines.push({ type: 'muted', content: '  (empty)' });
            hLines.push({ type: 'text', content: '' });
            setLines(prev => [...prev, ...hLines]);
            if (trimmed) setHistory(h => [trimmed, ...h]);
            setHistIdx(-1);
            return;
        }

        // Sound on/off
        if (trimmed.toLowerCase() === 'sound on') {
            setSoundEnabled(true);
            localStorage.setItem('terminal-sound', 'on');
            setLines(prev => [...prev, inputLine, { type: 'success', content: '  Sound effects enabled.' }]);
            if (trimmed) setHistory(h => [trimmed, ...h]);
            setHistIdx(-1);
            return;
        }
        if (trimmed.toLowerCase() === 'sound off') {
            setSoundEnabled(false);
            localStorage.setItem('terminal-sound', 'off');
            setLines(prev => [...prev, inputLine, { type: 'success', content: '  Sound effects disabled.' }]);
            if (trimmed) setHistory(h => [trimmed, ...h]);
            setHistIdx(-1);
            return;
        }
        if (trimmed.toLowerCase() === 'sound') {
            setLines(prev => [...prev, inputLine, { type: 'text', content: `  Sound: ${soundEnabled ? 'on' : 'off'}` }, { type: 'muted', content: '  Usage: sound on | sound off' }]);
            if (trimmed) setHistory(h => [trimmed, ...h]);
            setHistIdx(-1);
            return;
        }

        const result = runCommand(trimmed, theme, setTheme, startTimeRef.current, wallpaper, setWallpaper);
        setLines(prev => [...prev, inputLine, ...result.lines]);
        if (trimmed) setHistory(h => [trimmed, ...h]);
        setHistIdx(-1);

        // Set interactive mode if command started one
        if (result.interactive) setInteractive(result.interactive);

        // Async fetch spotify
        if (result.fetchSpotify) fetchSpotify();
        if (soundEnabled) playEnter();
    }, [input, theme, setTheme, history, interactive, handleInteractive, fetchSpotify, soundEnabled]);

    /* ── Key handler ── */
    const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
        // Ctrl+C — cancel interactive mode or clear input
        if (e.key === 'c' && e.ctrlKey) {
            e.preventDefault();
            if (soundEnabled) playError();
            if (interactive) {
                setLines(prev => [...prev, { type: 'muted', content: '  ^C' }, { type: 'muted', content: '  Cancelled.' }, { type: 'text', content: '' }]);
                setInteractive(null);
            } else if (input) {
                setLines(prev => [...prev, { type: 'input', content: input + '^C' }]);
            }
            setInput('');
            return;
        }
        if (e.key === 'ArrowUp') {
            e.preventDefault();
            if (history.length) {
                const idx = Math.min(histIdx + 1, history.length - 1);
                setHistIdx(idx);
                setInput(history[idx]);
            }
        } else if (e.key === 'ArrowDown') {
            e.preventDefault();
            if (histIdx > 0) { const idx = histIdx - 1; setHistIdx(idx); setInput(history[idx]); }
            else { setHistIdx(-1); setInput(''); }
        } else if (e.key === 'Tab') {
            e.preventDefault();
            if (!interactive) {
                const cmds = ['help', 'about', 'skills', 'experience', 'projects', 'social', 'contact', 'spotify', 'theme', 'clear', 'games', 'echo', 'whoami', 'history', 'neofetch', 'ls', 'pwd', 'date', 'resume', 'uptime', 'sound', 'typingtest'];
                const matches = cmds.filter(c => c.startsWith(input.toLowerCase()));
                if (matches.length === 1) setInput(matches[0]);
                else if (matches.length > 1 && input) setLines(prev => [...prev, { type: 'muted', content: `  ${matches.join('  ')}` }]);
            }
        }
        if (soundEnabled && e.key.length === 1) playKey();
    }, [history, histIdx, input, interactive, soundEnabled]);

    /* ── Prompt ── */
    const Prompt = ({ children }: { children?: React.ReactNode }) => {
        // Show different prompt in interactive mode
        if (interactive) {
            let label = '>';
            if (interactive.kind === 'contact') label = `[${interactive.step}]`;
            else if (interactive.kind === 'games') label = '[game]';
            else if (interactive.kind === 'guess') label = '[guess]';
            else if (interactive.kind === 'trivia') label = '[answer]';
            else if (interactive.kind === 'tetris') label = '[tetris]';
            else if (interactive.kind === 'typingtest') label = '[type]';
            return (
                <span className="whitespace-nowrap">
                    <span className="text-term-accent font-semibold">{label}</span>
                    <span className="text-term-muted"> </span>
                    {children}
                </span>
            );
        }
        return (
            <span className="whitespace-nowrap">
                <span className="text-term-prompt font-semibold">visitor</span>
                <span className="text-term-muted">@</span>
                <span className="text-term-accent font-semibold">pratik</span>
                <span className="text-term-muted">:</span>
                <span className="text-term-accent">~</span>
                <span className="text-term-muted">$ </span>
                {children}
            </span>
        );
    };

    /* ── Render one line ── */
    const renderLine = (line: OutputLine, i: number) => {
        const base = 'font-mono whitespace-pre-wrap break-words leading-relaxed text-[13px] sm:text-sm';
        switch (line.type) {
            case 'input':
                return (
                    <div key={i} className={base}>
                        <span className="whitespace-nowrap">
                            <span className="text-term-prompt font-semibold">visitor</span>
                            <span className="text-term-muted">@</span>
                            <span className="text-term-accent font-semibold">pratik</span>
                            <span className="text-term-muted">:</span>
                            <span className="text-term-accent">~</span>
                            <span className="text-term-muted">$ </span>
                        </span>
                        <span className="text-term-text">{line.content}</span>
                    </div>
                );
            case 'ascii': return <pre key={i} className={`${base} text-term-accent text-[8px] sm:text-[11px] leading-none`}>{line.content}</pre>;
            case 'error': return <div key={i} className={`${base} text-red-500`}>{line.content}</div>;
            case 'success': return <div key={i} className={`${base} text-term-success`}>{line.content}</div>;
            case 'accent': return <div key={i} className={`${base} text-term-accent font-bold`}>{line.content}</div>;
            case 'muted': return <div key={i} className={`${base} text-term-muted`}>{line.content}</div>;
            case 'green': return <div key={i} className={`${base} text-[#1DB954]`}>{line.content}</div>;
            case 'link': return <a key={i} href={line.href} target="_blank" rel="noopener noreferrer" className={`${base} text-term-link hover:underline block cursor-pointer`}>{line.content}</a>;
            default: return <div key={i} className={`${base} text-term-text`}>{line.content || '\u00A0'}</div>;
        }
    };

    return (
        <Fragment>
            {/* ── Boot Splash Screen ── */}
            {booting && (
                <div className={`boot-screen${bootFade ? ' fade-out' : ''}`}>
                    <div className="boot-logo">{`
 ██████╗ ██████╗  █████╗ ████████╗██╗██╗  ██╗
 ██╔══██╗██╔══██╗██╔══██╗╚══██╔══╝██║██║ ██╔╝
 ██████╔╝██████╔╝███████║   ██║   ██║█████╔╝ 
 ██╔═══╝ ██╔══██╗██╔══██║   ██║   ██║██╔═██╗ 
 ██║     ██║  ██║██║  ██║   ██║   ██║██║  ██╗
 ╚═╝     ╚═╝  ╚═╝╚═╝  ╚═╝   ╚═╝   ╚═╝╚═╝  ╚═╝`.trim()}</div>
                    <div className="boot-lines">
                        {bootLines.slice(0, bootPhase).map((l, i) => (
                            <div key={i} className="boot-line" style={{ animationDelay: `${i * 0.05}s` }}>
                                <span className={l.status === 'ok' ? 'ok' : 'warn'}>[{l.status === 'ok' ? ' OK ' : 'WARN'}]</span> {l.text}
                            </div>
                        ))}
                    </div>
                    <div className="boot-progress">
                        <div className="boot-bar" style={{ width: `${(bootPhase / bootLines.length) * 100}%` }} />
                    </div>
                    <div className="boot-version">PratikOS v2.0.26 — Build 2026.02</div>
                </div>
            )}

            <div className="desktop-layout" onContextMenu={handleContextMenu}>

                {/* ── Right-click context menu ── */}
                {ctxMenu && (
                    <div className="context-menu" style={{ left: ctxMenu.x, top: ctxMenu.y }}>
                        <div className="ctx-item ctx-submenu">
                            <span><span className="ctx-icon">🎨</span>Change Wallpaper</span>
                            <span className="ctx-shortcut">▸</span>
                            <div className="ctx-sub">
                                {WALLPAPERS.map(wp => (
                                    <button key={wp} className="ctx-item" onClick={() => { setWallpaper(wp); localStorage.setItem('terminal-wallpaper', wp); setCtxMenu(null); }}>
                                        <span>{wp === 'none' ? '🚫' : wp === 'city' ? '🏙️' : wp === 'mountains' ? '⛰️' : wp === 'space' ? '🌌' : wp === 'forest' ? '🌲' : wp === 'ocean' ? '🌊' : wp === 'f1' ? '🏎️' : wp === 'cricket' ? '🏏' : ''} {wp.charAt(0).toUpperCase() + wp.slice(1)}</span>
                                        {wallpaper === wp && <span className="ctx-shortcut">✓</span>}
                                    </button>
                                ))}
                            </div>
                        </div>
                        <div className="ctx-sep" />
                        <button className="ctx-item" onClick={() => { inputRef.current?.focus(); setCtxMenu(null); }}>
                            <span><span className="ctx-icon">💻</span>Open Terminal</span>
                            <span className="ctx-shortcut">Ctrl+`</span>
                        </button>
                        <button className="ctx-item" onClick={() => { setContactOpen(true); setCtxMenu(null); }}>
                            <span><span className="ctx-icon">📧</span>Contact Me</span>
                        </button>
                        <div className="ctx-sep" />
                        <button className="ctx-item" onClick={() => { setPreviewUrl('https://drive.google.com/file/d/1VLOhNIh_EFSARD6z6wfiM8OpADZmWSq3/preview'); setPreviewTitle('Resume.pdf'); setCtxMenu(null); }}>
                            <span><span className="ctx-icon">📄</span>View Resume</span>
                        </button>
                        <a href="https://github.com/pratikt76" target="_blank" rel="noopener noreferrer" className="ctx-item" style={{ textDecoration: 'none' }}>
                            <span><span className="ctx-icon">🐙</span>GitHub</span>
                        </a>
                        <div className="ctx-sep" />
                        <button className="ctx-item" onClick={() => { window.location.reload(); }}>
                            <span><span className="ctx-icon">🔄</span>Refresh</span>
                            <span className="ctx-shortcut">F5</span>
                        </button>
                        <button className="ctx-item" onClick={() => { alert('PratikOS v2.0\nBuilt with React + TypeScript\n\n© 2026 Pratik Thombare'); setCtxMenu(null); }}>
                            <span><span className="ctx-icon">ℹ️</span>About This Desktop</span>
                        </button>
                    </div>
                )}

                {/* ── 8-bit Wallpaper with animations ── */}
                <div className={`desktop-wallpaper wallpaper-${wallpaper}`}>
                    {wallpaper === 'space' && (
                        <div className="twinkle-layer">
                            {Array.from({ length: 35 }).map((_, i) => (
                                <span key={i} style={{ left: `${Math.random() * 100}%`, top: `${Math.random() * 100}%`, animationDelay: `${Math.random() * 4}s`, animationDuration: `${2 + Math.random() * 3}s` }} />
                            ))}
                        </div>
                    )}
                    {wallpaper === 'city' && (
                        <div className="rain-layer">
                            {Array.from({ length: 40 }).map((_, i) => (
                                <span key={i} style={{ left: `${Math.random() * 100}%`, animationDelay: `${Math.random() * 2}s`, animationDuration: `${0.8 + Math.random() * 0.6}s` }} />
                            ))}
                        </div>
                    )}
                    {wallpaper === 'forest' && (
                        <div className="firefly-layer">
                            {Array.from({ length: 12 }).map((_, i) => (
                                <span key={i} style={{ left: `${10 + Math.random() * 80}%`, top: `${30 + Math.random() * 50}%`, animationDelay: `${Math.random() * 6}s`, animationDuration: `${4 + Math.random() * 4}s` }} />
                            ))}
                        </div>
                    )}
                    {wallpaper === 'f1' && <div className="stripe-layer" />}
                    {wallpaper === 'ocean' && (
                        <>
                            <div className="wave-layer" />
                            <div className="wave-layer" style={{ bottom: '25%', animationDelay: '1.5s' }} />
                            <div className="wave-layer" style={{ bottom: '30%', animationDelay: '3s' }} />
                        </>
                    )}
                </div>

                {/* ── Terminal window (draggable & resizable) ── */}
                <div
                    ref={terminalRef}
                    className={`terminal-window scanlines${isDragging ? ' dragging' : ''}${winState !== 'normal' ? ` ${winState}` : ''}`}
                    style={winState === 'maximized' ? {} : { left: winPos.x, top: winPos.y, width: winSize.w || 'auto', height: winSize.h || 'auto' }}
                    onClick={focus}
                >
                    {/* Title bar — drag handle */}
                    <div
                        className="drag-handle sticky top-0 z-50 flex items-center h-10 px-4 bg-term-titlebar border-b border-term-border select-none shrink-0"
                        style={{ borderRadius: winState === 'maximized' ? '0' : '10px 10px 0 0' }}
                        onMouseDown={winState === 'maximized' ? undefined : handleDragStart}
                    >
                        <div className="flex items-center gap-2 mr-4">
                            <span className="w-3 h-3 rounded-full bg-[#ff5f57] border border-[#e14640] window-btn cursor-pointer" onClick={(e) => { e.stopPropagation(); setWinState(s => s === 'minimized' ? 'normal' : 'minimized'); }} />
                            <span className="w-3 h-3 rounded-full bg-[#febc2e] border border-[#dfa123] window-btn cursor-pointer" onClick={(e) => { e.stopPropagation(); if (winState === 'minimized') setWinState('normal'); else setWinState('minimized'); }} />
                            <span className="w-3 h-3 rounded-full bg-[#28c840] border border-[#1aab29] window-btn cursor-pointer" onClick={(e) => { e.stopPropagation(); if (winState === 'maximized') { setWinState('normal'); } else { savedPosRef.current = { x: winPos.x, y: winPos.y, w: winSize.w, h: winSize.h }; setWinState('maximized'); } }} />
                        </div>
                        <span className="flex-1 text-center text-[11px] font-mono text-term-muted -ml-12 truncate">
                            pratik@portfolio — bash — 80×24
                        </span>
                    </div>

                    {/* Terminal body */}
                    <div ref={scrollRef} className="flex-1 overflow-y-auto px-3 sm:px-6 py-4" style={{ minHeight: 0 }}>
                        <div className="max-w-3xl space-y-0.5">
                            {lines.map((l, i) => renderLine(l, i))}
                            <form onSubmit={handleSubmit} className="flex items-center font-mono text-[13px] sm:text-sm">
                                <Prompt />
                                <input
                                    ref={inputRef} type="text" value={input}
                                    onChange={e => setInput(e.target.value)} onKeyDown={handleKeyDown}
                                    className="flex-1 bg-transparent outline-none border-none text-term-text font-mono ml-1"
                                    autoFocus autoComplete="off" autoCapitalize="off" autoCorrect="off" spellCheck={false}
                                />
                            </form>
                            <div ref={bottomRef} />
                        </div>
                    </div>

                    {/* Status bar */}
                    <div className="h-6 flex items-center justify-between px-4 text-[10px] font-mono bg-term-titlebar border-t border-term-border text-term-muted select-none shrink-0" style={{ borderRadius: '0 0 10px 10px' }}>
                        <span>{interactive ? `[${interactive.kind}]` : 'INS'}</span>
                        <div className="flex items-center gap-4">
                            <span>{history.length} cmds</span>
                            <span>UTF-8</span>
                            <span>bash</span>
                        </div>
                    </div>

                    {/* Resize handles */}
                    <div className="resize-handle resize-handle-e" onMouseDown={handleResizeStart('e')} />
                    <div className="resize-handle resize-handle-s" onMouseDown={handleResizeStart('s')} />
                    <div className="resize-handle resize-handle-se" onMouseDown={handleResizeStart('se')} />
                </div>

                {/* ── Desktop Icons ── */}
                <div className="desktop-icons">
                    <a href="https://github.com/pratikt76" target="_blank" rel="noopener noreferrer" className="desktop-icon">
                        <div className="icon-img" style={{ background: 'linear-gradient(135deg, #333, #24292e)' }}>
                            <svg width="28" height="28" viewBox="0 0 24 24" fill="white"><path d="M12 0C5.374 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0112 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z" /></svg>
                        </div>
                        <span className="icon-label">GitHub</span>
                    </a>

                    <a href="https://linkedin.com/in/pratikt76" target="_blank" rel="noopener noreferrer" className="desktop-icon">
                        <div className="icon-img" style={{ background: 'linear-gradient(135deg, #0077b5, #005582)' }}>
                            <svg width="28" height="28" viewBox="0 0 24 24" fill="white"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" /></svg>
                        </div>
                        <span className="icon-label">LinkedIn</span>
                    </a>

                    <button onClick={() => { setPreviewUrl('https://drive.google.com/file/d/1VLOhNIh_EFSARD6z6wfiM8OpADZmWSq3/preview'); setPreviewTitle('Resume.pdf'); }} className="desktop-icon" style={{ border: 'none', background: 'none' }}>
                        <div className="icon-img" style={{ background: 'linear-gradient(135deg, #ea4335, #c5221f)' }}>
                            <svg width="28" height="28" viewBox="0 0 24 24" fill="white"><path d="M14 2H6c-1.1 0-2 .9-2 2v16c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V8l-6-6zM6 20V4h7v5h5v11H6zm3-7h6v1.5H9V13zm0 3h6v1.5H9V16zm0-6h4v1.5H9V10z" /></svg>
                        </div>
                        <span className="icon-label">Resume.pdf</span>
                    </button>

                    <button onClick={() => setContactOpen(true)} className="desktop-icon" style={{ border: 'none', background: 'none' }}>
                        <div className="icon-img" style={{ background: 'linear-gradient(135deg, #4285f4, #34a853)' }}>
                            <svg width="28" height="28" viewBox="0 0 24 24" fill="white"><path d="M20 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z" /></svg>
                        </div>
                        <span className="icon-label">Mail Me</span>
                    </button>

                    <a href="https://instagram.com/pratik.76" target="_blank" rel="noopener noreferrer" className="desktop-icon">
                        <div className="icon-img" style={{ background: 'linear-gradient(135deg, #f09433, #e6683c, #dc2743, #cc2366, #bc1888)' }}>
                            <svg width="28" height="28" viewBox="0 0 24 24" fill="white"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" /></svg>
                        </div>
                        <span className="icon-label">Instagram</span>
                    </a>
                </div>

                {/* ── Desktop Widgets ── */}
                <div className="desktop-widgets">
                    {/* Clock */}
                    <div className="widget-card widget-clock">
                        <div className="clock-time">
                            {clockTime.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true })}
                        </div>
                        <div className="clock-date">
                            {clockTime.toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' })}
                        </div>
                    </div>

                    {/* Calendar */}
                    <div className="widget-card widget-calendar">
                        <div className="cal-header">
                            {clockTime.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                        </div>
                        <div className="cal-grid">
                            {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map(d => (
                                <span key={d} className="cal-day-name">{d}</span>
                            ))}
                            {(() => {
                                const year = clockTime.getFullYear();
                                const month = clockTime.getMonth();
                                const firstDay = new Date(year, month, 1).getDay();
                                const daysInMonth = new Date(year, month + 1, 0).getDate();
                                const today = clockTime.getDate();
                                const cells = [];
                                for (let i = 0; i < firstDay; i++) cells.push(<span key={`e${i}`} className="cal-day empty" />);
                                for (let d = 1; d <= daysInMonth; d++) cells.push(<span key={d} className={`cal-day${d === today ? ' today' : ''}`}>{d}</span>);
                                return cells;
                            })()}
                        </div>
                    </div>

                    {/* Spotify */}
                    {spWidget && (
                        <a href={spWidget.url} target="_blank" rel="noopener noreferrer" className="widget-card widget-spotify" style={{ textDecoration: 'none' }}>
                            <div className="sp-header">
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="#1db954"><path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z" /></svg>
                                <span>Now Playing</span>
                            </div>
                            <div className="sp-track">
                                {spWidget.art && <img className="sp-art" src={spWidget.art} alt="" />}
                                <div className="sp-info">
                                    <div className="sp-name">{spWidget.name}</div>
                                    <div className="sp-artist">{spWidget.artist}</div>
                                </div>
                            </div>
                        </a>
                    )}
                </div>
            </div>

            {/* ── Preview Window (iframe) ── */}
            {previewUrl && (
                <div className="preview-overlay" onClick={(e) => { if (e.target === e.currentTarget) { setPreviewUrl(null); setPreviewTitle(''); } }}>
                    <div className="preview-window">
                        <div className="preview-titlebar">
                            <div className="flex items-center gap-2 mr-3">
                                <span className="w-3 h-3 rounded-full bg-[#ff5f57] border border-[#e14640] cursor-pointer" onClick={() => { setPreviewUrl(null); setPreviewTitle(''); }} />
                                <span className="w-3 h-3 rounded-full bg-[#febc2e] border border-[#dfa123]" />
                                <span className="w-3 h-3 rounded-full bg-[#28c840] border border-[#1aab29]" />
                            </div>
                            <span className="flex-1 text-center text-[11px] font-mono" style={{ color: 'var(--term-muted)' }}>
                                {previewTitle}
                            </span>
                            <a href={previewUrl} target="_blank" rel="noopener noreferrer" className="open-tab-btn">
                                Open in Tab ↗
                            </a>
                        </div>
                        <iframe src={previewUrl} title={previewTitle} />
                    </div>
                </div>
            )}

            {/* ── Contact Modal ── */}
            {contactOpen && (
                <div className="contact-modal-overlay" onClick={(e) => { if (e.target === e.currentTarget) setContactOpen(false); }}>
                    <div className="contact-modal">
                        <div className="modal-titlebar">
                            <div className="flex items-center gap-2 mr-3">
                                <span className="w-3 h-3 rounded-full bg-[#ff5f57] border border-[#e14640] cursor-pointer" onClick={() => { setContactOpen(false); setContactStatus('idle'); }} />
                                <span className="w-3 h-3 rounded-full bg-[#febc2e] border border-[#dfa123]" />
                                <span className="w-3 h-3 rounded-full bg-[#28c840] border border-[#1aab29]" />
                            </div>
                            <span className="flex-1 text-center text-[11px] font-mono" style={{ color: 'var(--term-muted)' }}>
                                Contact — Mail Me
                            </span>
                        </div>
                        <div className="modal-body">
                            {contactStatus === 'sent' ? (
                                <div className="text-center py-6">
                                    <div className="text-3xl mb-3">✅</div>
                                    <div className="text-sm font-mono" style={{ color: 'var(--term-success)' }}>Message sent!</div>
                                    <div className="text-xs font-mono mt-1" style={{ color: 'var(--term-muted)' }}>I'll get back to you soon.</div>
                                </div>
                            ) : (
                                <form onSubmit={handleContactSubmit}>
                                    <label>Name</label>
                                    <input type="text" placeholder="Your name" value={contactForm.name} onChange={e => setContactForm(f => ({ ...f, name: e.target.value }))} required />
                                    <label>Email</label>
                                    <input type="email" placeholder="you@example.com" value={contactForm.email} onChange={e => setContactForm(f => ({ ...f, email: e.target.value }))} required />
                                    <label>Message</label>
                                    <textarea placeholder="Say something nice..." value={contactForm.message} onChange={e => setContactForm(f => ({ ...f, message: e.target.value }))} required />
                                    {contactStatus === 'error' && <div className="text-xs font-mono mb-3" style={{ color: '#ef4444' }}>Failed to send. Please try again.</div>}
                                    <button type="submit" className="modal-btn" disabled={contactStatus === 'sending'}>{contactStatus === 'sending' ? 'Sending...' : 'Send Message'}</button>
                                </form>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </Fragment>
    );
}
