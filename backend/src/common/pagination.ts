import { BadRequestException } from '@nestjs/common';

export type PaginationParams = {
  page: number;
  limit: number;
  offset: number;
};

const DEFAULT_PAGE = 1;
const DEFAULT_LIMIT = 20;
const MAX_LIMIT = 100;

function parsePositiveInteger(
  rawValue: string | undefined,
  fieldName: string,
  fallbackValue: number,
): number {
  if (rawValue === undefined || rawValue === '') {
    return fallbackValue;
  }

  const parsed = Number.parseInt(rawValue, 10);

  if (!Number.isInteger(parsed) || parsed < 1) {
    throw new BadRequestException(
      `${fieldName} must be a positive integer greater than 0`,
    );
  }

  return parsed;
}

export function parsePaginationParams(
  page?: string,
  limit?: string,
): PaginationParams {
  const parsedPage = parsePositiveInteger(page, 'page', DEFAULT_PAGE);
  const parsedLimit = parsePositiveInteger(limit, 'limit', DEFAULT_LIMIT);

  if (parsedLimit > MAX_LIMIT) {
    throw new BadRequestException(
      `limit must be less than or equal to ${MAX_LIMIT}`,
    );
  }

  return {
    page: parsedPage,
    limit: parsedLimit,
    offset: (parsedPage - 1) * parsedLimit,
  };
}
