import { ZodSchema } from "zod";

export class ApiError extends Error {
  status: number;
  info?: unknown;

  constructor(message: string, status: number, info?: unknown) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.info = info;
  }
}

async function readJsonSafe(r: Response) {
  try {
    return await r.json();
  } catch {
    return undefined;
  }
}


export async function apiGet<T>(
  path: string,
  schema: ZodSchema<T>,
  init?: RequestInit
): Promise<T> {
  const r = await fetch(path, {
    ...init,
    headers: {
      "Content-Type": "application/json",
      ...(init?.headers ?? {}),
    },
  });

  const data = await readJsonSafe(r);

  if (!r.ok) {
    throw new ApiError("API request failed", r.status, data);
  }

  return schema.parse(data);
}