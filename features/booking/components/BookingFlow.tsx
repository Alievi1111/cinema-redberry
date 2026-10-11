'use client';

import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { useAuthUser } from '@/features/auth/hook/use-auth-user';
import PopupWrapper from '@/features/common/components/primitives/PopupWrapper';
import { useSeatSelection } from '@/features/seats/hooks/use-seat-selection';
import type { Seat } from '@/features/seats/types/seats.types';
import { useFilterOptions } from '@/features/sessions/hook/use-filter-options';
import { hasSessionStarted } from '@/features/movie/utils/session-availability';
import { createHoldApi, createOrderApi, getHoldApi, releaseHoldApi } from '../api/booking-api';
import type { CheckoutValues } from '../schema/checkout-schema';
import type { BookingApiError, BookingOrder, SeatChoice, SeatHold } from '../types/booking.types';
import { availableTicketTypes, bookingSecondsUntil, bookingWindowStorageKey, confirmationDetails, holdStorageKey, isLiveHold, isOldEnough, reconcileContested, releaseUnpaidHold, restoreBookingHold, restoreChoices, secondsUntil, toggleSeatChoice } from '../lib/booking-utils';
import CheckoutForm, { type CheckoutError } from './CheckoutForm';
import SeatMapPicker from './SeatMapPicker';

interface BookingFlowProps {
  sessionId: string;
  expectedMovieSlug?: string;
  onExit: () => void;
}

const money = (value: number) => `₾ ${Number(value).toFixed(2).replace(/\.00$/, '')}`;
const buttonClass = 'rounded-full bg-[#EC3013] px-5 py-3 text-sm font-bold text-white transition-colors hover:bg-[#FF482B] disabled:cursor-not-allowed disabled:bg-[#535563] disabled:text-[#B9B9C1]';

export default function BookingFlow({ sessionId, expectedMovieSlug, onExit }: BookingFlowProps) {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { user, refetch: refetchUser } = useAuthUser();
  const { session, seatMap } = useSeatSelection(sessionId, Boolean(user?.profileComplete));
  const options = useFilterOptions();
  const storageKey = user ? holdStorageKey(user.id, sessionId) : null;
  const bookingWindowKey = user ? bookingWindowStorageKey(user.id, sessionId) : null;
  const [storedId, setStoredId] = useState<string | null>(() => storageKey && typeof window !== 'undefined' ? localStorage.getItem(storageKey) : null);
  const [hold, setHold] = useState<SeatHold | null>(null);
  const [choices, setChoices] = useState<SeatChoice[]>([]);
  const [step, setStep] = useState<'seats' | 'checkout'>('seats');
  const [order, setOrder] = useState<BookingOrder | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [checkoutError, setCheckoutError] = useState<CheckoutError | null>(null);
  const [contested, setContested] = useState<string[]>([]);
  const [now, setNow] = useState(() => Date.now());
  const [bookingStartedAt, setBookingStartedAt] = useState<number | null>(null);
  const latestHoldId = useRef<string | null>(storedId);

  useEffect(() => {
    if (!bookingWindowKey) return;
    const saved = Number(sessionStorage.getItem(bookingWindowKey));
    const startedAt = Number.isFinite(saved) && saved > 0 ? saved : Date.now();
    sessionStorage.setItem(bookingWindowKey, String(startedAt));
    queueMicrotask(() => {
      setBookingStartedAt(startedAt);
      setNow(Date.now());
    });
  }, [bookingWindowKey]);

  const holdQuery = useQuery({
    queryKey: ['booking-hold', user?.id, sessionId, storedId],
    queryFn: () => restoreBookingHold(storedId!, Number(sessionId), getHoldApi),
    enabled: Boolean(user && storedId && !hold && !order),
    retry: false,
  });
  const holdMutation = useMutation({ mutationFn: (seats: SeatChoice[]) => createHoldApi(sessionId, seats) });
  const orderMutation = useMutation({ mutationFn: ({ id, values }: { id: string; values: CheckoutValues }) => createOrderApi(id, values) });

  const forgetHold = () => {
    if (storageKey) localStorage.removeItem(storageKey);
    latestHoldId.current = null;
    setStoredId(null);
    setHold(null);
  };

  const restartBookingWindow = () => {
    const startedAt = Date.now();
    if (bookingWindowKey) sessionStorage.setItem(bookingWindowKey, String(startedAt));
    setBookingStartedAt(startedAt);
    setNow(startedAt);
  };

  const resetExpired = (warning = 'Your hold time expired. Please re-select your seats.') => {
    const id = latestHoldId.current;
    if (id && hold && isLiveHold(hold)) {
      void releaseHoldApi(id).catch(() => {});
    }
    forgetHold();
    setChoices([]);
    setStep('seats');
    setCheckoutError(null);
    setMessage(warning);
    restartBookingWindow();
    void queryClient.invalidateQueries({ queryKey: ['seat-map', sessionId] });
  };

  useEffect(() => {
    const restored = holdQuery.data;
    if (!restored || bookingStartedAt === null || !options.data || hold || order) return;
    if (restored.status === 'expired') {
      queueMicrotask(() => resetExpired());
      return;
    }
    if (bookingSecondsUntil(bookingStartedAt, options.data.holdMinutes, restored.hold.expiresAt) === 0) {
      queueMicrotask(() => resetExpired('Your booking time expired. Please re-select your seats.'));
      return;
    }
    queueMicrotask(() => {
      latestHoldId.current = restored.hold.holdId;
      setHold(restored.hold);
      setChoices(restoreChoices(restored.hold));
      setStep('checkout');
      void queryClient.invalidateQueries({ queryKey: ['seat-map', sessionId] });
    });
  // Restoration waits for the persisted booking start and the GET result.
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [holdQuery.data, bookingStartedAt, options.data]);

  useEffect(() => {
    if (!holdQuery.isError || !storedId) return;
    const status = axios.isAxiosError(holdQuery.error) ? holdQuery.error.response?.status : undefined;
    queueMicrotask(() => {
      forgetHold();
      setMessage(status === 403 || status === 404 ? 'This hold is no longer available. Please choose seats again.' : 'Could not restore your hold. Please choose seats again.');
    });
  // Handle a failed restore only once for the persisted identifier.
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [holdQuery.isError, storedId]);

  useEffect(() => {
    const tick = () => setNow(Date.now());
    const timer = window.setInterval(tick, 1000);
    return () => window.clearInterval(timer);
  }, []);

  useEffect(() => {
    if (bookingStartedAt === null || !options.data || order || holdMutation.isPending || orderMutation.isPending) return;
    if (bookingSecondsUntil(bookingStartedAt, options.data.holdMinutes, hold?.expiresAt ?? null, now) > 0) return;
    const warning = hold && secondsUntil(hold.expiresAt, now) === 0
      ? 'Your hold time expired. Please re-select your seats.'
      : 'Your booking time expired. Please re-select your seats.';
    queueMicrotask(() => resetExpired(warning));
  // Countdown uses the opening time and the absolute hold expiry.
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [bookingStartedAt, options.data, hold, now, order, holdMutation.isPending, orderMutation.isPending]);

  const invalidateBooking = () => {
    for (const key of ['seat-map', 'seat-session', 'sessions', 'movie-sessions', 'my-tickets']) {
      void queryClient.invalidateQueries({ queryKey: [key] });
    }
  };

  const handleExit = () => {
    if (holdMutation.isPending || orderMutation.isPending) return;
    if (bookingWindowKey) sessionStorage.removeItem(bookingWindowKey);
    const id = latestHoldId.current;
    if (id && !order) {
      forgetHold();
      void releaseUnpaidHold(id, false, releaseHoldApi).finally(invalidateBooking).catch(() => {});
    }
    onExit();
  };

  const recoverConflict = (error: BookingApiError) => {
    const lost = error.contested ?? [];
    setChoices((current) => reconcileContested(current, lost));
    setContested(lost);
    setStep('seats');
    forgetHold();
    setMessage(lost.length ? `${error.message} Lost seats: ${lost.join(', ')}.` : error.message);
    void queryClient.invalidateQueries({ queryKey: ['seat-map', sessionId] });
  };

  const handleHold = async () => {
    if (!choices.length || holdMutation.isPending || orderMutation.isPending || bookingStartedAt === null || !options.data) return;
    setMessage(null);
    if (bookingSecondsUntil(bookingStartedAt, options.data.holdMinutes, hold?.expiresAt ?? null) === 0) {
      resetExpired('Your booking time expired. Please re-select your seats.');
      return;
    }
    if (hold && isLiveHold(hold) && choices.length === hold.seats.length &&
      choices.every((choice) => hold.seats.some((seat) => seat.seatId === choice.seatId && seat.ticketType.slug === choice.ticketType))) {
      setStep('checkout');
      return;
    }
    if (hasSessionStarted(session.data?.startsAt, Date.now())) {
      setNow(Date.now());
      setMessage('This session has already started. Choose a later showtime.');
      return;
    }
    try {
      const result = await holdMutation.mutateAsync(choices);
      if (bookingSecondsUntil(bookingStartedAt, options.data.holdMinutes, result.expiresAt) === 0) {
        void releaseHoldApi(result.holdId).catch(() => {});
        resetExpired('Your booking time expired. Please re-select your seats.');
        return;
      }
      if (storageKey) localStorage.setItem(storageKey, result.holdId);
      latestHoldId.current = result.holdId;
      setStoredId(result.holdId);
      setHold(result);
      setChoices(restoreChoices(result));
      setNow(Date.now());
      setStep('checkout');
      void queryClient.invalidateQueries({ queryKey: ['seat-map', sessionId] });
    } catch (error) {
      const status = axios.isAxiosError<BookingApiError>(error) ? error.response?.status : undefined;
      const body = axios.isAxiosError<BookingApiError>(error) ? error.response?.data : undefined;
      if (status === 409 && body) recoverConflict(body);
      else if (status === 422) {
        setMessage(body?.errors ? Object.values(body.errors).flat().join(' ') : body?.message ?? 'Could not hold these seats.');
        if (body?.message?.toLowerCase().includes('profile')) void refetchUser();
      } else if (status === 403 || status === 404) resetExpired(body?.message);
      else setMessage(body?.message ?? 'Could not hold these seats. Please try again.');
    }
  };

  const handleOrder = async (values: CheckoutValues) => {
    if (!hold || !isLiveHold(hold) || orderMutation.isPending ||
      choices.length !== hold.seats.length ||
      !choices.every((choice) => hold.seats.some((seat) => seat.seatId === choice.seatId && seat.ticketType.slug === choice.ticketType))) return;
    if (bookingStartedAt === null || !options.data ||
      bookingSecondsUntil(bookingStartedAt, options.data.holdMinutes, hold.expiresAt) === 0) {
      resetExpired('Your booking time expired. Please re-select your seats.');
      return;
    }
    setCheckoutError(null);
    try {
      const paid = await orderMutation.mutateAsync({ id: hold.holdId, values });
      forgetHold();
      if (bookingWindowKey) sessionStorage.removeItem(bookingWindowKey);
      setOrder(paid);
      invalidateBooking();
    } catch (error) {
      const status = axios.isAxiosError<BookingApiError>(error) ? error.response?.status : undefined;
      const body = axios.isAxiosError<BookingApiError>(error) ? error.response?.data : undefined;
      if (status === 409 && body) recoverConflict(body);
      else if (status === 422 && !body?.errors && body?.message?.toLowerCase().includes('expir')) resetExpired(body.message);
      else if (status === 422 && !body?.errors) setCheckoutError({ message: body?.message ?? 'Could not complete the order.' });
      else if (status === 403 || status === 404) resetExpired(body?.message ?? 'This hold is no longer available.');
      else setCheckoutError(body ?? { message: 'Payment could not be completed. Please try again.' });
    }
  };

  const maxSeats = options.data?.maxSeatsPerOrder ?? 3;
  const rating = session.data?.movie.ageRating;
  const minAge = options.data?.ageRatings.find((option) => option.code === rating?.code)?.minAge ?? rating?.minAge;
  const ticketTypes = options.data
    ? availableTicketTypes(options.data, minAge)
    : [];
  const started = hasSessionStarted(session.data?.startsAt, now);
  const estimatedSubtotal = choices.reduce((sum, choice) => {
    const ratio = ticketTypes.find((type) => type.slug === choice.ticketType)?.priceRatio ?? 1;
    return sum + (session.data?.price ?? 0) * ratio;
  }, 0);
  const holdMatchesChoices = Boolean(hold && choices.length === hold.seats.length && choices.every((choice) =>
    hold.seats.some((seat) => seat.seatId === choice.seatId && seat.ticketType.slug === choice.ticketType)));
  const subtotal = holdMatchesChoices ? hold!.subtotal : estimatedSubtotal;
  const bookingSeconds = bookingStartedAt !== null && options.data
    ? bookingSecondsUntil(bookingStartedAt, options.data.holdMinutes, hold?.expiresAt ?? null, now)
    : null;
  const countdown = bookingSeconds === null
    ? '--:--'
    : `${Math.floor(bookingSeconds / 60)}:${String(bookingSeconds % 60).padStart(2, '0')}`;

  const toggleSeat = (seat: Seat) => {
    setMessage(null);
    setChoices((current) => {
      const result = toggleSeatChoice(current, seat, maxSeats);
      if (result.limitReached) queueMicrotask(() => setMessage(`You can select up to ${maxSeats} seats.`));
      return result.choices;
    });
  };

  const confirmed = order ? confirmationDetails(order) : null;
  const content = confirmed ? (
    <div className="mx-auto flex max-w-[680px] flex-col items-center py-6 text-center text-white">
      <span aria-hidden="true" className="flex size-14 items-center justify-center rounded-full bg-[#43D983] text-3xl">✓</span>
      <h2 className="mt-4 text-2xl font-bold">Booking confirmed!</h2>
      <p className="mt-2 max-w-[380px] text-sm text-[#A9A9A9]">Your tickets are ready. We have sent the confirmation to your email.</p>
      <p className="mt-4 rounded-full bg-[#292B3D] px-8 py-2 text-xs font-bold">ORDER #{confirmed.reference}</p>
      <div className="mt-5 w-full rounded-xl bg-[#1E2031] p-5 text-left text-sm">
        <h3 className="font-bold uppercase">{confirmed.title}</h3>
        <p className="mt-1 text-[#A9A9A9]">{confirmed.venue} · Hall {confirmed.hall} · {confirmed.date} · {confirmed.time}</p>
        <div className="mt-5 flex justify-between border-t border-white/10 pt-3"><span className="text-[#A9A9A9]">Seats</span><span>{confirmed.seatCodes.join(', ')}</span></div>
        <div className="mt-3 flex justify-between"><span className="text-[#A9A9A9]">Tickets</span><span>{confirmed.ticketNames.join(', ')}</span></div>
        <div className="mt-4 flex justify-between border-t border-white/10 pt-3 font-bold"><span>Total paid</span><span>{money(confirmed.totalPrice)}</span></div>
      </div>
      <div className="mt-6 flex flex-wrap justify-center gap-3">
        <button className={buttonClass} onClick={() => router.replace('/account?tab=tickets')}>View my tickets</button>
        <button className="rounded-full bg-[#292B3D] px-5 py-3 text-sm font-bold" onClick={() => router.replace('/')}>Back to home</button>
      </div>
    </div>
  ) : (
    <>
      <header className="flex min-w-0 items-start justify-between gap-4 pr-10 text-white">
        <div className="min-w-0">
          <h1 className="text-xl font-extrabold uppercase">{session.data?.movie.title ?? 'Booking'}</h1>
          {session.data && <p className="mt-1 text-xs text-[#A9A9A9]">{session.data.venue.name} · Hall {session.data.hall.name} · {session.data.date} · {session.data.time} · {session.data.format.name} · {session.data.language.name}</p>}
        </div>
        <p aria-label="Booking time remaining" className="shrink-0 rounded-xl bg-[#1E2031] px-3 py-2 text-center text-xs text-white">
          <span className="block text-[#A9A9A9]">BOOKING TIME</span>
          <strong className="text-sm">{countdown}</strong>
          {!hold && <span className="block text-[10px] text-[#A9A9A9]">seats held at checkout</span>}
        </p>
      </header>
      {message && <p role="alert" className="mt-5 rounded-xl border border-[#EC3013]/50 bg-[#EC3013]/10 px-4 py-3 text-sm text-white">{message}</p>}
      {session.isPending || options.isPending || (storedId && holdQuery.isPending && !hold) ? <p role="status" className="mt-10 text-[#A9A9A9]">Loading booking…</p>
        : session.isError || options.isError ? <p role="alert" className="mt-10 text-white">Could not load booking details. <button className="text-[#EC3013]" onClick={() => { void session.refetch(); void options.refetch(); }}>Try again</button></p>
        : expectedMovieSlug && session.data?.movie.slug !== expectedMovieSlug ? <p role="alert" className="mt-10 text-white">This session does not belong to this movie.</p>
        : started && !hold ? <p role="alert" className="mt-10 text-white">This session has already started. Choose a later showtime.</p>
        : !user?.profileComplete ? <p role="alert" className="mt-10 text-white">Complete your profile before booking.</p>
        : !isOldEnough(user.age, minAge) ? <p role="alert" className="mt-10 text-white">This movie is available for ages {minAge} and up.</p>
        : <div className="mt-8 grid min-w-0 gap-5 lg:grid-cols-[minmax(0,2fr)_minmax(280px,1fr)]">
          <div className="min-w-0 lg:border-r lg:border-white/10 lg:pr-5">
            <div className="flex rounded-full bg-[#1E2031] text-center text-xs font-bold text-white">
              <button type="button" onClick={() => setStep('seats')} className={`w-1/2 rounded-full py-2 ${step === 'seats' ? 'bg-[#EC3013]' : ''}`}>SEATS</button>
              <button type="button" disabled={!holdMatchesChoices} onClick={() => setStep('checkout')} className={`w-1/2 rounded-full py-2 disabled:cursor-not-allowed ${step === 'checkout' ? 'bg-[#EC3013]' : ''}`}>CHECKOUT</button>
            </div>
            {step === 'seats' ? seatMap.isPending ? <p role="status" className="mt-8 text-[#A9A9A9]">Loading seats…</p>
              : seatMap.isError ? <p role="alert" className="mt-8 text-white">Could not load the seat map. <button className="text-[#EC3013]" onClick={() => void seatMap.refetch()}>Try again</button></p>
               : seatMap.data ? <SeatMapPicker map={seatMap.data} choices={choices} contested={contested} pending={holdMutation.isPending} onToggleSeat={toggleSeat} /> : null
              : <div className="mt-5"><CheckoutForm key={hold?.holdId} user={user} pending={orderMutation.isPending} error={checkoutError} onSubmit={handleOrder} /></div>}
          </div>
          <aside className="flex min-h-[400px] flex-col text-white">
            <h2 className="text-sm font-bold">{step === 'seats' ? `Your seats · Max ${maxSeats}` : 'Summary'}</h2>
            {choices.length ? <div className="mt-3 space-y-3">{choices.map((choice) => {
              const price = holdMatchesChoices ? hold?.seats.find((seat) => seat.seatId === choice.seatId)?.price : (session.data?.price ?? 0) * (ticketTypes.find((type) => type.slug === choice.ticketType)?.priceRatio ?? 1);
              return <div key={choice.seatId} className="rounded-xl bg-[#1E2031] p-3 text-xs">
                <div className="flex justify-between gap-2"><span>Seat <strong className="ml-2">{choice.code}</strong></span><span>{money(price ?? 0)} {step === 'seats' && <button type="button" aria-label={`Remove seat ${choice.code}`} onClick={() => toggleSeat({ id: choice.seatId, code: choice.code } as Seat)} className="ml-2 text-[#A9A9A9]">×</button>}</span></div>
                {step === 'seats' && <div className="mt-3 flex flex-wrap gap-1 border-t border-white/10 pt-3">{ticketTypes.map((type) => <button key={type.slug} type="button" onClick={() => setChoices((current) => current.map((seat) => seat.seatId === choice.seatId ? { ...seat, ticketType: type.slug } : seat))} className={`rounded-full px-2 py-1 ${choice.ticketType === type.slug ? 'bg-[#EC3013]' : 'bg-[#292B3D]'}`}>{type.name}{type.priceRatio !== 1 ? ` ${Math.round(type.priceRatio * 100)}%` : ''}</button>)}</div>}
                {step === 'checkout' && <p className="mt-2 text-[#A9A9A9]">{ticketTypes.find((type) => type.slug === choice.ticketType)?.name ?? choice.ticketType}</p>}
              </div>;
            })}</div> : <p className="mt-3 text-xs text-[#A9A9A9]">Pick up to {maxSeats} seats from the map. Each seat can carry its own ticket type.</p>}
            <div className="mt-auto pt-6"><div className="mb-4 flex items-center justify-between text-sm font-bold"><span>SUBTOTAL</span><span className="text-2xl">{money(subtotal)}</span></div>
              {step === 'seats' ? <button type="button" disabled={!choices.length || holdMutation.isPending || bookingSeconds === null || bookingSeconds === 0} onClick={() => void handleHold()} className={`${buttonClass} w-full`}>{holdMutation.isPending ? 'Holding seats…' : 'Next: Checkout'}</button>
                : <button type="submit" form="booking-checkout" disabled={orderMutation.isPending || !hold || !isLiveHold(hold) || bookingSeconds === null || bookingSeconds === 0} className={`${buttonClass} w-full`}>{orderMutation.isPending ? 'Completing order…' : 'Pay: Complete order'}</button>}
            </div>
          </aside>
        </div>}
    </>
  );

  return <PopupWrapper size="booking" label={`Book tickets for ${session.data?.movie.title ?? 'movie'}`} onClose={handleExit}>{content}</PopupWrapper>;
}
