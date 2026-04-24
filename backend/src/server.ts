import Fastify from "fastify";
import cors from "@fastify/cors";
import dotenv from "dotenv";
import { weatherRoutes } from "./routes/weatherRoutes.js";

dotenv.config();

async function main(): Promise<void> {
  const app = Fastify({ logger: true });

  await app.register(cors, {
    origin: process.env.FRONTEND_URL ?? "http://localhost:5173",
  });

  await app.register(weatherRoutes, { prefix: "/api" });

  app.setErrorHandler(
    (error: Error & { statusCode?: number }, _request, reply) => {
      app.log.error(error);
      const statusCode = error.statusCode ?? 500;
      void reply.status(statusCode).send({
        error: error.message || "Erro interno do servidor",
      });
    },
  );

  const PORT = Number(process.env.PORT) || 3333;

  try {
    await app.listen({ port: PORT, host: "0.0.0.0" });
    console.log(`Servidor rodando em http://localhost:${PORT}`);
  } catch (err) {
    app.log.error(err);
    process.exit(1);
  }
}

main();
