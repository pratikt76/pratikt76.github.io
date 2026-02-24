import React, { useEffect, useState } from 'react';
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

    useEffect(() => {
        const fetchTracks = () => {
            fetch(SPOTIFY_API_URL)
                .then((res) => res.json())
                .then((data) => {
                    if (data.tracks) {
                        // Deduplicate by track name
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

        // Initial fetch
        fetchTracks();

        // Re-fetch every 60 seconds
        const intervalId = setInterval(fetchTracks, 60_000);
        return () => clearInterval(intervalId);
    }, []);

    if (error) return null; // Silently hide section if API fails

    return (
        <section aria-label="recently played on spotify">
            <h3 className="text-xl font-semibold mb-6 flex items-center gap-2.5">
                <svg className="w-5 h-5 text-[#1DB954]" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z" />
                </svg>
                <span className="text-zinc-600 dark:text-zinc-400">Recently Played</span>
            </h3>

            {loading ? (
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-5">
                    {[...Array(4)].map((_, i) => (
                        <div key={i} className="animate-pulse">
                            <div className="w-full aspect-square bg-black/[0.05] dark:bg-white/[0.05] rounded-2xl mb-3" />
                            <div className="h-3 bg-black/[0.05] dark:bg-white/[0.05] rounded w-3/4 mb-2" />
                            <div className="h-2.5 bg-black/[0.05] dark:bg-white/[0.05] rounded w-1/2" />
                        </div>
                    ))}
                </div>
            ) : (
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-5">
                    {tracks.slice(0, 4).map((track, index) => (
                        <motion.a
                            key={track.name}
                            href={track.spotifyUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.08, duration: 0.5, ease: 'easeOut' }}
                            whileHover={{ y: -4, scale: 1.02 }}
                            className="group cursor-pointer"
                        >
                            <div className="relative w-full aspect-square mb-3 rounded-2xl overflow-hidden bg-black/[0.03] dark:bg-white/[0.03] border border-black/[0.06] dark:border-white/[0.05] transition-colors">
                                <img
                                    src={track.albumArt}
                                    alt={track.album}
                                    className="w-full h-full object-cover transition-all duration-500 group-hover:scale-110 group-hover:brightness-75"
                                    loading="lazy"
                                />
                                {/* Play overlay */}
                                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                    <div className="w-12 h-12 bg-[#1DB954] rounded-full flex items-center justify-center shadow-lg shadow-[#1DB954]/30">
                                        <svg className="w-5 h-5 text-black ml-0.5" viewBox="0 0 24 24" fill="currentColor">
                                            <path d="M8 5v14l11-7z" />
                                        </svg>
                                    </div>
                                </div>
                            </div>
                            <p className="text-sm font-medium text-zinc-800 dark:text-zinc-100 truncate group-hover:text-[#1DB954] transition-colors">
                                {track.name}
                            </p>
                            <p className="text-xs text-zinc-500 truncate mt-0.5">
                                {track.artist}
                            </p>
                        </motion.a>
                    ))}
                </div>
            )}
        </section>
    );
}
