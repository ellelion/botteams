export class RequestTooLargeError extends Error {
  constructor() {
    super("request body exceeds the allowed size");
    this.name = "RequestTooLargeError";
  }
}

export async function requestWithLimitedBody(request: Request, maximumBytes: number): Promise<Request> {
  const declared = request.headers.get("content-length");
  if (declared && /^\d+$/.test(declared) && Number(declared) > maximumBytes) {
    throw new RequestTooLargeError();
  }
  if (!request.body) return request;

  const reader = request.body.getReader();
  const chunks: Buffer[] = [];
  let total = 0;
  try {
    while (true) {
      const result = await reader.read();
      if (result.done) break;
      total += result.value.byteLength;
      if (total > maximumBytes) {
        await reader.cancel();
        throw new RequestTooLargeError();
      }
      chunks.push(Buffer.from(result.value));
    }
  } finally {
    reader.releaseLock();
  }

  const headers = new Headers(request.headers);
  headers.delete("transfer-encoding");
  headers.set("content-length", String(total));
  return new Request(request.url, {
    method: request.method,
    headers,
    body: Buffer.concat(chunks, total),
  });
}
