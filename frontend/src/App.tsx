import { useState } from "react";
import { toast } from "sonner";
import { CloudSun } from "lucide-react";
import { Toaster } from "@/components/ui/sonner";
import { SearchForm } from "@/components/SearchForm";
import { CurrentWeather } from "@/components/CurrentWeather";
import { ForecastList } from "@/components/ForecastList";
import { fetchWeather, getErrorMessage } from "@/services/api";
import type { WeatherResponse } from "@/types/weather";

export default function App() {
  const [weatherData, setWeatherData] = useState<WeatherResponse | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSearch = async (city: string) => {
    setIsLoading(true);
    const toastId = toast.loading(`Buscando previsão para ${city}...`);

    try {
      const data = await fetchWeather(city);
      setWeatherData(data);
      toast.success(`Previsão carregada para ${data.current.city}!`, {
        id: toastId,
      });
    } catch (error) {
      toast.error(getErrorMessage(error), { id: toastId });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-sky-100 to-blue-50 p-4 md:p-8">
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="text-center">
          <div className="flex items-center justify-center gap-3 mb-2">
            <CloudSun className="h-10 w-10 text-blue-600" />
            <h1 className="text-4xl font-bold text-blue-800">
              Previsão do Tempo
            </h1>
          </div>
          <p className="text-blue-600">
            Consulte a previsão do tempo para qualquer cidade do mundo
          </p>
        </div>

        <SearchForm onSearch={handleSearch} isLoading={isLoading} />

        {weatherData?.current && (
          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <CurrentWeather data={weatherData.current} />
            <ForecastList forecast={weatherData.forecast ?? []} />
          </div>
        )}

        {!weatherData && !isLoading && (
          <div className="text-center text-blue-400 py-16">
            <CloudSun className="h-24 w-24 mx-auto mb-4 opacity-30" />
            <p className="text-lg">
              Digite o nome de uma cidade para ver a previsão do tempo
            </p>
          </div>
        )}
      </div>

      <Toaster richColors position="top-right" />
    </div>
  );
}
