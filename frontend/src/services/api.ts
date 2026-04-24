import axios, { AxiosError } from "axios";
import type { WeatherResponse, ApiError } from "@/types/weather";

const api = axios.create({
  baseURL:
    (import.meta.env.VITE_API_URL as string | undefined) ??
    "http://localhost:3333/api",
});

export async function fetchWeather(city: string): Promise<WeatherResponse> {
  const encodedCity = encodeURIComponent(city);
  const response = await api.get<WeatherResponse>(`/weather/${encodedCity}`);
  return response.data;
}

export function getErrorMessage(error: unknown): string {
  if (error instanceof AxiosError) {
    const data = error.response?.data as ApiError | undefined;
    if (data?.error) {
      return data.error;
    }
    if (error.response?.status === 404) {
      return "Cidade não encontrada. Verifique o nome e tente novamente.";
    }
    if (error.response?.status === 500) {
      return "Erro interno do servidor. Tente novamente mais tarde.";
    }
  }
  return "Erro desconhecido. Tente novamente.";
}
