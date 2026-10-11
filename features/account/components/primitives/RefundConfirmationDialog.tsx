'use client';

import PopupWrapper from '@/features/common/components/primitives/PopupWrapper';
import type { TicketOrder } from '../../types/tickets.types';

interface RefundConfirmationDialogProps {
  order: TicketOrder;
  pending: boolean;
  error: string | null;
  onConfirm: () => void;
  onClose: () => void;
}

export default function RefundConfirmationDialog({
  order,
  pending,
  error,
  onConfirm,
  onClose,
}: RefundConfirmationDialogProps) {
  return (
    <PopupWrapper
      label={`Refund order ${order.reference}`}
      onClose={onClose}
      closeDisabled={pending}
    >
      <div aria-busy={pending} className="text-white">
        <h2 className="pr-8 text-2xl font-extrabold">Refund tickets?</h2>
        <p className="mt-3 text-sm text-[#A9A9A9]">
          This will release your seats. The refund cannot be undone.
        </p>

        <div className="mt-6 rounded-xl bg-[#1E2031] p-4 text-sm">
          <p className="font-bold">{order.session.movie.title}</p>
          <p className="mt-1 text-[#A9A9A9]">Order #{order.reference}</p>
          <p className="mt-3 text-[#A9A9A9]">
            Seats: {order.tickets.map((ticket) => ticket.seatCode).join(', ')}
          </p>
          <p className="mt-3 font-semibold">
            Total paid: ₾{order.totalPrice.toLocaleString('en-US', { maximumFractionDigits: 2 })}
          </p>
        </div>

        {error && <p role="alert" className="mt-4 text-sm text-[#FF634F]">{error}</p>}

        <div className="mt-6 flex flex-wrap justify-end gap-3">
          <button
            type="button"
            disabled={pending}
            onClick={onClose}
            className="cursor-pointer rounded-full bg-[#2A2C3D] px-5 py-2.5 text-sm font-bold disabled:cursor-not-allowed disabled:opacity-60"
          >
            Keep tickets
          </button>
          <button
            type="button"
            disabled={pending}
            onClick={onConfirm}
            className="cursor-pointer rounded-full bg-[#FF321F] px-5 py-2.5 text-sm font-bold disabled:cursor-not-allowed disabled:opacity-60"
          >
            {pending ? 'Refunding…' : 'Confirm refund'}
          </button>
        </div>
      </div>
    </PopupWrapper>
  );
}
