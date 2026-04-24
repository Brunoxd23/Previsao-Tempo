export interface CurrentWeatherData {
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
}

export interface ForecastDay {
  date: number;
  tempMin: number;
  tempMax: number;
  description: string;
  icon: string;
  humidity: number;
  windSpeed: number;
  precipitation: number;
}

export interface WeatherResponse {
  current: CurrentWeatherData;
  forecast: ForecastDay[];
}

export interface ApiError {
  error: string;
}
