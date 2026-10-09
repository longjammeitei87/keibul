import { siteConfig } from '@/lib/site-data';

export const maximumRequestSize = 16_384;

export function jsonResponse(body: object, status: number, headers: HeadersInit = {}): Response {
  return Response.json(body, {
    status,
    headers: {
      'Cache-Control': 'no-store',
      ...headers,
    },
  });
}

export function validateContentLength(request: Request): Response | null {
  const contentLengthHeader = request.headers.get('content-length');
  if (contentLengthHeader === null) {
    return null;
  }

  const contentLength = Number(contentLengthHeader);
  if (!/^\d+$/.test(contentLengthHeader) || !Number.isSafeInteger(contentLength)) {
    return jsonResponse({ ok: false, message: 'Please check your details and try again.' }, 400);
  }
  if (contentLength > maximumRequestSize) {
    return jsonResponse(
      { ok: false, message: 'Your enquiry is too large. Please shorten it and try again.' },
      413,
    );
  }

  return null;
}

export function validateRequestOrigin(request: Request): Response | null {
  const origin = request.headers.get('origin');
  if (!origin) {
    // No cookies or session credentials authorize this endpoint; allow non-browser callers.
    return null;
  }

  if (isRequestOriginAllowed(origin, request)) {
    return null;
  }

  return jsonResponse(
    { ok: false, message: 'We could not verify this request. Please refresh the page and try again.' },
    403,
  );
}

export async function readRequestBody(
  request: Request,
): Promise<{ ok: true; body: string } | { ok: false; response: Response }> {
  try {
    const result = await readLimitedBody(request);
    if (result.tooLarge) {
      return {
        ok: false,
        response: jsonResponse(
          { ok: false, message: 'Your enquiry is too large. Please shorten it and try again.' },
          413,
        ),
      };
    }
    return { ok: true, body: result.body };
  } catch (error) {
    console.error(
      `Contact request body could not be read (${error instanceof Error ? error.name : 'unknown error'}).`,
    );
    return {
      ok: false,
      response: jsonResponse({ ok: false, message: 'Please check your details and try again.' }, 400),
    };
  }
}

export async function readLimitedBody(request: Request): Promise<{ body: string; tooLarge: boolean }> {
  const reader = request.body?.getReader();
  if (!reader) {
    return { body: '', tooLarge: false };
  }

  const chunks: Uint8Array[] = [];
  let totalBytes = 0;

  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) {
        break;
      }

      totalBytes += value.byteLength;
      if (totalBytes > maximumRequestSize) {
        try {
          await reader.cancel();
        } catch (error) {
          console.error(
            `Contact request body cancellation failed (${error instanceof Error ? error.name : 'unknown error'}).`,
          );
        }
        return { body: '', tooLarge: true };
      }

      chunks.push(value);
    }
  } finally {
    reader.releaseLock();
  }

  const bytes = new Uint8Array(totalBytes);
  let offset = 0;
  for (const chunk of chunks) {
    bytes.set(chunk, offset);
    offset += chunk.byteLength;
  }

  return { body: new TextDecoder('utf-8', { fatal: true }).decode(bytes), tooLarge: false };
}

export function isRequestOriginAllowed(originValue: string, request: Request): boolean {
  let origin: URL;
  try {
    origin = new URL(originValue);
  } catch {
    return false;
  }

  if (origin.origin !== originValue || !['https:', 'http:'].includes(origin.protocol)) {
    return false;
  }

  const allowedOrigins = new Set([new URL(siteConfig.url).origin]);
  if (process.env.VERCEL === '1') {
    for (const deploymentHost of [
      process.env.VERCEL_PROJECT_PRODUCTION_URL,
      process.env.VERCEL_URL,
    ]) {
      if (deploymentHost) {
        const deploymentOrigin = getVercelDeploymentOrigin(deploymentHost);
        if (deploymentOrigin) {
          allowedOrigins.add(deploymentOrigin);
        }
      }
    }
  }

  const requestUrl = new URL(request.url);
  if (
    process.env.NODE_ENV !== 'production' &&
    ['localhost', '127.0.0.1', '[::1]'].includes(requestUrl.hostname)
  ) {
    allowedOrigins.add(requestUrl.origin);
  }

  return allowedOrigins.has(origin.origin);
}

function getVercelDeploymentOrigin(deploymentHost: string): string | null {
  try {
    const deploymentUrl = new URL(`https://${deploymentHost}`);
    if (
      deploymentUrl.hostname &&
      deploymentUrl.pathname === '/' &&
      !deploymentUrl.search &&
      !deploymentUrl.hash &&
      !deploymentUrl.username &&
      !deploymentUrl.password &&
      deploymentUrl.host === deploymentHost.toLowerCase()
    ) {
      return deploymentUrl.origin;
    }
  } catch {
    return null;
  }

  return null;
}

export function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}
