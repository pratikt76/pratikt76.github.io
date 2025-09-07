import { useEffect, useState } from "react";

export default function Footer() {
  const [time, setTime] = useState(new Date());
  const [temp, setTemp] = useState<string | null>(null);

  useEffect(() => {
    // update clock every minute
    const interval = setInterval(() => setTime(new Date()), 60000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    // fetch Pune weather from Open-Meteo API
    fetch(
      "https://api.open-meteo.com/v1/forecast?latitude=18.5204&longitude=73.8567&current_weather=true"
    )
      .then((res) => res.json())
      .then((data) => {
        if (data?.current_weather?.temperature) {
          setTemp(`${data.current_weather.temperature}°C`);
        }
      })
      .catch(() => setTemp(null));
  }, []);

  return (
    <footer className="mt-16 text-sm text-zinc-500 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
      <span>
        {time.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })} · Pune
      </span>
      <span>{temp ? `Currently ${temp}` : "Loading weather..."}</span>
      <span>© {new Date().getFullYear()} pratik.dev</span>
    </footer>
  );
}
