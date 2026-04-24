import type { FastifyRequest, FastifyReply } from "fastify";
import { getWeatherByCity } from "../services/weatherService.js";
import { WeatherError } from "../types/errors.js";

interface WeatherParams {
  city: string;
}

interface ErrorReply {
  error: string;
}

export async function getWeather(
  request: FastifyRequest<{ Params: WeatherParams }>,
  reply: FastifyReply,
): Promise<unknown> {
  const { city } = request.params;

  if (!city || city.trim().length === 0) {
    return reply
      .status(400)
      .send({ error: "Nome da cidade é obrigatório" } satisfies ErrorReply);
  }

  try {
    const weather = await getWeatherByCity(city.trim());
    return weather;
  } catch (err) {
    if (err instanceof WeatherError) {
      return reply
        .status(err.statusCode)
        .send({ error: err.message } satisfies ErrorReply);
    }
    return reply
      .status(500)
      .send({ error: "Erro interno do servidor" } satisfies ErrorReply);
  }
}
