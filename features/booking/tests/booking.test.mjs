import test from 'node:test';
import assert from 'node:assert/strict';

import {
  availableTicketTypes,
  confirmationDetails,
  holdStorageKey,
  isOldEnough,
  reconcileContested,
  releaseUnpaidHold,
  restoreBookingHold,
  restoreChoices,
  seatCategory,
  secondsUntil,
  toggleSeatChoice,
} from '../lib/booking-utils.ts';
import { checkoutSchema } from '../schema/checkout-schema.ts';
import { formatCardExpiry } from '../lib/format-card-expiry.ts';
import { findNextBookableSession, hasSessionStarted } from '../../movie/utils/session-availability.ts';

const options = {
  ticketTypes: [
    { id: 1, slug: 'adult', name: 'Adult', priceRatio: 1, blockedFromRatingAge: null },
    { id: 2, slug: 'student', name: 'Student', priceRatio: 0.75, blockedFromRatingAge: null },
    { id: 3, slug: 'child', name: 'Child', priceRatio: 0.6, blockedFromRatingAge: 16 },
  ],
  maxSeatsPerOrder: 3,
};

const holdResponse = (overrides = {}) => ({
  holdId: '3fa85f64-5717-4562-b3fc-2c963f66afa6',
  sessionId: 1476,
  expiresAt: new Date(Date.now() + 480_000).toISOString(),
  secondsRemaining: 480,
  isLive: true,
  subtotal: 24,
  seats: [{ seatId: 1050, code: 'E7', ticketType: { slug: 'adult', name: 'Adult' }, price: 24 }],
  ...overrides,
});

test('ticket restrictions come from filter options and a fourth seat is rejected', () => {
  assert.deepEqual(availableTicketTypes(options, 16).map((type) => type.slug), ['adult', 'student']);
  assert.deepEqual(availableTicketTypes(options, 12).map((type) => type.slug), ['adult', 'student', 'child']);
  assert.equal(isOldEnough(15, 16), false);
  assert.equal(isOldEnough(16, 16), true);
  assert.equal(isOldEnough(null, 0), true);
  let choices = [];
  for (let id = 1; id <= 3; id++) choices = toggleSeatChoice(choices, { id, code: `A${id}` }, options.maxSeatsPerOrder).choices;
  const fourth = toggleSeatChoice(choices, { id: 4, code: 'A4' }, options.maxSeatsPerOrder);
  assert.equal(fourth.limitReached, true);
  assert.equal(fourth.choices.length, 3);
  assert.equal(toggleSeatChoice(choices, { id: 2, code: 'A2' }, 3).choices.length, 2);
  assert.equal(choices[0].ticketType, 'adult');
});

test('a live GET /holds response restores seats and the absolute expiry', async () => {
  const response = holdResponse();
  const calls = [];
  const restored = await restoreBookingHold(response.holdId, 1476, async (id) => {
    calls.push(id);
    return response;
  });
  assert.deepEqual(calls, [response.holdId]);
  assert.equal(restored.status, 'live');
  assert.deepEqual(restoreChoices(restored.hold), [{ seatId: 1050, code: 'E7', ticketType: 'adult' }]);
  assert.ok(secondsUntil(response.expiresAt) <= 480);
  assert.equal(holdStorageKey(5, '1476'), 'kinoxii_hold:5:1476');
});

test('expired or foreign-session holds cannot restore checkout', async () => {
  const expired = holdResponse({ isLive: false, secondsRemaining: 0 });
  assert.equal((await restoreBookingHold(expired.holdId, 1476, async () => expired)).status, 'expired');
  const foreign = holdResponse({ sessionId: 9999 });
  assert.equal((await restoreBookingHold(foreign.holdId, 1476, async () => foreign)).status, 'expired');
  assert.equal(secondsUntil('2020-01-01T00:00:00Z'), 0);
});

test('a 409 contested list only removes lost seat codes', () => {
  const choices = [
    { seatId: 1050, code: 'E7', ticketType: 'adult' },
    { seatId: 1051, code: 'E8', ticketType: 'student' },
    { seatId: 1052, code: 'E9', ticketType: 'adult' },
  ];
  assert.deepEqual(reconcileContested(choices, ['E8']), [choices[0], choices[2]]);
});

test('exit releases an unpaid hold once and paid confirmation skips release', async () => {
  const released = [];
  const release = async (id) => { released.push(id); };
  await releaseUnpaidHold('hold-one', false, release);
  await releaseUnpaidHold('hold-two', true, release);
  await releaseUnpaidHold(null, false, release);
  assert.deepEqual(released, ['hold-one']);
});

test('checkout accepts formatted card/contact and rejects invalid inputs', () => {
  const valid = {
    fullName: 'Jane Doe', email: 'jane@example.com', mobileNumber: '599 123 456',
    cardNumber: '4242 4242 4242 4242', expiry: '12/99', cvv: '123',
  };
  assert.equal(checkoutSchema.safeParse(valid).success, true);
  const invalid = checkoutSchema.safeParse({ ...valid, mobileNumber: '499123456', cardNumber: '123', expiry: '01/20', cvv: '12' });
  assert.equal(invalid.success, false);
  assert.deepEqual(invalid.error.issues.map((issue) => issue.path[0]).sort(), ['cardNumber', 'cvv', 'expiry', 'mobileNumber']);
});

test('expiry input formats four digits and supports deleting back to the month', () => {
  assert.equal(formatCardExpiry('1129'), '11/29');
  assert.equal(formatCardExpiry('11/29'), '11/29');
  assert.equal(formatCardExpiry('11/'), '11');
  assert.equal(formatCardExpiry('112'), '11/2');
  assert.equal(formatCardExpiry('11 / 29 extra'), '11/29');
  assert.equal(formatCardExpiry('112999'), '11/29');

  const values = {
    fullName: 'Jane Doe', email: 'jane@example.com', mobileNumber: '599123456',
    cardNumber: '4242424242424242', expiry: formatCardExpiry('1299'), cvv: '123',
  };
  assert.equal(checkoutSchema.safeParse(values).success, true);
});

test('confirmation fields are taken from the order response', () => {
  const orderResponse = {
    reference: 'KX-7QF2LD', totalPrice: 32,
    session: {
      movie: { title: 'The Odyssey' }, venue: { name: 'Galleria Tbilisi' },
      hall: { name: 'B' }, date: '2026-10-11', time: '16:30',
    },
    tickets: [{ seatCode: 'B3', ticketType: { name: 'Adult' } }],
  };
  const confirmation = confirmationDetails(orderResponse);
  assert.equal(confirmation.reference, 'KX-7QF2LD');
  assert.equal(confirmation.title, 'The Odyssey');
  assert.equal(confirmation.totalPrice, 32);
  assert.deepEqual(confirmation.seatCodes, ['B3']);
});

test('seat categories distinguish selected, sold, held and permanent gaps', () => {
  const seat = { id: 1, code: 'A1', state: 'available', isMine: false };
  assert.equal(seatCategory(seat, false, false), 'available');
  assert.equal(seatCategory(seat, true, false), 'selected');
  assert.equal(seatCategory(seat, false, true), 'sold');
  assert.equal(seatCategory({ ...seat, state: 'held' }, false, false), 'held');
  assert.equal(seatCategory({ ...seat, state: 'held', isMine: true }, false, false), 'available');
  assert.equal(seatCategory({ ...seat, state: 'unavailable' }, false, false), 'unavailable');
});

test('started check uses the absolute API timestamp and home selects the next future session', () => {
  const now = Date.parse('2026-10-11T18:59:36Z');
  assert.equal(hasSessionStarted('2026-10-11T10:00:00+00:00', now), true);
  assert.equal(hasSessionStarted('2026-10-11T23:00:00+04:00', now), false);
  assert.equal(hasSessionStarted('2026-10-11T18:59:36Z', now), true);

  const venues = [{ sessions: [
    { id: 1, startsAt: '2026-10-11T10:00:00Z', seatsLeft: 41, isSoldOut: false },
    { id: 2, startsAt: '2026-10-11T20:30:00Z', seatsLeft: 0, isSoldOut: true },
    { id: 3, startsAt: '2026-10-11T20:00:00Z', seatsLeft: 9, isSoldOut: false },
    { id: 4, startsAt: '2026-10-11T19:30:00Z', seatsLeft: 3, isSoldOut: false },
  ] }];
  assert.equal(findNextBookableSession(venues, now).id, 4);
  assert.equal(findNextBookableSession(venues, Date.parse('2026-10-12T00:00:00Z')), null);
});
