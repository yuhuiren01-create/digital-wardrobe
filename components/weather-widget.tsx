"use client";

import { useEffect, useState } from "react";

import { cn } from "@/lib/utils";
import { DEFAULT_LOCATION, fetchWeather, type WeatherSnapshot } from "@/lib/weather";

export function WeatherWidget() {
  const [weather, setWeather] = useState<WeatherSnapshot | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      try {
        let loc = DEFAULT_LOCATION;
        try {
          const pos = await new Promise<GeolocationPosition>(
            (resolve, reject) => {
              navigator.geolocation.getCurrentPosition(resolve, reject, {
                timeout: 5000,
                maximumAge: 300_000,
              });
            },
          );
          loc = {
            latitude: pos.coords.latitude,
            longitude: pos.coords.longitude,
            name: "当前位置",
          };
        } catch {
          // fallback silently
        }

        const data = await fetchWeather(
          loc.latitude,
          loc.longitude,
          loc.name,
        );
        if (!cancelled) setWeather(data);
      } catch (e) {
        if (!cancelled) {
          setError(e instanceof Error ? e.message : "获取天气失败");
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    load();
    return () => {
      cancelled = true;
    };
  }, []);

  if (loading) {
    return (
      <div className="flex items-center gap-3 rounded-xl border border-border bg-muted/30 px-4 py-3 text-sm text-muted-foreground">
        <span className="inline-block h-4 w-4 animate-pulse rounded-full bg-muted-foreground/30" />
        正在获取天气...
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center gap-2 rounded-xl border border-border bg-muted/30 px-4 py-3 text-sm text-muted-foreground">
        <span>⚠️</span> 天气加载失败
      </div>
    );
  }

  if (!weather) return null;

  return (
    <section
      className={cn(
        "flex items-center gap-4 rounded-xl border border-border px-4 py-3",
        "bg-gradient-to-r from-sky-50 to-transparent dark:from-sky-950/20",
      )}
    >
      <div className="text-3xl leading-none">{weather.icon}</div>
      <div className="flex flex-col">
        <span className="text-lg font-semibold leading-none">
          {weather.tempC}°C
        </span>
        <span className="mt-0.5 text-xs text-muted-foreground">
          {weather.city} · {weather.description} · 体感 {weather.feelsLikeC}°
        </span>
      </div>
      <div className="ml-auto flex flex-col items-end text-xs text-muted-foreground">
        <span>
          最高 {weather.high}° 最低 {weather.low}°
        </span>
        <span>湿度 {weather.humidity}%</span>
      </div>
    </section>
  );
}
