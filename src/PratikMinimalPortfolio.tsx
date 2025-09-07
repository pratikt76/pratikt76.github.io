import React, { Fragment, useState, useEffect } from 'react';
import { ArrowUpRight } from 'lucide-react';
import Footer from "./Footer";

const greetings = ['hey', 'hola', 'hallo', 'hi', 'yo', 'sup', 'ciao', 'namaste'];

const FACTS: { id: string; content: React.ReactNode; href?: string }[] = [
  {
    id: 'edu',
    content: (
      <>
        Graduated from <span className="font-medium">College of Engineering Pune (Electronics &amp; Telecommunication)</span> 🎓 — now shipping backend systems that actually stay up (someone has to, right?).
      </>
    ),
  },
  {
    id: 'sports',
    content: (
      <>
        Big fan of <span className="font-medium">F1 strategy</span> 🏎️ and <span className="font-medium">clutch cricket finishes</span> 🏏 — I like my code as precise as the final lap.
      </>
    ),
  },
  {
    id: 'cinema',
    content: (
      <>
        Cinema buff 🍿 — <span className="font-medium">see what I’m watching</span>.
      </>
    ),
    href: 'https://app.tvtime.com/user/51516957',
  },
  {
    id: 'insta',
    content: (
      <>
        Peek behind the scenes — <span className="underline decoration-zinc-600 hover:decoration-zinc-100">
          follow me on Instagram 📸
        </span>, where random shots and music collide.
      </>
    ),
    href: 'https://instagram.com/pratik.76',
  },
];

const LINKS = [
  { label: 'GitHub', href: 'https://github.com/pratikt76' },
  { label: 'LinkedIn', href: 'https://linkedin.com/in/pratikt76' },
  { label: 'Email', href: 'mailto:psthombare03@gmail.com' },
  { label: 'Resume', href: '#resume' },
];

export default function PratikMinimalPortfolio(): JSX.Element {
  const [greeting, setGreeting] = useState(greetings[0]);

  useEffect(() => {
    const randomIndex = Math.floor(Math.random() * greetings.length);
    setGreeting(greetings[randomIndex]);
  }, []);

  return (
    <Fragment>
      <main className="min-h-screen bg-zinc-950 text-zinc-100 selection:bg-white selection:text-black">
        <div className="max-w-4xl mx-auto px-6 py-16 sm:py-24">
          {/* Header */}
          <header className="mb-10">
            <h1 className="text-4xl sm:text-6xl font-semibold tracking-tight leading-[1.05]">
              {greeting}! i'm <span className="underline decoration-4 decoration-zinc-100 underline-offset-4">pratik</span> :)
            </h1>
            <p className="mt-5 text-lg sm:text-xl text-zinc-400 max-w-prose">
              SDE @Bajaj Finserv. Spring Boot developer with frontend know-how — I build reliable backend systems and ship pragmatic, maintainable solutions.
            </p>
          </header>

          {/* Facts */}
          <section aria-label="fast facts" className="space-y-4">
            {FACTS.map((f) => (
              <Fact key={f.id} content={f.content} href={f.href} />
            ))}
          </section>

          <hr className="my-10 border-zinc-800" />

          {/* Projects */}
          <section aria-label="projects" className="mt-6">
            <h2 className="text-2xl font-semibold mb-6">Projects 🚀</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <article className="bg-zinc-900 p-6 rounded-2xl shadow-sm hover:shadow-md transition">
                <h3 className="text-lg font-semibold">Parkin</h3>
                <p className="mt-2 text-zinc-400 text-sm">
                  Smart parking management system — optimizing slot allocation and availability tracking.
                </p>
                <div className="mt-4 flex gap-3">
                  <a
                    href="https://github.com/pratikt76/Parkin"
                    className="inline-flex items-center gap-2 text-sm underline underline-offset-4 decoration-zinc-600 hover:decoration-zinc-200"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    GitHub <ArrowUpRight className="w-3 h-3" />
                  </a>
                  <a
                    href="https://github.com/pratikt76/Parkin/blob/main/README.md"
                    className="inline-flex items-center gap-2 text-sm underline underline-offset-4 decoration-zinc-600 hover:decoration-zinc-200"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Live Demo <ArrowUpRight className="w-3 h-3" />
                  </a>
                </div>
              </article>

              <article className="bg-zinc-900 p-6 rounded-2xl shadow-sm hover:shadow-md transition">
                <h3 className="text-lg font-semibold">VelocityCSS</h3>
                <p className="mt-2 text-zinc-400 text-sm">
                  Lightweight CSS utility framework — faster styling without unnecessary bloat.
                </p>
                <div className="mt-4 flex gap-3">
                  <a
                    href="https://github.com/pratikt76/VelocityCSS"
                    className="inline-flex items-center gap-2 text-sm underline underline-offset-4 decoration-zinc-600 hover:decoration-zinc-200"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    GitHub <ArrowUpRight className="w-3 h-3" />
                  </a>
                  <a
                    href="https://pratikt76.github.io/VelocityCSS/"
                    className="inline-flex items-center gap-2 text-sm underline underline-offset-4 decoration-zinc-600 hover:decoration-zinc-200"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Live Demo <ArrowUpRight className="w-3 h-3" />
                  </a>
                </div>
              </article>
            </div>
          </section>

          <hr className="my-10 border-zinc-800" />

          {/* Links */}
          <nav className="flex flex-wrap gap-x-6 gap-y-3 text-base">
            {LINKS.map((l) => (
              <a
                key={l.label}
                href={l.href}
                className="group inline-flex items-center gap-1 underline underline-offset-4 decoration-zinc-700 hover:decoration-zinc-100"
                target="_blank"
                rel="noopener noreferrer"
              >
                {l.label}
                <ArrowUpRight className="w-3 h-3" />
              </a>
            ))}
          </nav>

          <Footer />

        </div>
      </main>
    </Fragment>
  );
}

function Fact({ content, href }: { content: React.ReactNode; href?: string }) {
  if (href) {
    return (
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className="block p-0.5 -m-0.5 rounded text-lg sm:text-xl leading-snug underline underline-offset-4 decoration-zinc-600 hover:decoration-zinc-200"
      >
        {content}
      </a>
    );
  }
  return <div className="block p-0.5 -m-0.5 text-lg sm:text-xl leading-snug">{content}</div>;
}
