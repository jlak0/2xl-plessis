const restaurantId = "4cfef81c-07a6-4e64-a523-5b1d021e17ff";
const upstreamUrl = "https://alpacai.net/api/external/reservations";

function json(body, status = 200) {
  return Response.json(body, { status, headers: { "Cache-Control": "no-store" } });
}

function isEmail(value) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

function isDateTime(value) {
  if (typeof value !== "string") return false;
  const match = value.match(/^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2}):(\d{2})(Z|[+-]\d{2}:\d{2})$/);
  if (!match) return false;

  const [, yearText, monthText, dayText, hourText, minuteText, secondText, offset] = match;
  const year = Number(yearText);
  const month = Number(monthText);
  const day = Number(dayText);
  const hour = Number(hourText);
  const minute = Number(minuteText);
  const second = Number(secondText);
  if (hour > 23 || minute > 59 || second > 59) return false;
  if (offset !== "Z") {
    const offsetHour = Number(offset.slice(1, 3));
    const offsetMinute = Number(offset.slice(4, 6));
    if (offsetHour > 23 || offsetMinute > 59) return false;
  }

  const utcDate = new Date(Date.UTC(year, month - 1, day));
  return utcDate.getUTCFullYear() === year
    && utcDate.getUTCMonth() === month - 1
    && utcDate.getUTCDate() === day;
}

function normalizeString(value) {
  return typeof value === "string" ? value.trim() : value;
}

function normalize(input) {
  const output = {
    restaurantId,
    customerName: normalizeString(input.customerName),
    customerPhone: normalizeString(input.customerPhone),
    partySize: input.partySize,
    reservationDate: normalizeString(input.reservationDate),
    subscribe: input.subscribe === undefined ? false : input.subscribe
  };

  if ("customerEmail" in input) {
    const customerEmail = normalizeString(input.customerEmail);
    if (customerEmail !== "") output.customerEmail = customerEmail;
  }
  if ("notes" in input) {
    const notes = normalizeString(input.notes);
    output.notesRawLength = typeof input.notes === "string" ? input.notes.length : undefined;
    if (notes !== "") {
      output.notes = notes;
    }
  }
  return output;
}

function validate(payload) {
  const details = {};
  if (typeof payload.customerName !== "string" || payload.customerName.length < 2) details.customerName = "Name must be at least 2 characters.";
  if (typeof payload.customerPhone !== "string" || payload.customerPhone.length < 6 || payload.customerPhone.length > 20) details.customerPhone = "Phone must be 6 to 20 characters.";
  if (!Number.isInteger(payload.partySize) || payload.partySize < 1 || payload.partySize > 300) details.partySize = "Party size must be between 1 and 300.";
  if (!isDateTime(payload.reservationDate)) details.reservationDate = "Reservation date must be a valid date-time.";
  if ("customerEmail" in payload && (typeof payload.customerEmail !== "string" || !isEmail(payload.customerEmail))) details.customerEmail = "Email must be valid.";
  if ("notesRawLength" in payload && payload.notesRawLength > 500) details.notes = "Notes must be 500 characters or fewer.";
  if ("notes" in payload && typeof payload.notes !== "string") details.notes = "Notes must be 500 characters or fewer.";
  if (typeof payload.subscribe !== "boolean") details.subscribe = "Subscribe must be a boolean.";
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
  if (input === null || Array.isArray(input) || typeof input !== "object") input = {};

  const payload = normalize(input);
  const details = validate(payload);
  if (Object.keys(details).length) {
    return json({ error: "Validation error", message: "Please check the reservation fields.", details }, 400);
  }
  delete payload.notesRawLength;

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
