import assert from "node:assert/strict";
import { afterEach, test } from "node:test";
import { onRequest } from "../functions/api/external/menu.js";

const restaurantId = "4cfef81c-07a6-4e64-a523-5b1d021e17ff";
const upstreamUrl = "https://alpacai.net/api/external/menu";
const originalFetch = globalThis.fetch;

function request(path, method = "GET") {
  return new Request(`https://example.com${path}`, { method });
}

async function json(response) {
  return response.json();
}

afterEach(() => {
  globalThis.fetch = originalFetch;
});

test("rejects non-GET menu requests", async () => {
  const response = await onRequest({ request: request(`/api/external/menu?r=${restaurantId}`, "POST") });

  assert.equal(response.status, 405);
  assert.deepEqual(await json(response), { error: "Method not allowed" });
});

test("requires a valid restaurant uuid query parameter", async () => {
  const response = await onRequest({ request: request("/api/external/menu?r=bad-id") });
  const body = await json(response);

  assert.equal(response.status, 400);
  assert.equal(body.error, "Validation error");
  assert.equal(body.details.r, "Restaurant id must be a valid UUID.");
});

test("rejects invalid includeUnavailable values", async () => {
  const response = await onRequest({ request: request(`/api/external/menu?r=${restaurantId}&includeUnavailable=yes`) });
  const body = await json(response);

  assert.equal(response.status, 400);
  assert.equal(body.error, "Validation error");
  assert.equal(body.details.includeUnavailable, "includeUnavailable must be true or false.");
});

test("forwards menu requests with includeUnavailable defaulting to false", async () => {
  let upstreamRequest;
  globalThis.fetch = async (url) => {
    upstreamRequest = new URL(url);
    return Response.json({ success: true, data: { restaurant: { id: restaurantId, name: "2XL" }, categories: [] } });
  };

  const response = await onRequest({ request: request(`/api/external/menu?r=${restaurantId}`) });
  const body = await json(response);

  assert.equal(response.status, 200);
  assert.equal(body.success, true);
  assert.equal(upstreamRequest.origin + upstreamRequest.pathname, upstreamUrl);
  assert.equal(upstreamRequest.searchParams.get("r"), restaurantId);
  assert.equal(upstreamRequest.searchParams.get("includeUnavailable"), "false");
});

test("forwards explicit includeUnavailable=true to the menu upstream", async () => {
  let upstreamRequest;
  globalThis.fetch = async (url) => {
    upstreamRequest = new URL(url);
    return Response.json({ success: true, data: { restaurant: { id: restaurantId, name: "2XL" }, categories: [] } });
  };

  const response = await onRequest({ request: request(`/api/external/menu?r=${restaurantId}&includeUnavailable=true`) });

  assert.equal(response.status, 200);
  assert.equal(upstreamRequest.searchParams.get("includeUnavailable"), "true");
});

test("returns unavailable error when menu upstream fetch throws", async () => {
  globalThis.fetch = async () => {
    throw new Error("network unavailable");
  };

  const response = await onRequest({ request: request(`/api/external/menu?r=${restaurantId}`) });

  assert.equal(response.status, 502);
  assert.deepEqual(await json(response), {
    error: "Upstream error",
    message: "Menu service is unavailable."
  });
});
