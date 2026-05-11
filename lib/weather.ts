export type WeatherSnapshot = {
  city: string;
  tempC: number;
  feelsLikeC: number;
  description: string;
  icon: string;
  high: number;
  low: number;
  humidity: number;
};

export type GeoLocation = {
  latitude: number;
  longitude: number;
  name: string;
};

const WEATHER_CODE_MAP: Record<number, { icon: string; desc: string }> = {
  0: { icon: "☀️", desc: "晴" },
  1: { icon: "🌤️", desc: "晴间多云" },
  2: { icon: "⛅", desc: "多云" },
  3: { icon: "☁️", desc: "阴" },
  45: { icon: "🌫️", desc: "雾" },
  48: { icon: "🌫️", desc: "雾凇" },
  51: { icon: "🌧️", desc: "毛毛雨" },
  53: { icon: "🌧️", desc: "毛毛雨" },
  55: { icon: "🌧️", desc: "毛毛雨" },
  61: { icon: "🌧️", desc: "小雨" },
  63: { icon: "🌧️", desc: "中雨" },
  65: { icon: "🌧️", desc: "大雨" },
  66: { icon: "🌨️", desc: "冻雨" },
  67: { icon: "🌨️", desc: "冻雨" },
  71: { icon: "❄️", desc: "小雪" },
  73: { icon: "❄️", desc: "中雪" },
  75: { icon: "❄️", desc: "大雪" },
  77: { icon: "❄️", desc: "雪粒" },
  80: { icon: "🌦️", desc: "阵雨" },
  81: { icon: "🌦️", desc: "阵雨" },
  82: { icon: "🌦️", desc: "强阵雨" },
  85: { icon: "🌨️", desc: "阵雪" },
  86: { icon: "🌨️", desc: "阵雪" },
  95: { icon: "⛈️", desc: "雷雨" },
  96: { icon: "⛈️", desc: "雷暴" },
  99: { icon: "⛈️", desc: "雷暴" },
};

function mapWeatherCode(code: number): { icon: string; desc: string } {
  return WEATHER_CODE_MAP[code] ?? { icon: "🌡️", desc: "未知天气" };
}

export async function fetchWeather(
  lat: number,
  lon: number,
  cityName?: string,
): Promise<WeatherSnapshot> {
  const url =
    "https://api.open-meteo.com/v1/forecast?" +
    new URLSearchParams({
      latitude: String(lat),
      longitude: String(lon),
      current: "temperature_2m,relative_humidity_2m,apparent_temperature,weather_code",
      daily: "temperature_2m_max,temperature_2m_min",
      timezone: "auto",
    });

  const res = await fetch(url, { cache: "no-store" });
  if (!res.ok) {
    throw new Error(`天气 API 请求失败: ${res.status}`);
  }

  const data = (await res.json()) as {
    current: {
      temperature_2m: number;
      relative_humidity_2m: number;
      apparent_temperature: number;
      weather_code: number;
    };
    daily: {
      temperature_2m_max: number[];
      temperature_2m_min: number[];
    };
  };

  const mapped = mapWeatherCode(data.current.weather_code);

  return {
    city: cityName ?? "当前位置",
    tempC: Math.round(data.current.temperature_2m),
    feelsLikeC: Math.round(data.current.apparent_temperature),
    description: mapped.desc,
    icon: mapped.icon,
    high: Math.round(data.daily.temperature_2m_max[0] ?? data.current.temperature_2m),
    low: Math.round(data.daily.temperature_2m_min[0] ?? data.current.temperature_2m),
    humidity: data.current.relative_humidity_2m,
  };
}

export async function geocodeCity(name: string): Promise<GeoLocation | null> {
  const url =
    "https://geocoding-api.open-meteo.com/v1/search?" +
    new URLSearchParams({ name, count: "1", language: "zh" });

  const res = await fetch(url, { cache: "no-store" });
  if (!res.ok) return null;

  const data = (await res.json()) as {
    results?: Array<{
      latitude: number;
      longitude: number;
      name: string;
      admin1?: string;
      country?: string;
    }>;
  };

  const first = data.results?.[0];
  if (!first) return null;

  return {
    latitude: first.latitude,
    longitude: first.longitude,
    name: first.admin1 ? `${first.admin1}` : first.name,
  };
}

export const DEFAULT_LOCATION: GeoLocation = {
  latitude: 31.2222,
  longitude: 121.4581,
  name: "上海",
};
