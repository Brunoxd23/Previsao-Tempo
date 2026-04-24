import { Droplets, Wind, Gauge } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { CurrentWeatherData } from "@/types/weather";

interface CurrentWeatherProps {
  data: CurrentWeatherData;
}

export function CurrentWeather({ data }: CurrentWeatherProps) {
  const iconUrl = `https://openweathermap.org/img/wn/${data.icon}@2x.png`;

  return (
    <Card className="w-full bg-gradient-to-br from-blue-500 to-blue-700 text-white border-0">
      <CardHeader className="pb-2">
        <CardTitle className="text-3xl font-bold">
          {data.city}, {data.country}
        </CardTitle>
        <p className="text-blue-100 capitalize text-lg">{data.description}</p>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <img src={iconUrl} alt={data.description} className="w-20 h-20" />
            <div>
              <p className="text-6xl font-bold">{data.temperature}°C</p>
              <p className="text-blue-200 text-sm">
                Sensação: {data.feelsLike}°C
              </p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-blue-200 text-sm">Máx: {data.tempMax}°C</p>
            <p className="text-blue-200 text-sm">Mín: {data.tempMin}°C</p>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-4 mt-4 border-t border-blue-400 pt-4">
          <div className="flex items-center gap-2">
            <Droplets className="h-5 w-5 text-blue-200" />
            <div>
              <p className="text-xs text-blue-200">Umidade</p>
              <p className="font-semibold">{data.humidity}%</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Wind className="h-5 w-5 text-blue-200" />
            <div>
              <p className="text-xs text-blue-200">Vento</p>
              <p className="font-semibold">{data.windSpeed} m/s</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Gauge className="h-5 w-5 text-blue-200" />
            <div>
              <p className="text-xs text-blue-200">Pressão</p>
              <p className="font-semibold">{data.pressure} hPa</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
