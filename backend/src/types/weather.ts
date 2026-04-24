// OpenWeatherMap API Response Types

export interface OpenWeatherCurrentResponse {
  coord: {
    lon: number;
    lat: number;
  };
  weather: Array<{
    id: number;
    main: string;
    description: string;
    icon: string;
  }>;
  main: {
    temp: number;
    feels_like: number;
    temp_min: number;
    temp_max: number;
    pressure: number;
    humidity: number;
  };
  wind: {
    speed: number;
    deg: number;
  };
  name: string;
  dt: number;
  sys: {
    country: string;
    sunrise: number;
    sunset: number;
  };
}

export interface OpenWeatherForecastItem {
  dt: number;
  main: {
    temp: number;
    feels_like: number;
    temp_min: number;
    temp_max: number;
    pressure: number;
    humidity: number;
  };
  weather: Array<{
    id: number;
    main: string;
    description: string;
    icon: string;
  }>;
  wind: {
    speed: number;
    deg: number;
  };
  pop: number;
  dt_txt: string;
}

export interface OpenWeatherForecastResponse {
  list: OpenWeatherForecastItem[];
  city: {
    id: number;
    name: string;
    country: string;
  };
}

// Application Response Types

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
