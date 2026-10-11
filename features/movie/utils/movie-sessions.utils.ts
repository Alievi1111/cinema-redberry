import type { MovieDetailsType, MovieSessionType } from '../types/movie.types';

export interface BookingUser {
  age: number | null;
  profileComplete: boolean;
}

export const groupSessionsByHall = (sessions: MovieSessionType[]) => {
  const halls = new Map<
    number,
    {
      name: string;
      sessions: MovieSessionType[];
    }
  >();

  sessions.forEach((session) => {
    const hallId = session.hall.id;
    const existing = halls.get(hallId);

    if (existing) {
      existing.sessions.push(session);
      return;
    }

    halls.set(hallId, {
      name: session.hall.name,
      sessions: [session],
    });
  });

  return Array.from(halls, ([id, hall]) => ({
    id,
    ...hall,
  }));
};

export const getSessionDisabledReason = (
  session: MovieSessionType,
  ageRating: MovieDetailsType['ageRating'],
  user: BookingUser | null | undefined
): string | null => {
  if (session.isSoldOut || session.seatsLeft <= 0) {
    return 'This session is sold out.';
  }

  if (!user) return null;

  // Incomplete profiles can open the seat page, where the profile form appears.
  if (!user.profileComplete) return null;

  if (ageRating && (user.age === null || user.age < ageRating.minAge)) {
    return `This movie requires viewers to be at least ${ageRating.minAge} years old.`;
  }

  return null;
};
