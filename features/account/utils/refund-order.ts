import type { TicketOrder } from '../types/tickets.types';

export const replaceRefundedOrder = (
  orders: TicketOrder[] | undefined,
  updatedOrder: TicketOrder
): TicketOrder[] | undefined => orders?.map((order) =>
  order.id === updatedOrder.id && order.reference === updatedOrder.reference
    ? updatedOrder
    : order
);

export const partitionTicketOrders = (orders: TicketOrder[]) => ({
  upcoming: orders.filter((order) => order.isUpcoming && order.status === 'paid'),
  past: orders.filter((order) => !order.isUpcoming || order.status !== 'paid'),
});
