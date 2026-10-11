import test from 'node:test';
import assert from 'node:assert/strict';
import { partitionTicketOrders, replaceRefundedOrder } from '../utils/refund-order.ts';

test('the refund response replaces its order and moves it from Upcoming to Past', () => {
  const original = {
    id: 14, reference: 'KX-7QF2LD', status: 'paid',
    isUpcoming: true, isRefundable: true, refundedAt: null,
  };
  const other = {
    id: 15, reference: 'KX-OTHER', status: 'paid',
    isUpcoming: true, isRefundable: true, refundedAt: null,
  };
  const updated = {
    ...original, status: 'refunded', isUpcoming: false,
    isRefundable: false, refundedAt: '2026-10-11T20:00:00Z',
  };

  const orders = replaceRefundedOrder([original, other], updated);
  assert.deepEqual(orders, [updated, other]);
  assert.deepEqual(partitionTicketOrders(orders).upcoming, [other]);
  assert.deepEqual(partitionTicketOrders(orders).past, [updated]);
  assert.equal(replaceRefundedOrder(undefined, updated), undefined);
});
