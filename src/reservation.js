export const restaurantId = "4cfef81c-07a6-4e64-a523-5b1d021e17ff";
export const restaurantTimeZone = "Europe/Paris";

export const reservationCopy = {
  successTitle: "Réservation bien reçue",
  successMessage: "Nous avons enregistré votre demande.",
  outsideHours: "Ce créneau est en dehors des horaires d'ouverture. Choisissez une autre heure.",
  capacity: "Ce créneau ou ce nombre de personnes n'est plus disponible. Essayez une autre heure ou réduisez le nombre de personnes.",
  temporary: "Nous n'avons pas pu envoyer la demande pour le moment. Réessayez dans quelques minutes.",
  network: "Connexion impossible. Vérifiez votre réseau puis réessayez."
};

const timeZoneOffsetFormatter = new Intl.DateTimeFormat("en-CA", {
  timeZone: restaurantTimeZone,
  year: "numeric",
  month: "2-digit",
  day: "2-digit",
  hour: "2-digit",
  minute: "2-digit",
  second: "2-digit",
  hourCycle: "h23"
});

function timezoneOffset(date) {
  const parts = Object.fromEntries(timeZoneOffsetFormatter.formatToParts(date).map((part) => [part.type, part.value]));
  const zonedTime = Date.UTC(
    Number(parts.year),
    Number(parts.month) - 1,
    Number(parts.day),
    Number(parts.hour),
    Number(parts.minute),
    Number(parts.second)
  );
  const offset = Math.round((zonedTime - date.getTime()) / 60000);
  const sign = offset >= 0 ? "+" : "-";
  const absolute = Math.abs(offset);
  const hours = String(Math.floor(absolute / 60)).padStart(2, "0");
  const minutes = String(absolute % 60).padStart(2, "0");
  return `${sign}${hours}:${minutes}`;
}

function restaurantWallTimeOffset(year, month, day, hour, minute) {
  const utcWallTime = Date.UTC(year, month - 1, day, hour, minute, 0);
  const firstOffset = timezoneOffset(new Date(utcWallTime));
  const firstOffsetMinutes = offsetToMinutes(firstOffset);
  const restaurantInstant = new Date(utcWallTime - firstOffsetMinutes * 60000);
  return timezoneOffset(restaurantInstant);
}

function offsetToMinutes(offset) {
  const sign = offset[0] === "-" ? -1 : 1;
  const hours = Number(offset.slice(1, 3));
  const minutes = Number(offset.slice(4, 6));
  return sign * (hours * 60 + minutes);
}

function parsePartySize(value) {
  const text = String(value ?? "").trim();
  if (!/^\d+$/.test(text)) return Number.NaN;
  const partySize = Number(text);
  return Number.isSafeInteger(partySize) && partySize >= 1 && partySize <= 300 ? partySize : Number.NaN;
}

const reservationFieldNames = new Set([
  "customerName",
  "customerPhone",
  "customerEmail",
  "partySize",
  "reservationDate",
  "notes",
  "subscribe"
]);
const stepOneReservationFieldNames = new Set(["reservationDate", "partySize"]);

function pickFieldErrors(details) {
  if (!details || typeof details !== "object" || Array.isArray(details) || Object.getPrototypeOf(details) !== Object.prototype) {
    return {};
  }

  return Object.fromEntries(Object.entries(details).filter(([field]) => reservationFieldNames.has(field)));
}

export function buildReservationDateTime(dateValue, timeValue) {
  const dateMatch = String(dateValue).match(/^(\d{4})-(\d{2})-(\d{2})$/);
  const timeMatch = String(timeValue).match(/^(\d{2}):(\d{2})$/);
  if (!dateMatch || !timeMatch) return "";
  const [, yearText, monthText, dayText] = dateMatch;
  const [, hourText, minuteText] = timeMatch;
  const year = Number(yearText);
  const month = Number(monthText);
  const day = Number(dayText);
  const hour = Number(hourText);
  const minute = Number(minuteText);
  if (hour > 23 || minute > 59) return "";
  const date = new Date(Date.UTC(year, month - 1, day, hour, minute, 0));
  if (
    date.getUTCFullYear() !== year ||
    date.getUTCMonth() + 1 !== month ||
    date.getUTCDate() !== day ||
    date.getUTCHours() !== hour ||
    date.getUTCMinutes() !== minute
  ) {
    return "";
  }
  return `${dateValue}T${timeValue}:00${restaurantWallTimeOffset(year, month, day, hour, minute)}`;
}

export function buildReservationPayload(values) {
  const payload = {
    customerName: String(values.customerName || "").trim(),
    customerPhone: String(values.customerPhone || "").trim(),
    partySize: parsePartySize(values.partySize),
    reservationDate: buildReservationDateTime(values.reservationDate, values.reservationTime),
    subscribe: Boolean(values.subscribe)
  };

  const customerEmail = String(values.customerEmail || "").trim();
  const notes = String(values.notes || "").trim();
  if (customerEmail) payload.customerEmail = customerEmail;
  if (notes) payload.notes = notes;
  return payload;
}

export function mapReservationResponse(body) {
  if (body?.success === true) {
    return {
      kind: "success",
      title: reservationCopy.successTitle,
      message: reservationCopy.successMessage,
      fieldErrors: {}
    };
  }

  if (body?.error === "Outside opening hours") {
    return { kind: "time-error", step: 1, message: reservationCopy.outsideHours, fieldErrors: {} };
  }

  if (body?.error === "Reservation limit exceeded") {
    return { kind: "capacity-error", step: 1, message: reservationCopy.capacity, fieldErrors: {} };
  }

  if (body?.error === "Validation error") {
    const fieldErrors = pickFieldErrors(body.details);
    if (Object.keys(fieldErrors).length === 0) {
      return {
        kind: "temporary-error",
        step: 2,
        message: reservationCopy.temporary,
        fieldErrors: {}
      };
    }

    return {
      kind: "field-error",
      step: Object.keys(fieldErrors).some((field) => stepOneReservationFieldNames.has(field)) ? 1 : 2,
      message: body.message || body.error || reservationCopy.temporary,
      fieldErrors
    };
  }

  return {
    kind: "temporary-error",
    step: 2,
    message: reservationCopy.temporary,
    fieldErrors: {}
  };
}

export function networkReservationState() {
  return {
    kind: "network-error",
    step: 2,
    message: reservationCopy.network,
    fieldErrors: {}
  };
}
