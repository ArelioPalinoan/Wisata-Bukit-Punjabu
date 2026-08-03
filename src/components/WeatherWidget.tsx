'use client';

import React, { useState, useEffect, useCallback } from 'react';
import {
  CloudSun,
  Sun,
  Cloud,
  CloudRain,
  CloudFog,
  CloudLightning,
  Sunrise,
  Thermometer,
  Droplets,
  AlertCircle,
  RefreshCw,
  Wind,
  Radio
} from 'lucide-react';

interface WeatherData {
  temp: number;
  tempMin: number;
  tempMax: number;
  humidity: number;
  cloudCover: number;
  windSpeed: number;
  weatherCode: number;
  sunriseTime: string;
  cloudSeaChance: number;
  cloudSeaCategory: string;
  weatherDesc: string;
  updatedAt: string;
  isLive: boolean;
}

const WMO_WEATHER_MAP: Record<number, { label: string; icon: React.ComponentType<{ className?: string }> }> = {
  0: { label: 'Cerah', icon: Sun },
  1: { label: 'Cerah Berawan', icon: CloudSun },
  2: { label: 'Berawan Sebagian', icon: CloudSun },
  3: { label: 'Berawan Tebal', icon: Cloud },
  45: { label: 'Kabut Berembun', icon: CloudFog },
  48: { label: 'Kabut Tebal', icon: CloudFog },
  51: { label: 'Gerimis Ringan', icon: CloudRain },
  53: { label: 'Gerimis Sedang', icon: CloudRain },
  55: { label: 'Gerimis Lebat', icon: CloudRain },
  61: { label: 'Hujan Ringan', icon: CloudRain },
  63: { label: 'Hujan Sedang', icon: CloudRain },
  65: { label: 'Hujan Lebat', icon: CloudRain },
  80: { label: 'Hujan Lokal', icon: CloudRain },
  81: { label: 'Hujan Deras', icon: CloudRain },
  95: { label: 'Hujan Badai', icon: CloudLightning },
};

function calculateCloudSeaProbability(humidity: number, cloudCover: number, windSpeed: number): { chance: number; category: string } {
  let score = 0;

  // Humidity weight (max 45 points)
  if (humidity >= 90) score += 45;
  else if (humidity >= 80) score += 38;
  else if (humidity >= 70) score += 28;
  else score += (humidity / 70) * 20;

  // Cloud cover weight (max 35 points) - ideal is 50-85%
  if (cloudCover >= 50 && cloudCover <= 85) score += 35;
  else if (cloudCover > 85) score += 28;
  else score += (cloudCover / 50) * 30;

  // Wind speed weight (max 20 points) - lower wind retains cloud sea
  if (windSpeed <= 6) score += 20;
  else if (windSpeed <= 12) score += 15;
  else if (windSpeed <= 20) score += 8;
  else score += 2;

  const chance = Math.min(99, Math.max(15, Math.round(score)));

  let category = 'Rendah';
  if (chance >= 80) category = 'Sangat Tinggi';
  else if (chance >= 65) category = 'Tinggi';
  else if (chance >= 45) category = 'Sedang';

  return { chance, category };
}

const DEFAULT_WEATHER: WeatherData = {
  temp: 23,
  tempMin: 21,
  tempMax: 26,
  humidity: 85,
  cloudCover: 80,
  windSpeed: 7,
  weatherCode: 2,
  sunriseTime: '06:03 WITA',
  cloudSeaChance: 88,
  cloudSeaCategory: 'Sangat Tinggi',
  weatherDesc: 'Cerah Berawan',
  updatedAt: 'Data Default',
  isLive: false,
};

export const WeatherWidget: React.FC = () => {
  const [data, setData] = useState<WeatherData>(DEFAULT_WEATHER);
  const [loading, setLoading] = useState<boolean>(true);
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);

  const fetchWeatherData = useCallback(async (isSilent = false) => {
    if (!isSilent) setIsRefreshing(true);
    try {
      const res = await fetch(
        'https://api.open-meteo.com/v1/forecast?latitude=-3.7381&longitude=120.0072&current=temperature_2m,relative_humidity_2m,cloud_cover,wind_speed_10m,weather_code&daily=sunrise,sunset,temperature_2m_max,temperature_2m_min&timezone=Asia%2FMakassar'
      );

      if (!res.ok) {
        throw new Error(`API response status ${res.status}`);
      }

      const json = await res.json();
      const current = json.current;
      const daily = json.daily;

      const temp = Math.round(current.temperature_2m);
      const tempMin = Math.round(daily?.temperature_2m_min?.[0] ?? temp - 2);
      const tempMax = Math.round(daily?.temperature_2m_max?.[0] ?? temp + 3);
      const humidity = Math.round(current.relative_humidity_2m);
      const cloudCover = Math.round(current.cloud_cover);
      const windSpeed = Math.round(current.wind_speed_10m);
      const weatherCode = current.weather_code ?? 1;

      let sunriseFormatted = '06:03 WITA';
      if (daily?.sunrise?.[0]) {
        const rawTime = daily.sunrise[0].split('T')[1];
        if (rawTime) {
          sunriseFormatted = `${rawTime} WITA`;
        }
      }

      const { chance, category } = calculateCloudSeaProbability(humidity, cloudCover, windSpeed);
      const weatherInfo = WMO_WEATHER_MAP[weatherCode] || { label: 'Berawan', icon: CloudSun };

      const now = new Date();
      const timeStr = now.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }) + ' WITA';

      setData({
        temp,
        tempMin,
        tempMax,
        humidity,
        cloudCover,
        windSpeed,
        weatherCode,
        sunriseTime: sunriseFormatted,
        cloudSeaChance: chance,
        cloudSeaCategory: category,
        weatherDesc: weatherInfo.label,
        updatedAt: timeStr,
        isLive: true,
      });
    } catch (err) {
      console.warn('Gagal mengambil data cuaca Open-Meteo, menggunakan fallback:', err);
      setData((prev) => ({
        ...prev,
        updatedAt: 'Mode Offline (Default)',
        isLive: false,
      }));
    } finally {
      setLoading(false);
      setIsRefreshing(false);
    }
  }, []);

  // Initial fetch and automatic background live polling every 5 minutes (300,000 ms)
  useEffect(() => {
    let mounted = true;
    const loadInitialWeather = async () => {
      await fetchWeatherData(true);
      if (!mounted) return;
    };
    loadInitialWeather();

    const intervalId = setInterval(() => {
      fetchWeatherData(true);
    }, 5 * 60 * 1000);

    return () => {
      mounted = false;
      clearInterval(intervalId);
    };
  }, [fetchWeatherData]);

  const WeatherIconComponent = WMO_WEATHER_MAP[data.weatherCode]?.icon || CloudSun;

  return (
    <div className="w-full max-w-4xl mx-auto rounded-3xl bg-gradient-to-br from-emerald-100/90 via-white to-teal-100/80 dark:from-emerald-950/80 dark:via-zinc-900/90 dark:to-zinc-950/95 border border-emerald-500/40 p-6 sm:p-8 text-zinc-900 dark:text-white shadow-2xl backdrop-blur-xl hover:border-emerald-500/60 transition-all duration-300">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-zinc-200 dark:border-zinc-800/80">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-600/10 dark:bg-emerald-500/20 border border-emerald-500/30 dark:border-emerald-500/40 text-emerald-800 dark:text-emerald-300 text-xs font-bold">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            <Radio className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
            <span>Live Auto-Sync (Tiap 5 Mnt) • Open-Meteo • 527 mdpl</span>
          </div>
          <h3 className="text-2xl font-extrabold text-zinc-900 dark:text-white flex items-center gap-2.5 mt-2">
            <WeatherIconComponent className="w-7 h-7 text-emerald-600 dark:text-emerald-400 animate-bounce" />
            Cuaca &amp; Kondisi Punjabu: <span className="text-emerald-700 dark:text-emerald-300">{data.weatherDesc}</span>
          </h3>
          <p className="text-xs text-zinc-600 dark:text-zinc-400 font-medium flex items-center gap-2">
            <span>Dusun Jambu-Jambu, Desa Buntu Buangin, Kec. Pitu Riase, Kab. Sidrap</span>
            <span className="inline-block w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
            <span className="text-[11px] text-emerald-700 dark:text-emerald-400 font-semibold">
              {data.isLive ? `Diperbarui otomatis: ${data.updatedAt}` : data.updatedAt}
            </span>
          </p>
        </div>

        <button
          onClick={() => fetchWeatherData(false)}
          disabled={isRefreshing}
          className="self-start md:self-auto inline-flex items-center gap-2 px-4 py-2 bg-white/90 dark:bg-zinc-800/80 hover:bg-zinc-100 dark:hover:bg-zinc-700 active:scale-95 text-zinc-800 dark:text-zinc-200 text-xs font-bold rounded-xl border border-zinc-300 dark:border-zinc-700/60 transition cursor-pointer shadow-xs disabled:opacity-50"
        >
          <RefreshCw className={`w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 ${isRefreshing ? 'animate-spin' : ''}`} />
          {isRefreshing ? 'Memuat Data...' : 'Segarkan Manual'}
        </button>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 py-6">
        {/* Chance of Cloud Sea */}
        <div className="p-4 rounded-2xl bg-white/90 dark:bg-zinc-900/90 border border-emerald-500/40 dark:border-emerald-500/25 space-y-1 hover:border-emerald-500/60 transition shadow-xs">
          <span className="text-[11px] font-bold text-emerald-700 dark:text-emerald-400 uppercase tracking-wider block">
            Peluang Samudera Awan
          </span>
          <p className="text-2xl sm:text-3xl font-black text-emerald-800 dark:text-emerald-300">
            {loading ? '...' : `${data.cloudSeaChance}%`}
          </p>
          <span className="text-[10px] text-emerald-800 dark:text-emerald-300 font-bold bg-emerald-500/20 px-2 py-0.5 rounded-full inline-block mt-1">
            {data.cloudSeaCategory}
          </span>
        </div>

        {/* Temperature */}
        <div className="p-4 rounded-2xl bg-white/90 dark:bg-zinc-900/90 border border-zinc-200 dark:border-zinc-800 space-y-1 hover:border-zinc-300 dark:hover:border-zinc-700 transition shadow-xs">
          <span className="text-[11px] font-bold text-zinc-700 dark:text-zinc-400 uppercase tracking-wider block flex items-center gap-1">
            <Thermometer className="w-3.5 h-3.5 text-amber-500" /> Suhu Udara
          </span>
          <p className="text-2xl sm:text-3xl font-black text-amber-600 dark:text-amber-300">
            {loading ? '...' : `${data.temp}°C`}
          </p>
          <span className="text-[10px] text-zinc-600 dark:text-zinc-400 font-medium block mt-1">
            {loading ? '' : `Kisaran: ${data.tempMin}°C - ${data.tempMax}°C`}
          </span>
        </div>

        {/* Sunrise Time */}
        <div className="p-4 rounded-2xl bg-white/90 dark:bg-zinc-900/90 border border-zinc-200 dark:border-zinc-800 space-y-1 hover:border-zinc-300 dark:hover:border-zinc-700 transition shadow-xs">
          <span className="text-[11px] font-bold text-zinc-700 dark:text-zinc-400 uppercase tracking-wider block flex items-center gap-1">
            <Sunrise className="w-3.5 h-3.5 text-amber-500" /> Terbit Matahari
          </span>
          <p className="text-2xl sm:text-3xl font-black text-amber-600 dark:text-yellow-300">
            {loading ? '...' : data.sunriseTime}
          </p>
          <span className="text-[10px] text-zinc-600 dark:text-zinc-400 font-medium block mt-1">Golden Hour Puncak</span>
        </div>

        {/* Humidity & Wind */}
        <div className="p-4 rounded-2xl bg-white/90 dark:bg-zinc-900/90 border border-zinc-200 dark:border-zinc-800 space-y-1 hover:border-zinc-300 dark:hover:border-zinc-700 transition shadow-xs">
          <span className="text-[11px] font-bold text-zinc-700 dark:text-zinc-400 uppercase tracking-wider block flex items-center gap-1">
            <Droplets className="w-3.5 h-3.5 text-teal-600 dark:text-teal-400" /> Kelembaban
          </span>
          <p className="text-2xl sm:text-3xl font-black text-teal-700 dark:text-teal-300">
            {loading ? '...' : `${data.humidity}%`}
          </p>
          <span className="text-[10px] text-zinc-600 dark:text-zinc-400 font-medium flex items-center gap-1 mt-1">
            <Wind className="w-3 h-3 text-teal-500" /> Angin: {loading ? '...' : `${data.windSpeed} km/jam`}
          </span>
        </div>
      </div>

      {/* Advice Footer */}
      <div className="p-4 rounded-2xl bg-emerald-500/15 dark:bg-emerald-950/40 border border-emerald-500/30 flex items-start gap-3 text-xs text-zinc-800 dark:text-emerald-200">
        <AlertCircle className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
        <div>
          <p className="font-bold text-emerald-900 dark:text-emerald-300">Tips Pengunjung &amp; Campers Punjabu:</p>
          <p className="mt-0.5 text-zinc-700 dark:text-zinc-300 leading-relaxed">
            Waktu terbaik menyaksikan hamparan lautan awan 360° di puncak adalah jam <strong>05:30 - 07:00 WITA</strong>. Disarankan membawa jaket hangat karena suhu saat fajar berkisar <strong>{data.tempMin}°C - {data.temp}°C</strong>.
          </p>
        </div>
      </div>
    </div>
  );
};
