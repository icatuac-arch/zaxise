"use client";

import { useEffect, useState } from "react";
import { Clock, Sun, Moon, Loader2 } from "lucide-react";

interface CityTime {
  city: string;
  timezone: string;
  flag: string;
}

const CITIES: CityTime[] = [
  { city: "New York", timezone: "America/New_York", flag: "🇺🇸" },
  { city: "London", timezone: "Europe/London", flag: "🇬🇧" },
  { city: "Mumbai", timezone: "Asia/Kolkata", flag: "🇮🇳" },
  { city: "Tokyo", timezone: "Asia/Tokyo", flag: "🇯🇵" },
  { city: "Dubai", timezone: "Asia/Dubai", flag: "🇦🇪" },
  { city: "Sydney", timezone: "Australia/Sydney", flag: "🇦🇺" },
  { city: "San Francisco", timezone: "America/Los_Angeles", flag: "🇺🇸" },
  { city: "Singapore", timezone: "Asia/Singapore", flag: "🇸🇬" },
];

interface ClockData {
  time: string;
  date: string;
  hour: number;
}

function getTimeInZone(tz: string): ClockData {
  const now = new Date();
  const time = now.toLocaleTimeString("en-US", {
    timeZone: tz,
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });
  const date = now.toLocaleDateString("en-US", {
    timeZone: tz,
    weekday: "short",
    month: "short",
    day: "numeric",
  });
  const hour = parseInt(
    now.toLocaleTimeString("en-US", {
      timeZone: tz,
      hour: "numeric",
      hour12: false,
    })
  );
  return { time, date, hour };
}

export default function WorldClockPane() {
  const [clocks, setClocks] = useState<Map<string, ClockData> | null>(null);

  useEffect(() => {
    const update = () => {
      const map = new Map<string, ClockData>();
      for (const city of CITIES) {
        map.set(city.city, getTimeInZone(city.timezone));
      }
      setClocks(map);
    };
    update();
    const interval = setInterval(update, 60000);
    return () => clearInterval(interval);
  }, []);

  return (
    <section className="rounded-2xl border border-border bg-surface/50 p-6">
      <div className="flex items-center gap-3 mb-5">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-violet-500">
          <Clock className="h-5 w-5 text-white" />
        </div>
        <div>
          <h2 className="text-lg font-bold">World Clock</h2>
          <p className="text-xs text-muted">Current time around the globe</p>
        </div>
      </div>

      {!clocks ? (
        <div className="flex items-center justify-center py-8">
          <Loader2 className="h-5 w-5 animate-spin text-muted" />
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
          {CITIES.map((city) => {
            const data = clocks.get(city.city);
            if (!data) return null;
            const daytime = data.hour >= 6 && data.hour < 18;
            return (
              <div
                key={city.city}
                className={`rounded-xl border border-border p-3 text-center transition-colors ${
                  daytime
                    ? "bg-gradient-to-b from-sky-500/5 to-transparent"
                    : "bg-gradient-to-b from-indigo-500/5 to-transparent"
                }`}
              >
                <div className="flex items-center justify-center gap-1 mb-1">
                  <span className="text-sm">{city.flag}</span>
                  {daytime ? (
                    <Sun className="h-3 w-3 text-yellow-400" />
                  ) : (
                    <Moon className="h-3 w-3 text-blue-400" />
                  )}
                </div>
                <p className="text-lg font-bold tabular-nums">{data.time}</p>
                <p className="text-[10px] font-medium text-muted">
                  {city.city}
                </p>
                <p className="text-[10px] text-muted/60">{data.date}</p>
              </div>
            );
          })}
        </div>
      )}
    </section>
  );
}
