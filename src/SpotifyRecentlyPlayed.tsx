import React, { useEffect, useState, useRef } from 'react';
import { motion } from 'framer-motion';

interface SpotifyTrack {
    name: string;
    artist: string;
    album: string;
    albumArt: string;
    spotifyUrl: string;
    playedAt: string;
}

const SPOTIFY_API_URL = 'https://spotify-api-khaki.vercel.app/api/spotify';

export default function SpotifyRecentlyPlayed() {
    const [tracks, setTracks] = useState<SpotifyTrack[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);
    const marqueeRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const fetchTracks = () => {
            fetch(SPOTIFY_API_URL)
                .then((res) => res.json())
                .then((data) => {
                    if (data.tracks) {
                        const seen = new Set<string>();
                        const unique = data.tracks.filter((t: SpotifyTrack) => {
                            if (seen.has(t.name)) return false;
                            seen.add(t.name);
                            return true;
                        });
                        setTracks(unique);
                    } else {
                        setError(true);
                    }
                })
                .catch(() => setError(true))
                .finally(() => setLoading(false));
        };

        fetchTracks();
        const intervalId = setInterval(fetchTracks, 60_000);
        return () => clearInterval(intervalId);
    }, []);

    if (error || (!loading && tracks.length === 0)) return null;

    // Duplicate tracks for seamless infinite scroll
    const displayTracks = [...tracks, ...tracks, ...tracks];

    return (
        <section aria-label="recently played on spotify" className="w-full overflow-hidden">
            {/* Label */}
            <div className="flex items-center gap-2.5 mb-5">
                <svg className="w-4 h-4 text-[#1DB954]" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z" />
                </svg>
                <span className="text-[11px] font-semibold tracking-[0.15em] uppercase text-zinc-500 dark:text-zinc-500">
                    Recently Played
                </span>
            </div>

            {loading ? (
                /* Skeleton loader */
                <div className="flex gap-4 animate-pulse">
                    {[...Array(5)].map((_, i) => (
                        <div key={i} className="flex items-center gap-2.5 px-4 py-2.5 rounded-full bg-white/[0.03] border border-white/[0.05] shrink-0">
                            <div className="w-8 h-8 rounded-full bg-white/[0.06]" />
                            <div className="flex flex-col gap-1.5">
                                <div className="h-2.5 w-20 bg-white/[0.06] rounded" />
                                <div className="h-2 w-14 bg-white/[0.04] rounded" />
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                /* Marquee ticker */
                <div className="relative">
                    {/* Fade edges */}
                    <div className="absolute left-0 top-0 bottom-0 w-16 bg-gradient-to-r from-[#fafafa] dark:from-[#030303] to-transparent z-10 pointer-events-none" />
                    <div className="absolute right-0 top-0 bottom-0 w-16 bg-gradient-to-l from-[#fafafa] dark:from-[#030303] to-transparent z-10 pointer-events-none" />

                    <div
                        ref={marqueeRef}
                        className="flex items-center gap-0 marquee-track hover:[animation-play-state:paused]"
                    >
                        {displayTracks.map((track, index) => (
                            <React.Fragment key={`${track.name}-${index}`}>
                                {/* Track pill */}
                                <a
                                    href={track.spotifyUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex items-center gap-3 px-4 py-2.5 rounded-full bg-black/[0.03] dark:bg-white/[0.03] border border-black/[0.06] dark:border-white/[0.05] hover:bg-black/[0.06] dark:hover:bg-white/[0.06] hover:border-black/[0.12] dark:hover:border-white/[0.1] transition-all duration-300 shrink-0 group cursor-pointer"
                                >
                                    {/* Circular album art */}
                                    <img
                                        src={track.albumArt}
                                        alt={track.album}
                                        className="w-8 h-8 rounded-full object-cover ring-1 ring-black/[0.08] dark:ring-white/[0.08] group-hover:ring-[#1DB954]/50 transition-all duration-300"
                                        loading="lazy"
                                    />
                                    {/* Track info */}
                                    <div className="flex flex-col">
                                        <span className="text-[13px] font-medium text-zinc-800 dark:text-zinc-200 whitespace-nowrap group-hover:text-[#1DB954] transition-colors duration-300">
                                            {track.name}
                                        </span>
                                        <span className="text-[11px] text-zinc-400 dark:text-zinc-500 whitespace-nowrap">
                                            {track.artist}
                                        </span>
                                    </div>
                                </a>

                                {/* Spotify green dot separator */}
                                <span className="mx-3 shrink-0">
                                    <span className="block w-1 h-1 rounded-full bg-[#1DB954]/40" />
                                </span>
                            </React.Fragment>
                        ))}
                    </div>
                </div>
            )}

            {/* Marquee animation styles */}
            <style>{`
                @keyframes marquee-scroll {
                    0% { transform: translateX(0); }
                    100% { transform: translateX(-33.333%); }
                }
                .marquee-track {
                    animation: marquee-scroll 30s linear infinite;
                    width: max-content;
                }
                .marquee-track:hover {
                    animation-play-state: paused;
                }
            `}</style>
        </section>
    );
}
