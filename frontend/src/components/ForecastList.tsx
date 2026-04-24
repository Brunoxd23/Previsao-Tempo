import { Droplets, Wind } from "lucide-react";
import { Card } from "@/components/ui/card";
import type { ForecastDay } from "@/types/weather";

interface ForecastListProps {
  forecast: ForecastDay[];
}

function formatDate(timestamp: number): string {
  const date = new Date(timestamp * 1000);
  return date.toLocaleDateString("pt-BR", {
    weekday: "short",
    day: "2-digit",
    month: "2-digit",
  });
}

function ForecastDayCard({ day }: { day: ForecastDay }) {
  const iconUrl = `https://openweathermap.org/img/wn/${day.icon}@2x.png`;

  return (
    <Card className="flex flex-col items-center p-4 hover:shadow-md transition-shadow">
      <p className="text-sm font-medium text-muted-foreground capitalize">
        {formatDate(day.date)}
      </p>
      <img src={iconUrl} alt={day.description} className="w-12 h-12 my-1" />
      <p className="text-xs text-center text-muted-foreground capitalize mb-2">
        {day.description}
      </p>
      <div className="flex gap-3 text-sm font-semibold">
        <span className="text-orange-500">{day.tempMax}°</span>
        <span className="text-blue-500">{day.tempMin}°</span>
      </div>
      <div className="flex flex-col gap-1 mt-2 w-full">
        <div className="flex items-center gap-1 text-xs text-muted-foreground">
          <Droplets className="h-3 w-3" />
          <span>{day.humidity}%</span>
        </div>
        <div className="flex items-center gap-1 text-xs text-muted-foreground">
          <Wind className="h-3 w-3" />
          <span>{day.windSpeed.toFixed(1)} m/s</span>
        </div>
      </div>
    </Card>
  );
}

export function ForecastList({ forecast }: ForecastListProps) {
  return (
    <div className="w-full">
      <h2 className="text-xl font-semibold mb-4 text-blue-900">
        Previsão para os próximos dias
      </h2>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
        {forecast.map((day) => (
          <ForecastDayCard key={day.date} day={day} />
        ))}
      </div>
    </div>
  );
}
