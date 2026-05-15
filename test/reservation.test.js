import assert from "node:assert/strict";
import { test } from "node:test";
import {
  buildReservationDateTime,
  buildReservationPayload,
  mapReservationResponse,
  reservationCopy,
  restaurantId
} from "../src/reservation.js";

test("builds ISO 8601 reservation date-time with timezone offset", () => {
  assert.match(buildReservationDateTime("2026-05-15", "19:30"), /^2026-05-15T19:30:00[+-]\d{2}:\d{2}$/);
});

test("rejects invalid calendar reservation date-times", () => {
  assert.equal(buildReservationDateTime("2026-02-30", "19:30"), "");
});

test("builds browser payload without exposing editable restaurant id", () => {
  const payload = buildReservationPayload({
    customerName: " Marie Dupont ",
    customerPhone: " +33123456789 ",
    customerEmail: "",
    partySize: "4",
    reservationDate: "2026-05-15",
    reservationTime: "19:30",
    notes: " Window table ",
    subscribe: true
  });

  assert.equal(restaurantId, "4cfef81c-07a6-4e64-a523-5b1d021e17ff");
  assert.equal(payload.customerName, "Marie Dupont");
  assert.equal(payload.customerPhone, "+33123456789");
  assert.equal(payload.partySize, 4);
  assert.equal(payload.notes, "Window table");
  assert.equal(payload.subscribe, true);
  assert.match(payload.reservationDate, /^2026-05-15T19:30:00[+-]\d{2}:\d{2}$/);
  assert.equal("restaurantId" in payload, false);
  assert.equal("customerEmail" in payload, false);
});

test("does not accept mixed strings as numeric party sizes", () => {
  const payload = buildReservationPayload({
    customerName: "Marie Dupont",
    customerPhone: "+33123456789",
    partySize: "4abc",
    reservationDate: "2026-05-15",
    reservationTime: "19:30"
  });

  assert.equal(Number.isNaN(payload.partySize), true);
});

test("success copy does not expose reservation id or final confirmation", () => {
  const state = mapReservationResponse({ success: true, reservationId: 123 });

  assert.equal(state.kind, "success");
  assert.equal(state.title, "Réservation bien reçue");
  assert.equal(state.message, reservationCopy.successMessage);
  assert.equal(JSON.stringify(state).includes("123"), false);
  assert.equal(JSON.stringify(state).includes("confirmée"), false);
});

test("maps upstream opening-hours and capacity errors back to step one", () => {
  assert.deepEqual(
    mapReservationResponse({ error: "Outside opening hours" }),
    {
      kind: "time-error",
      step: 1,
      message: "Ce créneau est en dehors des horaires d'ouverture. Choisissez une autre heure.",
      fieldErrors: {}
    }
  );

  assert.deepEqual(
    mapReservationResponse({ error: "Reservation limit exceeded" }),
    {
      kind: "capacity-error",
      step: 1,
      message: "Ce créneau ou ce nombre de personnes n'est plus disponible. Essayez une autre heure ou réduisez le nombre de personnes.",
      fieldErrors: {}
    }
  );
});

test("maps field-level validation details to form field errors", () => {
  const state = mapReservationResponse({
    error: "Validation error",
    message: "Invalid fields",
    details: {
      customerPhone: "Phone is required",
      customerEmail: "Email is invalid"
    }
  });

  assert.equal(state.kind, "field-error");
  assert.equal(state.step, 2);
  assert.equal(state.message, "Invalid fields");
  assert.deepEqual(state.fieldErrors, {
    customerPhone: "Phone is required",
    customerEmail: "Email is invalid"
  });
});

test("maps unknown upstream errors to generic temporary copy", () => {
  const state = mapReservationResponse({
    error: "Internal upstream reason",
    message: "Database timeout"
  });

  assert.deepEqual(state, {
    kind: "temporary-error",
    step: 2,
    message: reservationCopy.temporary,
    fieldErrors: {}
  });
});

test("maps unknown upstream errors with details to generic temporary copy", () => {
  const state = mapReservationResponse({
    error: "Internal upstream reason",
    message: "Database timeout",
    details: {
      traceId: "abc123"
    }
  });

  assert.deepEqual(state, {
    kind: "temporary-error",
    step: 2,
    message: reservationCopy.temporary,
    fieldErrors: {}
  });
});
