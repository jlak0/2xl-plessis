import assert from "node:assert/strict";
import { afterEach, test } from "node:test";
import { onRequest } from "../functions/api/external/reservations.js";

const upstreamUrl = "https://alpacai.net/api/external/reservations";

function request(method, body) {
  return new Request("https://example.com/api/external/reservations", {
    method,
    headers: body === undefined ? {} : { "Content-Type": "application/json" },
    body: body === undefined ? undefined : JSON.stringify(body)
  });
}

async function json(response) {
  return response.json();
}

afterEach(() => {
  globalThis.fetch = fetch;
});

test("rejects non-POST methods", async () => {
  const response = await onRequest({ request: request("GET") });
  assert.equal(response.status, 405);
  assert.deepEqual(await json(response), { error: "Method not allowed" });
});

test("returns validation errors for missing required fields", async () => {
  const response = await onRequest({ request: request("POST", { customerName: "A" }) });
  const body = await json(response);

  assert.equal(response.status, 400);
  assert.equal(body.error, "Validation error");
  assert.equal(body.details.customerName, "Name must be at least 2 characters.");
  assert.equal(body.details.customerPhone, "Phone must be 6 to 20 characters.");
  assert.equal(body.details.partySize, "Party size must be between 1 and 300.");
  assert.equal(body.details.reservationDate, "Reservation date must be a valid date-time.");
});

test("rejects non-string customer names", async () => {
  const response = await onRequest({
    request: request("POST", {
      customerName: 123,
      customerPhone: "+33123456789",
      partySize: 4,
      reservationDate: "2026-05-15T19:30:00+02:00"
    })
  });
  const body = await json(response);

  assert.equal(response.status, 400);
  assert.equal(body.error, "Validation error");
  assert.equal(body.details.customerName, "Name must be at least 2 characters.");
});

test("rejects non-string customer phones", async () => {
  const response = await onRequest({
    request: request("POST", {
      customerName: "Marie Dupont",
      customerPhone: 123456,
      partySize: 4,
      reservationDate: "2026-05-15T19:30:00+02:00"
    })
  });
  const body = await json(response);

  assert.equal(response.status, 400);
  assert.equal(body.error, "Validation error");
  assert.equal(body.details.customerPhone, "Phone must be 6 to 20 characters.");
});

test("rejects non-integer party sizes", async () => {
  for (const partySize of ["4abc", 4.5, "4"]) {
    const response = await onRequest({
      request: request("POST", {
        customerName: "Marie Dupont",
        customerPhone: "+33123456789",
        partySize,
        reservationDate: "2026-05-15T19:30:00+02:00"
      })
    });
    const body = await json(response);

    assert.equal(response.status, 400);
    assert.equal(body.error, "Validation error");
    assert.equal(body.details.partySize, "Party size must be between 1 and 300.");
  }
});

test("rejects invalid calendar reservation dates", async () => {
  const response = await onRequest({
    request: request("POST", {
      customerName: "Marie Dupont",
      customerPhone: "+33123456789",
      partySize: 4,
      reservationDate: "2026-02-30T19:30:00+02:00"
    })
  });
  const body = await json(response);

  assert.equal(response.status, 400);
  assert.equal(body.error, "Validation error");
  assert.equal(body.details.reservationDate, "Reservation date must be a valid date-time.");
});

test("rejects non-string optional fields", async () => {
  const cases = [
    ["customerEmail", false, "Email must be valid."],
    ["notes", 0, "Notes must be 500 characters or fewer."]
  ];

  for (const [field, value, message] of cases) {
    const response = await onRequest({
      request: request("POST", {
        customerName: "Marie Dupont",
        customerPhone: "+33123456789",
        partySize: 4,
        reservationDate: "2026-05-15T19:30:00+02:00",
        [field]: value
      })
    });
    const body = await json(response);

    assert.equal(response.status, 400);
    assert.equal(body.error, "Validation error");
    assert.equal(body.details[field], message);
  }
});

test("rejects non-boolean subscribe values", async () => {
  const response = await onRequest({
    request: request("POST", {
      customerName: "Marie Dupont",
      customerPhone: "+33123456789",
      partySize: 4,
      reservationDate: "2026-05-15T19:30:00+02:00",
      subscribe: "false"
    })
  });
  const body = await json(response);

  assert.equal(response.status, 400);
  assert.equal(body.error, "Validation error");
  assert.equal(body.details.subscribe, "Subscribe must be a boolean.");
});

test("injects restaurant id and proxies valid requests upstream", async () => {
  let receivedUrl = "";
  let receivedInit = {};
  globalThis.fetch = async (url, init) => {
    receivedUrl = url;
    receivedInit = init;
    return Response.json({ success: true, reservationId: 77 }, { status: 200 });
  };

  const response = await onRequest({
    request: request("POST", {
      customerName: "Marie Dupont",
      customerPhone: "+33123456789",
      customerEmail: "",
      partySize: 4,
      reservationDate: "2026-05-15T19:30:00+02:00",
      notes: "",
      subscribe: true
    })
  });

  assert.equal(response.status, 200);
  assert.deepEqual(await json(response), { success: true, reservationId: 77 });
  assert.equal(receivedUrl, upstreamUrl);
  assert.equal(receivedInit.method, "POST");
  assert.equal(receivedInit.headers["Content-Type"], "application/json");

  const upstreamBody = JSON.parse(receivedInit.body);
  assert.equal(upstreamBody.restaurantId, "4cfef81c-07a6-4e64-a523-5b1d021e17ff");
  assert.equal(upstreamBody.customerName, "Marie Dupont");
  assert.equal(upstreamBody.customerPhone, "+33123456789");
  assert.equal(upstreamBody.partySize, 4);
  assert.equal(upstreamBody.reservationDate, "2026-05-15T19:30:00+02:00");
  assert.equal(upstreamBody.subscribe, true);
  assert.equal("customerEmail" in upstreamBody, false);
  assert.equal("notes" in upstreamBody, false);
});

test("keeps numeric integer party size valid", async () => {
  let receivedInit = {};
  globalThis.fetch = async (_url, init) => {
    receivedInit = init;
    return Response.json({ success: true }, { status: 200 });
  };

  const response = await onRequest({
    request: request("POST", {
      customerName: "Marie Dupont",
      customerPhone: "+33123456789",
      partySize: 4,
      reservationDate: "2026-05-15T19:30:00+02:00"
    })
  });

  assert.equal(response.status, 200);

  const upstreamBody = JSON.parse(receivedInit.body);
  assert.equal(upstreamBody.partySize, 4);
});

test("defaults missing subscribe to false when proxying valid requests", async () => {
  let receivedInit = {};
  globalThis.fetch = async (_url, init) => {
    receivedInit = init;
    return Response.json({ success: true }, { status: 200 });
  };

  const response = await onRequest({
    request: request("POST", {
      customerName: "Marie Dupont",
      customerPhone: "+33123456789",
      partySize: 4,
      reservationDate: "2026-05-15T19:30:00+02:00"
    })
  });

  assert.equal(response.status, 200);

  const upstreamBody = JSON.parse(receivedInit.body);
  assert.equal(upstreamBody.subscribe, false);
});

test("passes through upstream reservation errors", async () => {
  globalThis.fetch = async () => Response.json(
    { error: "Outside opening hours", message: "Closed" },
    { status: 409 }
  );

  const response = await onRequest({
    request: request("POST", {
      customerName: "Marie Dupont",
      customerPhone: "+33123456789",
      partySize: 4,
      reservationDate: "2026-05-15T03:30:00+02:00"
    })
  });

  assert.equal(response.status, 409);
  assert.deepEqual(await json(response), { error: "Outside opening hours", message: "Closed" });
});
