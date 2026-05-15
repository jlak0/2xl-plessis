# 2XL Reservation Module Design

Date: 2026-05-15

## Goal

Add a restaurant reservation module to the 2XL site. Guests can request a table from any page through a global reservation modal. The site submits requests through a Cloudflare Pages Function proxy, which forwards them to the existing restaurant API at `https://alpacai.net`.

The public UI must not expose editable restaurant identity. The reservation is created through the external API with restaurant ID `4cfef81c-07a6-4e64-a523-5b1d021e17ff`.

## User Experience

The navigation gets a clear `Réserver` action. Clicking it opens a modal over the current page. The modal uses a two-step flow:

1. `Quand venir ?`
   - Date
   - Time
   - Party size

2. `Vos coordonnées`
   - Customer name
   - Phone
   - Optional email
   - Optional notes
   - Optional marketing subscription checkbox

The user can go back from step 2 to step 1 without losing entered values. While submitting, the submit button is disabled and shows a loading state to prevent duplicate sends.

On success, the UI shows:

```text
Réservation bien reçue
Nous avons enregistré votre demande.
```

The UI does not display `reservationId`. It also does not say that the table is finally confirmed, because the API creates a pending reservation.

## Error States

Errors preserve the user's form input.

`Outside opening hours`

- Display: `Ce créneau est en dehors des horaires d'ouverture. Choisissez une autre heure.`
- Send the user back to step 1 so they can change date or time.

`Reservation limit exceeded`

- Display: `Ce créneau ou ce nombre de personnes n'est plus disponible. Essayez une autre heure ou réduisez le nombre de personnes.`
- Send the user back to step 1 so they can change time or party size.

Field validation errors

- If the API returns `details`, map known fields to the matching form field.
- Unknown field errors appear as a general form message.
- Do not clear user input.

Temporary, rate-limit, or generic API errors

- Display: `Nous n'avons pas pu envoyer la demande pour le moment. Réessayez dans quelques minutes.`

Network failures

- Display: `Connexion impossible. Vérifiez votre réseau puis réessayez.`

## Data Flow

The browser posts to the same-origin Pages Function:

```http
POST /api/external/reservations
Content-Type: application/json
```

The front end sends only user-entered reservation fields:

```json
{
  "customerName": "Marie Dupont",
  "customerPhone": "+33123456789",
  "customerEmail": "marie@example.com",
  "partySize": 4,
  "reservationDate": "2026-05-15T19:30:00+02:00",
  "notes": "Window table",
  "subscribe": true
}
```

The Pages Function inserts the fixed restaurant ID and forwards the upstream payload:

```json
{
  "restaurantId": "4cfef81c-07a6-4e64-a523-5b1d021e17ff",
  "customerName": "Marie Dupont",
  "customerPhone": "+33123456789",
  "customerEmail": "marie@example.com",
  "partySize": 4,
  "reservationDate": "2026-05-15T19:30:00+02:00",
  "notes": "Window table",
  "subscribe": true
}
```

The Pages Function forwards to:

```text
https://alpacai.net/api/external/reservations
```

No authentication header is used.

## Date and Time Handling

The form collects date and time separately for usability. The browser combines them into an ISO 8601 date-time string with the local timezone offset, for example:

```text
2026-05-15T19:30:00+02:00
```

The implementation must avoid sending a timezone-less value.

## Cloudflare Pages Function

Create `functions/api/external/reservations.js`.

Responsibilities:

- Accept only `POST`; return `405` for other methods.
- Parse JSON safely; return `400` for malformed JSON.
- Validate required fields before proxying:
  - `customerName`: string, at least 2 characters after trimming.
  - `customerPhone`: string, 6 to 20 characters after trimming.
  - `partySize`: integer from 1 to 300.
  - `reservationDate`: valid date-time string.
  - `customerEmail`: optional valid email if present.
  - `notes`: optional string no longer than 500 characters.
  - `subscribe`: optional boolean, default false.
- Add the fixed `restaurantId`.
- Omit empty optional fields such as blank email or blank notes.
- Forward the upstream response status and JSON body.
- Return a JSON error response for validation, network, and upstream parsing failures.

Rate limiting remains the upstream API's responsibility. If upstream returns a rate-limit error, the function should pass it through so the UI can show a temporary error.

## Front-End Files

`src/main.js`

- Add the `Réserver` navigation action.
- Render the reservation modal at app level so it is available from every route.
- Add two-step form state management.
- Build the request payload and submit to `/api/external/reservations`.
- Map server success and errors to UI states.

`src/styles.css`

- Add modal, step, field, inline error, loading, and success styles.
- Keep the current 2XL visual language: restrained glass controls, strong typography, dark green/cream base, rectangular form fields with stable dimensions.
- Ensure mobile fields do not overflow or overlap.

`src/data.js`

- Export the restaurant ID and any small reservation constants needed by the UI.

## Testing

`test/reservation.test.js`

- Verifies the front-end helper builds ISO 8601 reservation date-time values with timezone offsets.
- Verifies success copy does not include `reservationId`.
- Verifies known upstream errors map to the expected user messages and step behavior.
- Verifies the submitted browser payload does not expose an editable restaurant ID field.

`test/reservation-function.test.js`

- Verifies non-POST methods return `405`.
- Verifies malformed JSON and missing required fields return validation errors.
- Verifies the proxy posts to `https://alpacai.net/api/external/reservations`.
- Verifies the function injects restaurant ID `4cfef81c-07a6-4e64-a523-5b1d021e17ff`.
- Verifies optional blank email and notes are omitted.
- Verifies upstream success and error JSON are passed back to the client.

## Non-Goals

- No admin reservation management UI.
- No final confirmation workflow.
- No payment, deposit, captcha, or SMS verification.
- No client-side rate limiting beyond disabling duplicate submit while a request is in flight.
- No authentication for the upstream proxy because the selected backend endpoint does not require it.
