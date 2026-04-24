import axios, { AxiosError } from "axios";
import type {
  OpenWeatherCurrentResponse,
  OpenWeatherForecastResponse,
  OpenWeatherForecastItem,
  WeatherResponse,
  ForecastDay,
} from "../types/weather.js";
import { WeatherError } from "../types/errors.js";

const BASE_URL = "https://api.openweathermap.org/data/2.5";

function getApiKey(): string {
  const key = process.env.OPENWEATHER_API_KEY;
  if (!key) {
    throw new WeatherError(500, "OPENWEATHER_API_KEY não configurada no .env");
  }
  return key;
}

function groupForecastByDay(list: OpenWeatherForecastItem[]): ForecastDay[] {
  const grouped = new Map<string, OpenWeatherForecastItem[]>();

  for (const item of list) {
    const date = item.dt_txt.split(" ")[0];
    if (!grouped.has(date)) {
      grouped.set(date, []);
    }
    grouped.get(date)!.push(item);
  }

  const days: ForecastDay[] = [];

  for (const [, items] of grouped) {
    const temps = items.map((i) => i.main.temp);
    const tempMin = Math.min(...temps);
    const tempMax = Math.max(...temps);

    // Busca o horário mais próximo de meio-dia para representar o dia
    const noonEntry = items.reduce((prev, curr) => {
      const prevHour = parseInt(prev.dt_txt.split(" ")[1].split(":")[0], 10);
      const currHour = parseInt(curr.dt_txt.split(" ")[1].split(":")[0], 10);
      return Math.abs(currHour - 12) < Math.abs(prevHour - 12) ? curr : prev;
    });

    days.push({
      date: noonEntry.dt,
      tempMin: Math.round(tempMin),
      tempMax: Math.round(tempMax),
      description: noonEntry.weather[0].description,
      icon: noonEntry.weather[0].icon,
      humidity: noonEntry.main.humidity,
      windSpeed: noonEntry.wind.speed,
      precipitation: noonEntry.pop ?? 0,
    });
  }

  return days;
}

export async function getWeatherByCity(city: string): Promise<WeatherResponse> {
  const apiKey = getApiKey();

  try {
    const [currentRes, forecastRes] = await Promise.all([
      axios.get<OpenWeatherCurrentResponse>(`${BASE_URL}/weather`, {
        params: { q: city, appid: apiKey, units: "metric", lang: "pt_br" },
      }),
      axios.get<OpenWeatherForecastResponse>(`${BASE_URL}/forecast`, {
        params: { q: city, appid: apiKey, units: "metric", lang: "pt_br" },
      }),
    ]);

    const current = currentRes.data;

    return {
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
  } catch (error) {
    if (error instanceof WeatherError) throw error;

    if (error instanceof AxiosError) {
      if (error.response?.status === 404) {
        throw new WeatherError(
          404,
          "Cidade não encontrada. Verifique o nome e tente novamente.",
        );
      }
      if (error.response?.status === 401) {
        throw new WeatherError(401, "API Key inválida ou não configurada.");
      }
    }

    throw new WeatherError(
      500,
      "Erro ao buscar dados do clima. Tente novamente mais tarde.",
    );
  }
}
