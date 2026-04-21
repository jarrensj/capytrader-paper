"use client";

import { useEffect, useState } from "react";

// Irvine, CA
const IRVINE_LAT = 33.6846;
const IRVINE_LON = -117.8265;

// WMO weather codes that indicate rain/drizzle/thunderstorms.
// https://open-meteo.com/en/docs (see "Weather variable documentation")
const RAIN_CODES = new Set([
  51, 53, 55, 56, 57, // drizzle
  61, 63, 65, 66, 67, // rain
  80, 81, 82,         // rain showers
  95, 96, 99,         // thunderstorm
]);

const REFRESH_MS = 10 * 60 * 1000;

export function useWeather() {
  const [isRaining, setIsRaining] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    const fetchWeather = async () => {
      try {
        const url =
          `https://api.open-meteo.com/v1/forecast` +
          `?latitude=${IRVINE_LAT}&longitude=${IRVINE_LON}` +
          `&current=precipitation,weather_code`;
        const res = await fetch(url);
        if (!res.ok) throw new Error(`weather ${res.status}`);
        const data = await res.json();
        const precipitation = Number(data?.current?.precipitation ?? 0);
        const code = Number(data?.current?.weather_code ?? 0);
        if (cancelled) return;
        setIsRaining(precipitation > 0 || RAIN_CODES.has(code));
      } catch {
        if (cancelled) return;
        setIsRaining(false);
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    fetchWeather();
    const id = setInterval(fetchWeather, REFRESH_MS);
    return () => {
      cancelled = true;
      clearInterval(id);
    };
  }, []);

  return { isRaining, loading };
}
