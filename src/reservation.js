export const restaurantId = "4cfef81c-07a6-4e64-a523-5b1d021e17ff";

export const reservationCopy = {
  successTitle: "Réservation bien reçue",
  successMessage: "Nous avons enregistré votre demande.",
  outsideHours: "Ce créneau est en dehors des horaires d'ouverture. Choisissez une autre heure.",
  capacity: "Ce créneau ou ce nombre de personnes n'est plus disponible. Essayez une autre heure ou réduisez le nombre de personnes.",
  temporary: "Nous n'avons pas pu envoyer la demande pour le moment. Réessayez dans quelques minutes.",
  network: "Connexion impossible. Vérifiez votre réseau puis réessayez."
};

function timezoneOffset(date) {
  const offset = -date.getTimezoneOffset();
  const sign = offset >= 0 ? "+" : "-";
  const absolute = Math.abs(offset);
  const hours = String(Math.floor(absolute / 60)).padStart(2, "0");
  const minutes = String(absolute % 60).padStart(2, "0");
  return `${sign}${hours}:${minutes}`;
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

function pickFieldErrors(details) {
  if (!details || typeof details !== "object" || Array.isArray(details) || Object.getPrototypeOf(details) !== Object.prototype) {
    return {};
  }

  return Object.fromEntries(Object.entries(details).filter(([field]) => reservationFieldNames.has(field)));
}

export function buildReservationDateTime(dateValue, timeValue) {
  const date = new Date(`${dateValue}T${timeValue}:00`);
  if (Number.isNaN(date.getTime())) return "";
  const [year, month, day] = String(dateValue).split("-").map((part) => Number.parseInt(part, 10));
  const [hour, minute] = String(timeValue).split(":").map((part) => Number.parseInt(part, 10));
  if (
    date.getFullYear() !== year ||
    date.getMonth() + 1 !== month ||
    date.getDate() !== day ||
    date.getHours() !== hour ||
    date.getMinutes() !== minute
  ) {
    return "";
  }
  return `${dateValue}T${timeValue}:00${timezoneOffset(date)}`;
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
      step: 2,
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
