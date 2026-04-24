import type { VercelRequest, VercelResponse } from "@vercel/node";
import axios, { AxiosError } from "axios";

const BASE_URL = "https://api.openweathermap.org/data/2.5";

// ─── OpenWeatherMap API Types ─────────────────────────────────────────────────

interface OpenWeatherCurrentResponse {
  weather: Array<{ description: string; icon: string }>;
  main: {
    temp: number;
    feels_like: number;
    temp_min: number;
    temp_max: number;
    pressure: number;
    humidity: number;
  };
  wind: { speed: number };
  name: string;
  sys: { country: string };
}

interface OpenWeatherForecastItem {
  dt: number;
  main: {
    temp: number;
    temp_min: number;
    temp_max: number;
    humidity: number;
  };
  weather: Array<{ description: string; icon: string }>;
  wind: { speed: number };
  pop: number;
  dt_txt: string;
}

interface OpenWeatherForecastResponse {
  list: OpenWeatherForecastItem[];
}

// ─── Application Response Types ──────────────────────────────────────────────

interface ForecastDay {
  date: number;
  tempMin: number;
  tempMax: number;
  description: string;
  icon: string;
  humidity: number;
  windSpeed: number;
  precipitation: number;
}

interface WeatherResponse {
  current: {
    city: string;
    country: string;
    temperature: number;
    feelsLike: number;
    tempMin: number;
    tempMax: number;
    description: string;
    icon: string;
    humidity: number;
    windSpeed: number;
    pressure: number;
  };
  forecast: ForecastDay[];
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function groupForecastByDay(list: OpenWeatherForecastItem[]): ForecastDay[] {
  const grouped = new Map<string, OpenWeatherForecastItem[]>();

  for (const item of list) {
    const date = item.dt_txt.split(" ")[0];
    if (!grouped.has(date)) grouped.set(date, []);
    grouped.get(date)!.push(item);
  }

  const days: ForecastDay[] = [];

  for (const [, items] of grouped) {
    const temps = items.map((i) => i.main.temp);
    const noonEntry = items.reduce((prev, curr) => {
      const prevHour = parseInt(prev.dt_txt.split(" ")[1].split(":")[0], 10);
      const currHour = parseInt(curr.dt_txt.split(" ")[1].split(":")[0], 10);
      return Math.abs(currHour - 12) < Math.abs(prevHour - 12) ? curr : prev;
    });

    days.push({
      date: noonEntry.dt,
      tempMin: Math.round(Math.min(...temps)),
      tempMax: Math.round(Math.max(...temps)),
      description: noonEntry.weather[0].description,
      icon: noonEntry.weather[0].icon,
      humidity: noonEntry.main.humidity,
      windSpeed: noonEntry.wind.speed,
      precipitation: noonEntry.pop ?? 0,
    });
  }

  return days;
}

// ─── Handler ─────────────────────────────────────────────────────────────────

export default async function handler(
  req: VercelRequest,
  res: VercelResponse,
): Promise<void> {
  if (req.method !== "GET") {
    res.status(405).json({ error: "Método não permitido" });
    return;
  }

  const { city } = req.query;

  if (!city || typeof city !== "string" || city.trim().length === 0) {
    res.status(400).json({ error: "Nome da cidade é obrigatório" });
    return;
  }

  const apiKey = process.env.OPENWEATHER_API_KEY;
  if (!apiKey) {
    res.status(500).json({ error: "API Key não configurada no servidor" });
    return;
  }

  const cityName = city.trim();

  try {
    const [currentRes, forecastRes] = await Promise.all([
      axios.get<OpenWeatherCurrentResponse>(`${BASE_URL}/weather`, {
        params: { q: cityName, appid: apiKey, units: "metric", lang: "pt_br" },
      }),
      axios.get<OpenWeatherForecastResponse>(`${BASE_URL}/forecast`, {
        params: { q: cityName, appid: apiKey, units: "metric", lang: "pt_br" },
      }),
    ]);

    const current = currentRes.data;

    const response: WeatherResponse = {
      current: {
        city: current.name,
        country: current.sys.country,
        temperature: Math.round(current.main.temp),
        feelsLike: Math.round(current.main.feels_like),
        tempMin: Math.round(current.main.temp_min),
        tempMax: Math.round(current.main.temp_max),
        description: current.weather[0].description,
        icon: current.weather[0].icon,
        humidity: current.main.humidity,
        windSpeed: current.wind.speed,
        pressure: current.main.pressure,
      },
      forecast: groupForecastByDay(forecastRes.data.list),
    };

    res.status(200).json(response);
  } catch (err: unknown) {
    const error = err instanceof AxiosError ? err : null;
    if (error) {
      if (error.response?.status === 404) {
        res.status(404).json({
          error: "Cidade não encontrada. Verifique o nome e tente novamente.",
        });
        return;
      }
      if (error.response?.status === 401) {
        res.status(401).json({ error: "API Key inválida ou não configurada." });
        return;
      }
    }
    res.status(500).json({
      error: "Erro ao buscar dados do clima. Tente novamente mais tarde.",
    });
  }
}
