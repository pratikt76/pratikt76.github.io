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
                if (map[args[0]]) return runCommand(map[args[0]], theme, setTheme, startTime);
            }
            return { lines: [{ type: 'error', content: `  cat: ${args[0] || ''}: No such file` }] };
        case 'cd':
            if (args[0]?.replace('/', '') === 'projects') return runCommand('projects', theme, setTheme, startTime);
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

    const scrollRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);
    const bottomRef = useRef<HTMLDivElement>(null);

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

        const result = runCommand(trimmed, theme, setTheme, startTimeRef.current);
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
            <div className="scanlines min-h-screen flex flex-col bg-term-bg transition-colors duration-300" onClick={focus}>

                {/* ── Title bar ── */}
                <div className="sticky top-0 z-50 flex items-center h-10 px-4 bg-term-titlebar border-b border-term-border select-none shrink-0">
                    <div className="flex items-center gap-2 mr-4">
                        <span className="w-3 h-3 rounded-full bg-[#ff5f57] border border-[#e14640]" />
                        <span className="w-3 h-3 rounded-full bg-[#febc2e] border border-[#dfa123]" />
                        <span className="w-3 h-3 rounded-full bg-[#28c840] border border-[#1aab29]" />
                    </div>
                    <span className="flex-1 text-center text-[11px] font-mono text-term-muted -ml-12 truncate">
                        pratik@portfolio — bash — 80×24
                    </span>
                </div>

                {/* ── Terminal body ── */}
                <div ref={scrollRef} className="flex-1 overflow-y-auto px-3 sm:px-6 py-4" style={{ minHeight: 0 }}>
                    <div className="max-w-3xl mx-auto space-y-0.5">
                        {lines.map((l, i) => renderLine(l, i))}

                        {/* Active input */}
                        <form onSubmit={handleSubmit} className="flex items-center font-mono text-[13px] sm:text-sm">
                            <Prompt />
                            <input
                                ref={inputRef}
                                type="text"
                                value={input}
                                onChange={e => setInput(e.target.value)}
                                onKeyDown={handleKeyDown}
                                className="flex-1 bg-transparent outline-none border-none text-term-text font-mono ml-1"
                                autoFocus autoComplete="off" autoCapitalize="off" autoCorrect="off" spellCheck={false}
                            />
                        </form>
                        <div ref={bottomRef} />
                    </div>
                </div>

                {/* ── Status bar ── */}
                <div className="h-6 flex items-center justify-between px-4 text-[10px] font-mono bg-term-titlebar border-t border-term-border text-term-muted select-none shrink-0">
                    <span>{interactive ? `[${interactive.kind}]` : 'INS'}</span>
                    <div className="flex items-center gap-4">
                        <span>{history.length} cmds</span>
                        <span>UTF-8</span>
                        <span>bash</span>
                    </div>
                </div>
            </div>
        </Fragment>
    );
}
