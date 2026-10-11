import type {
  MovieDetailsType,
  MovieSessionType,
  MovieVenueSessions as MovieVenueGroup,
} from '../../types/movie.types';

import {
  groupSessionsByHall,
  getSessionDisabledReason,
  type BookingUser,
} from '../../utils/movie-sessions.utils';

import { Ticket } from './Ticket';

interface MovieVenueSessionsProps {
  venues: MovieVenueGroup[];
  ageRating: MovieDetailsType['ageRating'];
  user: BookingUser | null | undefined;
  now: number;
  onSelect: (session: MovieSessionType) => void;
}

const MovieVenueSessions = ({
  venues,
  ageRating,
  user,
  now,
  onSelect,
}: MovieVenueSessionsProps) => {
  return (
    <div className="flex flex-col gap-[20px]">
      {venues.map((venueGroup) => (
        <div key={venueGroup.venue.id}>
          <h3 className="mb-[12px] font-semibold text-[14px] text-white leading-none">
            {venueGroup.venue.name}
          </h3>

          <div className="flex gap-[10px] pb-[5px] overflow-x-auto">
            {groupSessionsByHall(venueGroup.sessions).map((hall) => (
              <div
                key={hall.id}
                className="bg-[#1E2031] p-[15px] rounded-[18px] w-[454px] max-w-full shrink-0"
              >
                <p className="mb-[9px] font-semibold text-[12px] text-white leading-none">
                  Hall {hall.name}
                </p>

                <div className="flex flex-wrap gap-[10px]">
                  {hall.sessions.map((session) => (
                    <Ticket
                      key={session.id}
                      session={session}
                      disabledReason={getSessionDisabledReason(
                        session,
                        ageRating,
                        user,
                        now
                      )}
                      onSelect={onSelect}
                    />
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default MovieVenueSessions;
