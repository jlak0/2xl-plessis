const restaurantId = "4cfef81c-07a6-4e64-a523-5b1d021e17ff";
const upstreamUrl = "https://alpacai.net/api/external/reservations";

function json(body, status = 200) {
  return Response.json(body, { status, headers: { "Cache-Control": "no-store" } });
}

function isEmail(value) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

function isDateTime(value) {
  if (typeof value !== "string" || !/T\d{2}:\d{2}:\d{2}(Z|[+-]\d{2}:\d{2})$/.test(value)) return false;
  return !Number.isNaN(new Date(value).getTime());
}

function normalize(input) {
  const output = {
    restaurantId,
    customerName: String(input.customerName || "").trim(),
    customerPhone: String(input.customerPhone || "").trim(),
    partySize: Number.parseInt(input.partySize, 10),
    reservationDate: String(input.reservationDate || "").trim(),
    subscribe: Boolean(input.subscribe)
  };

  const customerEmail = String(input.customerEmail || "").trim();
  const notes = String(input.notes || "").trim();
  if (customerEmail) output.customerEmail = customerEmail;
  if (notes) output.notes = notes;
  return output;
}

function validate(payload) {
  const details = {};
  if (payload.customerName.length < 2) details.customerName = "Name must be at least 2 characters.";
  if (payload.customerPhone.length < 6 || payload.customerPhone.length > 20) details.customerPhone = "Phone must be 6 to 20 characters.";
  if (!Number.isInteger(payload.partySize) || payload.partySize < 1 || payload.partySize > 300) details.partySize = "Party size must be between 1 and 300.";
  if (!isDateTime(payload.reservationDate)) details.reservationDate = "Reservation date must be a valid date-time.";
  if (payload.customerEmail && !isEmail(payload.customerEmail)) details.customerEmail = "Email must be valid.";
  if (payload.notes && payload.notes.length > 500) details.notes = "Notes must be 500 characters or fewer.";
  return details;
}

export async function onRequest(context) {
  const { request } = context;
  if (request.method !== "POST") return json({ error: "Method not allowed" }, 405);

  let input;
  try {
    input = await request.json();
  } catch {
    return json({ error: "Invalid JSON", message: "Request body must be valid JSON." }, 400);
  }

  const payload = normalize(input);
  const details = validate(payload);
  if (Object.keys(details).length) {
    return json({ error: "Validation error", message: "Please check the reservation fields.", details }, 400);
  }

  try {
    const upstream = await fetch(upstreamUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });
    const text = await upstream.text();
    const body = text ? JSON.parse(text) : {};
    return json(body, upstream.status);
  } catch {
    return json({ error: "Upstream error", message: "Reservation service is unavailable." }, 502);
  }
}
