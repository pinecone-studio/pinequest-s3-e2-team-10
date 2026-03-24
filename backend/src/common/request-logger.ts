import type { NextFunction, Request, Response } from 'express';

type RequestWithId = Request & {
  requestId?: string;
};

export function requestLogger(
  request: RequestWithId,
  response: Response,
  next: NextFunction,
) {
  const requestId = crypto.randomUUID();
  const startedAt = Date.now();

  request.requestId = requestId;
  response.setHeader('X-Request-Id', requestId);

  response.on('finish', () => {
    const durationMs = Date.now() - startedAt;
    const message =
      `[${requestId}] ${request.method} ${request.originalUrl} ` +
      `${response.statusCode} ${durationMs}ms`;

    if (response.statusCode >= 500) {
      console.error(message);
      return;
    }

    if (response.statusCode >= 400) {
      console.warn(message);
      return;
    }

    console.info(message);
  });

  next();
}
