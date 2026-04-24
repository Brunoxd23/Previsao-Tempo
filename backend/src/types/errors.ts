export class WeatherError extends Error {
  readonly statusCode: number;

  constructor(statusCode: number, message: string) {
    super(message);
    this.name = "WeatherError";
    this.statusCode = statusCode;
  }
}
