'use client';

import BookingFlow from './BookingFlow';

interface BookingModalProps {
  sessionId: string;
  movieSlug: string;
  onClose: () => void;
}

export default function BookingModal({ sessionId, movieSlug, onClose }: BookingModalProps) {
  return <BookingFlow sessionId={sessionId} expectedMovieSlug={movieSlug} onExit={onClose} />;
}
