const upstreamUrl = "https://alpacai.net/api/external/menu";

function json(body, status = 200) {
  return Response.json(body, { status, headers: { "Cache-Control": "no-store" } });
}

function isUuid(value) {
  return typeof value === "string"
    && /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(value);
}

function parseIncludeUnavailable(value) {
  if (value === null || value === "") return "false";
  if (value === "true" || value === "false") return value;
  return null;
}

export async function onRequest(context) {
  const { request } = context;
  if (request.method !== "GET") return json({ error: "Method not allowed" }, 405);

  const url = new URL(request.url);
  const restaurantId = url.searchParams.get("r");
  const includeUnavailable = parseIncludeUnavailable(url.searchParams.get("includeUnavailable"));
  const details = {};

  if (!isUuid(restaurantId)) details.r = "Restaurant id must be a valid UUID.";
  if (includeUnavailable === null) details.includeUnavailable = "includeUnavailable must be true or false.";
  if (Object.keys(details).length) {
    return json({ error: "Validation error", message: "Please check the menu query fields.", details }, 400);
  }

  const upstream = new URL(upstreamUrl);
  upstream.searchParams.set("r", restaurantId);
  upstream.searchParams.set("includeUnavailable", includeUnavailable);

  let response;
  try {
    response = await fetch(upstream.toString(), { method: "GET" });
  } catch {
    return json({ error: "Upstream error", message: "Menu service is unavailable." }, 502);
  }

  let text;
  try {
    text = await response.text();
  } catch {
    return json({ error: "Upstream error", message: "Menu service returned invalid JSON." }, response.status || 502);
  }

  if (!text) return json({}, response.status);

  try {
    return json(JSON.parse(text), response.status);
  } catch {
    return json({ error: "Upstream error", message: "Menu service returned invalid JSON." }, response.status || 502);
  }
}
