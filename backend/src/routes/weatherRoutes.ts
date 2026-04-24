import type { FastifyInstance } from "fastify";
import { getWeather } from "../controllers/weatherController.js";

export async function weatherRoutes(app: FastifyInstance): Promise<void> {
  app.get<{ Params: { city: string } }>("/weather/:city", getWeather);
}
