import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { test } from "node:test";
import {
  buildReservationDateTime,
  buildReservationPayload,
  mapReservationResponse,
  networkReservationState,
  reservationCopy,
  reservationTimesForDate,
  restaurantDateAndTime,
  restaurantId
} from "../src/reservation.js";

test("uses the selected day's service hours, including French public holidays", () => {
  const now = new Date("2026-11-19T12:00:00Z");
  const serviceEnds = (date) => {
    const times = reservationTimesForDate(date, now);
    return [times.filter((time) => time < "18:50").at(-1), times.at(-1)];
  };

  assert.deepEqual(serviceEnds("2027-01-04"), ["14:00", "22:00"]); // Monday
  assert.deepEqual(serviceEnds("2027-01-08"), ["14:00", "22:30"]); // Friday
  assert.deepEqual(serviceEnds("2027-01-09"), ["14:30", "22:30"]); // Saturday
  for (const date of ["2027-01-10", "2027-01-01", "2027-03-29", "2027-05-06", "2027-05-17"]) {
    assert.deepEqual(serviceEnds(date), ["14:30", "22:00"], date);
  }
});

test("filters elapsed slots and dates using Paris local time", () => {
  const now = new Date("2026-06-12T20:00:00Z");
  assert.deepEqual(reservationTimesForDate("2026-06-12", now), ["22:10", "22:20", "22:30"]);
  assert.deepEqual(reservationTimesForDate("2026-06-11", now), []);
  assert.deepEqual(reservationTimesForDate("2027-02-30", now), []);
  assert.deepEqual(restaurantDateAndTime(new Date("2026-06-12T22:05:00Z")), { date: "2026-06-13", time: "00:05" });
});

test("builds ISO 8601 reservation date-time with timezone offset", () => {
  assert.match(buildReservationDateTime("2026-05-15", "19:30"), /^2026-05-15T19:30:00[+-]\d{2}:\d{2}$/);
});

test("builds restaurant-local reservation date-times independent of process timezone", () => {
  for (const timezone of ["America/New_York", "Asia/Tokyo"]) {
    const result = spawnSync(
      process.execPath,
      [
        "--input-type=module",
        "-e",
        `
          import assert from "node:assert/strict";
          import { buildReservationDateTime } from "./src/reservation.js";

          assert.equal(buildReservationDateTime("2026-05-15", "19:30"), "2026-05-15T19:30:00+02:00");
          assert.equal(buildReservationDateTime("2026-01-15", "19:30"), "2026-01-15T19:30:00+01:00");
        `
      ],
      {
        cwd: process.cwd(),
        env: { ...process.env, TZ: timezone },
        encoding: "utf8"
      }
    );

    assert.equal(result.status, 0, `${timezone}\n${result.stdout}\n${result.stderr}`);
  }
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

test("only accepts decimal positive-integer strings within the reservation limit as party sizes", () => {
  for (const partySize of ["", " ", null, "0", "4.5", "0x10", "301", "999999999999999999999999999999999999", "9".repeat(400), "Infinity"]) {
    const payload = buildReservationPayload({
      customerName: "Marie Dupont",
      customerPhone: "+33123456789",
      partySize,
      reservationDate: "2026-05-15",
      reservationTime: "19:30"
    });

    assert.equal(Number.isNaN(payload.partySize), true);
  }

  for (const [partySize, expected] of [
    ["1", 1],
    ["4", 4],
    ["300", 300]
  ]) {
    const payload = buildReservationPayload({
      customerName: "Marie Dupont",
      customerPhone: "+33123456789",
      partySize,
      reservationDate: "2026-05-15",
      reservationTime: "19:30"
    });

    assert.equal(payload.partySize, expected);
  }
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

test("maps reservation date validation errors back to step one", () => {
  const state = mapReservationResponse({
    error: "Validation error",
    message: "Invalid fields",
    details: {
      reservationDate: "Bad date"
    }
  });

  assert.equal(state.kind, "field-error");
  assert.equal(state.step, 1);
  assert.equal(state.message, "Invalid fields");
  assert.deepEqual(state.fieldErrors, {
    reservationDate: "Bad date"
  });
});

test("maps party size validation errors back to step one", () => {
  const state = mapReservationResponse({
    error: "Validation error",
    message: "Invalid fields",
    details: {
      partySize: "Too many guests"
    }
  });

  assert.equal(state.kind, "field-error");
  assert.equal(state.step, 1);
  assert.equal(state.message, "Invalid fields");
  assert.deepEqual(state.fieldErrors, {
    partySize: "Too many guests"
  });
});

test("maps validation errors with array details to generic temporary copy", () => {
  const state = mapReservationResponse({
    error: "Validation error",
    message: "Invalid fields",
    details: ["bad"]
  });

  assert.deepEqual(state, {
    kind: "temporary-error",
    step: 2,
    message: reservationCopy.temporary,
    fieldErrors: {}
  });
});

test("filters unexpected validation detail keys from field errors", () => {
  const state = mapReservationResponse({
    error: "Validation error",
    message: "Invalid fields",
    details: {
      debug: "internal",
      customerPhone: "Phone is required"
    }
  });

  assert.equal(state.kind, "field-error");
  assert.equal(state.step, 2);
  assert.equal(state.message, "Invalid fields");
  assert.deepEqual(state.fieldErrors, {
    customerPhone: "Phone is required"
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

test("provides a dedicated network failure state", () => {
  assert.deepEqual(networkReservationState(), {
    kind: "network-error",
    step: 2,
    message: reservationCopy.network,
    fieldErrors: {}
  });
});
